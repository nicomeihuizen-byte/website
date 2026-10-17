# Local search retune: meihuizen.ai, one locale

The 8 main pages exist in docs/<LANG>/ (index, about, builds, credentials, contact, projects/second-audience, projects/agent-fritz, projects/ai-sales-deal-intelligence). They are translated and correct, but traffic from this country is low: the copy uses generic terms, not what people in this country actually type. Your job: research real local search language, then retune the SEO-bearing copy.

## 1. Research (WebSearch, mode standard; extended only when thin)
For each product, find the words people in this country use, from the country's own sources: national press, agencies selling the same service there, competitors ranking in that language, government/industry reports, Google's own country blog. Topics:
- Company/home: AI agents for business, agentic AI, custom AI software, AI for SMEs (note the local SME acronym and whether people write AI, KI or IA).
- Second Audience (what ChatGPT/AI agents say about a company, AI visibility audit): GEO / generative engine optimization, "how to appear in ChatGPT", AI visibility, AI Overviews, LLM SEO, in local phrasing.
- Agent Fritz (AI sales agent on a website, books meetings, qualifies leads, answers only from the site): AI chatbot for website, AI sales assistant, lead qualification, virtual assistant.
- Five (AI deal management for 1 to 5 salespeople, explicitly NOT a CRM, no forecasting): AI for sales, deal/pipeline management, sales follow-up. Do not target "CRM" as if Five were one; "not a CRM" angles are fine.
- Any local hook that makes a page relevant (e.g. local regulation, subsidies) ONLY if the page content already supports it.
Note which term variant dominates (e.g. KI-Agenten vs AI-Agenten; agentes de IA vs agentes IA; agentes IA vs agentes de inteligência artificial).

## 2. Retune (edit docs/<LANG>/ files in place)
Per page: pick one primary term and 1 or 2 secondary terms. Place them naturally in <title> (front-loaded, ≤60 chars), meta description (≤155, with a reason to click), og:title/og:description and twitter:title/twitter:description (match), the h1 where it reads naturally, the first paragraph, and at most one or two h2s, plus JSON-LD "description" where present. Home and builds must not target the same primary term.
Rules:
- Change text only. Never touch tags, classes, hrefs, data-* attributes or structure. Never add, drop, soften or strengthen a claim. No keyword stuffing; must read like a native B2B copywriter wrote it.
- Formal register as already used on the pages. NEVER use an em dash (—).
- Terminal labels (~/..., commands, ↳ lines, code) stay English.
Check: run `python3 tools/check_locale.py <LANG>` (for lt: `python3 tools/check_locale.py lt --orig` is not available; for lt instead run `python3 tools/check_lt.py`) until all OK.

Use only your own scratch folder /tmp/seo-<LANG>/ for any helper files. Other agents work on other locales at the same time: never touch another locale's files.

## 3. Report
Short: the dominant local terms you found (with 1 source URL each), and per page: primary term, title, description, where placed. Plus anything in the page content that blocks a strong local term (so the owner can decide).
