import { readFileSync } from 'fs'
import { resolve } from 'path'
import AgentTable from './AgentTable'

type AgentCatalog = {
  agents: {
    name: string
    graph: string
    purpose: string
    source_file: string
  }[]
}

function loadAgents(): AgentCatalog {
  const file = resolve(process.cwd(), 'content/generated/agent-catalog.json')
  const raw = readFileSync(file, 'utf-8')
  return JSON.parse(raw) as AgentCatalog
}

export default function AgentsPage() {
  const catalog = loadAgents()
  return <AgentTable nodes={catalog.agents} />
}
