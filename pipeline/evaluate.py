#!/usr/bin/env python3
"""Eval runner for the YouTube learning pipeline — analyses agent outputs.

Consumes provenance records written by pipeline/trace.py (pipeline/traces/
<video-id>/trace.jsonl) plus the artifacts themselves under
pipeline/output/<video-id>/, runs every registered eval that matches an
existing artifact, prints a report, and appends results to:

    pipeline/evals/<video-id>/evals.jsonl

Exit code: 0 = all evals passed, 1 = one or more failed, 2 = usage/IO error.

Adding evals:
  1. Drop a python module into pipeline/evals/plugins/ defining
     EVALS = [ { "name": ..., "patterns": ["article.md", "*.md"],
                 "fn": fn(ctx, text, rel_path) -> (passed: bool, detail: str) } ]
     or
  2. Append an entry to the EVALS registry below.
  ctx has: video_id, out_dir, meta (dict from meta.json), sources_text
  (raw transcript + cleaned transcript + meta.json concatenated), and
  trace (list of run events from trace.jsonl, or None if no trace exists).

Usage:
    python3 pipeline/evaluate.py bsmUh5bTNZ4
    python3 pipeline/evaluate.py bsmUh5bTNZ4 --artifact article.md
"""
import argparse
import datetime
import importlib.util
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(ROOT, "pipeline", "output")
TRACES_DIR = os.path.join(ROOT, "pipeline", "traces")
EVALS_DIR = os.path.join(ROOT, "pipeline", "evals")
PLUGIN_DIR = os.path.join(EVALS_DIR, "plugins")

DEVA_NAGARI = re.compile(r"[ऀ-ॿ]")
TIMESTAMP_RE = re.compile(r"\[(\d{1,2}:\d{2}|संगीत|Music)\]", re.IGNORECASE)
HEADING_RE = re.compile(r"^#{1,6}\s+(.*)$")
TOC_ENTRY_RE = re.compile(r"^(\d+)\.\s+(.+)$")
NUM_RE = re.compile(r"\d[\d,]*")
# Multiplier words (English + Hindi phonetic spellings) that scale a
# preceding number: "100 thousand", "97 मिलियन". Transcripts often line-split
# the number from its unit ("a 100\nथाउजेंड downloads"), so \s* must span
# whitespace including newlines.
MULT_WORDS = r"billion|million|thousand|बिलियन|मिलियन|थाउजेंड|हज़ार|हजार|करोड़|लाख"
MULT_VAL = {"billion": 1e9, "million": 1e6, "thousand": 1e3,
            "बिलियन": 1e9, "मिलियन": 1e6, "थाउजेंड": 1e3, "हज़ार": 1e3, "हजार": 1e3,
            "करोड़": 1e7, "लाख": 1e5}
MULT_RE = re.compile(r"(\d[\d,]*(?:\.\d+)?)\s*(" + MULT_WORDS + r")\b", re.IGNORECASE)
K_SUFFIX_RE = re.compile(r"(\d[\d,]*(?:\.\d+)?)[Kk]\b")
# Cross-references to the article's own structure ("Illustrates Section 4",
# "Sections 7–8", "figures 1 and 2", "Step 2") — navigational text whose
# digits are not claims about the transcript's content. Numbers may be
# decimal (3.3) or chained ("Sections 5.2 and 5.3", "Figures 1, 2, and 3").
_NUM = r"\d[\d,]*(?:\.\d+)*"
_REF_WORD = (r"(?:Sections?|Chapters?|Parts?|Steps?|Phases?|Stages?|Figures?"
             r"|Diagrams?|Patterns?|Tables?|Checkpoints?|Experiments?)")
CROSSREF_RE = re.compile(
    r"\b" + _REF_WORD + r"\s+" + _NUM +
    r"(?:\s*[–—-]\s*" + _NUM + r"|\s*,\s*" + _NUM + r"|\s+and\s+" + _NUM + r")*",
    re.IGNORECASE)
# Ordered-list enumerators ("4. **Run a baseline.**") — list structure,
# not content claims.
LIST_ENUM_RE = re.compile(r"^\s*\d+[.)]\s+")
MUSIC_WORDS = ("[music]", "[संगीत]")


# ---------------------------------------------------------------- context ----

class Ctx(object):
    def __init__(self, video_id, out_dir, meta, sources_text, trace, agent_defs):
        self.video_id = video_id
        self.out_dir = out_dir
        self.meta = meta or {}
        self.sources_text = sources_text
        self.trace = trace or []
        self.agent_defs = agent_defs or {}


def _load_json(path):
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError):
        return None


def build_ctx(video_id):
    out_dir = os.path.join(OUTPUT_DIR, video_id)
    if not os.path.isdir(out_dir):
        raise SystemExit(2, f"evaluate: no output dir for video {video_id}: {out_dir}")
    meta = _load_json(os.path.join(out_dir, "meta.json")) or {}
    parts = []
    for fn in ("transcript-raw.md", "transcript.md"):
        p = os.path.join(out_dir, fn)
        if os.path.isfile(p):
            with open(p, encoding="utf-8") as fh:
                parts.append(fh.read())
    if meta:
        parts.append(json.dumps(meta, ensure_ascii=False))
    trace = []
    tpath = os.path.join(TRACES_DIR, video_id, "trace.jsonl")
    if os.path.isfile(tpath):
        with open(tpath, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if line:
                    trace.append(json.loads(line))
    defs = {}
    agents_dir = os.path.join(ROOT, ".claude", "agents")
    if os.path.isdir(agents_dir):
        for fn in os.listdir(agents_dir):
            if fn.endswith(".md"):
                p = os.path.join(agents_dir, fn)
                defs[fn] = p
    return Ctx(video_id, out_dir, meta, "\n".join(parts), trace, defs)


# ------------------------------------------------------------- eval helpers --

def _nums(text):
    """All numbers in text, canonically as plain digits (commas stripped).
    A number followed by a multiplier word ("100 thousand", "97 मिलियन",
    "100K") also contributes its scaled value, so an article writing the
    quantity out as digits matches a transcript that separates the unit."""
    out = {m.group(0).replace(",", "") for m in NUM_RE.finditer(text)}
    for m in MULT_RE.finditer(text):
        val = float(m.group(1).replace(",", "")) * MULT_VAL[m.group(2).lower()]
        out.add(str(int(val)))
    for m in K_SUFFIX_RE.finditer(text):
        out.add(str(int(float(m.group(1).replace(",", "")) * 1000)))
    return out


def _prose_numbers(text):
    """Digits in body prose only — headings, TOC, Source metadata, and fenced
    code (mermaid diagram source) are excluded."""
    nums = set()
    in_fence = False
    in_toc = in_source = False
    for line in text.splitlines():
        if line.strip().startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if line.startswith("#"):
            in_toc = line.startswith("## Table of Contents")
            in_source = line.startswith("## Source")
            continue
        if in_toc or in_source:
            continue
        line = CROSSREF_RE.sub("", line)
        line = LIST_ENUM_RE.sub("", line)
        nums |= _nums(line)
    return nums


def _words(text):
    return len(text.split())


# -------------------------------------------------------------- article.md --

def _diagram_anchor(ctx, text, path):
    """Exactly one diagram anchor: the raw agent output carries the
    <!-- DIAGRAM-SLOT --> marker; the rendered article.md carries an embedded
    '## Diagrams' section instead (the marker is replaced at render time)."""
    lines = text.splitlines()
    slots = [l for l in lines if l.strip() == "<!-- DIAGRAM-SLOT -->"]
    has_section = any(l.strip() == "## Diagrams" for l in lines)
    if slots and has_section:
        return (False, "both DIAGRAM-SLOT marker and ## Diagrams section present")
    if not slots and not has_section:
        return (False, "no DIAGRAM-SLOT marker and no ## Diagrams section")
    kind = "DIAGRAM-SLOT marker" if slots else "## Diagrams section"
    h1 = next((i for i, l in enumerate(lines) if l.startswith("# ")), None)
    toc = next((i for i, l in enumerate(lines) if l.startswith("## Table of Contents")), None)
    anch = next((i for i, l in enumerate(lines) if l.strip() in ("<!-- DIAGRAM-SLOT -->", "## Diagrams")), None)
    if h1 is None or toc is None or anch is None or not (h1 < anch < toc):
        return (False, f"{kind} must sit between the H1 title and the Table of Contents")
    return (True, f"{kind} present once, between intro and Table of Contents")


def _headings_and_toc(ctx, text, path):
    """Numbered ## N. sections must be 1..N sequential and match the numbered
    Table of Contents entries exactly. ### N.M subsections must sit under the
    section of the same N and restart at .1. Unnumbered ## headings (Diagrams,
    Table of Contents, Key Takeaways, Source) and diagram-card headings inside
    the Diagrams section are ignored."""
    lines = text.splitlines()
    numbered_tops = []   # (num, title)
    current_top = None   # num of enclosing ## N. section, or None
    next_m = 1
    sub_issues = []

    def check_sub(n, m, title):
        nonlocal current_top, next_m
        if current_top is None or n != current_top:
            sub_issues.append(f"{n}.{m} {title!r} not under its numbered section (## {current_top})")
            return
        if m != next_m:
            sub_issues.append(f"{n}.{m} {title!r}: expected .{next_m}")
        next_m = m + 1

    for l in lines:
        m = re.match(r"^## (\d+)\. (.+)$", l)
        if m:
            numbered_tops.append((int(m.group(1)), m.group(2)))
            current_top = int(m.group(1))
            next_m = 1
            continue
        if l.startswith("## "):        # unnumbered top-level (Diagrams, TOC, ...)
            current_top = None
            next_m = 1
            continue
        m = re.match(r"^### (\d+)\.(\d+)\s+(.+)$", l)
        if m:
            check_sub(int(m.group(1)), int(m.group(2)), m.group(3))
            continue
        m = re.match(r"^### ", l)      # ### 1. diagram cards -> ignored
        if m:
            continue

    tops = numbered_tops
    if not tops or tops[0][0] != 1:
        return (False, f"numbered sections must start at 1; got {[t[0] for t in tops][:5]}")
    if [t[0] for t in tops] != list(range(1, len(tops) + 1)):
        return (False, f"section numbering not sequential: {[t[0] for t in tops]}")

    # TOC: numbered top-level entries between '## Table of Contents' and the
    # next top-level heading must match the numbered sections exactly.
    tocs = []
    seen = False
    for l in lines:
        if l.startswith("## Table of Contents"):
            seen = True
            continue
        if seen and l.startswith("## "):
            break
        if seen:
            m = TOC_ENTRY_RE.match(l)
            if m:
                tocs.append((int(m.group(1)), m.group(2)))
    if tocs != tops:
        return (False, f"TOC mismatch: entries {tocs[:5]}... != sections {tops[:5]}...")
    if sub_issues:
        return (False, "subsection issues: " + "; ".join(sub_issues[:3]))
    n_sub = sum(1 for l in lines if re.match(r"^### \d+\.\d+ ", l))
    return (True, f"{len(tops)} numbered sections match TOC; {n_sub} subsections numbered sequentially")


def _no_format_violations(ctx, text, path):
    problems = []
    if re.search(r"\[(\d{1,2}:\d{2})\]", text):
        problems.append("timestamp remnant like [00:12:34]")
    if "[music]" in text.lower() or "[संगीत]" in text:
        problems.append("music marker")
    # Fence interiors are mermaid source, not article markup: arrows like
    # "<-->" and timestamp-like labels are legitimate there, so only check
    # content outside code fences (fence balance itself is checked below).
    in_fence = False
    for l in text.splitlines():
        if l.strip().startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if "<" in l and not re.match(r"^\s*<!--.*-->\s*$", l):
            problems.append(f"HTML-like tag: {l[:60]!r}")
            break
    for l in text.splitlines():
        if l.strip().startswith("```"):
            continue
        if l.startswith("|"):
            problems.append("Markdown table row")
            break
    if text.count("```") % 2 != 0:
        problems.append("unbalanced code fences")
    return (not problems, "; ".join(problems) if problems else "no timestamps, music markers, HTML, tables, or broken fences")


def _devanagari_free(ctx, text, path):
    n = len(DEVA_NAGARI.findall(text))
    return (n == 0, f"{n} Devanagari character(s) in output (article must be English)")


def _required_sections(ctx, text, path):
    missing = []
    for sec in ("## Key Takeaways", "## Source", "## Table of Contents"):
        if sec not in text:
            missing.append(sec)
    lines = text.splitlines()
    anchor = next((i for i, l in enumerate(lines)
                   if l.strip() in ("<!-- DIAGRAM-SLOT -->", "## Diagrams")), None)
    toc = next((i for i, l in enumerate(lines) if l.startswith("## Table of Contents")), None)
    first = next((i for i, l in enumerate(lines) if re.match(r"^## 1\. ", l)), None)
    order_ok = anchor is not None and toc is not None and first is not None \
        and anchor < toc < first
    if missing or not order_ok:
        return (False, "missing sections: %s; anchor/TOC/first-section ordering wrong"
                % (missing or "none"))
    return (True, "intro, diagram anchor, TOC, and closing sections present in order")


def _scale(ctx, text, path):
    n = _words(text)
    ok = 1500 <= n <= 9000
    band = "1500-9000"
    return (ok, f"{n} words (expected ~2500-5000 for a ~20-min video; sanity band {band})")


def _captions_note(ctx, text, path):
    meta = ctx.meta
    src = meta.get("source_lang", "en")
    if meta.get("lang_source") == "transcribed" and src != "en":
        src_section = text.split("## Source", 1)[-1]
        ok = ("pipeline" in src_section
              and re.search(r"translated|transcribed", src_section, re.I)
              and (re.search(r"hindi", src_section, re.I) or src in src_section))
        return (ok, "Source section notes caption translation from Hindi by the pipeline" if ok
                else "Source section must note captions were translated from the source language by this pipeline")
    return (True, "English captions; no translation note required")


def _numbers_traceable(ctx, text, path):
    missing = sorted(_prose_numbers(text) - _nums(ctx.sources_text))
    return (not missing, "every number in the article appears in the transcript/meta"
            if not missing else f"numbers not found in transcript: {missing}")


def _trace_present(ctx, text, path):
    rel = os.path.relpath(path, ROOT)
    if not ctx.trace:
        return (False, "no trace recorded for this video — run pipeline/trace.py record")
    covered = [ev for ev in ctx.trace if (ev.get("outputs") or []) and any(o["path"] == rel for o in ev["outputs"])]
    if not covered:
        return (False, f"no traced run lists {rel} as an output")
    run = covered[-1]
    return (True, f"output traced by run {run['run_id']} (agent={run.get('agent')}, status={run.get('status')})")


def _word_count_sane(ctx, text, path):
    n = _words(text)
    return (n > 0, f"{n} words")


# -------------------------------------------------------------- diagrams.md -

def _mermaid_ok(ctx, text, path):
    fences = [l for l in text.splitlines() if l.startswith("```")]
    ok = len(fences) % 2 == 0 and any("mermaid" in f for f in fences)
    return (ok, f"{len(fences)} fences, mermaid blocks present" if ok
            else f"diagram source problem: {len(fences)} fences, mermaid markers: {any('mermaid' in f for f in fences)}")


EVALS = [
    {"name": "diagram_anchor", "patterns": ["article.md"], "fn": _diagram_anchor},
    {"name": "headings_and_toc", "patterns": ["article.md"], "fn": _headings_and_toc},
    # agent-written markdown only; transcript-raw.md legitimately holds timestamp/music markers
    {"name": "no_format_violations", "patterns": ["article.md", "diagrams.md"], "fn": _no_format_violations},
    {"name": "devanagari_free", "patterns": ["article.md"], "fn": _devanagari_free},
    {"name": "required_sections", "patterns": ["article.md"], "fn": _required_sections},
    {"name": "scale", "patterns": ["article.md"], "fn": _scale},
    {"name": "captions_note", "patterns": ["article.md"], "fn": _captions_note},
    {"name": "numbers_traceable", "patterns": ["article.md"], "fn": _numbers_traceable},
    {"name": "trace_present", "patterns": ["article.md", "diagrams.md"], "fn": _trace_present},
    {"name": "word_count_sane", "patterns": ["article.md"], "fn": _word_count_sane},
    {"name": "mermaid_ok", "patterns": ["diagrams.md"], "fn": _mermaid_ok},
]


def _load_plugins():
    if not os.path.isdir(PLUGIN_DIR):
        return []
    out = []
    for fn in sorted(os.listdir(PLUGIN_DIR)):
        if not fn.endswith(".py") or fn.startswith("_"):
            continue
        mod_name = "eval_plugin_" + fn[:-3]
        spec = importlib.util.spec_from_file_location(mod_name, os.path.join(PLUGIN_DIR, fn))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        out.extend(getattr(mod, "EVALS", []))
    return out


def _match(pattern, path):
    if "*" in pattern:
        return re.match("^" + re.escape(pattern).replace(r"\*", ".*") + "$", path) is not None
    return pattern == path


def main():
    ap = argparse.ArgumentParser(description="Run evals over pipeline agent outputs.")
    ap.add_argument("video_id")
    ap.add_argument("--artifact", help="limit to one artifact filename (e.g. article.md)")
    args = ap.parse_args()

    ctx = build_ctx(args.video_id)
    evals = EVALS + _load_plugins()
    results = []
    for ev in evals:
        for fn in sorted(os.listdir(ctx.out_dir)):
            if not re.match(r".+\.(md|html|json)$", fn):
                continue
            if not any(_match(p, fn) for p in ev["patterns"]):
                continue
            if args.artifact and fn != args.artifact:
                continue
            path = os.path.join(ctx.out_dir, fn)
            with open(path, encoding="utf-8") as fh:
                text = fh.read()
            try:
                passed, detail = ev["fn"](ctx, text, path)
            except Exception as exc:  # eval bugs must not crash the whole run
                passed, detail = False, f"eval crashed: {exc!r}"
            results.append({"name": ev["name"], "artifact": fn, "passed": bool(passed), "detail": detail})
            flag = "PASS" if passed else "FAIL"
            print(f"{flag}  {ev['name']:<22} {fn:<14} {detail}")

    if not results:
        print(f"evaluate: no eval matched any artifact in pipeline/output/{args.video_id}/")
        return 0

    n_pass = sum(1 for r in results if r["passed"])
    n_fail = len(results) - n_pass
    print(f"\n{args.video_id}: {n_pass} passed, {n_fail} failed, {len(results)} evals run")

    out_dir = os.path.join(EVALS_DIR, args.video_id)
    os.makedirs(out_dir, exist_ok=True)
    record = {
        "schema": "evals.v1",
        "video_id": args.video_id,
        "ts": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
        "results": results,
    }
    with open(os.path.join(out_dir, "evals.jsonl"), "a", encoding="utf-8") as fh:
        fh.write(json.dumps(record, ensure_ascii=False, sort_keys=True) + "\n")
    return 1 if n_fail else 0


if __name__ == "__main__":
    sys.exit(main())
