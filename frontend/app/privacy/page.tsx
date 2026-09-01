export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <a href="/" className="block text-sm text-ink-soft dark:text-ink-deep mb-4">← Back to home</a>

      <h1 className="font-display text-3xl text-ink-deep dark:text-ink-soft mb-2">Privacy Policy</h1>
      <p className="text-sm text-ink-soft dark:text-ink-deep mb-6">Last updated: September 2026</p>

      <div className="prose lg:prose-lg dark:prose-invert font-body text-ink-soft dark:text-ink-deep space-y-6">
        <div>
          <p className="text-base leading-relaxed">
            At TruePath, we are committed to protecting your privacy and maintaining transparency about how we collect,
            use, and protect your personal information. This Privacy Policy outlines our data practices and your rights.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
          <p>
            When you create an account on TruePath, we collect the following information:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>Authentication Data:</strong> Email address and securely hashed password via Supabase Auth</li>
            <li><strong>Profile Information:</strong> Display name and optional profile picture</li>
            <li><strong>Learning Progress:</strong> Records of completed resources, stages, and specialization progress to ensure continuity in your learning journey</li>
            <li><strong>Usage Data:</strong> Timestamped records of when you access and interact with the platform</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold mt-8 mb-3">2. Information We Do NOT Collect</h2>
          <p>We maintain strict principles around data minimization:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>We do not sell, rent, or share your personal data with third parties for marketing purposes</li>
            <li>We do not track your activity across external websites or services</li>
            <li>We do not display advertisements or use behavioral tracking for ad targeting</li>
            <li>We do not collect payment information (billing is handled by third-party processors if applicable)</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold mt-8 mb-3">3. Third-Party Service Providers</h2>
          <p>
            TruePath relies on trusted infrastructure partners to operate securely:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Supabase:</strong> Provides database storage and authentication services. Review their{' '}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-route hover:underline">privacy policy</a>.
            </li>
            <li>
              <strong>Vercel:</strong> Hosts our application and infrastructure. Review their{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-route hover:underline">privacy policy</a>.
            </li>
          </ul>
          <p className="mt-3">
            We have data processing agreements with all third parties and ensure they meet industry-standard security requirements.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold mt-8 mb-3">4. Data Security</h2>
          <p>
            Your data is protected through encryption in transit (TLS/SSL) and at rest. Access to personal information is
            restricted to authorized personnel only. We regularly review and update our security practices to defend against
            evolving threats.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold mt-8 mb-3">5. Your Rights & Data Deletion</h2>
          <p>
            You have the right to access, correct, or delete your personal data at any time. To request account deletion or
            data removal, please contact us via our{' '}
            <a href="/contact" className="text-route hover:underline">Contact page</a> or reach out to our team on our community Discord.
            We will process deletion requests within 30 days.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold mt-8 mb-3">6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.
            Significant changes will be communicated to you via email or a prominent notice on the platform. Continued use
            of TruePath following policy changes constitutes acceptance of the updated policy.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold mt-8 mb-3">7. Contact Us</h2>
          <p>
            If you have questions about our privacy practices or wish to exercise your data rights, please visit our{' '}
            <a href="/contact" className="text-route hover:underline">Contact page</a> or connect with us on Discord.
          </p>
        </div>
      </div>
    </main>
  );
}
