export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <a href="/" className="block text-sm text-ink-soft dark:text-ink-deep mb-4">← Back to home</a>

      <h1 className="font-display text-3xl text-ink-deep dark:text-ink-soft mb-6">About TruePath</h1>

      <div className="prose lg:prose-lg dark:prose-invert font-body text-ink-soft dark:text-ink-deep">
        <p>
          TruePath started when someone in a cybersecurity Discord community asked how to get started in security and
          got no real answers — just random, disconnected advice. The next day, this project was assigned as a
          research problem. It was already validated: the problem of self-directed learners lacking structure,
          mentorship, and clear guidance appears in Razorpay's Top 10,000 Problems of India initiative, ranked in the
          Top 10 with a score of 88/100.
        </p>

        <h2 className="mt-8">Mission</h2>
        <p>
          TruePath maps out real career paths as staged roadmaps — free resources, the right order, and exactly what
          each path leads to. No guesswork, no dead ends.
        </p>

        <h2 className="mt-8">Team</h2>
        <p>Built by a team of engineering students as a research project with real-world impact in mind.</p>
      </div>
    </main>
  );
}
