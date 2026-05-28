import { readFileSync } from 'fs'
import { resolve } from 'path'
import Link from 'next/link'

type SchemaRegistry = {
  schemas: {
    name: string
    file: string
    fields: string[]
    purpose: string
  }[]
}

function loadSchemas(): SchemaRegistry {
  const file = resolve(process.cwd(), 'content/generated/schema-registry.json')
  const raw = readFileSync(file, 'utf-8')
  return JSON.parse(raw) as SchemaRegistry
}

export default function SchemasPage() {
  const registry = loadSchemas()
  const count = registry.schemas.length

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Reference</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Schema Registry</h1>
      <p className="mt-4 text-muted">{count} core Pydantic schemas governing data contracts across the system.</p>

      <section className="mt-10 space-y-3">
        {registry.schemas.map((s) => (
          <div key={s.name} className="rounded-lg border border-line bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold">{s.name}</h2>
              <span className="font-mono text-[10px] text-muted">{s.file}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{s.purpose}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {s.fields.map((f) => (
                <span key={f} className="rounded bg-muted px-2 py-0.5 text-xs">{f}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="mt-12 border-t border-line pt-6">
        <Link href="/" className="font-mono text-xs text-brand hover:underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
