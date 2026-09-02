# RAG Explained in 12 Minutes

If you've been wondering, what is rag that everybody has been talking about everywhere, then this video is for you. We're going to be doing a complete no-fluff deep dive into rag. What it

actually is, why some people are getting it wrong, and all the moving parts under the hood. And then, 10 different rag patterns that you need to know in 2026.

And I'm going to explain all of it in the way that actually makes sense, not just the textbook definitions, but the why behind everything. Before we

jump in, I'm Ishwar Srinivasan. I've spent the last 10 years working in machine learning and AI. I have a

master's degree in data science from Columbia University, and I've worked as a data scientist at Microsoft, Google, and IBM. Currently, I'm building

two startups. One is in stealth, and the other one is called The Gen Academy. The Gen Academy is an AI skill-building platform focused on

teaching the real things that teams are building right now in production. And fun fact, I'm also the most-followed Indian woman in AI, and I

share everything that I know about this space because I genuinely want more people to get it and build with it.

Let me start with a simple analogy because this is the one that makes it click. So, imagine that you're about to take an open-book exam. You don't have

every single fact memorized, but you have access to a pile of textbook and notes sitting right next to you. When a question comes up, you just flip through

the right sections, read what's relevant, and then you write your answer based on what you just found. You're not making up things. You're grounding your

answer in actual source material. That's exactly what rag does for a large language model. A standard large

language model like GPT, Claude, or Gemini is like a student who only has what they memorized during training. They are smart, they can reason, they can write, they can explain

things, but their knowledge has a cutoff date, and most importantly, they have no idea what's in your documents, what's in your company's databases, and what is in your internal knowledge base. Now, rag,

which stands for retrieval augmented generation, fixes that. So, instead of relying purely on what the model memorized, rag gives it the ability to

go look up things first, pull in relevant information, and then generate an answer that's grounded in the retrieved context. So, rag is really two

things working together. A retrieval system that finds the right information, and a generation system, which is your LLM, that uses that

information to answer intelligently. Now, that partnership is the whole game. And here is what I want you to understand. Rag is not a cool trick. It

is the foundation of almost every serious enterprise AI application which is being built right now. Customer support in internal knowledge

assistance, legal document analysis, rag is underneath every single thing.

Okay, before we go deeper, I need to address two biggest misconceptions that I keep seeing. And honestly, they're doing a lot of damage on how people

think about building AI systems. The myth number one is people say rag is dead. I hear this all the time, and let

me be real with you, it is completely wrong. What happened is that a few paper came out showing that LLMs can sometimes hallucinate even with retrieved context,

and people ran with the narrative that rag is broken. But here is the thing, rag is not a single technology. It is an architectural

pattern. So, it needs to keep evolving. The patterns, which we'll be talking later in this video. Things like

corrective rag, self rag, and agentic rag. These are all direct responses to earlier limitations of rag. So, rag isn't dying, it's just maturing.

And the second myth is bigger context window means that you don't need rag anymore. This one is confusing because it actually sounds logical. If I

can just stuff a million tokens into my prompt, why bothering build a retrieval system at all? Here is why that does not hold up in practice. First is cost.

Processing a million token context on every single query is astronomically expensive at scale. Second, latency. These calls are going to be

slow. Third, and this is one that most people overlook. LLMs actually perform worse when you overload them

with irrelevant context. There is research showing that models lose when the signal is buried in too much noise. Now, rag's job is to surface

precisely the right information. So, a well-built rag system consistently outperforms brute-force context stuffing on accuracy, cost, and speed. Don't let

anyone convince you otherwise.

All right, now let's get into the actual architecture. And this is the part that most people skip over too fast. Understanding each component deeply is

what separates people who build rag systems that work from people who build rag systems that don't work. So, step one is ingestion. Before

anything can be retrieved, your document needs to be broken up and stored. And chunking is how you break up your documents. And this matters enormously.

The naive approach is fixed-size chunking. You just cut each document into, say, 500 token pieces. Sometimes

it works, but it loses context in the boundaries. If a sentence gets cut off in half between two chunks, neither chunk makes proper sense. Now, a

much better approach is semantic chunking, where you use an embedding model to detect where the topic shifts in the text. Then you break on those

natural boundaries instead. So, tools like LangChain and LlamaIndex have a built-in support for this. Now, for

structured content like PDFs with sections or markdowns with headers, document-aware chunking is even better, where you're respecting the actual structure of the document. And there's a

more advanced strategy called hierarchical chunking, where you store both a small precise chunk and a larger parent chunk that gives it more context. So, when you retrieve the small

chunk, you pass the parent also to the LLM. This is sometimes called the small-to-big retrieval, and it is genuinely one of the best techniques in

production rag. Now, the next thing is embedding models. Once you've chunked your documents, you convert each chunk

into an embedding, which is a numerical vector that represents the meaning of that text. When a user asks a question, you embed their query, too. And then you

find chunks whose embeddings are the closest to the query embedding. That's your semantic search. In 2026, the go-to

embedding models are things like text-embedding-3-large from OpenAI, Voyage 3 from VoyageAI, and open-source options like BGE large or E5 Mistral from Hugging Face. My strong

recommendation would be that benchmark embedding models on your domain specifically because performance varies significantly. A model that's great on

legal text might be mediocre on code documentation. Then, there's vector databases. This is where your embeddings live. The

big players here are Pinecone, Weaviate, Qdrant, Milvus, and Chroma DB. When choosing one, look at things like query latency at your expected scale, support for metadata filtering because

you often want to filter by date, source, and category before doing a vector search, and whether it supports hybrid search, which brings me to the next point is retrieval strategies.

Now, pure vector search, which is finding the most semantically similar chunks, is great, but it is not perfect. Now, we get into the part that I'm most excited about. The 10 rag patterns that

you need to know. So, think of these as 10 different architectures that solve different problems. The first one is

simple rag. You ask a question, you retrieve relevant chunks, you stuff them into the prompt, and the LLM answers. It's the hello world of rag.

It's good for prototyping, but it is not enough for production. Then the second one is rag with memory. You add a memory

layer on top of your simple rag. And the third one is branched rag. Sometimes one query is not enough to answer a complex

question. So, branch rag uses an LLM to decompose the user's question into multiple sub-questions, then runs parallel retrieval for each of them, and

then synthesizes the results into one coherent answer. Then the fourth one is hide, or hypothetical document encoding. This one is clever and worth

understanding. The problem it solves is that query embeddings and document embeddings often look different even when they're talking about the same

thing. A question about what causes inflation looks different as an embedding than as a paragraph explaining inflation. So, hide bridges that

gap by first asking the LLM to generate a hypothetical answer to that query even before it retrieves. Then, you embed that hypothetical answer and use that as

your search vector because the hypothetical answer looks much more like an actual document. So, the retrieval quality improves significantly with

this. It's a neat trick, and it works. fifth one is adaptive rag. Now, not every question needs retrieval. If a

user asks, "What's 2 + 2?" you don't need to hit your vector database. Adaptive rag uses a routing layer. Basically, a lightweight classifier or LLM call which decides whether a

question needs retrieval at all, whether it needs simple retrieval or needs a more complex multi-step retrieval. This makes your system

smarter and your costs lower. Then the sixth one is corrective rag, or crack. This one directly addresses a

real failure mode. What happens when your retrieved documents are low quality or flat-out irrelevant? Now,

corrective rag adds an evaluation step after retrieval. If the retrieved documents score below a confidence threshold,

the system either reformulates the query and tries again, or falls back to a web search to find better information before generating an answer. So, think of it like quality gate of

your pipeline. Then the seventh one is self rag. Now, self rag takes the self-correction idea further. The LLM

itself is trained or prompted to generate specific reflection tokens as it writes the answer. So, tokens like, "Is retrieval needed here?" or "Is this

passage actually relevant?" or "Is this claim supported by the retrieved context?" It's the model critiquing its own reasoning in real time. The result

is an answer that's more grounded, more accurate, and more transparent about its own confidence. It's more complex to implement, but incredibly powerful for high-stake

applications. Then the eighth one is agentic rag. This is where rag meets AI agents. And honestly, this is

the direction that whole field is moving. So, instead of a single retrieve-then-generate step, agentic rag uses a LLM as an orchestrator that can

decide what to do next. Does it need to search for more information, call an API, run some code, retrieve something from a different source, or decide if it

has enough context to answer. It loops until the answer is good enough. And frameworks like LangChain and LlamaIndex workflows are built exactly

for this pattern. For complex multi-step queries, agentic rag is genuinely transformative. Then the ninth one is

multimodal rag. Most rag systems only handle text, but your real-world data has charts, diagrams, tables, images, PDFs with mixed content. And multimodal

rag handles all of it. You use a vision language model to generate text descriptions for images and tables at ingestion time. So, they can

be embedded and retrieved like any other chunk. Or you can go even further and store image embeddings directly alongside the text embeddings. And tools

like LlamaIndex support this natively. As enterprise data gets richer and more visual, multimodal rag is going to be very essential. Then the last one is

graph rag. This is one of the most interesting recent developments. Standard rag treats your knowledge base as a flat collection of chunks. There is

no relationship between them. And graph rag builds a knowledge graph on top of your documents and mapping entities and their relationships explicitly. When a

question requires connecting multiple pieces of information together, like how does this regulation affect the contracts that we signed with these three vendors, graph rag dramatically

outperforms standard vector search because it understands the relationship and not just similarity. We spoke about the rag architecture, we spoke about a

lot of different design patterns for rag, and several use cases as well. Now, there is a lot more to read about rag, so I'm going to add all of those

resources in the description below. Just one last thing. If you're serious about mastering agentic AI systems,

Arvind Narayanmurthy, my co-founder and I have built a deep dive mastering agentic AI bootcamp at Gen Academy. It's going to be technical,

it's going to be hands-on, and it's going to be production focused. It is both for engineers and people who may not be coding in their jobs like PMs.

So, if you're interested, do go check it out in the description below.
