import Link from 'next/link'

const agents = [
  { name: 'InitializeRunAgent', graph: 'validation_and_bl_eda', purpose: 'Bootstraps run state, validates input paths, assigns run_id.' },
  { name: 'IntakeAgent', graph: 'validation_and_bl_eda', purpose: 'Reads and catalogs all input files (CSV, XLSX, PDF, DOCX, MD, TXT).' },
  { name: 'DataCatalogAgent', graph: 'validation_and_bl_eda', purpose: 'Builds per-table metadata: columns, types, inferred semantics, relationships.' },
  { name: 'CoreEDAProfileAgent', graph: 'validation_and_bl_eda', purpose: 'Per-table EDA: nulls, distributions, outliers, top values, panel detection (Stages 1-3).' },
  { name: 'DataQualityValidationAgent', graph: 'validation_and_bl_eda', purpose: 'Per-table DQ: null, type, bounds, duplicates, negatives, FK integrity.' },
  { name: 'RelationshipValidationAgent', graph: 'validation_and_bl_eda', purpose: 'Cross-table referential integrity and relationship confidence scoring.' },
  { name: 'WorkforceContextProfileAgent', graph: 'validation_and_bl_eda', purpose: 'Stage 5: pay code concentration, temporal trends, segment health, hour distribution.' },
  { name: 'DocumentIngestionAgent', graph: 'validation_and_bl_eda', purpose: 'Per-document parsing, chunking, hash verification, deduplication.' },
  { name: 'DocumentLLMProcessingAgent', graph: 'validation_and_bl_eda', purpose: 'Per-document LLM rule extraction with citation tracking and confidence scoring.' },
  { name: 'DocumentProcessingQualityGateAgent', graph: 'validation_and_bl_eda', purpose: 'Validates extraction quality and routes low-confidence rules to review.' },
  { name: 'DocumentRAGIndexAgent', graph: 'validation_and_bl_eda', purpose: 'Indexes processed documents into Qdrant for document-only RAG.' },
  { name: 'SemanticMappingAgent', graph: 'validation_and_bl_eda', purpose: 'Maps extracted rule concepts to table columns per rule batch.' },
  { name: 'RuleNormalizationAgent', graph: 'validation_and_bl_eda', purpose: 'Normalizes rules into typed, testable rule objects per batch.' },
  { name: 'BLRuleTestabilityAgent', graph: 'validation_and_bl_eda', purpose: 'Evaluates rule testability and flags untestable rules with reasons.' },
  { name: 'BLValidationPlanningAgent', graph: 'validation_and_bl_eda', purpose: 'Compiles rules into executable BL-EDA job plan with dependency graph.' },
  { name: 'BLMappingReviewGateAgent', graph: 'validation_and_bl_eda', purpose: 'Human interrupt for semantic mapping approval before BL-EDA.' },
  { name: 'BLDQGateAgent', graph: 'validation_and_bl_eda', purpose: 'Human interrupt for DQ issue resolution before BL-EDA.' },
  { name: 'BLReadinessAgent', graph: 'bl_eda_subgraph', purpose: 'Validates prerequisites before BL-EDA execution.' },
  { name: 'BLRuleProfileAgent', graph: 'bl_eda_subgraph', purpose: 'Profiles rule catalog coverage against detected pay practices.' },
  { name: 'BLCheckPlanningAgent', graph: 'bl_eda_subgraph', purpose: 'Outputs job dependency graph for pay-practice fan-out.' },
  { name: 'BLBaselineEDAAgent', graph: 'bl_eda_subgraph', purpose: 'Baseline statistical profiling per pay practice.' },
  { name: 'BLRuleDrivenEDAAgent', graph: 'bl_eda_subgraph', purpose: 'Executes document-driven checks per pay practice.' },
  { name: 'BLThresholdVerificationAgent', graph: 'bl_eda_subgraph', purpose: 'Validates threshold-based rules against data.' },
  { name: 'BLStackingVerificationAgent', graph: 'bl_eda_subgraph', purpose: 'Validates pay code stacking and anti-pyramiding rules.' },
  { name: 'BLTemporalSequenceVerificationAgent', graph: 'bl_eda_subgraph', purpose: 'Validates temporal sequence rules (rest between shifts, consecutive days).' },
  { name: 'BLScenarioModelingAgent', graph: 'bl_eda_subgraph', purpose: 'Runs what-if scenarios with persisted assumptions.' },
  { name: 'BLJobEvidenceCollectorAgent', graph: 'bl_eda_subgraph', purpose: 'Collects evidence artifacts per pay-practice job group.' },
  { name: 'BLEDAEvidenceAggregationAgent', graph: 'validation_and_bl_eda', purpose: 'Cross-practice evidence synthesis and deduplication.' },
  { name: 'BLEDAPersistenceAgent', graph: 'validation_and_bl_eda', purpose: 'Persists BL-EDA findings and insight cards.' },
  { name: 'BLEDASummaryAgent', graph: 'validation_and_bl_eda', purpose: 'Generates summary statistics and top findings.' },
  { name: 'BLReportGenerationAgent', graph: 'validation_and_bl_eda', purpose: 'Triggers deep-dive and executive report generation.' },
  { name: 'SectionPlannerAgent', graph: 'deep_dive_report_graph', purpose: 'Plans report sections from evidence inventory.' },
  { name: 'HTMLRendererAgent', graph: 'deep_dive_report_graph', purpose: 'Renders self-contained HTML from sections and charts.' },
]

export default function AgentsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Reference</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Agent Catalog</h1>
      <p className="mt-4 text-muted">33 agents across 5 LangGraph graphs.</p>

      <section className="mt-10 space-y-3">
        {agents.map((a) => (
          <div key={a.name} className="rounded-lg border border-line bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold">{a.name}</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{a.graph}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{a.purpose}</p>
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
