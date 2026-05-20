import { readFileSync } from 'fs'
import AgentTable from './AgentTable'

export default function AgentsPage() {
  const raw = readFileSync('/tmp/swarm-output/architecture/content-spec.json', 'utf-8')
  const spec = JSON.parse(raw)
  const nodes = (spec.graphs || []).flatMap((g: any) =>
    (g.nodes || []).map((n: string) => ({ name: n, graph: g.name, purpose: g.purpose }))
  )
  return <AgentTable nodes={nodes} />
}
