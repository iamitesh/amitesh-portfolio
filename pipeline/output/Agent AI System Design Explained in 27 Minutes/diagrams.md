### 1. The Agentic Loop: From Goal to Action

Illustrates the core agent loop from Section 1, What Is an Agentic AI System — decompose a goal, act through tools, update state, and repeat until a stopping condition is reached.

```mermaid
flowchart TD
    A["User goal"] --> B["Decompose the goal into steps"]
    B --> C["Pick the next step"]
    C --> D{"Does the step need a tool?"}
    D -- "Yes" --> E["Call the tool through a strict API"]
    E --> F["Inspect the structured result"]
    D -- "No" --> F
    F --> G["Update state and memory"]
    G --> H{"Stopping condition reached?"}
    H -- "No" --> C
    H -- "Yes" --> I["Answer or act on the world"]
```

### 2. Single-Agent vs. Multi-Agent: A Design Tradeoff

Illustrates Section 2, Single-Agent vs. Multi-Agent Systems, and the tradeoff between one control loop and many specialized roles with contracts.

```mermaid
flowchart TD
    subgraph SA["Single-agent system"]
        A1["One agent owns the whole workflow"]
        A2["Classify, retrieve context, call APIs"]
        A3["Ask for confirmation, then respond"]
        A1 --> A2 --> A3
    end
    subgraph MA["Multi-agent system"]
        B1["Planner agent"]
        B2["Knowledge agent"]
        B3["Coding agent"]
        B4["Reviewer agent"]
        B5["Executor agent"]
        B1 --> B2 --> B3 --> B4 --> B5
    end
    U["User request"] --> A1
    U --> B1
    A3 --> T1["Tradeoff: one control loop, simpler debugging"]
    B5 --> T2["Tradeoff: defined roles and contracts, more coordination"]
```

### 3. Model Routing: Matching Model Strength to Each Step

Illustrates the model-layer strategy from Section 3, The Model Layer — send each step to a cheap model or a strong one based on complexity, and demand structured outputs everywhere.

```mermaid
flowchart TD
    U["User request arrives"] --> I{"What does this step need?"}
    I -- "Intent classification" --> C["Small, fast model"]
    I -- "Fields into a schema" --> S["Structured output: JSON schema or Pydantic"]
    I -- "Ambiguity or deep reasoning" --> R["Frontier reasoning model"]
    C --> O["Validated structured output"]
    S --> O
    R --> O
    O --> F{"Output invalid or model failed?"}
    F -- "Yes" --> RT["Retry or take a fallback path"]
    F -- "No" --> N["Continue to the next step"]
```

### 4. Memory and State: Data Architecture First

Illustrates Section 5, Memory and State — keep workflow state separate from memory, and choose each store by access pattern.

```mermaid
flowchart TD
    A["Data from the agent run"] --> D{"What will this data be used for?"}
    D -- "Conversation and workflow state" --> L["Low-latency store: Redis, DynamoDB, Postgres, MongoDB"]
    D -- "Application state" --> AP["Your application database"]
    D -- "Knowledge retrieval" --> V["Vector or search store: Pinecone, pgvector, Weaviate, Elasticsearch"]
    D -- "Long-term archives" --> OB["Cheap object storage: S3"]
    L --> P["Pass only the smallest useful context to the model"]
    AP --> P
    V --> P
    OB --> P
```

### 5. The Orchestrated Lifecycle of One Request

Illustrates the explicit control flow from Section 6, Orchestration — one user request moving through intent, context, tools, confirmation, response, and asynchronous evaluation.

```mermaid
sequenceDiagram
    participant U as User
    participant O as Orchestrator
    participant M as Model
    participant T as Tools and APIs
    participant E as Eval pipeline

    U->>O: message with a request
    O->>M: classify the intent and check scope
    M-->>O: intent and scope result
    O->>M: retrieve the smallest useful context
    O->>T: validate inputs and call the tool
    T-->>O: structured result or structured error
    alt result needs user confirmation
        O-->>U: propose the action for approval
        U-->>O: confirm or decline
    end
    O->>T: execute the high-risk action
    T-->>O: structured result
    O->>U: final response
    O->>E: send the trace for evaluation
```

### 6. The Approval Gate: Suggest, Validate, Approve, Execute

Illustrates the human-in-the-loop pattern from Section 8, Approval Gates and Policy Control — the model suggests, code validates, the user approves, and only then does the tool execute.

```mermaid
stateDiagram-v2
    [*] --> Proposed: model suggests a high-impact action
    Proposed --> Validated: deterministic code checks ownership and policy
    Validated --> Awaiting: user confirmation is required
    Awaiting --> Approved: user approves the exact action
    Approved --> Executed: the tool executes the action
    Validated --> Rejected: a check fails
    Awaiting --> Rejected: user declines
    Executed --> [*]
    Rejected --> [*]
```
