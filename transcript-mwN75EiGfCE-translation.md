# Agentic AI System Design — Transcript

## Intro (00:00)

A lot of people don't understand what AI agents are. But when you are actually building AI agents, in fact, one of the most important concepts that you need to understand is the system design behind it. See, because an agentic AI system is not just an LLM wrapped inside a chat interface. It is a production software system where a model can reason over a goal. It can use tools, it can retrieve context, it will maintain state, and it will make decisions across multiple steps and trigger real actions through APIs.

And in this video, I want to break down agentic AI system design from a builder's perspective. We will quickly recap what agentic AI systems are, how single-agent and multi-agent systems differ. And then we will move directly into the core building blocks about model routing, tools, memory, orchestration, state management, evaluations, observability, security, and production controls.

If you are absolutely new to AI agents, I have already covered two separate videos on my YouTube. One is AI Agents Explained and the second one is Single Agents versus Multi Agents. I link both of them below. So you can go watch them. I would say watch them first if you need the beginner foundation and then come back to this video. This one is going to be more focused on the system design level. By the end of this video you will have a practical mental model for how production-grade agentic AI systems are designed and what do you need to think about before you move from a demo to something that real users can rely on.

If you are new to my channel, welcome here. I am Aishwarya Srinivasan. I spent over 10 years in machine learning and AI. And I am currently building the Gen Academy where we train people to become top-tier AI professionals by learning the real AI systems that teams are building in production.

## What Are Agentic AI Systems? (01:46)

OK, now let's quickly define what do we mean by agentic AI systems. A basic LLM application usually takes an input, sends it to a model, and returns an output. An agentic AI system actually goes further. It can decompose a goal, decide which step to take next, call external tools, inspect the tool result, update its state, and continue the workflow until it reaches a stopping condition.

At a high level there are two common patterns. One is single-agent systems and the other one is multi-agent systems. In a single-agent system, one primary agent owns the workflow. It may still call multiple tools, retrieve documents, update the memory, and perform multiple reasoning steps, but the control loop is centralized. For example, a customer support agent may classify a request. It may retrieve an account context, call a billing API, ask for confirmation, and then generate a final response.

But on the other hand, in a multi-agent system the workflow is split across multiple specialized agents. One agent may handle planning, another may retrieve knowledge, another may write code, another may review the output, and another may handle the execution. The key idea is separation of responsibilities. So instead of one agent doing everything, you design multiple agents with defined roles, input contracts, output contracts, and routing logic between these agents.

Multi-agent systems are useful when the task has clear specialization, parallel work, review loops, or long-running workflows. But they also add complexity. You now may have more coordination overhead, more failure modes, more states to track, more logs to inspect, and more places where cost and latency can increase.

Now, that is why agentic AI system design matters. The hard part is not just getting a model to answer. The hard part is designing a system that is reliable, cost-aware, fast enough for the user experience, context-aware, observable, and safe enough to connect to real tools.

## Building Block 1: Model Layer & Routing (03:56)

So, now that you understand the context, let's jump into the building blocks. The first building block is the model layer. This includes the actual LLM or multiple models if you are using them, but also the strategy for when each model gets used.

In production, you usually don't want a single powerful model handling every step. That gets expensive and slow very quickly. A better design is actually model routing. So use cheaper and faster models for low-complexity steps like intent classification, routing, extraction, schema filling, and simple summarization. And use stronger reasoning models only for steps where deeper reasoning changes the outcome. For example, in an appointment booking agent, you probably don't need a frontier reasoning model to detect whether the user wants to book, reschedule, cancel, or ask a question. A smaller model can also classify that.

You also may not need an LLM to extract date, time, doctor name, and appointment type into a JSON schema. But you may want a stronger model when the user gives ambiguous constraints, like "I am gonna be traveling next week, I want to avoid mornings", or "make sure that this is happening after my lab results come in".

You should also think about structured outputs at the model layer. Any step that feeds another system should return predictable structure, not free-form prose. So use JSON schema, Pydantic models, function and tool calling, or whichever structured output mechanism your model provider supports. The model layer should answer three specific questions. What model is going to be used for this step? What output contract does it return? And what happens if the model fails or returns invalid output.

## Building Block 2: Tools (05:36)

Now that leads me to the second building block which is tools. Tools are basically interfaces between the model and the external world. A tool can be a database lookup, a CRM API, a calendar API, a payment API, a code interpreter, an internal search service, a ticketing system, a Slack action, a Google action, or any backend function that the agent is allowed to call.

In production, tools should be designed like APIs with strict constraints. Every tool should have a clear name, a description, input schema, output schema, permission boundaries, timeout behavior, retry behavior, and error format. This is important because the model should not be allowed to send arbitrary instructions into your backend. For example, a tool called update_user should not accept one vague natural language string, like "update this user based on the request". That is too open-ended. A safer tool contract would be user ID, field to update, new value, reason, source request ID, and confirmation required.

You also want your tool outputs to be machine-readable. So if a tool fails, it returns a structured error. If a tool succeeds, it also returns a structured result. The agent should not have to parse a messy prose from your backend.

Now a good design pattern is to separate the read tools from your write tools. Start with your read-only capabilities, then add low-risk write tools, then add high-risk write tools only with validation and human approval. Fetching available appointment slots is very different from canceling an appointment. So, you need to understand the risk factor here.

This is also where MCP becomes very relevant. MCP, or Model Context Protocol, is one emerging pattern for exposing tools, resources, and context to agents in a standardized manner. But, even if you are not using MCP, the system design principle is the same. Tools need contracts, they need permissions, they need boundaries, and they need logs.

## Building Block 3: Memory & State (07:35)

Now the third building block is memory and state. This is where many agentic systems become messy. See, memory is not one thing. In agentic systems you need to separate memory from state. State is the current execution context for the workflow. So, things like what step are we on, what information has already been collected, which tools have we called, what did these tools return, has the user confirmed the action, and did the workflow pass or fail. But memory is actually broader. It can include conversation history, user preferences, past actions, any retrieved knowledge, document context, summaries, and long-form information that may be useful later.

A common mistake is pulling all of this into a vector database. That is not a good default. You should choose storage based on access pattern. So conversation and workflow state may belong to Redis, DynamoDB, Postgres, MongoDB, or another low-latency store. Application state belongs in your application database. And knowledge retrieval may use RAG with Pinecone, PG Vector, Weaviate, Elasticsearch, OpenSearch, or a managed knowledge base. And long-term archive may live in a cheaper object storage like an S3 bucket.

In a simple example, if an agent is helping a user reschedule a doctor's appointment, the current appointment ID, proposed new time, confirmation status, and workflow step should be stored as a structured workflow state. The user's medical history should not be casually passed through the LLM if the model only needs appointment ID and the list of available slots.

You should also distinguish short-term context and long-term memory. Short-term context is what you pass into the prompt for your current turn. And long-term memory is something that you retrieve selectively. The goal is not to stuff everything into the context window of the model. It will create a context bloat. The goal is rather to retrieve the smallest useful context for the current step for the model to take a decision on.

This is exactly why memory design is really data architecture. You are deciding what to store, where to store, how long to keep it, how to retrieve it, and what is safe to send to the model or not.

## Building Block 4: Orchestration (09:53)

Now, once you have the model, tools, and memory, you need something to coordinate them. And that is orchestration. Orchestration is the control layer of an agentic system. It defines how the system moves from user request to intermediate steps to tool calls to final output. This can be implemented with plain application code, a graph-based framework like LangGraph, workflow engines like Temporal, LlamaIndex Workflows, LangChain, and custom state machines, queues, or a combination of all of these.

The orchestration layer should define the control flow explicitly. For example, you receive a user message, you classify the intent, you retrieve the required context, you decide whether the request is in scope or not. Then you select the tools, then you validate the tool inputs, then you execute the tools, then you inspect the results, then you ask for confirmation if it's needed, and then you finally generate the response. And then you log the trace and send evaluation data asynchronously.

For simple use cases, a deterministic pipeline is often better than a fully autonomous agent loop. Not every workflow needs planning and reflection. So, if a sequence of steps is mostly known, design it as a pipeline or a state machine. Use agentic reasoning only when the workflow genuinely needs dynamic decision making.

See, for most complex systems, graph-based orchestration becomes useful because you can actually represent branching, retries, loops, approval gates, and fallback parts. For example, if extraction fails, you can retry with a different prompt or a different model. If the tool returns a "no available appointment", you can branch into "suggest alternate" path. If the user asks for a cancellation, you can branch into a confirmation path.

For multi-agent AI systems, orchestration also includes agent-to-agent routing. You need to define which agent owns the next step, what information gets passed, what output format is expected, and how conflicts are resolved. Now, without this, multi-agent AI systems become extremely difficult to debug. The key point is this: do not confuse autonomy with lack of structure. Production agents need a very clear control flow.

## Building Block 5: Evaluation (12:16)

Now let's talk about one of the most important yet ignored parts of agentic AI system design, which is evaluation. I have also created a deep dive video on AI evals, so you should go check that out as well after this.

See, in traditional software, if the function runs and no exception is thrown, we often assume that the system works. But in agentic AI systems, that assumption very quickly breaks. The model can return a valid JSON that is semantically wrong. It can call the correct tool with the wrong arguments. It can retrieve irrelevant context. It can answer using stale information. Or it can fail to ask for confirmation, and it can even refuse a valid request, or comply with an unsafe request.

So, evals or evaluation need to be designed into the system from the very beginning. For agentic systems, you need more than a final answer evaluation. You need trace-level evaluation. That means, you are evaluating each and every important step in the trajectory, right from intent classification, retrieval quality, tool selection, tool arguments, policy compliance, confirmation behavior, final answer quality, and task success.

For example, a support agent could produce a very polished final answer, but it may have selected the wrong refund policy. If you only evaluate the final text, you miss the actual failure. If you evaluate the trace, you can see that the retrieved step pulled the wrong policy document or the model misclassified the user's plan type.

You should always maintain a test set of realistic scenarios. Things like happy paths, ambiguous requests, out-of-scope requests, tool failures, malicious inputs, partial information, policy edge cases, and escalation cases. This becomes regression tests whenever you change the model, prompt, retrieval logic, or your tool schema.

You can also run sampled asynchronous evaluations in production. A judge model or an LLM-as-a-judge can score a percentage of conversations offline. And high-signal user feedback can go directly into your eval queue. But be careful: LLM as a judge is useful but it is not perfect. For important workflows, combine model-based grading with deterministic checks and human review.

Your eval system should eventually produce metrics, not just examples. So, things like intent accuracy, tool call success rate, invalid schema rate, retrieval hit rate, refusal accuracy, escalation rate, task completion rate, user flag rate, and cost per successful task. These are just some of the metrics that you need to track.

Yes, evaluation is actually a very, very complex field. And this is where agentic systems start to look like real production systems.

## Building Block 6: Approval & Policy Control (15:12)

Now the next building block is approval and policy control. Not every action needs human approval, but high-impact actions should have gates. Sending an email, deleting data, issuing a refund, canceling an appointment, changing your billing, updating a CRM record, or running code, or placing an order, or making a financial transaction should not happen just because the model inferred the intent. It should always have a human in the loop.

A safer design pattern is this: the model suggests something, a code validates it, a user approves it, and then the tool executes it. The validation step should be deterministic wherever possible. So, always check ownership, check permissions, check whether the requested action is allowed, check whether required fields are present, check whether the user has confirmed the exact action, and then execute.

See, for example, if the user says "cancel my appointment", the model can classify that intent as cancellation and propose the target appointment. But the system should verify that the logged-in user owns that appointment, that it is cancelable, and that cancellation is allowed under policy, and actually that the user explicitly confirms before the cancellation API is called.

This is also important for multi-agent AI systems. If one agent generates a plan and another agent executes it, the execution layer should not blindly trust the planning layer. Tool execution still needs validation and authorization. The agent should not be the source of truth for your business rules. Your application code should be.

## Production Principle 1: Reliability (16:59)

Now that you have the main building blocks, let's talk about the production principles that hold the entire system together. The first one is reliability. Reliability means that the system behaves predictably even when the model does not. You get reliability through decomposition, contracts, retries, validation, fallbacks, as well as monitoring. What you do is you decompose large prompts into smaller steps. A single joint prompt that classifies intent, retrieves context, decides policies, calls tools, and writes the final response is going to be very, very hard to test. Smaller steps are rather easier to evaluate and debug.

Then you need to make sure that you are using structured outputs. If the next step depends on the model's output, do not rely on free-form text. You need to validate the schema. If the output is invalid, you just retry. If it still fails, use a fallback path.

Now the next thing that you need to do is wrap every model call like an unreliable upstream dependency. So, things like timeouts, malformed outputs, rate limits, provider errors, and degraded quality should all have handling paths.

Also, you need to separate deterministic validation from model reasoning. If the model extracts a date, code should be able to validate the date. If the model selects a user ID, code should be able to verify the permissions. If the model proposes a tool call, a code should be able to validate the arguments. Reliability is not about making the model perfect. It is about designing the system so model imperfections do not immediately become product failures.

## Production Principle 2: Cost & Latency (18:39)

Now the next thing that you need to take care of is cost and latency. Both cost and latency need to be designed together because agentic systems often involve multiple model calls per user request. A single interaction might include intent classification, query rewriting, retrieval, planning, tool selection, tool argument generation, tool result interpretation, final response generation, and evaluation. If every step uses a large reasoning model, your system is going to be super slow and super expensive. So, this is exactly where you use model routing. Use small models for simple classification and extraction. Use larger models only when there's ambiguity, reasoning, and synthesis that's required.

Then, you should limit tokens aggressively. Output tokens are both a cost lever as well as a latency lever. If the user only needs a two-sentence answer, do not generate a long explanation. If the downstream system only needs a JSON, do not ask for prose.

Now, this one is also important: use caching where it makes sense. You should be caching things like retrieval results, repeated policy lookups, tool metadata, as well as stable context. And then you can also do batching and asynchronous execution for non-blocking work like evaluation and summaries.

One thing to keep in mind is always use streaming responses for user-facing tasks when the response may take time. If the workflow requires long-running tool calls, show the progress states instead of leaving the user with a blank screen.

Also, very early, enforce scope early. Out-of-scope requests can burn tokens and tool calls. So you can use cheap filters, rules, and intent gates before the expensive reasoning step even happens.

A production agent should have cost observability. Things like tokens in, tokens out, cost per step, cost per conversation, and cost per successful task.

## Production Principle 3: Context & RAG Design (20:38)

Now the third production principle is context and RAG design. Context design is one of the biggest differences between a toy agent and a useful production agent. The goal here is not to pass everything into the prompt. The goal is to pass the right context for the current step. In practice, context can come from the user message, or the conversation state, or the application database, or the retrieved documents, the tool results, user profile, or even the long-term memory. Each source has different freshness, trust, privacy, and latency characteristics.

Now for RAG, retrieval quality matters more than simply having a vector database. You need to do document chunking. You have to do metadata filters. You have to do hybrid search when useful. Then you have reranking, then you have freshness controls, and source attribution when the user needs trust.

You also need to separate trusted instructions from untrusted content. Retrieved documents should not be allowed to override the system instructions. Tool outputs should be treated as data and not instructions. And user-provided content should be isolated from developer or system instructions.

For really long conversations, use summarization and checkpoints instead of passing the full history forever. Store the summary separately from the raw conversation logs, and keep track of what the summary is allowed to influence. A context-aware system is the one that knows what information it needs, where it should retrieve it from, whether it is trusted or not, and whether it is safe to be sent to the model.

## Observability, Security & Privacy (22:16)

Now the final production layer principle, I promise, is observability, security, and privacy. For observability, you need to log the anatomy of every agent run. What's the model name, what's the model version, the prompt version, step name, workflow ID, conversation ID, tool name, tool arguments with sensitive values masked, of course. Then latency, then time to first token, tokens in, tokens out, what are the costs, how many retries, were there any fallbacks, were there any errors, was there any use of feedback, and what the eval scores were. I know this is a lot, but you need to log all of them, and more. You should be able to answer: where did the failure happen? Was it intent classification, was it retrieval, planning, tool selection, tool execution, policy validation, or was it the final response error?

For security, treat everything that touches the model as an attacker-controlled input, unless proven otherwise. User messages can contain direct prompt injection. Retrieved documents can also contain indirect prompt injection. Tool outputs could also contain poisoned data, and model outputs can contain unsafe commands, things like SQL, HTML, or other kinds of code. So, you need to isolate the untrusted content. So, separate the instructions from the data. Do not execute raw model output. Do not run any SQL or shell commands directly from model-generated text. Give tools least-privilege permissions and add approval gates for risky actions.

Now for privacy, send the minimum data needed to the model. If the model only needs appointment ID and availability, do not send the full patient report. If it only requires a summary ticket, do not send the full customer history. And regarding PII, always mask PII at the right time. Set retention details for logs, traces, and conversation archives. Make sure that you keep the sensitive fields out of the prompt unless they are required for the task. Your model provider, your vector database, your observability platform, and logging systems are all part of your data boundary.

## Final Takeaway (24:41)

This is why agentic AI system design is not just about prompt engineering. It is actually the backend design. It is the data design, it is a security design, and it is the product design with LLM in the loop. So here is the final takeaway that you should have from this video: a production-grade agentic AI system needs clear model routing, strict tool contracts, explicit memory and state management, it needs orchestration, it needs trace-level evals, it needs approval gates, cost and latency controls, along with context design, observability, security, and privacy. It is all of it.

## Going Deeper & Outro (25:09)

And if you want to go deeper, we have a free Agentic AI system design masterclass recording that's almost two hours long. It goes much deeper into the architecture, production patterns, tradeoffs, and real design decisions behind agentic AI systems. I will also link that in the description below.

And if this video made you think, OK, I don't just want to watch this, I actually want to build these systems, then definitely go check out Gen Academy. Our flagship program is a Mastering Agentic certification. It is a live certification program where every single week I and my co-founder Arvind are actually teaching you classes, and every single week you are going to be building projects, and not demo projects — production-level projects. For the projects we have two tracks: you can either choose the low-code/no-code tools or you can choose the code-heavy tools. This is not just for engineers or developers. This is for anybody who wants to become an AI professional and wants to understand how AI agents are built.

What I am super excited about is that we have partnered with companies like NVIDIA, OpenAI, Fireworks AI, Replit, Pinecone, Mem0, 11 Labs, LlamaIndex, LangChain, and many more. So as a student in the cohort, you will get credits for all of these tools, and you will get to learn directly from AI experts from their teams as well. A lot of people are actually using their company's learning and development budget for this certification. So, definitely check with your manager for reimbursement.

And for my YouTube audience, I have added a special discount code which is also there in the description below. OK, I hope this video was insightful for you. I know it was a lot to unpack, but you know, you can always rewatch this. And if you are like me, just make handwritten notes. It just makes the learning process so much easier. If you have any questions, you know, you can drop the comments below. And I will check it out. OK, then I will see you in the next one.
