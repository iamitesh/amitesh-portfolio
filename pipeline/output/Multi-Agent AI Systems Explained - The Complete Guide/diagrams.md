## Diagrams

### 1. From One Generalist to a Coordinated Team

Illustrates Section 1 (Why Multi-Agent AI Systems?) — the shift from an overloaded single generalist to an orchestrator-led team of specialists.

```mermaid
flowchart TD
    Goal["A complex job: research, analyze, write, validate, format"]
    subgraph solo["The freelancer route: one generalist agent"]
        SoloAgent["One brain, one limited context window"]
        SoloFail["Context bloat and compounding errors"]
    end
    subgraph team["The agency route: a team of specialists"]
        Orc["Orchestrator: plans, delegates and stitches output"]
        R1["Researcher agent"]
        R2["Analyst agent"]
        R3["Writer agent"]
        R4["Validator agent"]
    end
    Result["One coherent deliverable"]
    Benefits["Parallelization, specialization and scalability"]
    Goal -->|"single agent"| SoloAgent
    SoloAgent --> SoloFail
    SoloFail --> Weak["Weak reliability on complex work"]
    Goal -->|"orchestrated team"| Orc
    Orc --> R1
    Orc --> R2
    Orc --> R3
    Orc --> R4
    R1 --> Result
    R2 --> Result
    R3 --> Result
    R4 --> Result
    Result --> Benefits
```

### 2. The Four Design Patterns at a Glance

Illustrates Section 2 (The Four Design Patterns) — the four production topologies, with the reminder that real systems combine them.

```mermaid
flowchart TD
    subgraph p1["Pattern 1: Orchestrator-Worker"]
        O1["Orchestrator plans and delegates"]
        W1["Worker"]
        W2["Worker"]
        W3["Worker"]
        O1 --> W1
        O1 --> W2
        O1 --> W3
    end
    subgraph p2["Pattern 2: Hierarchical"]
        O2["Master orchestrator"]
        D1["Mid-level orchestrator"]
        D2["Mid-level orchestrator"]
        T1["Worker team"]
        T2["Worker team"]
        O2 --> D1
        O2 --> D2
        D1 --> T1
        D2 --> T2
    end
    subgraph p3["Pattern 3: Peer-to-Peer"]
        A1["Agent"]
        B1["Agent"]
        C1["Agent"]
        A1 <--> B1
        B1 <--> C1
        C1 <--> A1
    end
    subgraph p4["Pattern 4: Pipeline"]
        S1["Step: extract"]
        S2["Step: transform"]
        S3["Step: load"]
        S1 --> S2 --> S3
    end
    Mix["Real systems combine patterns, e.g. orchestrator-worker with pipelines inside the workers"]
```

### 3. Autonomous Research: A Question Becomes a Report

Illustrates Section 3.1 (Autonomous Research and Analysis) — parallel specialists turn a question into a structured report in minutes.

```mermaid
sequenceDiagram
    participant U as User
    participant O as Orchestrator
    participant S as Web Search Agent
    participant D as Internal Docs Agent
    participant A as Synthesis Agent
    U->>O: Submit the research question
    O->>O: Decompose into subtasks and gaps
    par Run research in parallel
        O->>S: Search the web and rank sources
        O->>D: Pull internal documents and data
    end
    S-->>O: Ranked external findings
    D-->>O: Internal context
    O->>A: Hand over all material
    loop Fill remaining gaps
        A-->>O: Ask for missing pieces
        O->>S: Run targeted searches
        S-->>O: New sources
    end
    A-->>O: Structured report draft
    O->>U: Final report with sources and gaps
```

### 4. Customer Support: Triage to Human Review

Illustrates Section 3.2 (Customer Support Automation) — triage through resolution, escalating to a human only when the case is complex enough.

```mermaid
flowchart TD
    Q["Incoming customer query"]
    T["Triage agent: classify the issue"]
    Acc["Account agent: pull history"]
    KB["Knowledge base agent: find known fixes"]
    Draft["Resolution agent: draft the answer"]
    Check{"Complex or high stakes?"}
    Auto["Answer sent automatically"]
    Human["Routed to human review"]
    Done["Query resolved"]
    Q --> T
    T --> Acc
    T --> KB
    Acc --> Draft
    KB --> Draft
    Draft --> Check
    Check -->|"No"| Auto
    Check -->|"Yes"| Human
    Auto --> Done
    Human --> Done
```

### 5. Software Development and QA: The Self-Correcting Loop

Illustrates Section 3.3 (Software Development and QA) — agents that write, run, test and review code in a self-correcting loop.

```mermaid
flowchart TD
    Plan["Task from the orchestrator"]
    Code["Coding agent: write the code"]
    Run["Sandbox agent: run it safely"]
    Test["Testing agent: write and run tests"]
    Review{"Review agent: any bugs?"}
    Fix["Fix agent: patch and re-enter loop"]
    Deliver["Delivered code"]
    Plan --> Code
    Code --> Run
    Run --> Test
    Test --> Review
    Review -->|"Issues found"| Fix
    Fix --> Code
    Review -->|"Clean"| Deliver
```

### 6. Five Mistakes, Five Guardrails: The Build Path

Illustrates Section 4 (Five Mistakes to Avoid When Building Multi-Agent Systems) — each common mistake paired with the guardrail that prevents it, ending at Section 5's rule: start small and ship.

```mermaid
flowchart TD
    Start(["New multi-agent build"])
    G1["1. Decompose roles and handoffs on paper"]
    G2["2. Design memory and shared state on day one"]
    G3["3. Add retries, fallbacks and checkpoints"]
    G4["4. Trace and evaluate every agent step"]
    G5["5. Start with one orchestrator and two workers"]
    Ship(["Working end to end"])
    Scale["Grow the team only at a real ceiling"]
    M1["Mistake: jump straight into code"]
    M2["Mistake: ignore memory architecture"]
    M3["Mistake: happy paths only"]
    M4["Mistake: skip observability"]
    M5["Mistake: eight agents on day one"]
    Start --> G1
    G1 --> G2
    G2 --> G3
    G3 --> G4
    G4 --> G5
    G5 --> Ship
    Ship --> Scale
    G1 -.->|"instead of"| M1
    G2 -.->|"instead of"| M2
    G3 -.->|"instead of"| M3
    G4 -.->|"instead of"| M4
    G5 -.->|"instead of"| M5
```
