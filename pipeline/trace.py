#!/usr/bin/env python3
"""Trace recorder for the YouTube learning pipeline — provenance for agent runs.

Every agent invocation (article-writer, diagram-maker, slide-builder, and the
deterministic fetch/render scripts) is recorded as one JSON object on a line of:

    pipeline/traces/<video-id>/trace.jsonl

The orchestrator (the /pipeline driver in Claude Code) records the event AFTER
the agent call returns, passing the real started/finished timestamps it took
around the call. Inputs and outputs are sha256-hashed so artifacts can later be
checked for drift; evals in pipeline/evaluate.py consume these records.

Usage:
    python3 pipeline/trace.py record --video-id bsmUh5bTNZ4 \
        --agent article-writer --phase article --status ok \
        --input pipeline/output/bsmUh5bTNZ4/transcript.md \
        --input pipeline/output/bsmUh5bTNZ4/meta.json \
        --output pipeline/output/bsmUh5bTNZ4/article.md \
        --agent-def .claude/agents/article-writer.md \
        --check diagram_slot=1 --check headings_and_toc=1 \
        --started-at 2026-09-02T16:28:00 --finished-at 2026-09-02T16:38:00 \
        --note "..."

    python3 pipeline/trace.py report bsmUh5bTNZ4
"""
import argparse
import datetime
import hashlib
import json
import os
import re
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRACES_DIR = os.path.join(ROOT, "pipeline", "traces")


def _now_iso():
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def _file_meta(path):
    p = path if os.path.isabs(path) else os.path.join(ROOT, path)
    if not os.path.isfile(p):
        raise SystemExit(f"trace: input/output file not found: {p}")
    h = hashlib.sha256()
    with open(p, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return {
        "path": os.path.relpath(p, ROOT),
        "sha256": h.hexdigest(),
        "bytes": os.path.getsize(p),
    }


def _parse_check(spec):
    """'name=1' / 'name=0' / 'name=pass' / 'name=fail' -> (name, bool)."""
    m = re.match(r"^(.+?)=(1|true|pass|0|false|fail)$", spec.strip())
    if not m:
        raise SystemExit(f"trace: --check must be name=1|0, got: {spec!r}")
    return m.group(1), m.group(2) in ("1", "true", "pass")


def _record(args):
    run_id = args.run_id or f"{args.agent}-{int(time.time())}"
    if not re.match(r"^[A-Za-z0-9._-]+$", run_id):
        raise SystemExit("trace: run_id may only contain [A-Za-z0-9._-]")

    event = {
        "schema": "trace.v1",
        "event": "run",
        "video_id": args.video_id,
        "run_id": run_id,
        "agent": args.agent,
        "phase": args.phase or args.agent,
        "model": args.model,
        "task": args.task,
        "status": args.status,  # "ok" | "failed"
        "started_at": args.started_at or _now_iso(),
        "finished_at": args.finished_at or _now_iso(),
        "inputs": [_file_meta(p) for p in args.input] or None,
        "outputs": [_file_meta(p) for p in args.output] or None,
        "checks": [{"name": n, "passed": b} for n, b in (_parse_check(c) for c in args.check)] or None,
        "note": args.note,
    }
    if args.agent_def:
        event["agent_def_sha256"] = _file_meta(args.agent_def)["sha256"]

    out_dir = os.path.join(TRACES_DIR, args.video_id)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "trace.jsonl")
    with open(out_path, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(event, ensure_ascii=False, sort_keys=True) + "\n")

    print(f"trace: recorded run {run_id} (agent={args.agent}, status={args.status}, "
          f"outputs={len(args.output)}) -> {os.path.relpath(out_path, ROOT)}")


def _report(args):
    log_dir = os.path.join(TRACES_DIR, args.video_id) if args.video_id else TRACES_DIR
    if not os.path.isdir(log_dir):
        print(f"trace: no runs recorded under {os.path.relpath(log_dir, ROOT)}")
        return
    rows = []
    for root, _dirs, files in os.walk(log_dir):
        for fn in files:
            if not fn.endswith(".jsonl"):
                continue
            with open(os.path.join(root, fn), encoding="utf-8") as fh:
                for line in fh:
                    line = line.strip()
                    if not line:
                        continue
                    ev = json.loads(line)
                    if ev.get("event") != "run":
                        continue
                    outs = ev.get("outputs") or []
                    rows.append((ev["video_id"], ev["run_id"], ev["agent"],
                                 ev.get("phase", ""), ev.get("status", "?"),
                                 ev.get("started_at", "?")[:19], ev.get("finished_at", "?")[:19],
                                 ",".join(o["path"] for o in outs), ev.get("note", "")))
    if not rows:
        print(f"trace: no runs recorded under {os.path.relpath(log_dir, ROOT)}")
        return
    header = ("video_id", "run_id", "agent", "phase", "status", "started_at", "finished_at", "outputs", "note")
    widths = [max(len(str(r[i])) for r in rows + [header]) for i in range(len(header))]
    print("  ".join(h.ljust(widths[i]) for i, h in enumerate(header)))
    for r in rows:
        print("  ".join(str(c).ljust(widths[i]) for i, c in enumerate(r)))


def main():
    ap = argparse.ArgumentParser(description="Record provenance traces for pipeline agent runs.")
    sub = ap.add_subparsers(dest="cmd", required=True)

    rp = sub.add_parser("record", help="record one completed agent run")
    rp.add_argument("--video-id", required=True)
    rp.add_argument("--agent", required=True, help="agent name or script, e.g. article-writer")
    rp.add_argument("--phase", help="pipeline phase (fetch/article/diagram/slide/render)")
    rp.add_argument("--run-id", help="defaults to <agent>-<unix-ts>")
    rp.add_argument("--model", help="model used (optional)")
    rp.add_argument("--task", help="short description of the task given")
    rp.add_argument("--status", choices=["ok", "failed"], default="ok")
    rp.add_argument("--input", action="append", default=[], help="input file path (repeatable)")
    rp.add_argument("--output", action="append", default=[], help="output file path (repeatable)")
    rp.add_argument("--agent-def", help="path to the .claude/agents/*.md definition to hash")
    rp.add_argument("--check", action="append", default=[], help="self-check result name=1|0 (repeatable)")
    rp.add_argument("--started-at", help="ISO timestamp when the run started")
    rp.add_argument("--finished-at", help="ISO timestamp when the run finished")
    rp.add_argument("--note")
    rp.set_defaults(func=_record)

    sp = sub.add_parser("report", help="list recorded runs")
    sp.add_argument("video_id", nargs="?")
    sp.set_defaults(func=_report)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
