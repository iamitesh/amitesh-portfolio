### 1. Keyword Match vs. Meaning Match: The Problem Vector Databases Solve

Illustrates Section 1, Why Traditional Databases Fall Short: the same question either dies on exact keyword matching or succeeds on meaning matching.

```mermaid
flowchart TD
    Q["Question: how many days off do I get per year"]
    Q --> K1
    Q --> M1

    subgraph TRAD["Traditional database - matches words literally"]
        K1["Looks for the exact words of the question"]
        K2["The word vacation never appears in the query"]
        K3["No documents match"]
        K1 --> K2 --> K3
    end

    subgraph SEM["Vector database - matches meaning"]
        M1["Asks what the question is about"]
        M2["Vacation policy and HR rules are nearby in meaning"]
        M3["Relevant documents are returned"]
        M1 --> M2 --> M3
    end

    K3 --> FAIL["Search fails - employee gets no answer"]
    M3 --> WIN["Search succeeds - the policy is found"]
```

### 2. Embeddings: Turning Words, Images, and Behavior into Points in Space

Illustrates Section 2, Vectors and Embeddings: meaning becomes geometry, and vector arithmetic follows meaning.

```mermaid
flowchart TD
    W1["Words and sentences"] --> EM
    W2["Images"] --> EM
    W3["User behavior"] --> EM
    EM["Embedding model converts any input into numbers"]
    EM --> VEC["Vector: a list of numbers"]
    VEC --> PNT["The vector becomes a point in space"]
    PNT --> NEAR["Similar meanings land close together"]
    PNT --> AR["king minus man plus woman"]
    AR --> QUEEN["Lands very close to the vector for queen"]
```

### 3. Similarity Search: What a Vector Database Does With Millions of Vectors

Illustrates Section 3, What a Vector Database Actually Does: an index is built once, and every query becomes a fast nearest-neighbor search.

```mermaid
flowchart TD
    subgraph INDEX["Before the query - build the index"]
        DOCS["Millions of documents"] --> EMB1["Embedding model"]
        EMB1 --> VDB[("Vector database")]
    end

    subgraph ASK["At query time - find the nearest neighbors"]
        Q["User question"] --> QV["Converted to a vector the same way"]
        QV --> NN["Search the index for the closest vectors in meaning"]
        VDB --> NN
        NN --> TOP["Top few closest documents, returned fast"]
    end
```

### 4. RAG: The LLM Goes From a Closed-Book Exam to an Open-Book Exam

Illustrates Sections 4.1 and 4.2, Closed-Book vs. Open-Book Exams and the RAG Pipeline, Step by Step: retrieval turns the vector database into the textbook the LLM reads before answering.

```mermaid
flowchart TD
    Q["User asks about company documents"]
    Q --> CB["Closed book: the LLM relies on training memory alone"]
    CB --> HALL["Confident guess or hallucination"]

    subgraph TEXTBOOK["Build the textbook - index the documents"]
        DOC["HR policies, manuals and contracts"] --> CH["Split into chunks"]
        CH --> EMB["Embedding model"]
        EMB --> VDB[("Vector database")]
    end

    Q --> EMBQ["Question embedded into a vector"]
    EMBQ --> RET["Similarity search for the closest passages"]
    VDB --> RET
    RET --> TOP["Top passages retrieved"]
    TOP --> OB["Open book: the LLM reads the passages with the question"]
    OB --> ANS["Grounded answer written from real evidence"]
```

### 5. Chunking: Sizing the Passages Before You Embed

Illustrates Section 4.3, Chunking: The Step People Get Wrong, where chunk size trades precision against context.

```mermaid
flowchart TD
    DOC["A document to search"] --> SPL["Split into chunks before embedding"]
    SPL --> BIG["Chunks too large"]
    BIG --> BL["Precision loss: each chunk mixes many topics"]
    SPL --> TINY["Chunks too small"]
    TINY --> TL["Context loss: meaning is sliced apart"]
    SPL --> SW["Sweet spot: 300 to 500 tokens per chunk"]
    SW --> OV["50 to 100 tokens of overlap between chunks"]
    OV --> SAVE["An answer straddling a boundary survives intact"]
    SW --> SEM["Use a semantic chunker when the framework supports it"]
```

### 6. The Mental Model: Embed, Store, Match — and Do It Again

Illustrates Sections 6 and 7, Vector Databases Beyond RAG and the Mental Model That Makes It All Click: retrieval, recommendations, visual search, and anomaly detection all run the same loop.

```mermaid
stateDiagram-v2
    [*] --> Embed
    Embed --> Store: turn data into vectors
    Store --> Match: keep similarity search fast at scale
    Match --> Embed: new data feeds the loop again
    Match --> Apply: retrieve, recommend, match or alert
    Apply --> [*]
```
