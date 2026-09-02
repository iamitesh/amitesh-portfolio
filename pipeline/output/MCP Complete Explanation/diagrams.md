## Diagrams

### 1. From Point-to-Point Chaos to One Standard Plug
Illustrates Sections 1–2: the drawer-of-chargers problem and the USB-C fix that MCP introduces.

```mermaid
flowchart TD
    subgraph before["Before MCP - the drawer of chargers"]
        A1["App 1"] --> DB1["Database"]
        A1 --> CRM1["CRM"]
        A2["App 2"] --> DB1
        A2 --> SLK1["Slack"]
        A3["App 3"] --> CRM1
        A3 --> FS1["Files"]
    end

    subgraph after["After MCP - one standard cable"]
        C1["Any AI app"] --> M1["MCP protocol"]
        M1 --> S1["Server: database"]
        M1 --> S2["Server: CRM"]
        M1 --> S3["Server: Slack"]
        M1 --> S4["Server: files"]
    end

    before -->|"a thousand bespoke wires become one plug"| after
```

### 2. Host, Client, Server: The Three Pieces
Illustrates Section 3: the host, the in-host client, and the server map onto the phone, its USB-C port, and the accessory — plus the three things a server exposes.

```mermaid
flowchart TD
    subgraph host["Host - the AI app, like your phone"]
        APP["Claude Desktop / Cursor / ChatGPT"] --> PORT["MCP client - the USB-C port inside the host"]
    end

    subgraph srv["MCP server - the accessory you plug in"]
        TOOLS["Tools - actions the model can take"]
        RES["Resources - data the model can read"]
        PROMPTS["Prompts - reusable templates for common tasks"]
    end

    PORT -->|"speaks MCP over stdio or HTTP"| srv
```

### 3. Where MCP Sits: The Agent Loop
Illustrates Section 4: the harness loop in which the model decides, the harness executes, and MCP connects.

```mermaid
sequenceDiagram
    participant U as User
    participant M as Model - the brain
    participant H as Harness - the workstation
    participant C as MCP client
    participant S as MCP server

    Note over M,S: model decides, harness executes, MCP connects

    loop until the task is complete
        U->>M: ask a question
        M->>H: decide a tool is needed - pull rows from a database
        H->>C: route the intent through the client
        C->>S: call the database tool
        S-->>C: return the rows
        C-->>H: hand the result back
        H-->>M: append the result to context
        M->>M: keep reasoning
    end
```

### 4. MCP Below Function Calling, Above Your APIs
Illustrates Section 5: MCP layers under function calling and over plain APIs, and the plugin era ended because MCP is one open port everywhere.

```mermaid
flowchart TD
    subgraph stack["The stack that MCP complements"]
        FC["AI model - function calling decides a tool is needed and shapes the request"]
        TR["MCP - the protocol that carries the request and brings the result back"]
        API["Your API - does the actual work on one service"]
        FC --> TR --> API
    end

    subgraph plugins["Why plugins lost"]
        P1["2023: a ChatGPT plugin works on one platform"]
        P2["Want it elsewhere? Build it again"]
        P3["One MCP server runs on Claude, ChatGPT, Cursor and VS Code"]
        P1 --> P2
    end
```

### 5. Local vs Remote — and the Gate Before You Plug In
Illustrates Sections 7–8: choosing between a local stdio server and a remote HTTP server, behind the verification gate the security section demands.

```mermaid
flowchart TD
    start["Found a server to use"] --> gate{"Verified publisher, or code you have read?"}
    gate -->|"no"| stop["Do not run it - the USB stick from a parking lot"]
    gate -->|"yes"| fork{"Local or remote?"}
    fork -->|"local"| loc["On your machine, over stdio"]
    loc --> cfg1["Add the launch command to the app config"]
    fork -->|"remote"| rem["Hosted elsewhere, over HTTP"]
    rem --> cfg2["Add the server URL to the app config"]
    cfg1 --> restart["Restart the app"]
    cfg2 --> restart
    restart --> disc["Client handshake; tools are discovered automatically"]
    disc --> use["Talk to your AI - it calls the tools when needed"]
    tip["Start local and low-stakes, e.g. a filesystem server"] -.-> loc
```

### 6. The Fifteen-Minute Server: From Function to Live Tool
Illustrates Section 9: FastMCP turns a typed, documented function into a tool, the Inspector validates it, and your client starts calling your code.

```mermaid
flowchart TD
    pick["Pick one API or data source you use daily"] --> fn["Write a typed Python function with a docstring"]
    fn --> deco["Add the FastMCP decorator - the SDK generates the tool"]
    deco --> test["Trigger it in the MCP Inspector first"]
    test --> reg["Register the server in your app config"]
    reg --> live["Your AI calls your code over stdio"]
    live -.->|"scale later"| grad["Move to HTTP with OAuth when more than one person needs it"]
```
