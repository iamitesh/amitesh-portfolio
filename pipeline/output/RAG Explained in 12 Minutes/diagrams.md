## Diagrams

The six figures below mirror the interactive deck in diagrams.html: figures 1 and 2 frame what RAG is and why it beats context stuffing, figures 3 and 4 dissect the architecture, and figures 5 and 6 map the ten patterns of 2026.

### 1. RAG at a Glance: Closed Book vs. Open Book

Shows the open-book-exam contrast from Section 1, "What Is RAG?": the LLM alone answers from memory, while RAG adds a retrieval system so that generation is grounded in your sources.

```mermaid
flowchart TD
    subgraph NO["LLM alone: closed-book exam"]
        N1["User question"]
        N2["Model answers from memorized training data only"]
        N3["Stale knowledge, no access to your data, hallucination risk"]
        N1 --> N2 --> N3
    end
    subgraph RAG["RAG: open-book exam"]
        R1["User question"]
        R2["Retrieval system: documents, databases, knowledge base"]
        R3["Relevant chunks added to the prompt"]
        R4["LLM generates an answer grounded in the chunks"]
        R1 --> R2 --> R3 --> R4
    end
```

### 2. Context Stuffing vs. Retrieved Context: Cost, Latency, Accuracy

Maps the second misconception from Section 2, "Two Misconceptions That Persist": bigger context windows lose to RAG on cost, latency, and accuracy.

```mermaid
flowchart TD
    Q["User query"]
    Q --> A["Stuff the whole corpus into a million-token prompt"]
    Q --> B["RAG: surface only the right information"]
    A --> A1["Cost: astronomically expensive per query"]
    A --> A2["Latency: slow calls"]
    A --> A3["Accuracy: signal buried in noise"]
    B --> B1["Cost: only relevant tokens processed"]
    B --> B2["Latency: fast"]
    B --> B3["Accuracy: precise context beats noise"]
```

### 3. The Indexing Pipeline: Chunking, Embedding, Storing

Follows the offline half of Section 3, "Inside the Architecture: How RAG Works": the chunking strategies, embedding models, and vector database covered in Sections 3.1 through 3.3.

```mermaid
flowchart TD
    DOC["Source documents: PDFs, Markdown, code, databases"]
    DOC --> S1["Fixed-size chunking: uniform cuts that break sentences"]
    DOC --> S2["Semantic chunking: split where the topic shifts"]
    DOC --> S3["Document-aware chunking: respect sections and headers"]
    DOC --> S4["Hierarchical chunking: small chunk plus parent context"]
    S1 --> EMB["Embedding model: each chunk becomes a vector"]
    S2 --> EMB
    S3 --> EMB
    S4 --> EMB
    EMB --> VDB[(Vector database)]
```

### 4. Query Time: Hybrid Retrieval and Grounded Generation

Traces the online path through Sections 3.2 and 3.4 of "Inside the Architecture": embedding the query, hybrid search, and prompt assembly before the LLM writes.

```mermaid
flowchart TD
    Q4["User question"] --> QE["Query embedding: same model as the chunks"]
    QE --> VS["Vector search: nearest neighbors by meaning"]
    QE --> KS["Keyword search: exact-term matches"]
    VDB[(Vector database)] --> FLT["Metadata filters first: date, source, category"]
    FLT --> VS
    VS --> TOP["Top-K chunks"]
    KS --> TOP
    TOP --> PR["Prompt: question plus retrieved chunks"]
    PR --> GEN["LLM generates a grounded answer"]
```

### 5. Ten RAG Patterns: The Evolution of an Architecture

Compresses all of Section 4, "Ten RAG Patterns to Know in 2026", into one progression that also doubles as the rebuttal to the 'RAG is dead' myth from Section 2.1.

```mermaid
flowchart TD
    subgraph F["Foundations: patterns 1-2"]
        P1["1. Simple RAG: retrieve, then generate"]
        P2["2. RAG with Memory: context across turns"]
        P1 --> P2
    end
    subgraph S["Smarter retrieval: patterns 3-5"]
        P3["3. Branch RAG: sub-questions, parallel retrieval"]
        P4["4. HyDE: embed a hypothetical answer instead"]
        P5["5. Adaptive RAG: router decides if retrieval is needed"]
        P3 --> P4 --> P5
    end
    subgraph Q["Quality gates: patterns 6-7"]
        P6["6. Corrective RAG: evaluate, retry, or web search"]
        P7["7. Self-RAG: reflection tokens while writing"]
        P6 --> P7
    end
    subgraph N["The frontier: patterns 8-10"]
        P8["8. Agentic RAG: LLM orchestrates search and tools"]
        P9["9. Multimodal RAG: images, tables, charts"]
        P10["10. Graph RAG: maps entity relationships"]
        P8 --> P9 --> P10
    end
    P2 --> P3
    P5 --> P6
    P7 --> P8
```

### 6. Agentic RAG: The Orchestrator Loop

Zooms into the pattern from Section 4.8, where the LLM orchestrates retrieval, APIs, and code in a loop until it has enough context to answer.

```mermaid
sequenceDiagram
    participant U as User
    participant O as LLM orchestrator
    participant R as Retriever and search
    participant T as Code and API tools
    U->>O: Complex multi-step question
    loop Decide, act, observe
        O->>O: What next: search, run a tool, or answer?
        alt More information needed
            O->>R: Retrieve from another source
            R-->>O: Relevant chunks
        else Tool call needed
            O->>T: Run code or call an API
            T-->>O: Tool result
        else Enough context already
            Note over O: Exit the loop
        end
    end
    O-->>U: Final grounded answer
```
