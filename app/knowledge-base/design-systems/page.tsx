import type { Metadata } from "next";
import TopicPage from "../topic-page";

export const metadata: Metadata = { title: "Enterprise Design Systems | Knowledge Base" };

export default function Page() {
  return <TopicPage
    eyebrow="Enterprise UI platforms"
    title="Enterprise Design Systems"
    intro="A reference for designing scalable tokens, components, framework adapters, accessibility, documentation, governance, and release workflows across large product ecosystems."
    tags={["Design Systems", "Web Components", "Tokens", "Storybook", "WCAG"]}
    note="A design system is a product and a platform. Component code is only one layer; adoption, contracts, governance, documentation, and migration paths determine whether it scales."
    sections={[
      { title: "Start with contracts", body: "Components should have explicit API, behavior, accessibility, styling, and compatibility contracts before implementation details dominate the discussion.", bullets: ["Define props, events, slots, states, and errors", "Document keyboard and screen-reader behavior", "Version behavior changes intentionally"] },
      { title: "Token architecture", body: "Separate primitive values from semantic decisions and component-level mappings so brand and theme changes remain controlled.", bullets: ["Primitive → semantic → component tokens", "Keep naming stable and technology-neutral", "Automate source-to-platform transformations", "Validate contrast and theme completeness"] },
      { title: "Cross-framework delivery", body: "Web Components can provide a durable runtime primitive while framework wrappers improve ergonomics. Whatever the strategy, parity needs automated verification.", bullets: ["Keep the canonical component contract framework-neutral", "Test React and Angular integration paths", "Avoid wrapper-only behavior that fragments the API"] },
      { title: "Quality gates", body: "Design-system quality should be automated because every defect is multiplied across consuming products.", bullets: ["Visual and interaction regression", "Accessibility checks", "Bundle and runtime performance", "API/schema validation", "Security and dependency checks"] },
      { title: "Governance & adoption", body: "A healthy design system publishes migration guidance, deprecation timelines, contribution rules, and measurable adoption signals.", bullets: ["Track usage and version distribution", "Provide codemods or migration tooling", "Maintain release notes and examples", "Use contribution review to preserve consistency"] },
    ]}
  />;
}
