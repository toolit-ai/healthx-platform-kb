import Link from 'next/link'

const chapters = [
  { id: '00_README', title: '00 — README and System Overview', desc: 'Index and consolidated system overview.' },
  { id: '01_product_objectives_and_scope', title: '01 — Product Objectives and Scope', desc: 'Product objective, users, output families, in-scope domains, success criteria.' },
  { id: '02_target_architecture', title: '02 — Target Architecture', desc: 'End-to-end architecture, runtime components, graph split, store separation.' },
  { id: '03_tech_stack_and_repo_structure', title: '03 — Tech Stack and Repository Structure', desc: 'Technology choices and repository layout.' },
  { id: '04_langgraph_graphs_and_state', title: '04 — LangGraph Graphs and State', desc: 'Graph topology, state design, parallelism, interrupts, checkpoints, eventing.' },
  { id: '05_agent_catalog_and_node_specs', title: '05 — Agent Catalog and Node Specifications', desc: 'Agent catalog with inputs, outputs, failure modes, LLM budget.' },
  { id: '06_document_intelligence_rule_extraction', title: '06 — Document Intelligence and Rule Extraction', desc: 'Document ingestion, LLM extraction, rule schema, semantic mapping, review gates.' },
  { id: '07_bl_eda_engine_and_playbook_registry', title: '07 — BL-EDA Engine and Playbook Registry', desc: 'BL-EDA decision logic, pay-practice playbooks, check families, evidence quality assessment.' },
  { id: '08_rag_status_chat_and_streamlit_ui', title: '08 — RAG, Status Chat, and Streamlit UI', desc: 'Document-only RAG, status chat, StageProgressService, corpus readiness.' },
  { id: '09_reporting_html_generation', title: '09 — Reporting and HTML Generation', desc: 'HTML report generation, SectionSpec, ClaimSpec, report QA, evidence lineage.' },
  { id: '10_data_contracts_storage_and_api', title: '10 — Data Contracts, Storage, and API', desc: 'Pydantic contracts, database stores, artifact paths, APIs, events, audit records.' },
  { id: '11_security_governance_and_observability', title: '11 — Security, Governance, and Observability', desc: 'HIPAA posture, data isolation, prompt safety, PII handling, logging, monitoring.' },
  { id: '12_implementation_roadmap_and_acceptance', title: '12 — Implementation Roadmap and Acceptance', desc: 'Build sequence, MVP slices, acceptance criteria, done definitions.' },
  { id: '13_claude_code_build_guide', title: '13 — Claude Code Build Guide', desc: 'Phase-aware Claude Code instructions and guardrails.' },
  { id: '14_ui_ux_specification', title: '14 — UI/UX Specification', desc: 'Complete 8-page Streamlit UI specification.' },
]

export default function ArchitectureIndex() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Architecture</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Architecture Specification Pack</h1>
      <p className="mt-4 text-muted">14 chapters covering the complete BSMH Agentic System design.</p>

      <section className="mt-10 grid gap-3">
        {chapters.map((c) => (
          <article key={c.id} className="rounded-lg border border-line bg-card p-4">
            <h2 className="text-base font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm text-muted">{c.desc}</p>
            <Link className="mt-2 inline-block font-mono text-xs text-brand hover:underline" href={`/architecture/${c.id}/`}>
              Read chapter
            </Link>
          </article>
        ))}
      </section>
    </main>
  )
}
