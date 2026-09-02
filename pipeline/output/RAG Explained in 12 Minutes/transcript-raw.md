[00:00:00] If you've been wondering, what is rag
[00:00:01] that everybody has been talking about
[00:00:03] everywhere, then this video is for you.
[00:00:05] We're going to be doing a complete
[00:00:06] no-fluff deep dive into rag. What it
[00:00:09] actually is, why some people are getting
[00:00:11] it wrong, and all the moving parts under
[00:00:13] the hood. And then, 10 different rag
[00:00:15] patterns that you need to know in 2026.
[00:00:18] And I'm going to explain all of it in
[00:00:20] the way that actually makes sense, not
[00:00:21] just the textbook definitions, [music]
[00:00:23] but the why behind everything. Before we
[00:00:25] jump in, I'm Ishwar Srinivasan. I've
[00:00:27] spent the last [music] 10 years working
[00:00:29] in machine learning and AI. I have a
[00:00:30] master's degree in data science from
[00:00:32] Columbia University, and I've worked as
[00:00:34] a data scientist [music] at Microsoft,
[00:00:35] Google, and IBM. Currently, I'm building
[00:00:37] two startups. One is in stealth, and the
[00:00:39] other one is called The Gen Academy.
[00:00:41] [music] The Gen Academy is an AI
[00:00:42] skill-building platform focused on
[00:00:44] teaching the real things that teams
[00:00:46] [music] are building right now in
[00:00:48] production. And fun fact, I'm also the
[00:00:50] most-followed Indian woman in AI, and I
[00:00:52] share everything that I know about this
[00:00:54] space because I genuinely want more
[00:00:56] people to get it and build with it.
[00:01:00] Let me start with a simple analogy
[00:01:02] because this is the one that makes it
[00:01:03] click. So, imagine that you're about to
[00:01:05] take an open-book exam. You don't have
[00:01:07] every single fact memorized, but you
[00:01:09] have access to a pile of textbook and
[00:01:12] notes sitting right next to you. When a
[00:01:13] question comes up, you just flip through
[00:01:15] the right sections, read what's
[00:01:16] relevant, and then you write your answer
[00:01:18] based on what you just found. You're not
[00:01:20] making up things. You're grounding your
[00:01:22] answer in actual source material. That's
[00:01:24] exactly what rag does for a large
[00:01:26] language model. A standard large
[00:01:28] language model like GPT, Claude, or
[00:01:30] Gemini is like a student who only has
[00:01:32] what they memorized during training.
[00:01:34] They are smart, they can reason, they
[00:01:37] can write, [music] they can explain
[00:01:38] things, but their knowledge has a cutoff
[00:01:41] date, and most importantly, they have no
[00:01:43] idea what's in your documents, what's in
[00:01:45] your company's databases, and what is in
[00:01:47] your internal knowledge base. Now, rag,
[00:01:49] which stands for retrieval augmented
[00:01:51] generation, fixes that. So, instead of
[00:01:54] relying purely on what the model
[00:01:56] memorized, rag gives it the ability to
[00:01:58] go look up things first, pull in [music]
[00:02:00] relevant information, and then generate
[00:02:02] an answer that's grounded in the
[00:02:04] retrieved context. So, rag is really two
[00:02:07] things working together. A retrieval
[00:02:09] system that finds [music] the right
[00:02:11] information, and a generation system,
[00:02:13] which is your LLM, that uses that
[00:02:15] information to answer intelligently.
[00:02:17] Now, that partnership is the whole game.
[00:02:20] And here is what I want you to
[00:02:21] understand. Rag is not a cool trick. It
[00:02:24] is the foundation of almost every
[00:02:26] serious enterprise AI application which
[00:02:28] is being built right now. Customer
[00:02:30] support in internal knowledge
[00:02:31] assistance, legal document analysis, rag
[00:02:34] is underneath every single thing.
[00:02:40] Okay, before we go deeper, I need to
[00:02:42] address two biggest misconceptions that
[00:02:44] I keep seeing. And honestly, they're
[00:02:45] doing a lot of damage on how people
[00:02:48] think about building AI systems. The
[00:02:50] myth number one is people say rag is
[00:02:53] dead. I hear this all the time, and let
[00:02:55] me be real with you, it is completely
[00:02:57] wrong. What happened is that a few paper
[00:02:59] came out showing that LLMs can sometimes
[00:03:01] hallucinate even with retrieved context,
[00:03:04] [music] and people ran with the
[00:03:05] narrative that rag is broken. But here
[00:03:07] is the thing, rag is not a single
[00:03:09] technology. It is an architectural
[00:03:11] pattern. So, it needs to keep evolving.
[00:03:14] The patterns, which we'll be talking
[00:03:15] later in this video. Things like
[00:03:17] corrective rag, self rag, and agentic
[00:03:19] rag. [music] These are all direct
[00:03:20] responses to earlier limitations of rag.
[00:03:23] So, rag isn't dying, it's just maturing.
[00:03:25] [music] And the second myth is bigger
[00:03:27] context window means that you don't need
[00:03:29] rag anymore. This one is confusing
[00:03:31] because it actually sounds logical. If I
[00:03:33] can just stuff a million tokens into my
[00:03:35] prompt, why bothering build a retrieval
[00:03:38] system at all? Here is why that does not
[00:03:40] hold up in practice. First is cost.
[00:03:42] Processing a million token context on
[00:03:45] every single query is astronomically
[00:03:47] expensive [music] at scale. Second,
[00:03:50] latency. These calls are going to be
[00:03:51] slow. Third, and this is one that most
[00:03:53] people overlook. [music] LLMs actually
[00:03:55] perform worse when you overload them
[00:03:57] with irrelevant context. There is
[00:03:59] research [music] showing that models
[00:04:00] lose when the signal is buried in too
[00:04:03] much noise. Now, rag's job is to surface
[00:04:05] precisely the right information. So, a
[00:04:08] well-built rag system consistently
[00:04:10] outperforms brute-force context stuffing
[00:04:13] on accuracy, cost, and speed. Don't let
[00:04:15] anyone convince you otherwise.
[00:04:19] All right, now let's get into the actual
[00:04:21] architecture. And this is the part that
[00:04:23] most people skip over too fast.
[00:04:25] Understanding each component deeply is
[00:04:28] what separates people who build rag
[00:04:30] systems that work [music] from people
[00:04:31] who build rag systems that don't work.
[00:04:33] So, step one is ingestion. Before
[00:04:36] anything can be retrieved, your document
[00:04:38] needs to be broken up and stored. And
[00:04:40] chunking is how you break up your
[00:04:42] documents. And this matters enormously.
[00:04:44] The naive approach is fixed-size
[00:04:46] chunking. You just cut each document
[00:04:48] into, say, 500 token pieces. Sometimes
[00:04:50] [music] it works, but it loses context
[00:04:52] in the boundaries. If a sentence gets
[00:04:54] cut off in half between two chunks,
[00:04:56] neither chunk makes proper sense. Now, a
[00:04:58] much better approach is semantic
[00:05:00] chunking, where you use an embedding
[00:05:02] model to detect where the topic shifts
[00:05:05] in the text. Then you break on those
[00:05:07] natural boundaries instead. So, tools
[00:05:09] like LangChain and LlamaIndex have a
[00:05:11] built-in support for this. Now, for
[00:05:12] structured content like PDFs with
[00:05:14] sections or markdowns with headers,
[00:05:16] document-aware chunking is even better,
[00:05:19] where you're respecting the actual
[00:05:20] structure of the document. And there's a
[00:05:22] more advanced strategy called
[00:05:23] hierarchical chunking, where you store
[00:05:25] both a small precise chunk and a larger
[00:05:28] parent chunk that gives it more context.
[00:05:30] [music] So, when you retrieve the small
[00:05:31] chunk, you pass the parent also to the
[00:05:33] LLM. This is sometimes called the
[00:05:35] small-to-big retrieval, and it is
[00:05:36] genuinely one of the best techniques in
[00:05:38] production rag. Now, the next thing is
[00:05:40] embedding models. Once you've chunked
[00:05:42] your documents, you convert each chunk
[00:05:45] into an embedding, which is a numerical
[00:05:47] vector that represents the meaning of
[00:05:49] that text. When a user asks a question,
[00:05:51] you embed their query, too. And then you
[00:05:53] find chunks whose embeddings are the
[00:05:55] closest to the query embedding. That's
[00:05:57] your semantic search. In 2026, the go-to
[00:06:00] embedding models are things like
[00:06:02] text-embedding-3-large
[00:06:03] from OpenAI, Voyage 3 from VoyageAI, and
[00:06:06] open-source options like BGE large or E5
[00:06:09] Mistral from Hugging Face. My strong
[00:06:11] recommendation would be that benchmark
[00:06:13] embedding models on your domain
[00:06:15] specifically because performance varies
[00:06:17] significantly. A model that's great on
[00:06:19] legal text might be mediocre on code
[00:06:21] documentation. Then, there's vector
[00:06:23] databases.
[00:06:24] This is where your embeddings live. The
[00:06:27] big players here are Pinecone, Weaviate,
[00:06:29] Qdrant, Milvus, and Chroma DB. [music]
[00:06:31] When choosing one, look at things like
[00:06:32] query latency at your expected scale,
[00:06:35] support for metadata filtering because
[00:06:37] you often want to filter by date,
[00:06:39] source, and category before doing a
[00:06:40] vector search, and whether it supports
[00:06:42] hybrid search, which brings me to the
[00:06:44] next point is retrieval strategies.
[00:06:46] [music] Now, pure vector search, which
[00:06:48] is finding the most semantically similar
[00:06:50] chunks, is great, but it is not perfect.
[00:06:53] Now, we get into the part that I'm most
[00:06:55] excited about. The 10 rag patterns that
[00:06:57] you need to know. So, think of these as
[00:06:59] 10 different architectures that solve
[00:07:02] different problems. The first one is
[00:07:04] simple rag. You ask [music] a question,
[00:07:06] you retrieve relevant chunks, you stuff
[00:07:08] them into the prompt, and the LLM
[00:07:09] answers. It's the hello world of rag.
[00:07:11] It's good for prototyping, but it is not
[00:07:13] enough for production. Then the second
[00:07:15] one is rag with memory. You add a memory
[00:07:17] layer on top of your simple rag. And the
[00:07:19] third one is branched rag. Sometimes one
[00:07:22] query is not enough to answer a complex
[00:07:24] question. So, branch rag uses an LLM to
[00:07:27] decompose the user's question into
[00:07:29] multiple sub-questions, then runs
[00:07:31] parallel retrieval for each of them, and
[00:07:33] then synthesizes the results into one
[00:07:35] coherent answer. Then the fourth one is
[00:07:37] hide, or hypothetical document encoding.
[00:07:40] [music] This one is clever and worth
[00:07:42] understanding. The problem it solves is
[00:07:44] that query embeddings and document
[00:07:45] [music] embeddings often look different
[00:07:47] even when they're talking about the same
[00:07:49] thing. A question about [music] what
[00:07:51] causes inflation looks different as an
[00:07:53] embedding than as a paragraph explaining
[00:07:56] [music] inflation. So, hide bridges that
[00:07:58] gap by first asking the LLM to generate
[00:08:01] a hypothetical answer to that query even
[00:08:03] before it retrieves. Then, you embed
[00:08:06] that hypothetical answer and use that as
[00:08:08] your search vector because the
[00:08:10] hypothetical answer looks much more like
[00:08:12] an actual document. So, the retrieval
[00:08:14] quality improves significantly with
[00:08:16] this. It's a neat trick, and it works.
[00:08:19] fifth one is adaptive rag. Now, not
[00:08:21] every question needs retrieval. If a
[00:08:23] user asks, "What's 2 + 2?" you don't
[00:08:26] need to hit your vector database.
[00:08:27] Adaptive rag uses a routing layer.
[00:08:30] Basically, a lightweight classifier or
[00:08:32] LLM call which decides whether a
[00:08:34] question needs retrieval at all, whether
[00:08:37] it needs simple retrieval or needs a
[00:08:39] more complex multi-step [music]
[00:08:40] retrieval. This makes your system
[00:08:42] smarter and your costs lower. Then the
[00:08:44] sixth one is corrective [music] rag, or
[00:08:46] crack. This one directly addresses a
[00:08:48] real failure mode. What happens [music]
[00:08:50] when your retrieved documents are low
[00:08:51] quality or flat-out irrelevant? Now,
[00:08:53] corrective rag [music] adds an
[00:08:55] evaluation step after retrieval. If the
[00:08:57] retrieved documents score below a
[00:08:59] confidence threshold, [music]
[00:09:00] the system either reformulates the query
[00:09:03] and tries again, or falls back to a web
[00:09:05] search [music] to find better
[00:09:06] information before generating an answer.
[00:09:08] So, think of it like quality gate of
[00:09:10] your pipeline. Then the seventh one is
[00:09:12] self rag. Now, self rag takes the
[00:09:14] self-correction idea further. The LLM
[00:09:17] itself is trained or prompted to
[00:09:19] generate specific reflection tokens as
[00:09:22] it writes the answer. So, tokens like,
[00:09:24] "Is retrieval needed here?" or "Is this
[00:09:27] passage actually relevant?" or "Is this
[00:09:29] claim supported by the retrieved
[00:09:31] context?" It's the model critiquing its
[00:09:33] own reasoning in real time. The result
[00:09:36] is an answer that's more grounded,
[00:09:37] [music] more accurate, and more
[00:09:39] transparent about its own confidence.
[00:09:41] It's more complex to implement, but
[00:09:43] incredibly powerful for high-stake
[00:09:45] applications. [music] Then the eighth
[00:09:46] one is agentic rag. This is where rag
[00:09:49] meets AI agents. And honestly, this is
[00:09:51] the direction that whole field is
[00:09:52] moving. So, [music] instead of a single
[00:09:54] retrieve-then-generate step, agentic rag
[00:09:57] uses a LLM as an orchestrator that can
[00:09:59] decide what to do next. Does it need to
[00:10:02] search for more information, call an
[00:10:04] API, run some code, retrieve something
[00:10:06] from a different source, or decide if it
[00:10:08] has enough context to answer. It loops
[00:10:11] until the answer is good enough.
[00:10:13] And frameworks like LangChain and
[00:10:15] LlamaIndex workflows are built exactly
[00:10:17] for this pattern. For complex multi-step
[00:10:20] queries, agentic rag is genuinely
[00:10:22] transformative. Then the ninth one is
[00:10:24] multimodal rag. Most rag systems only
[00:10:26] handle text, but your real-world data
[00:10:29] has charts, diagrams, tables, images,
[00:10:31] PDFs with mixed content. And multimodal
[00:10:34] rag handles all of it. You use a vision
[00:10:36] language model to generate text
[00:10:38] descriptions for images and tables
[00:10:39] [music] at ingestion time. So, they can
[00:10:41] be embedded and retrieved like any other
[00:10:43] chunk. Or you can go even further and
[00:10:45] store image embeddings directly
[00:10:47] alongside the text embeddings. And tools
[00:10:49] like LlamaIndex support this natively.
[00:10:51] As enterprise data gets richer and more
[00:10:53] visual, multimodal rag is going to be
[00:10:56] very essential. Then the last one is
[00:10:58] graph rag. This is one of the most
[00:10:59] interesting recent developments.
[00:11:01] Standard rag treats your knowledge base
[00:11:03] as a flat collection of chunks. There is
[00:11:06] no relationship between them. And graph
[00:11:08] rag builds a knowledge graph on top of
[00:11:10] your documents and mapping entities and
[00:11:12] their relationships explicitly. When a
[00:11:14] question requires connecting multiple
[00:11:16] pieces of information together, like how
[00:11:19] does this regulation affect the
[00:11:20] contracts that we signed with these
[00:11:22] three vendors, graph rag dramatically
[00:11:24] outperforms standard vector search
[00:11:26] because it understands the relationship
[00:11:29] and not just similarity. We spoke about
[00:11:31] the rag architecture, we spoke about a
[00:11:32] lot of different design patterns for
[00:11:34] rag, and several use cases as well. Now,
[00:11:37] there is a lot more to read about rag,
[00:11:38] so I'm going to add all of those
[00:11:40] resources in the description below. Just
[00:11:42] one last thing. If you're serious about
[00:11:44] mastering agentic [music] AI systems,
[00:11:46] Arvind Narayanmurthy, my co-founder and
[00:11:48] I have built a deep dive mastering
[00:11:50] agentic AI bootcamp at Gen [music]
[00:11:52] Academy. It's going to be technical,
[00:11:54] it's going to be hands-on, and it's
[00:11:55] going to be production focused. It is
[00:11:57] both for engineers and people who may
[00:11:59] not be coding in their jobs like PMs.
[00:12:02] So, if you're interested, do go check it
[00:12:03] out in the description below.
