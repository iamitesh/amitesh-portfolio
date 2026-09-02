"""Example plugin: drop a module like this into pipeline/evals/plugins/ to add
evals without editing pipeline/evaluate.py. Each module must define EVALS, a
list of {"name", "patterns", "fn"} entries. fn(ctx, text, rel_path) returns
(passed: bool, detail: str).

ctx carries: video_id, out_dir, meta (meta.json dict), sources_text
(transcript + meta text), trace (list of run events), agent_defs.
"""


def _html_is_self_contained(ctx, text, path):
    """article.html must not reference local files (pipeline artifacts are
    self-contained by design, see pipeline/USER_GUIDE.md)."""
    refs = [l.strip() for l in text.splitlines() if "src=" in l and not l.strip().startswith("//")]
    bad = [r for r in refs if "data:" not in r and "https://" not in r and "http://" not in r]
    return (not bad, f"{len(refs)} asset reference(s), all external/data" if not bad else f"local asset refs: {bad}")


EVALS = [
    {"name": "html_self_contained", "patterns": ["article.html", "slides.html"], "fn": _html_is_self_contained},
]
