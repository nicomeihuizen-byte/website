# AGENTS.md

Guidance for AI coding agents (Claude, Copilot, Codex, etc.) working in this repository. `diagnostics.py` and the README already reference this file as the source of truth for site standards — this is that file.

## Project overview

A lightweight, static portfolio/company site for **meihuizen.ai**, built during the Metana AI Software Engineering bootcamp. Terminal-inspired visual design in two themes: light by default (off-white page, white cards, `#1F7D55` green) and the original dark (graphite surfaces, terminal green `#5FBF8E`), monospace interface text, restrained motion. No build step, no package manager, no framework — plain HTML/CSS/JS served as static files.

Live at [https://www.meihuizen.ai](https://www.meihuizen.ai), deployed via GitHub Pages with a custom domain pinned in `docs/CNAME`.

## Tech stack

- **Markup/styling:** HTML5 (semantic), CSS3 with custom properties (`--bg`, `--bg-raised`, `--line`, `--text-muted`, accent green) — every colour is a token, in two palettes (see Theming)
- **Scripting:** Vanilla JavaScript only — no frameworks, no bundler
- **Fonts:** Google Fonts — Space Grotesk, JetBrains Mono, Inter
- **Analytics:** Google Analytics 4 (`gtag.js`, measurement ID `G-BNWQ23V8KC`)
- **Contact form backend:** Vercel serverless function (`POST https://website-contact-function-4efp.vercel.app/api/send-email`), SMTP via nodemailer. SMTP credentials live only as Vercel environment variables — never commit them.
- **Hosting:** GitHub Pages, custom domain via `docs/CNAME`
- **CI:** GitHub CodeQL security analysis runs on every push (`.github/workflows/codeql.yml`)

## Theming

Light and dark, one set of token names. Both palettes are the ones measured for Five (`sales-intel`), so the site and the app are recognisably one product.

- **Light lives on the bare `:root`; dark is a values swap under `:root[data-theme="dark"]`.** That way a page paints light before any script runs, which is the whole reason there is no wrong-theme flash. GitHub Pages has no server to stamp the attribute from a cookie the way Five does.
- **`docs/scripts/theme.js`** is loaded in `<head>` **without `defer`** on every page. It stamps `data-theme="dark"` for a returning visitor who chose dark, wires the toggle, keeps `<meta name="theme-color">` in step, and fires a `themechange` event. It is `script-src 'self'`, so it needs no CSP hash — do not inline it, or every one of the 57 pages needs a new hash in its CSP meta tag.
- **The toggle** is a `<button class="theme-toggle" hidden>` in the navbar (project pages: beside the back link). It carries both labels, `light` and `dark`, and CSS hides one; the label names where the button takes you, not where you are. It starts `hidden` and `theme.js` reveals it, so no dead control without JavaScript.
- **No raw colours in CSS.** A hex outside the two `:root` blocks is a bug: it will be wrong in one of the themes. New surfaces use `--figure-bg`, `--raised-hover`, `--accent-hover`, `--on-accent`, `--header-bg`, `--dot-idle`, `--shadow-card`, `--glow-a`/`--glow-b`.
- **Two things paint their own pixels and so cannot inherit the theme.** The hero skyline (`docs/scripts/site.js`) reads `--accent` through `getComputedStyle` and repaints on `themechange`; it clears its canvas instead of filling it, so nothing shows through as a slab on white. The illustrative inline SVGs (project figures, builds thumbnails, title marks) are drawn fill-by-fill in the dark palette and keep a dark mat (`--figure-bg`) in light, which is how a screenshot behaves on a light page — recolouring them means ~1,600 fill attributes across seven locales.
- **The line-art PNGs** (logo, van) get `filter:brightness(.62) saturate(1.5)` in light only, which lands terminal green within a few points of `#1F7D55` — cheaper than a second set of files to keep in step.
- **Contrast** was checked, not eyeballed: every light token clears 4.5:1 on both the white card and the off-white page.

## Repository layout

```
website/
├── README.md
├── AGENTS.md            ← this file
├── diagnostics.py        # static-analysis audit script (see below)
└── docs/                 # GitHub Pages serves from here
    ├── index.html
    ├── about.html
    ├── projects/
    │   ├── vegetarian-ecommerce-website.html
    │   ├── off-grid-ai-homestead.html
    │   ├── terminal-portfolio-website.html
    │   ├── ai-sales-deal-intelligence.html  # AI Native Sales-Cycle Control case study
    │   └── project-pages.css        # shared layout/visual system for project pages
    ├── images/
    │   ├── main/
    │   ├── project_one/    # vegetarian ecommerce
    │   ├── project_two/    # off-grid AI
    │   └── project_three/  # terminal portfolio
    ├── scripts/
    │   └── contact-form.js
    ├── robots.txt
    ├── sitemap.xml
    ├── CNAME
    ├── favicon.ico
    └── _headers            # response-header CSP (see Security note below)
```

## Local development

No install step required.

```sh
python -m http.server 8000 --directory docs
```

Then open `http://localhost:8000/`.

## Validation — run before committing

Always run the diagnostics script after touching any HTML/CSS/JS under `docs/`:

```sh
python diagnostics.py
```

It audits every page in `docs/` and exits `1` if any `[ERROR]`-level issue is found (CI-safe). Fix all `[ERROR]`s before committing; treat `[WARN]` as should-fix and `[INFO]` as optional. Output format: `[LEVEL] path:line (rule) - message`.

What it checks, so you write pages that pass on the first run:

**SEO/metadata**
- Exactly one `<link rel="canonical">`, absolute URL starting with `https://www.meihuizen.ai`
- Open Graph: `og:title`, `og:description`, `og:image` (absolute URL), `og:url` (must match canonical), `og:type` (`website` / `profile` / `article` only)
- Twitter Card: `twitter:card` = `summary_large_image`, plus `twitter:title`, `twitter:description`, `twitter:image`
- One valid `<script type="application/ld+json">` block per page, with the expected `@type` (`Person` on index, `ProfilePage` on about, `CreativeWork` on project pages)
- Tag order: `theme-color`/`robots` → canonical/OG/Twitter/JSON-LD → CSP meta tag

**Headings**
- Exactly one `<h1>` per page, non-empty, and not a generic placeholder (avoid words like "home", "page", "untitled", "placeholder", "background", "overview", "content", "welcome")
- Any `class="section-label"` element needs a real sibling heading (`<h2>`/`<h3>`) nearby — don't rely on styled `<div>`/`<span>` alone

**Images**
- Every `<img>` needs non-empty, non-duplicated `alt` text
- Below-the-fold images need `loading="lazy"` (exempt: `hero` / `hero-logo` classes)
- Explicit numeric `width`/`height` matching the file's real aspect ratio (>2% variance warns) — mark deliberately cropped thumbnails (fixed CSS box + `object-fit: cover`) with `data-crop="intentional"` to exempt them
- Prefer `<picture>` with a WebP `<source>` over a bare `<img>`, except for SVGs

**Security (see below for the full policy — diagnostics enforces the mechanical parts)**
- CSP meta tag present; `script-src` may not include `unsafe-inline` or `unsafe-eval`
- External `<script src="http...">` tags need an `integrity` attribute (SRI) — JSON-LD blocks are exempt, as is `googletagmanager.com/gtag/js` (Google serves it per-measurement-ID and rotates content without notice, so a static hash would break analytics on the next update)
- No `.innerHTML =`, `.outerHTML =`, `insertAdjacentHTML(`, or `document.write(` anywhere (inline or in `docs/scripts/*.js`)
- No `eval(`, `new Function(`, or string-form `setTimeout`/`setInterval`
- No storing `token`/`auth`/`session_id`/`jwt`/`password`/`secret`-named keys in `localStorage`/`sessionStorage`
- Direct `document.cookie` access warns — cookies are expected to be HttpOnly/Secure/SameSite, set server-side
- `addEventListener('message', ...)` handlers must validate `event.origin`

Manual checks diagnostics.py doesn't cover — do these too: click through navigation, the hero animation, the contact form, and social links; confirm every image actually loads on every page; test the lightbox preview.

## Security conventions

- Every page ships a restrictive CSP as a `<meta http-equiv="Content-Security-Policy">` tag. Keep `script-src` free of `unsafe-inline`/`unsafe-eval` — put JS in `docs/scripts/*.js`, not inline `<script>` blocks. **One accepted exception:** the short gtag.js config snippet in `<head>` (`window.dataLayer = ...`, `gtag('js', ...)`, `gtag('config', ...)`) stays inline and is allow-listed via an exact SHA-256 hash in `script-src` (`'sha256-...'`) instead of being externalized. If that snippet is ever edited, regenerate the hash (`openssl dgst -sha256 -binary <file> | openssl base64`) and update the CSP meta tag on every page that uses it — a stale hash silently breaks the page under CSP with no visible error. This is a different mechanism from the SRI exemption above, which covers the *external* `<script src="https://www.googletagmanager.com/gtag/js?...">` tag that loads gtag.js itself, not this inline config block.
- `docs/_headers` carries the response-level CSP (including `frame-ancestors 'none'`) for hosts that honor it. **GitHub Pages does not process `_headers`** — if this site ever moves off GitHub Pages (Vercel, Netlify, Cloudflare Pages), the response-header CSP needs to be configured at that platform, not assumed from this file.
- Update DOM via `textContent`, never `innerHTML`/`outerHTML`/`insertAdjacentHTML`.
- Image paths are static; never build an `<img src>` from user-controlled input.
- External links use `rel="noopener"` (and `rel="noreferrer"` where appropriate) with `https://` only.
- The contact form's destination is pinned via CSP `connect-src` — don't widen it without a reason, and never put SMTP/API credentials in this repo (they live in Vercel env vars).

## Code style

- Classes: `PascalCase`
- Functions/variables: `camelCase`
- Filenames: `kebab-case`
- Never use `var` — `const`/`let` only
- No nested ternaries
- Comments should be minimal and specific — explain *why*, not *what*

## Adding a new project case study

1. Copy the most recently added page under `docs/projects/` (currently `ai-sales-deal-intelligence.html`) rather than starting from scratch, so CSP, SEO tags, and JSON-LD are already wired correctly.
2. Add matching images under a new `docs/images/project_x/` folder.
3. Link it from the homepage work list and, if relevant, from `docs/sitemap.xml`.
4. Run `python diagnostics.py` before committing.

## The crew roster on the about page

`about.html` (and its six translations) carries a section listing one human and the agents actually
in use, each with a one-line function. Two rules for anyone editing it:

- **It lists tools genuinely in the rotation.** If a tool stops being used, remove its card. These
  are the only claims on that page nobody outside the business can verify, on a site whose whole
  argument is that unverifiable claims are what agents get wrong. Nothing will flag a stale entry.
- **No vendor logos, ever.** Anthropic, OpenAI, Google and Microsoft all restrict logo use that
  implies partnership or endorsement, and a roster headed like this is the strongest possible
  implication of exactly that. The heads are ASCII, drawn in CSS via `.crew .c-*::before`, kept out
  of the markup so they do not pollute the text layer that agents read. The note under the roster
  states the position in one line and should stay.

## Deployment

Pushing to `main` publishes via GitHub Pages (custom domain from `docs/CNAME`). CodeQL runs automatically on push. There is no staging environment — treat `main` as production and validate locally (`http.server` + `diagnostics.py`) before pushing.
