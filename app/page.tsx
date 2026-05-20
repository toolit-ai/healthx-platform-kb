import Link from 'next/link'

const sections = [
  {
    title: 'Architecture',
    description:
      'The 14-chapter spec: target architecture, graphs, state, document intelligence, BL-EDA engine, reports, data contracts, security & governance.',
    href: '/architecture/',
    status: 'complete',
  },
  {
    title: 'AAA Harness',
    description:
      'One YAML controls model pins, parallelism caps, gate behavior, deploy targets — overridable at run-level and per-node.',
    href: '/harness/',
    status: 'complete',
  },
  {
    title: 'Agent Reference',
    description:
      'Auto-generated catalog of all agents and schemas, mirroring the engine package in the companion app repo.',
    href: '/reference/agents/',
    status: 'complete',
  },
  {
    title: 'Schema Reference',
    description:
      'Typed schema registry covering ValidationState, BLEDAFinding, ExtractedRule, DQIssue, and 20+ core contracts.',
    href: '/reference/schemas/',
    status: 'complete',
  },
  {
    title: 'Pay-Practice Playbooks',
    description:
      '16 in-scope healthcare pay practices: Overtime, Consecutive Days, Punch Exceptions, Break Exceptions, Holiday Pay, Shift Differentials, and more.',
    href: '/playbooks/',
    status: 'complete',
  },
] as const

const phases = [
  { name: 'Repository Bootstrap', done: true },
  { name: 'Runtime Shell', done: true },
  { name: 'Data Ingestion & DQ', done: true },
  { name: 'Document Intelligence', done: true },
  { name: 'Document-only RAG', done: true },
  { name: 'BL-EDA MVP', done: true },
  { name: 'Pay-Practice Deepening', done: true },
  { name: 'HTML Report Generation', done: true },
  { name: 'Hardening', done: true },
]

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">healthx · platform kb · v1.0.0</p>
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
          Open the live app
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
              View
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="text-sm font-semibold mb-3">Implementation Phases</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-9">
          {phases.map((phase, i) => (
            <div
              key={phase.name}
              className={`rounded-md border px-2 py-2 text-center text-xs ${
                phase.done
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-line bg-card text-muted'
              }`}
            >
              <p className="font-mono text-[10px] opacity-70">{i}</p>
              <p className="mt-0.5 font-medium leading-tight">{phase.name}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-20 border-t border-line pt-6 text-xs text-muted">
        v1.0.0 — Fully migrated architecture pack, agent catalog, harness reference, and playbook registry.
        Python reference at <code className="font-mono">bsmh-agentic-system/</code> remains the execution source of truth.
      </footer>
    </main>
  )
}
