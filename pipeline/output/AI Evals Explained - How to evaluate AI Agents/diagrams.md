## Diagrams

### 1. What an AI Eval Measures: From Agent Decisions to a Score

This diagram illustrates Section 1, "What Is an AI Eval?" — an agent is a chain of decisions, and an eval is the repeatable, structured score that tells you whether each change helped or broke something.

```mermaid
flowchart TD
  subgraph Chain["The agent: a chain of decisions"]
    direction TB
    C1["Pick a tool"] --> C2["Call the tool"]
    C2 --> C3["Read the result"]
    C3 --> C4["Decide what to do next"]
    C4 --> C1
  end
  C4 --> Out["Outputs and action traces"]
  Out --> Ev["Eval: a structured, repeatable scoring process"]
  Ev --> Sc["Hands you an actual score on your own data"]
  Sc --> Q{"Is the agent getting better, or did I break it?"}
  Q -->|"Better"| Ship["Ship it and keep measuring"]
  Q -->|"Broke it"| Fix["Find where it went sideways, fix it, rerun"]
  Ch["Every change: a new prompt, a model, or a retrieval tweak"] -.-> C1
  Gap["Why it matters: lab scores run about one-third ahead of real deployed work"] -.-> Ev
```

### 2. Benchmarks, Classic ML Evals, and AI Evals: What Each One Tests

This diagram illustrates Section 2, "Evals vs. Benchmarks vs. Classic Machine Learning Evaluation" — benchmarks and classic ML evals grade clean, generic answers, while AI evals grade your specific system's open-ended essays.

```mermaid
flowchart TD
  Q["Question: is this just benchmarks, or the ML evaluation we already know?"]
  subgraph Bench["Benchmarks: a generic test of the model"]
    direction TB
    B1["The same test applied to every model"]
    B2["SWE-bench, Tau-bench, Terminal-Bench, composite indexes"]
    B3["Great for choosing which model to start with"]
  end
  subgraph Classic["Classic ML evaluation: a multiple-choice test"]
    direction TB
    C1["Output is clean: a category, a number, yes or no"]
    C2["An answer key exists, so grading is objective"]
    C3["Metrics: accuracy, precision, recall, F1"]
  end
  subgraph Ai["AI evals: an essay, not a multiple-choice test"]
    direction TB
    E1["Output is open-ended text or whole action sequences"]
    E2["No single right answer and no answer key"]
    E3["You need a rubric and someone to use judgment"]
    E4["Evals test your system: your task, your data, your prompts, your users"]
  end
  Q --> B1
  Q --> C1
  Q --> E1
  B3 -.->|"then verify on your task"| E4
  C2 -.->|"LLMs changed grading"| E2
  B1 -.-> Top
  C3 -.-> Top
  E4 --> Top
  Top["A model can top every leaderboard and still fall apart on your use case"]
```

### 3. Choosing Metrics by Task: From the Core Four to Task-Specific

This diagram illustrates Sections 3.1 and 3.2, "The Metrics That Matter" — start from the four core metrics, then pick task-specific ones for summarization, classification, translation, and RAG.

```mermaid
flowchart TD
  Core["Top-level metrics: relevance, faithfulness, correctness, coherence"]
  Core --> Ask{"What is your task?"}
  Ask -->|"Summarization"| S1["Faithfulness: stay true to the source, invent nothing"]
  S1 --> S2["Coverage: capture the main points"]
  S2 --> S3["Conciseness: keep it tight"]
  Ask -->|"Classification"| K1["Output is a clean label, like old-school ML"]
  K1 --> K2["Accuracy, precision, recall, F1"]
  Ask -->|"Translation"| T1["Meaning carries over and the text reads naturally"]
  T1 --> T2["BLEU, COMET"]
  Ask -->|"RAG"| R1["Answer relevance plus faithfulness"]
  R1 --> R2["Together they catch bad retrieval and bad generation"]
```

### 4. The Three Families of Grading Metrics

This diagram illustrates Section 3.4, "Three Families of Metrics" — word-overlap, semantic, and model-based scores form an escalating ladder of grading power.

```mermaid
flowchart TD
  Start["The metric alphabet soup, sorted into three families"]
  subgraph Ov["Family 1: classic overlap metrics"]
    direction TB
    O1["BLEU, ROUGE, METEOR and similar"]
    O2["Measure word overlap against a reference answer"]
    O3["Fast and cheap, but blind to meaning"]
  end
  subgraph Sem["Family 2: semantic metrics"]
    direction TB
    M1["BERTScore, BLEURT, COMET"]
    M2["Compare meaning with embeddings"]
    M3["Handle paraphrasing far better"]
  end
  subgraph Mb["Family 3: model-based metrics"]
    direction TB
    G1["LLM as judge and named methods like G-Eval"]
    G2["A model grades output against your rubric"]
    G3["The only family that scales to open-ended outputs"]
  end
  Start --> O1
  Start --> M1
  Start --> G1
  O3 -.->|"words to meaning"| M2
  M3 -.->|"meaning to judgment"| G2
  G3 --> Tail["Agent outputs are open-ended and reference-free, so more and more the grader is a model"]
```

### 5. Golden Dataset First, Then Four Ways to Grade Outputs

This diagram illustrates Sections 4 and 5, "Start With a Golden Dataset" and "Four Ways to Grade Agent Outputs" — build the dataset first, let the metrics fall out of it, then choose among human, user-feedback, programmatic, and LLM-judge grading.

```mermaid
flowchart TD
  subgraph DS["Build the golden dataset first"]
    direction TB
    G1["A handful of example inputs for your task"]
    G2["Each paired with a great output and a bad output"]
    G3["Cover common cases, edge cases, and past failures"]
  end
  G3 --> Size["Start small: about 52 examples is plenty"]
  Size --> Back["Work backwards from the examples"]
  Back --> Met["Judgments of good and bad, quantified, become your metrics"]
  Met --> How{"How do you actually grade?"}
  How -->|"Humans"| H1["A domain expert scores outputs against the rubric"]
  H1 --> H2["Gold standard: slow and expensive, for small careful samples"]
  How -->|"User feedback"| U1["Thumbs, edits, task completion, repeat visits"]
  U1 --> U2["Real ground truth, but noisy and only after you ship"]
  How -->|"Programmatic"| P1["Code checks: valid JSON, right tool and arguments, time, cost"]
  P1 --> P2["Cheap and instant, run on every change, need checkable answers"]
  How -->|"LLM as a judge"| L1["A strong model grades outputs against the rubric"]
  L1 --> L2["Scales essay grading to thousands of outputs"]
  L2 -.->|"validate the judge against a human on a sample first"| H1
```

### 6. The Evaluation Loop: CI/CD for AI Agents

This diagram illustrates Sections 6 and 7, "Evals Are a Loop" and "Tools for Running and Monitoring Evals" — the eight-step loop that teams run forever, plus the tooling that runs and monitors evals.

```mermaid
flowchart TD
  subgraph Loop["The loop: continuous, like CI/CD for software"]
    direction TB
    S1["1. Decide what good even means"] --> S2["2. Build the golden dataset"]
    S2 --> S3["3. Pick metrics by working backwards from the dataset"]
    S3 --> S4["4. Run a baseline across the whole dataset"]
    S4 --> S5["5. Group the failures: retrieval, formatting, edge cases"]
    S5 --> S6["6. Fix: prompts, retrieval, tool definitions"]
    S6 --> S7["7. Rerun against the exact same dataset"]
    S7 --> D{"Numbers up, nothing regressed?"}
    D -->|"No, something broke"| S5
  end
  D -->|"Yes"| S8["8. Keep going: ship and watch live traffic"]
  S8 --> Fail["Real-world failures flow back into the golden dataset"]
  Fail -.-> S2
  Prov["Providers can quietly swap models, shifting behavior overnight"] -.-> S8
  Run["Running evals: Promptfoo, RAGAS"] -.-> S4
  Trace["Tracing and monitoring: LangSmith, Langfuse, Arize, Braintrust"] -.-> S8
```
