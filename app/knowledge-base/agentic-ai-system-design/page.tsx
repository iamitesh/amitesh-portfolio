import type { Metadata } from "next";
import styles from "../knowledge-base.module.css";
import MermaidDiagram from "../mermaid";

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
                ['architecture','Architecture'],['why-multi-agent-ai-systems','Multi-Agent Deep Dive'],['models','Models'],['tools','Tools'],['memory','Memory'],['orchestration','Orchestration'],['evaluation','Evaluation'],['approval','Approval'],['reliability','Reliability'],['cost','Cost'],['context','RAG'],['observability','Observability'],['security','Security'],['privacy','Privacy'],['checklist','Checklist']
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
            <MermaidDiagram code={"flowchart TD\nA[\"User goal\"] --> B[\"Decompose the goal into steps\"]\nB --> C[\"Pick the next step\"]\nC --> D{\"Does the step need a tool?\"}\nD -- \"Yes\" --> E[\"Call the tool through a strict API\"]\nE --> F[\"Inspect the structured result\"]\nD -- \"No\" --> F\nF --> G[\"Update state and memory\"]\nG --> H{\"Stopping condition reached?\"}\nH -- \"No\" --> C\nH -- \"Yes\" --> I[\"Answer or act on the world\"]"} caption={`1. The Agentic Loop: From Goal to Action — Illustrates the core agent loop from Section 1, What Is an Agentic AI System — decompose a goal, act through tools, update state, and repeat until a stopping condition is reached.`} />
            <MermaidDiagram code={"flowchart TD\nsubgraph SA[\"Single-agent system\"]\nA1[\"One agent owns the whole workflow\"]\nA2[\"Classify, retrieve context, call APIs\"]\nA3[\"Ask for confirmation, then respond\"]\nA1 --> A2 --> A3\nend\nsubgraph MA[\"Multi-agent system\"]\nB1[\"Planner agent\"]\nB2[\"Knowledge agent\"]\nB3[\"Coding agent\"]\nB4[\"Reviewer agent\"]\nB5[\"Executor agent\"]\nB1 --> B2 --> B3 --> B4 --> B5\nend\nU[\"User request\"] --> A1\nU --> B1\nA3 --> T1[\"Tradeoff: one control loop, simpler debugging\"]\nB5 --> T2[\"Tradeoff: defined roles and contracts, more coordination\"]"} caption={`2. Single-Agent vs. Multi-Agent: A Design Tradeoff — Illustrates Section 2, Single-Agent vs. Multi-Agent Systems, and the tradeoff between one control loop and many specialized roles with contracts.`} />
          </section>

            <section className={styles.section} id="why-multi-agent-ai-systems">
              <div className={styles.kicker}>Deep dive 01</div>
              <h2>{`Why Multi-Agent AI Systems?`}</h2>
              <h3>{`1.1 What a Single AI Agent Really Is`}</h3>
              <p>{`At its simplest level, an AI agent is just a large language model acting as the brain — with access to tools, memory, and the ability to make decisions and take actions. Instead of only chatting with you, it can go and do things: call APIs, write code, move data around, deploy code for you, send an email, pull in some data, write a document, and place it in your Google Drive. A clean way to think about it is that an agent is an LLM given arms, legs, and a toolkit.`}</p>
              <p>{`This is where most people stop. They learn how to build a single agent that can reason, maybe use a few tools, and complete a task end to end. But here is the reality of production: most real-world AI systems do not rely on just one agent. They rely on multiple agents working together. Teams shipping AI in the real world have moved from one super-smart agent doing everything to entire teams of AI agents where each agent owns one specific job and all of them coordinate to deliver something a single agent could never pull off. This one shift in thinking — from a single generalist to a coordinated team — is the entire difference between what people build in demos and what they ship in production.`}</p>
              <h3>{`1.2 Where the Single Agent Hits Its Ceiling`}</h3>
              <p>{`Picture how a single AI agent works today: you give it a task, it reasons through it, maybe calls a tool or two, and returns an answer. That is like having one really smart generalist on your team. They can write, code, analyze, do a bit of everything — but they are still one person: one brain, one focus, and one limited context window.`}</p>
              <p>{`The limits show up fast on real jobs. Imagine you are building an automated market research pipeline. You need to pull data from the web, analyze it, write a report, validate the numbers, and format everything into a presentation. If you give that whole job to a single agent, you are basically asking one human to be a researcher, an analyst, a writer, a fact-checker, and a designer all at the same time. The context window gets bloated, the task becomes very complex, and errors start compounding on each other in ways that are very hard to untangle. The result: the reliability of the system is not really good.`}</p>
              <h3>{`1.3 The Multi-Agent Alternative: A Team of Specialists`}</h3>
              <p>{`This is exactly where multi-agent AI systems come in. Instead of one agent doing everything, you have a team of specialized agents, each with a clear role, working together. One agent goes and searches the web. Another analyzes the data. A third drafts the report. A fourth validates the numbers. They pass work to each other, they can run things in parallel, and the whole operation is coordinated by what is called an orchestrator agent.`}</p>
              <p>{`Think of the orchestrator as the project manager. It breaks down the goal, assigns the tasks, and stitches the final output together. The workers do the actual work; the orchestrator makes sure the right work happens in the right order and comes back together into one coherent deliverable.`}</p>
              <h3>{`1.4 The Analogy: A Brilliant Freelancer vs. a Well-Run Agency`}</h3>
              <p>{`The analogy to hold onto throughout the video: a single agent is like a brilliant freelancer, and a multi-agent system is like a well-run agency. Both can do good work, but for any complex, long-horizon task, the agency setup wins every single time. In an agency, the writer does not have to also be the project manager and the accountant. Each person owns one thing and gets really, really good at it.`}</p>
              <h3>{`1.5 Three Benefits to Lock In`}</h3>
              <p>{`Beyond the analogy, multi-agent systems deliver three concrete benefits.`}</p>
              <div className={styles.panel}>
                <ul>
                  <li><strong>{`Parallelization`}</strong>{` — multiple tasks can happen at the same time instead of one after another.`}</li>
                  <li><strong>{`Specialization`}</strong>{` — each agent becomes really good at the narrow thing it was assigned to do, instead of being mediocre across everything.`}</li>
                  <li><strong>{`Scalability`}</strong>{` — you can add more agents as complexity grows without rebuilding the whole system from scratch.`}</li>
                </ul>
              </div>
              <MermaidDiagram code={"flowchart TD\nGoal[\"A complex job: research, analyze, write, validate, format\"]\nsubgraph solo[\"The freelancer route: one generalist agent\"]\nSoloAgent[\"One brain, one limited context window\"]\nSoloFail[\"Context bloat and compounding errors\"]\nend\nsubgraph team[\"The agency route: a team of specialists\"]\nOrc[\"Orchestrator: plans, delegates and stitches output\"]\nR1[\"Researcher agent\"]\nR2[\"Analyst agent\"]\nR3[\"Writer agent\"]\nR4[\"Validator agent\"]\nend\nResult[\"One coherent deliverable\"]\nBenefits[\"Parallelization, specialization and scalability\"]\nGoal -->|\"single agent\"| SoloAgent\nSoloAgent --> SoloFail\nSoloFail --> Weak[\"Weak reliability on complex work\"]\nGoal -->|\"orchestrated team\"| Orc\nOrc --> R1\nOrc --> R2\nOrc --> R3\nOrc --> R4\nR1 --> Result\nR2 --> Result\nR3 --> Result\nR4 --> Result\nResult --> Benefits"} caption={`1. From One Generalist to a Coordinated Team — Illustrates Section 1 (Why Multi-Agent AI Systems?) — the shift from an overloaded single generalist to an orchestrator-led team of specialists.`} />
            </section>

            <section className={styles.section} id="the-four-design-patterns">
              <div className={styles.kicker}>Deep dive 02</div>
              <h2>{`The Four Design Patterns`}</h2>
              <p>{`Once you understand the `}<em>{`why`}</em>{`, the next question is the `}<em>{`how`}</em>{`: how do you actually structure these agents to work together? There is not just one way to do it — there are four (and probably more), and almost every production multi-agentic AI system you have ever heard of uses one of them or some combination of them.`}</p>
              <p>{`First, a definition: a design pattern is just a reusable blueprint for solving a common problem. Think of it as a recipe — you do not reinvent how to make pasta every time you cook it; you follow a proven structure and adapt it to your specific ingredients. In multi-agent AI, four patterns have emerged as the dominant ones in production.`}</p>
              <h3>{`2.1 The Orchestrator–Worker Pattern`}</h3>
              <p>{`This is by far the most common pattern, and probably the first one you will ever build. You have one orchestrator agent at the top that plans and delegates. Below it are the worker agents, each with a specific job. The orchestrator does not actually do the work — it only coordinates. Picture a conductor leading an orchestra: they are not playing the violin or the cello; they are making sure every musician comes in at exactly the right moment with exactly the right note. That is the orchestrator, and the musicians are the workers.`}</p>
              <h3>{`2.2 The Hierarchical Multi-Agent Pattern`}</h3>
              <p>{`Think of the hierarchical pattern as orchestrator–worker but with multiple layers, like a real company org chart. You might have a top-level orchestrator at the C-suite, then several mid-level orchestrators acting like department heads, each managing its own team of workers. This is what you see in very large enterprise workflows.`}</p>
              <p>{`For example, imagine building an AI system to run an entire e-commerce business. You would have an orchestrator for inventory, one for customer service, one for logistics — and all of them roll up to a master orchestrator coordinating across the whole thing. The bigger the company, the bigger the org chart, the bigger the workflows, and the bigger the pattern gets.`}</p>
              <h3>{`2.3 The Peer-to-Peer Pattern (Network of Agents)`}</h3>
              <p>{`In the peer-to-peer pattern, sometimes called a network of agents, there is no central boss. Agents talk directly to each other and collectively figure out the output. It is like a group of expert consultants in a room hashing out a strategy together: no one is officially in charge, and the answer emerges from the conversation they are having.`}</p>
              <p>{`This pattern is less common in production because it is harder to debug and control the behavior. But it is incredibly powerful in scenarios where distributed decision-making is the actual point — multi-agent simulations, market modeling, competitive game environments, and agentic research. Those are the places where you `}<em>{`want`}</em>{` different perspectives clashing with each other, and where the best answer is the one the group converges on rather than the one a single planner dictates.`}</p>
              <h3>{`2.4 The Pipeline (Sequential) Pattern`}</h3>
              <p>{`The pipeline, or sequential, pattern is the most straightforward of the four. Agents work in a chain: the output of one agent becomes the input of the next one, and so on. It is literally an assembly line.`}</p>
              <p>{`Its big advantage is predictability. You always know exactly what each agent does and in what order it does it, which makes the system easy to reason about, test, and operate. The classic use cases are document processing, content workflows, and data transformation — anywhere the steps do not really change much from one run to the next.`}</p>
              <h3>{`2.5 The Part Most People Skip: Combine the Patterns`}</h3>
              <p>{`Here is the part most people skip when they are learning about this: you do not have to pick just one pattern. The most powerful production systems combine them. You might have an orchestrator–worker setup at the top level, with some of the worker agents internally running pipelines. That is totally valid — and often it is the right call. Pattern choice is a design tool, not a religion; real systems mix them freely.`}</p>
              <MermaidDiagram code={"flowchart TD\nsubgraph p1[\"Pattern 1: Orchestrator-Worker\"]\nO1[\"Orchestrator plans and delegates\"]\nW1[\"Worker\"]\nW2[\"Worker\"]\nW3[\"Worker\"]\nO1 --> W1\nO1 --> W2\nO1 --> W3\nend\nsubgraph p2[\"Pattern 2: Hierarchical\"]\nO2[\"Master orchestrator\"]\nD1[\"Mid-level orchestrator\"]\nD2[\"Mid-level orchestrator\"]\nT1[\"Worker team\"]\nT2[\"Worker team\"]\nO2 --> D1\nO2 --> D2\nD1 --> T1\nD2 --> T2\nend\nsubgraph p3[\"Pattern 3: Peer-to-Peer\"]\nA1[\"Agent\"]\nB1[\"Agent\"]\nC1[\"Agent\"]\nA1 <--> B1\nB1 <--> C1\nC1 <--> A1\nend\nsubgraph p4[\"Pattern 4: Pipeline\"]\nS1[\"Step: extract\"]\nS2[\"Step: transform\"]\nS3[\"Step: load\"]\nS1 --> S2 --> S3\nend\nMix[\"Real systems combine patterns, e.g. orchestrator-worker with pipelines inside the workers\"]"} caption={`2. The Four Design Patterns at a Glance — Illustrates Section 2 (The Four Design Patterns) — the four production topologies, with the reminder that real systems combine them.`} />
            </section>

            <section className={styles.section} id="where-multi-agent-systems-are-used-in-production">
              <div className={styles.kicker}>Deep dive 03</div>
              <h2>{`Where Multi-Agent Systems Are Used in Production`}</h2>
              <p>{`All of these patterns are fun to learn, but the use cases are where the money is being made right now. There are five spaces where teams are quietly automating work that used to take an entire department. All five are horizontal use cases: they apply across industries, whether healthcare, finance, retail, or logistics.`}</p>
              <h3>{`3.1 Autonomous Research and Analysis`}</h3>
              <p>{`You give the system a question and it spins up a bunch of agents to search the web, pull from internal documents, synthesize the findings, identify the gaps, and produce a structured report. Law firms do case research this way, investment banks do market research, and pharma companies do literature reviews — all with multi-agent AI systems. The result is a step-change in speed: what used to take a human analyst three full days can now happen in three minutes.`}</p>
              <h3>{`3.2 Customer Support Automation`}</h3>
              <p>{`Customer support automation with agents is way beyond a single chatbot. Here is how it might work in practice: one agent triages the incoming query; another pulls the customer's account and full purchase history; a third checks the internal knowledge base; and a fourth drafts a resolution and routes it to a human review only when it is complex enough to need one. For a sense of the scale this reaches in production, customer case studies are worth reading — for example, Klarna publicly reported that its AI assistant is doing the work equivalent of 700 full-time agents.`}</p>
              <h3>{`3.3 Software Development and QA`}</h3>
              <p>{`This space is absolutely exploding. You have agents writing code, other agents running it in a sandbox, agents writing and executing tests, and agents reviewing the output for quality. Tools like Claude Code, Devin, and Cursor agents are all built on exactly this architecture. The cool part is that these systems do not just write code once — they iterate over it, catch their own bugs, and self-correct.`}</p>
              <h3>{`3.4 Data Pipeline Automation`}</h3>
              <p>{`Instead of manually building and maintaining ETL pipelines, imagine agents that understand a business question, write the data queries, pull from the right resources, transform the data, validate it for accuracy, and produce a dashboard-ready output. This is especially powerful in industries like retail and supply chain, where the data lives in 15 different systems that do not talk to each other — exactly the messy, multi-source reality where an agent team shines.`}</p>
              <h3>{`3.5 Content Production at Scale`}</h3>
              <p>{`In content production, one agent researches the topic, another drafts the content, a third checks for accuracy and brand voice, and a fourth formats the result for different distribution channels. Marketing teams use this to take one piece of long-form content and turn it into dozens of distribution-ready assets in minutes. Think about it: a single blog post can become a LinkedIn carousel, a Twitter thread, a newsletter section, and a podcast script — all from one source.`}</p>
              <p>{`Look closely and the pattern beneath all five use cases is the same. The task that used to require multiple humans working in a sequence is now handled by multiple agents working in parallel — with humans staying in the loop for review and oversight wherever it matters.`}</p>
              <MermaidDiagram code={"sequenceDiagram\nparticipant U as User\nparticipant O as Orchestrator\nparticipant S as Web Search Agent\nparticipant D as Internal Docs Agent\nparticipant A as Synthesis Agent\nU->>O: Submit the research question\nO->>O: Decompose into subtasks and gaps\npar Run research in parallel\nO->>S: Search the web and rank sources\nO->>D: Pull internal documents and data\nend\nS-->>O: Ranked external findings\nD-->>O: Internal context\nO->>A: Hand over all material\nloop Fill remaining gaps\nA-->>O: Ask for missing pieces\nO->>S: Run targeted searches\nS-->>O: New sources\nend\nA-->>O: Structured report draft\nO->>U: Final report with sources and gaps"} caption={`3. Autonomous Research: A Question Becomes a Report — Illustrates Section 3.1 (Autonomous Research and Analysis) — parallel specialists turn a question into a structured report in minutes.`} />
              <MermaidDiagram code={"flowchart TD\nQ[\"Incoming customer query\"]\nT[\"Triage agent: classify the issue\"]\nAcc[\"Account agent: pull history\"]\nKB[\"Knowledge base agent: find known fixes\"]\nDraft[\"Resolution agent: draft the answer\"]\nCheck{\"Complex or high stakes?\"}\nAuto[\"Answer sent automatically\"]\nHuman[\"Routed to human review\"]\nDone[\"Query resolved\"]\nQ --> T\nT --> Acc\nT --> KB\nAcc --> Draft\nKB --> Draft\nDraft --> Check\nCheck -->|\"No\"| Auto\nCheck -->|\"Yes\"| Human\nAuto --> Done\nHuman --> Done"} caption={`4. Customer Support: Triage to Human Review — Illustrates Section 3.2 (Customer Support Automation) — triage through resolution, escalating to a human only when the case is complex enough.`} />
              <MermaidDiagram code={"flowchart TD\nPlan[\"Task from the orchestrator\"]\nCode[\"Coding agent: write the code\"]\nRun[\"Sandbox agent: run it safely\"]\nTest[\"Testing agent: write and run tests\"]\nReview{\"Review agent: any bugs?\"}\nFix[\"Fix agent: patch and re-enter loop\"]\nDeliver[\"Delivered code\"]\nPlan --> Code\nCode --> Run\nRun --> Test\nTest --> Review\nReview -->|\"Issues found\"| Fix\nFix --> Code\nReview -->|\"Clean\"| Deliver"} caption={`5. Software Development and QA: The Self-Correcting Loop — Illustrates Section 3.3 (Software Development and QA) — agents that write, run, test and review code in a self-correcting loop.`} />
            </section>

            <section className={styles.section} id="five-mistakes-to-avoid-when-building-multi-agent-systems">
              <div className={styles.kicker}>Deep dive 04</div>
              <h2>{`Five Mistakes to Avoid When Building Multi-Agent Systems`}</h2>
              <p>{`If this all sounds amazing and you want to build one of these systems, great — but there are five things teams consistently underestimate when they start. The mistakes are very predictable and very avoidable, and knowing them up front can save you from weeks of rework.`}</p>
              <h3>{`4.1 Jumping Into Code Before Decomposing the Task`}</h3>
              <p>{`This has been a major time killer. Teams open up Cursor and just start writing agent code before they have mapped out what each agent is responsible for and where the handoff happens. The rule is simple: design first, then build. Spend time on paper before opening the editor. What does agent A produce for agent B? What happens when agent B fails? These are the questions to start with. Design the entire system, and only then jump into building it.`}</p>
              <h3>{`4.2 Ignoring Memory Architecture`}</h3>
              <p>{`In a single-agent system, memory is quite simple. In a multi-agent system you have to actively design what is private to one agent, what is shared across all agents, and how state passes between them. Production systems use a combination of short-term in-context memory, long-term vector storage with tools like Pinecone, and shared external state sources like Redis and Postgres. Design this on day one — not on day 30, when everything is on fire and retrofitting state management into a working system is painful.`}</p>
              <h3>{`4.3 Building Only for Happy Paths`}</h3>
              <p>{`Multi-agent systems fail in really interesting ways. One agent quietly produces a bad output that cascades through every single thing downstream. An API times out mid-pipeline. A model returns a malformed JSON response. You need retry logic, you need fallback behaviors, and you need human-in-the-loop checkpoints for high-stakes decisions. Build for failure from day one — always.`}</p>
              <h3>{`4.4 Skipping Observability`}</h3>
              <p>{`If you cannot trace what each agent did, what it was given, and what it produced, you cannot debug the system when something breaks — and things `}<em>{`will`}</em>{` break. The tooling is catching up: platforms like LangSmith are building serious tracing and evaluation tooling specific to agentic systems, and you should use any of them. Your future self, debugging a production issue at 2 AM, will thank you.`}</p>
              <h3>{`4.5 Starting Too Complex`}</h3>
              <p>{`This is the mistake seen most often. Teams design elaborate eight-agent systems for problems that two agents could solve perfectly well. More agents mean more coordination overhead, more failure points, and more ways things can go wrong. Instead, start with one orchestrator and one or two worker agents, and see them working end to end. Add complexity only when you genuinely hit a ceiling — not because an elaborate architecture sounds cool on a whiteboard.`}</p>
              <MermaidDiagram code={"flowchart TD\nStart([\"New multi-agent build\"])\nG1[\"1. Decompose roles and handoffs on paper\"]\nG2[\"2. Design memory and shared state on day one\"]\nG3[\"3. Add retries, fallbacks and checkpoints\"]\nG4[\"4. Trace and evaluate every agent step\"]\nG5[\"5. Start with one orchestrator and two workers\"]\nShip([\"Working end to end\"])\nScale[\"Grow the team only at a real ceiling\"]\nM1[\"Mistake: jump straight into code\"]\nM2[\"Mistake: ignore memory architecture\"]\nM3[\"Mistake: happy paths only\"]\nM4[\"Mistake: skip observability\"]\nM5[\"Mistake: eight agents on day one\"]\nStart --> G1\nG1 --> G2\nG2 --> G3\nG3 --> G4\nG4 --> G5\nG5 --> Ship\nShip --> Scale\nG1 -.->|\"instead of\"| M1\nG2 -.->|\"instead of\"| M2\nG3 -.->|\"instead of\"| M3\nG4 -.->|\"instead of\"| M4\nG5 -.->|\"instead of\"| M5"} caption={`6. Five Mistakes, Five Guardrails: The Build Path — Illustrates Section 4 (Five Mistakes to Avoid When Building Multi-Agent Systems) — each common mistake paired with the guardrail that prevents it, ending at Section 5's rule: start small and ship.`} />
            </section>

            <section className={styles.section} id="the-one-rule-to-remember">
              <div className={styles.kicker}>Deep dive 05</div>
              <h2>{`The One Rule to Remember`}</h2>
              <p>{`If you walk away from this guide remembering one thing, let it be this:`}</p>
              <div className={styles.quote}>{`The simplest multi-agent system that solves the problem will always beat the most elegant one that does not ship.`}</div>
              <p>{`So when you are building, always think about scalability and reliability on day one. Start small, make the end-to-end flow actually work, and grow the team of agents only when the problem genuinely demands it.`}</p>
              <MermaidDiagram code={"flowchart TD\nStart([\"New multi-agent build\"])\nG1[\"1. Decompose roles and handoffs on paper\"]\nG2[\"2. Design memory and shared state on day one\"]\nG3[\"3. Add retries, fallbacks and checkpoints\"]\nG4[\"4. Trace and evaluate every agent step\"]\nG5[\"5. Start with one orchestrator and two workers\"]\nShip([\"Working end to end\"])\nScale[\"Grow the team only at a real ceiling\"]\nM1[\"Mistake: jump straight into code\"]\nM2[\"Mistake: ignore memory architecture\"]\nM3[\"Mistake: happy paths only\"]\nM4[\"Mistake: skip observability\"]\nM5[\"Mistake: eight agents on day one\"]\nStart --> G1\nG1 --> G2\nG2 --> G3\nG3 --> G4\nG4 --> G5\nG5 --> Ship\nShip --> Scale\nG1 -.->|\"instead of\"| M1\nG2 -.->|\"instead of\"| M2\nG3 -.->|\"instead of\"| M3\nG4 -.->|\"instead of\"| M4\nG5 -.->|\"instead of\"| M5"} caption={`6. Five Mistakes, Five Guardrails: The Build Path — Illustrates Section 4 (Five Mistakes to Avoid When Building Multi-Agent Systems) — each common mistake paired with the guardrail that prevents it, ending at Section 5's rule: start small and ship.`} />
            </section>

            <section className={styles.section} id="key-takeaways">
              <div className={styles.kicker}>Summary</div>
              <h2>Key Takeaways</h2>
              <div className={styles.checklist}>
              <div className={styles.check}>{`A single AI agent is an LLM given tools, memory, and the ability to act — but it is still one brain with one limited context window, so complex multi-stage work (research, analysis, writing, validation, formatting) overloads it with context bloat and compounding errors.`}</div>
              <div className={styles.check}>{`A multi-agent system replaces the single generalist with a team of specialized agents coordinated by an orchestrator — the project manager that breaks down the goal, assigns tasks, and stitches the final output together.`}</div>
              <div className={styles.check}>{`Think freelancer versus agency: for any complex, long-horizon task, the agency setup wins, because each specialist gets genuinely good at one job.`}</div>
              <div className={styles.check}>{`The three benefits to design for are parallelization, specialization, and scalability — adding agents as complexity grows without rebuilding from scratch.`}</div>
              <div className={styles.check}>{`Four design patterns dominate production: orchestrator–worker (most common), hierarchical multi-agent (org-chart layers of orchestrators), peer-to-peer networks (no central boss, emergent answers — best for simulations, market modeling, games, and agentic research), and pipeline/sequential (an assembly line prized for predictability). Real systems combine them.`}</div>
              <div className={styles.check}>{`The five horizontal use cases are autonomous research and analysis, customer support automation, software development and QA, data pipeline automation, and content production at scale — each replacing a sequence of humans with a team of parallel agents, with humans kept in the loop for review.`}</div>
              <div className={styles.check}>{`Avoid the five predictable mistakes: coding before decomposing the task, ignoring memory architecture, building only for happy paths, skipping observability, and starting too complex.`}</div>
              <div className={styles.check}>{`The simplest system that solves the problem beats the most elegant one that does not ship — design for scalability and reliability on day one.`}</div>
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
            <MermaidDiagram code={"flowchart TD\nU[\"User request arrives\"] --> I{\"What does this step need?\"}\nI -- \"Intent classification\" --> C[\"Small, fast model\"]\nI -- \"Fields into a schema\" --> S[\"Structured output: JSON schema or Pydantic\"]\nI -- \"Ambiguity or deep reasoning\" --> R[\"Frontier reasoning model\"]\nC --> O[\"Validated structured output\"]\nS --> O\nR --> O\nO --> F{\"Output invalid or model failed?\"}\nF -- \"Yes\" --> RT[\"Retry or take a fallback path\"]\nF -- \"No\" --> N[\"Continue to the next step\"]"} caption={`3. Model Routing: Matching Model Strength to Each Step — Illustrates the model-layer strategy from Section 3, The Model Layer — send each step to a cheap model or a strong one based on complexity, and demand structured outputs everywhere.`} />
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
            <MermaidDiagram code={"flowchart TD\nA[\"Data from the agent run\"] --> D{\"What will this data be used for?\"}\nD -- \"Conversation and workflow state\" --> L[\"Low-latency store: Redis, DynamoDB, Postgres, MongoDB\"]\nD -- \"Application state\" --> AP[\"Your application database\"]\nD -- \"Knowledge retrieval\" --> V[\"Vector or search store: Pinecone, pgvector, Weaviate, Elasticsearch\"]\nD -- \"Long-term archives\" --> OB[\"Cheap object storage: S3\"]\nL --> P[\"Pass only the smallest useful context to the model\"]\nAP --> P\nV --> P\nOB --> P"} caption={`4. Memory and State: Data Architecture First — Illustrates Section 5, Memory and State — keep workflow state separate from memory, and choose each store by access pattern.`} />
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
            <MermaidDiagram code={"sequenceDiagram\nparticipant U as User\nparticipant O as Orchestrator\nparticipant M as Model\nparticipant T as Tools and APIs\nparticipant E as Eval pipeline\n\nU->>O: message with a request\nO->>M: classify the intent and check scope\nM-->>O: intent and scope result\nO->>M: retrieve the smallest useful context\nO->>T: validate inputs and call the tool\nT-->>O: structured result or structured error\nalt result needs user confirmation\nO-->>U: propose the action for approval\nU-->>O: confirm or decline\nend\nO->>T: execute the high-risk action\nT-->>O: structured result\nO->>U: final response\nO->>E: send the trace for evaluation"} caption={`5. The Orchestrated Lifecycle of One Request — Illustrates the explicit control flow from Section 6, Orchestration — one user request moving through intent, context, tools, confirmation, response, and asynchronous evaluation.`} />
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
            <MermaidDiagram code={"stateDiagram-v2\n[*] --> Proposed: model suggests a high-impact action\nProposed --> Validated: deterministic code checks ownership and policy\nValidated --> Awaiting: user confirmation is required\nAwaiting --> Approved: user approves the exact action\nApproved --> Executed: the tool executes the action\nValidated --> Rejected: a check fails\nAwaiting --> Rejected: user declines\nExecuted --> [*]\nRejected --> [*]"} caption={`6. The Approval Gate: Suggest, Validate, Approve, Execute — Illustrates the human-in-the-loop pattern from Section 8, Approval Gates and Policy Control — the model suggests, code validates, the user approves, and only then does the tool execute.`} />
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
            Source: “Agent AI System Design Explained in 27 Minutes” and “Multi-Agent AI Systems Explained” by Aishwarya Srinivasan, rendered by the Knowledge Base YouTube → article pipeline. Diagrams are rendered client-side from the same mermaid sources the pipeline ships.
          </footer>
        </article>
      </div>
    </main>
  );
}
