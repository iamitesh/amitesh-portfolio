## Diagrams

### 1. Why GPUs Win at Parallel Work

Illustrates Section 2, "Why GPUs Are Built for Parallel Work": when the same operation must run on millions of pixels at once, thousands of simple GPU cores beat a handful of powerful CPU cores.

```mermaid
flowchart LR
    Task["A frame at 60 FPS: millions of pixels, each recomputed in parallel"] --> CPUBox
    Task --> GPUBox

    subgraph CPUBox["CPU: the generalist"]
        direction TB
        C1["24 cores - each one powerful"]
        C2["Different tasks, handled one at a time"]
        C3["Versatile: runs anything you throw at it"]
        C1 --> C2 --> C3
    end

    subgraph GPUBox["GPU: the specialist"]
        direction TB
        G1["16,000+ cores - each one simple"]
        G2["One operation, repeated on every pixel at once"]
        G3["Throughput measured in teraflops"]
        G1 --> G2 --> G3
    end
```

### 2. Host and Device: The Five-Step CUDA Flow

Illustrates Section 3, "How CUDA Works: Host, Device, and Execution": every CUDA program is a five-step handshake - kernel first, data over, launch, execute, then results back.

```mermaid
sequenceDiagram
    participant H as "Host (CPU)"
    participant D as "Device (GPU)"
    Note over H: 1. Write a CUDA kernel - a function that runs on the GPU
    H->>D: 2. Copy input data into GPU memory
    H->>D: 3. Launch the kernel
    Note over D: 4. Execute in parallel - blocks of threads on a grid
    D-->>H: 5. Copy the result back to main memory
```

### 3. Grid, Blocks, and Threads: Inside a Kernel Launch

Illustrates Section 4, "Building Your First CUDA Application": how the launch `add<<<1, 256>>>` maps 256 threads onto the grid and why each thread computes its own index.

```mermaid
flowchart TD
    Launch["Host launches the kernel: add<<<1, 256>>>(A, B, C)"] --> Grid

    subgraph Grid["Grid - a multi-dimensional array of blocks"]
        subgraph Block["Block 0 - 256 threads"]
            direction LR
            T0["Thread 0"] --> T1["Thread 1"] --> Dots["..."] --> T255["Thread 255"]
        end
    end

    Grid --> Index["Every thread finds its own element"]
    Index --> Formula["index = blockIdx.x * blockDim.x + threadIdx.x"]
    Formula --> Add["C[index] = A[index] + B[index]"]
```
