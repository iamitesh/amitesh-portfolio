# Agentic AI System Design — Architectural Decisions Reference

> Derived from the transcript of "Agentic AI System Design" by Aishwarya Srinivasan
> (video `mwN75EiGfCE`; source translation: `transcript-mwN75EiGfCE-translation.md`).
> This document extracts every architectural decision the video discusses, framed as:
> **the decision → the recommended choice → why → implementation notes → tradeoffs.**

---

## 1. System Architecture: Single-Agent vs Multi-Agent

### Decision 1.1 — Which system pattern to use

**Recommended choice:** Pick single-agent when one primary agent can own the whole workflow; pick multi-agent only when the task genuinely has clear specialization, parallel work, review loops, or long-running workflows.

**Why:**
- In a single-agent system, one primary agent owns the workflow — it may still call multiple tools, retrieve documents, update memory, and perform multiple reasoning steps, but the control loop stays centralized (e.g., a customer-support agent that classifies a request, retrieves account context, calls a billing API, asks for confirmation, then generates a final response).
- In a multi-agent system, the workflow is split across specialized agents (planning, knowledge retrieval, code writing, output review, execution), which buys separation of responsibilities but costs coordination.

**Tradeoffs of multi-agent (from the video):**
- More coordination overhead
- More failure modes
- More states to track
- More logs to inspect
- More places where cost and latency can increase

**Implementation notes:**
- If you go multi-agent, design each agent with defined roles, **input contracts, output contracts, and routing logic** between agents — not just "one agent doing everything."
- Multi-agent systems become extremely difficult to debug without explicit agent-to-agent routing (see §5.5).

---

## 2. Model Layer

### Decision 2.1 — One model for everything vs model routing

**Recommended choice:** Model routing — use cheaper, faster models for low-complexity steps; reserve stronger reasoning models for steps where deeper reasoning changes the outcome.

**Why:** A single powerful model handling every step gets expensive and slow very quickly.

**Routing table (from the video):**

| Step type | Model tier |
|---|---|
| Intent classification, routing, extraction, schema filling, simple summarization | Small / cheap / fast |
| Ambiguous constraints, deeper reasoning, synthesis (e.g., "I'm traveling next week, avoid mornings"; "make sure it happens after my lab results come in") | Stronger reasoning model |
| Detecting whether a user wants to book / reschedule / cancel / ask | Small model is sufficient |
| Extracting date, time, doctor name, appointment type into a JSON schema | May not need an LLM at all |

### Decision 2.2 — Free-form text vs structured outputs

**Recommended choice:** Structured outputs at the model layer. Any step that feeds another system must return a predictable structure, never free-form prose.

**Implementation notes:**
- Use JSON schema, Pydantic models, function/tool calling, or whichever structured-output mechanism the model provider supports.

### Decision 2.3 — Define a per-step model contract

**Recommended choice:** The model layer must answer three specific questions for every step:

1. What model is going to be used for this step?
2. What output contract does it return?
3. What happens if the model fails or returns invalid output?

**Why:** Deciding the failure path up front is what separates a demo from a reliable system.

---

## 3. Tool Layer

### Decision 3.1 — What counts as a tool

A tool is any interface between the model and the external world: database lookup, CRM API, calendar API, payment API, code interpreter, internal search service, ticketing system, Slack action, Google action — any backend function the agent is allowed to call.

### Decision 3.2 — Design tools like APIs with strict constraints

**Recommended choice:** Every tool gets a full contract:

- Clear name
- Description
- Input schema
- Output schema
- Permission boundaries
- Timeout behavior
- Retry behavior
- Error format

**Why:** The model must not be allowed to send arbitrary instructions into your backend.

**Anti-pattern (from the video):** a tool called `update_user` that accepts one vague natural-language string like "update this user based on the request" — too open-ended.

**Safer contract:** `user_id`, `field_to_update`, `new_value`, `reason`, `source_request_id`, `confirmation_required`.

### Decision 3.3 — Machine-readable tool outputs

**Recommended choice:** Both success and failure return structured results — structured error on failure, structured result on success. The agent should never have to parse messy prose from your backend.

### Decision 3.4 — Read/write separation and risk tiering

**Recommended choice:** Introduce write capability in tiers:

1. Read-only capabilities first
2. Low-risk write tools
3. High-risk write tools — **only** with validation and human approval

**Why:** Fetching available appointment slots is very different from canceling an appointment. Each tier carries a different risk factor.

### Decision 3.5 — Whether to adopt MCP

**Recommended choice:** MCP (Model Context Protocol) is one emerging, standardized pattern for exposing tools, resources, and context to agents — but it is optional.

**Why:** Even without MCP, the system-design principle is identical: tools need contracts, permissions, boundaries, and logs.

---

## 4. Memory & State

### Decision 4.1 — Separate memory from state

**Recommended choice:** Treat them as two distinct concerns. This is where many agentic systems become messy.

| | Scope | Examples |
|---|---|---|
| **State** | Current execution context of the workflow | Which step are we on; what information has been collected; which tools were called; what did they return; has the user confirmed; did the workflow pass or fail |
| **Memory** | Broader, cross-run information | Conversation history, user preferences, past actions, retrieved knowledge, document context, summaries, long-form info that may be useful later |

### Decision 4.2 — Storage selection by access pattern

**Recommended choice:** Do **not** dump everything into a vector database. Choose storage per access pattern:

| Data | Store |
|---|---|
| Conversation & workflow state | Redis, DynamoDB, Postgres, MongoDB, or another low-latency store |
| Application state | Your application database |
| Knowledge retrieval | RAG with Pinecone, PG Vector, Weaviate, Elasticsearch, OpenSearch, or a managed knowledge base |
| Long-term archive | Cheaper object storage (e.g., an S3 bucket) |

### Decision 4.3 — Structured workflow state

**Recommended choice:** Keep workflow state structured, not conversational. Example: for an appointment reschedule, store `current_appointment_id`, `proposed_new_time`, `confirmation_status`, and `workflow_step` as structured fields.

**Data-minimization rule:** Don't casually pass the user's full medical history through the LLM if the model only needs the appointment ID and the list of available slots.

### Decision 4.4 — Short-term context vs long-term memory

**Recommended choice:**
- **Short-term context** = what you pass into the prompt for the current turn.
- **Long-term memory** = retrieved selectively, on demand.

**Why:** The goal is **not** to stuff everything into the model's context window — that creates context bloat. The goal is to retrieve the *smallest useful context for the current step* for the model to take a decision on.

### Decision 4.5 — Memory design is data architecture

**Recommended choice:** Own these five questions explicitly: what to store, where to store it, how long to keep it, how to retrieve it, and what is safe to send to the model or not.

---

## 5. Orchestration

### Decision 5.1 — What orchestration is responsible for

Orchestration is the control layer that defines how the system moves from user request → intermediate steps → tool calls → final output.

### Decision 5.2 — Implementation technology

**Options (from the video):**
- Plain application code
- Graph-based framework (LangGraph)
- Workflow engines (Temporal)
- LlamaIndex Workflows
- LangChain
- Custom state machines and queues
- A combination of all of these

**Recommended choice:** No single mandated stack — the requirement is that the layer defines control flow **explicitly**, however it is implemented.

### Decision 5.3 — Define the control flow explicitly

**Recommended reference flow (from the video):**

1. Receive user message
2. Classify intent
3. Retrieve required context
4. Decide whether the request is in scope or not
5. Select tools
6. Validate tool inputs
7. Execute tools
8. Inspect results
9. Ask for confirmation if needed
10. Generate final response
11. Log the trace and send evaluation data asynchronously

**Key principle:** Do not confuse autonomy with lack of structure. Production agents need a very clear control flow.

### Decision 5.4 — Deterministic pipeline vs fully autonomous agent loop

**Recommended choice:** For simple use cases, a deterministic pipeline is often **better** than an autonomous loop.

**Why:** Not every workflow needs planning and reflection. If the sequence of steps is mostly known, design it as a pipeline or state machine; use agentic reasoning only where the workflow genuinely needs dynamic decision-making.

### Decision 5.5 — Graph-based orchestration for complex flows

**Recommended choice:** Use graph orchestration when you need branching, retries, loops, approval gates, and fallback paths. Examples:

- Extraction fails → retry with a different prompt or a different model
- Tool returns "no available appointment" → branch into a "suggest alternate" path
- User asks for cancellation → branch into a confirmation path

### Decision 5.6 — Agent-to-agent routing in multi-agent systems

**Recommended choice:** Define for every handoff:

- Which agent owns the next step
- What information gets passed
- What output format is expected
- How conflicts are resolved

**Why:** Without this, multi-agent systems become extremely difficult to debug.

---

## 6. Evaluation

### Decision 6.1 — Final-answer eval vs trace-level eval

**Recommended choice:** Trace-level evaluation. Evaluate **each important step** of the trajectory: intent classification, retrieval quality, tool selection, tool arguments, policy compliance, confirmation behavior, final answer quality, and task success.

**Why:** In agentic systems the traditional assumption ("function runs, no exception → system works") breaks quickly. Failure modes include:

- Valid JSON that is semantically wrong
- Correct tool called with wrong arguments
- Irrelevant context retrieved
- Answers from stale information
- Failure to ask for confirmation
- Refusing a valid request, or complying with an unsafe one

**Example:** A support agent can produce a polished final answer while having selected the wrong refund policy. Final-text-only eval misses the failure; trace eval shows the retrieval step pulled the wrong policy document or the model misclassified the user's plan type.

### Decision 6.2 — Maintain a regression test set

**Recommended choice:** A test set of realistic scenarios:

- Happy paths
- Ambiguous requests
- Out-of-scope requests
- Tool failures
- Malicious inputs
- Partial information
- Policy edge cases
- Escalation cases

**Why:** This becomes your regression suite whenever you change the model, prompt, retrieval logic, or tool schema.

### Decision 6.3 — Evaluating in production

**Recommended choice:**
- Run sampled, asynchronous evaluations in production (a judge model / LLM-as-a-judge scores a percentage of conversations offline).
- Feed high-signal user feedback directly into the eval queue.
- Be careful: LLM-as-a-judge is useful but **not perfect**. For important workflows, combine model-based grading with **deterministic checks and human review**.

### Decision 6.4 — Metrics over examples

**Recommended choice:** The eval system must eventually produce metrics, not just examples:

- Intent accuracy
- Tool call success rate
- Invalid schema rate
- Retrieval hit rate
- Refusal accuracy
- Escalation rate
- Task completion rate
- User flag rate
- Cost per successful task

---

## 7. Approval & Policy Control

### Decision 7.1 — Which actions need human approval

**Recommended choice:** Not every action needs approval, but high-impact actions must have gates. Actions that should **never** fire on model-inferred intent alone:

- Sending an email
- Deleting data
- Issuing a refund
- Canceling an appointment
- Changing billing
- Updating a CRM record
- Running code
- Placing an order
- Making a financial transaction

**Principle:** There should always be a human in the loop for these.

### Decision 7.2 — The safe execution pattern

**Recommended pattern:** **Model suggests → code validates → user approves → tool executes.**

The validation step must be **deterministic** wherever possible:

1. Check ownership
2. Check permissions
3. Check whether the requested action is allowed
4. Check whether required fields are present
5. Check whether the user has confirmed the exact action
6. Then execute

**Example:** "Cancel my appointment" — the model classifies intent and proposes the target appointment, but the system verifies that the logged-in user owns it, that it is cancelable, that cancellation is allowed under policy, **and** that the user explicitly confirms before the cancellation API is called.

### Decision 7.3 — Who owns business rules

**Recommended choice:** The application code is the source of truth for business rules — **not the agent**.

**Why (multi-agent case):** If one agent generates a plan and another executes it, the execution layer must not blindly trust the planning layer. Tool execution still needs validation and authorization.

---

## 8. Production Principle: Reliability

### Decision 8.1 — Decompose prompts into smaller steps

**Recommended choice:** Decompose large prompts into smaller steps.

**Why:** A single joint prompt that classifies intent, retrieves context, decides policies, calls tools, and writes the final response is very hard to test. Smaller steps are easier to evaluate and debug.

### Decision 8.2 — Structured outputs with validation and retry

**Recommended choice:** When the next step depends on the model's output, don't rely on free-form text:

1. Validate the schema
2. If invalid → retry
3. If still failing → use a fallback path

### Decision 8.3 — Treat every model call as an unreliable upstream dependency

**Recommended choice:** Every one of these needs a handling path:

- Timeouts
- Malformed outputs
- Rate limits
- Provider errors
- Degraded quality

### Decision 8.4 — Separate deterministic validation from model reasoning

**Recommended choice:** Whatever the model proposes, code must be able to check it:

- Model extracts a date → code can validate the date
- Model selects a user ID → code can verify permissions
- Model proposes a tool call → code can validate the arguments

**Core principle:** Reliability is not about making the model perfect — it is about designing the system so model imperfections do not immediately become product failures.

---

## 9. Production Principle: Cost & Latency

### Decision 9.1 — Design cost and latency together

**Why:** A single interaction may include: intent classification, query rewriting, retrieval, planning, tool selection, tool argument generation, tool result interpretation, final response generation, and evaluation. If every step uses a large reasoning model, the system is super slow and super expensive.

### Decision 9.2 — Cost/latency levers (all recommended)

| Lever | Rule |
|---|---|
| **Model routing** | Small models for simple classification/extraction; larger models only when ambiguity, reasoning, or synthesis is required |
| **Token limits** | Limit output tokens aggressively — output tokens are both a cost lever and a latency lever. Two-sentence answer needed → no long explanation; downstream needs JSON → no prose |
| **Caching** | Cache retrieval results, repeated policy lookups, tool metadata, stable context |
| **Batching / async** | Use for non-blocking work like evaluation and summaries |
| **Streaming** | Always stream user-facing responses that may take time |
| **Progress states** | For long-running tool calls, show progress instead of a blank screen |
| **Early scope gates** | Enforce scope early with cheap filters, rules, and intent gates **before** the expensive reasoning step happens — out-of-scope requests burn tokens and tool calls |

### Decision 9.3 — Cost observability

**Recommended choice:** Track tokens in, tokens out, cost per step, cost per conversation, and cost per successful task.

---

## 10. Production Principle: Context & RAG Design

### Decision 10.1 — Pass the right context, not everything

**Recommended choice:** The goal is to pass the right context **for the current step** — this is one of the biggest differences between a toy agent and a useful production agent.

Context sources (each with different freshness, trust, privacy, and latency characteristics):

- User message
- Conversation state
- Application database
- Retrieved documents
- Tool results
- User profile
- Long-term memory

### Decision 10.2 — Retrieval pipeline quality over "just a vector DB"

**Recommended choice:** Retrieval quality matters more than simply having a vector database. The pipeline should include:

1. Document chunking
2. Metadata filters
3. Hybrid search when useful
4. Reranking
5. Freshness controls
6. Source attribution (when the user needs trust)

### Decision 10.3 — Separate trusted instructions from untrusted content

**Recommended rules:**
- Retrieved documents must not be allowed to override system instructions.
- Tool outputs are **data**, not instructions.
- User-provided content must be isolated from developer/system instructions.

### Decision 10.4 — Long conversations: summarization + checkpoints

**Recommended choice:** Don't pass the full history forever. Use summarization and checkpoints, store the summary **separately** from raw conversation logs, and keep track of what the summary is allowed to influence.

**Definition of success:** A context-aware system knows what information it needs, where it should retrieve it from, whether it is trusted, and whether it is safe to send to the model.

---

## 11. Observability

### Decision 11.1 — Log the anatomy of every agent run

**Recommended choice:** Log all of the following (and more):

| Category | Fields |
|---|---|
| Identity | Model name, model version, prompt version, step name, workflow ID, conversation ID |
| Tool use | Tool name, tool arguments (with sensitive values masked) |
| Performance | Latency, time to first token, tokens in, tokens out, cost |
| Resilience | Number of retries, fallbacks triggered, errors |
| Feedback & evals | Whether feedback was used, eval scores |

### Decision 11.2 — Failure localization

**Recommended choice:** From logs you must be able to answer: *where did the failure happen?* — intent classification, retrieval, planning, tool selection, tool execution, policy validation, or final response error.

---

## 12. Security

### Decision 12.1 — Threat model: everything touching the model is attacker-controlled

**Recommended choice:** Treat everything that touches the model as an attacker-controlled input unless proven otherwise:

- User messages → direct prompt injection
- Retrieved documents → indirect prompt injection
- Tool outputs → poisoned data
- Model outputs → unsafe commands (SQL, HTML, other code)

### Decision 12.2 — Isolation and execution rules

**Recommended rules:**
- Separate instructions from data.
- Do not execute raw model output.
- Do not run SQL or shell commands directly from model-generated text.
- Give tools least-privilege permissions.
- Add approval gates for risky actions.

---

## 13. Privacy

### Decision 13.1 — Send the minimum data needed to the model

**Rules (from the video):**
- Model needs only appointment ID + availability → do not send the full patient report.
- Model only needs to summarize a ticket → do not send the full customer history.
- Keep sensitive fields out of the prompt unless required for the task.

### Decision 13.2 — PII handling and retention

**Recommended choice:**
- Mask PII at the right time.
- Set retention policies for logs, traces, and conversation archives.

### Decision 13.3 — Define the data boundary

**Recommended choice:** Treat these as part of your data boundary: your model provider, your vector database, your observability platform, and your logging systems.

**Why it matters:** This is why agentic AI system design is not just prompt engineering — it is backend design, data design, security design, and product design with an LLM in the loop.

---

## 14. Final Takeaway: The Complete Checklist

A production-grade agentic AI system needs **all** of the following:

- [ ] Clear model routing (§2)
- [ ] Strict tool contracts (§3)
- [ ] Explicit memory and state management (§4)
- [ ] Orchestration with explicit control flow (§5)
- [ ] Trace-level evals (§6)
- [ ] Approval gates (§7)
- [ ] Reliability patterns — decomposition, contracts, retries, validation, fallbacks, monitoring (§8)
- [ ] Cost and latency controls (§9)
- [ ] Context design (§10)
- [ ] Observability (§11)
- [ ] Security (§12)
- [ ] Privacy (§13)

---

*Appendix — source material:* the video also references two prior videos ("AI Agents Explained", "Single Agents vs Multi Agents"), a deep-dive on AI evals, and a free ~2-hour Agentic AI System Design masterclass recording, all linked in the video description.
