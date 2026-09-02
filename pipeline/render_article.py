#!/usr/bin/env python3
"""Render a pipeline article folder into a single self-contained article.html.

Usage:
    python3 pipeline/render_article.py pipeline/output/<video-id>

Reads meta.json, article.md, diagrams.html from the folder and writes
article.html: the rendered article with a toggle between the Mermaid diagrams
(rendered client-side from a pinned CDN) and the interactive HTML workflow view
(the <body> of diagrams.html). The renderer only assembles — agents own all
content. Idempotent: overwrites article.html, never touches article.md.

Exit codes (sysexits-style):
    65  article.md still contains <!-- DIAGRAM-SLOT --> (diagram stage not run)
    66  a required input file is missing
"""

import html
import json
import re
import sys
from pathlib import Path

MERMAID_CDN = "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js"

HEADING_RE = re.compile(r"^(#{1,3})\s+(.*?)\s*#*\s*$")
FENCE_RE = re.compile(r"^```(.*)$")
DIAGRAMS_H2_RE = re.compile(r"^##\s+Diagrams\s*$", re.MULTILINE | re.IGNORECASE)
MERMAID_BLOCK_RE = re.compile(r"```mermaid\s*\n([\s\S]*?)```")
SLUG_RE = re.compile(r"[^a-z0-9]+")


def slugify(text):
    return SLUG_RE.sub("-", text.lower()).strip("-")


def inline(text):
    """Escape then apply code, bold, italic, links."""
    text = html.escape(text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r'<a href="\2">\1</a>', text)
    return text


def render_table(lines):
    """Render a GFM table; the second line is the |---| separator."""
    if len(lines) < 2:
        return None
    header = [c.strip() for c in lines[0].strip().strip("|").split("|")]
    if not all(re.match(r"^:?-{2,}:?$", c.strip()) for c in lines[1].strip().strip("|").split("|")):
        return None
    parts = ["<table>", "<thead><tr>"]
    parts.extend("<th>%s</th>" % inline(c) for c in header)
    parts.append("</tr></thead><tbody>")
    for row in lines[2:]:
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        parts.append("<tr>")
        parts.extend("<td>%s</td>" % inline(c) for c in cells[: len(header)])
        parts.append("</tr>")
    parts.append("</tbody></table>")
    return "".join(parts)


def render_group(lines):
    """Render one block group (consecutive non-blank lines)."""
    first = lines[0]
    if first.startswith("|") and "|" in first:
        table = render_table(lines)
        if table is not None:
            return table
    if first.startswith(">"):
        content = "\n".join(l.lstrip("> ").strip() for l in lines)
        return "<blockquote>%s</blockquote>" % inline(content)
    if all(l.startswith(("- ", "* ")) for l in lines):
        items = "".join("<li>%s</li>" % inline(l[2:].strip()) for l in lines)
        return "<ul>%s</ul>" % items
    if all(re.match(r"^\d+\.\s", l) for l in lines):
        items = "".join(
            "<li>%s</li>" % inline(re.sub(r"^\d+\.\s", "", l).strip()) for l in lines
        )
        return "<ol>%s</ol>" % items
    return "<p>%s</p>" % inline(" ".join(l.strip() for l in lines))


def render_body(markdown):
    """Line-based block renderer. Returns (body_html, mermaid_figures_html)."""
    body_parts = []
    figures = []
    current_figure = None  # (caption, [mermaid sources])

    in_fence = False
    fence_lang = ""
    fence_buf = []
    group = []

    def flush_group():
        nonlocal group
        if group:
            body_parts.append(render_group(group))
            group = []

    for raw in markdown.split("\n"):
        line = raw.rstrip()
        if in_fence:
            if FENCE_RE.match(line):
                code = "\n".join(fence_buf)
                if fence_lang.lower() == "mermaid":
                    # attach to the pending figure (caption set by a preceding ###)
                    if current_figure is not None:
                        current_figure[1].append(code)
                    else:
                        current_figure = ("", [code])
                else:
                    body_parts.append(
                        "<pre><code>%s</code></pre>" % html.escape(code)
                    )
                in_fence = False
                continue
            fence_buf.append(raw)
            continue

        fence_match = FENCE_RE.match(line)
        if fence_match:
            flush_group()
            in_fence = True
            fence_lang = fence_match.group(1).strip()
            fence_buf = []
            continue

        if not line.strip():
            flush_group()
            continue

        heading = HEADING_RE.match(line)
        if heading:
            flush_group()
            level, title = int(len(heading.group(1))), heading.group(2).strip()
            if level == 3 and current_figure is not None:
                # A new ### while a figure is pending: a mermaid block was
                # missing after the previous caption. Close it as caption-only.
                current_figure = None
            if level == 3:
                current_figure = [title, []]
            else:
                current_figure = None
                if level == 2:
                    body_parts.append(
                        '<h2 id="%s">%s</h2>' % (slugify(title), inline(title))
                    )
                else:
                    body_parts.append(
                        '<h1 id="%s">%s</h1>' % (slugify(title), inline(title))
                    )
            continue

        if re.match(r"^(-{3,}|\*{3,})$", line):
            flush_group()
            body_parts.append("<hr>")
            continue

        group.append(raw)

    if in_fence:  # unbalanced fence in input
        body_parts.append("<pre><code>%s</code></pre>" % html.escape("\n".join(fence_buf)))
    flush_group()

    # Close out the pending figure, if any.
    for caption, sources in ([current_figure] if current_figure else []):
        for code in sources:
            figures.append((caption, code))
    return "\n".join(body_parts), figures


def split_diagrams_section(markdown):
    """Cut the `## Diagrams` section out of the article body.

    Returns (body_md, diagrams_md). diagrams_md is None if no such section.
    """
    match = DIAGRAMS_H2_RE.search(markdown)
    if match is None:
        return markdown, None
    rest = markdown[match.end():]
    next_h2 = re.search(r"^##\s", rest, re.MULTILINE)
    end = next_h2.start() if next_h2 else len(rest)
    body = markdown[: match.start()] + rest[end:]
    return body, rest[:end]


def figures_from_diagrams_md(diagrams_md):
    """Extract (caption, [mermaid codes]) from the Diagrams section source."""
    figures = []
    current_caption = ""
    for block in MERMAID_BLOCK_RE.finditer(diagrams_md):
        caption = current_caption
        figures.append((caption, block.group(1)))
    # Captions: map ### headings to following figures by order of appearance.
    captions = [
        m.group(1).strip()
        for m in re.finditer(r"^###\s+(.*?)\s*$", diagrams_md, re.MULTILINE)
    ]
    for index, caption in enumerate(captions):
        if index < len(figures):
            figures[index] = (caption, figures[index][1])
    return figures


def extract_workflow_body(html_text):
    """Return everything between <body> and </body> of diagrams.html."""
    match = re.search(
        r"<body[^>]*>(.*)</body>", html_text, re.DOTALL | re.IGNORECASE
    )
    return match.group(1) if match else ""


def extract_styles(html_text):
    """Return the contents of all <style> blocks in diagrams.html."""
    return re.findall(r"<style[^>]*>(.*?)</style>", html_text, re.DOTALL | re.IGNORECASE)


def scope_css(css_text, scope="#view-workflow"):
    """Prefix every selector with a scope so the diagrams' styles cannot leak
    into the article layout (the diagrams use globals like *, body, a).
    At-rules are kept; media-ish at-rule bodies are scoped recursively, while
    @keyframes/@font-face bodies (whose contents are not selectors) are not."""
    out = []
    i = 0
    n = len(css_text)
    passthrough = ("@keyframes", "@font-face", "@page", "@import", "@charset", "@namespace")
    while i < n:
        brace = css_text.find("{", i)
        if brace == -1:
            out.append(css_text[i:])
            break
        head = css_text[i:brace].strip()
        depth = 1
        j = brace + 1
        while j < n and depth > 0:
            if css_text[j] == "{":
                depth += 1
            elif css_text[j] == "}":
                depth -= 1
            j += 1
        body = css_text[brace + 1 : j - 1]
        if head.startswith("@"):
            if head.startswith(passthrough):
                out.append(head + "{" + body + "}")
            else:
                out.append(head + "{" + scope_css(body, scope) + "}")
        else:
            selectors = [s.strip() for s in head.split(",")]
            scoped = ", ".join(scope + " " + s for s in selectors if s)
            out.append(scoped + "{" + body + "}")
        i = j
    return "\n".join(out)


def figure_html(figures):
    parts = []
    for caption, code in figures:
        parts.append("<figure>")
        parts.append('<pre class="mermaid">%s</pre>' % html.escape(code))
        parts.append(
            "<details><summary>Source</summary><pre><code>%s</code></pre></details>"
            % html.escape(code)
        )
        if caption:
            parts.append("<figcaption>%s</figcaption>" % inline(caption))
        parts.append("</figure>")
    return "\n".join(parts)


PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>
:root {{
  --bg: #0b101c; --panel: #141b2d; --panel-2: #1a2338; --text: #e9edf6;
  --muted: #94a0b8; --accent: #6ea8fe; --accent-2: #a78bfa; --good: #34d399;
  --warn: #fbbf24; --bad: #f87171; --border: #273349;
}}
* {{ box-sizing: border-box; }}
body {{
  margin: 0; background: var(--bg); color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
               "Helvetica Neue", Arial, sans-serif;
  line-height: 1.65;
}}
article {{ max-width: 72ch; margin: 0 auto; padding: 4rem 1.5rem 6rem; }}
article > header {{ margin-bottom: 3rem; }}
article > header .kicker {{
  color: var(--accent); text-transform: uppercase; letter-spacing: .12em;
  font-size: .8rem; margin: 0 0 .6rem;
}}
article > header h1 {{
  margin: 0 0 .6rem; font-size: clamp(1.8rem, 4vw, 2.6rem); line-height: 1.2;
}}
article > header .meta {{ color: var(--muted); font-size: .9rem; }}
article > header .meta a {{ color: var(--accent); }}
h2 {{ margin-top: 2.6rem; border-bottom: 1px solid var(--border); padding-bottom: .4rem; }}
h3 {{ margin-top: 1.8rem; }}
code {{ background: var(--panel); border: 1px solid var(--border);
       border-radius: 4px; padding: .1em .35em; font-size: .9em; }}
pre {{ background: var(--panel); border: 1px solid var(--border);
      border-radius: 8px; padding: 1rem; overflow-x: auto; }}
pre code {{ background: none; border: none; padding: 0; }}
blockquote {{ margin: 1.2rem 0; padding: .6rem 1.2rem;
              border-left: 3px solid var(--accent-2);
              background: var(--panel); border-radius: 0 8px 8px 0; }}
blockquote p {{ margin: .3rem 0; }}
table {{ border-collapse: collapse; width: 100%; margin: 1.2rem 0; }}
th, td {{ border: 1px solid var(--border); padding: .5rem .8rem; text-align: left; }}
th {{ background: var(--panel-2); color: var(--accent);
     text-transform: uppercase; font-size: .75rem; letter-spacing: .08em; }}
hr {{ border: none; border-top: 1px solid var(--border); margin: 2.5rem 0; }}
section#diagrams {{ margin-top: 3rem; }}
#diagram-switch {{ display: flex; gap: .5rem; margin-bottom: 1.5rem; }}
.view-btn {{
  background: var(--panel); color: var(--muted); border: 1px solid var(--border);
  border-radius: 999px; padding: .45rem 1.1rem; cursor: pointer;
  font: inherit; font-size: .85rem;
}}
.view-btn.active {{ background: var(--panel-2); color: var(--text);
                    border-color: var(--accent); }}
figure {{ margin: 1.8rem 0; }}
figure figcaption {{ color: var(--muted); font-size: .85rem; margin-top: .5rem; }}
figure details {{ margin-top: .6rem; color: var(--muted); font-size: .85rem; }}
#mermaid-errors {{ color: var(--bad); background: var(--panel);
                   border: 1px solid var(--bad); border-radius: 8px;
                   padding: 1rem; white-space: pre-wrap; }}
/* diagrams.html styles, scoped to the workflow view */
{workflow_styles}
</style>
</head>
<body>
<article>
<header>
  <p class="kicker">{kicker}</p>
  <h1>{title}</h1>
  <p class="meta">{meta_line}</p>
</header>
{body_html}
<section id="diagrams">
  <h2>Diagrams</h2>
  <div id="diagram-switch">
    <button class="view-btn active" data-view="mermaid">Mermaid</button>
    <button class="view-btn" data-view="workflow">Interactive</button>
  </div>
  <div id="view-mermaid">{mermaid_figures}</div>
  <div id="view-workflow" hidden>{workflow_body}</div>
  <pre id="mermaid-errors" hidden></pre>
</section>
</article>
<script src="{mermaid_cdn}"></script>
<script>
mermaid.initialize({{
  startOnLoad: false,
  theme: "dark",
  securityLevel: "strict",
  themeVariables: {{
    background: "#141b2d", primaryColor: "#1a2338", primaryTextColor: "#e9edf6",
    primaryBorderColor: "#6ea8fe", lineColor: "#94a0b8",
    secondaryColor: "#141b2d", tertiaryColor: "#0b101c"
  }}
}});
mermaid.parseError = function (err) {{
  var el = document.getElementById("mermaid-errors");
  if (el) {{ el.hidden = false; el.textContent += err.str + "\\n"; }}
}};
document.addEventListener("DOMContentLoaded", function () {{
  mermaid.run().catch(function (e) {{ console.error(e); }});
}});
document.querySelectorAll("#diagram-switch .view-btn").forEach(function (btn) {{
  btn.addEventListener("click", function () {{
    var v = btn.dataset.view;
    document.querySelectorAll("#diagram-switch .view-btn").forEach(function (x) {{
      x.classList.toggle("active", x === btn);
    }});
    document.getElementById("view-mermaid").hidden = v !== "mermaid";
    document.getElementById("view-workflow").hidden = v !== "workflow";
  }});
}});
</script>
</body>
</html>
"""


def main(argv=None):
    if len(argv or sys.argv[1:]) != 1:
        print("Usage: render_article.py <output-dir>", file=sys.stderr)
        return 64
    out_dir = Path((argv or sys.argv[1:])[0]).resolve()

    meta_path = out_dir / "meta.json"
    article_path = out_dir / "article.md"
    diagrams_path = out_dir / "diagrams.html"
    for path in (meta_path, article_path, diagrams_path):
        if not path.exists():
            print("ERROR [66]: missing input file: %s" % path, file=sys.stderr)
            return 66

    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    article_md = article_path.read_text(encoding="utf-8")
    diagrams_html = diagrams_path.read_text(encoding="utf-8")

    if "<!-- DIAGRAM-SLOT -->" in article_md:
        print(
            "ERROR [65]: article.md still contains <!-- DIAGRAM-SLOT --> — "
            "the diagram stage has not been run. Re-spawn Agent(diagram-maker) "
            "for this video first.",
            file=sys.stderr,
        )
        return 65

    body_md, diagrams_md = split_diagrams_section(article_md)
    if diagrams_md is None:
        print(
            "WARNING: no '## Diagrams' section found in article.md — the "
            "article will render without the diagram toggle.",
            file=sys.stderr,
        )
        figures = []
    else:
        figures = figures_from_diagrams_md(diagrams_md)
        block_count = len(MERMAID_BLOCK_RE.findall(article_md))
        if block_count != len(figures):
            print(
                "WARNING: mermaid block count in article.md (%d) differs from "
                "captions found (%d) — check the Diagrams section."
                % (block_count, len(figures)),
                file=sys.stderr,
            )

    body_html, _ = render_body(body_md)
    workflow_body = extract_workflow_body(diagrams_html)
    if not workflow_body.strip():
        print(
            "WARNING: could not extract <body> content from diagrams.html — "
            "the Interactive view will be empty.",
            file=sys.stderr,
        )
    workflow_styles = scope_css("\n".join(extract_styles(diagrams_html)))

    kicker = meta.get("channel") or "YouTube"
    title = meta.get("title") or "Article"
    meta_bits = []
    if meta.get("url"):
        meta_bits.append('<a href="%s">Watch on YouTube</a>' % meta["url"])
    if meta.get("channel"):
        meta_bits.append(meta["channel"])
    if meta.get("fetched_at"):
        meta_bits.append("Transcript fetched %s" % meta["fetched_at"][:10])
    lang_note = ""
    lang_source = meta.get("lang_source")
    source_lang = meta.get("source_lang")
    if lang_source == "transcribed" and source_lang and source_lang != "en":
        lang_note = "Translated from %s by this pipeline." % source_lang
    elif lang_source in ("auto-generated", "translated"):
        lang_note = "Captions are auto-generated." if lang_source == "auto-generated" \
            else "Captions are auto-translated."
    if lang_note:
        meta_bits.append(lang_note)
    meta_line = " &middot; ".join(meta_bits)

    page = PAGE_TEMPLATE.format(
        title=html.escape(title),
        kicker=html.escape(kicker),
        meta_line=meta_line,
        body_html=body_html,
        mermaid_figures=figure_html(figures),
        workflow_body=workflow_body,
        workflow_styles=workflow_styles,
        mermaid_cdn=MERMAID_CDN,
    )
    (out_dir / "article.html").write_text(page, encoding="utf-8")

    print(
        json.dumps(
            {
                "article_html": str(out_dir / "article.html"),
                "mermaid_blocks": len(figures),
                "status": "ok",
            }
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
