import { notFound } from 'next/navigation'
import { readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'
import { simpleMarkdownToHtml } from '@/lib/markdown'

const CHAPTERS = [
  '00_README',
  '01_product_objectives_and_scope',
  '02_target_architecture',
  '03_tech_stack_and_repo_structure',
  '04_langgraph_graphs_and_state',
  '05_agent_catalog_and_node_specs',
  '06_document_intelligence_rule_extraction',
  '07_bl_eda_engine_and_playbook_registry',
  '08_rag_status_chat_and_streamlit_ui',
  '09_reporting_html_generation',
  '10_data_contracts_storage_and_api',
  '11_security_governance_and_observability',
  '12_implementation_roadmap_and_acceptance',
  '13_claude_code_build_guide',
  '14_ui_ux_specification',
]

export function generateStaticParams() {
  return CHAPTERS.map((chapter) => ({ chapter }))
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params
  const title = chapter.replace(/_/g, ' ').replace(/^\d+_/, '')
  return { title: `${title} — Architecture` }
}

export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params
  if (!CHAPTERS.includes(chapter)) {
    notFound()
  }

  const filePath = join(process.cwd(), '..', 'bsmh-agentic-system', 'docs', 'architecture', `${chapter}.md`)
  let content: string
  try {
    content = readFileSync(filePath, 'utf-8')
  } catch {
    notFound()
  }

  const html = simpleMarkdownToHtml(content)

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/architecture/" className="font-mono text-xs text-brand hover:underline">
        ← Architecture Index
      </Link>
      <article
        className="mt-6 prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="mt-12 border-t border-line pt-6">
        <Link href="/architecture/" className="font-mono text-xs text-brand hover:underline">
          ← Back to Architecture Index
        </Link>
      </div>
    </main>
  )
}
