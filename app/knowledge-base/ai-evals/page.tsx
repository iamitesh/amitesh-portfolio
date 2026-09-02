import type { Metadata } from "next";
import styles from "../knowledge-base.module.css";
import MermaidDiagram from "../mermaid";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "AI Evals Explained | How to evaluate AI Agents? | Knowledge Base",
  description: "This article turns Aishwarya Srinivasan's beginner-friendly explainer into a practical guide to AI evals: what they are, how they differ from benchmar",
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
            <h1>{`AI Evals Explained | How to evaluate AI Agents?`}</h1>
            <p>{`This article turns Aishwarya Srinivasan's beginner-friendly explainer into a practical guide to AI evals: what they are, how they differ from benchmarks and classic machine learning evaluation, which metrics to track for which task, and the evaluation loop that separates teams shipping production AI agents from teams shipping demos. It is written for anyone building AI agents — coding agents, customer-support agents, or RAG pipelines — who has ever wondered whether what they built actually works.`}</p>
            <div className={styles.tags}>
              {TAGS.map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}
            </div>
            <nav className={styles.toc} aria-label="Article sections">
                  <a href={`#architecture-diagrams`} key="architecture-diagrams">{`Architecture Diagrams`}</a>
                  <a href={`#what-is-an-ai-eval`} key="what-is-an-ai-eval">{`What Is an AI Eval?`}</a>
                  <a href={`#evals-vs-benchmarks-vs-classic-machine-learning-evaluation`} key="evals-vs-benchmarks-vs-classic-machine-learning-evaluation">{`Evals vs. Benchmarks vs. Classic Machine Learning Evaluation`}</a>
                  <a href={`#the-metrics-that-matter`} key="the-metrics-that-matter">{`The Metrics That Matter`}</a>
                  <a href={`#start-with-a-golden-dataset-not-a-metric-list`} key="start-with-a-golden-dataset-not-a-metric-list">{`Start With a Golden Dataset, Not a Metric List`}</a>
                  <a href={`#four-ways-to-grade-agent-outputs`} key="four-ways-to-grade-agent-outputs">{`Four Ways to Grade Agent Outputs`}</a>
                  <a href={`#evals-are-a-loop-not-a-report-card`} key="evals-are-a-loop-not-a-report-card">{`Evals Are a Loop, Not a Report Card`}</a>
                  <a href={`#tools-for-running-and-monitoring-evals`} key="tools-for-running-and-monitoring-evals">{`Tools for Running and Monitoring Evals`}</a>
                  <a href={`#key-takeaways`} key="key-takeaways">{`Key Takeaways`}</a>
            </nav>
          </header>

            <section className={styles.section} id="architecture-diagrams">
              <div className={styles.kicker}>Overview</div>
              <h2>Architecture Diagrams</h2>
              <MermaidDiagram code={"flowchart TD\nCore[\"Top-level metrics: relevance, faithfulness, correctness, coherence\"]\nCore --> Ask{\"What is your task?\"}\nAsk -->|\"Summarization\"| S1[\"Faithfulness: stay true to the source, invent nothing\"]\nS1 --> S2[\"Coverage: capture the main points\"]\nS2 --> S3[\"Conciseness: keep it tight\"]\nAsk -->|\"Classification\"| K1[\"Output is a clean label, like old-school ML\"]\nK1 --> K2[\"Accuracy, precision, recall, F1\"]\nAsk -->|\"Translation\"| T1[\"Meaning carries over and the text reads naturally\"]\nT1 --> T2[\"BLEU, COMET\"]\nAsk -->|\"RAG\"| R1[\"Answer relevance plus faithfulness\"]\nR1 --> R2[\"Together they catch bad retrieval and bad generation\"]"} caption={`3. Choosing Metrics by Task: From the Core Four to Task-Specific — This diagram illustrates Sections 3.1 and 3.2, "The Metrics That Matter" — start from the four core metrics, then pick task-specific ones for summarization, classification, translation, and RAG.`} />
              <MermaidDiagram code={"flowchart TD\nsubgraph DS[\"Build the golden dataset first\"]\ndirection TB\nG1[\"A handful of example inputs for your task\"]\nG2[\"Each paired with a great output and a bad output\"]\nG3[\"Cover common cases, edge cases, and past failures\"]\nend\nG3 --> Size[\"Start small: about 52 examples is plenty\"]\nSize --> Back[\"Work backwards from the examples\"]\nBack --> Met[\"Judgments of good and bad, quantified, become your metrics\"]\nMet --> How{\"How do you actually grade?\"}\nHow -->|\"Humans\"| H1[\"A domain expert scores outputs against the rubric\"]\nH1 --> H2[\"Gold standard: slow and expensive, for small careful samples\"]\nHow -->|\"User feedback\"| U1[\"Thumbs, edits, task completion, repeat visits\"]\nU1 --> U2[\"Real ground truth, but noisy and only after you ship\"]\nHow -->|\"Programmatic\"| P1[\"Code checks: valid JSON, right tool and arguments, time, cost\"]\nP1 --> P2[\"Cheap and instant, run on every change, need checkable answers\"]\nHow -->|\"LLM as a judge\"| L1[\"A strong model grades outputs against the rubric\"]\nL1 --> L2[\"Scales essay grading to thousands of outputs\"]\nL2 -.->|\"validate the judge against a human on a sample first\"| H1"} caption={`5. Golden Dataset First, Then Four Ways to Grade Outputs — This diagram illustrates Sections 4 and 5, "Start With a Golden Dataset" and "Four Ways to Grade Agent Outputs" — build the dataset first, let the metrics fall out of it, then choose among human, user-feedback, programmatic, and LLM-judge grading.`} />
              <MermaidDiagram code={"flowchart TD\nsubgraph Loop[\"The loop: continuous, like CI/CD for software\"]\ndirection TB\nS1[\"1. Decide what good even means\"] --> S2[\"2. Build the golden dataset\"]\nS2 --> S3[\"3. Pick metrics by working backwards from the dataset\"]\nS3 --> S4[\"4. Run a baseline across the whole dataset\"]\nS4 --> S5[\"5. Group the failures: retrieval, formatting, edge cases\"]\nS5 --> S6[\"6. Fix: prompts, retrieval, tool definitions\"]\nS6 --> S7[\"7. Rerun against the exact same dataset\"]\nS7 --> D{\"Numbers up, nothing regressed?\"}\nD -->|\"No, something broke\"| S5\nend\nD -->|\"Yes\"| S8[\"8. Keep going: ship and watch live traffic\"]\nS8 --> Fail[\"Real-world failures flow back into the golden dataset\"]\nFail -.-> S2\nProv[\"Providers can quietly swap models, shifting behavior overnight\"] -.-> S8\nRun[\"Running evals: Promptfoo, RAGAS\"] -.-> S4\nTrace[\"Tracing and monitoring: LangSmith, Langfuse, Arize, Braintrust\"] -.-> S8"} caption={`6. The Evaluation Loop: CI/CD for AI Agents — This diagram illustrates Sections 6 and 7, "Evals Are a Loop" and "Tools for Running and Monitoring Evals" — the eight-step loop that teams run forever, plus the tooling that runs and monitors evals.`} />
            </section>

            <section className={styles.section} id="what-is-an-ai-eval">
              <div className={styles.kicker}>Part 01</div>
              <h2>{`What Is an AI Eval?`}</h2>
              <p>{`Nobody really tells you this when you start building AI agents: the hardest part is not building the agent. Building the agent is the fun part. The hard part is knowing whether the thing you just built is actually any good. You wire up an agent, hand it some tools, run it once, and it does something that looks almost magical — so you say "yes, it works." But does it? Working the one time you tried it is not the same as working in production, and that gap — the little voice in the back of your head asking "but does it actually work?" — has a name. It is called evaluation. Evals, for short.`}</p>
              <div className={styles.quote}>{`An AI eval is just a structured way of measuring how good your AI outputs really are.`}</div>
              <p>{`That is the whole definition, and it is simpler than it sounds. Instead of eyeballing a couple of answers and deciding "yeah, that looks fine to me," you set up a small, repeatable process that hands you an actual score. That score answers the only question that matters here: is my AI agent getting better, or did I just do something to break it? Every time you change a prompt, swap a model, or tweak your retrieval, an eval tells you whether you helped the agent or silently broke something.`}</p>
              <p>{`This matters more for agents than for any other AI artifact, because an agent is not one answer — it is a whole chain of decisions. It picks a tool, calls it, reads the result, decides what to do next, and on and on, with many places along the way where things can quietly go sideways. When your agent breaks in production, you need to know where, and you need to know why — and you are not going to figure that out by reading transcripts one at a time at two in the morning. Research this year shows roughly a one-third gap between how models score in the lab and how they perform in real, deployed work. Evals are how you close that gap before your users feel it.`}</p>
              <p>{`The teams that actually get agents into production — real coding agents, real customer-support agents — all have one thing in common: they are not guessing, and they are not doing "vibe evals." They are measuring.`}</p>
              <MermaidDiagram code={"flowchart TD\nsubgraph Chain[\"The agent: a chain of decisions\"]\ndirection TB\nC1[\"Pick a tool\"] --> C2[\"Call the tool\"]\nC2 --> C3[\"Read the result\"]\nC3 --> C4[\"Decide what to do next\"]\nC4 --> C1\nend\nC4 --> Out[\"Outputs and action traces\"]\nOut --> Ev[\"Eval: a structured, repeatable scoring process\"]\nEv --> Sc[\"Hands you an actual score on your own data\"]\nSc --> Q{\"Is the agent getting better, or did I break it?\"}\nQ -->|\"Better\"| Ship[\"Ship it and keep measuring\"]\nQ -->|\"Broke it\"| Fix[\"Find where it went sideways, fix it, rerun\"]\nCh[\"Every change: a new prompt, a model, or a retrieval tweak\"] -.-> C1\nGap[\"Why it matters: lab scores run about one-third ahead of real deployed work\"] -.-> Ev"} caption={`1. What an AI Eval Measures: From Agent Decisions to a Score — This diagram illustrates Section 1, "What Is an AI Eval?" — an agent is a chain of decisions, and an eval is the repeatable, structured score that tells you whether each change helped or broke something.`} />
            </section>

            <section className={styles.section} id="evals-vs-benchmarks-vs-classic-machine-learning-evaluation">
              <div className={styles.kicker}>Part 02</div>
              <h2>{`Evals vs. Benchmarks vs. Classic Machine Learning Evaluation`}</h2>
              <h3>{`2.1 Benchmarks test the model; evals test your system`}</h3>
              <p>{`If you have seen the leaderboards, a fair question is: "isn't this just benchmarks?" There are boards like SWE-bench for coding, Tau-bench for customer-service agents, Terminal-Bench for command-line work, and composite indexes that mash a bunch of these together into a single score.`}</p>
              <p>{`The distinction really matters. Benchmarks do test the model — but they are a generic test, the same test applied to every single model. AI evals test your specific agentic system: your task, your data, your prompts, your users. A model can sit at the top of every leaderboard and still completely fall apart on your use case, because that benchmark never saw your data. So benchmarks are great for picking which models to start with, while evals are how you find out whether that thing actually works for you.`}</p>
              <h3>{`2.2 From a multiple-choice test to an essay`}</h3>
              <p>{`If you have done machine learning before, you may be thinking: "we have been evaluating models for decades — what is the big deal?" Evaluation is genuinely not new; it has been done for machine learning and even statistical models for years. What is worth understanding is why it used to be easier.`}</p>
              <p>{`In traditional machine learning, the output was usually really clean: a category, like spam or not spam; a number, like a predicted house price; a simple yes or no. Because the output was clean, grading was clean. You had a test set with the right answers, you compared the model's predictions against those answers, and you could easily compute metrics like accuracy, precision, recall, and F1 score. It was very objective — everybody agreed on what "correct" meant, and you could slap a hard number on it. Think of it like a multiple-choice test: the answer is A, B, C, or D, there is an answer key, and you just count up how many times the model got it right.`}</p>
              <p>{`Large language models and AI agents changed that. The output is no longer a tidy category; it is open-ended text, or a whole sequence of actions the agent took. And most of the time there is no single correct answer. Ask for a summary of an article and there could be a hundred good summaries and a hundred bad ones — and two great summaries can look completely different from each other. You cannot check that against an answer key, because there is no answer key.`}</p>
              <p>{`That is the shift: we went from grading a multiple-choice test to grading an essay. Grading an essay is just harder. There is no single right answer; you need a rubric, and somebody has to actually use their judgment. That is exactly why AI evals are messier and more qualitative than the ML evals you might be used to. The good news: once the rubric mindset clicks, everything else gets simpler.`}</p>
              <MermaidDiagram code={"flowchart TD\nQ[\"Question: is this just benchmarks, or the ML evaluation we already know?\"]\nsubgraph Bench[\"Benchmarks: a generic test of the model\"]\ndirection TB\nB1[\"The same test applied to every model\"]\nB2[\"SWE-bench, Tau-bench, Terminal-Bench, composite indexes\"]\nB3[\"Great for choosing which model to start with\"]\nend\nsubgraph Classic[\"Classic ML evaluation: a multiple-choice test\"]\ndirection TB\nC1[\"Output is clean: a category, a number, yes or no\"]\nC2[\"An answer key exists, so grading is objective\"]\nC3[\"Metrics: accuracy, precision, recall, F1\"]\nend\nsubgraph Ai[\"AI evals: an essay, not a multiple-choice test\"]\ndirection TB\nE1[\"Output is open-ended text or whole action sequences\"]\nE2[\"No single right answer and no answer key\"]\nE3[\"You need a rubric and someone to use judgment\"]\nE4[\"Evals test your system: your task, your data, your prompts, your users\"]\nend\nQ --> B1\nQ --> C1\nQ --> E1\nB3 -.->|\"then verify on your task\"| E4\nC2 -.->|\"LLMs changed grading\"| E2\nB1 -.-> Top\nC3 -.-> Top\nE4 --> Top\nTop[\"A model can top every leaderboard and still fall apart on your use case\"]"} caption={`2. Benchmarks, Classic ML Evals, and AI Evals: What Each One Tests — This diagram illustrates Section 2, "Evals vs. Benchmarks vs. Classic Machine Learning Evaluation" — benchmarks and classic ML evals grade clean, generic answers, while AI evals grade your specific system's open-ended essays.`} />
            </section>

            <section className={styles.section} id="the-metrics-that-matter">
              <div className={styles.kicker}>Part 03</div>
              <h2>{`The Metrics That Matter`}</h2>
              <h3>{`3.1 The core four`}</h3>
              <p>{`Metrics are one of the places where people get confused, because there are dozens of them and it all feels like alphabet soup. In practice, only a handful of core metrics are worth reaching for again and again:`}</p>
              <div className={styles.panel}>
                <ul>
                  <li><strong>{`Relevance`}</strong>{` — did the output actually answer what was asked?`}</li>
                  <li><strong>{`Faithfulness`}</strong>{`, sometimes called `}<strong>{`groundedness`}</strong>{` — is this actually true and backed by real data, or is the model making it up? This one is your hallucination check.`}</li>
                  <li><strong>{`Correctness`}</strong>{` — did it match the expected answer, when there is one?`}</li>
                  <li><strong>{`Coherence`}</strong>{` — does it actually read well?`}</li>
                </ul>
              </div>
              <p>{`Those four are the top-level metrics. But the right metric for any given evaluation depends entirely on your task.`}</p>
              <h3>{`3.2 Matching metrics to your task`}</h3>
              <p><strong>{`Summarization.`}</strong>{` You care about faithfulness — did it stay true to the source without inventing stuff? You care about coverage — did it actually capture the main points? And you care about conciseness — did it keep it tight?`}</p>
              <p><strong>{`Classification.`}</strong>{` This one looks like old-school machine learning again, because the output is a clean label. You are right back to accuracy, precision, recall, and F1 score.`}</p>
              <p><strong>{`Translation.`}</strong>{` You care about whether the meaning carried over, and whether it really reads naturally in the other language. Metrics like BLEU and COMET show up here.`}</p>
              <p><strong>{`Retrieval-augmented generation (RAG).`}</strong>{` You measure things like faithfulness and answer relevance, because together they catch the two totally different ways a RAG system breaks: bad retrieval or bad generation.`}</p>
              <h3>{`3.3 A quick pause: building a demo generator`}</h3>
              <p>{`Mid-video, Srinivasan shares a practical aside: something she built that changed how she works. Between running her company Gen Academy and making content, she is constantly building demos — every single week, on different topics, with different frameworks and SDKs. And it is not just code: every demo requires a README, a slide deck, a script, and a social post. Doing all of that weekly is genuinely a lot, so she built herself a demo generator.`}</p>
              <p>{`She set it up once, and now every demo is a single slash command in her terminal: she types the topic, names the toolkits she wants to use, and out comes a full demo package. It is built using Mistral Vibe, Mistral's terminal-native coding agent powered by their flagship Mistral Medium 3.5 model, which runs in the terminal and IDE, understands a full codebase, and helps write, test, refactor, and deploy using natural language. The feature that made the build possible is custom subagents: specialized agents for targeted tasks, each with a specific scope, tools, and permissions, which a main skill delegates to on demand. Custom skills are defined as markdown files with YAML frontmatter that declares the slash command and the workflow behind it. Her `}<code>{`generate-demo`}</code>{` skill first asks clarifying questions — Vibe has built-in multiple-choice clarifications — and then delegates in order: one subagent does the research, one writes the actual demo code and runs it in her terminal to confirm it works, and one drafts the README and slide outline. Each subagent has its own config file and system prompt, and the writer reads from a "voice file" where she has written out her tone rules, so the output actually sounds like her rather than generic AI copy. What used to take a full afternoon now takes a few minutes. It is a nice worked example of composing specialized agents into one repeatable workflow.`}</p>
              <h3>{`3.4 Three families of metrics`}</h3>
              <p>{`Zooming out, all of these metrics really fall into three buckets, and it helps to know them by name.`}</p>
              <p><strong>{`Classic overlap metrics.`}</strong>{` These are the old, reliable ones from the natural language processing world: BLEU for translation, ROUGE for summarization, METEOR, and similar. All they really do is check how much of your output text overlaps with the reference answer. They are fast, they are cheap, and they are dead simple — but they are basically blind to meaning. Two sentences that say the exact same thing in different words can be scored differently.`}</p>
              <p><strong>{`Semantic metrics.`}</strong>{` Things like BERTScore, BLEURT, and COMET. Instead of just matching words, they actually compare meanings using embeddings, so they handle paraphrasing far better than overlap-based scores.`}</p>
              <p><strong>{`Model-based metrics.`}</strong>{` Here you literally use an LLM to do the grading for you — your LLM as a judge — plus newer named methods like G-Eval. These are the only ones flexible enough to grade open-ended, messy, creative outputs with no reference answers at all, which, let's be real, is what most actual agent tasks look like.`}</p>
              <p>{`You can see the pattern: different tasks call for different metrics — and more and more these days, the thing doing the grading is a model.`}</p>
              <MermaidDiagram code={"flowchart TD\nStart[\"The metric alphabet soup, sorted into three families\"]\nsubgraph Ov[\"Family 1: classic overlap metrics\"]\ndirection TB\nO1[\"BLEU, ROUGE, METEOR and similar\"]\nO2[\"Measure word overlap against a reference answer\"]\nO3[\"Fast and cheap, but blind to meaning\"]\nend\nsubgraph Sem[\"Family 2: semantic metrics\"]\ndirection TB\nM1[\"BERTScore, BLEURT, COMET\"]\nM2[\"Compare meaning with embeddings\"]\nM3[\"Handle paraphrasing far better\"]\nend\nsubgraph Mb[\"Family 3: model-based metrics\"]\ndirection TB\nG1[\"LLM as judge and named methods like G-Eval\"]\nG2[\"A model grades output against your rubric\"]\nG3[\"The only family that scales to open-ended outputs\"]\nend\nStart --> O1\nStart --> M1\nStart --> G1\nO3 -.->|\"words to meaning\"| M2\nM3 -.->|\"meaning to judgment\"| G2\nG3 --> Tail[\"Agent outputs are open-ended and reference-free, so more and more the grader is a model\"]"} caption={`4. The Three Families of Grading Metrics — This diagram illustrates Section 3.4, "Three Families of Metrics" — word-overlap, semantic, and model-based scores form an escalating ladder of grading power.`} />
            </section>

            <section className={styles.section} id="start-with-a-golden-dataset-not-a-metric-list">
              <div className={styles.kicker}>Part 04</div>
              <h2>{`Start With a Golden Dataset, Not a Metric List`}</h2>
              <p>{`Here is the single most important habit in the whole video, the thing to walk away with: do not start by grabbing a metric off a list. Start by building a golden dataset.`}</p>
              <p>{`A golden dataset is honestly not complicated. It is just a handful of example inputs, paired with what a great output looks like and what a bad output could look like. You include your common cases, your annoying edge cases, and every failure you have already watched blow up. Think of it as an answer key that you have been writing for your own specific task. Start small — 52 examples is genuinely plenty to get going, and you will obviously grow it over time.`}</p>
              <p>{`Here is the part that really clicks for people: once that golden dataset is sitting in front of you, you work backwards from it to figure out your metrics. You look at your examples and ask yourself: what would make this output good, and what would make it bad? The quantified ways of judging those answers are your metrics. The dataset comes first, and the metrics fall out of it — not the other way around.`}</p>
            </section>

            <section className={styles.section} id="four-ways-to-grade-agent-outputs">
              <div className={styles.kicker}>Part 05</div>
              <h2>{`Four Ways to Grade Agent Outputs`}</h2>
              <p>{`Once you have a dataset and know what to measure, the next question is how to actually do the grading. There are four ways.`}</p>
              <h3>{`5.1 Human evals`}</h3>
              <p>{`Exactly what it sounds like: a person — ideally somebody who knows the domain — sits down and grades the outputs against your rubric. This is the gold standard; nothing beats it for quality. The catch is that it is slow, it is expensive, and it does not scale — you are not going to have a human grade every single request. So save it for small, careful samples and treat it as a source of truth.`}</p>
              <h3>{`5.2 User feedback from live production`}</h3>
              <p>{`This is a real signal from your real users in a live production environment. Did they give your answer a thumbs up or a thumbs down? Did they accept it or reject it? Did they edit what you gave them? Did they finish the task, or not? Did they come back the next day with the same question again? This is ground truth that actually matters, because it is real people using your product. The downside: it can be noisy, and you only get it after you have actually shipped — so it cannot be your safety net.`}</p>
              <h3>{`5.3 Programmatic evals`}</h3>
              <p>{`Sometimes called code-based evals, these are just simple checks you write in code. Did the output match the expected value? Is the JSON valid? Did the agent call the right tool with the right arguments? How long did it take? How much did it cost? They are cheap and instant, and you can run them automatically on every single change. The catch is that they only work when you have clearly checkable answers — which is exactly why they pair so beautifully with classification tasks.`}</p>
              <h3>{`5.4 LLM as a judge`}</h3>
              <p>{`The fourth approach is the one that completely changed the game. You take a really strong, large model and use it to grade your outputs against your rubric. This is what finally lets essay-style grading scale: an LLM judge can assess the open-ended stuff that plain code never could — is this helpful? Is this grounded in the source? — and it can do that for thousands of outputs.`}</p>
              <p>{`There is one rule, and it is a real one: your judge model has biases. It tends to like longer answers, and it tends to like whatever response it happens to see first. So you should only trust your LLM judge after you have checked its grades against a human grader on a sample. Keep it honest, and it becomes your absolute workhorse.`}</p>
            </section>

            <section className={styles.section} id="evals-are-a-loop-not-a-report-card">
              <div className={styles.kicker}>Part 06</div>
              <h2>{`Evals Are a Loop, Not a Report Card`}</h2>
              <p>{`AI evals are not a one-time report card that you run right before launch and never touch again. They are a loop — something you run over and over again. The easiest way to think about it is automated testing for software: you do not test your code once and then walk away; you run your tests on every change, forever. It is the exact same idea. In software you do CI/CD. In AI agents you do CI/CD plus continuous evaluation and continuous monitoring.`}</p>
              <p>{`The cycle is nice and simple:`}</p>
              <div className={styles.panel}>
                <ol>
                  <li><strong>{`Decide what "good" even means.`}</strong>{` You have to get really specific about this.`}</li>
                  <li><strong>{`Build the golden dataset`}</strong>{` described above.`}</li>
                  <li><strong>{`Pick your metrics`}</strong>{` by working backwards from the dataset.`}</li>
                  <li><strong>{`Run a baseline.`}</strong>{` Run your current system across the whole dataset and get a number. That number is your starting line — without it, "it feels better" is not really data, it is just vibes.`}</li>
                  <li><strong>{`Go look at the failures and group them`}</strong>{` — this is the step everyone rushes past. Are they all coming from retrieval misses? Are they all formatting screw-ups? Are they the same weird edge cases? That grouping tells you exactly what to fix in your agent.`}</li>
                  <li><strong>{`Fix it`}</strong>{` — usually by tweaking your prompts, your retrieval, or your tool definitions.`}</li>
                  <li><strong>{`Rerun against the same exact dataset.`}</strong>{` Did your numbers go up? And just as important: did you accidentally break something that used to work earlier? Catching something you broke without even realizing it is the entire reason the loop exists.`}</li>
                  <li><strong>{`Keep going, because this never stops.`}</strong>{` Once you are in production you are always watching your live traffic. Here is the fun part: your model provider can quietly update the models underneath you, and your agent's behavior can shift overnight without you touching a thing. Real-world failures should flow right back into your golden dataset, and then you run the whole thing again.`}</li>
                </ol>
              </div>
              <div className={styles.quote}>{`You will never know whether your AI agent actually works by watching it succeed one time. You only know by measuring it — on your data, again and again.`}</div>
              <p>{`That skill is what separates people who are just building demo agents from people who are actually shipping them. The teams really winning in this game treat evals like continuous testing: they are always running them and catching problems before users ever see them. The teams whose products keep breaking run evals once at shipping time, and then find out about every single bug from angry users. Do not be that team.`}</p>
            </section>

            <section className={styles.section} id="tools-for-running-and-monitoring-evals">
              <div className={styles.kicker}>Part 07</div>
              <h2>{`Tools for Running and Monitoring Evals`}</h2>
              <p>{`The good news is that you do not have to build any of this from scratch. For running the evals themselves, there are tools like Promptfoo, which lets you test prompts and run evals right from the command line, and a library like RAGAS, which gives you those RAG metrics straight out of the box. For watching what is happening in production — the tracing and monitoring side — you have tools like LangSmith, Langfuse, Arize, and Braintrust. Pick the ones that fit your stack, wire them into the loop, and start measuring.`}</p>
            </section>

            <section className={styles.section} id="key-takeaways">
              <div className={styles.kicker}>Summary</div>
              <h2>Key Takeaways</h2>
              <div className={styles.checklist}>
              <div className={styles.check}>{`An AI eval is a structured, repeatable way of scoring how good your AI outputs really are — it answers the only question that matters: is my agent getting better, or did I break it?`}</div>
              <div className={styles.check}>{`Benchmarks are generic tests of the model; evals test your specific system on your task with your data. A model can top every leaderboard and still fail your use case.`}</div>
              <div className={styles.check}>{`LLMs moved evaluation from grading a multiple-choice test to grading an essay: open-ended outputs have no answer key, so you need a rubric and judgment.`}</div>
              <div className={styles.check}>{`Four core metrics — relevance, faithfulness (groundedness), correctness, coherence — cover most cases, but the right metric depends on your task: coverage and conciseness for summarization, accuracy/precision/recall/F1 for classification, BLEU and COMET for translation, faithfulness and answer relevance for RAG.`}</div>
              <div className={styles.check}>{`Metrics fall into three families: cheap word-overlap scores (BLEU, ROUGE, METEOR), meaning-aware semantic scores (BERTScore, BLEURT, COMET), and model-based grading (LLM-as-a-judge, G-Eval), which alone can grade open-ended outputs at scale.`}</div>
              <div className={styles.check}>{`Start with a golden dataset of good and bad examples for your own task, then work backwards to choose metrics — 52 examples is enough to begin.`}</div>
              <div className={styles.check}>{`The four graders are humans (gold standard, use on small samples), user feedback (real but noisy and post-ship only), programmatic checks (instant, but need checkable answers), and LLM judges (scalable, but biased toward longer and first-seen answers — validate them against humans).`}</div>
              <div className={styles.check}>{`Evals are a continuous loop: define good, build the dataset, baseline, group failures, fix, and rerun against the same dataset — and keep watching production, because model updates can shift agent behavior overnight.`}</div>
              </div>
            </section>

          <footer className={styles.footer}>
            Source: <a href={`https://www.youtube.com/watch?v=_Er8Hao_gmQ`}>{`AI Evals Explained | How to evaluate AI Agents?`}</a> by <a href={`https://www.youtube.com/@aishwaryasrinivasan`}>{`Aishwarya Srinivasan`}</a> · metadata fetched {`2026-09-02`} Built by the <a href={`${basePath}/knowledge-base/`}>Knowledge Base</a> YouTube → article pipeline.
          </footer>
        </article>
      </div>
    </main>
  );
}

