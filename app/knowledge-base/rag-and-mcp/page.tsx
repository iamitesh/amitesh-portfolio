import type { Metadata } from "next";
import TopicPage from "../topic-page";

export const metadata: Metadata = { title: "RAG & MCP Engineering | Knowledge Base" };

export default function Page() {
  return <TopicPage
    eyebrow="Applied AI engineering"
    title="RAG & MCP Engineering"
    intro="A systems view of retrieval and tool integration: how to select context, expose capabilities, enforce permissions, structure outputs, evaluate grounding, and keep model behavior inside application boundaries."
    tags={["RAG", "MCP", "Retrieval", "Tools", "Structured Outputs"]}
    note="Treat retrieved content and tool output as untrusted data. Application code—not the model—owns permissions, validation, execution, and business rules."
    sections={[
      { title: "Retrieval pipeline", body: "Good RAG starts before the vector search call. Chunking, metadata, freshness, filtering, reranking, and source attribution all shape answer quality.", bullets: ["Chunk around meaningful semantic boundaries", "Filter by tenant, product, policy, and freshness when relevant", "Use hybrid search when lexical precision matters", "Rerank before sending context to the model"] },
      { title: "Context selection", body: "The model should receive the smallest useful context for the current step rather than every available document or conversation turn.", bullets: ["Separate workflow state from long-term memory", "Summarize long conversations", "Prefer authoritative sources", "Do not let retrieved text override system or developer instructions"] },
      { title: "MCP & tool contracts", body: "MCP standardizes how tools, resources, and context can be exposed, but the architecture principles remain the same with or without it.", bullets: ["Clear tool name and description", "Typed input and output schemas", "Timeout and retry behavior", "Permission boundaries", "Structured errors and logs"] },
      { title: "Safety & permissions", body: "Read operations and write operations should have different risk levels, with high-impact actions protected by deterministic checks and approval gates.", bullets: ["Least-privilege credentials", "Validate identity and ownership", "Require confirmation for destructive or financial actions", "Never execute raw model-generated SQL or shell commands"] },
      { title: "Evaluation", body: "Evaluate retrieval and tool traces, not just the final prose response.", bullets: ["Retrieval hit rate", "Citation/source correctness", "Tool selection accuracy", "Argument validity", "Policy compliance", "Task completion and cost per successful task"] },
    ]}
  />;
}
