import Link from 'next/link'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const chapters = [
  {
    slug: 'product-objectives-and-scope',
    file: '01_product_objectives_and_scope.md',
    title: 'Product Objectives and Scope',
  },
  {
    slug: 'target-architecture',
    file: '02_target_architecture.md',
    title: 'Target Architecture',
  },
  {
    slug: 'tech-stack-and-repo-structure',
    file: '03_tech_stack_and_repo_structure.md',
    title: 'Tech Stack and Repo Structure',
  },
  {
    slug: 'langgraph-graphs-and-state',
    file: '04_langgraph_graphs_and_state.md',
    title: 'LangGraph Graphs and State',
  },
  {
    slug: 'agent-catalog-and-node-specs',
    file: '05_agent_catalog_and_node_specs.md',
    title: 'Agent Catalog and Node Specs',
  },
  {
    slug: 'document-intelligence-rule-extraction',
    file: '06_document_intelligence_rule_extraction.md',
    title: 'Document Intelligence and Rule Extraction',
  },
  {
    slug: 'bl-eda-engine-and-playbook-registry',
    file: '07_bl_eda_engine_and_playbook_registry.md',
    title: 'BL-EDA Engine and Playbook Registry',
  },
  {
    slug: 'rag-status-chat-and-streamlit-ui',
    file: '08_rag_status_chat_and_streamlit_ui.md',
    title: 'RAG, Status Chat, and Streamlit UI',
  },
  {
    slug: 'reporting-html-generation',
    file: '09_reporting_html_generation.md',
    title: 'Reporting and HTML Generation',
  },
  {
    slug: 'data-contracts-storage-and-api',
    file: '10_data_contracts_storage_and_api.md',
    title: 'Data Contracts, Storage, and API',
  },
  {
    slug: 'security-governance-and-observability',
    file: '11_security_governance_and_observability.md',
    title: 'Security, Governance, and Observability',
  },
  {
    slug: 'implementation-roadmap-and-acceptance',
    file: '12_implementation_roadmap_and_acceptance.md',
    title: 'Implementation Roadmap and Acceptance',
  },
  {
    slug: 'claude-code-build-guide',
    file: '13_claude_code_build_guide.md',
    title: 'Claude Code Build Guide',
  },
  {
    slug: 'ui-ux-specification',
    file: '14_ui_ux_specification.md',
    title: 'UI/UX Specification',
  },
]

function getDescription(fileName: string): string {
  try {
    const path = resolve(
      '/Users/rishabharya/Desktop/bsmh-workspace/bsmh-agentic-system/docs/architecture',
      fileName
    )
    const content = readFileSync(path, 'utf-8')
    const lines = content.split('\n').filter((l) => l.trim().length > 0)
    let i = 0
    if (lines[i]?.startsWith('#')) i++
    const desc = lines.slice(i).find((l) => !l.startsWith('#') && l.trim().length > 0) || ''
    const trimmed = desc.trim()
    return trimmed.slice(0, 200) + (trimmed.length > 200 ? '…' : '')
  } catch {
    return ''
  }
}

export default function ArchitectureIndex() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">architecture</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Architecture Specification</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        The complete 14-chapter system specification covering product scope, target architecture,
        graphs, state, document intelligence, BL-EDA engine, reporting, data contracts, security,
        and UI/UX.
      </p>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {chapters.map((c) => {
          const description = getDescription(c.file)
          return (
            <article key={c.slug} className="rounded-lg border border-line bg-card p-5">
              <h2 className="text-lg font-semibold">{c.title}</h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
              <Link
                className="mt-4 inline-block font-mono text-xs text-brand hover:underline"
                href={`/architecture/${c.slug}`}
              >
                Read chapter
              </Link>
            </article>
          )
        })}
      </section>
    </main>
  )
}
