const waypoints = [
  { label: "WHAT", question: "What is this path actually about?" },
  { label: "PREREQS", question: "What do I need to know before I start?" },
  { label: "ROADMAP", question: "What do I study, in what order, from where?" },
  { label: "OUTCOME", question: "What can I become after this?" },
];

export default function RoutePath() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2" aria-label="What each TruePath roadmap answers">
      {waypoints.map((waypoint, index) => (
        <li
          key={waypoint.label}
          className="rounded-xl border border-gray-200 bg-gray-100 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
        >
          <p className="font-mono text-xs tracking-[0.15em] text-amber">
            {String(index + 1).padStart(2, "0")} · {waypoint.label}
          </p>
          <p className="mt-3 font-display text-base font-medium leading-snug text-gray-900 dark:text-white">
            {waypoint.question}
          </p>
        </li>
      ))}
    </ol>
  );
}
