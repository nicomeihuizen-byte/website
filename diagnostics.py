#!/usr/bin/env python3
"""Static audit of docs/ HTML pages against the webpage rules in agents.md.

Checks SEO/metadata, heading hierarchy, image accessibility/performance, and the
HTML/JS security-hardening rules that apply to a static site (CSP, unsafe DOM
sinks, unsafe execution sinks, storage/message-origin hygiene).

Usage:
    python diagnostics.py [--root PATH]

Exit code is 1 if any ERROR-level issue is found, otherwise 0.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import struct
import sys
from html.parser import HTMLParser

REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
PRODUCTION_ORIGIN = "https://www.meihuizen.ai"
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}
HEADING_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6"}
ALLOWED_OG_TYPES = {"website", "profile", "article"}
GENERIC_H1_TEXT = {
    "home", "page", "untitled", "placeholder", "project four",
    "background", "overview", "content", "welcome",
}
CDN_SCRIPT_PATTERN = re.compile(r"^https?://", re.IGNORECASE)
# Google serves gtag.js per-measurement-ID with content that can change without notice,
# so a static SRI hash would break analytics the next time Google updates the script.
SRI_EXEMPT_SCRIPT_HOSTS = re.compile(r"^https?://(?:www\.)?googletagmanager\.com/", re.IGNORECASE)
UNSAFE_DOM_SINK = re.compile(
    r"\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML\s*\(|document\.write\s*\("
)
UNSAFE_EXEC_SINK = re.compile(
    r"\beval\s*\(|new\s+Function\s*\(|setTimeout\s*\(\s*['\"`]|setInterval\s*\(\s*['\"`]"
)
SUSPICIOUS_STORAGE_KEY = re.compile(
    r"(?:localStorage|sessionStorage)\.setItem\(\s*['\"`]([^'\"`]*)['\"`]", re.IGNORECASE
)
SUSPICIOUS_STORAGE_NAME = re.compile(r"token|auth|session[-_]?id|jwt|password|secret", re.IGNORECASE)
POSTMESSAGE_LISTENER = re.compile(r"addEventListener\(\s*['\"`]message['\"`]")


class Issue:
    def __init__(self, path: str, level: str, rule: str, message: str, line: int | None = None):
        self.path = path
        self.level = level
        self.rule = rule
        self.message = message
        self.line = line

    def __str__(self) -> str:
        location = f"{self.path}:{self.line}" if self.line else self.path
        return f"[{self.level}] {location} ({self.rule}) - {self.message}"


class Node:
    __slots__ = ("tag", "attrs", "children", "parent", "line", "order", "text_parts")

    def __init__(self, tag: str, attrs: list[tuple[str, str | None]], line: int, parent: "Node | None"):
        self.tag = tag
        self.attrs = {k: (v if v is not None else "") for k, v in attrs}
        self.children: list[Node] = []
        self.parent = parent
        self.line = line
        self.order = 0
        self.text_parts: list[str] = []

    def has_class(self, name: str) -> bool:
        return name in self.attrs.get("class", "").split()

    def own_text(self) -> str:
        return "".join(self.text_parts)

    def text(self) -> str:
        parts = list(self.text_parts)
        for child in self.children:
            parts.append(child.text())
        return "".join(parts).strip()

    def walk(self):
        for child in self.children:
            yield child
            yield from child.walk()

    def find_ancestor(self, tag: str) -> "Node | None":
        node = self.parent
        while node is not None:
            if node.tag == tag:
                return node
            node = node.parent
        return None


class TreeBuilder(HTMLParser):
    """Builds a minimal DOM tree; tolerates the well-formed, hand-authored HTML in docs/."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", [], 0, None)
        self.stack = [self.root]
        self._order = 0

    def _push_leaf(self, tag: str, attrs: list[tuple[str, str | None]]) -> Node:
        self._order += 1
        node = Node(tag, attrs, self.getpos()[0], self.stack[-1])
        node.order = self._order
        self.stack[-1].children.append(node)
        return node

    def handle_starttag(self, tag: str, attrs):
        node = self._push_leaf(tag, attrs)
        if tag not in VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag: str, attrs):
        self._push_leaf(tag, attrs)

    def handle_endtag(self, tag: str):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data: str):
        self.stack[-1].text_parts.append(data)


def parse_html(path: str) -> Node:
    with open(path, "r", encoding="utf-8") as handle:
        content = handle.read()
    builder = TreeBuilder()
    builder.feed(content)
    return builder.root


def find_all(root: Node, predicate) -> list[Node]:
    return [node for node in root.walk() if predicate(node)]


def get_image_dimensions(path: str) -> tuple[int, int] | None:
    """Reads intrinsic pixel dimensions for PNG/JPEG/GIF. Returns None for other/unreadable formats."""
    try:
        with open(path, "rb") as handle:
            data = handle.read()
    except OSError:
        return None

    if data[:8] == b"\x89PNG\r\n\x1a\n" and len(data) >= 24:
        width, height = struct.unpack(">II", data[16:24])
        return width, height

    if data[:6] in (b"GIF87a", b"GIF89a") and len(data) >= 10:
        width, height = struct.unpack("<HH", data[6:10])
        return width, height

    if data[:2] == b"\xff\xd8":
        index = 2
        while index + 4 <= len(data):
            if data[index] != 0xFF:
                index += 1
                continue
            marker = data[index + 1]
            if marker in (0xD8, 0xD9):
                index += 2
                continue
            if index + 4 > len(data):
                break
            segment_length = struct.unpack(">H", data[index + 2 : index + 4])[0]
            is_sof = 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC)
            if is_sof and index + 9 <= len(data):
                height, width = struct.unpack(">HH", data[index + 5 : index + 9])
                return width, height
            index += 2 + segment_length
        return None

    return None


def resolve_asset_path(html_path: str, src: str) -> str | None:
    if not src or src.startswith(("http://", "https://", "data:")):
        return None
    return os.path.normpath(os.path.join(os.path.dirname(html_path), src))


def is_above_fold(node: Node) -> bool:
    """Heuristic: hero/logo imagery is exempt from the loading=lazy requirement."""
    if node.has_class("hero-logo"):
        return True
    probe = node.parent
    while probe is not None:
        classes = probe.attrs.get("class", "")
        if "hero" in classes:
            return True
        probe = probe.parent
    return False


def check_seo_metadata(path: str, root: Node, is_project_page: bool, is_noindex: bool) -> list[Issue]:
    issues: list[Issue] = []

    metas = find_all(root, lambda n: n.tag == "meta")
    theme_color = next((m for m in metas if m.attrs.get("name") == "theme-color"), None)
    robots = next((m for m in metas if m.attrs.get("name") == "robots"), None)
    csp = next((m for m in metas if m.attrs.get("http-equiv") == "Content-Security-Policy"), None)
    canonical = next((n for n in find_all(root, lambda n: n.tag == "link") if n.attrs.get("rel") == "canonical"), None)
    og_metas = [m for m in metas if m.attrs.get("property", "").startswith("og:")]
    twitter_metas = [m for m in metas if m.attrs.get("name", "").startswith("twitter:")]
    jsonld_scripts = find_all(
        root, lambda n: n.tag == "script" and n.attrs.get("type") == "application/ld+json"
    )

    severity = "WARN" if is_noindex else "ERROR"

    if canonical is None:
        issues.append(Issue(path, severity, "seo-canonical", "Missing <link rel=\"canonical\">."))
    elif not canonical.attrs.get("href", "").startswith(PRODUCTION_ORIGIN):
        issues.append(Issue(
            path, severity, "seo-canonical",
            f"canonical href '{canonical.attrs.get('href')}' is not an absolute {PRODUCTION_ORIGIN} URL.",
            canonical.line,
        ))

    og_by_prop = {m.attrs.get("property"): m for m in og_metas}
    for key in ("og:title", "og:description", "og:image", "og:url", "og:type"):
        if key not in og_by_prop:
            issues.append(Issue(path, severity, "seo-opengraph", f"Missing meta property=\"{key}\"."))
    if "og:image" in og_by_prop and not og_by_prop["og:image"].attrs.get("content", "").startswith(("http://", "https://")):
        issues.append(Issue(
            path, severity, "seo-opengraph", "og:image content must be an absolute URL.", og_by_prop["og:image"].line
        ))
    if "og:url" in og_by_prop and canonical is not None:
        og_url = og_by_prop["og:url"].attrs.get("content")
        if og_url != canonical.attrs.get("href"):
            issues.append(Issue(
                path, severity, "seo-opengraph",
                f"og:url '{og_url}' does not match canonical href '{canonical.attrs.get('href')}'.",
                og_by_prop["og:url"].line,
            ))
    if "og:type" in og_by_prop and og_by_prop["og:type"].attrs.get("content") not in ALLOWED_OG_TYPES:
        issues.append(Issue(
            path, "WARN", "seo-opengraph",
            f"og:type '{og_by_prop['og:type'].attrs.get('content')}' is not one of {sorted(ALLOWED_OG_TYPES)}.",
            og_by_prop["og:type"].line,
        ))

    twitter_by_name = {m.attrs.get("name"): m for m in twitter_metas}
    for key in ("twitter:card", "twitter:title", "twitter:description", "twitter:image"):
        if key not in twitter_by_name:
            issues.append(Issue(path, severity, "seo-twitter", f"Missing meta name=\"{key}\"."))
    if "twitter:card" in twitter_by_name and twitter_by_name["twitter:card"].attrs.get("content") != "summary_large_image":
        issues.append(Issue(
            path, severity, "seo-twitter", "twitter:card must be 'summary_large_image'.",
            twitter_by_name["twitter:card"].line,
        ))

    if not jsonld_scripts:
        issues.append(Issue(path, severity, "seo-jsonld", "Missing JSON-LD <script type=\"application/ld+json\">."))
    else:
        expected_type = "CreativeWork" if is_project_page else None
        if os.path.basename(path) == "index.html":
            expected_type = "Person"
        elif os.path.basename(path) == "about.html":
            expected_type = "ProfilePage"
        elif os.path.basename(path) == "builds.html":
            expected_type = "CollectionPage"
        for script in jsonld_scripts:
            try:
                payload = json.loads(script.own_text())
            except json.JSONDecodeError as exc:
                issues.append(Issue(path, "ERROR", "seo-jsonld", f"JSON-LD is not valid JSON: {exc}", script.line))
                continue
            actual_type = payload.get("@type")
            if expected_type and actual_type != expected_type:
                issues.append(Issue(
                    path, "WARN", "seo-jsonld",
                    f"JSON-LD @type is '{actual_type}', expected '{expected_type}' for this page.",
                    script.line,
                ))

    order_markers = [n for n in (theme_color, robots) if n is not None]
    seo_block = [n for n in ([canonical] + og_metas + twitter_metas + jsonld_scripts) if n is not None]
    if order_markers and seo_block:
        min_marker_order = min(n.order for n in order_markers)
        if any(n.order < min_marker_order for n in seo_block):
            issues.append(Issue(
                path, "WARN", "seo-order",
                "Canonical/OG/Twitter/JSON-LD tags should appear after the theme-color/robots meta tags.",
            ))
    if csp is not None and seo_block:
        if any(n.order > csp.order for n in seo_block):
            issues.append(Issue(
                path, "WARN", "seo-order",
                "Canonical/OG/Twitter/JSON-LD tags should appear before the CSP meta tag.",
            ))

    return issues


def check_headings(path: str, root: Node) -> list[Issue]:
    issues: list[Issue] = []
    h1_nodes = find_all(root, lambda n: n.tag == "h1")

    if len(h1_nodes) == 0:
        issues.append(Issue(path, "ERROR", "heading-h1", "Page has no <h1>."))
    elif len(h1_nodes) > 1:
        issues.append(Issue(path, "ERROR", "heading-h1", f"Page has {len(h1_nodes)} <h1> tags, expected exactly one."))
    else:
        h1_text = h1_nodes[0].text().strip()
        if not h1_text:
            issues.append(Issue(path, "ERROR", "heading-h1", "The <h1> has no text content.", h1_nodes[0].line))
        elif h1_text.lower() in GENERIC_H1_TEXT:
            issues.append(Issue(
                path, "WARN", "heading-h1",
                f"<h1>{h1_text}</h1> reads as a generic placeholder rather than the page's actual subject.",
                h1_nodes[0].line,
            ))

    for label in find_all(root, lambda n: n.has_class("section-label")):
        if label.tag in HEADING_TAGS:
            continue
        container = label.find_ancestor("section") or label.parent
        has_sibling_heading = any(
            n.tag in HEADING_TAGS and n is not label for n in container.walk()
        )
        if not has_sibling_heading:
            issues.append(Issue(
                path, "ERROR", "heading-caption",
                f"<{label.tag} class=\"section-label\"> is the only heading-like element for its section; "
                "use <h2>/<h3> instead of a styled div/span.",
                label.line,
            ))

    return issues


def check_images(path: str, root: Node, alt_registry: dict[str, list[tuple[str, str]]]) -> list[Issue]:
    issues: list[Issue] = []

    for img in find_all(root, lambda n: n.tag == "img"):
        src = img.attrs.get("src", "")
        if src == "":
            continue  # JS-populated lightbox template, not a live image

        alt = img.attrs.get("alt")
        if alt is None or alt.strip() == "":
            issues.append(Issue(path, "ERROR", "img-alt", f"<img src=\"{src}\"> has no alt text.", img.line))
        else:
            alt_registry.setdefault(alt.strip(), []).append((path, src))

        if img.attrs.get("loading") != "lazy" and not is_above_fold(img):
            issues.append(Issue(
                path, "WARN", "img-lazy",
                f"<img src=\"{src}\"> is below the fold and missing loading=\"lazy\".", img.line,
            ))

        width = img.attrs.get("width")
        height = img.attrs.get("height")
        if width is None or height is None:
            issues.append(Issue(path, "ERROR", "img-dimensions", f"<img src=\"{src}\"> is missing width/height attributes.", img.line))
        else:
            try:
                declared = (int(width), int(height))
            except ValueError:
                issues.append(Issue(path, "ERROR", "img-dimensions", f"<img src=\"{src}\"> has non-numeric width/height.", img.line))
                declared = None
            if declared:
                asset_path = resolve_asset_path(path, src)
                actual = get_image_dimensions(asset_path) if asset_path and os.path.isfile(asset_path) else None
                # data-crop="intentional" marks thumbnails deliberately cropped via CSS object-fit,
                # where width/height are set to the rendered box, not the source file's aspect ratio.
                if actual and actual != declared and img.attrs.get("data-crop") != "intentional":
                    declared_ratio = declared[0] / declared[1]
                    actual_ratio = actual[0] / actual[1]
                    if abs(declared_ratio - actual_ratio) > 0.02:
                        issues.append(Issue(
                            path, "WARN", "img-dimensions",
                            f"<img src=\"{src}\"> declares {declared[0]}x{declared[1]} but the file is "
                            f"{actual[0]}x{actual[1]} (aspect ratio differs) - verify this is an intentional crop.",
                            img.line,
                        ))

        picture = img.parent if img.parent and img.parent.tag == "picture" else None
        if picture is not None:
            has_webp_source = any(
                c.tag == "source" and c.attrs.get("type") == "image/webp" for c in picture.children
            )
            if not has_webp_source:
                issues.append(Issue(path, "WARN", "img-webp", f"<picture> around <img src=\"{src}\"> has no image/webp <source>.", img.line))
        elif not src.lower().endswith(".svg"):
            issues.append(Issue(
                path, "INFO", "img-webp",
                f"<img src=\"{src}\"> is not wrapped in <picture> with a WebP <source>.", img.line,
            ))

    return issues


def check_html_security(path: str, root: Node) -> list[Issue]:
    issues: list[Issue] = []
    csp = next(
        (n for n in find_all(root, lambda n: n.tag == "meta") if n.attrs.get("http-equiv") == "Content-Security-Policy"),
        None,
    )
    if csp is None:
        issues.append(Issue(path, "ERROR", "sec-csp", "Page has no Content-Security-Policy meta tag."))
    else:
        content = csp.attrs.get("content", "")
        script_src_match = re.search(r"script-src\s+([^;]+)", content)
        script_src = script_src_match.group(1) if script_src_match else ""
        if "unsafe-inline" in script_src or "unsafe-eval" in script_src:
            issues.append(Issue(path, "ERROR", "sec-csp", "script-src allows 'unsafe-inline' or 'unsafe-eval'.", csp.line))

    for script in find_all(root, lambda n: n.tag == "script"):
        src = script.attrs.get("src", "")
        if (
            src
            and CDN_SCRIPT_PATTERN.match(src)
            and not script.attrs.get("integrity")
            and not SRI_EXEMPT_SCRIPT_HOSTS.match(src)
        ):
            issues.append(Issue(path, "ERROR", "sec-sri", f"External script '{src}' has no integrity (SRI) attribute.", script.line))
        if script.attrs.get("type") == "application/ld+json":
            continue
        text = script.own_text()
        if not text.strip():
            continue
        for match in UNSAFE_DOM_SINK.finditer(text):
            issues.append(Issue(path, "ERROR", "sec-dom-sink", f"Unsafe DOM sink usage: '{match.group(0)}'.", script.line))
        for match in UNSAFE_EXEC_SINK.finditer(text):
            issues.append(Issue(path, "ERROR", "sec-exec-sink", f"Unsafe execution sink usage: '{match.group(0)}'.", script.line))

    return issues


def check_js_file(path: str, relpath: str) -> list[Issue]:
    issues: list[Issue] = []
    with open(path, "r", encoding="utf-8") as handle:
        text = handle.read()

    for match in UNSAFE_DOM_SINK.finditer(text):
        line = text.count("\n", 0, match.start()) + 1
        issues.append(Issue(relpath, "ERROR", "sec-dom-sink", f"Unsafe DOM sink usage: '{match.group(0)}'.", line))
    for match in UNSAFE_EXEC_SINK.finditer(text):
        line = text.count("\n", 0, match.start()) + 1
        issues.append(Issue(relpath, "ERROR", "sec-exec-sink", f"Unsafe execution sink usage: '{match.group(0)}'.", line))
    if re.search(r"document\.cookie", text):
        line = text.count("\n", 0, re.search(r"document\.cookie", text).start()) + 1
        issues.append(Issue(relpath, "WARN", "sec-cookie", "Direct document.cookie access; verify HttpOnly/Secure/SameSite are set server-side.", line))
    for match in SUSPICIOUS_STORAGE_KEY.finditer(text):
        key_name = match.group(1)
        if SUSPICIOUS_STORAGE_NAME.search(key_name):
            line = text.count("\n", 0, match.start()) + 1
            issues.append(Issue(relpath, "ERROR", "sec-storage", f"Session-like value '{key_name}' stored in local/sessionStorage instead of an HttpOnly cookie.", line))
    for match in POSTMESSAGE_LISTENER.finditer(text):
        window = text[match.end():match.end() + 400]
        if "event.origin" not in window and ".origin" not in window:
            line = text.count("\n", 0, match.start()) + 1
            issues.append(Issue(relpath, "ERROR", "sec-postmessage", "postMessage listener does not appear to validate event.origin.", line))

    return issues


def collect_alt_duplicates(alt_registry: dict[str, list[tuple[str, str]]]) -> list[Issue]:
    issues: list[Issue] = []
    for alt_text, usages in alt_registry.items():
        distinct_srcs = {src for _, src in usages}
        if len(distinct_srcs) > 1:
            locations = ", ".join(f"{p} ({s})" for p, s in usages)
            issues.append(Issue(
                "(sitewide)", "WARN", "img-alt-duplicate",
                f"alt text \"{alt_text}\" is reused across different images: {locations}.",
            ))
    return issues


def run(site_root: str) -> list[Issue]:
    issues: list[Issue] = []
    alt_registry: dict[str, list[tuple[str, str]]] = {}

    html_files = []
    for dirpath, _dirnames, filenames in os.walk(site_root):
        for filename in filenames:
            if filename.endswith(".html"):
                html_files.append(os.path.join(dirpath, filename))
    html_files.sort()

    for full_path in html_files:
        relpath = os.path.relpath(full_path, REPO_ROOT)
        root = parse_html(full_path)
        robots_meta = next(
            (n for n in find_all(root, lambda n: n.tag == "meta") if n.attrs.get("name") == "robots"), None
        )
        is_noindex = bool(robots_meta and "noindex" in robots_meta.attrs.get("content", ""))
        is_project_page = os.path.basename(full_path) not in ("index.html", "about.html", "builds.html")

        issues += check_seo_metadata(relpath, root, is_project_page, is_noindex)
        issues += check_headings(relpath, root)
        issues += check_images(relpath, root, alt_registry)
        issues += check_html_security(relpath, root)

    issues += collect_alt_duplicates(alt_registry)

    js_files = []
    for dirpath, _dirnames, filenames in os.walk(site_root):
        for filename in filenames:
            if filename.endswith(".js"):
                js_files.append(os.path.join(dirpath, filename))
    js_files.sort()

    for full_path in js_files:
        relpath = os.path.relpath(full_path, REPO_ROOT)
        issues += check_js_file(full_path, relpath)

    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root", default=os.path.join(REPO_ROOT, "docs"),
        help="Path to the published site root to audit (default: docs/).",
    )
    args = parser.parse_args()

    issues = run(os.path.abspath(args.root))
    issues.sort(key=lambda i: (i.path, i.line or 0))

    for issue in issues:
        print(issue)

    error_count = sum(1 for i in issues if i.level == "ERROR")
    warn_count = sum(1 for i in issues if i.level == "WARN")
    info_count = sum(1 for i in issues if i.level == "INFO")
    print(f"\n{len(issues)} issue(s): {error_count} error(s), {warn_count} warning(s), {info_count} info.")

    return 1 if error_count else 0


if __name__ == "__main__":
    sys.exit(main())
