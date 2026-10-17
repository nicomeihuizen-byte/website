"""Regenerate the I18N table in docs/scripts/home.js from tools/i18n/home_<lang>.json.

python tools/build_home_i18n.py   (run from the repo root, in bash)
"""
import json, os, re
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
LANGS = ['en', 'nl', 'de', 'fr', 'it', 'es', 'pt', 'lt']
D = {l: json.load(open(os.path.join(ROOT, 'tools', 'i18n', 'home_%s.json' % l), encoding='utf-8')) for l in LANGS}
f = os.path.join(ROOT, 'docs', 'scripts', 'home.js')
s = open(f, encoding='utf-8').read()
s2 = re.sub(r'/\*I18N-START\*/.*?/\*I18N-END\*/',
            lambda m: '/*I18N-START*/' + json.dumps(D, ensure_ascii=False, indent=1) + '/*I18N-END*/', s, count=1, flags=re.S)
open(f, 'w', encoding='utf-8', newline='\n').write(s2)
print('home.js', 'updated' if s2 != s else 'unchanged')
