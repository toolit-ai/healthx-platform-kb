import { readFileSync } from 'fs'
import Link from 'next/link'

export default function SchemasPage() {
  const raw = readFileSync('/tmp/swarm-output/architecture/content-spec.json', 'utf-8')
  const spec = JSON.parse(raw)
  const schemas = spec.schemas || []

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">reference</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Schema Registry</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Data models and type definitions used across the platform.
      </p>

      <div className="mt-10 space-y-6">
        {schemas.map((schema: any) => (
          <div key={schema.name} className="rounded-lg border border-line bg-card p-5">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-semibold">{schema.name}</h2>
              <span className="font-mono text-xs text-muted">{schema.source_file}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{schema.fields.length} fields</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-line bg-muted">
                    <th className="px-3 py-2 font-semibold">Field</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {schema.fields.map((field: string) => (
                    <tr key={field} className="bg-card">
                      <td className="px-3 py-2 font-mono text-xs">{field}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/reference/agents" className="text-brand hover:underline text-sm">
          Agent Catalog
        </Link>
      </div>
    </main>
  )
}
