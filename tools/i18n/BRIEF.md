# Translation brief: meihuizen.ai main pages

Repo: /home/claude/site (static site, served from docs/). English is the source of truth.

## Your files
docs/<LANG>/ holds skeletons of 8 pages, built by tools/mk_locales.py from the English pages:
index.html, about.html, builds.html, credentials.html, contact.html,
projects/second-audience.html, projects/agent-fritz.html, projects/ai-sales-deal-intelligence.html

Links, paths, <html lang>, canonical, og:url, hreflang and the language switcher are ALREADY correct. The text is still English. Translate the text in place, file by file (Read the file, Write it back translated). Do not touch any other file except tools/i18n/home_<LANG>.json (see below).

## What to translate
- All visible text, <title>, meta description, og:title/og:description, twitter:title/twitter:description.
- alt, title, aria-label, placeholder attributes.
- JSON-LD: human-language strings only (description, jobTitle, name of a service/offer, knowsAbout entries that are plain words, roleName may stay as the real English job title since it is a record). Keep every key, URL, @id, date, number, identifier exactly. JSON must stay valid.
- Nav labels: translate (home, builds, about, credentials, contact), the way docs/lt/ does it for Lithuanian.

## What NOT to change
- Any tag, class, id, href, src, data-* attribute (except the free-text ones listed above), the order of elements, inline SVG. The checker compares the markup tag by tag.
- Terminal-style labels and commands stay English, as on the Lithuanian pages: `~/section` path labels, `$ fritz --grounded ...`, `↳ read_page credentials.html`, file names, code/JSON samples inside <pre>/<code>.
- Names: meihuizen.ai, MB Meihuizen AI, Mažoji bendrija Meihuizen AI, Agent Fritz, Fritz, Five, Five Deal Management, Second Audience, Registrų centras, company code 308157412, address, phone, emails, employer names, certification names, sales methodology names (SPIN, Challenger, MEDDPICC).
- Facts: never add, drop, soften or strengthen a claim. Same prices, dates, numbers. Localise number/currency format to the language's convention only.
- docs/lt/ is a useful reference for what was kept English, but some LT pages are older than EN: translate from the skeleton (= current English), not from LT.

## Style
- Formal register throughout: NL u, DE Sie, FR vous, IT Lei, ES usted, PT você/forma de tratamento formal in European Portuguese (pt-PT, not Brazilian).
- NEVER use an em dash (—). Use commas, colons, semicolons, periods or parentheses. En dash in number ranges is also to be avoided; write "10:00 to 18:00" equivalents in words or with "–" only if the English has it. Simplest: no dashes as punctuation.
- Voice: short, plain, confident, slightly dry humour. Write like a native B2B copywriter would, not a literal translation. Keep headlines punchy.
- SEO: <title> max ~60 characters, meta description max ~155 characters, built around the term people in that country actually search (DE: KI, KI-Agenten; FR: IA, agents IA; ES/PT: IA, agentes de IA; NL: AI, AI-agents; IT: see Italian brief). og/twitter title+description match title+description. The h1 should carry the page's main search term where it reads naturally.

## home.js strings
Also write tools/i18n/home_<LANG>.json, same keys as tools/i18n/home_en.json, translated. These are typed live on the home page hero chat and status strip. Keep {n}, {a}, {b}, {time}, {reply} placeholders. The W reply strings (today/next/from10/tomorrow/monday) show alone in the status strip AND are inserted as {reply} into the "closed" and "price.closed" sentences: word all of them so both uses read naturally (rephrase the templates as needed). Keep "✓", "→", "@Fritz", "Registrų centras". Valid JSON.

## Check before you finish
Run: python3 tools/check_locale.py <LANG>
All 8 must print OK (markup identical to skeleton, JSON-LD parses, no em dash). Fix and rerun until clean. Also run python3 -c "import json;json.load(open('tools/i18n/home_<LANG>.json'))".
Finally report: OK status, the 8 titles and meta descriptions you chose, and any English source text you think is wrong or unclear (do not fix English pages yourself).
