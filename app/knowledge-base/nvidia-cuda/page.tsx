import type { Metadata } from "next";
import styles from "../knowledge-base.module.css";
import MermaidDiagram from "../mermaid";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Nvidia CUDA in 100 Seconds | Knowledge Base",
  description: "CUDA is NVIDIA's parallel computing platform, and it is the technology that lets developers put the GPU to work on far more than video games. This art",
};

const TAGS = [`Applied AI`, `Article`, `Fireship`];

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
            <h1>{`Nvidia CUDA in 100 Seconds`}</h1>
            <p>{`CUDA is NVIDIA's parallel computing platform, and it is the technology that lets developers put the GPU to work on far more than video games. This article covers everything the video teaches: what CUDA is and where it came from, why GPU hardware is built for massive parallelism, how CUDA's programming model works, and a step-by-step walkthrough of a first CUDA program in C++. It is written for developers and data scientists who want a clear mental model of the platform that powers modern AI training.`}</p>
            <div className={styles.tags}>
              {TAGS.map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}
            </div>
            <nav className={styles.toc} aria-label="Article sections">
                  <a href={`#what-is-cuda`} key="what-is-cuda">{`What Is CUDA?`}</a>
                  <a href={`#why-gpus-are-built-for-parallel-work`} key="why-gpus-are-built-for-parallel-work">{`Why GPUs Are Built for Parallel Work`}</a>
                  <a href={`#how-cuda-works-host-device-and-execution`} key="how-cuda-works-host-device-and-execution">{`How CUDA Works: Host, Device, and Execution`}</a>
                  <a href={`#building-your-first-cuda-application`} key="building-your-first-cuda-application">{`Building Your First CUDA Application`}</a>
                  <a href={`#where-to-go-next`} key="where-to-go-next">{`Where to Go Next`}</a>
                  <a href={`#key-takeaways`} key="key-takeaways">{`Key Takeaways`}</a>
            </nav>
          </header>

            <section className={styles.section} id="what-is-cuda">
              <div className={styles.kicker}>Part 01</div>
              <h2>{`What Is CUDA?`}</h2>
              <p>{`CUDA — Compute Unified Device Architecture — is a parallel computing platform that allows you to use your GPU for more than just playing video games. Developed by NVIDIA in 2007 and based on the prior work of Ian Buck and John Nickolls, CUDA has since revolutionized the field by letting people compute over large blocks of data in parallel. In doing so, it unlocked the true potential of the deep neural networks behind artificial intelligence: a CUDA kernel lets a developer tap directly into the GPU's raw power, and data scientists around the world are using it at this very moment to train the most powerful machine learning models.`}</p>
            </section>

            <section className={styles.section} id="why-gpus-are-built-for-parallel-work">
              <div className={styles.kicker}>Part 02</div>
              <h2>{`Why GPUs Are Built for Parallel Work`}</h2>
              <p>{`To understand CUDA, you first have to understand the hardware it targets. The Graphics Processing Unit (GPU) was historically used for exactly what its name implies: computing graphics. When you play a game at 1080p and 60 FPS, you have over two million pixels on the screen, each of which may need to be recalculated after every frame. That demands hardware capable of doing a lot of matrix multiplication and vector transformations in parallel — and "a lot" is an understatement.`}</p>
              <p>{`Modern GPUs are measured in teraflops: how many trillions of floating-point operations the chip can handle per second. The gap between CPU and GPU is enormous. A modern CPU such as the Intel Core i9 has 24 cores, while a modern GPU like the RTX 4090 has over 16,000 cores. A CPU is designed to be versatile, handling whatever task you throw at it, whereas a GPU is designed to do one thing really well: go fast in parallel. CUDA exists to give developers a way to harness all of those cores.`}</p>
              <MermaidDiagram code={"flowchart LR\nTask[\"A frame at 60 FPS: millions of pixels, each recomputed in parallel\"] --> CPUBox\nTask --> GPUBox\n\nsubgraph CPUBox[\"CPU: the generalist\"]\ndirection TB\nC1[\"24 cores - each one powerful\"]\nC2[\"Different tasks, handled one at a time\"]\nC3[\"Versatile: runs anything you throw at it\"]\nC1 --> C2 --> C3\nend\n\nsubgraph GPUBox[\"GPU: the specialist\"]\ndirection TB\nG1[\"16,000+ cores - each one simple\"]\nG2[\"One operation, repeated on every pixel at once\"]\nG3[\"Throughput measured in teraflops\"]\nG1 --> G2 --> G3\nend"} caption={`1. Why GPUs Win at Parallel Work — Illustrates Section 2, "Why GPUs Are Built for Parallel Work": when the same operation must run on millions of pixels at once, thousands of simple GPU cores beat a handful of powerful CPU cores.`} />
            </section>

            <section className={styles.section} id="how-cuda-works-host-device-and-execution">
              <div className={styles.kicker}>Part 03</div>
              <h2>{`How CUDA Works: Host, Device, and Execution`}</h2>
              <p>{`CUDA splits the work between two processors: the host (your CPU) and the device (the GPU). The flow of a typical CUDA program looks like this:`}</p>
              <div className={styles.panel}>
                <ol>
                  <li>{`You write a function called a CUDA `}<strong>{`kernel`}</strong>{` that runs on the GPU.`}</li>
                  <li>{`You copy data from your main RAM over to the GPU's memory.`}</li>
                  <li>{`The CPU tells the GPU to execute the kernel in parallel.`}</li>
                  <li>{`The GPU executes the kernel in units called `}<strong>{`blocks`}</strong>{`, which themselves organize threads into a multi-dimensional `}<strong>{`grid`}</strong>{`.`}</li>
                  <li>{`The final result is copied back from the GPU to main memory.`}</li>
                </ol>
              </div>
              <p>{`The multi-dimensional grid is a key idea: it lets the arrangement of threads mirror the shape of the data being processed, which matters when that data is itself multi-dimensional.`}</p>
              <MermaidDiagram code={"sequenceDiagram\nparticipant H as \"Host (CPU)\"\nparticipant D as \"Device (GPU)\"\nNote over H: 1. Write a CUDA kernel - a function that runs on the GPU\nH->>D: 2. Copy input data into GPU memory\nH->>D: 3. Launch the kernel\nNote over D: 4. Execute in parallel - blocks of threads on a grid\nD-->>H: 5. Copy the result back to main memory"} caption={`2. Host and Device: The Five-Step CUDA Flow — Illustrates Section 3, "How CUDA Works: Host, Device, and Execution": every CUDA program is a five-step handshake - kernel first, data over, launch, execute, then results back.`} />
            </section>

            <section className={styles.section} id="building-your-first-cuda-application">
              <div className={styles.kicker}>Part 04</div>
              <h2>{`Building Your First CUDA Application`}</h2>
              <p>{`To build a CUDA application you first need an NVIDIA GPU, then you install the CUDA toolkit, which includes device drivers, a runtime, compilers, and developer tools. The actual code is most often written in C++ — as in this demo, developed in Visual Studio.`}</p>
              <h3>{`4.1 The Kernel: A Function That Runs on the GPU`}</h3>
              <p>{`First, the `}<code>{`__global__`}</code>{` specifier defines a function — a CUDA kernel — that runs on the actual GPU. The example kernel adds two vectors together: it takes pointer arguments `}<code>{`A`}</code>{` and `}<code>{`B`}</code>{`, the two vectors to add, and a pointer `}<code>{`C`}</code>{` for the result. Because the kernel may execute billions of times in parallel across threads, each invocation must first calculate the global index of the thread it is running on, so that every thread writes to its own distinct element:`}</p>
              <p>{`\`\`\`cpp`}</p>
              <p>{`__global__ void add(int `}<em>{`A, int `}</em>{`B, int *C) {`}</p>
              <p>{`int index = blockIdx.x * blockDim.x + threadIdx.x;`}</p>
              <p>{`C[index] = A[index] + B[index];`}</p>
              <p>{`}`}</p>
              <p>{`\`\`\``}</p>
              <p>{`Here `}<code>{`blockIdx`}</code>{`, `}<code>{`blockDim`}</code>{`, and `}<code>{`threadIdx`}</code>{` describe where the current thread sits inside the block-and-grid structure: which block it belongs to, how large the blocks are, and its position within its block.`}</p>
              <h3>{`4.2 Managed Memory: Sharing Data Between CPU and GPU`}</h3>
              <p>{`Next, the demo uses `}<strong>{`managed memory`}</strong>{` (`}<code>{`cudaMallocManaged`}</code>{`), which tells CUDA that the allocated data can be accessed from both the host CPU and the device GPU, without the need to manually copy data between them — a convenience that skips the explicit copy step described in the general flow above. The CPU-side `}<code>{`main`}</code>{` function then uses a `}<code>{`for`}</code>{` loop to initialize the arrays with data, ready to be handed to the GPU.`}</p>
              <h3>{`4.3 Launching the Kernel: The Triple Brackets`}</h3>
              <p>{`To actually run the kernel, the data is passed to `}<code>{`add`}</code>{` with some unusual syntax: `}<code>{`add<<<1, 256>>>(A, B, C);`}</code>{`. Those triple brackets configure the kernel launch, controlling how many blocks and how many threads per block are used to run the code in parallel. Getting that configuration right is crucial for optimizing multi-dimensional data structures, such as the tensors used in deep learning.`}</p>
              <p>{`\`\`\`cpp`}</p>
              <p>{`// Allocate managed memory and initialize A and B on the CPU,`}</p>
              <p>{`// then launch one block of 256 threads to run add() on the GPU.`}</p>
              <p>{`add<<<1, 256>>>(A, B, C);`}</p>
              <p>{`cudaDeviceSynchronize();`}</p>
              <p>{`\`\`\``}</p>
              <p><code>{`cudaDeviceSynchronize`}</code>{` pauses the execution of the CPU-side code and waits until the GPU work is complete. When the kernel finishes, the data is available back on the host machine, and the program can use the result — printing it to standard output, for instance. Compile and run with the CUDA compiler (`}<code>{`nvcc`}</code>{`), and congratulations: you just ran 256 threads in parallel on your GPU.`}</p>
              <MermaidDiagram code={"flowchart TD\nLaunch[\"Host launches the kernel: add<<<1, 256>>>(A, B, C)\"] --> Grid\n\nsubgraph Grid[\"Grid - a multi-dimensional array of blocks\"]\nsubgraph Block[\"Block 0 - 256 threads\"]\ndirection LR\nT0[\"Thread 0\"] --> T1[\"Thread 1\"] --> Dots[\"...\"] --> T255[\"Thread 255\"]\nend\nend\n\nGrid --> Index[\"Every thread finds its own element\"]\nIndex --> Formula[\"index = blockIdx.x * blockDim.x + threadIdx.x\"]\nFormula --> Add[\"C[index] = A[index] + B[index]\"]"} caption={`3. Grid, Blocks, and Threads: Inside a Kernel Launch — Illustrates Section 4, "Building Your First CUDA Application": how the launch \`add<<<1, 256>>>\` maps 256 threads onto the grid and why each thread computes its own index.`} />
            </section>

            <section className={styles.section} id="where-to-go-next">
              <div className={styles.kicker}>Part 05</div>
              <h2>{`Where to Go Next`}</h2>
              <p>{`To go beyond this introduction, NVIDIA's GTC conference is a natural next step: it comes up every year, it is free to attend virtually, and it features talks on building massive parallel systems with CUDA.`}</p>
            </section>

            <section className={styles.section} id="key-takeaways">
              <div className={styles.kicker}>Summary</div>
              <h2>Key Takeaways</h2>
              <div className={styles.checklist}>
              <div className={styles.check}>{`CUDA (Compute Unified Device Architecture) is NVIDIA's parallel computing platform, introduced in 2007, that lets developers use the GPU for general-purpose computation — including the deep neural networks behind AI.`}</div>
              <div className={styles.check}>{`GPUs are hardware built for parallelism: where a high-end CPU has dozens of cores (e.g., 24 on the Intel Core i9), a modern GPU has over 16,000, and its throughput is measured in teraflops.`}</div>
              <div className={styles.check}>{`CUDA programs split work between a host (CPU) and a device (GPU): define a kernel that runs on the GPU, get the data into GPU memory, launch the kernel, and copy results back.`}</div>
              <div className={styles.check}>{`Kernel execution is organized into blocks of threads arranged in a multi-dimensional grid — a structure that maps naturally onto multi-dimensional data like the tensors used in deep learning.`}</div>
              <div className={styles.check}>{`A kernel is marked with the `}<code>{`__global__`}</code>{` specifier, and each thread computes its own global index to operate on the right element.`}</div>
              <div className={styles.check}>{`Managed memory (`}<code>{`cudaMallocManaged`}</code>{`) lets the CPU and GPU share data without manual copying; `}<code>{`cudaDeviceSynchronize`}</code>{` makes the host wait for GPU work to finish.`}</div>
              <div className={styles.check}>{`A minimal CUDA program is short: one kernel, a launch configured with the triple-bracket syntax, and a synchronization call — the demo runs 256 threads in parallel.`}</div>
              </div>
            </section>

          <footer className={styles.footer}>
            Source: <a href={`https://www.youtube.com/watch?v=pPStdjuYzSI`}>{`Nvidia CUDA in 100 Seconds`}</a> · metadata fetched {`2026-09-02T10:24:15.624214+00:00`} Built by the <a href={`${basePath}/knowledge-base/`}>Knowledge Base</a> YouTube → article pipeline.
          </footer>
        </article>
      </div>
    </main>
  );
}

