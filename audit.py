import os
import glob
import re
from html.parser import HTMLParser

# (1) Enumerate HTML pages except docs/projects/pages duplicates
docs_dir = 'docs'
all_html_files = glob.glob(os.path.join(docs_dir, '**', '*.html'), recursive=True)
pages = [f.replace('\\', '/') for f in all_html_files if 'docs/projects/pages' not in f.replace('\\', '/')]
pages.sort()

# Pre-compile patterns
csp_re = re.compile(r'Content-Security-Policy', re.I)

class WebAuditParser(HTMLParser):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        self.h1_count = 0
        self.canonical = None
        self.og = {}
        self.twitter = {}
        self.json_ld_count = 0
        self.csp = None
        self.images = []
        self.inside_script_json_ld = False
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'h1':
            self.h1_count += 1
        elif tag == 'link':
            if attrs_dict.get('rel') == 'canonical':
                self.canonical = attrs_dict.get('href')
        elif tag == 'meta':
            # Check OG
            prop = attrs_dict.get('property', '')
            if prop.startswith('og:'):
                self.og[prop] = attrs_dict.get('content')
            # Check Twitter
            name = attrs_dict.get('name', '')
            if name.startswith('twitter:'):
                self.twitter[name] = attrs_dict.get('content')
            # Check CSP
            http_equiv = attrs_dict.get('http-equiv', '')
            if csp_re.search(http_equiv):
                self.csp = attrs_dict.get('content')
        elif tag == 'script':
            script_type = attrs_dict.get('type', '')
            if script_type == 'application/ld+json':
                self.json_ld_count += 1
        elif tag == 'img':
            src = attrs_dict.get('src')
            alt = attrs_dict.get('alt')  # Note: None if omitted, "" if alt=""
            width = attrs_dict.get('width')
            height = attrs_dict.get('height')
            loading = attrs_dict.get('loading')
            self.images.append({
                'src': src,
                'alt': alt,
                'width': width,
                'height': height,
                'loading': loading,
                'has_alt': 'alt' in attrs_dict
            })

print(f"HTML pages enumerated ({len(pages)}):")
for p in pages:
    print(f"  - {p}")

for p in pages:
    print(f"\nAuditing page: {p}")
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    parser = WebAuditParser(p)
    parser.feed(content)
    
    print(f"  H1 count: {parser.h1_count}")
    print(f"  Canonical tag: {'Present (' + parser.canonical + ')' if parser.canonical else 'MISSING'}")
    
    # Required OG: title, description, image, url, type (per common spec / request)
    required_og = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']
    missing_og = [field for field in required_og if field not in parser.og]
    print(f"  Missing OG fields: {', '.join(missing_og) if missing_og else 'None'}")
    
    # Required Twitter: card, title, description, image
    required_tw = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']
    missing_tw = [field for field in required_tw if field not in parser.twitter]
    print(f"  Missing Twitter fields: {', '.join(missing_tw) if missing_tw else 'None'}")
    
    print(f"  JSON-LD: {'Present (' + str(parser.json_ld_count) + ')' if parser.json_ld_count > 0 else 'MISSING'}")
    print(f"  CSP Meta: {parser.csp if parser.csp else 'MISSING'}")
    
    print(f"  Image tags ({len(parser.images)} total):")
    is_index = 'index.html' in os.path.basename(p)
    for idx, img in enumerate(parser.images, 1):
        src = img['src']
        alt = img['alt']
        width = img['width']
        height = img['height']
        loading = img['loading']
        has_alt = img['has_alt']
        
        is_placeholder = (src == "" or src is None)
        status = []
        if not has_alt:
            status.append("missing alt")
        if not width:
            status.append("missing width")
        if not height:
            status.append("missing height")
        if not is_index:
            if loading != 'lazy':
                status.append(f"loading={loading if loading else 'missing'}")
                
        prefix = "Placeholder Image" if is_placeholder else f"Image src='{src}'"
        print(f"    {idx}. {prefix}: {', '.join(status) if status else 'OK'}")

