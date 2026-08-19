"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { TreeNode } from "@/lib/types/path-tree";

const COLUMN_WIDTH = 260;
const ROW_HEIGHT = 56;
const NODE_WIDTH = 200;
const NODE_HEIGHT = 44;

type Position = { x: number; y: number };
type Edge = { x1: number; y1: number; x2: number; y2: number };

const kindColor: Record<TreeNode["kind"], string> = {
  path: "border-amber text-amber",
  specialization: "border-route text-route",
  stage: "border-white/20 text-white",
  topic: "border-white/10 text-ink-soft",
  resource: "border-white/5 text-ink-soft",
};

// Recursively computes {x, y} for every visible node (respecting which
// nodes are expanded) and the connector lines between parent and child.
// Standard tidy-tree layout — gives the OSINT-Framework "branches fan
// out and re-converge" look instead of a flat indented list.
function layout(
  node: TreeNode,
  depth: number,
  expanded: Set<string>,
  rowCounter: { n: number },
  positions: Map<string, Position>,
  edges: Edge[]
): Position {
  const hasChildren = !!node.children?.length;
  const isOpen = expanded.has(node.id);

  const childPositions: Position[] = [];
  if (hasChildren && isOpen) {
    for (const child of node.children!) {
      childPositions.push(layout(child, depth + 1, expanded, rowCounter, positions, edges));
    }
  }

  const y =
    childPositions.length > 0
      ? childPositions.reduce((sum, p) => sum + p.y, 0) / childPositions.length
      : rowCounter.n++ * ROW_HEIGHT;

  const pos: Position = { x: depth * COLUMN_WIDTH, y };
  positions.set(node.id, pos);

  for (const cp of childPositions) {
    edges.push({
      x1: pos.x + NODE_WIDTH,
      y1: pos.y + NODE_HEIGHT / 2,
      x2: cp.x,
      y2: cp.y + NODE_HEIGHT / 2,
    });
  }

  return pos;
}

// Finds every node whose label matches the query, and returns the set of
// all their ancestor ids — so those branches can be force-expanded even
// if the user never manually clicked into them.
function findMatchesAndAncestors(
  node: TreeNode,
  query: string,
  ancestors: string[],
  matchIds: Set<string>,
  ancestorIds: Set<string>
) {
  const isMatch = query.length > 0 && node.label.toLowerCase().includes(query.toLowerCase());
  if (isMatch) {
    matchIds.add(node.id);
    ancestors.forEach((id) => ancestorIds.add(id));
  }
  if (node.children) {
    for (const child of node.children) {
      findMatchesAndAncestors(child, query, [...ancestors, node.id], matchIds, ancestorIds);
    }
  }
}

export default function CanvasTree({
  root,
  searchQuery = "",
  onNodeHover,
}: {
  root: TreeNode;
  searchQuery?: string;
  onNodeHover?: (node: TreeNode | null) => void;
}) {
  // Path node starts expanded so the first column of sub-paths is
  // visible immediately; everything deeper starts collapsed.
  const [expanded, setExpanded] = useState<Set<string>>(new Set([root.id]));
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [zoom, setZoom] = useState(1);
  const dragState = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

  const { matchIds, ancestorIds } = useMemo(() => {
    const matchIds = new Set<string>();
    const ancestorIds = new Set<string>();
    findMatchesAndAncestors(root, searchQuery, [], matchIds, ancestorIds);
    return { matchIds, ancestorIds };
  }, [root, searchQuery]);

  // Search results auto-expand their ancestor chain on top of whatever
  // the user has manually toggled, so a match is always reachable
  // without hand-clicking through every branch.
  const effectiveExpanded = useMemo(() => {
    if (!searchQuery) return expanded;
    return new Set([...expanded, ...ancestorIds]);
  }, [expanded, ancestorIds, searchQuery]);

  const { positions, edges } = useMemo(() => {
    const positions = new Map<string, Position>();
    const edges: Edge[] = [];
    layout(root, 0, effectiveExpanded, { n: 0 }, positions, edges);
    return { positions, edges };
  }, [root, effectiveExpanded]);

  const toggle = useCallback((node: TreeNode) => {
    if (!node.children?.length) return; // resource nodes have no toggle
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(node.id) ? next.delete(node.id) : next.add(node.id);
      return next;
    });
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setPan({ x: dragState.current.panX + dx, y: dragState.current.panY + dy });
  };

  const onPointerUp = () => {
    dragState.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(1.6, Math.max(0.5, z - e.deltaY * 0.001)));
  };

  const nodes = useMemo(() => flattenVisible(root, effectiveExpanded), [root, effectiveExpanded]);

  const contentBounds = useMemo(() => {
    let maxX = 0;
    let maxY = 0;
    positions.forEach((p) => {
      maxX = Math.max(maxX, p.x + NODE_WIDTH);
      maxY = Math.max(maxY, p.y + NODE_HEIGHT);
    });
    return { width: maxX + 80, height: maxY + 80 };
  }, [positions]);

  return (
    <div className="relative h-full w-full overflow-hidden border border-white/10 bg-ink-deep/60 backdrop-blur-xl">
      {/* Zoom controls */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
        <button
          onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
          className="h-8 w-8 rounded-lg font-mono text-sm text-white hover:bg-white/10"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
          className="h-8 w-8 rounded-lg font-mono text-sm text-white hover:bg-white/10"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 40, y: 40 });
          }}
          className="h-8 w-8 rounded-lg font-mono text-[10px] text-white hover:bg-white/10"
          aria-label="Reset view"
        >
          ⟲
        </button>
      </div>

      <p className="pointer-events-none absolute bottom-4 left-4 z-10 font-mono text-xs text-ink-soft">
        DRAG TO PAN · SCROLL TO ZOOM · CLICK A NODE TO EXPAND
      </p>

      {/* Draggable/zoomable surface */}
      <div
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        <div
          className="relative origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            width: contentBounds.width,
            height: contentBounds.height,
          }}
        >
          <svg
            className="pointer-events-none absolute left-0 top-0"
            width={contentBounds.width}
            height={contentBounds.height}
          >
            {edges.map((edge, i) => (
              <path
                key={i}
                d={`M ${edge.x1} ${edge.y1} C ${edge.x1 + 60} ${edge.y1}, ${edge.x2 - 60} ${edge.y2}, ${edge.x2} ${edge.y2}`}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={1.5}
                fill="none"
              />
            ))}
          </svg>

          {nodes.map((node) => {
            const pos = positions.get(node.id)!;
            const isLeaf = !node.children?.length;
            const isOpen = effectiveExpanded.has(node.id);
            const isMatch = matchIds.has(node.id);
            return (
              <div
                key={node.id}
                className="absolute"
                style={{ left: pos.x, top: pos.y, width: NODE_WIDTH }}
              >
                {isLeaf && node.url ? (
                  <a
                    href={node.url}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => onNodeHover?.(node)}
                    onMouseLeave={() => onNodeHover?.(null)}
                    className={`flex h-11 items-center justify-between rounded-lg border bg-white/5 px-3 font-body text-sm text-white backdrop-blur-md transition-colors hover:border-route ${kindColor[node.kind]} ${
                      isMatch ? "ring-2 ring-amber" : ""
                    }`}
                  >
                    <span className="truncate">{node.label}</span>
                    <span className="ml-2 shrink-0 font-mono text-[10px] text-route">↗</span>
                  </a>
                ) : (
                  <button
                    onClick={() => toggle(node)}
                    onMouseEnter={() => onNodeHover?.(node)}
                    onMouseLeave={() => onNodeHover?.(null)}
                    className={`flex h-11 w-full items-center justify-between rounded-lg border bg-white/5 px-3 text-left font-body text-sm text-white backdrop-blur-md transition-colors hover:border-amber ${kindColor[node.kind]} ${
                      isMatch ? "ring-2 ring-amber" : ""
                    }`}
                  >
                    <span className="truncate">{node.label}</span>
                    {!isLeaf && (
                      <span className="ml-2 shrink-0 font-mono text-xs text-ink-soft">
                        {isOpen ? "−" : "+"}
                      </span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function flattenVisible(node: TreeNode, expanded: Set<string>): TreeNode[] {
  const out: TreeNode[] = [node];
  if (node.children?.length && expanded.has(node.id)) {
    for (const child of node.children) {
      out.push(...flattenVisible(child, expanded));
    }
  }
  return out;
}
