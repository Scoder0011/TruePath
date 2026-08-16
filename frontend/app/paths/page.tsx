import { getPath } from "@/lib/api/client";
import { pathToTree } from "@/lib/types/path-tree";
import CanvasTree from "@/components/path-tree/CanvasTree";

// app/paths/[pathSlug]/page.tsx is a Server Component — it runs on the
// server, fetches from the Express backend directly, and sends the tree
// data down as a plain prop. CanvasTree itself is "use client" because
// it needs pointer/drag events, which only work in the browser.
export default async function PathPage({
  params,
}: {
  params: { pathSlug: string };
}) {
  const path = await getPath(params.pathSlug);
  const tree = pathToTree(path);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-mono text-xs tracking-[0.15em] text-amber">PATH</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white">
        {path.name}
      </h1>
      {path.description && (
        <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-ink-soft">
          {path.description}
        </p>
      )}

      <div className="mt-8">
        <CanvasTree root={tree} />
      </div>
    </main>
  );
}
