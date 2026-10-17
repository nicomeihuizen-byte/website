"""Build the per-language skeletons of the main pages from the English source.

Run from the repo root:  python tools/mk_locales.py [lang ...]

For each main page and language it writes docs/<lang>/<page> with every
relative link rewritten for the extra folder level, links between main pages
kept inside the language, <html lang>, canonical, og:url, hreflang and the
language switcher set. The text stays English: translation is a second pass.
It also rewrites hreflang + switcher on the EN and LT originals (idempotent).
"""
import os, re, sys, posixpath

SITE = 'https://www.meihuizen.ai/'
DOCS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')
PAGES = ['index.html', 'about.html', 'builds.html', 'credentials.html', 'contact.html',
         'projects/second-audience.html', 'projects/agent-fritz.html',
         'projects/ai-sales-deal-intelligence.html', 'tour.html',
         'projects/off-grid-ai-homestead.html',
         'projects/second-audience-cases.html', 'status.html']
NEW = ['nl', 'de', 'fr', 'it', 'es', 'pt']
ALL = ['en', 'nl', 'de', 'fr', 'it', 'es', 'pt', 'lt']
LANG_LABEL = {'en': 'Site language', 'lt': 'Svetainės kalba', 'nl': 'Taal van de site',
              'de': 'Sprache der Website', 'fr': 'Langue du site', 'it': 'Lingua del sito',
              'es': 'Idioma del sitio', 'pt': 'Idioma do site'}


def url(lang, page):
    p = '' if page == 'index.html' else page
    return SITE + ('' if lang == 'en' else lang + '/') + p


def rel(from_page_path, to_path):
    """Relative link from the file at site path from_page_path to site path to_path."""
    d = posixpath.dirname(from_page_path) or '.'
    r = posixpath.relpath(to_path or '.', d)
    if to_path.endswith('/') or to_path == '':
        r = (r + '/') if r != '.' else './'
    return r


def page_of(path):
    """Site path -> main page name if it is one, else None."""
    p = path.split('#')[0].split('?')[0]
    if p == '' or p.endswith('/'):
        p = p + 'index.html'
    return p if p in PAGES else None


def hreflang_block(page):
    lines = ['<link rel="alternate" hreflang="%s" href="%s">' % (l, url(l, page)) for l in ALL]
    lines.append('<link rel="alternate" hreflang="x-default" href="%s">' % url('en', page))
    return '\n'.join(lines)


def switcher(lang, page, indent):
    here = (lang + '/' if lang != 'en' else '') + page
    out = ['%s<nav class="lang" aria-label="%s">' % (indent, LANG_LABEL[lang])]
    for l in ALL:
        target = (l + '/' if l != 'en' else '') + page
        if target.endswith('index.html'):
            target = target[:-len('index.html')]
        href = rel(here, target)
        cur = ' aria-current="true"' if l == lang else ''
        out.append('%s  <a href="%s" lang="%s" hreflang="%s"%s>%s</a>' % (indent, href, l, l, cur, l.upper()))
    out.append('%s</nav>' % indent)
    return '\n'.join(out)


def fix_head_links(html, lang, page):
    html = re.sub(r'(?:<link rel="alternate" hreflang="[^"]+" href="[^"]+">\s*)+',
                  hreflang_block(page) + '\n', html, count=1)
    html = re.sub(r'([ \t]*)<nav class="lang"[^>]*>.*?</nav>',
                  lambda m: switcher(lang, page, m.group(1)), html, count=1, flags=re.S)
    return html


ATTR = re.compile(r'\b(href|src|srcset|action|data-src)="([^"]*)"')


def rewrite_body_links(html, lang, page):
    src_dir = posixpath.dirname(page)
    new_page = lang + '/' + page

    def one(v):
        v = v.strip()
        if not v or v.startswith(('#', 'mailto:', 'tel:', 'data:', 'javascript:')):
            return v
        if v.startswith(SITE):
            path = v[len(SITE):]
            pg = page_of(path)
            if pg:
                frag = v[v.index('#'):] if '#' in v else ''
                return url(lang, pg) + frag
            return v
        if re.match(r'^[a-z]+:', v) or v.startswith('//'):
            return v
        if v.startswith('/'):
            pg = page_of(v[1:])
            if pg:
                frag = v[v.index('#'):] if '#' in v else ''
                return '/' + lang + '/' + ('' if pg == 'index.html' else pg) + frag
            return v
        path, frag = (v.split('#', 1) + [''])[:2]
        frag = ('#' + frag) if '#' in v else ''
        target = posixpath.normpath(posixpath.join(src_dir, path)) if path else page
        if path.endswith('/') or path in ('.', './'):
            target = (target + '/').lstrip('./') if target != '.' else ''
        if target == '.':
            target = ''
        pg = page_of(target)
        if pg:
            return v  # mirrored structure: same relative link stays in the language
        r = rel(new_page, target)
        return r + frag

    def sub(m):
        name, val = m.group(1), m.group(2)
        if name == 'srcset':
            parts = [p.strip() for p in val.split(',')]
            val2 = ', '.join(' '.join([one(p.split()[0])] + p.split()[1:]) for p in parts if p)
            return '%s="%s"' % (name, val2)
        return '%s="%s"' % (name, one(val))

    # leave hreflang/switcher (already absolute or handled) alone: they are rebuilt after
    return ATTR.sub(sub, html)


def fix_meta(html, lang, page):
    html = re.sub(r'<html lang="[^"]*"', '<html lang="%s"' % lang, html, count=1)
    me = url(lang, page)
    html = re.sub(r'(<link rel="canonical" href=")[^"]*(")', r'\g<1>%s\g<2>' % me, html, count=1)
    html = re.sub(r'(<meta property="og:url" content=")[^"]*(")', r'\g<1>%s\g<2>' % me, html, count=1)

    def jsonld(m):
        block = m.group(0)
        def u(mm):
            v = mm.group(2)
            if v.startswith(SITE):
                pg = page_of(v[len(SITE):])
                if pg:
                    return '%s"%s"' % (mm.group(1), url(lang, pg))
            return mm.group(0)
        block = re.sub(r'("(?:url|mainEntityOfPage)"\s*:\s*)"([^"]*)"', u, block)
        block = re.sub(r'"inLanguage"\s*:\s*"[^"]*"', '"inLanguage": "%s"' % lang, block)
        return block
    html = re.sub(r'<script type="application/ld\+json">.*?</script>', jsonld, html, flags=re.S)
    return html


def build(lang, pages=None):
    for page in (pages or PAGES):
        with open(os.path.join(DOCS, page), encoding='utf-8') as f:
            html = f.read()
        html = rewrite_body_links(html, lang, page)
        html = fix_meta(html, lang, page)
        html = fix_head_links(html, lang, page)
        out = os.path.join(DOCS, lang, page)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, 'w', encoding='utf-8', newline='\n') as f:
            f.write(html)
        print('wrote', lang + '/' + page)


def refresh_originals():
    for lang in ('en', 'lt'):
        for page in PAGES:
            path = os.path.join(DOCS, page) if lang == 'en' else os.path.join(DOCS, 'lt', page)
            with open(path, encoding='utf-8') as f:
                html = f.read()
            new = fix_head_links(html, lang, page)
            if new != html:
                with open(path, 'w', encoding='utf-8', newline='\n') as f:
                    f.write(new)
                print('updated', path)


if __name__ == '__main__':
    langs = sys.argv[1:] or NEW
    if langs == ['originals']:
        refresh_originals()
    elif langs and langs[0] == 'page':
        for l in langs[2:] or NEW:
            build(l, [langs[1]])
    else:
        for l in langs:
            build(l)
