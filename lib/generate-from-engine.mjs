/**
 * generate-from-engine.mjs
 *
 * Scans the BSMH Agentic System Python codebase and generates:
 *   - content/generated/agent-catalog.json
 *   - content/generated/schema-registry.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const ENGINE_ROOT = path.resolve(PROJECT_ROOT, "../bsmh-agentic-system/bsmh_agentic_system");
const OUT_DIR = path.resolve(PROJECT_ROOT, "content/generated");

const NODES_DIR = path.join(ENGINE_ROOT, "nodes");
const GRAPHS_DIR = path.join(ENGINE_ROOT, "graphs");
const SCHEMAS_DIR = path.join(ENGINE_ROOT, "schemas");

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function readFile(p) {
  try {
    return fs.readFileSync(p, "utf-8");
  } catch {
    return "";
  }
}

function toPascalCase(snake) {
  return snake
    .split("_")
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : ""))
    .join("");
}

function nodeNameToAgentName(nodeName) {
  const map = {
    bl_valid_values: "BLValidValuesAgent",
    bl_baseline_eda: "BLBaselineEDAAgent",
    bl_segment_analysis: "BLSegmentAnalysisAgent",
    bl_rule_driven_eda: "BLRuleDrivenEDAAgent",
    bl_eda_evidence_aggregation: "BLEDAEvidenceAggregationAgent",
    bl_eda_persistence: "BLEDAPersistenceAgent",
    bl_eda_summary: "BLEDASummaryAgent",
    bl_report_generation: "BLReportGenerationAgent",
    bl_check_planning: "BLCheckPlanningAgent",
    bl_eda_synthesis: "BLEDASynthesisAgent",
    bl_calculation_verification: "BLCalculationVerificationAgent",
    bl_threshold_verification: "BLThresholdVerificationAgent",
    bl_stacking_verification: "BLStackingVerificationAgent",
    bl_temporal_sequence: "BLTemporalSequenceAgent",
    bl_scenario_modeling: "BLScenarioModelingAgent",
    bl_job_evidence_collector: "BLJobEvidenceCollectorAgent",
    bl_readiness: "BLReadinessAgent",
    bl_rule_profile: "BLRuleProfileAgent",
    bl_mapping_review_gate: "BLMappingReviewGateAgent",
    bl_dq_gate: "BLDQGateAgent",
    bl_rule_testability: "BLRuleTestabilityAgent",
    bl_validation_planning: "BLValidationPlanningAgent",
    complete_run: "CompleteRunAgent",
    export_packaging: "ExportPackagingAgent",
    pay_policy_extraction: "PayPolicyExtractionAgent",
    structured_data_profiling: "StructuredDataProfilingAgent",
    publish_corpus_ready: "PublishCorpusReadyAgent",
    document_quality_gate: "DocumentProcessingQualityGateAgent",
    document_llm_processing: "DocumentLLMProcessingAgent",
    document_rag_index: "DocumentRAGIndexAgent",
    document_ingestion: "DocumentIngestionAgent",
    workforce_context_profile: "WorkforceContextProfileAgent",
    relationship_validation: "RelationshipValidationAgent",
    dq_validation: "DataQualityValidationAgent",
    core_eda_profile: "CoreEDAProfileAgent",
    data_catalog: "DataCatalogAgent",
    intake: "IntakeAgent",
    initialize_run: "InitializeRunAgent",
    semantic_mapping: "SemanticMappingAgent",
    rule_normalization: "RuleNormalizationAgent",
    build_executive_report: "BuildExecutiveReportAgent",
    plan_sections: "SectionPlannerAgent",
    render_charts: "ChartRendererAgent",
    render_tables: "TableRendererAgent",
    generate_narratives: "NarrativeGeneratorAgent",
    bind_citations: "CitationBinderAgent",
    render_html: "HTMLRendererAgent",
    qa_report: "ReportQAAgent",
    _eda_profile_worker: "EDAProfileWorker",
    _dq_validation_worker: "DQValidationWorker",
    _doc_ingestion_worker: "DocIngestionWorker",
    _doc_llm_worker: "DocLLMWorker",
    _semantic_mapping_worker: "SemanticMappingWorker",
    _rule_normalization_worker: "RuleNormalizationWorker",
  };
  return map[nodeName] || toPascalCase(nodeName) + "Agent";
}

function extractDocstringPurpose(content) {
  const triple = content.match(/"""([\s\S]*?)"""/);
  if (!triple) return "";
  const firstLine = triple[1]
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)[0];
  if (!firstLine) return "";
  return firstLine.replace(/^\w+\s+(node\s+—\s+|—\s+|[-–]\s*)/, "").trim();
}

function findNodeFileForName(nodeName) {
  const explicit = {
    build_executive_report: "graphs/executive_report_graph.py",
    plan_sections: "nodes/reports/section_planner.py",
    render_charts: "nodes/reports/chart_renderer.py",
    render_tables: "nodes/reports/table_renderer.py",
    generate_narratives: "nodes/reports/narrative_generator.py",
    bind_citations: "nodes/reports/citation_binder.py",
    render_html: "nodes/reports/html_renderer.py",
    qa_report: "nodes/reports/report_qa.py",
    _eda_profile_worker: "nodes/core_eda_profile.py",
    _dq_validation_worker: "nodes/dq_validation.py",
    _doc_ingestion_worker: "nodes/document_ingestion.py",
    _doc_llm_worker: "nodes/document_llm_processing.py",
    _semantic_mapping_worker: "nodes/semantic_mapping.py",
    _rule_normalization_worker: "nodes/rule_normalization.py",
  };

  if (explicit[nodeName]) return explicit[nodeName];

  const candidates = [nodeName, nodeName.replace(/^bl_/, ""), nodeName.replace(/^bl_/, "bl_")];

  for (const c of candidates) {
    const direct = path.join(NODES_DIR, `${c}.py`);
    if (fs.existsSync(direct)) return `nodes/${c}.py`;
  }

  for (const c of candidates) {
    const sub = path.join(NODES_DIR, "bl_eda", `${c}.py`);
    if (fs.existsSync(sub)) return `nodes/bl_eda/${c}.py`;
  }

  for (const c of candidates) {
    const sub = path.join(NODES_DIR, "reports", `${c}.py`);
    if (fs.existsSync(sub)) return `nodes/reports/${c}.py`;
  }

  function search(dir, prefix) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const found = search(full, `${prefix}${entry.name}/`);
        if (found) return found;
      } else if (entry.name.endsWith(".py")) {
        const content = readFile(full);
        const funcRe = new RegExp(
          `^(async\\s+)?def\\s+(run_${nodeName.replace(/_/g, "[_-]?")}|run_${nodeName.replace(/_/g, "")}|${nodeName.replace(/_/g, "[_-]?")})\\b`,
          "m"
        );
        if (funcRe.test(content)) return `${prefix}${entry.name}`;
      }
    }
    return null;
  }

  return search(NODES_DIR, "nodes/") || `nodes/${nodeName}.py`;
}

function getPurposeForNode(nodeName, sourceFile) {
  const fullPath = path.join(ENGINE_ROOT, sourceFile);
  if (!fs.existsSync(fullPath)) return "";
  const content = readFile(fullPath);
  const purpose = extractDocstringPurpose(content);
  if (purpose) return purpose;

  const funcMatch = content.match(
    /(?:async\s+)?def\s+run_\w+\s*\([^)]*\)(?:\s*->\s*\w+)?\s*:\s*(?:"""|''')([\s\S]*?)(?:"""|''')/
  );
  if (funcMatch) {
    const firstLine = funcMatch[1]
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)[0];
    if (firstLine) return firstLine;
  }
  return "";
}

function parseValidationGraph(content) {
  const nodes = [];

  // Parse NODE_ORDER list
  const nodeOrderMatch = content.match(/NODE_ORDER:\s*list\[str\]\s*=\s*\[([^\]]+)\]/s);
  if (nodeOrderMatch) {
    const listContent = nodeOrderMatch[1];
    const stringMatches = [...listContent.matchAll(/"([^"]+)"/g)];
    for (const m of stringMatches) {
      nodes.push(m[1]);
    }
  }

  // Also catch internal worker nodes added explicitly
  const workerRe = /workflow\.add_node\s*\(\s*"(_[^"]+)"/g;
  let wm;
  while ((wm = workerRe.exec(content)) !== null) {
    nodes.push(wm[1]);
  }

  return [...new Set(nodes)];
}

function parseGraphs() {
  const graphFiles = fs
    .readdirSync(GRAPHS_DIR)
    .filter((f) => f.endsWith(".py") && !f.startsWith("__"));

  const nodeToGraph = new Map();

  for (const gf of graphFiles) {
    const graphName = gf.replace(/_graph\.py$/, "").replace(/\.py$/, "");
    const content = readFile(path.join(GRAPHS_DIR, gf));

    if (graphName === "validation_and_bl_eda") {
      const nodes = parseValidationGraph(content);
      for (const n of nodes) nodeToGraph.set(n, graphName);
      continue;
    }

    const addNodeRe = /\.add_node\s*\(\s*["']([^"']+)["']/g;
    let m;
    while ((m = addNodeRe.exec(content)) !== null) {
      nodeToGraph.set(m[1], graphName);
    }
  }

  return nodeToGraph;
}

function discoverAgents() {
  const nodeToGraph = parseGraphs();
  const agents = [];

  for (const [nodeName, graphName] of nodeToGraph) {
    const sourceFile = findNodeFileForName(nodeName);
    const purpose = getPurposeForNode(nodeName, sourceFile);
    agents.push({
      name: nodeNameToAgentName(nodeName),
      graph: graphName,
      purpose: purpose || `${nodeNameToAgentName(nodeName)} node.`,
      source_file: sourceFile,
    });
  }

  agents.sort((a, b) => {
    if (a.graph !== b.graph) return a.graph.localeCompare(b.graph);
    return a.name.localeCompare(b.name);
  });

  return agents;
}

function discoverSchemas() {
  const files = fs
    .readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith(".py") && !f.startsWith("__"))
    .sort();

  const schemas = [];

  for (const f of files) {
    const content = readFile(path.join(SCHEMAS_DIR, f));
    const moduleDoc = extractDocstringPurpose(content);

    const classRe = /^class\s+(\w+)\s*\(\s*BaseModel\s*\)/gm;
    let cm;
    while ((cm = classRe.exec(content)) !== null) {
      const className = cm[1];
      const classStart = cm.index;
      const nextClass = content.indexOf("\nclass ", classStart + 1);
      const classBody = nextClass > 0 ? content.slice(classStart, nextClass) : content.slice(classStart);

      const fieldRe = /^\s+(\w+)\s*[:=]/gm;
      const fields = [];
      let fm;
      while ((fm = fieldRe.exec(classBody)) !== null) {
        const fieldName = fm[1];
        if (["pass", "return", "if", "for", "while", "def", "class", "try", "except", "with", "async", "await", "raise", "yield", "import", "from", "else", "elif"].includes(fieldName)) continue;
        fields.push(fieldName);
      }

      schemas.push({
        name: className,
        file: `schemas/${f}`,
        fields,
        purpose: moduleDoc || `${className} schema.`,
      });
    }
  }

  return schemas;
}

function main() {
  ensureDir(OUT_DIR);

  const agents = discoverAgents();
  fs.writeFileSync(
    path.join(OUT_DIR, "agent-catalog.json"),
    JSON.stringify({ agents }, null, 2)
  );
  console.log(`Discovered ${agents.length} agents`);

  const schemas = discoverSchemas();
  fs.writeFileSync(
    path.join(OUT_DIR, "schema-registry.json"),
    JSON.stringify({ schemas }, null, 2)
  );
  console.log(`Discovered ${schemas.length} schemas`);
}

main();
