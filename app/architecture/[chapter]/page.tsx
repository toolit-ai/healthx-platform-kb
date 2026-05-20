import { readFileSync } from 'fs'
import { resolve } from 'path'
import Link from 'next/link'

const chapterMap: Record<string, string> = {
  'product-objectives-and-scope': '01_product_objectives_and_scope.md',
  'target-architecture': '02_target_architecture.md',
  'tech-stack-and-repo-structure': '03_tech_stack_and_repo_structure.md',
  'langgraph-graphs-and-state': '04_langgraph_graphs_and_state.md',
  'agent-catalog-and-node-specs': '05_agent_catalog_and_node_specs.md',
  'document-intelligence-rule-extraction': '06_document_intelligence_rule_extraction.md',
  'bl-eda-engine-and-playbook-registry': '07_bl_eda_engine_and_playbook_registry.md',
  'rag-status-chat-and-streamlit-ui': '08_rag_status_chat_and_streamlit_ui.md',
  'reporting-html-generation': '09_reporting_html_generation.md',
  'data-contracts-storage-and-api': '10_data_contracts_storage_and_api.md',
  'security-governance-and-observability': '11_security_governance_and_observability.md',
  'implementation-roadmap-and-acceptance': '12_implementation_roadmap_and_acceptance.md',
  'claude-code-build-guide': '13_claude_code_build_guide.md',
  'ui-ux-specification': '14_ui_ux_specification.md',
}

export function generateStaticParams() {
  return Object.keys(chapterMap).map((chapter) => ({ chapter }))
}

export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params
  const fileName = chapterMap[chapter]
  if (!fileName) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Chapter not found</h1>
        <p className="mt-4 text-muted">The requested architecture chapter does not exist.</p>
        <Link href="/architecture" className="mt-4 inline-block text-brand hover:underline">
          Back to Architecture
        </Link>
      </main>
    )
  }

  const path = resolve(
    '/Users/rishabharya/Desktop/bsmh-workspace/bsmh-agentic-system/docs/architecture',
    fileName
  )
  const content = readFileSync(path, 'utf-8')

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        architecture / {chapter}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight capitalize">
        {chapter.replace(/-/g, ' ')}
      </h1>
      <div className="mt-8 rounded-lg border border-line bg-card p-0 overflow-hidden">
        <pre className="p-6 text-sm leading-loose whitespace-pre-wrap break-words overflow-x-auto">
          {content}
        </pre>
      </div>
      <div className="mt-8">
        <Link href="/architecture" className="text-brand hover:underline text-sm">
          Back to Architecture
        </Link>
      </div>
    </main>
  )
}
