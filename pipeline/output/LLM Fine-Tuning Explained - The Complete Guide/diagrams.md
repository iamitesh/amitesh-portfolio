## Diagrams

### 1. Pre-Training vs. Post-Training: Where Fine-Tuning Fits In

Maps to Section 1: the old train-from-scratch workflow versus today's pipeline, where a foundation lab pre-trains a base model that you adapt rather than build from zero.

```mermaid
flowchart TD
    subgraph OLD["Before LLMs: you owned the whole pipeline"]
        A1["Train a model from scratch on your own data"] --> A2["Fine-tune that model on task-specific data"]
        A2 --> A3["Ship your own model"]
    end
    subgraph LAB["Foundation lab: pre-training"]
        B1["Massive GPU clusters and trillions of tokens"] --> B2["Base model: Llama, GPT, Claude, Gemini"]
    end
    subgraph NOW["Today: model-as-a-service"]
        B2 --> B3["Base model served to you by download or API"]
        B3 --> B4["Fine-tune on your specific use case"]
        B4 --> B5["Adapted model — you do not train from zero"]
    end
```

### 2. Fine-Tuning at Scale: The Parameter Universe and Weight Access

Maps to Section 2: parameter scale explains why fine-tuning is hard, and weight access decides whether you train on your own GPUs or through the provider.

```mermaid
flowchart TD
    subgraph SCALE["The parameter universe"]
        P1["Traditional ML: hundreds of thousands to a few million"] --> P2["Small open models: a few billion"]
        P2 --> P3["Production models: 10 to 70 billion"]
        P3 --> P4["Frontier models: hundreds of billions"]
        P4 --> P5["Models like GLM: over a trillion"]
    end
    subgraph MEM["Why scale is the core challenge"]
        P5 --> M1["Training memory grows with trainable parameters"]
        M1 --> M2["Memory must hold weights, gradients and optimizer state"]
        M2 --> M3["Even a fraction of a trillion-parameter model needs serious infrastructure"]
    end
    M3 --> Q{"Do you have access to the weights?"}
    Q -->|"Open-weight models"| O1["Llama, Mistral, Qwen, DeepSeek, GLM"]
    O1 --> O2["Download weights and fine-tune on your own GPUs"]
    O2 --> O3["Deploy the fine-tuned model yourself"]
    Q -->|"Closed-weight models"| C1["Claude, GPT, Gemini"]
    C1 --> C2["Submit your data to the provider's fine-tuning service"]
    C2 --> C3["Provider runs the job on its own infrastructure"]
    C3 --> C4["Access the fine-tuned version through their API"]
    C4 --> C5["Trade-off: no visibility into the training"]
```

### 3. Parameter-Efficient Fine-Tuning: LoRA and QLoRA

Maps to Section 3: both methods shrink the trainable parameter count; QLoRA adds 4-bit quantization of the frozen base so a 70B model fits on a single H100.

```mermaid
flowchart TD
    INTRO["PEFT question: do I need to update all 70 billion parameters?"] --> L1
    INTRO --> Q1
    subgraph LORA["LoRA: low-rank adaptation"]
        L1["Freeze the original model weights"] --> L2["Inject small trainable matrices into specific layers"]
        L2 --> L3["Product of the matrices forms a low-rank update"]
        L3 --> L4["Train roughly 100 million parameters instead of 70 billion"]
        L4 --> L5["Merge the learned update back into the frozen weights"]
        L5 --> L6["Inference with no extra latency or memory overhead"]
        L6 --> L7["Adapters are small: store, swap, compare or delete them"]
    end
    subgraph QLORA2["QLoRA: quantized low-rank adaptation"]
        Q1["Quantize the frozen base model to 4-bit precision"] --> Q2["Run LoRA on top of the quantized base"]
        Q2 --> Q3["Keep the trainable adapters at higher precision"]
        Q3 --> Q4["Fine-tune a 70B model on a single H100"]
    end
```

### 4. Reinforcement Fine-Tuning with Verifiable Rewards

Maps to Section 5.1: the automatic reward loop that powers modern reasoning models on tasks with checkable answers.

```mermaid
sequenceDiagram
    participant M as Language model
    participant V as Auto-verifier
    participant T as Training update
    Note over M,V: Task has an answer that can be checked automatically
    M->>M: Sample several candidate solutions with full reasoning chains
    M->>V: Submit the candidates for checking
    V->>V: Compare each answer against ground truth or a test suite
    alt Candidate is correct
        V->>T: Reward the reasoning path that led there
    else Candidate is wrong
        V->>T: Penalize that reasoning path
    end
    T->>M: Reinforce the rewarded reasoning over time
    Note over M,T: The loop repeats with no human labelers
```

### 5. RLHF vs. DPO: Two Routes to Preference Alignment

Maps to Sections 5.2 and 5.3: RLHF trains a separate reward model steered by PPO, while DPO skips the reward model and optimizes the preference pairs directly.

```mermaid
flowchart TD
    subgraph RLHF["RLHF: preference data, reward model, PPO"]
        R1["Collect pairs or rankings of model responses"] --> R2["Human annotators say which responses they prefer"]
        R2 --> R3["Train a reward model to predict those preferences"]
        R3 --> R4["PPO uses the reward model signal to update the language model"]
        R5["Language model samples new responses"] --> R4
        R4 --> R5
    end
    subgraph DPO["DPO: direct preference optimization"]
        D1["Start from the same preference pairs"] --> D2["Skip the reward model entirely"]
        D2 --> D3["Optimize the language model on the pairs in a single step"]
    end
    R4 --> RN1["Cost: heavy human data and a complex training loop"]
    D3 --> DN1["Much easier to implement and needs less compute"]
    DN1 --> DN2["Default choice for preference tuning on open-weight models"]
```

### 6. Choosing the Right Fine-Tuning Method

Maps to Section 6, with the full fine-tuning escalation from Section 4 and the experiment baseline and eval habit from Section 7: optimize prompts and context first, then match the method to your goal.

```mermaid
flowchart TD
    S["Model not performing well enough"] --> P["Optimize your prompts: instructions, examples, structure"]
    P --> C["Optimize your context: documents, retrieval, tool outputs"]
    C --> G{"Is there still a gap?"}
    G -->|"No gap"| KEEP["Prompts and context carry the improvement"]
    G -->|"Gap remains"| GOAL{"What is the goal?"}
    GOAL -->|"Domain task or tone"| QL["Start with QLoRA: the default for most teams"]
    QL --> QB{"Quality bar met?"}
    QB -->|"Yes"| SHIP["Deploy the fine-tuned model"]
    QB -->|"No, rare"| FF["Full fine-tuning: update every parameter, most flexibility, high cost"]
    GOAL -->|"Style, safety, tone"| RH["RLHF or DPO on preference data"]
    GOAL -->|"Reasoning on auto-verifiable tasks"| VR["Reinforcement fine-tuning with verifiable rewards"]
    SHIP --> EXP["Treat it as an experiment: baseline, eval set and metric fixed in advance"]
    FF --> EXP
    RH --> EXP
    VR --> EXP
    EXP --> DQ["Watch data quality: bad data on a good model makes it worse"]
```
