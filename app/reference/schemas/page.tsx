import Link from 'next/link'

const schemas = [
  { name: 'ValidationState', file: 'schemas/state.py', fields: ['run_id', 'tenant_id', 'user_id', 'stage', 'progress_pct', 'artifacts', 'errors'], purpose: 'Primary LangGraph state object for the validation graph.' },
  { name: 'ArtifactRef', file: 'schemas/artifacts.py', fields: ['artifact_id', 'run_id', 'artifact_type', 'path', 'checksum_sha256', 'created_at'], purpose: 'Reference to a persisted artifact in the ArtifactStore.' },
  { name: 'DQIssue', file: 'schemas/dq.py', fields: ['issue_id', 'run_id', 'table_name', 'column_name', 'check_type', 'severity', 'description', 'affected_row_count', 'status'], purpose: 'Data quality issue with severity and resolution status.' },
  { name: 'ExtractedRule', file: 'schemas/rules.py', fields: ['rule_id', 'run_id', 'document_id', 'rule_text', 'rule_type', 'citation_status', 'governed_data_concepts', 'candidate_tables', 'confidence', 'testability'], purpose: 'LLM-extracted business logic rule from a document.' },
  { name: 'NormalizedRule', file: 'schemas/rules.py', fields: ['rule_id', 'extracted_rule_id', 'rule_text', 'check_family', 'parameters', 'testability', 'testability_reason'], purpose: 'Typed, normalized rule ready for BL-EDA execution.' },
  { name: 'BLEDAJob', file: 'schemas/bl_eda.py', fields: ['job_id', 'run_id', 'pay_practice', 'check_family', 'rules', 'status', 'started_at', 'completed_at'], purpose: 'Single BL-EDA job for a pay-practice check family.' },
  { name: 'BLEDAWorkplan', file: 'schemas/bl_eda.py', fields: ['workplan_id', 'run_id', 'jobs', 'dependencies', 'materiality_weights'], purpose: 'Dependency graph of all BL-EDA jobs for a run.' },
  { name: 'BLEDAFinding', file: 'schemas/findings.py', fields: ['finding_id', 'run_id', 'pay_practice', 'check_family', 'check_name', 'severity', 'title', 'finding', 'metric_values', 'affected_count', 'dollar_impact', 'source_rule_ids'], purpose: 'Evidence-backed BL-EDA finding with impact metrics.' },
  { name: 'InsightCard', file: 'schemas/findings.py', fields: ['card_id', 'run_id', 'pay_practice', 'headline', 'body', 'finding_ids', 'severity', 'recommended_action'], purpose: 'Synthesized insight card for executive reporting.' },
  { name: 'ScenarioResult', file: 'schemas/findings.py', fields: ['scenario_id', 'title', 'finding', 'cost_impact', 'hours_impact', 'employee_impact', 'pay_practice'], purpose: 'What-if scenario outcome with quantified impacts.' },
  { name: 'DocumentRAGAnswer', file: 'schemas/rag.py', fields: ['answer', 'answerable', 'confidence', 'corpus_id', 'citations', 'limitations'], purpose: 'Document-only RAG response with verified citations.' },
  { name: 'SectionSpec', file: 'schemas/reports.py', fields: ['section_id', 'title', 'order', 'claims', 'evidence_refs', 'chart_refs', 'narrative'], purpose: 'Report section specification with claim-level evidence.' },
  { name: 'ClaimSpec', file: 'schemas/reports.py', fields: ['claim_id', 'section_id', 'claim_text', 'evidence_type', 'evidence_ref', 'verified', 'verification_method'], purpose: 'Individual claim within a report section.' },
  { name: 'ReviewGate', file: 'schemas/api.py', fields: ['review_id', 'run_id', 'gate_name', 'status', 'guards', 'details'], purpose: 'Human review gate with decision and notes.' },
  { name: 'ProgressSnapshot', file: 'schemas/api.py', fields: ['run_id', 'progress_pct', 'stages', 'blocked_by_review', 'review_type', 'snapshot_at'], purpose: 'Operational status snapshot for status chat.' },
  { name: 'CorpusStatus', file: 'schemas/api.py', fields: ['run_id', 'corpus_id', 'status', 'readiness_pct', 'indexed_count', 'total_count', 'failed_documents'], purpose: 'Document corpus indexing status.' },
  { name: 'RunMetrics', file: 'schemas/run_metrics.py', fields: ['run_id', 'stage_durations', 'llm_calls', 'tokens_in', 'tokens_out', 'artifacts_created', 'errors_count'], purpose: 'Run-level performance and cost metrics.' },
  { name: 'LedgerEvent', file: 'schemas/events.py', fields: ['event_id', 'run_id', 'node_name', 'event_type', 'timestamp', 'payload'], purpose: 'Execution ledger event for observability.' },
]

export default function SchemasPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Reference</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Schema Registry</h1>
      <p className="mt-4 text-muted">18 core Pydantic schemas governing data contracts across the system.</p>

      <section className="mt-10 space-y-3">
        {schemas.map((s) => (
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
