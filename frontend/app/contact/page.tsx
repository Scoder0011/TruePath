export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <a href="/" className="block text-sm text-ink-soft dark:text-ink-deep mb-4">← Back to home</a>

      <h1 className="font-display text-3xl text-ink-deep dark:text-ink-soft mb-6">Contact</h1>

      <div className="font-body text-ink-soft dark:text-ink-deep">
        <p className="text-lg mb-4">Have a question, suggestion, or want to contribute content to a path?</p>

        <a
          href="https://discord.gg/pVkpAZSN"
          className="inline-block bg-amber text-ink-deep dark:text-ink-deep font-medium px-4 py-2 rounded"
          rel="noopener noreferrer"
        >
          Join our Discord
        </a>

        <p className="mt-6 text-sm text-ink-soft dark:text-ink-deep">We're a small team — we read every message.</p>
      </div>
    </main>
  );
}
