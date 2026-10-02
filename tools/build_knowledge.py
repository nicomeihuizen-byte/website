"""Build docs/ask/knowledge.json: the only thing Agent Fritz knows.

Agent Fritz (the chat in the corner of every page) answers from this file and
nothing else. The chat route fetches it from the live site, so publishing a
content change and publishing what Fritz knows are the same push.

    python tools/build_knowledge.py          # rebuild
    python tools/build_knowledge.py --check  # exit 1 if the file is stale

English pages only: every translation says the same thing, and Fritz answers
in the visitor's language anyway. What is on a page is what Fritz may say.
If a fact is not on the site, Fritz does not know it, and that is the point.

Documents work the same way: Fritz can share a product sheet or an example
report only if a page offers it as a download card (<a class="doc-download">).
No card, no document, however often a visitor asks.
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from posixpath import normpath

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
OUT = DOCS / "ask" / "knowledge.json"
SITE = "https://www.meihuizen.ai/"

PAGES = ["index.html", "about.html", "builds.html", "contact.html", "credentials.html", "privacy.html", "status.html"]
PAGES += sorted(p.relative_to(DOCS).as_posix() for p in (DOCS / "projects").glob("*.html"))

SKIP_TAGS = {"script", "style", "svg", "noscript", "template", "button", "head", "nav", "form"}
SKIP_CLASSES = {"lang-switch", "sr-only", "site-header", "social-links",
                "project-nav-socials", "image-lightbox", "theme-toggle"}
BLOCK = {"p", "div", "section", "article", "li", "tr", "figcaption", "figure",
         "br", "ul", "ol", "table", "footer", "main", "nav", "h1", "h2", "h3", "h4"}
VOID = {"br", "img", "input", "meta", "link", "hr", "source", "wbr"}


class Extract(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.out: list[str] = []
        self.skip_depth = 0
        self.stack: list[bool] = []
        self.title = ""
        self.description = ""
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "meta" and a.get("name") == "description":
            self.description = a.get("content", "")
        if tag == "title":
            self._in_title = True
        if tag in VOID:
            if tag == "br":
                self.out.append("\n")
            return
        classes = set((a.get("class") or "").split())
        skipping = tag in SKIP_TAGS or bool(classes & SKIP_CLASSES) or a.get("aria-hidden") == "true" or "hidden" in a
        self.stack.append(skipping)
        if skipping:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if tag in BLOCK:
            self.out.append("\n")
        if tag in {"h1", "h2", "h3", "h4"}:
            self.out.append("#" * int(tag[1]) + " ")
        if tag == "li":
            self.out.append("- ")

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag in VOID or not self.stack:
            return
        skipping = self.stack.pop()
        if skipping:
            self.skip_depth -= 1
            return
        if not self.skip_depth and tag in BLOCK:
            self.out.append("\n")

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self.skip_depth or self._in_title:
            return
        self.out.append(re.sub(r"\s+", " ", data))

    def text(self) -> str:
        raw = "".join(self.out)
        lines = [re.sub(r"[ \t]+", " ", l).strip() for l in raw.split("\n")]
        lines = [l for l in lines if l and l not in {"-", "#", "##", "###"}]
        return "\n".join(lines)


class Docs(HTMLParser):
    """The download cards on a page: link, title, one line, file type."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.docs: list[dict] = []
        self.cur: dict | None = None
        self.field: str | None = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "a" and "doc-download" in (a.get("class") or "").split():
            self.cur = {"href": a.get("href", ""), "title": "", "description": "", "type": ""}
        elif self.cur is not None:
            if tag == "h3":
                self.field = "title"
            elif tag == "p":
                self.field = "description"
            elif tag == "span" and "tag" in (a.get("class") or "").split():
                self.field = "type"

    def handle_endtag(self, tag):
        if self.cur is None:
            return
        if tag in {"h3", "p", "span"}:
            self.field = None
        if tag == "a":
            self.docs.append(self.cur)
            self.cur = None

    def handle_data(self, data):
        if self.cur is not None and self.field:
            self.cur[self.field] += data


def documents(rel: str, html: str, page_title: str) -> list[dict]:
    # "Product sheet" on its own says nothing on a card: name what it is about,
    # from the page's own title ("Five | Deal management" -> "Five").
    subject = re.split(r"\s*[:|]\s*", page_title, maxsplit=1)[0].strip()
    parser = Docs()
    parser.feed(html)
    out = []
    for d in parser.docs:
        href = d["href"].split("#")[0]
        if not href or href.startswith(("http:", "https:", "mailto:")) or href.endswith(".html"):
            continue  # documents only: a link to another page is not one
        path = normpath(str(PurePosixPath(rel).parent / href))
        if path.startswith("..") or not (DOCS / path).is_file():
            continue
        title = re.sub(r"\s+", " ", d["title"]).strip()
        if subject and subject.lower() not in title.lower():
            title = f"{subject} · {title}"
        out.append({
            "id": PurePosixPath(path).stem,
            "title": title,
            "description": re.sub(r"\s+", " ", d["description"]).strip(),
            "type": d["type"].strip(),
            "url": SITE + path,
            "page": rel,
        })
    return out


def build() -> dict:
    pages = []
    docs: dict[str, dict] = {}
    for rel in PAGES:
        html = (DOCS / rel).read_text(encoding="utf-8")
        if 'http-equiv="refresh"' in html:  # a retired page that redirects: nothing to know
            continue
        body = html.split("<body", 1)[1] if "<body" in html else html
        head = Extract(); head.feed(html.split("<body", 1)[0])
        p = Extract(); p.feed("<body" + body)
        text = p.text()
        pages.append({
            "path": rel,
            "url": SITE + ("" if rel == "index.html" else rel),
            "title": head.title.strip(),
            "description": head.description.strip(),
            "text": text,
        })
        for d in documents(rel, html, head.title.strip()):
            docs.setdefault(d["id"], d)
    documents_ = list(docs.values())
    digest = hashlib.sha256(json.dumps([pages, documents_], ensure_ascii=False).encode()).hexdigest()[:16]
    return {"site": SITE, "version": digest, "pages": pages, "documents": documents_}


def main() -> int:
    data = build()
    if "--check" in sys.argv:
        try:
            current = json.loads(OUT.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            print("knowledge.json missing or unreadable: run python tools/build_knowledge.py")
            return 1
        if current.get("version") != data["version"]:
            print("knowledge.json is stale: run python tools/build_knowledge.py")
            return 1
        print("knowledge.json is current")
        return 0
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    total = sum(len(p["text"]) for p in data["pages"])
    print(f"wrote {OUT.relative_to(ROOT)}: {len(data['pages'])} pages, {len(data['documents'])} documents, {total:,} chars, version {data['version']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
