---
description: Fetch YouTube transcripts and produce cleaned transcripts, articles, diagrams, and slide decks
argument-hint: <youtube-url> [<youtube-url> ...]
allowed-tools: Bash, Read, Write, Edit, Grep, Glob, Agent
---

You are orchestrating the YouTube learning pipeline for the URLs the user gave: `$ARGUMENTS`. The pipeline turns each video into a folder `pipeline/output/<video-id>/` containing a cleaned transcript, a polished article, mermaid + interactive diagrams (with an in-article toggle), and an HTML slide deck.

Run the stages below **in order**. Keep all progress state in this conversation (no scratch files).

## Step 0 — Normalize

Parse `$ARGUMENTS` into a list of URLs (whitespace-separated). Accept `youtube.com/watch?v=`, `youtu.be/`, `/shorts/`, `/embed/`, `/live/`, or a bare 11-char video ID. Dedupe; drop empty items. If nothing remains, print usage (`/pipeline <youtube-url> [<youtube-url> ...]`) and stop.

## Step 1 — Fetch wave (deterministic, parallel)

For every URL, in **one message** issue one `Bash` call per URL so they run concurrently:

```
python3 pipeline/fetch_clean.py "<url>"
```

Record pass/fail per video from each exit code and the JSON summary on stdout. Retry exactly once, only for exit 74 (network) or 75 (blocked/rate-limited), waiting ~60 s before retrying. Exit 69 means no captions — do not retry, but note that `python3 pipeline/fetch_clean.py "<url>" --any-language` fetches the original-language track (the article agent then translates it) if the user wants it. If every video fails, print the failure table and stop.

## Agent types note

The agent types `article-writer`, `diagram-maker`, `slide-builder` are defined in `.claude/agents/`. If a named type is not registered in this session (spawn fails with "not found"), spawn a general `claude` agent instead whose task message begins: "Read .claude/agents/<name>.md and follow it exactly." — followed by the standard task message. Either way the behavior is identical.

## Step 2 — Article wave (parallel subagents)

For every successfully fetched video, spawn **one `Agent` per video** (subagent_type `article-writer`), all in a single message, in batches of at most 4 if there are many videos. Each agent's task message:

> Process pipeline/output/<VIDEO_ID>. Inputs: transcript.md and meta.json. Output: article.md per your instructions.

Wait for all agents to complete (their completion notifications). After the wave, check each video: `article.md` must exist. Missing → that stage failed for that video.

## Step 3 — Diagram wave (parallel subagents)

Same pattern with subagent_type `diagram-maker`, only for videos whose `article.md` exists. Task message:

> Process pipeline/output/<VIDEO_ID>. Inputs: article.md and meta.json. Outputs: diagrams.md, diagrams.html, and the diagram splice into article.md per your instructions.

Wait for all. A video passed only if `diagrams.md` and `diagrams.html` exist **and** `article.md` no longer contains `DIAGRAM-SLOT` (Grep it).

## Step 4 — Slides wave (parallel subagents)

Same pattern with subagent_type `slide-builder`, only for videos that passed step 3. Task message:

> Process pipeline/output/<VIDEO_ID>. Inputs: the slide template at repo root (agentic-ai-system-design-slides.html), article.md, and meta.json. Output: slides.html per your instructions.

Wait for all. Passed only if `slides.html` exists.

## Step 5 — Render + verify wave (deterministic, parallel)

For every video that passed step 4, in one message run per video:

```
python3 pipeline/render_article.py pipeline/output/<VIDEO_ID>
```

Then run the four structural checks below (node one-liners) on each completed video.

slides.html:

```bash
node -e 'const fs=require("fs");const h=fs.readFileSync(process.argv[1],"utf8");
const slides=(h.match(/<section class="slide">/g)||[]).length;
const ids=["progress","deck","counter","hint","nav","prev","next"].every(i=>h.includes("id=\""+i+"\""));
const js=["keydown","ArrowRight","ArrowLeft","PageUp","PageDown","touchstart","show(0)"].every(s=>h.includes(s));
const vars=["--bg: #0b101c","--panel: #141b2d","--accent: #6ea8fe","--border: #273349"].every(s=>h.includes(s));
console.log(JSON.stringify({slides,ids,js,vars}));process.exit(slides>8&&ids&&js&&vars?0:1)' pipeline/output/<VIDEO_ID>/slides.html
```

article.html:

```bash
node -e 'const fs=require("fs");const h=fs.readFileSync(process.argv[1],"utf8");
const c={toggle:h.includes("id=\"diagram-switch\""),m:h.includes("id=\"view-mermaid\""),
w:h.includes("id=\"view-workflow\""),n:(h.match(/class="mermaid"/g)||[]).length,
cdn:h.includes("mermaid.min.js"),noDeck:!h.includes("id=\"deck\"")};
console.log(JSON.stringify(c));process.exit(c.toggle&&c.m&&c.w&&c.n>0&&c.cdn&&c.noDeck?0:1)' pipeline/output/<VIDEO_ID>/article.html
```

article.md:

```bash
node -e 'const fs=require("fs");const a=fs.readFileSync(process.argv[1],"utf8");
const f=[...a.matchAll(/```mermaid\n([\s\S]*?)```/g)].map(m=>m[1]);
const ok=/^(flowchart|graph|sequenceDiagram|stateDiagram-v2|classDiagram|erDiagram|journey|gantt)\b/;
const bad=f.filter(x=>!ok.test(x.trim()));
console.log(JSON.stringify({slot:a.includes("DIAGRAM-SLOT"),count:f.length,invalid:bad.length}));
process.exit(!a.includes("DIAGRAM-SLOT")&&f.length>=3&&bad.length===0?0:1)' pipeline/output/<VIDEO_ID>/article.md
```

transcript.md:

```bash
node -e 'const fs=require("fs");const t=fs.readFileSync(process.argv[1],"utf8");
const junk=(t.match(/\[Music\]|\[संगीत\]|\[\d{1,2}:\d{2}(?::\d{2})?\]/g)||[]).length;
console.log(JSON.stringify({junk}));process.exit(junk===0&&t.trim().length>100?0:1)' pipeline/output/<VIDEO_ID>/transcript.md
```

## Step 6 — Summary

Print a table: one row per video, columns fetch / article / diagrams / slides / render / verify with ✓ or ✗ and the artifact paths. For each ✗ print the exact remediation command:

- fetch failed: `python3 pipeline/fetch_clean.py "<url>"` (add `--force` to overwrite; add `--any-language` if it was a no-English-captions failure)
- article failed: re-spawn `Agent(article-writer)` for that video ID with the same task message as Step 2
- diagrams failed: re-spawn `Agent(diagram-maker)` (Step 3 message)
- slides failed: re-spawn `Agent(slide-builder)` (Step 4 message)
- render/verify failed: `python3 pipeline/render_article.py pipeline/output/<VIDEO_ID>` then the checks

Always finish with the summary table, even when everything failed. Never block the whole run on one dead video — isolate failures per video and continue the waves with the rest.

## Isolation rules

- Waves are per-stage across videos, never per-video end-to-end: a slow article for one video must not delay another video's fetch or slides.
- Skip downstream stages for any failed video.
- You (the main session) never edit files under `pipeline/output/<video-id>/` yourself — agents own `article.md`, `diagrams.md`, `diagrams.html`, `slides.html`; the scripts own `meta.json`, `transcript-raw.md`, `transcript.md`, `article.html`.
