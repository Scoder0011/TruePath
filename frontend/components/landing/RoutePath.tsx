const waypoints = [
  { label: "WHAT", question: "What is this path actually about?" },
  { label: "PREREQS", question: "What do I need to know before I start?" },
  { label: "ROADMAP", question: "What do I study, in what order, from where?" },
  { label: "OUTCOME", question: "What can I become after this?" },
];

export default function RoutePath() {
  return (
    <ol
      className="flex flex-col items-center gap-5 sm:gap-6"
      aria-label="What each TruePath roadmap answers"
    >
      <div className="flex w-full max-w-xl items-end justify-center gap-4 sm:gap-6">
        {waypoints.map((waypoint, index) => {
          const isCenter = index === 1;
          const offset = index === 0 || index === 2 ? "translate-y-4" : "";

          return (
            <li
              key={waypoint.label}
              className={[
                "w-full max-w-[180px] rounded-xl border border-zinc-200 bg-zinc-100 p-4 shadow-sm backdrop-blur-md transition-transform dark:border-white/10 dark:bg-white/5",
                isCenter ? "-translate-y-2" : offset,
              ].join(" ")}
            >
              <p className="font-mono text-[10px] tracking-[0.18em] text-zinc-700 dark:text-zinc-200">
                {waypoint.label}
              </p>
              <p className="mt-3 font-display text-sm font-medium leading-snug text-zinc-900 dark:text-white">
                {waypoint.question}
              </p>
            </li>
          );
        })}
      </div>
    </ol>
  );
}
