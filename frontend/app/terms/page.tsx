export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <a href="/" className="block text-sm text-ink-soft dark:text-ink-deep mb-4">← Back to home</a>

      <h1 className="font-display text-3xl text-ink-deep dark:text-ink-soft mb-2">Terms of Service</h1>
      <p className="text-sm text-ink-soft dark:text-ink-deep mb-6">Last updated: August 2026</p>

      <div className="prose lg:prose-lg dark:prose-invert font-body text-ink-soft dark:text-ink-deep">
        <h2>Use at your own risk</h2>
        <p>Content is provided for educational purposes. We make no guarantees about job outcomes.</p>

        <h2>No warranty</h2>
        <p>The platform is provided as-is.</p>

        <h2>Acceptable use</h2>
        <p>Do not misuse the platform. Do not attempt to scrape or attack the service.</p>

        <h2>Changes</h2>
        <p>We may update these terms; continued use means acceptance.</p>

        <h2>Contact</h2>
        <p>
          If you have questions, please visit <a href="/contact">Contact</a>.
        </p>
      </div>
    </main>
  );
}
