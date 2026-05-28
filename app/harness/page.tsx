import { readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'

interface HarnessConfig {
  models: { task: string; model: string }[]
  parallelism: { key: string; value: number }[]
  gates: { name: string; enabled: boolean; blocking: boolean }[]
  raw: string
  missing: boolean
}

function parseHarnessYaml(yaml: string): HarnessConfig {
  const lines = yaml.split('\n')
  const config: HarnessConfig = {
    models: [],
    parallelism: [],
    gates: [],
    raw: yaml,
    missing: false,
  }

  let section: string | null = null
  let subsection: string | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === '' || trimmed.startsWith('#')) continue

    const indent = line.search(/\S/)
    const isTopLevel = indent === 0
    const isSecondLevel = indent === 2

    if (isTopLevel && trimmed.endsWith(':')) {
      section = trimmed.slice(0, -1)
      subsection = null
      continue
    }

    if (section === 'llm' && isSecondLevel && trimmed === 'models:') {
      subsection = 'models'
      continue
    }

    if (section === 'llm' && isSecondLevel && trimmed.endsWith(':')) {
      subsection = trimmed.slice(0, -1)
      continue
    }

    if (section === 'parallelism' && isSecondLevel) {
      const colonIdx = trimmed.indexOf(':')
      if (colonIdx !== -1) {
        const key = trimmed.slice(0, colonIdx).trim()
        const val = parseInt(trimmed.slice(colonIdx + 1).trim(), 10)
        if (!Number.isNaN(val)) {
          config.parallelism.push({ key, value: val })
        }
      }
      continue
    }

    if (section === 'gates' && isSecondLevel) {
      const colonIdx = trimmed.indexOf(':')
      if (colonIdx !== -1) {
        const name = trimmed.slice(0, colonIdx).trim()
        const rest = trimmed.slice(colonIdx + 1).trim()
        const inlineMatch = rest.match(/\{\s*enabled:\s*(true|false),\s*blocking:\s*(true|false)\s*\}/i)
        if (inlineMatch) {
          config.gates.push({
            name,
            enabled: inlineMatch[1] === 'true',
            blocking: inlineMatch[2] === 'true',
          })
        }
      }
      continue
    }

    if (subsection === 'models' && indent === 4) {
      const colonIdx = trimmed.indexOf(':')
      if (colonIdx !== -1) {
        const task = trimmed.slice(0, colonIdx).trim()
        const model = trimmed.slice(colonIdx + 1).trim()
        config.models.push({ task, model })
      }
      continue
    }
  }

  return config
}

export default function HarnessPage() {
  let config: HarnessConfig = {
    models: [],
    parallelism: [],
    gates: [],
    raw: '',
    missing: true,
  }

  try {
    const yaml = readFileSync(join(process.cwd(), 'content', 'harness', 'harness.default.yaml'), 'utf-8')
    config = parseHarnessYaml(yaml)
    config.missing = false
  } catch {
    config.missing = true
  }

  if (config.missing) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Reference</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">AAA Harness</h1>
        <div className="mt-10 rounded-lg border border-line bg-card p-5">
          <p className="text-sm text-muted">
            Harness configuration not found. Please run the content sync.
          </p>
        </div>
        <div className="mt-12 border-t border-line pt-6">
          <Link href="/" className="font-mono text-xs text-brand hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>
    )
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
          <p className="mt-1 text-sm text-muted">Source: content/harness/harness.default.yaml</p>
          <pre className="mt-4 rounded-lg bg-muted p-4 overflow-x-auto text-xs leading-relaxed">
            <code>{config.raw}</code>
          </pre>
        </div>

        <div className="rounded-lg border border-line bg-card p-5">
          <h2 className="text-base font-semibold">Model Pins</h2>
          <div className="mt-3 space-y-2">
            {config.models.map((m) => (
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
            {config.parallelism.map((p) => (
              <div key={p.key} className="flex items-center justify-between rounded bg-muted px-3 py-2 text-sm">
                <span className="font-medium">{p.key}</span>
                <span className="font-mono text-xs">{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-card p-5">
          <h2 className="text-base font-semibold">Gate Behaviors</h2>
          <div className="mt-3 space-y-2">
            {config.gates.map((g) => (
              <div key={g.name} className="flex items-center justify-between rounded bg-muted px-3 py-2 text-sm">
                <span className="font-medium">{g.name}</span>
                <span className="font-mono text-xs text-muted">
                  enabled={g.enabled.toString()} blocking={g.blocking.toString()}
                </span>
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
