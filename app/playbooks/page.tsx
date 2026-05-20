import { readFileSync } from 'fs'
import Link from 'next/link'

type Playbook = {
  slug: string
  name: string
  description: string
  implementation_status: string
  checks: string[]
}

export default function PlaybooksIndex() {
  const raw = readFileSync('/tmp/swarm-output/playbooks/playbook-registry.json', 'utf-8')
  const playbooks: Playbook[] = JSON.parse(raw)

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">playbooks</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Pay-Practice Playbooks</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        16 healthcare pay-practice playbooks used by the BL-EDA Engine. Each playbook contains
        deterministic checks, thresholds, variables, and scenarios.
      </p>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {playbooks.map((pb) => (
          <article key={pb.slug} className="rounded-lg border border-line bg-card p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold">{pb.name}</h2>
              <span
                className={`font-mono text-[10px] uppercase tracking-widest ${
                  pb.implementation_status === 'fully_implemented'
                    ? 'text-status-completed'
                    : 'text-status-partial'
                }`}
              >
                {pb.implementation_status === 'fully_implemented' ? 'Implemented' : 'Stub'}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted leading-relaxed">{pb.description}</p>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <span className="font-mono text-xs text-muted">{pb.checks.length} checks</span>
              <Link
                className="font-mono text-xs text-brand hover:underline"
                href={`/playbooks/${pb.slug}`}
              >
                View
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
