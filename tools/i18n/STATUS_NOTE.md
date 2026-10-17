Page: docs/<LANG>/status.html (live status of meihuizen.ai services and the vendors they run on).
- Read tools/i18n/BRIEF.md first (register per language, no em dashes, what stays English). LT: lowercase jūs, natural Lithuanian.
- Vendor and product names stay as they are: GitHub, GitHub Pages, Vercel, Anthropic Claude API, Upstash, Google Workspace, Proton Mail, Telegram, Supabase, UpCloud, OpenAI, Google Gemini, Perplexity, Google Cloud, Agent Fritz, Five, Second Audience. "Frankfurt region" may be translated.
- Translate the data-w-*, data-n-* and data-b-* attributes on the st-banner div: they are the words the live script writes (light words, "runs on", "vendor update", "source →", banner titles). Keep the placeholders {when}, {n} and {total} exactly, in whatever position your grammar needs. The light words (operational, degraded, down, unknown) must match the legend words under the banner in meaning and preferably in form.
- data-n-* are the service names as shown in the rows: "Website", "Contact form and requests", "Second Audience scans" (keep "Second Audience").
- "info(at)meihuizen.ai" stays exactly as is.
- Match the nav, strip and footer wording of docs/<LANG>/index.html (open it and reuse its words for home, builds, about, credentials, tour, contact, office hours, terms, status).
- SEO: title like "meihuizen.ai | <Status in your language>", description (<=155) translated.
Check: python3 tools/check_locale.py <LANG> status.html until OK.
