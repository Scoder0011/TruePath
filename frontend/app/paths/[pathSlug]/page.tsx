import { getPath } from "@/lib/api/client";
import { pathToTree } from "@/lib/types/path-tree";
import CanvasTree from "@/components/path-tree/CanvasTree";

export const dynamic = "force-dynamic";

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
      <h1 className="mt-2 font-display text-3xl font-bold text-white">{path.name}</h1>
      {path.description && (
        <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-ink-soft">{path.description}</p>
      )}

      <div className="mt-8">
        <CanvasTree root={tree} />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-white">Path details</h2>
        <div className="mt-6 space-y-8">
          {path.subPaths.map((subPath) => (
            <article key={subPath.id} className="border-l border-route pl-5">
              <h3 className="font-display text-xl font-medium text-route">{subPath.name}</h3>
              {subPath.description && (
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">{subPath.description}</p>
              )}
              <div className="mt-5 space-y-5">
                {subPath.stages.map((stage) => (
                  <section key={stage.id}>
                    <h4 className="font-body text-base font-medium text-white">{stage.name}</h4>
                    <ul className="mt-2 space-y-2">
                      {stage.resources.map((resource) => (
                        <li key={resource.id}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-body text-sm text-ink-soft transition-colors hover:text-route"
                          >
                            {resource.name}
                            {resource.type ? ` · ${resource.type}` : ""} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
