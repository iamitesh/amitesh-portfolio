import type { Metadata } from "next";
import TopicPage from "../topic-page";

export const metadata: Metadata = { title: "React Architecture | Knowledge Base" };

export default function Page() {
  return <TopicPage
    eyebrow="Frontend system design"
    title="React Architecture"
    intro="A practical reference for deciding boundaries, ownership, rendering strategy, data flow, and performance in React applications without turning every concern into framework ceremony."
    tags={["React", "Next.js", "State", "Performance", "Accessibility"]}
    note="Prefer explicit ownership and boring data flow. Add abstraction only when it removes repeated complexity rather than merely hiding it."
    sections={[
      { title: "Component boundaries", body: "Split by responsibility and change cadence, not by arbitrary file size. Components should expose small, typed interfaces and keep implementation details local.", bullets: ["Prefer composition over giant configurable components", "Keep domain logic out of visual primitives", "Use stable contracts between feature and shared layers"] },
      { title: "State ownership", body: "Put state as close as possible to the consumers that own it. Promote state only when multiple branches genuinely need coordinated updates.", bullets: ["Local UI state stays local", "Server state belongs to the data layer", "Derived values should usually be computed, not duplicated", "Global state is an architectural dependency—treat it accordingly"] },
      { title: "Rendering & data", body: "Choose server rendering, static generation, streaming, or client rendering per route and interaction instead of defaulting the whole application to one mode.", bullets: ["Fetch close to the server boundary when possible", "Keep client components focused on interaction", "Design loading, error, and empty states as first-class states"] },
      { title: "Performance", body: "Measure before optimizing. Most React performance work is about reducing unnecessary work, loading less JavaScript, and keeping expensive trees isolated.", bullets: ["Code split meaningful route or feature boundaries", "Virtualize large collections", "Memoize only when profiling shows value", "Track bundle size, interaction latency, and rendering hot spots"] },
      { title: "Quality", body: "Architecture is incomplete without accessibility, testability, observability, and predictable failure behavior.", bullets: ["Semantic HTML before ARIA", "Test user-visible behavior", "Use error boundaries around recoverable UI regions", "Log failures with enough context to reproduce them"] },
    ]}
  />;
}
