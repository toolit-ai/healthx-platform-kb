import Link from 'next/link'

const sections = [
  {
    title: 'Architecture',
    description:
      'The 14-chapter spec: target architecture, graphs, state, document intelligence, BL-EDA engine, reports, data contracts, security and governance.',
    href: '/architecture',
  },
  {
    title: 'AAA Harness',
    description:
      'One YAML controls model pins, parallelism caps, gate behavior, deploy targets — overridable at run-level and per-node.',
    href: '/harness',
  },
  {
    title: 'Agent Reference',
    description:
      'Auto-generated catalog of all graph nodes and agents across the platform.',
    href: '/reference/agents',
  },
  {
    title: 'Schema Registry',
    description:
      'Data models and type definitions used across the platform: state, events, findings, documents, DQ, and more.',
    href: '/reference/schemas',
  },
  {
    title: 'Pay-Practice Playbooks',
    description:
      '16 in-scope healthcare pay practices: Overtime, Consecutive Days, Punch Exceptions, Break Exceptions, Holiday Pay, Shift Differentials, and more.',
    href: '/playbooks',
  },
]

const phases = Array.from({ length: 9 }, (_, i) => i)

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        healthx · platform kb · v1.0.0
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        HealthX Agentic Knowledge Base
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Architecture, agent catalog, AAA harness reference, and operational guides for the HealthX
        healthcare workforce agentic platform.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          className="rounded-md border border-brand bg-brand px-4 py-2 text-sm font-medium text-brand-foreground"
          href="https://toolit-ai.github.io/healthx-web-app/"
        >
          Open the live app
        </a>
        <a
          className="rounded-md border border-line px-4 py-2 text-sm font-medium text-fg"
          href="https://github.com/toolit-ai/healthx-platform-kb"
        >
          GitHub
        </a>
      </div>

      <section className="mt-14">
        <h2 className="text-xl font-semibold">Phase Status</h2>
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
          {phases.map((p) => (
            <div
              key={p}
              className="rounded-lg border border-line bg-card p-3 flex items-center justify-between gap-2"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Phase {p}
              </span>
              <span className="text-xs font-medium text-status-completed">Complete</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <article key={s.title} className="rounded-lg border border-line bg-card p-5">
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">{s.description}</p>
            <Link
              className="mt-4 inline-block font-mono text-xs text-brand hover:underline"
              href={s.href}
            >
              View
            </Link>
          </article>
        ))}
      </section>
    </main>
  )
}
