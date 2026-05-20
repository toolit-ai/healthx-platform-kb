import { readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'

export default function HarnessPage() {
  let yaml = ''
  try {
    yaml = readFileSync(join(process.cwd(), '..', 'healthx-web-app', 'src', 'config', 'harness.default.yaml'), 'utf-8')
  } catch {
    yaml = '# Harness config not found'
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Reference</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">AAA Harness</h1>
      <p className="mt-4 text-muted">
        One YAML controls model pins, parallelism caps, gate behavior, and deploy targets — overridable at run-level and per-node.
      </p>

      <section className="mt-10 space-y-6">
        <div className="rounded-lg border border-line bg-card p-5">
          <h2 className="text-base font-semibold">Default Configuration</h2>
          <p className="mt-1 text-sm text-muted">Source: healthx-web-app/src/config/harness.default.yaml</p>
          <pre className="mt-4 rounded-lg bg-muted p-4 overflow-x-auto text-xs leading-relaxed">
            <code>{yaml}</code>
          </pre>
        </div>

        <div className="rounded-lg border border-line bg-card p-5">
          <h2 className="text-base font-semibold">Model Pins</h2>
          <div className="mt-3 space-y-2">
            {[
              { task: 'extraction', model: 'claude-sonnet-4-6', purpose: 'Document chunking and rule extraction' },
              { task: 'reasoning', model: 'claude-sonnet-4-6', purpose: 'Semantic mapping and narrative synthesis' },
              { task: 'classification', model: 'claude-sonnet-4-6', purpose: 'Rule type and confidence scoring' },
              { task: 'narrative', model: 'claude-sonnet-4-6', purpose: 'Report section generation' },
            ].map((m) => (
              <div key={m.task} className="flex items-center justify-between rounded bg-muted px-3 py-2 text-sm">
                <span className="font-medium capitalize">{m.task}</span>
                <span className="font-mono text-xs text-muted">{m.model}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-card p-5">
          <h2 className="text-base font-semibold">Parallelism Caps</h2>
          <div className="mt-3 space-y-2">
            {[
              { point: 'Data profiling / DQ', max: 8 },
              { point: 'Document processing', max: 6 },
              { point: 'Semantic mapping', max: 4 },
              { point: 'Rule normalization', max: 4 },
              { point: 'BL-EDA checks', max: 10 },
            ].map((p) => (
              <div key={p.point} className="flex items-center justify-between rounded bg-muted px-3 py-2 text-sm">
                <span>{p.point}</span>
                <span className="font-mono text-xs">max {p.max}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-card p-5">
          <h2 className="text-base font-semibold">Gate Behaviors</h2>
          <div className="mt-3 space-y-2">
            {[
              { gate: 'BL Mapping Review Gate', default: 'block', options: 'block, warn, skip' },
              { gate: 'DQ Gate', default: 'block', options: 'block, warn' },
              { gate: 'Report QA Gate', default: 'warn', options: 'block, warn, skip' },
              { gate: 'Export Gate', default: 'block', options: 'block, warn' },
            ].map((g) => (
              <div key={g.gate} className="flex items-center justify-between rounded bg-muted px-3 py-2 text-sm">
                <span>{g.gate}</span>
                <span className="font-mono text-xs text-muted">default={g.default} [{g.options}]</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-12 border-t border-line pt-6">
        <Link href="/" className="font-mono text-xs text-brand hover:underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
