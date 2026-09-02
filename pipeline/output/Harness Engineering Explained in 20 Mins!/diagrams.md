### 1. The Horse and the Harness: Turning Raw Power into Directed Work

Illustrates Section 2.1, The Horse and the Harness, and Section 2.2, What an LLM Can and Cannot Do on Its Own — the same model alone is a pure function, while the same model in a harness produces directed work.

```mermaid
flowchart LR
    subgraph A1["Bare model alone"]
        direction TB
        a1["No persistent state"]
        a2["Cannot run code or read files"]
        a3["Cannot make API calls"]
        a4["Cannot verify a claim"]
        a5["Pure function: tokens in, tokens out"]
        a1 --> a2 --> a3 --> a4 --> a5
    end
    subgraph A2["Same model in a harness"]
        direction TB
        b1["Tools it may call"]
        b2["Context piped in before each run"]
        b3["Checks that run on outputs"]
        b4["Permission boundaries and logging"]
        b5["Directed, useful work"]
        b1 --> b5
        b2 --> b5
        b3 --> b5
        b4 --> b5
    end
    a5 -. "the difference is the harness" .-> b5
```

### 2. Three Disciplines: Prompt, Context, and Harness Engineering

Illustrates Section 2.3, Where Harness Engineering Sits Next to Prompt and Context Engineering — each discipline governs a bigger span, from a single exchange to the whole autonomous run.

```mermaid
flowchart TD
    P["Prompt engineering"] --> P1["What you say to the horse"]
    P1 --> P2["One instruction, one output"]
    C["Context engineering"] --> C1["What you let the horse see"]
    C1 --> C2["Retrieval that fits the window"]
    H["Harness engineering"] --> H1["Everything else that keeps the horse on the track"]
    H1 --> H2["Which tools the agent gets"]
    H1 --> H3["Where its information comes from"]
    H1 --> H4["How it validates its own work"]
    H1 --> H5["When it stops and hands back to a human"]
```

### 3. Chat, Work, and Codex: Three Harnesses in One App

Illustrates Section 3, Finding the Harness in the ChatGPT Desktop App — the same model family behaves like three different products as the harness gets heavier.

```mermaid
flowchart TD
    M["Same model family — one desktop app"]
    M --> c1
    M --> w1
    M --> x1
    subgraph S1["Chat — thin harness"]
        direction TB
        c1["System prompt shapes behavior"]
        c2["Web search and a few tools"]
        c3["Memory across sessions"]
        c4["Sandboxed Python and image generation"]
        c1 --> c2 --> c3 --> c4
    end
    subgraph S2["Work — heavier harness"]
        direction TB
        w1["Planning loop"]
        w2["Connectors that take actions"]
        w3["Approval checkpoints"]
        w4["Scheduled tasks"]
        w1 --> w2 --> w3 --> w4
    end
    subgraph S3["Codex — heaviest harness"]
        direction TB
        x1["Scoped access to a folder"]
        x2["Reads AGENTS.md conventions"]
        x3["Terminal for builds and tests"]
        x4["Inline diffs and PR review"]
        x1 --> x2 --> x3 --> x4
    end
```

### 4. The Five Components of a Production-Grade Harness

Illustrates Section 4, The Five Components of a Production-Grade Harness — the layer you build around the model, and the concrete form each component takes.

```mermaid
flowchart TD
    H["Production-grade harness"] --> C1["1. System of record"]
    H --> C2["2. Tools"]
    H --> C3["3. Feedback loops and verification"]
    H --> C4["4. Guardrails and permissions"]
    H --> C5["5. Observability and memory"]
    C1 --> E1["AGENTS.md and CLAUDE.md"]
    C2 --> E2["A small, deliberate set"]
    C3 --> E3["Linters, type checks, test suites"]
    C4 --> E4["Read-only scopes and approval gates"]
    C5 --> E5["Logs and memory across sessions"]
```

### 5. The Verification Loop: An Agent That Checks Its Own Work

Illustrates Section 4.3, Feedback Loops and Verification, and Step 2 in Section 5.2, Build a Verification Loop — checks run automatically so the agent discovers its own mistakes before you do.

```mermaid
stateDiagram-v2
    [*] --> Plan: goal arrives
    Plan --> Act: break it into steps
    Act --> Verify: the agent takes an action
    Verify --> Fix: a check fails
    Fix --> Verify: it corrects its own work
    Verify --> Handoff: every check passes
    Handoff --> [*]
```

### 6. The Five-Step Roadmap: From One File to One Workflow

Illustrates Section 5, A Five-Step Roadmap to Building Your Own Harness — write one file this week, then add verification, tools, failure reading, and finally one narrow workflow running end to end.

```mermaid
flowchart TD
    S1["Step 1 — write the system of record this week"] --> S2["Step 2 — build a verification loop"]
    S2 --> S3["Step 3 — choose tools deliberately"]
    S3 --> S4["Step 4 — read your failures"]
    S4 --> S5["Step 5 — one harness for one narrow workflow"]
    S5 --> O["Runs end to end without babysitting"]
    S4 -. "each failure names the next fix" .-> S1
```
