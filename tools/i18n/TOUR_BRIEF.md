# Tour page translation brief

File: docs/<LANG>/tour.html (a skeleton built from docs/tour.html: links, hreflang, switcher, html lang, canonical are already right; the text is English). Translate it in place. Read /home/claude/site/tools/i18n/BRIEF.md first: all its rules apply (markup untouched, no em dashes ever, ~/labels and terminal-style strings stay English, never add/drop/strengthen a claim, keep facts and numbers).

This page is the "2027 European Tour" of a one-person AI studio with a van as mobile office, written like a rock band's tour page. Tone: dry, confident, funny. Jokes must land in the target language (rework them as a native copywriter would, same meaning): "Europe is closed anyway", "0 crows on board", "Tickets are free; the parking spot is the price", "bar opens when the build passes CI", "Fritz. Bring a treat.", "They need no parking."

Also translate these data attributes (they are words the page script shows): data-tpl-next, data-tpl-now, data-tpl-done (keep {cities} and {days}), data-l-now, data-l-next, data-l-later, data-l-done; the SVG <title>; all alt and aria-label texts; the leg chips default text; the nav labels the way the other pages in docs/<LANG>/ already do it (copy the nav labels from docs/<LANG>/index.html; "tour" label: nl tour, de Tour, fr tournée, it tour, es gira, pt digressão, lt turas).

City names: keep the local endonyms everywhere (Milano, Roma, Barcelona, Madrid, Lyon, Paris, Porto, Lisboa, Berlin, Vilnius, Kaunas): they are the names people in those cities search, and the tour poster uses them. Country names and month names: translate.

LOCATION SEO (important): the tour cities are the page's location markers. For your language:
- <title> (≤60 chars) and meta description (≤155) lead with the tour cities of your own country and the leg months, then the tour. og/twitter title and description match them. JSON-LD "name" and "description": translate, keeping every city named.
- Your country's leg: <COUNTRY_LEG>.
- Put the category term of your language once in the description or lead paragraph (see what docs/<LANG>/index.html uses: KI-Agentur, agenzia/agenti AI, agencia de IA, agence IA, agentes de IA, AI-bureau/AI-agents, DI agentai), so the page reads "AI agency + city + 2027".
- Do not invent offices, addresses or dates beyond the months given.

Check: python3 tools/check_locale.py <LANG> tour.html  (for lt use the same command: python3 tools/check_locale.py lt tour.html) until OK. Use only /tmp/tour-<LANG>/ for scratch files. No git. Report the title, description and anything you had to rework.
