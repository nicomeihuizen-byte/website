# Privacy inventory: meihuizen.ai

Every place personal data comes in, where it goes, how long it stays.
Source material for the privacy page. Lives in the repo root, not in `docs/`, so it is never published.
Update it whenever code changes what data moves.

Status per line: **code** = verified in the code on 29 Sep 2026. **verify** = depends on a provider's terms or a dashboard setting; check before it goes on the page. **Nico** = only Nico can answer.

Controller: MB Meihuizen AI, Laisvės al. 110, LT-44253 Kaunas, Lithuania, company number 308157412. Supervisory authority: the Lithuanian State Data Protection Inspectorate (VDAI).

## Every visitor, every page

| # | What | Data | Goes to | Kept | Status |
|---|------|------|---------|------|--------|
| 1 | Hosting | IP address, browser, URL requested | GitHub Pages (GitHub, US) | Per GitHub's privacy statement | verify |
| 2 | Fonts | IP address, browser, on every page load | Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) | Per Google | code |
| 3 | Analytics | Google Analytics 4, property `G-BNWQ23V8KC`, on every page. Loads immediately; sets `_ga` cookies; no consent step exists | Google (US) | GA4 retention setting in the property (default 2 months) plus cookie lifetime | code + verify |
| 4 | Theme choice | `light` or `dark` | `localStorage` in the visitor's own browser; never sent anywhere | Until the visitor clears it | code |
| 5 | Outbound links | Nothing until clicked. LinkedIn, X, GitHub, registrucentras.lt, Five are plain links, no embeds | n/a | n/a | code |

## Agent Fritz (chat)

| # | What | Data | Goes to | Kept | Status |
|---|------|------|---------|------|--------|
| 6 | Chat in the browser | Full conversation | `sessionStorage` in that tab only (`ask/ask.js`) | Until the tab closes | code |
| 7 | Chat function | Full conversation text, page path, language, IP address (request) | Vercel function, region Frankfurt (`fra1`) | Function stores nothing. Its one log line holds language, page, timing and totals, no text (`api/chat.js` 463) | code |
| 8 | Platform logs | IP address, URL, timing of each request | Vercel | Per Vercel plan's log retention | verify |
| 9 | The model | Full conversation plus the site pages Fritz reads | Anthropic API, model `claude-haiku-4-5` | Deleted within 30 days by default; up to 2 years if flagged by Anthropic's safety systems | verify (processing location and transfer basis: Anthropic DPA) |
| 10 | Rate limits | IP address as a counter key | Memory of one function instance | Lost on the next cold start; never written anywhere | code |
| 11 | Scan request | Requester, domain, phone, email, plus the full chat transcript | Email to Nico over Proton SMTP; confirmation email to the visitor | As long as Nico keeps it in the mailbox | code + Nico |
| 12 | Contact request | Name, company, email, phone, one-line topic, plus the full chat transcript | Email to Nico over Proton SMTP; confirmation email to the visitor | As long as Nico keeps it | code + Nico |
| 13 | Booking (once `FRITZ_BOOKING_URL` is set) | Whatever the visitor enters on the booking page | Proton Calendar | Per Proton and Nico's calendar | verify |

## Contact form

| # | What | Data | Goes to | Kept | Status |
|---|------|------|---------|------|--------|
| 14 | Site contact form (`scripts/contact-form.js` to `api/send-email`) | Name, email, message; IP for rate limiting (memory only) | Email to Nico over the `SMTP_*` mailbox | As long as Nico keeps it | code + Nico |

## Second Audience scan

| # | What | Data | Goes to | Kept | Status |
|---|------|------|---------|------|--------|
| 15 | Running the scan | The prospect's public web pages (business content) | Nico's tooling | ? | Nico |
| 16 | The report | Report sent from report@meihuizen.ai | Requester's inbox; copy in Proton | ? | Nico |

## Not personal data

- Evals (GitHub Actions): test questions only; contact and scan requests are dry runs, nobody is emailed.

## The two findings that matter

1. **Google Analytics runs on every page with no consent.** Cookies are set before the visitor agrees to anything. Under EU cookie rules that needs prior consent. It also sits badly next to "counts, not content" on the Fritz page.
2. **Google Fonts loads from Google on every page,** which hands every visitor's IP address to Google. Self-hosting the fonts removes this flow entirely.

Decision 29 Sep 2026: Google Analytics stays, behind a consent banner (Consent Mode v2, denied by default). Fonts: open.

## Open questions for Nico

- Which mailbox and provider does `SMTP_*` point to for the site contact form: Proton, or something else?
- How long do leads and scan requests stay in the mailbox? Pick a period; the page has to state one.
- Scan: what does your tooling store about a scanned site, and for how long?
- Is Five (sales-intel-rho.vercel.app) in scope for this page, or does it get its own?
