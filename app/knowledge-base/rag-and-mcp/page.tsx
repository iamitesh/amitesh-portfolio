import type { Metadata } from "next";
import styles from "../knowledge-base.module.css";
import MermaidDiagram from "../mermaid";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "RAG & MCP Engineering | Knowledge Base",
  description: "A systems view of retrieval pipelines and Model Context Protocol, expanded into two full pipeline articles: RAG Explained and MCP Complete Explanation.",
};

export default function Page() {
  return (
    <main className={styles.shell}>
      <div className={styles.wrap}>
        <header className={styles.topbar}>
          <a className={styles.brand} href={`${basePath}/knowledge-base/`}>AA / Knowledge Base</a>
          <a className={styles.back} href={`${basePath}/knowledge-base/`}>← All notes</a>
        </header>

        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <span className={styles.eyebrow}>Applied AI engineering</span>
            <h1>RAG &amp; MCP Engineering</h1>
            <p>A systems view of retrieval and tool integration: how to select context, expose capabilities, enforce permissions, structure outputs, evaluate grounding, and keep model behavior inside application boundaries. Expanded below into the two full pipeline articles — RAG Explained in 12 Minutes and MCP Complete Explanation — with their original diagrams.</p>
            <div className={styles.tags}>
              {['RAG', 'MCP', 'Retrieval', 'Tools', 'LLMs'].map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}
            </div>
            <div className={styles.quote}>Treat retrieved content and tool output as untrusted data. Application code—not the model—owns permissions, validation, execution, and business rules.</div>
            <nav className={styles.toc} aria-label="Article sections">
                <a href={`#architecture-diagrams`} key="architecture-diagrams">{`RAG Architecture Diagrams`}</a>
                <a href={`#what-is-rag`} key="what-is-rag">{`What Is RAG?`}</a>
                <a href={`#two-misconceptions-that-persist`} key="two-misconceptions-that-persist">{`Two Misconceptions That Persist`}</a>
                <a href={`#inside-the-architecture-how-rag-works`} key="inside-the-architecture-how-rag-works">{`Inside the Architecture: How RAG Works`}</a>
                <a href={`#ten-rag-patterns-to-know-in-2026`} key="ten-rag-patterns-to-know-in-2026">{`Ten RAG Patterns to Know in 2026`}</a>
                <a href={`#where-to-go-from-here`} key="where-to-go-from-here">{`Where to Go From Here`}</a>
                <a href={`#key-takeaways`} key="key-takeaways">{`RAG Key Takeaways`}</a>
                <a href={`#mcp-architecture-diagrams`} key="mcp-architecture-diagrams">{`MCP Architecture Diagrams`}</a>
                <a href={`#why-mcp-exists-the-drawer-of-chargers-problem`} key="why-mcp-exists-the-drawer-of-chargers-problem">{`Why MCP Exists: The Drawer of Chargers Problem`}</a>
                <a href={`#what-mcp-is-the-usb-c-for-ai`} key="what-mcp-is-the-usb-c-for-ai">{`What MCP Is: The USB-C for AI`}</a>
                <a href={`#the-three-pieces-host-client-and-server`} key="the-three-pieces-host-client-and-server">{`The Three Pieces: Host, Client, and Server`}</a>
                <a href={`#where-mcp-sits-inside-an-ai-agent`} key="where-mcp-sits-inside-an-ai-agent">{`Where MCP Sits Inside an AI Agent`}</a>
                <a href={`#mcp-vs-function-calling-apis-and-plugins`} key="mcp-vs-function-calling-apis-and-plugins">{`MCP vs. Function Calling, APIs, and Plugins`}</a>
                <a href={`#finding-mcp-servers`} key="finding-mcp-servers">{`Finding MCP Servers`}</a>
                <a href={`#local-and-remote-servers-how-you-actually-use-one`} key="local-and-remote-servers-how-you-actually-use-one">{`Local and Remote Servers: How You Actually Use One`}</a>
                <a href={`#the-security-reality-no-tutorial-mentions`} key="the-security-reality-no-tutorial-mentions">{`The Security Reality No Tutorial Mentions`}</a>
                <a href={`#building-your-first-mcp-server`} key="building-your-first-mcp-server">{`Building Your First MCP Server`}</a>
                <a href={`#mcp-key-takeaways`} key="mcp-key-takeaways">{`MCP Key Takeaways`}</a>
            </nav>
          </header>

          <section className={styles.section} id="part-a-rag">
            <div className={styles.kicker}>Part A · Retrieval</div>
            <h2>RAG Explained</h2>
            <p>{`If you have been hearing "RAG" everywhere and wondering what it actually is, this guide is for you: it explains what Retrieval-Augmented Generation really is, why some people are getting it wrong, how every component works under the hood, and ten RAG patterns worth knowing in 2026. It distills a video by Aishwarya Srinivasan, a machine-learning practitioner who has spent the last decade working in AI — she holds a master's degree in data science from Columbia University and has worked as a data scientist at Microsoft, Google, and IBM — and who now builds The Gen Academy, an AI skill-building platform focused on what teams are building in production right now. The goal is to explain the *why* behind everything, not just the textbook definitions, for engineers, product managers, and anyone building applications on large language models.`}</p>
          </section>

            <section className={styles.section} id="architecture-diagrams">
              <div className={styles.kicker}>Overview</div>
              <h2>Architecture Diagrams</h2>
              <MermaidDiagram code={"flowchart TD\nQ4[\"User question\"] --> QE[\"Query embedding: same model as the chunks\"]\nQE --> VS[\"Vector search: nearest neighbors by meaning\"]\nQE --> KS[\"Keyword search: exact-term matches\"]\nVDB[(Vector database)] --> FLT[\"Metadata filters first: date, source, category\"]\nFLT --> VS\nVS --> TOP[\"Top-K chunks\"]\nKS --> TOP\nTOP --> PR[\"Prompt: question plus retrieved chunks\"]\nPR --> GEN[\"LLM generates a grounded answer\"]"} caption={`4. Query Time: Hybrid Retrieval and Grounded Generation — Traces the online path through Sections 3.2 and 3.4 of "Inside the Architecture": embedding the query, hybrid search, and prompt assembly before the LLM writes.`} />
            </section>

            <section className={styles.section} id="what-is-rag">
              <div className={styles.kicker}>RAG 01</div>
              <h2>{`What Is RAG?`}</h2>
              <p>{`The analogy that makes RAG click is an open-book exam. You do not have every fact memorized, but you have a pile of textbooks and notes sitting next to you. When a question comes up, you flip through the right sections, read what is relevant, and write your answer based on what you just found. You are not making things up — you are grounding your answer in actual source material. That is exactly what RAG does for a large language model.`}</p>
              <p>{`A standard LLM like GPT, Claude, or Gemini is like a student who only has what they memorized during training. They are smart; they can reason, write, and explain. But their knowledge has a cutoff date, and most importantly, they have no idea what is in your documents, your company's databases, or your internal knowledge base. RAG — retrieval-augmented generation — fixes that. Instead of relying purely on what the model memorized, RAG gives it the ability to look things up first, pull in relevant information, and then generate an answer that is grounded in the retrieved context.`}</p>
              <p>{`RAG is really two things working together:`}</p>
              <div className={styles.panel}>
                <ul>
                  <li>{`a `}<strong>{`retrieval system`}</strong>{` that finds the right information, and`}</li>
                  <li>{`a `}<strong>{`generation system`}</strong>{` — the LLM — that uses that information to answer intelligently.`}</li>
                </ul>
              </div>
              <p>{`That partnership is the whole game. And it is not a marginal technique:`}</p>
              <div className={styles.quote}>{`RAG is not a cool trick. It is the foundation of almost every serious enterprise AI application being built right now.`}</div>
              <p>{`Customer support over internal knowledge bases, internal knowledge assistants, legal document analysis — RAG is underneath every single one of those applications.`}</p>
              <MermaidDiagram code={"flowchart TD\nsubgraph NO[\"LLM alone: closed-book exam\"]\nN1[\"User question\"]\nN2[\"Model answers from memorized training data only\"]\nN3[\"Stale knowledge, no access to your data, hallucination risk\"]\nN1 --> N2 --> N3\nend\nsubgraph RAG[\"RAG: open-book exam\"]\nR1[\"User question\"]\nR2[\"Retrieval system: documents, databases, knowledge base\"]\nR3[\"Relevant chunks added to the prompt\"]\nR4[\"LLM generates an answer grounded in the chunks\"]\nR1 --> R2 --> R3 --> R4\nend"} caption={`1. RAG at a Glance: Closed Book vs. Open Book — Shows the open-book-exam contrast from Section 1, "What Is RAG?": the LLM alone answers from memory, while RAG adds a retrieval system so that generation is grounded in your sources.`} />
            </section>

            <section className={styles.section} id="two-misconceptions-that-persist">
              <div className={styles.kicker}>RAG 02</div>
              <h2>{`Two Misconceptions That Persist`}</h2>
              <p>{`Before going deeper, it is worth addressing the two biggest misconceptions floating around, because both do real damage to how people think about building AI systems.`}</p>
              <h3>{`2.1 Myth: "RAG Is Dead"`}</h3>
              <p>{`People keep saying RAG is dead, and the claim is completely wrong. What actually happened: a few papers came out showing that LLMs can sometimes hallucinate even with retrieved context, and the narrative ran away from there. But RAG is not a single technology — it is an `}<em>{`architectural pattern`}</em>{`, and architectural patterns need to keep evolving. The failure modes got real answers: patterns like corrective RAG, Self-RAG, and agentic RAG, covered later in this article, are all direct responses to earlier limitations of RAG. RAG isn't dying; it is maturing.`}</p>
              <h3>{`2.2 Myth: "Bigger Context Windows Mean You Don't Need RAG"`}</h3>
              <p>{`This one is confusing because it sounds logical. If you can stuff a million tokens into a prompt, why bother building a retrieval system at all? Here is why that does not hold up in practice:`}</p>
              <div className={styles.panel}>
                <ul>
                  <li><strong>{`Cost.`}</strong>{` Processing a million-token context on every single query is astronomically expensive at scale.`}</li>
                  <li><strong>{`Latency.`}</strong>{` Those calls are slow.`}</li>
                  <li><strong>{`Performance.`}</strong>{` This is the one most people overlook: LLMs actually perform worse when overloaded with irrelevant context. Research shows models lose accuracy when the signal is buried in too much noise.`}</li>
                </ul>
              </div>
              <p>{`RAG's job is to surface precisely the right information, so a well-built RAG system consistently outperforms brute-force context stuffing on accuracy, cost, and speed.`}</p>
              <MermaidDiagram code={"flowchart TD\nQ[\"User query\"]\nQ --> A[\"Stuff the whole corpus into a million-token prompt\"]\nQ --> B[\"RAG: surface only the right information\"]\nA --> A1[\"Cost: astronomically expensive per query\"]\nA --> A2[\"Latency: slow calls\"]\nA --> A3[\"Accuracy: signal buried in noise\"]\nB --> B1[\"Cost: only relevant tokens processed\"]\nB --> B2[\"Latency: fast\"]\nB --> B3[\"Accuracy: precise context beats noise\"]"} caption={`2. Context Stuffing vs. Retrieved Context: Cost, Latency, Accuracy — Maps the second misconception from Section 2, "Two Misconceptions That Persist": bigger context windows lose to RAG on cost, latency, and accuracy.`} />
              <MermaidDiagram code={"flowchart TD\nsubgraph F[\"Foundations: patterns 1-2\"]\nP1[\"1. Simple RAG: retrieve, then generate\"]\nP2[\"2. RAG with Memory: context across turns\"]\nP1 --> P2\nend\nsubgraph S[\"Smarter retrieval: patterns 3-5\"]\nP3[\"3. Branch RAG: sub-questions, parallel retrieval\"]\nP4[\"4. HyDE: embed a hypothetical answer instead\"]\nP5[\"5. Adaptive RAG: router decides if retrieval is needed\"]\nP3 --> P4 --> P5\nend\nsubgraph Q[\"Quality gates: patterns 6-7\"]\nP6[\"6. Corrective RAG: evaluate, retry, or web search\"]\nP7[\"7. Self-RAG: reflection tokens while writing\"]\nP6 --> P7\nend\nsubgraph N[\"The frontier: patterns 8-10\"]\nP8[\"8. Agentic RAG: LLM orchestrates search and tools\"]\nP9[\"9. Multimodal RAG: images, tables, charts\"]\nP10[\"10. Graph RAG: maps entity relationships\"]\nP8 --> P9 --> P10\nend\nP2 --> P3\nP5 --> P6\nP7 --> P8"} caption={`5. Ten RAG Patterns: The Evolution of an Architecture — Compresses all of Section 4, "Ten RAG Patterns to Know in 2026", into one progression that also doubles as the rebuttal to the 'RAG is dead' myth from Section 2.1.`} />
            </section>

            <section className={styles.section} id="inside-the-architecture-how-rag-works">
              <div className={styles.kicker}>RAG 03</div>
              <h2>{`Inside the Architecture: How RAG Works`}</h2>
              <p>{`Understanding each component deeply is what separates people who build RAG systems that work from people who build RAG systems that don't. The pipeline breaks down into ingestion, embeddings, storage, and retrieval.`}</p>
              <h3>{`3.1 Ingestion and Chunking`}</h3>
              <p>{`Before anything can be retrieved, a document has to be broken up and stored — and `}<em>{`chunking`}</em>{` is how you break documents up. This matters enormously.`}</p>
              <p>{`The naive approach is `}<strong>{`fixed-size chunking`}</strong>{`: cut each document into, say, 500-token pieces. It sometimes works, but it loses context at the boundaries — if a sentence is cut in half between two chunks, neither chunk makes proper sense.`}</p>
              <p>{`A much better approach is `}<strong>{`semantic chunking`}</strong>{`, where an embedding model detects where the topic shifts in the text and you break on those natural boundaries instead. Tools like LangChain and LlamaIndex have built-in support for this. For structured content — PDFs with sections, Markdown files with headers — `}<strong>{`document-aware chunking`}</strong>{` is even better, because it respects the document's actual structure. And there is a more advanced strategy called `}<strong>{`hierarchical chunking`}</strong>{`, where you store both a small, precise chunk and a larger parent chunk that provides context. When the small chunk is retrieved, the parent is passed to the LLM as well — sometimes called `}<em>{`small-to-big retrieval`}</em>{`, and genuinely one of the best techniques in production RAG.`}</p>
              <h3>{`3.2 Embedding Models`}</h3>
              <p>{`Once documents are chunked, each chunk is converted into an `}<strong>{`embedding`}</strong>{`: a numerical vector that represents the meaning of that text. When a user asks a question, you embed the query too, then find the chunks whose embeddings are closest to the query embedding. That is semantic search.`}</p>
              <p>{`As of 2026, the go-to embedding models include `}<code>{`text-embedding-3-large`}</code>{` from OpenAI, Voyage 3 from Voyage AI, and open-source options such as BGE Large and E5-Mistral from Hugging Face. The strong recommendation is to benchmark embedding models on `}<em>{`your own domain`}</em>{`, because performance varies significantly — a model that is great on legal text may be mediocre on code documentation.`}</p>
              <h3>{`3.3 Vector Databases`}</h3>
              <p>{`Vector databases are where your embeddings live. The big players are Pinecone, Weaviate, Qdrant, Milvus, and Chroma DB. When choosing one, look at:`}</p>
              <div className={styles.panel}>
                <ul>
                  <li><strong>{`query latency at your expected scale`}</strong>{`,`}</li>
                  <li><strong>{`metadata filtering`}</strong>{` — you often want to filter by date, source, or category `}<em>{`before`}</em>{` doing the vector search, and`}</li>
                  <li><strong>{`hybrid search support`}</strong>{`, which leads to the next point: retrieval strategies.`}</li>
                </ul>
              </div>
              <h3>{`3.4 Retrieval Strategies`}</h3>
              <p>{`Pure vector search — finding the most semantically similar chunks — is great, but it is not perfect. Embeddings capture meaning but can miss exact terms, which is why many production systems use `}<strong>{`hybrid search`}</strong>{`, blending semantic similarity with traditional keyword matching so that exact-name or exact-code matches are not overlooked. The video's real answer to "retrieval is not perfect," however, is the evolution of the retrieval strategy itself: the ten RAG patterns below are, in effect, ten increasingly capable architectures for getting the right context into the generation step.`}</p>
              <MermaidDiagram code={"flowchart TD\nDOC[\"Source documents: PDFs, Markdown, code, databases\"]\nDOC --> S1[\"Fixed-size chunking: uniform cuts that break sentences\"]\nDOC --> S2[\"Semantic chunking: split where the topic shifts\"]\nDOC --> S3[\"Document-aware chunking: respect sections and headers\"]\nDOC --> S4[\"Hierarchical chunking: small chunk plus parent context\"]\nS1 --> EMB[\"Embedding model: each chunk becomes a vector\"]\nS2 --> EMB\nS3 --> EMB\nS4 --> EMB\nEMB --> VDB[(Vector database)]"} caption={`3. The Indexing Pipeline: Chunking, Embedding, Storing — Follows the offline half of Section 3, "Inside the Architecture: How RAG Works": the chunking strategies, embedding models, and vector database covered in Sections 3.1 through 3.3.`} />
            </section>

            <section className={styles.section} id="ten-rag-patterns-to-know-in-2026">
              <div className={styles.kicker}>RAG 04</div>
              <h2>{`Ten RAG Patterns to Know in 2026`}</h2>
              <p>{`Think of these as ten different architectures that solve different problems. The list runs from the simplest starting point to the patterns shaping where the field is going.`}</p>
              <h3>{`4.1 Simple RAG`}</h3>
              <p>{`You ask a question, you retrieve the relevant chunks, you stuff them into the prompt, and the LLM answers. Simple RAG is the "hello world" of RAG. It is fine for prototyping, but it is not enough for production.`}</p>
              <h3>{`4.2 RAG with Memory`}</h3>
              <p>{`The second pattern adds a memory layer on top of simple RAG. While simple RAG treats every query as a fresh, standalone lookup, a memory layer carries conversational context between turns — earlier questions, answers, and retrievals — so follow-up questions like "and what about the second option?" resolve against what was already discussed. This is the pattern underneath chat-style assistants that still need retrieval.`}</p>
              <h3>{`4.3 Branch RAG`}</h3>
              <p>{`Sometimes one query is not enough to answer a complex question. Branch RAG uses an LLM to decompose the user's question into multiple sub-questions, runs parallel retrieval for each of them, and then synthesizes the results into one coherent answer. Instead of one search for a question that actually spans several topics, each sub-question gets its own focused retrieval, and the answer is assembled from all of them.`}</p>
              <h3>{`4.4 HyDE`}</h3>
              <p>{`HyDE — short for hypothetical document embeddings — is a clever pattern worth understanding. It solves a real mismatch: query embeddings and document embeddings often look different even when they are talking about the same thing. A question like "what causes inflation?" embeds differently than a paragraph `}<em>{`explaining`}</em>{` what causes inflation, because questions and statements are shaped differently.`}</p>
              <p>{`HyDE bridges that gap by asking the LLM to generate a hypothetical answer to the query `}<em>{`before`}</em>{` retrieving anything. That hypothetical answer is then embedded and used as the search vector — and because it looks much more like an actual document, retrieval quality improves significantly. It is a neat trick, and it works.`}</p>
              <h3>{`4.5 Adaptive RAG`}</h3>
              <p>{`Not every question needs retrieval. If a user asks "what's 2 + 2?", there is no reason to hit the vector database. Adaptive RAG inserts a `}<strong>{`routing layer`}</strong>{` — essentially a lightweight classifier or an LLM call — that decides whether a question needs retrieval at all, and if so, whether it needs simple retrieval or a more complex multi-step retrieval. The result is a smarter system and lower costs, because retrieval only happens when it earns its keep.`}</p>
              <h3>{`4.6 Corrective RAG (CRAG)`}</h3>
              <p>{`Corrective RAG directly addresses a real failure mode: what happens when the retrieved documents are low quality or flat-out irrelevant? CRAG adds an `}<strong>{`evaluation step after retrieval`}</strong>{`. If the retrieved documents score below a confidence threshold, the system either reformulates the query and tries again, or falls back to a web search to find better information — and only then generates an answer. Think of it as a quality gate on the pipeline, catching bad retrievals before they can poison the final answer.`}</p>
              <h3>{`4.7 Self-RAG`}</h3>
              <p>{`Self-RAG takes the self-correction idea further by making the LLM critique itself as it writes. The model is trained or prompted to emit specific `}<strong>{`reflection tokens`}</strong>{` during generation: "Is retrieval needed here?" "Is this passage actually relevant?" "Is this claim supported by the retrieved context?" The model is questioning its own reasoning in real time. The result is an answer that is more grounded, more accurate, and more transparent about its own confidence. It is more complex to implement, but incredibly powerful for high-stakes applications.`}</p>
              <h3>{`4.8 Agentic RAG`}</h3>
              <p>{`Agentic RAG is where RAG meets AI agents — and honestly, it is the direction the whole field is moving. Instead of a single retrieve-then-generate step, agentic RAG uses an LLM as an `}<strong>{`orchestrator`}</strong>{` that decides what to do next: search for more information, call an API, run some code, retrieve from a different source, or decide that it already has enough context to answer. It loops until the answer is good enough. Frameworks like LangChain and LlamaIndex workflows are built exactly for this pattern, and for complex multi-step queries, agentic RAG is genuinely transformative.`}</p>
              <h3>{`4.9 Multimodal RAG`}</h3>
              <p>{`Most RAG systems only handle text, but real-world data contains charts, diagrams, tables, images, and PDFs with mixed content. Multimodal RAG handles all of it. One approach: at ingestion time, a vision-language model generates text descriptions for images and tables, so those descriptions can be embedded and retrieved like any other chunk. A further step stores image embeddings directly alongside the text embeddings. Tools like LlamaIndex support this natively. As enterprise data gets richer and more visual, multimodal RAG is going to become essential.`}</p>
              <h3>{`4.10 Graph RAG`}</h3>
              <p>{`Graph RAG is one of the most interesting recent developments. Standard RAG treats a knowledge base as a flat collection of chunks with no relationship between them. Graph RAG instead builds a `}<strong>{`knowledge graph`}</strong>{` on top of the documents, mapping entities and their relationships explicitly. When a question requires connecting multiple pieces of information — "how does this regulation affect the contracts we signed with these three vendors?" — graph RAG dramatically outperforms standard vector search, because it understands relationships, not just similarity.`}</p>
              <MermaidDiagram code={"flowchart TD\nsubgraph F[\"Foundations: patterns 1-2\"]\nP1[\"1. Simple RAG: retrieve, then generate\"]\nP2[\"2. RAG with Memory: context across turns\"]\nP1 --> P2\nend\nsubgraph S[\"Smarter retrieval: patterns 3-5\"]\nP3[\"3. Branch RAG: sub-questions, parallel retrieval\"]\nP4[\"4. HyDE: embed a hypothetical answer instead\"]\nP5[\"5. Adaptive RAG: router decides if retrieval is needed\"]\nP3 --> P4 --> P5\nend\nsubgraph Q[\"Quality gates: patterns 6-7\"]\nP6[\"6. Corrective RAG: evaluate, retry, or web search\"]\nP7[\"7. Self-RAG: reflection tokens while writing\"]\nP6 --> P7\nend\nsubgraph N[\"The frontier: patterns 8-10\"]\nP8[\"8. Agentic RAG: LLM orchestrates search and tools\"]\nP9[\"9. Multimodal RAG: images, tables, charts\"]\nP10[\"10. Graph RAG: maps entity relationships\"]\nP8 --> P9 --> P10\nend\nP2 --> P3\nP5 --> P6\nP7 --> P8"} caption={`5. Ten RAG Patterns: The Evolution of an Architecture — Compresses all of Section 4, "Ten RAG Patterns to Know in 2026", into one progression that also doubles as the rebuttal to the 'RAG is dead' myth from Section 2.1.`} />
              <MermaidDiagram code={"sequenceDiagram\nparticipant U as User\nparticipant O as LLM orchestrator\nparticipant R as Retriever and search\nparticipant T as Code and API tools\nU->>O: Complex multi-step question\nloop Decide, act, observe\nO->>O: What next: search, run a tool, or answer?\nalt More information needed\nO->>R: Retrieve from another source\nR-->>O: Relevant chunks\nelse Tool call needed\nO->>T: Run code or call an API\nT-->>O: Tool result\nelse Enough context already\nNote over O: Exit the loop\nend\nend\nO-->>U: Final grounded answer"} caption={`6. Agentic RAG: The Orchestrator Loop — Zooms into the pattern from Section 4.8, where the LLM orchestrates retrieval, APIs, and code in a loop until it has enough context to answer.`} />
            </section>

            <section className={styles.section} id="where-to-go-from-here">
              <div className={styles.kicker}>RAG 05</div>
              <h2>{`Where to Go From Here`}</h2>
              <p>{`RAG is not dying — it is maturing, and the pattern list above is evidence of how quickly the architecture has evolved from simple retrieve-then-generate into corrective, self-reflecting, agentic, multimodal, and graph-based systems. For a lot more depth on the subject, the video description links a set of resources, and for those serious about mastering agentic AI systems, Srinivasan and her co-founder have built a deep-dive, mastering-agentic-AI bootcamp at The Gen Academy — technical, hands-on, and production-focused, designed both for engineers and for people who do not code in their jobs, like product managers.`}</p>
            </section>

            <section className={styles.section} id="key-takeaways">
              <div className={styles.kicker}>Summary</div>
              <h2>Key Takeaways</h2>
              <div className={styles.checklist}>
              <div className={styles.check}>{`RAG is retrieval-augmented generation: a retrieval system finds relevant information and a generation system (the LLM) answers grounded in it — an open-book exam for language models.`}</div>
              <div className={styles.check}>{`It is the foundation of serious enterprise AI: customer support over knowledge bases, internal knowledge assistants, and legal document analysis all run on RAG.`}</div>
              <div className={styles.check}>{`"RAG is dead" is wrong: RAG is an architectural pattern that matures, and patterns like corrective RAG, Self-RAG, and agentic RAG exist precisely because of its early limitations.`}</div>
              <div className={styles.check}>{`Huge context windows do not replace RAG: brute-force context stuffing is expensive, slow, and degrades model performance when irrelevant content buries the signal.`}</div>
              <div className={styles.check}>{`Chunking decides retrieval quality: prefer semantic and document-aware chunking over fixed-size cuts; hierarchical chunking with small-to-big retrieval is one of the best production techniques.`}</div>
              <div className={styles.check}>{`Embedding choice is domain-specific — benchmark models on your own data — and pick a vector database on latency, metadata filtering, and hybrid search support.`}</div>
              <div className={styles.check}>{`Ten patterns cover the design space: simple RAG, RAG with memory, Branch RAG, HyDE, adaptive RAG, corrective RAG, Self-RAG, agentic RAG, multimodal RAG, and graph RAG.`}</div>
              <div className={styles.check}>{`Each pattern solves a distinct problem: multi-part questions (Branch RAG), query-document mismatch (HyDE), unnecessary retrieval (adaptive), bad retrievals (corrective), self-critique (Self-RAG), multi-step orchestration (agentic), non-text data (multimodal), and relationships between entities (graph RAG).`}</div>
              <div className={styles.check}>{`Agentic RAG is where the field is heading — an LLM orchestrator that searches, calls tools, and loops until the answer is good enough.`}</div>
              </div>
            </section>

          <section className={styles.section} id="part-b-mcp">
            <div className={styles.kicker}>Part B · Protocols</div>
            <h2>MCP Complete Explanation</h2>
            <p>{`The Model Context Protocol (MCP) has quietly become the standard way AI connects to everything — your files, your databases, your tools — yet most people who use it every single day still cannot explain what it actually is. This article breaks down exactly that: what MCP is, how it works under the hood, where it sits inside an AI agent, and how it compares to function calling, APIs, and plugins. By the end you will also know where to find MCP servers, how to plug one in safely, and how to build your own — and if you are building anything with AI in 2026, this is baseline knowledge now.`}</p>
          </section>

            <section className={styles.section} id="mcp-architecture-diagrams">
              <div className={styles.kicker}>Overview</div>
              <h2>Architecture Diagrams</h2>
              <MermaidDiagram code={"flowchart TD\nsubgraph before[\"Before MCP - the drawer of chargers\"]\nA1[\"App 1\"] --> DB1[\"Database\"]\nA1 --> CRM1[\"CRM\"]\nA2[\"App 2\"] --> DB1\nA2 --> SLK1[\"Slack\"]\nA3[\"App 3\"] --> CRM1\nA3 --> FS1[\"Files\"]\nend\n\nsubgraph after[\"After MCP - one standard cable\"]\nC1[\"Any AI app\"] --> M1[\"MCP protocol\"]\nM1 --> S1[\"Server: database\"]\nM1 --> S2[\"Server: CRM\"]\nM1 --> S3[\"Server: Slack\"]\nM1 --> S4[\"Server: files\"]\nend\n\nbefore -->|\"a thousand bespoke wires become one plug\"| after"} caption={`1. From Point-to-Point Chaos to One Standard Plug — Illustrates Sections 1–2: the drawer-of-chargers problem and the USB-C fix that MCP introduces.`} />
              <MermaidDiagram code={"flowchart TD\nstart[\"Found a server to use\"] --> gate{\"Verified publisher, or code you have read?\"}\ngate -->|\"no\"| stop[\"Do not run it - the USB stick from a parking lot\"]\ngate -->|\"yes\"| fork{\"Local or remote?\"}\nfork -->|\"local\"| loc[\"On your machine, over stdio\"]\nloc --> cfg1[\"Add the launch command to the app config\"]\nfork -->|\"remote\"| rem[\"Hosted elsewhere, over HTTP\"]\nrem --> cfg2[\"Add the server URL to the app config\"]\ncfg1 --> restart[\"Restart the app\"]\ncfg2 --> restart\nrestart --> disc[\"Client handshake; tools are discovered automatically\"]\ndisc --> use[\"Talk to your AI - it calls the tools when needed\"]\ntip[\"Start local and low-stakes, e.g. a filesystem server\"] -.-> loc"} caption={`5. Local vs Remote — and the Gate Before You Plug In — Illustrates Sections 7–8: choosing between a local stdio server and a remote HTTP server, behind the verification gate the security section demands.`} />
            </section>

            <section className={styles.section} id="why-mcp-exists-the-drawer-of-chargers-problem">
              <div className={styles.kicker}>MCP 01</div>
              <h2>{`Why MCP Exists: The Drawer of Chargers Problem`}</h2>
              <p>{`MCP only makes sense once you feel the pain that it actually solves. Imagine you are building an AI application whose model needs to talk to your database, your CRM, your file system, and maybe even Slack. Every one of those connections is a custom integration: you write it, you test it, you maintain it. Now just scale that up — ten applications and a hundred tools — and you are looking at potentially a thousand different integrations, each one bespoke and brittle.`}</p>
              <p>{`This is the drawer of chargers we all had before USB-C: one cable per device, none of them interchangeable. The moment you lived through that drawer, you understood the pattern was broken. The AI ecosystem has hit the same wall — many models, many tools, many data sources, all wired together by hand with point-to-point connectors that only work for the exact pair they were built for. That is the problem MCP exists to solve.`}</p>
            </section>

            <section className={styles.section} id="what-mcp-is-the-usb-c-for-ai">
              <div className={styles.kicker}>MCP 02</div>
              <h2>{`What MCP Is: The USB-C for AI`}</h2>
              <p>{`MCP is the USB-C for AI. It is an open standard, originally released by Anthropic in November 2024, that gives AI models and the tools and data around them one common language for connecting. You build a connector once, and any MCP-compatible AI application can use it — whether it is Claude, ChatGPT, Cursor, or your own custom agent — with no rewrites and no special casing per platform.`}</p>
              <p>{`And it is not a one-company thing anymore. In December 2025, Anthropic donated MCP to the Linux Foundation, making it a vendor-neutral, community-governed standard. That is why the download numbers exploded: the industry essentially agreed on the shape of the plug. The protocol went from roughly 100,000 downloads a month to 97 million a month in about eighteen months, and it has become the default way an AI application connects to the outside world. That is the "what" — now for the genuinely interesting part.`}</p>
            </section>

            <section className={styles.section} id="the-three-pieces-host-client-and-server">
              <div className={styles.kicker}>MCP 03</div>
              <h2>{`The Three Pieces: Host, Client, and Server`}</h2>
              <p>{`There are exactly three pieces to how MCP works, and once you hold them in your head, every MCP diagram you have ever squinted at suddenly makes sense: the host, the client, and the server. The USB-C analogy maps onto them almost perfectly.`}</p>
              <p><strong>{`The host is the AI application itself`}</strong>{` — Claude Desktop, Cursor, VS Code, ChatGPT, and so on. Think of the host as your phone.`}</p>
              <p><strong>{`The MCP client lives inside the host.`}</strong>{` It is the USB-C port on that phone: it speaks the protocol and manages the connection, and you really never need to see it. From your point of view it is invisible plumbing; from the protocol's point of view it is the endpoint doing the talking.`}</p>
              <p><strong>{`The MCP server is the accessory you plug in`}</strong>{` — a small program that wraps some tools and data sources (your database, your calendar, GitHub, whatever you choose) and exposes them in the standard MCP format. And do not let the word "server" intimidate you. An MCP server can literally be a hundred lines of Python code running on your laptop.`}</p>
              <h3>{`3.1 What a Server Gives You: Tools, Resources, and Prompts`}</h3>
              <p>{`A server actually gives the model three kinds of things: tools, resources, and prompts. The clearest way to see the difference is to imagine onboarding a new employee:`}</p>
              <div className={styles.panel}>
                <ul>
                  <li>{`You give the new hire software access so they can take actions — that is `}<strong>{`tools`}</strong>{`.`}</li>
                  <li>{`You give them the company wiki so they can read what they need — that is `}<strong>{`resources`}</strong>{`.`}</li>
                  <li>{`You give them your standard operating procedures for common workflows — those are `}<strong>{`prompts`}</strong>{`.`}</li>
                </ul>
              </div>
              <p>{`Translated to AI terms: tools are what the model can `}<em>{`do`}</em>{`, resources are what it can `}<em>{`read`}</em>{`, and prompts are reusable templates for doing tasks well. A filesystem server, for example, exposes read and write operations as tools and lets the model open files as resources.`}</p>
              <h3>{`3.2 Discovery at Runtime: Why It Feels Like Magic`}</h3>
              <p>{`Here is the genuinely elegant part. When a client connects to a server, it just asks, "What do you have?" The server responds by advertising its tools, resources, and prompts, complete with descriptions and typed inputs. Everything is discovered at runtime — nothing is hardcoded into the client or the model. That single discovery step is what makes MCP feel like magic compared with wiring integrations by hand: add a server, and the application instantly knows what the server offers and how to call it.`}</p>
              <MermaidDiagram code={"flowchart TD\nsubgraph host[\"Host - the AI app, like your phone\"]\nAPP[\"Claude Desktop / Cursor / ChatGPT\"] --> PORT[\"MCP client - the USB-C port inside the host\"]\nend\n\nsubgraph srv[\"MCP server - the accessory you plug in\"]\nTOOLS[\"Tools - actions the model can take\"]\nRES[\"Resources - data the model can read\"]\nPROMPTS[\"Prompts - reusable templates for common tasks\"]\nend\n\nPORT -->|\"speaks MCP over stdio or HTTP\"| srv"} caption={`2. Host, Client, Server: The Three Pieces — Illustrates Section 3: the host, the in-host client, and the server map onto the phone, its USB-C port, and the accessory — plus the three things a server exposes.`} />
            </section>

            <section className={styles.section} id="where-mcp-sits-inside-an-ai-agent">
              <div className={styles.kicker}>MCP 04</div>
              <h2>{`Where MCP Sits Inside an AI Agent`}</h2>
              <p>{`Knowing the parts, the natural next question is where MCP sits inside an actual AI agent — because MCP alone is not an agent. This is the part most explainers completely skip.`}</p>
              <p>{`When people say "AI agent," what is really running is a harness: a loop around the model. The model does the reasoning; the harness handles everything else. It manages memory, tracks state, decides when to go around the loop again, and — critically — executes actions in the real world.`}</p>
              <p>{`Think of the agent as a smart new employee. The model is the brain. The harness is the workstation and the workflow. And MCP is the company badge: the standardized access layer that gets the agent into every system it is allowed to touch, without needing a bespoke key for each door.`}</p>
              <h3>{`4.1 The Loop: Model Decides, Harness Executes, MCP Connects`}</h3>
              <p>{`Here is the loop in motion. The model decides it needs something external — say, pulling rows from a database. The harness routes that intent through an MCP client to the right server. The server does the actual work, and the result flows back into the model's context so it can keep reasoning. Model decides, harness executes, MCP connects — that is the whole dance.`}</p>
              <p>{`This is exactly why MCP took off together with agents. An agent is only as useful as the systems it can touch, and MCP made touching systems standardized instead of bespoke. Before MCP, every tool integration meant teaching the agent a new, one-off interface; with MCP, any agent that speaks the protocol can use any server.`}</p>
              <MermaidDiagram code={"sequenceDiagram\nparticipant U as User\nparticipant M as Model - the brain\nparticipant H as Harness - the workstation\nparticipant C as MCP client\nparticipant S as MCP server\n\nNote over M,S: model decides, harness executes, MCP connects\n\nloop until the task is complete\nU->>M: ask a question\nM->>H: decide a tool is needed - pull rows from a database\nH->>C: route the intent through the client\nC->>S: call the database tool\nS-->>C: return the rows\nC-->>H: hand the result back\nH-->>M: append the result to context\nM->>M: keep reasoning\nend"} caption={`3. Where MCP Sits: The Agent Loop — Illustrates Section 4: the harness loop in which the model decides, the harness executes, and MCP connects.`} />
            </section>

            <section className={styles.section} id="mcp-vs-function-calling-apis-and-plugins">
              <div className={styles.kicker}>MCP 05</div>
              <h2>{`MCP vs. Function Calling, APIs, and Plugins`}</h2>
              <p>{`The most common confusion around MCP is what it replaces. The answer: nothing you already use — it sits underneath the layers you already have and standardizes the connection between them.`}</p>
              <h3>{`5.1 Function Calling Is a Model Capability; MCP Is the Transport`}</h3>
              <p>{`Function calling is a `}<em>{`capability of the model`}</em>{`: the model looks at a task, decides a tool is needed, and produces a structured request with the right arguments. MCP is the `}<em>{`protocol`}</em>{` that carries that request to the tool and brings the result back. They are not competitors; they are complementary layers.`}</p>
              <p>{`A framing that makes this stick: function calling answers questions like "should I make a call, and what should I say?" MCP answers "how does that call actually reach the other end?" Function calling is you deciding to call somebody and dialing the number; MCP is the telephone network that lets any phone reach any other phone. You need both. When you build with MCP you are not replacing function calling — you are giving it somewhere standardized to land.`}</p>
              <h3>{`5.2 Plain APIs Don't Go Anywhere`}</h3>
              <p>{`What about plain APIs? Your APIs don't go anywhere. An API is a point-to-point connection to one service; MCP is a standard layer `}<em>{`on top of`}</em>{` your API that lets an AI model discover and call it in a consistent way. The API still does all the work — MCP just gives every model the same way to find it and talk to it. If someone tells you MCP replaces your APIs, they have completely misunderstood the stack.`}</p>
              <h3>{`5.3 Why Plugins Lost`}</h3>
              <p>{`The plugins comparison is best explained with a little history. Back in 2023, ChatGPT plugins were the hot thing — and they had exactly the problem you would expect. A plugin was proprietary: you built it for one platform, and if you wanted the same capability anywhere else, you had to build it again. Plugins were the old proprietary charger: one cable per brand.`}</p>
              <p>{`MCP flips that model. Instead of every AI platform running its own plugin store, there is one open protocol, and every platform implements the same port. Build your server once and it works on Claude, on ChatGPT, on Cursor, on VS Code, and on whatever agent framework you are running. That is why the plugin era quietly ended — and why even the platforms that built plugin stores moved to MCP. To be fair, plugins are not all invalid today; some tools still use them. But MCP has become the more standard way of doing it.`}</p>
              <MermaidDiagram code={"flowchart TD\nsubgraph stack[\"The stack that MCP complements\"]\nFC[\"AI model - function calling decides a tool is needed and shapes the request\"]\nTR[\"MCP - the protocol that carries the request and brings the result back\"]\nAPI[\"Your API - does the actual work on one service\"]\nFC --> TR --> API\nend\n\nsubgraph plugins[\"Why plugins lost\"]\nP1[\"2023: a ChatGPT plugin works on one platform\"]\nP2[\"Want it elsewhere? Build it again\"]\nP3[\"One MCP server runs on Claude, ChatGPT, Cursor and VS Code\"]\nP1 --> P2\nend"} caption={`4. MCP Below Function Calling, Above Your APIs — Illustrates Section 5: MCP layers under function calling and over plain APIs, and the plugin era ended because MCP is one open port everywhere.`} />
            </section>

            <section className={styles.section} id="finding-mcp-servers">
              <div className={styles.kicker}>MCP 06</div>
              <h2>{`Finding MCP Servers`}</h2>
              <p>{`Concepts done, comparisons done — now the practical part. There are thousands of MCP servers out there right now, over 10,000 public ones at last count, so discovery is genuinely the easy part. Three places to look:`}</p>
              <div className={styles.panel}>
                <ul>
                  <li><strong>{`The official MCP registry.`}</strong>{` This is the canonical directory, where verified publishers increasingly list their servers.`}</li>
                  <li><strong>{`The Model Context Protocol servers repository on GitHub.`}</strong>{` It contains the reference servers — including `}<code>{`filesystem`}</code>{`, `}<code>{`fetch`}</code>{`, and `}<code>{`memory`}</code>{` — and is one of the most-starred repositories in the whole space.`}</li>
                  <li><strong>{`Community directories like Pulse MCP.`}</strong>{` These are great for browsing by category, whether you want a Notion server, a Postgres server, or a GitHub server.`}</li>
                </ul>
              </div>
              <p>{`The rule of thumb: before you ever build your own MCP server, search first. The integration you need probably already exists.`}</p>
            </section>

            <section className={styles.section} id="local-and-remote-servers-how-you-actually-use-one">
              <div className={styles.kicker}>MCP 07</div>
              <h2>{`Local and Remote Servers: How You Actually Use One`}</h2>
              <p>{`Before using a server, you need to understand one fork in the road: MCP servers come in two flavors — local and remote.`}</p>
              <p>{`A `}<strong>{`local server`}</strong>{` runs on your machine and talks to the client over something called stdio — standard input and output between processes. It is what you want for local files and experimentation. A `}<strong>{`remote server`}</strong>{` is hosted somewhere else; you connect to it over HTTP and typically authenticate with OAuth, the same way you sign in to any app with your Google account. Remote is how most companies expose their products.`}</p>
              <p>{`Actually using a server turns out to be anticlimactic. In Claude Desktop, Cursor, or VS Code, all you do is add a small configuration entry: either the command that launches a local server, or the URL of a remote one. Restart the app, and the client handles the handshake and discovers the tools automatically. After that you simply talk to your AI normally, and it uses the tools when it needs them.`}</p>
              <p>{`The recommended starting point is to go local with something low-stakes, like a filesystem server, and watch how the model calls its tools — build your intuition there before scaling up to many servers.`}</p>
            </section>

            <section className={styles.section} id="the-security-reality-no-tutorial-mentions">
              <div className={styles.kicker}>MCP 08</div>
              <h2>{`The Security Reality No Tutorial Mentions`}</h2>
              <p>{`Before you go connect twenty servers to everything you own, stop. This is the part almost no MCP tutorial talks about, and it deserves to be taken seriously.`}</p>
              <p>{`The uncomfortable truth: an MCP server is code that gets a direct line into your AI's context — and often into your real accounts and data. Installing a random MCP server is like plugging a USB stick you found in a parking lot into your laptop. Yes, it can be that scary — and there are numbers to back it up. Independent assessments found that only 13% of publicly available MCP servers meet high trust thresholds for documentation, maintenance, and reliability. And early 2026 produced real incidents, not hypothetical ones: dozens of CVEs; tool-poisoning attacks in which malicious instructions were hidden inside tool descriptions; and a hosted platform with a path-traversal flaw that exposed thousands of applications. This actually happened.`}</p>
              <h3>{`8.1 The Practitioner's Checklist`}</h3>
              <div className={styles.panel}>
                <ul>
                  <li><strong>{`Prefer official servers from verified publishers — or read the code before you run it.`}</strong>{` Server code is usually small enough that you actually can.`}</li>
                  <li><strong>{`Least privilege, always.`}</strong>{` If a server only needs to read data, give it read-only credentials.`}</li>
                  <li><strong>{`Keep a human in the loop for everything sensitive or irreversible`}</strong>{` — things like writes, deletes, or sending messages.`}</li>
                </ul>
              </div>
              <h3>{`8.2 Doing This at Team Scale`}</h3>
              <p>{`At team scale the production pattern is simple: put your MCP servers behind a central gateway or an internal registry so you control exactly which servers your agents can reach. Default everything to scoped read-only credentials, and put sensitive operations behind human approval. That setup handles thousands of tool calls a day without ever handing your agent the keys to everything. Security and scale are not opposites — the guardrails are what let you scale.`}</p>
            </section>

            <section className={styles.section} id="building-your-first-mcp-server">
              <div className={styles.kicker}>MCP 09</div>
              <h2>{`Building Your First MCP Server`}</h2>
              <p>{`Once you know what MCP is, how it works, and how to use it safely, it is time for the fun part: building one. Your first working MCP server is genuinely a fifteen-minute project, and Python is the shortest path.`}</p>
              <h3>{`9.1 FastMCP: The 15-Minute Path`}</h3>
              <p>{`The official Python SDK includes FastMCP, and the developer experience is beautiful: you write a normal Python function with type hints and a docstring, put a decorator on it, and the SDK turns it into a fully described MCP tool automatically — no protocol plumbing by hand. For TypeScript developers, the official TypeScript SDK is just as solid.`}</p>
              <p>{`Then you test with the MCP Inspector, a local web interface where you can trigger your tools manually before any model touches them. Once everything looks good, add the server to your Claude Desktop or Cursor configuration file and watch your AI call your code.`}</p>
              <h3>{`9.2 The Project to Build This Week`}</h3>
              <p>{`Here is a concrete project worth building: pick one API or data source you use every day — maybe Notion, a weather API, or a read-only view of your own database — and wrap it in one well-tested tool over stdio. Validate it in the Inspector, connect it to your client, and only graduate it to HTTP with OAuth once more than one person needs it. Most people overbuild their first server; don't do that.`}</p>
              <p>{`If you walk away from this whole topic remembering one thing, let it be this:`}</p>
              <div className={styles.quote}>{`MCP is not the intelligence part — it is the plumbing part.`}</div>
              <p>{`But right now, the teams winning with AI are exactly the ones doing that plumbing: giving their models a standardized way to actually touch real-world data. A full list of the tools, repositories, and resources mentioned in the video (plus a companion guide) is in the video description; and for a deeper, end-to-end path into agentic AI, the creator and her co-founder Arvind run a six-week live certification taught by the two of them, with partner companies including NVIDIA, OpenAI, LangChain, Pinecone, Fireworks AI, and ElevenLabs.`}</p>
              <MermaidDiagram code={"flowchart TD\npick[\"Pick one API or data source you use daily\"] --> fn[\"Write a typed Python function with a docstring\"]\nfn --> deco[\"Add the FastMCP decorator - the SDK generates the tool\"]\ndeco --> test[\"Trigger it in the MCP Inspector first\"]\ntest --> reg[\"Register the server in your app config\"]\nreg --> live[\"Your AI calls your code over stdio\"]\nlive -.->|\"scale later\"| grad[\"Move to HTTP with OAuth when more than one person needs it\"]"} caption={`6. The Fifteen-Minute Server: From Function to Live Tool — Illustrates Section 9: FastMCP turns a typed, documented function into a tool, the Inspector validates it, and your client starts calling your code.`} />
            </section>

            <section className={styles.section} id="mcp-key-takeaways">
              <div className={styles.kicker}>Summary</div>
              <h2>Key Takeaways</h2>
              <div className={styles.checklist}>
              <div className={styles.check}>{`MCP (Model Context Protocol) is an open standard for connecting AI models to tools and data — the "USB-C for AI" — created by Anthropic (November 2024) and donated to the Linux Foundation in December 2025, making it a vendor-neutral, community-governed standard.`}</div>
              <div className={styles.check}>{`Adoption exploded from about 100,000 downloads a month to 97 million a month in roughly eighteen months, and MCP has become the standard way AI applications connect to external systems.`}</div>
              <div className={styles.check}>{`Three pieces make it work: the host (the AI application), the client (the protocol-speaking port inside the host), and the server (the program that wraps tools, resources, and prompts in the standard format). Servers advertise what they offer, and everything is discovered at runtime — nothing is hardcoded.`}</div>
              <div className={styles.check}>{`MCP alone is not an agent. An agent is a harness loop around a model: the model decides, the harness executes, and MCP connects it to the real world.`}</div>
              <div className={styles.check}>{`MCP complements rather than replaces function calling (a model capability) and APIs (point-to-point service connections); it won the standard's race against proprietary, per-platform plugins.`}</div>
              <div className={styles.check}>{`Over 10,000 public MCP servers exist; find them via the official MCP registry, the Model Context Protocol servers GitHub repository, and community directories like Pulse MCP. Search before you build.`}</div>
              <div className={styles.check}>{`Servers come in two flavors: local (over stdio) and remote (over HTTP, typically OAuth). Using one means adding a small config entry and restarting — the client handles handshake and discovery.`}</div>
              <div className={styles.check}>{`Security is the part most tutorials skip: only about 13% of public servers meet high trust thresholds, and real attacks (tool poisoning, path traversal) have occurred. Prefer verified or code-reviewed servers, use least-privilege credentials, and keep humans in the loop for sensitive actions; at team scale, route servers through a central gateway or internal registry.`}</div>
              <div className={styles.check}>{`Building a first server is a 15-minute project with FastMCP: a typed, documented Python function plus a decorator becomes a full MCP tool, testable in the MCP Inspector before any model touches it.`}</div>
              </div>
            </section>

          <footer className={styles.footer}>
            Source: <a href={`https://www.youtube.com/watch?v=v0ynfDPpe4E`}>{`RAG Explained in 12 Minutes`}</a> and <a href={`https://www.youtube.com/watch?v=_fzpnqt39jQ`}>{`MCP Complete Explanation`}</a> by Aishwarya Srinivasan, rendered by the Knowledge Base YouTube → article pipeline.
          </footer>
        </article>
      </div>
    </main>
  );
}
