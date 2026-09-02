# YouTube → Article → Diagrams → Slides Pipeline

Give the pipeline a list of YouTube URLs and, for each video, it produces a
cleaned transcript, a polished article, diagrams (mermaid + interactive HTML
with an in-article toggle), and an HTML slide deck.

## Prerequisites

- Claude Code (the pipeline is orchestrated by the `/pipeline` slash command)
- System `python3` (3.9+) with `youtube-transcript-api` installed:
  `python3 -m pip install --user youtube-transcript-api`
- Internet access (transcript fetch; the mermaid view of `article.html` loads
  a pinned CDN script)

## Invocation

In Claude Code:

```
/pipeline <youtube-url> [<youtube-url> ...]
```

Accepted URL forms: `https://www.youtube.com/watch?v=<id>`,
`https://youtu.be/<id>`, `/shorts/<id>`, `/embed/<id>`, `/live/<id>`, or a bare
11-character video ID.

The pipeline runs in stage waves across videos: fetch (deterministic) →
article agent → diagram agent → slide agent → render + structural verification.
Failures are isolated per video and reported in a summary table with exact
remediation commands.

## Output layout

One folder per video under `pipeline/output/<video-id>/`:

| File | Produced by | Contents |
| --- | --- | --- |
| `meta.json` | `fetch_clean.py` | title, channel, URL, fetched-at, language source |
| `transcript-raw.md` | `fetch_clean.py` | captions verbatim, one `[HH:MM:SS] text` line each |
| `transcript.md` | `fetch_clean.py` | cleaned: no timestamps, no music markers, bounded paragraphs |
| `article.md` | article-writer agent | polished article; mermaid diagrams inline after the intro |
| `diagrams.md` | diagram-maker agent | the diagrams section source (mermaid only) |
| `diagrams.html` | diagram-maker agent | standalone interactive HTML diagram page |
| `article.html` | `render_article.py` | rendered article with a Mermaid ⇄ Interactive toggle |
| `slides.html` | slide-builder agent | self-contained HTML deck replicating the repo's slide template |

Open `article.html` or `slides.html` directly in a browser (`file://` works).

## Re-running individual stages

- Re-fetch one video (overwrites): `python3 pipeline/fetch_clean.py "<url>" --force`
- Video has no English captions but has other-language captions:
  `python3 pipeline/fetch_clean.py "<url>" --any-language`
  (fetches the available track as-is; the article agent translates it)
- Re-run a failed agent stage: ask Claude Code to spawn the agent directly,
  e.g. *"Process pipeline/output/<video-id>. Inputs: transcript.md and
  meta.json. Output: article.md per your instructions."* using the
  `article-writer` / `diagram-maker` / `slide-builder` agent type.
- Re-render after any fix: `python3 pipeline/render_article.py pipeline/output/<video-id>`

## Exit codes (`fetch_clean.py` / `render_article.py`)

| Code | Meaning |
| --- | --- |
| 64 | usage / invalid URL or video ID |
| 65 | (render) article still has `<!-- DIAGRAM-SLOT -->` — run the diagram stage |
| 66 | no input / missing input file |
| 69 | video unavailable or no usable captions |
| 73 | already fetched — use `--force` |
| 74 | network failure (retryable) |
| 75 | blocked or rate-limited by YouTube (retryable) |

## Limitations

- Auto-generated or auto-translated captions can be rough; the article agent
  is instructed to be conservative and mark unrecoverable passages.
- The mermaid view of `article.html` needs internet (CDN); the Interactive
  view and the per-diagram `Source` blocks work offline.
- Captions carry no speaker labels, so articles are single-voice.
- YouTube caption availability changes over time — a video fetched today may
  fail tomorrow if its captions are removed.
