export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <a href="/" className="block text-sm text-ink-soft dark:text-ink-deep mb-4">← Back to home</a>

      <h1 className="font-display text-3xl text-ink-deep dark:text-ink-soft mb-2">Privacy Policy</h1>
      <p className="text-sm text-ink-soft dark:text-ink-deep mb-6">Last updated: August 2026</p>

      <div className="prose lg:prose-lg dark:prose-invert font-body text-ink-soft dark:text-ink-deep">
        <h2>What we collect</h2>
        <p>
          When you create an account we collect your email address and password (via Supabase Auth). We also store
          progress data — which resources you've marked complete — to make your learning experience persistent.
        </p>

        <h2>What we don't collect</h2>
        <ul>
          <li>We don't sell your data.</li>
          <li>We don't track you across other sites.</li>
          <li>We don't show ads.</li>
        </ul>

        <h2>Third parties</h2>
        <p>
          We use Supabase for database and authentication and Vercel for hosting. Please review their privacy
          policies: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase</a> and{' '}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel</a>.
        </p>

        <h2>Data deletion</h2>
        <p>Email us to delete your account and all associated data.</p>
      </div>
    </main>
  );
}
