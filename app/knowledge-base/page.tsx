import type { Metadata } from "next";
import styles from "./knowledge-base.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Knowledge Base | Amitesh Anand",
  description: "Architecture notes, system-design references, and engineering playbooks covering AI agents, React, microfrontends, design systems, RAG, and MCP.",
};

const topics = [
  {
    index: "01",
    title: "Agentic AI System Design",
    description: "Complete production reference: single vs multi-agent systems, model routing, tool contracts, memory, orchestration, evaluation, approval gates, reliability, cost, RAG, observability, security, and privacy.",
    href: "/knowledge-base/agentic-ai-system-design/",
    tags: ["Agentic AI", "Architecture", "RAG", "Security", "Evals"],
    featured: true,
  },
  {
    index: "02",
    title: "React Architecture",
    description: "A practical decision guide for component boundaries, state ownership, rendering, data fetching, performance, accessibility, and maintainable frontend systems.",
    href: "/knowledge-base/react-architecture/",
    tags: ["React", "Frontend", "Performance"],
  },
  {
    index: "03",
    title: "Microfrontend Architecture",
    description: "How to split independently delivered frontend domains while keeping contracts, routing, shared dependencies, design systems, and observability under control.",
    href: "/knowledge-base/microfrontends/",
    tags: ["Microfrontends", "Next.js", "Platform"],
  },
  {
    index: "04",
    title: "Enterprise Design Systems",
    description: "Tokens, component contracts, Web Components, Storybook, accessibility, framework parity, governance, and release strategies for large design-system platforms.",
    href: "/knowledge-base/design-systems/",
    tags: ["Design Systems", "Web Components", "Accessibility"],
  },
  {
    index: "05",
    title: "RAG & MCP Engineering",
    description: "A systems view of retrieval pipelines and Model Context Protocol: context selection, tool boundaries, permissions, structured outputs, grounding, and evaluation.",
    href: "/knowledge-base/rag-and-mcp/",
    tags: ["RAG", "MCP", "Tools", "LLMs"],
  },
];

export default function KnowledgeBasePage() {
  return (
    <main className={styles.shell}>
      <div className={styles.wrap}>
        <header className={styles.topbar}>
          <a className={styles.brand} href={`${basePath}/`}>AA / Knowledge Base</a>
          <a className={styles.back} href={`${basePath}/`}>← Portfolio</a>
        </header>

        <section className={styles.hero}>
          <span className={styles.eyebrow}>Engineering reference library</span>
          <h1>Knowledge Base</h1>
          <p>
            A growing set of architecture notes and production playbooks. Each route is designed as a reusable reference for system design, implementation decisions, and engineering trade-offs.
          </p>
          <div className={styles.stats}>
            <span className={styles.pill}>05 reference routes</span>
            <span className={styles.pill}>Frontend architecture</span>
            <span className={styles.pill}>Applied AI</span>
            <span className={styles.pill}>Platform engineering</span>
          </div>
        </section>

        <section className={styles.grid} aria-label="Knowledge base topics">
          {topics.map((topic) => (
            <a
              key={topic.href}
              className={`${styles.card} ${topic.featured ? styles.cardFeatured : ""}`}
              href={`${basePath}${topic.href}`}
            >
              <span className={styles.index}>[{topic.index}]</span>
              <span className={styles.arrow} aria-hidden="true">↗</span>
              <h2>{topic.title}</h2>
              <p>{topic.description}</p>
              <div className={styles.tags}>
                {topic.tags.map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}
              </div>
            </a>
          ))}
        </section>

        <footer className={styles.footer}>Built into the portfolio as static Next.js routes for reliable GitHub Pages deployment.</footer>
      </div>
    </main>
  );
}
