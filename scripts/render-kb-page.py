#!/usr/bin/env python3
"""Render a pipeline article folder into a Knowledge Base page.tsx.

Usage:
    python3 scripts/render-kb-page.py pipeline/output/<video-id> <slug> [--fragment]

Reads meta.json and article.md from the folder and writes
app/knowledge-base/<slug>/page.tsx: the article restructured into the
Knowledge Base design system (topbar, article header, TOC, kickered sections,
panels, quotes, checklists) with the article's mermaid diagrams attached to the
sections they illustrate ("Illustrates Section N" in the diagram description).

With --fragment, emits only the <section> markup (no page wrapper) for manual
composition into an existing page, and accepts --kicker to prefix each
section kicker ("Part 01" by default).

The script only assembles — agents own all content. Idempotent: overwrites
page.tsx, never touches article.md.

Exit codes (sysexits-style):
    64  usage error
    66  a required input file is missing
"""

import argparse
import html
import json
import re
import sys
from pathlib import Path

SLUG_RE = re.compile(r"[^a-z0-9]+")
INLINE_RE = re.compile(
    r"(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|(?<!\*)\*[^*\n]+\*(?!\*))"
)
SECTION_REF_RE = re.compile(r"Section\s+(\d+)", re.IGNORECASE)


def slugify(text):
    return SLUG_RE.sub("-", text.lower()).strip("-")


def ts_literal(text):
    """Emit text as a bare TS template literal (for array elements etc.)."""
    return "`%s`" % text.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def jsx_text(text):
    """Emit text as a JSX expression (template literal in braces)."""
    return "{%s}" % ts_literal(text)


def inline_jsx(text):
    """Convert markdown inline formatting to JSX segments."""
    out = []
    pos = 0
    for match in INLINE_RE.finditer(text):
        if match.start() > pos:
            out.append(jsx_text(text[pos : match.start()]))
        token = match.group(0)
        if token.startswith("**"):
            out.append("<strong>%s</strong>" % inline_jsx(token[2:-2]))
        elif token.startswith("`"):
            out.append("<code>%s</code>" % jsx_text(token[1:-1]))
        elif token.startswith("["):
            label, _, url = token[1:-1].partition("](")
            out.append(
                '<a href="%s">%s</a>'
                % (html.escape(url, quote=True), inline_jsx(label))
            )
        else:
            out.append("<em>%s</em>" % inline_jsx(token[1:-1]))
        pos = match.end()
    if pos < len(text):
        out.append(jsx_text(text[pos:]))
    return "".join(out)


class Figure:
    def __init__(self, title, description, code):
        self.title = title
        self.description = description
        self.code = code
        self.refs = {int(n) for n in SECTION_REF_RE.findall(description)}


class Block:
    def __init__(self, kind, payload):
        self.kind = kind  # p | bullets | ordered | quote | h3 | diagram
        self.payload = payload


class Section:
    def __init__(self, number, title):
        self.number = number
        self.title = title
        self.blocks = []


class Article:
    def __init__(self):
        self.title = ""
        self.intro = []
        self.figures = []
        self.orphans = []
        self.sections = []
        self.takeaways = []
        self.video = {"title": "", "url": "", "channel": "", "channel_url": "", "fetched_at": ""}


def parse_diagrams(lines, start, stop):
    """Parse the ## Diagrams block: ### captions + optional mermaid fences."""
    figures = []
    current_title = None
    description = []
    code_lines = []
    in_fence = False
    for raw in lines[start:stop]:
        line = raw.strip()
        if line.startswith("### "):
            if current_title is not None:
                figures.append((current_title, description, code_lines))
            current_title = line[4:].strip()
            description = []
            code_lines = []
            in_fence = False
        elif line.startswith("```"):
            in_fence = not in_fence
        elif in_fence and current_title is not None:
            code_lines.append(line)
        elif current_title is not None and line:
            description.append(line)
    if current_title is not None:
        figures.append((current_title, description, code_lines))
    return [Figure(t, " ".join(d), "\n".join(c)) for t, d, c in figures if c]


def parse_article(path):
    lines = path.read_text(encoding="utf-8").splitlines()
    article = Article()

    # Locate the structural ## headings.
    diagrams_i = toc_i = takeaways_i = source_i = None
    title_i = None
    for i, line in enumerate(lines):
        match = re.match(r"^#\s+(.*?)\s*$", line)
        if match:
            article.title = match.group(1)
            title_i = i
            continue
        match = re.match(r"^##\s+(.*?)\s*$", line)
        if match:
            name = match.group(1).strip().lower()
            if name == "diagrams":
                diagrams_i = i
            elif name == "table of contents":
                toc_i = i
            elif name == "key takeaways":
                takeaways_i = i
            elif name == "source":
                source_i = i

    # Intro: everything between the title and ## Diagrams.
    if title_i is not None:
        intro_end = diagrams_i if diagrams_i is not None else len(lines)
        article.intro = [l.strip() for l in lines[title_i + 1 : intro_end] if l.strip()]

    if diagrams_i is not None:
        end = toc_i if toc_i is not None else len(lines)
        article.figures = parse_diagrams(lines, diagrams_i + 1, end)

    # Body sections between the TOC (or Diagrams) and Key Takeaways.
    body_start = toc_i + 1 if toc_i is not None else (diagrams_i + 1 if diagrams_i is not None else 0)
    body_end = takeaways_i if takeaways_i is not None else (source_i if source_i is not None else len(lines))
    section = None
    number = 0
    for raw in lines[body_start:body_end]:
        line = raw.strip()
        h2 = re.match(r"^##\s+(.*?)\s*$", line)
        if h2:
            title = h2.group(1)
            numbered = re.match(r"^\d+\.\s+(.*)$", title)
            if numbered:
                title = numbered.group(1)
            number += 1
            section = Section(number, title)
            article.sections.append(section)
            continue
        if section is None:
            continue
        h3 = re.match(r"^###\s+(.*?)\s*$", line)
        if h3:
            section.blocks.append(Block("h3", h3.group(1)))
            continue
        if not line:
            continue
        if line.startswith("- "):
            section.blocks.append(Block("bullets", line[2:]))
        elif re.match(r"^\d+\.\s", line):
            section.blocks.append(Block("ordered", re.sub(r"^\d+\.\s", "", line)))
        elif line.startswith(">"):
            section.blocks.append(Block("quote", line.lstrip("> ").strip()))
        else:
            section.blocks.append(Block("p", line))

    # Merge consecutive bullets / ordered / quotes into single blocks.
    for section in article.sections:
        merged = []
        for block in section.blocks:
            if (
                merged
                and merged[-1].kind == block.kind
                and block.kind in ("bullets", "ordered", "quote")
            ):
                if block.kind == "quote":
                    merged[-1].payload = merged[-1].payload + " " + block.payload
                else:
                    merged[-1].payload.append(block.payload)
            elif block.kind in ("bullets", "ordered"):
                merged.append(Block(block.kind, [block.payload]))
            else:
                merged.append(block)
        section.blocks = merged

    # Attach figures to the sections they illustrate.
    for figure in article.figures:
        placed = False
        for section in article.sections:
            if section.number in figure.refs:
                section.blocks.append(Block("diagram", figure))
                placed = True
        if not placed:
            article.orphans.append(figure)

    # Takeaways + source bullets.
    if takeaways_i is not None:
        end = source_i if source_i is not None else len(lines)
        for raw in lines[takeaways_i + 1 : end]:
            line = raw.strip()
            if line.startswith("- ") or line.startswith("* "):
                article.takeaways.append(line[2:])
    if source_i is not None:
        for raw in lines[source_i + 1 :]:
            line = raw.strip()
            link = re.search(r"\[([^\]]+)\]\(([^)\s]+)\)", line)
            lowered = line.lower()
            if link and "video:" in lowered:
                article.video["title"], article.video["url"] = link.group(1), link.group(2)
            elif link and "channel:" in lowered:
                article.video["channel"], article.video["channel_url"] = link.group(1), link.group(2)
            elif "channel:" in lowered:
                article.video["channel"] = line.split(":", 1)[1].strip()
            elif "fetched at:" in lowered:
                article.video["fetched_at"] = line.split(":", 1)[1].strip()
    return article


def diagram_jsx(figure, indent):
    pad = " " * indent
    caption = figure.title
    if figure.description:
        caption = "%s — %s" % (caption, figure.description)
    return (
        "%s<MermaidDiagram code={%s} caption={%s} />"
        % (pad, json.dumps(figure.code), ts_literal(caption))
    )


def block_jsx(block, indent):
    pad = " " * indent
    inner = " " * (indent + 2)
    if block.kind == "p":
        return "%s<p>%s</p>" % (pad, inline_jsx(block.payload))
    if block.kind == "h3":
        return "%s<h3>%s</h3>" % (pad, inline_jsx(block.payload))
    if block.kind == "quote":
        return "%s<div className={styles.quote}>%s</div>" % (pad, inline_jsx(block.payload))
    if block.kind == "bullets":
        items = "\n".join(
            "%s<li>%s</li>" % (inner + "  ", inline_jsx(item)) for item in block.payload
        )
        return "%s<div className={styles.panel}>\n%s<ul>\n%s\n%s</ul>\n%s</div>" % (
            pad,
            inner,
            items,
            inner,
            pad,
        )
    if block.kind == "ordered":
        items = "\n".join(
            "%s<li>%s</li>" % (inner + "  ", inline_jsx(item)) for item in block.payload
        )
        return "%s<div className={styles.panel}>\n%s<ol>\n%s\n%s</ol>\n%s</div>" % (
            pad,
            inner,
            items,
            inner,
            pad,
        )
    if block.kind == "diagram":
        return diagram_jsx(block.payload, indent)
    raise ValueError("unknown block kind: %s" % block.kind)


def section_jsx(section, index, kicker_prefix, indent, used_ids):
    pad = " " * indent
    inner = " " * (indent + 2)
    section_id = slugify(section.title)
    if not section_id:
        section_id = "section-%d" % section.number
    base = section_id
    suffix = 2
    while section_id in used_ids:
        section_id = "%s-%d" % (base, suffix)
        suffix += 1
    used_ids.add(section_id)
    blocks = "\n".join(block_jsx(block, indent + 2) for block in section.blocks)
    kicker = "%s%02d" % (kicker_prefix, index)
    return (
        "%s<section className={styles.section} id=\"%s\">\n"
        "%s<div className={styles.kicker}>%s</div>\n"
        "%s<h2>%s</h2>\n"
        "%s\n"
        "%s</section>" % (pad, section_id, inner, kicker, inner, inline_jsx(section.title), blocks, pad)
    )


def render_fragment(article, kicker_prefix, indent):
    used_ids = set()
    parts = []
    if article.orphans:
        pad = " " * indent
        inner = " " * (indent + 2)
        blocks = "\n".join(diagram_jsx(f, indent + 2) for f in article.orphans)
        parts.append(
            "%s<section className={styles.section} id=\"architecture-diagrams\">\n"
            "%s<div className={styles.kicker}>Overview</div>\n"
            "%s<h2>Architecture Diagrams</h2>\n"
            "%s\n"
            "%s</section>"
            % (pad, inner, inner, blocks, pad)
        )
        used_ids.add("architecture-diagrams")
    for i, section in enumerate(article.sections, start=1):
        parts.append(section_jsx(section, i, kicker_prefix, indent, used_ids))
    if article.takeaways:
        checks = "\n".join(
            "%s<div className={styles.check}>%s</div>" % (" " * (indent + 2), inline_jsx(t))
            for t in article.takeaways
        )
        parts.append(
            "%s<section className={styles.section} id=\"key-takeaways\">\n"
            "%s<div className={styles.kicker}>Summary</div>\n"
            "%s<h2>Key Takeaways</h2>\n"
            "%s<div className={styles.checklist}>\n%s\n%s</div>\n"
            "%s</section>" % (" " * indent, " " * (indent + 2), " " * (indent + 2), " " * (indent + 2), checks, " " * (indent + 2), " " * indent)
        )
    return "\n\n".join(parts)


def render_page(article, slug, kicker_prefix):
    used_ids = set()
    toc = []
    if article.orphans:
        toc.append(("architecture-diagrams", "Architecture Diagrams"))
    for section in article.sections:
        section_id = slugify(section.title) or "section-%d" % section.number
        base = section_id
        suffix = 2
        while section_id in used_ids:
            section_id = "%s-%d" % (base, suffix)
            suffix += 1
        used_ids.add(section_id)
        toc.append((section_id, section.title))
    if article.takeaways:
        toc.append(("key-takeaways", "Key Takeaways"))

    toc_links = "\n".join(
        '%s<a href={`#%s`} key="%s">%s</a>'
        % (" " * 18, section_id, section_id, jsx_text(label))
        for section_id, label in toc
    )
    sections = render_fragment(article, kicker_prefix, 12)

    description = " ".join(article.intro)[:150].rstrip() or article.title
    tags = ["Applied AI", "Article"]
    if article.video["channel"]:
        tags.append(article.video["channel"])
    tags_jsx = "[%s]" % ", ".join(ts_literal(t) for t in tags)

    footer_bits = []
    if article.video["url"]:
        footer_bits.append(
            "Source: <a href=%s>%s</a>"
            % (jsx_text(article.video["url"]), jsx_text(article.video["title"] or "video"))
        )
    if article.video["channel_url"]:
        footer_bits.append("by <a href=%s>%s</a>" % (jsx_text(article.video["channel_url"]), jsx_text(article.video["channel"])))
    if article.video["fetched_at"]:
        footer_bits.append("· metadata fetched %s" % jsx_text(article.video["fetched_at"]))
    footer_text = " ".join(footer_bits)

    return """import type { Metadata } from "next";
import styles from "../knowledge-base.module.css";
import MermaidDiagram from "../mermaid";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: %s,
  description: %s,
};

const TAGS = %s;

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
            <h1>%s</h1>
            <p>%s</p>
            <div className={styles.tags}>
              {TAGS.map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}
            </div>
            <nav className={styles.toc} aria-label="Article sections">
%s
            </nav>
          </header>

%s

          <footer className={styles.footer}>
            %s Built by the <a href={`${basePath}/knowledge-base/`}>Knowledge Base</a> YouTube → article pipeline.
          </footer>
        </article>
      </div>
    </main>
  );
}
""" % (
        json.dumps("%s | Knowledge Base" % article.title),
        json.dumps(description),
        tags_jsx,
        inline_jsx(article.title),
        " ".join(inline_jsx(p) for p in article.intro),
        toc_links,
        sections,
        footer_text,
    )


def main(argv):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input_dir", help="pipeline/output/<video-id> folder")
    parser.add_argument("slug", help="route slug under app/knowledge-base/")
    parser.add_argument("--fragment", action="store_true", help="emit only <section> markup")
    parser.add_argument("--kicker", default="Part ", help="section kicker prefix (default 'Part ')")
    parser.add_argument("--out", help="output file (default: app/knowledge-base/<slug>/page.tsx)")
    args = parser.parse_args(argv)

    folder = Path(args.input_dir)
    if not folder.is_dir():
        print("input dir not found: %s" % folder, file=sys.stderr)
        return 64
    article_md = folder / "article.md"
    if not article_md.is_file():
        print("missing %s" % article_md, file=sys.stderr)
        return 66

    article = parse_article(article_md)
    if not article.title or not article.sections:
        print("article.md could not be parsed into sections", file=sys.stderr)
        return 65

    if args.fragment:
        output = render_fragment(article, args.kicker, 0)
    else:
        output = render_page(article, args.slug, args.kicker)

    out_path = Path(args.out) if args.out else Path("app/knowledge-base/%s/page.tsx" % args.slug)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(output + "\n", encoding="utf-8")
    print("wrote %s (%d sections, %d diagrams)"
          % (out_path, len(article.sections), len(article.figures)))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
