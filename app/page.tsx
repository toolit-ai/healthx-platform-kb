import Link from 'next/link'

const sections = [
  {
    title: 'Architecture',
    description:
      'The 14-chapter spec: target architecture, graphs, state, document intelligence, BL-EDA engine, reports, data contracts, security & governance.',
    href: '/architecture',
    status: 'phase-8',
  },
  {
    title: 'AAA Harness',
    description:
      'One YAML controls model pins, parallelism caps, gate behavior, deploy targets — overridable at run-level and per-node.',
    href: '/harness',
    status: 'phase-1',
  },
  {
    title: 'Agent Reference',
    description:
      'Auto-generated catalog of all 33 agents and 30+ schemas, mirroring the engine package in the companion app repo.',
    href: '/reference/agents',
    status: 'phase-8',
  },
  {
    title: 'Pay-Practice Playbooks',
    description:
      '17 in-scope healthcare pay practices: Overtime, Consecutive Days, Punch Exceptions, Break Exceptions, Holiday Pay, Shift Differentials, and more.',
    href: '/playbooks',
    status: 'phase-6',
  },
] as const

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">healthx · platform kb · v0.0.1</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">HealthX Agentic Knowledge Base</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Architecture, agent catalog, AAA harness reference, and operational guides for the HealthX healthcare workforce
        agentic platform — a complete TypeScript rewrite of the original Python BSMH Agentic System, running entirely in
        the browser.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          className="rounded-md border border-brand bg-brand px-4 py-2 text-sm font-medium text-brand-foreground"
          href="https://toolit-ai.github.io/healthx-web-app/"
        >
          Open the live app →
        </a>
        <a
          className="rounded-md border border-line px-4 py-2 text-sm font-medium text-fg"
          href="https://github.com/toolit-ai/healthx-platform-kb"
        >
          GitHub
        </a>
      </div>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <article key={s.title} className="rounded-lg border border-line bg-card p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{s.status}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{s.description}</p>
            <Link className="mt-4 inline-block font-mono text-xs text-brand hover:underline" href={s.href}>
              View →
            </Link>
          </article>
        ))}
      </section>

      <footer className="mt-20 border-t border-line pt-6 text-xs text-muted">
        Phase 0 — bootstrap. Vercel-style MDX/Nextra integration and the full 14-chapter port land in Phase 8. The
        Python reference at <code className="font-mono">bsmh-agentic-system/</code> remains the source of truth until
        each chapter is migrated.
      </footer>
    </main>
  )
}
