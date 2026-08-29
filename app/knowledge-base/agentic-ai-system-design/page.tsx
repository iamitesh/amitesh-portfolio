import type { Metadata } from "next";
import styles from "../knowledge-base.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Agentic AI System Design | Knowledge Base",
  description: "Complete reference for production-grade agentic AI architecture: models, tools, memory, orchestration, evals, reliability, RAG, observability, security, and privacy.",
};

const steps = ["Receive message", "Classify intent", "Retrieve context", "Check scope", "Select tools", "Validate inputs", "Execute tools", "Inspect results", "Confirm if needed", "Final response", "Log trace + async evals"];
const evalCases = ["Happy paths", "Ambiguous requests", "Out-of-scope requests", "Tool failures", "Malicious inputs", "Partial information", "Policy edge cases", "Escalation cases"];
const metrics = ["Intent accuracy", "Tool call success rate", "Invalid schema rate", "Retrieval hit rate", "Refusal accuracy", "Escalation rate", "Task completion rate", "User flag rate", "Cost per successful task"];
const highImpact = ["Send email", "Delete data", "Issue refund", "Cancel appointment", "Change billing", "Update CRM record", "Run code", "Place order", "Financial transaction"];
const checklist = ["Clear model routing", "Strict tool contracts", "Explicit memory & state management", "Orchestration with explicit control flow", "Trace-level evals", "Approval gates", "Reliability patterns (decomposition, contracts, retries, validation, fallbacks, monitoring)", "Cost & latency controls", "Context design", "Observability", "Security", "Privacy"];

export default function AgenticAISystemDesignPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.wrap}>
        <header className={styles.topbar}>
          <a className={styles.brand} href={`${basePath}/knowledge-base/`}>AA / Knowledge Base</a>
          <a className={styles.back} href={`${basePath}/knowledge-base/`}>← All notes</a>
        </header>

        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <span className={styles.eyebrow}>Production-grade agentic systems</span>
            <h1>Agentic AI System Design</h1>
            <p>A complete reference to the architectural decisions behind robust agentic AI systems—from model routing and tool contracts through memory, orchestration, evaluation, approvals, reliability, cost, RAG, observability, security, and privacy.</p>
            <div className={styles.tags}>
              {['Architecture','Models','Tools','Memory','Evals','RAG','Security'].map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}
            </div>
            <nav className={styles.toc} aria-label="Article sections">
              {[
                ['architecture','Architecture'],['models','Models'],['tools','Tools'],['memory','Memory'],['orchestration','Orchestration'],['evaluation','Evaluation'],['approval','Approval'],['reliability','Reliability'],['cost','Cost'],['context','RAG'],['observability','Observability'],['security','Security'],['privacy','Privacy'],['checklist','Checklist']
              ].map(([id,label]) => <a href={`#${id}`} key={id}>{label}</a>)}
            </nav>
          </header>

          <section className={styles.section} id="architecture">
            <div className={styles.kicker}>System architecture</div>
            <h2>Single-Agent vs Multi-Agent</h2>
            <div className={styles.cols2}>
              <div className={styles.panel}>
                <h3>Single-Agent</h3>
                <p><strong>One primary agent owns the entire workflow.</strong></p>
                <p>It may still call multiple tools, retrieve documents, update memory, and run many reasoning steps—but the control loop stays centralized.</p>
                <p>Example: a customer support agent classifies a request, retrieves account context, calls a billing API, asks for confirmation, then generates the final response.</p>
              </div>
              <div className={styles.panel}>
                <h3>Multi-Agent</h3>
                <p><strong>Workflow is split across specialized agents</strong>: planning, knowledge retrieval, code writing, review, and execution.</p>
                <p>The key idea is separation of responsibilities: defined roles, input contracts, output contracts, and routing logic between agents.</p>
              </div>
              <div className={styles.panel}>
                <h3>Use multi-agent when…</h3>
                <ul><li>Task has clear specialization</li><li>Parallel work helps</li><li>Review loops are valuable</li><li>Workflows are long-running</li></ul>
              </div>
              <div className={styles.panel}>
                <h3>But multi-agent adds…</h3>
                <ul><li>More coordination overhead</li><li>More failure modes and states to track</li><li>More logs to inspect</li><li>More places where cost and latency grow</li></ul>
              </div>
            </div>
          </section>

          <section className={styles.section} id="models">
            <div className={styles.kicker}>Building block 01 · Model layer</div>
            <h2>Model Routing, Not One Model</h2>
            <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Step type</th><th>Model tier</th></tr></thead><tbody>
              <tr><td>Intent classification, routing, extraction, schema filling, simple summarization</td><td>Small / cheap / fast model</td></tr>
              <tr><td>Book vs reschedule vs cancel vs question detection</td><td>Small model is sufficient</td></tr>
              <tr><td>Date, time, doctor name, appointment type → JSON schema</td><td>May not need an LLM at all</td></tr>
              <tr><td>Ambiguous constraints, deeper reasoning, synthesis—such as “I’m traveling next week, avoid mornings” or “after my lab results come in”</td><td>Stronger reasoning model</td></tr>
            </tbody></table></div>
            <div className={styles.cols2} style={{marginTop:14}}>
              <div className={styles.panel}><h3>Structured outputs</h3><p>Any step feeding another system returns predictable structure—never free-form prose. Use JSON Schema, Pydantic models, or function/tool calling.</p></div>
              <div className={styles.panel}><h3>Three-question contract per step</h3><p>1. Which model runs this step?<br/>2. What output contract does it return?<br/>3. What happens if it fails or returns invalid output?</p></div>
            </div>
          </section>

          <section className={styles.section} id="tools">
            <div className={styles.kicker}>Building block 02 · Tools</div>
            <h2>Tools Are APIs—Give Them Contracts</h2>
            <p>Tools are interfaces between the model and the external world: database lookups, CRM/calendar/payment APIs, code interpreters, search, ticketing, Slack, and Google actions.</p>
            <div className={styles.chips}>{['Name','Description','Input schema','Output schema','Permission boundaries','Timeout behavior','Retry behavior','Error format'].map((x)=><span className={styles.chip} key={x}>{x}</span>)}</div>
            <div className={styles.cols2} style={{marginTop:14}}>
              <div className={styles.panel}><h3>Anti-pattern</h3><p><strong>update_user</strong> accepts one vague string: “update this user based on the request.” That is too open-ended.</p></div>
              <div className={styles.panel}><h3>Safer contract</h3><p><strong>user_id · field_to_update · new_value · reason · source_request_id · confirmation_required</strong></p></div>
            </div>
            <p>Tool outputs must be machine-readable: structured error on failure, structured result on success. The agent should never have to parse messy prose from your backend.</p>
            <h3>Risk tiers</h3>
            <div className={styles.steps}><span className={styles.step}>Read-only capabilities first</span><span className={styles.step}>Low-risk write tools</span><span className={styles.step}>High-risk write tools—only with validation + human approval</span></div>
            <p>Fetching available appointment slots is very different from canceling an appointment. Understand the risk factor per tier.</p>
            <div className={styles.panel}><h3>MCP (Model Context Protocol)</h3><p>One emerging standardized pattern for exposing tools, resources, and context to agents. <strong>Optional.</strong> Even without MCP, the principle is identical: tools need contracts, permissions, boundaries, and logs.</p></div>
          </section>

          <section className={styles.section} id="memory">
            <div className={styles.kicker}>Building block 03 · Memory & state</div>
            <h2>Memory Is Not One Thing</h2>
            <div className={styles.cols2}>
              <div className={styles.panel}><h3>State</h3><p><strong>Current execution context of the workflow.</strong></p><ul><li>Which step are we on?</li><li>What has been collected so far?</li><li>Which tools were called, and what did they return?</li><li>Has the user confirmed?</li><li>Did the workflow pass or fail?</li></ul></div>
              <div className={styles.panel}><h3>Memory</h3><p><strong>Broader, cross-run information.</strong></p><ul><li>Conversation history</li><li>User preferences</li><li>Past actions</li><li>Retrieved knowledge and document context</li><li>Summaries and long-form information useful later</li></ul></div>
            </div>
            <div className={styles.quote}>Keep workflow state structured: appointment ID, proposed new time, confirmation status, workflow step. Do not pass the full medical history through the LLM when it only needs the appointment ID and available slots.</div>
            <h3>Storage by access pattern</h3>
            <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Data</th><th>Store</th></tr></thead><tbody>
              <tr><td>Conversation & workflow state</td><td>Redis, DynamoDB, Postgres, MongoDB, or another low-latency store</td></tr>
              <tr><td>Application state</td><td>Your application database</td></tr>
              <tr><td>Knowledge retrieval (RAG)</td><td>Pinecone, PG Vector, Weaviate, Elasticsearch, OpenSearch, or a managed knowledge base</td></tr>
              <tr><td>Long-term archive</td><td>Cheaper object storage such as an S3 bucket</td></tr>
            </tbody></table></div>
            <div className={styles.cols2} style={{marginTop:14}}>
              <div className={styles.panel}><h3>Short-term vs long-term</h3><p><strong>Short-term:</strong> what you pass into the prompt for the current turn.<br/><strong>Long-term:</strong> retrieved selectively.</p><p>Never stuff everything into the context window. Retrieve the <strong>smallest useful context</strong> for the current step.</p></div>
              <div className={styles.panel}><h3>Memory design = data architecture</h3><ul><li>What to store</li><li>Where to store it</li><li>How long to keep it</li><li>How to retrieve it</li><li>What is safe to send to the model</li></ul></div>
            </div>
          </section>

          <section className={styles.section} id="orchestration">
            <div className={styles.kicker}>Building block 04 · Orchestration</div>
            <h2>Explicit Control Flow</h2>
            <p>Orchestration is the control layer: user request → intermediate steps → tool calls → final output. It can be implemented as plain code, LangGraph, Temporal, LlamaIndex Workflows, LangChain, custom state machines/queues, or a combination.</p>
            <div className={styles.steps}>{steps.map((x)=><span className={styles.step} key={x}>{x}</span>)}</div>
            <div className={styles.quote}>Do not confuse autonomy with lack of structure. Production agents need a very clear control flow.</div>
            <div className={styles.cols2} style={{marginTop:18}}>
              <div className={styles.panel}><h3>Simple flows → deterministic pipeline</h3><p>Not every workflow needs planning and reflection. If the sequence is mostly known, design it as a pipeline or state machine. Use agentic reasoning only when the workflow genuinely needs dynamic decisions.</p></div>
              <div className={styles.panel}><h3>Complex flows → graph orchestration</h3><p>Graphs represent branching, retries, loops, approval gates, and fallbacks.</p><ul><li>Extraction fails → retry with a different prompt or model</li><li>No available appointment → branch to suggest alternate</li><li>Cancellation request → branch to confirmation path</li></ul></div>
            </div>
            <div className={styles.panel} style={{marginTop:14}}><h3>Agent-to-agent routing</h3><p>For every handoff define which agent owns the next step, what information gets passed, the expected output format, and how conflicts are resolved. Without this, multi-agent systems become extremely difficult to debug.</p></div>
          </section>

          <section className={styles.section} id="evaluation">
            <div className={styles.kicker}>Building block 05 · Evaluation</div>
            <h2>Trace-Level Evals, Not Just Final Answers</h2>
            <p>In agentic systems, “no exception thrown” no longer means “it works.” Evaluate every important step of the trajectory: intent classification, retrieval quality, tool selection, tool arguments, policy compliance, confirmation behavior, final answer quality, and task success.</p>
            <div className={styles.chips}>{['Valid JSON, semantically wrong','Correct tool, wrong arguments','Irrelevant context retrieved','Stale information','No confirmation asked','Refuses valid request','Complies with unsafe request'].map((x)=><span className={`${styles.chip} ${styles.bad}`} key={x}>{x}</span>)}</div>
            <div className={styles.quote}>A polished final answer can still have used the wrong refund policy. Final-text-only eval misses the failure; trace eval shows whether retrieval pulled the wrong policy document or the model misclassified the user’s plan type.</div>
            <h3>Test sets</h3>
            <div className={styles.chips}>{evalCases.map((x)=><span className={styles.chip} key={x}>{x}</span>)}</div>
            <p>This set becomes your regression suite whenever you change the model, prompt, retrieval logic, or tool schema.</p>
            <div className={styles.cols2}>
              <div className={styles.panel}><h3>Production evals</h3><ul><li>Sampled async evals—LLM-as-a-judge scores a percentage of conversations offline</li><li>High-signal user feedback → eval queue</li><li>LLM-as-judge is useful but not perfect: combine model grading + deterministic checks + human review</li></ul></div>
              <div className={styles.panel}><h3>Produce metrics, not just examples</h3><div className={styles.chips}>{metrics.map((x)=><span className={styles.chip} key={x}>{x}</span>)}</div></div>
            </div>
          </section>

          <section className={styles.section} id="approval">
            <div className={styles.kicker}>Building block 06 · Approval & policy control</div>
            <h2>Human in the Loop for High Impact</h2>
            <p>These actions should never happen just because the model inferred the intent:</p>
            <div className={styles.chips}>{highImpact.map((x)=><span className={`${styles.chip} ${styles.bad}`} key={x}>{x}</span>)}</div>
            <div className={styles.steps} style={{marginTop:18}}><span className={styles.step}>Model suggests</span><span className={styles.step}>Code validates</span><span className={styles.step}>User approves</span><span className={styles.step}>Tool executes</span></div>
            <div className={styles.cols2} style={{marginTop:14}}>
              <div className={styles.panel}><h3>Deterministic validation</h3><ul><li>Check ownership</li><li>Check permissions</li><li>Check action is allowed</li><li>Check required fields are present</li><li>Check user confirmed the exact action</li></ul></div>
              <div className={styles.panel}><h3>Source of truth</h3><p>Your application code—not the agent—is the source of truth for business rules. An execution agent must not blindly trust a planning agent.</p></div>
            </div>
          </section>

          <section className={styles.section} id="reliability">
            <div className={styles.kicker}>Production principle 01 · Reliability</div>
            <h2>System Reliable Even When the Model Isn’t</h2>
            <div className={styles.cols2}>
              <div className={styles.panel}><h3>Decompose prompts</h3><p>A single joint prompt that classifies, retrieves, decides policy, calls tools, and writes the response is very hard to test. Smaller steps are easier to evaluate and debug.</p></div>
              <div className={styles.panel}><h3>Validate → retry → fallback</h3><p>If the next step depends on the model’s output, never rely on free-form text. Validate the schema, retry on invalid, and fall back if it still fails.</p></div>
              <div className={styles.panel}><h3>Model call = unreliable dependency</h3><p>Timeouts, malformed outputs, rate limits, provider errors, and degraded quality all need explicit handling paths.</p></div>
              <div className={styles.panel}><h3>Deterministic validation ≠ model reasoning</h3><p>Model extracts a date → code validates the date. Model picks a user ID → code verifies permissions. Model proposes a tool call → code validates arguments.</p></div>
            </div>
            <div className={styles.quote}>Reliability is not about making the model perfect—it is about designing the system so model imperfections do not immediately become product failures.</div>
          </section>

          <section className={styles.section} id="cost">
            <div className={styles.kicker}>Production principle 02 · Cost & latency</div>
            <h2>Every Lever, Applied Together</h2>
            <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Lever</th><th>Rule</th></tr></thead><tbody>
              <tr><td>Model routing</td><td>Small models for simple classification/extraction; larger models only when ambiguity, reasoning, or synthesis is required</td></tr>
              <tr><td>Token limits</td><td>Limit output tokens aggressively. Two-sentence answer → no essay; downstream needs JSON → no prose</td></tr>
              <tr><td>Caching</td><td>Cache retrieval results, repeated policy lookups, tool metadata, and stable context</td></tr>
              <tr><td>Batching / async</td><td>For non-blocking work such as evaluation and summaries</td></tr>
              <tr><td>Streaming</td><td>Stream user-facing responses that may take time</td></tr>
              <tr><td>Progress states</td><td>Long-running tool calls → show progress, never a blank screen</td></tr>
              <tr><td>Early scope gates</td><td>Cheap filters, rules, and intent gates before expensive reasoning; out-of-scope requests burn tokens and tool calls</td></tr>
            </tbody></table></div>
            <p>Track: tokens in · tokens out · cost per step · cost per conversation · cost per successful task.</p>
          </section>

          <section className={styles.section} id="context">
            <div className={styles.kicker}>Production principle 03 · Context & RAG design</div>
            <h2>Pass the Right Context</h2>
            <div className={styles.chips}>{['User message','Conversation state','Application DB','Retrieved documents','Tool results','User profile','Long-term memory'].map((x)=><span className={styles.chip} key={x}>{x}</span>)}</div>
            <p>Each source has different freshness, trust, privacy, and latency characteristics. Choose per step; do not dump everything.</p>
            <div className={styles.cols2}>
              <div className={styles.panel}><h3>Retrieval pipeline</h3><ul><li>Document chunking</li><li>Metadata filters</li><li>Hybrid search when useful</li><li>Reranking</li><li>Freshness controls</li><li>Source attribution when trust matters</li></ul></div>
              <div className={styles.panel}><h3>Trusted vs untrusted</h3><ul><li>Retrieved docs must not override system instructions</li><li>Tool outputs are data, not instructions</li><li>User content is isolated from developer/system instructions</li><li>Long conversations → summarization + checkpoints, stored separately from raw logs</li></ul></div>
            </div>
          </section>

          <section className={styles.section} id="observability">
            <div className={styles.kicker}>Production layer · Observability</div>
            <h2>Log the Anatomy of Every Run</h2>
            <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Category</th><th>Fields</th></tr></thead><tbody>
              <tr><td>Identity</td><td>Model name · model version · prompt version · step name · workflow ID · conversation ID</td></tr>
              <tr><td>Tool use</td><td>Tool name · tool arguments, with sensitive values masked</td></tr>
              <tr><td>Performance</td><td>Latency · time to first token · tokens in · tokens out · cost</td></tr>
              <tr><td>Resilience</td><td>Retry count · fallbacks triggered · errors</td></tr>
              <tr><td>Feedback & evals</td><td>Whether feedback was used · eval scores</td></tr>
            </tbody></table></div>
            <div className={styles.quote}>From the logs you must be able to answer: where did the failure happen—intent classification, retrieval, planning, tool selection, tool execution, policy validation, or final response?</div>
          </section>

          <section className={styles.section} id="security">
            <div className={styles.kicker}>Production layer · Security</div>
            <h2>Everything Touching the Model Is Attacker-Controlled</h2>
            <div className={styles.cols4}>
              <div className={styles.panel}><h3>User messages</h3><p>Direct prompt injection</p></div>
              <div className={styles.panel}><h3>Retrieved documents</h3><p>Indirect prompt injection</p></div>
              <div className={styles.panel}><h3>Tool outputs</h3><p>Poisoned data</p></div>
              <div className={styles.panel}><h3>Model outputs</h3><p>Unsafe commands—SQL, HTML, or other code</p></div>
            </div>
            <h3>Defense rules</h3>
            <div className={styles.chips}>{['Separate instructions from data','Never execute raw model output','No SQL/shell directly from generated text','Least-privilege tool permissions','Approval gates for risky actions'].map((x)=><span className={`${styles.chip} ${styles.good}`} key={x}>{x}</span>)}</div>
          </section>

          <section className={styles.section} id="privacy">
            <div className={styles.kicker}>Production layer · Privacy</div>
            <h2>Minimum Data, Defined Boundary</h2>
            <div className={styles.cols3}>
              <div className={styles.panel}><h3>Send the minimum</h3><p>Model needs appointment ID + availability → do not send the full patient report. It only summarizes a ticket → do not send the full customer history.</p></div>
              <div className={styles.panel}><h3>PII & retention</h3><p>Mask PII at the right time. Set retention policies for logs, traces, and conversation archives. Keep sensitive fields out of the prompt unless required for the task.</p></div>
              <div className={styles.panel}><h3>Data boundary</h3><p>Your model provider, vector database, observability platform, and logging systems are all part of your data boundary.</p></div>
            </div>
            <div className={styles.quote}>Agentic AI system design is not just prompt engineering—it is backend design, data design, security design, and product design with an LLM in the loop.</div>
          </section>

          <section className={styles.section} id="checklist">
            <div className={styles.kicker}>Final takeaway</div>
            <h2>The Complete Checklist</h2>
            <div className={styles.checklist}>{checklist.map((x)=><div className={styles.check} key={x}>{x}</div>)}</div>
          </section>

          <footer className={styles.footer}>
            Source basis: “Agentic AI System Design” by Aishwarya Srinivasan. This route preserves the architectural decisions from the supplied slide reference and presents them as a scrollable portfolio knowledge-base article.
          </footer>
        </article>
      </div>
    </main>
  );
}
