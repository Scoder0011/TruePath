type Waypoint = {
  label: string;
  status: "current" | "upcoming";
  question: string;
};

const waypoints: Waypoint[] = [
  { label: "WHAT", status: "current", question: "What is this path actually about?" },
  { label: "PREREQS", status: "upcoming", question: "What do I need to know first?" },
  { label: "ROADMAP", status: "upcoming", question: "What do I study, in order?" },
  { label: "OUTCOME", status: "upcoming", question: "What can I become?" },
];

// This is the landing page's signature element: the four questions
// TruePath answers for every career path, rendered literally as
// waypoints on a route — the same visual language used for the real
// stage/resource tree once a user opens a path. It's not decoration;
// it's the product's core idea shown before you've read a word of copy.
export default function RoutePath() {
  const stepHeight = 108;

  return (
    <div className="relative pl-10" aria-hidden="false">
      {/* the connecting line */}
      <svg
        className="absolute left-[7px] top-2"
        width="2"
        height={stepHeight * (waypoints.length - 1) + 16}
        viewBox={`0 0 2 ${stepHeight * (waypoints.length - 1) + 16}`}
        fill="none"
      >
        <line
          x1="1"
          y1="0"
          x2="1"
          y2={stepHeight * (waypoints.length - 1) + 16}
          stroke="#263042"
          strokeWidth="2"
          strokeDasharray="3 5"
        />
      </svg>

      <ol className="relative flex flex-col" style={{ gap: `${stepHeight - 56}px` }}>
        {waypoints.map((wp) => (
          <li key={wp.label} className="relative flex items-start gap-4">
            <span
              className={[
                "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                wp.status === "current"
                  ? "border-amber bg-amber shadow-[0_0_0_4px_rgba(232,163,61,0.15)]"
                  : "border-ink-line bg-ink",
              ].join(" ")}
            />
            <div>
              <p
                className={[
                  "font-mono text-xs tracking-[0.15em]",
                  wp.status === "current" ? "text-amber" : "text-ink-soft",
                ].join(" ")}
              >
                {wp.label}
              </p>
              <p className="mt-1 font-display text-lg font-medium text-white">
                {wp.question}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
