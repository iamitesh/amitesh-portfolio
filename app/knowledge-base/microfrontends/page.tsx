import type { Metadata } from "next";
import TopicPage from "../topic-page";

export const metadata: Metadata = { title: "Microfrontend Architecture | Knowledge Base" };

export default function Page() {
  return <TopicPage
    eyebrow="Distributed frontend architecture"
    title="Microfrontend Architecture"
    intro="A system-design guide for splitting frontend domains across teams while keeping routing, shared dependencies, UI consistency, deployment, and runtime failures understandable."
    tags={["Microfrontends", "Next.js", "Contracts", "Platform", "Observability"]}
    note="Split by business capability only when independent ownership and deployment are worth the operational cost. A modular monolith is often the better starting point."
    sections={[
      { title: "Choose the boundary", body: "A useful microfrontend boundary aligns with a durable business capability and a team that can own its delivery end to end.", bullets: ["Avoid splitting by tiny UI fragments", "Define ownership before technology", "Keep cross-domain data contracts explicit"] },
      { title: "Composition strategy", body: "Composition can happen at build time, server time, route level, or in the browser. Pick the simplest mechanism that meets independent-delivery requirements.", bullets: ["Route-level composition is easiest to reason about", "Runtime composition increases failure modes", "Design loading and fallback behavior for every remote boundary"] },
      { title: "Shared dependencies", body: "Framework, design-system, authentication, analytics, and utility dependencies need version and compatibility policies.", bullets: ["Do not assume singleton compatibility", "Publish stable shared contracts", "Keep design tokens and primitives synchronized", "Avoid hidden global state between independently deployed apps"] },
      { title: "Routing & communication", body: "Cross-app communication should look more like API design than ad-hoc event wiring.", bullets: ["Prefer URL and backend state for durable coordination", "Use typed events only for narrow runtime signals", "Document ownership of navigation and authentication"] },
      { title: "Operations", body: "Independent deployment means independent failure. Observability and release governance must be designed before scale arrives.", bullets: ["Trace remote loading failures", "Track version combinations", "Use contract tests", "Support progressive rollout and rollback"] },
    ]}
  />;
}
