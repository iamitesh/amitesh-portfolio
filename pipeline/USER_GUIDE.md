# YouTube Learning Pipeline — User Guide

This guide is for the person using the pipeline: how to run it, what it
produces, and how to read the results. (For prerequisites, re-run mechanics,
and exit codes, see [README.md](README.md).)

## What it does

One command turns any YouTube video into a complete study kit:

```
/pipeline <youtube-url> [<youtube-url> ...]
```

For every video, agents produce a cleaned transcript, a full article that
explains everything the video teaches, diagrams in two forms, and a
presentation deck. You can give it one video or a batch — videos are
processed in parallel.

Accepted URL forms: `youtube.com/watch?v=…`, `youtu.be/…`, `/shorts/…`,
`/embed/…`, `/live/…`, or a bare 11-character video ID.

## What you get

Everything lands in `pipeline/output/<video-id>/`:

| File | What it's for |
| --- | --- |
| `article.html` | **Start here.** The rendered article with a diagram toggle. |
| `slides.html` | The presentation deck. Open full-screen and navigate with keys. |
| `article.md` | The article in portable Markdown (diagrams render on GitHub). |
| `diagrams.html` | The interactive diagrams as a standalone page. |
| `diagrams.md` | The mermaid diagram sources. |
| `transcript.md` | The cleaned transcript (useful for searching exact quotes). |
| `transcript-raw.md` | The raw captions with timestamps. |
| `meta.json` | Video title, channel, URL, caption language info. |

All HTML files are self-contained and work offline (except one caveat below).

## Reading the article (`article.html`)

- The **Diagrams section** sits right after the introduction, with two views
  switched by the toggle at its top:
  - **Mermaid** — the diagrams rendered as flowcharts (needs internet; loads
    mermaid from a CDN).
  - **Interactive** — hand-built HTML workflows with step-through buttons and
    tabs (works offline).
- Every diagram has a **Source** disclosure with its mermaid code — also
  readable offline if the mermaid view can't render.
- If a mermaid diagram has a syntax problem, a red error box appears at the
  bottom of the Diagrams section instead of failing silently.
- The header shows the channel, the original video link, the fetch date, and a
  note when captions were auto-generated, auto-translated, or translated from
  another language.

## Presenting (`slides.html`)

- `→` / `Space` / `PageDown` — next slide
- `←` / `PageUp` — previous slide
- `Home` / `End` — first / last slide
- Swipe left/right on touch screens
- The top progress bar and the `01 / NN` counter track your position.

## Language behavior

- The pipeline fetches the **English** caption track by default, falling back
  to auto-translate when only other-language tracks exist.
- If a video has no English captions *and* its track can't be translated, the
  run reports it as failed with a hint. To process it anyway, fetch with
  `python3 pipeline/fetch_clean.py "<url>" --any-language` — the article agent
  translates the transcript while writing.

## If something fails

Each run ends with a summary table — one row per video, ✓/✗ per stage. For
every ✗ the table prints the exact command to fix that stage:

- **fetch failed** (no captions / rate-limited / network): re-run
  `fetch_clean.py` directly (see README for exit codes 69/74/75).
- **an agent stage failed**: ask Claude Code to re-spawn that agent for the
  video, e.g. *"Process pipeline/output/<video-id> with the diagram-maker."*
- **render failed**: `python3 pipeline/render_article.py pipeline/output/<video-id>`

Failures are isolated — one bad video never blocks the others.

## Tips

- Long videos produce longer articles and bigger decks automatically; diagrams
  are capped at 6 per article.
- YouTube caption availability changes over time. If a video that worked
  before now fails, its captions were likely removed — `--any-language` may
  still find a track.
- Want to redo one stage without touching the rest? Only the failed stage
  needs re-running; earlier outputs are reused as-is.
