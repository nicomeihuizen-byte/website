"""Check a translated page keeps the markup of its skeleton.

python tools/check_locale.py <lang> [page ...]

Compares the tag sequence and every non-text attribute of docs/<lang>/<page>
against the skeleton built from English (tools/mk_locales.py, in memory), and
checks JSON-LD still parses and no em dash crept in. Exit 1 on any problem.
"""
import json, os, re, sys
from html.parser import HTMLParser
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mk_locales as mk

FREE = {'alt', 'title', 'aria-label', 'content', 'placeholder', 'aria-description',
        'data-label', 'data-tip', 'data-q', 'data-ask', 'value', 'data-fritz-ask', 'data-msg-required', 'data-msg-sending', 'data-msg-success', 'data-msg-error', 'data-msg-network-error',
        'data-tpl-next', 'data-tpl-now', 'data-tpl-done', 'data-l-now', 'data-l-next', 'data-l-later', 'data-l-done',
        'data-stop-user', 'data-stop-say', 'data-stop-hint', 'data-fritz-stop', 'data-when'}


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tags = []
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, tuple(sorted((k, v) for k, v in attrs if k not in FREE))))
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)


def tags(html):
    p = P(); p.feed(html); return p.tags


def skeleton(lang, page):
    with open(os.path.join(mk.DOCS, page), encoding='utf-8') as f:
        html = f.read()
    html = mk.rewrite_body_links(html, lang, page)
    html = mk.fix_meta(html, lang, page)
    return mk.fix_head_links(html, lang, page)


def check(lang, page):
    bad = []
    with open(os.path.join(mk.DOCS, lang, page), encoding='utf-8') as f:
        got = f.read()
    a, b = tags(skeleton(lang, page)), tags(got)
    if len(a) != len(b):
        bad.append('tag count %d vs skeleton %d' % (len(b), len(a)))
    for i, (x, y) in enumerate(zip(a, b)):
        if x != y:
            bad.append('tag #%d differs:\n   want %s\n   got  %s' % (i, x, y))
            break
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', got, re.S):
        try:
            json.loads(m.group(1))
        except Exception as e:
            bad.append('JSON-LD does not parse: %s' % e)
    if '—' in got:
        bad.append('%d em dash(es)' % got.count('—'))
    return bad


if __name__ == '__main__':
    lang = sys.argv[1]
    pages = sys.argv[2:] or mk.PAGES
    fail = 0
    for p in pages:
        bad = check(lang, p)
        print(('OK   ' if not bad else 'FAIL ') + lang + '/' + p)
        for x in bad:
            print('   ', x)
        fail |= bool(bad)
    sys.exit(fail)
