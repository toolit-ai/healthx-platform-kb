'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

type Node = {
  name: string
  graph: string
  purpose: string
}

export default function AgentTable({ nodes }: { nodes: Node[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return nodes
    return nodes.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.graph.toLowerCase().includes(q) ||
        n.purpose.toLowerCase().includes(q)
    )
  }, [query, nodes])

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">reference</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Agent Catalog</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        All graph nodes and agents across the BSMH Agentic System, organized by graph.
      </p>

      <div className="mt-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search agents by name, graph, or purpose..."
          className="w-full rounded-md border border-line bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-line bg-muted">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Graph</th>
              <th className="px-4 py-3 font-semibold">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((node) => (
              <tr key={`${node.graph}-${node.name}`} className="bg-card">
                <td className="px-4 py-3 font-mono text-xs">{node.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{node.graph}</td>
                <td className="px-4 py-3 text-muted max-w-xl">{node.purpose}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted text-center" colSpan={3}>
                  No agents match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <Link href="/reference/schemas" className="text-brand hover:underline text-sm">
          Schema Registry
        </Link>
      </div>
    </main>
  )
}
