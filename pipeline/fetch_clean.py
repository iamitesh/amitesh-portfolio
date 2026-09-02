#!/usr/bin/env python3
"""Fetch a YouTube video's English transcript and write cleaned Markdown.

Usage:
    python3 pipeline/fetch_clean.py <url-or-video-id> [--force]

Writes into pipeline/output/<video-id>/:
    meta.json          video metadata + fetch summary
    transcript-raw.md  captions verbatim, one "[HH:MM:SS] text" line per entry
    transcript.md      cleaned: timestamps stripped, caption wraps merged,
                       [Music]/[Applause]/... markers removed, paragraphs
                       bounded (4 s pause or ~5 sentences) for chunked reading

Exit codes (sysexits-style):
    64  usage / invalid URL or video id
    66  no input
    69  video unavailable or no usable captions
    73  already fetched (use --force)
    74  network failure (retryable)
    75  blocked or rate-limited by YouTube (retryable)
    78  youtube-transcript-api not installed

On success the last stdout line is a one-line JSON summary:
    {"video_id": ..., "title": ..., "lang_source": ..., "source_lang": ...,
     "clean_chars": ..., "status": "ok"}
"""

import argparse
import json
import re
import sys
import warnings
from datetime import datetime, timezone
from pathlib import Path

# urllib3 (pulled in by the transcript API) warns on LibreSSL macOS Python —
# real errors still surface, this one is pure noise on this machine.
warnings.filterwarnings("ignore", message=".*OpenSSL.*")

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api import _errors as yt_errors
except ImportError:
    print("ERROR [78]: youtube-transcript-api is not installed.", file=sys.stderr)
    print("Install it with: python3 -m pip install --user youtube-transcript-api", file=sys.stderr)
    sys.exit(78)

import urllib.error
import urllib.request

SCRIPT_DIR = Path(__file__).resolve().parent
OUTPUT_ROOT = SCRIPT_DIR / "output"

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)

VIDEO_ID_RE = re.compile(
    r"(?:v=|youtu\.be/|/shorts/|/embed/|/live/)([A-Za-z0-9_-]{11})"
)
BARE_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")

CAPTION_MARKER_RE = re.compile(
    r"\[(?:music|music playing|applause|laughter|cheering"
    r"|संगीत|तालियाँ|तालियां|हँसी|हंसी)\]",
    re.IGNORECASE,
)
LEADING_TIMESTAMP_RE = re.compile(r"^\s*\[?\d{1,2}:\d{2}(?::\d{2})?\]?\s*")
MUSIC_NOTES = "♪♫"
PUNCT_SPACE_RE = re.compile(r"\s+([,.;:!?])")
SENTENCE_END_RE = re.compile(r"(?<=[.!?])\s+")

# 1.2.4 exception names (verified against the installed package)
EX_UNAVAILABLE = (
    yt_errors.VideoUnavailable,
    yt_errors.VideoUnplayable,
    yt_errors.AgeRestricted,
    yt_errors.NoTranscriptFound,
    yt_errors.TranscriptsDisabled,
    yt_errors.NotTranslatable,
    yt_errors.TranslationLanguageNotAvailable,
)
EX_BLOCKED = (
    yt_errors.RequestBlocked,
    yt_errors.IpBlocked,
    yt_errors.PoTokenRequired,
    yt_errors.CouldNotRetrieveTranscript,
    yt_errors.YouTubeRequestFailed,
    yt_errors.YouTubeDataUnparsable,
)
EX_NETWORK = (
    urllib.error.URLError,
    urllib.error.HTTPError,
    TimeoutError,
    ConnectionError,
    OSError,
)


def extract_video_id(url_or_id):
    """Return the 11-char video id from a URL or a bare id; exit 64 if invalid."""
    value = (url_or_id or "").strip()
    if BARE_ID_RE.match(value):
        return value
    match = VIDEO_ID_RE.search(value)
    if match:
        return match.group(1)
    print("ERROR [64]: not a YouTube URL or video id: %r" % value, file=sys.stderr)
    print(
        "Accepted forms: https://www.youtube.com/watch?v=<id>, "
        "https://youtu.be/<id>, /shorts/<id>, /embed/<id>, /live/<id>, "
        "or the bare 11-character id.",
        file=sys.stderr,
    )
    sys.exit(64)


def get_video_meta(video_id):
    """Fetch title/channel via YouTube oEmbed (no API key). Non-fatal: never
    blocks the transcript fetch — falls back to "(unknown ...)" on any error."""
    url = "https://www.youtube.com/oembed?url=https%3A//www.youtube.com/watch%3Fv%3D{}&format=json".format(
        video_id
    )
    meta = {"title": "(unknown title)", "channel": "(unknown channel)", "channel_url": ""}
    try:
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
        meta["title"] = data.get("title") or meta["title"]
        meta["channel"] = data.get("author_name") or meta["channel"]
        meta["channel_url"] = data.get("author_url") or ""
    except Exception as exc:  # oEmbed is best-effort by design
        print(
            "WARNING: could not fetch video metadata (oEmbed): %s" % exc,
            file=sys.stderr,
        )
    return meta


def fetch_transcript(video_id, any_language=False):
    """Fetch the English transcript via the 1.2.4 class API.

    Returns (snippets, lang_source, source_lang) where lang_source is one of
    "manual", "auto-generated", "translated", "transcribed", or "other".
    "transcribed" (only with any_language=True) means a non-English track was
    fetched as-is because no English track and no translation are available —
    the article agent translates it.
    """
    api = YouTubeTranscriptApi()
    transcript_list = api.list(video_id)

    transcript = None
    lang_source = None
    try:
        transcript = transcript_list.find_manually_created_transcript(["en"])
        lang_source = "manual"
    except yt_errors.NoTranscriptFound:
        try:
            transcript = transcript_list.find_generated_transcript(["en"])
            lang_source = "auto-generated"
        except yt_errors.NoTranscriptFound:
            try:
                transcript = transcript_list.find_transcript(["en"])
                lang_source = "other"
            except yt_errors.NoTranscriptFound:
                pass

    if transcript is None:
        # No English track at all — try translating whatever exists.
        fallback = next(iter(transcript_list), None)
        if fallback is None:
            raise yt_errors.NoTranscriptFound(video_id)
        if any_language:
            transcript = fallback
            lang_source = "transcribed"
        else:
            transcript = fallback.translate("en")
            lang_source = "translated"

    source_lang = getattr(transcript, "language_code", None)
    snippets = transcript.fetch()
    return snippets, lang_source, source_lang


def snippet_field(snippet, name):
    """Read a field from a snippet that may be a dict or an object."""
    if isinstance(snippet, dict):
        return snippet.get(name)
    return getattr(snippet, name, None)


def clean_caption_text(text):
    """Strip markers, wrap-join, and tidy one caption chunk."""
    text = CAPTION_MARKER_RE.sub("", text)
    text = LEADING_TIMESTAMP_RE.sub("", text)
    text = text.strip(MUSIC_NOTES + " \t")
    text = re.sub(r"\s+", " ", text)  # join hard wraps, collapse runs
    text = PUNCT_SPACE_RE.sub(r"\1", text)
    return text.strip()


def clean_transcript(snippets):
    """Return a list of paragraph strings: markers gone, duplicates dropped,
    paragraphs bounded by >4 s speaker pauses or ~5 sentence-ish chunks."""
    paragraphs = []
    current = []
    sentence_count = 0
    prev_start = None
    last_text = None

    for snippet in snippets:
        text = snippet_field(snippet, "text")
        start = snippet_field(snippet, "start")
        if text is None:
            continue
        text = clean_caption_text(text)
        if not text:
            continue
        if last_text is not None and text == last_text:
            continue  # duplicated caption entry

        if start is not None and prev_start is not None:
            gap = start - prev_start
        else:
            gap = 0.0
        if current and gap > 4.0:
            paragraphs.append(" ".join(current))
            current = []
            sentence_count = 0

        current.append(text)
        sentence_count += max(1, len(SENTENCE_END_RE.split(text)))
        if sentence_count >= 5:
            paragraphs.append(" ".join(current))
            current = []
            sentence_count = 0

        if start is not None:
            prev_start = start
        last_text = text

    if current:
        paragraphs.append(" ".join(current))
    return paragraphs


def fmt_ts(start_seconds):
    if start_seconds is None:
        return "[--:--:--]"
    seconds = int(start_seconds)
    return "[%02d:%02d:%02d]" % (seconds // 3600, (seconds % 3600) // 60, seconds % 60)


def write_outputs(out_dir, video_id, url, meta, snippets, lang_source, source_lang, paragraphs):
    raw_lines = []
    raw_chars = 0
    for snippet in snippets:
        text = snippet_field(snippet, "text") or ""
        start = snippet_field(snippet, "start")
        line = "%s %s" % (fmt_ts(start), text)
        raw_lines.append(line)
        raw_chars += len(line) + 1

    (out_dir / "transcript-raw.md").write_text("\n".join(raw_lines) + "\n", encoding="utf-8")
    (out_dir / "transcript.md").write_text(
        "# %s\n\n%s\n" % (meta["title"], "\n\n".join(paragraphs)), encoding="utf-8"
    )

    record = {
        "video_id": video_id,
        "url": url,
        "title": meta["title"],
        "channel": meta["channel"],
        "channel_url": meta["channel_url"],
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "lang_source": lang_source,
        "source_lang": source_lang,
        "caption_count": len(snippets),
        "raw_chars": raw_chars,
        "clean_chars": sum(len(p) for p in paragraphs),
    }
    (out_dir / "meta.json").write_text(
        json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return record


def map_fetch_error(exc):
    """Return (exit_code, message) for a fetch exception; None for non-mapped."""
    if isinstance(exc, yt_errors.InvalidVideoId):
        return 64, "invalid video id: %s" % exc
    if isinstance(exc, (yt_errors.NotTranslatable, yt_errors.TranslationLanguageNotAvailable)):
        return 69, (
            "no English captions and the available track is not translatable "
            "(%s). Retry with --any-language to fetch the original-language "
            "track — the article agent will translate it." % str(exc).splitlines()[0]
        )
    if isinstance(exc, EX_UNAVAILABLE):
        return 69, "video unavailable or has no usable captions: %s" % exc
    if isinstance(exc, EX_BLOCKED):
        return 75, (
            "YouTube blocked the request or rate-limited it (%s). "
            "Retry in a few minutes; if it persists, update youtube-transcript-api "
            "or try from a different network." % exc
        )
    if isinstance(exc, yt_errors.YouTubeTranscriptApiException):
        return 75, "transcript API error (retryable): %s" % exc
    if isinstance(exc, EX_NETWORK):
        return 74, "network failure — check connectivity: %s" % exc
    return None


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Fetch a YouTube transcript and write cleaned Markdown."
    )
    parser.add_argument("url_or_id", nargs="?", help="YouTube URL or 11-char video id")
    parser.add_argument("--force", action="store_true", help="overwrite an existing fetch")
    parser.add_argument(
        "--any-language",
        action="store_true",
        help="if no English track exists, fetch the available track as-is "
        "(the article agent translates it)",
    )
    args = parser.parse_args(argv)

    if not args.url_or_id:
        print("ERROR [66]: no URL or video id given.", file=sys.stderr)
        parser.print_usage(sys.stderr)
        return 66

    video_id = extract_video_id(args.url_or_id)
    canonical_url = "https://www.youtube.com/watch?v=%s" % video_id
    out_dir = OUTPUT_ROOT / video_id

    if (out_dir / "meta.json").exists() and not args.force:
        print(
            "ERROR [73]: %s already fetched — re-run with --force to overwrite."
            % video_id,
            file=sys.stderr,
        )
        return 73

    print("Fetching metadata for %s ..." % video_id, file=sys.stderr)
    meta = get_video_meta(video_id)
    print("Fetching English transcript for %s ..." % video_id, file=sys.stderr)
    try:
        snippets, lang_source, source_lang = fetch_transcript(video_id, args.any_language)
    except Exception as exc:  # mapped through the exit-code table below
        mapped = map_fetch_error(exc)
        if mapped is None:
            print("ERROR [75]: unexpected failure: %r" % exc, file=sys.stderr)
            return 75
        code, message = mapped
        print("ERROR [%d]: %s" % (code, message), file=sys.stderr)
        return code

    paragraphs = clean_transcript(snippets)
    if not paragraphs:
        print(
            "ERROR [69]: transcript for %s is empty after cleaning." % video_id,
            file=sys.stderr,
        )
        return 69

    out_dir.mkdir(parents=True, exist_ok=True)
    record = write_outputs(
        out_dir, video_id, canonical_url, meta, snippets, lang_source, source_lang, paragraphs
    )

    summary = {
        "video_id": video_id,
        "title": meta["title"],
        "lang_source": lang_source,
        "source_lang": source_lang,
        "clean_chars": record["clean_chars"],
        "status": "ok",
    }
    print(json.dumps(summary, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
