import type { Metadata } from "next";
import styles from "../knowledge-base.module.css";
import MermaidDiagram from "../mermaid";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "RAG Explained in 12 Minutes | Knowledge Base",
  description: "If you have been hearing \"RAG\" everywhere and wondering what it actually is, this guide is for you: it explains what Retrieval-Augmented Generation re",
};

const TAGS = [`Applied AI`, `Article`, `Aishwarya Srinivasan`];

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
            <span className={styles.eyebrow}>Applied AI · Pipeline article</span>
            <h1>{`RAG Explained in 12 Minutes`}</h1>
            <p>{`If you have been hearing "RAG" everywhere and wondering what it actually is, this guide is for you: it explains what Retrieval-Augmented Generation really is, why some people are getting it wrong, how every component works under the hood, and ten RAG patterns worth knowing in 2026. It distills a video by Aishwarya Srinivasan, a machine-learning practitioner who has spent the last decade working in AI — she holds a master's degree in data science from Columbia University and has worked as a data scientist at Microsoft, Google, and IBM — and who now builds The Gen Academy, an AI skill-building platform focused on what teams are building in production right now. The goal is to explain the `}<em>{`why`}</em>{` behind everything, not just the textbook definitions, for engineers, product managers, and anyone building applications on large language models.`}</p>
            <div className={styles.tags}>
              {TAGS.map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}
            </div>
            <nav className={styles.toc} aria-label="Article sections">
                  <a href={`#architecture-diagrams`} key="architecture-diagrams">{`Architecture Diagrams`}</a>
                  <a href={`#what-is-rag`} key="what-is-rag">{`What Is RAG?`}</a>
                  <a href={`#two-misconceptions-that-persist`} key="two-misconceptions-that-persist">{`Two Misconceptions That Persist`}</a>
                  <a href={`#inside-the-architecture-how-rag-works`} key="inside-the-architecture-how-rag-works">{`Inside the Architecture: How RAG Works`}</a>
                  <a href={`#ten-rag-patterns-to-know-in-2026`} key="ten-rag-patterns-to-know-in-2026">{`Ten RAG Patterns to Know in 2026`}</a>
                  <a href={`#where-to-go-from-here`} key="where-to-go-from-here">{`Where to Go From Here`}</a>
                  <a href={`#key-takeaways`} key="key-takeaways">{`Key Takeaways`}</a>
            </nav>
          </header>

            <section className={styles.section} id="architecture-diagrams">
              <div className={styles.kicker}>Overview</div>
              <h2>Architecture Diagrams</h2>
              <MermaidDiagram code={"flowchart TD\nQ4[\"User question\"] --> QE[\"Query embedding: same model as the chunks\"]\nQE --> VS[\"Vector search: nearest neighbors by meaning\"]\nQE --> KS[\"Keyword search: exact-term matches\"]\nVDB[(Vector database)] --> FLT[\"Metadata filters first: date, source, category\"]\nFLT --> VS\nVS --> TOP[\"Top-K chunks\"]\nKS --> TOP\nTOP --> PR[\"Prompt: question plus retrieved chunks\"]\nPR --> GEN[\"LLM generates a grounded answer\"]"} caption={`4. Query Time: Hybrid Retrieval and Grounded Generation — Traces the online path through Sections 3.2 and 3.4 of "Inside the Architecture": embedding the query, hybrid search, and prompt assembly before the LLM writes.`} />
            </section>

            <section className={styles.section} id="what-is-rag">
              <div className={styles.kicker}>Part 01</div>
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
              <div className={styles.kicker}>Part 02</div>
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
              <div className={styles.kicker}>Part 03</div>
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
              <div className={styles.kicker}>Part 04</div>
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
              <div className={styles.kicker}>Part 05</div>
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

          <footer className={styles.footer}>
            Source: <a href={`https://www.youtube.com/watch?v=v0ynfDPpe4E`}>{`RAG Explained in 12 Minutes`}</a> by <a href={`https://www.youtube.com/@aishwaryasrinivasan`}>{`Aishwarya Srinivasan`}</a> Built by the <a href={`${basePath}/knowledge-base/`}>Knowledge Base</a> YouTube → article pipeline.
          </footer>
        </article>
      </div>
    </main>
  );
}

