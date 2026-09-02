[00:00:00] What the heck is a vector database? If
[00:00:02] you want to truly understand how AI
[00:00:03] applications like ChatGPT with memory,
[00:00:06] semantic search engines, and rag systems
[00:00:08] actually work under the hood, this video
[00:00:10] is going to be one of the most important
[00:00:12] ones that you watch this year. Everyone
[00:00:14] is talking about building AI agents.
[00:00:16] Everyone is talking about rag, but
[00:00:18] almost nobody takes out the time to
[00:00:20] explain the [music] actual
[00:00:21] infrastructure that makes all of this
[00:00:23] possible. And that infrastructure is a
[00:00:25] vector database. I know what some of you
[00:00:28] might be thinking. Ash, databases.
[00:00:30] [music] That sounds like a boring
[00:00:31] back-end stuff. I get it. But trust me
[00:00:33] on this. Once you understand what a
[00:00:35] vector database actually does and why it
[00:00:38] exists, everything that you've been
[00:00:40] learning about AI is going to click into
[00:00:42] one place. So, let's get into it. If
[00:00:44] you're new to my channel, hi there. I'm
[00:00:45] Ashwarya Srinivasan. I also go by Ash. I
[00:00:48] have over 10 years of experience in
[00:00:50] machine learning and AI, and I've worked
[00:00:51] at companies like Microsoft, Google, and
[00:00:53] IBM. And I've co-founded The Gen
[00:00:55] Academy, where we teach people [music]
[00:00:57] how to actually build with AI.
[00:00:59] Everything I share here comes from
[00:01:00] real-world experience, not just theory.
[00:01:03] So, let's start with the problem,
[00:01:04] because that's always the best place to
[00:01:06] start. Imagine that you're building an
[00:01:07] AI assistant for a company. The company
[00:01:09] has thousands of internal documents,
[00:01:11] whether it's HR policies, product
[00:01:13] manuals, or legal contracts. Your AI
[00:01:15] assistant needs to answer employee
[00:01:17] questions using that information. So,
[00:01:19] the obvious idea is, let's dump all of
[00:01:22] these documents into a regular database
[00:01:24] and search through them. Here is why it
[00:01:25] breaks down immediately. A traditional
[00:01:27] database, whether it's MySQL or
[00:01:29] PostgreSQL, it's designed for exact or
[00:01:31] partial text matching. Find me all the
[00:01:33] documents where the word vacation
[00:01:35] appears. That works fine for exact
[00:01:37] queries. But what happens when somebody
[00:01:39] asks things like, how many days off do I
[00:01:42] get per year? The word vacation might
[00:01:44] not even appear in that question. A
[00:01:46] traditional database has no idea those
[00:01:48] two things are related. Now, this is a
[00:01:50] core limitation that vector database
[00:01:53] were built to solve. They are designed
[00:01:55] not for exact matching, but for
[00:01:58] meaning-based matching. And that
[00:02:00] distinction is everything. Now, before
[00:02:02] we talk about vector databases, we need
[00:02:05] to talk about vectors. And I promise it
[00:02:07] is not a math lecture. So, think about
[00:02:09] how your brain understands meaning. When
[00:02:11] you hear the word king, you don't just
[00:02:14] store the letters k i n g, you store a
[00:02:17] whole web of association. It's things
[00:02:19] like royalty, power, leadership, crown.
[00:02:22] Your brain has a rich, multi-dimensional
[00:02:25] understanding of what that word means in
[00:02:28] relation to everything else that you
[00:02:30] know. Now, machine learning models do
[00:02:32] something very similar. What they do is
[00:02:34] they convert words, sentences, images,
[00:02:37] basically any kind of data into a list
[00:02:39] of numbers. Now, that list of numbers is
[00:02:42] called a vector or an embedding. And
[00:02:44] here is the beautiful part. These
[00:02:46] numbers are not just random. They are
[00:02:48] positioned in mathematical space in a
[00:02:50] way that actually captures meaning.
[00:02:53] Words with similar meanings end up in
[00:02:55] similar numbers, which means they end up
[00:02:57] close to each other in that vector
[00:02:59] space. Here's the classic example that
[00:03:01] blows people's minds every time. If you
[00:03:03] take the vector for the word king,
[00:03:05] subtract the vector for man, and add the
[00:03:08] vector for woman, you end up extremely
[00:03:11] close to the vector for queen. So, the
[00:03:13] model has learned that royalty and
[00:03:15] gender are real, and they are
[00:03:16] manipulatable dimensions of meaning.
[00:03:18] Now, that's not magic. That's a
[00:03:20] well-trained embedding model doing its
[00:03:22] job. So, when you convert your company's
[00:03:25] thousands of documents into vectors,
[00:03:27] you've translated all of that text into
[00:03:30] a mathematical language that captures
[00:03:33] meaning and not just keywords. Now, when
[00:03:36] a user asks a question, say something
[00:03:38] like, how many days off do I get this
[00:03:40] year? That question also gets converted
[00:03:43] into a vector, and the database finds
[00:03:45] the documents whose vectors are closest
[00:03:48] to it in meaning, even if they don't
[00:03:50] share a single word with the actual
[00:03:51] original question. That is what a vector
[00:03:53] database is built to do, and it does it
[00:03:56] fast, even across millions of documents.
[00:03:58] Now, let me show you where this shows up
[00:04:01] in real world, because this is where
[00:04:03] this gets exciting. The most important
[00:04:05] use case right now in AI is rag, which
[00:04:08] stands for retrieval augmented
[00:04:10] generation. And I have an analogy that I
[00:04:12] always use for this. Think about an
[00:04:14] closed-book exam. You can only answer
[00:04:16] questions based on what you have
[00:04:17] memorized. If you did not study
[00:04:19] something, you're just stuck. That is
[00:04:21] basically a large language model without
[00:04:23] rag. It can only answer based on what it
[00:04:26] learned during training. Ask it
[00:04:28] something that happened after its
[00:04:29] training cut-off or something very
[00:04:31] specific to your company, and it's
[00:04:33] either going to hallucinate or just
[00:04:34] going to say, I don't know. Now, imagine
[00:04:36] an open-book exam where you have a
[00:04:38] textbook right in front of you. You get
[00:04:40] the question, you flip to the relevant
[00:04:41] chapter, read the relevant section, and
[00:04:43] then you write your answer using both
[00:04:45] your reasoning ability and the actual
[00:04:48] information from that book. Now, that is
[00:04:50] rag. The LLM is the student with great
[00:04:53] reasoning ability, and the vector
[00:04:54] database is the textbook. Now, if you
[00:04:56] want to go deeper into rag, I've
[00:04:58] actually recorded a detailed video about
[00:05:00] understanding rag. I link that in the
[00:05:02] description below, so you can go check
[00:05:04] that out. Now, coming back to vector
[00:05:05] databases. Here is how it works in
[00:05:07] practice. You take all your documents
[00:05:09] and convert them into vectors using an
[00:05:11] embedding model. You store those vectors
[00:05:13] in a vector database. So, when a user
[00:05:15] submits a query, you convert that query
[00:05:18] into a vector, search the database for
[00:05:20] the most semantically similar documents,
[00:05:23] retrieve the top results, pass those
[00:05:25] results along with the original query to
[00:05:27] the LLM, and then the LLM generates a
[00:05:30] grounded and accurate response instead
[00:05:32] of guessing. Now, this is why rag is
[00:05:34] such a big deal. It solves the
[00:05:36] hallucination problem for
[00:05:38] domain-specific knowledge. And vector
[00:05:40] databases is the heart of the retrieval
[00:05:43] step. One thing I want to flag, because
[00:05:45] this is a mistake that I see constantly.
[00:05:47] How you chunk your documents before
[00:05:49] converting them into embedding is just
[00:05:51] as important as the database that you
[00:05:54] choose. If your chunks are too large,
[00:05:56] you lose precision. If they are too
[00:05:58] small, you lose context. A solid
[00:06:00] starting point is about 300 to 500
[00:06:03] tokens per chunk, with about 50 to 100
[00:06:05] tokens of overlap at the boundaries. And
[00:06:08] use a semantic chunker if your framework
[00:06:10] supports it, not just a fixed-size
[00:06:12] character splitter. The difference in
[00:06:14] retrieval quality is real. Okay, now
[00:06:16] let's get practical, because I know some
[00:06:18] of you are ready to build. There are a
[00:06:19] lot of options out there, so let me be
[00:06:21] direct about where you should start. If
[00:06:23] you're getting started and want to
[00:06:24] experiment locally, I would say go with
[00:06:26] Chroma DB. It's incredibly easy to set
[00:06:28] up and works great with LangChain and
[00:06:30] LlamaIndex. And you can have a working
[00:06:32] rag prototype on your laptop in under an
[00:06:35] hour. Now, that is your entry point. If
[00:06:37] you want performance and want to
[00:06:39] self-host, look at Qdrant. It is
[00:06:41] open-source, written in Rust, so it's
[00:06:43] extremely fast and memory-efficient, and
[00:06:45] their documentation is amazing. You can
[00:06:47] run it locally with Docker in 5 minutes.
[00:06:49] Now, if you're building a production
[00:06:51] application and don't want to manage the
[00:06:53] infrastructure, Pinecone is the most
[00:06:56] popular fully managed option right now.
[00:06:58] It scales automatically, integrates well
[00:07:00] with most AI frameworks, and the free
[00:07:02] tier is generous enough to prototype
[00:07:04] before you commit. And then there's
[00:07:06] Weaviate, which is worth knowing about,
[00:07:07] because it supports hybrid search,
[00:07:09] meaning that you can combine vector
[00:07:11] similarity search with traditional
[00:07:13] keyword search in the same query. That's
[00:07:15] powerful for production use cases where
[00:07:16] you want the best of both approaches.
[00:07:18] Now, I want to spend just a minute here,
[00:07:21] because vector databases are not just
[00:07:23] for rag, and I don't want you to be
[00:07:25] leaving with that impression. Spotify
[00:07:27] uses vector similarity to recommend
[00:07:29] songs that you've never heard, but
[00:07:31] you'll probably love, because your
[00:07:32] listening history gets converted into a
[00:07:34] vector and matched against a catalog of
[00:07:37] song vectors. Netflix also does the same
[00:07:40] for content recommendation. Also,
[00:07:42] Pinterest lets you take a picture of a
[00:07:44] room that you love and find visually
[00:07:46] similar pins, because that image gets
[00:07:48] converted into a vector by a vision
[00:07:50] model. Not just that, anomaly detection
[00:07:52] in cybersecurity works the same way.
[00:07:55] Normal network traffic clusters together
[00:07:57] in a vector space, and behavior that's
[00:07:59] far away from that cluster is your
[00:08:01] alert. So, the mental model is always
[00:08:04] the same. Convert your data into a rich
[00:08:06] numerical representation, store it in a
[00:08:08] way that makes similarity search fast,
[00:08:11] and use that for matching,
[00:08:13] recommendation, or retrieval. Once you
[00:08:15] internalize that, you'll start seeing
[00:08:17] vector database use case everywhere.
[00:08:19] Okay, to wrap all of this up, everything
[00:08:21] that I mentioned is linked in the
[00:08:22] description below, including the docs
[00:08:24] for Chroma DB, Qdrant, and Pinecone. And
[00:08:27] I've also added some hands-on rag
[00:08:28] tutorials that will help you get
[00:08:30] started. Also, do remember to check out
[00:08:32] my rag explained video. And if you want
[00:08:34] to go much deeper on building real
[00:08:36] agentic AI end-to-end, come and check
[00:08:39] out The Gen Academy's upcoming bootcamp.
[00:08:41] My co-founder Arvind and I have built a
[00:08:43] deep-dive mastering agentic AI bootcamp
[00:08:45] that covers agent architecture,
[00:08:47] orchestration, rag, tool usage,
[00:08:49] evaluation, and deployment, all with
[00:08:52] hands-on projects. It is not just for AI
[00:08:54] builders, it is also catering to
[00:08:56] adjacent AI roles like AI PMs, tech
[00:08:59] leads, program managers, GTM leads,
[00:09:01] marketing leads, or product marketing
[00:09:03] managers. The goal is to help you be
[00:09:05] very, very technical, and at the same
[00:09:08] time make you AI native, so that you can
[00:09:10] actually build AI agents from scratch.
[00:09:13] Now, for the AI builders, for example,
[00:09:15] software engineers and AI engineers or
[00:09:17] solutions architects, we have
[00:09:18] assignments which are focusing more on
[00:09:20] code. And for the non-coding
[00:09:22] professionals, we have low-code and
[00:09:24] no-code projects. So, everyone at the
[00:09:26] end of the bootcamp is going to be
[00:09:27] building a lot of projects. Plus, we
[00:09:29] have collaborated with companies like
[00:09:31] Nvidia, Nebius, LlamaIndex, Ollama,
[00:09:34] WhisperFlow, AG2, and many more to get
[00:09:37] you free credits and free access to
[00:09:39] their tools. Plus, we are inviting some
[00:09:41] of their top AI engineers and AI leaders
[00:09:43] to come and give you guest lectures.
[00:09:45] It's going to be a super-packed agentic
[00:09:47] AI bootcamp, so definitely go check it
[00:09:49] out. Hope this was helpful. I'll see you
[00:09:51] in the next one.
