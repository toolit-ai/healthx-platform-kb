import { readFileSync } from 'fs'
import Link from 'next/link'

const yamlPath = '/Users/rishabharya/Desktop/bsmh-workspace/healthx-web-app/src/config/harness.default.yaml'

export default function HarnessPage() {
  const content = readFileSync(yamlPath, 'utf-8')

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">reference</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">AAA Harness</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        The harness YAML controls model pins, parallelism caps, gate behavior, deploy targets, and
        node-level overrides.
      </p>

      <section className="mt-10 space-y-8">
        <div className="rounded-lg border border-line bg-card p-0 overflow-hidden">
          <div className="border-b border-line px-4 py-2 text-xs font-mono uppercase tracking-widest text-muted">
            harness.default.yaml
          </div>
          <pre className="p-6 text-sm leading-loose whitespace-pre-wrap break-words overflow-x-auto">
            {content}
          </pre>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Schema Sections</h2>
          <dl className="space-y-4 text-sm">
            <div className="rounded-lg border border-line bg-card p-4">
              <dt className="font-semibold">arc</dt>
              <dd className="mt-1 text-muted">Phases, adapt-on-fail behavior, and deploy target.</dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-4">
              <dt className="font-semibold">llm</dt>
              <dd className="mt-1 text-muted">Default provider, model pins per task type, pinned date, and rate limits.</dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-4">
              <dt className="font-semibold">embeddings</dt>
              <dd className="mt-1 text-muted">Embedding provider, model, and static index path.</dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-4">
              <dt className="font-semibold">parallelism</dt>
              <dd className="mt-1 text-muted">Concurrency caps for EDA, DQ, document processing, and rule batches.</dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-4">
              <dt className="font-semibold">gates</dt>
              <dd className="mt-1 text-muted">Human review gates: semantic mapping, DQ, BL-EDA synthesis, and report QA.</dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-4">
              <dt className="font-semibold">io</dt>
              <dd className="mt-1 text-muted">File picker, demo mode, and supported input formats.</dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-4">
              <dt className="font-semibold">reporting</dt>
              <dd className="mt-1 text-muted">Output formats, unverified claim handling, and executive report sequencing.</dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-4">
              <dt className="font-semibold">observability</dt>
              <dd className="mt-1 text-muted">Log level, event emission, and HIPAA-adjacent redaction.</dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-4">
              <dt className="font-semibold">nodes</dt>
              <dd className="mt-1 text-muted">Per-node overrides for rate limits, retry policies, batch sizes, and interrupts.</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  )
}
