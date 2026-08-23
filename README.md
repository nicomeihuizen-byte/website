# Personal Website

Personal portfolio website for Nico Meihuizen, built as a lightweight static site during the Metana bootcamp. It exists to land freelance and full-time software engineering work by showing practical, working projects rather than a marketing landing page. The visual direction is a terminal-inspired portfolio: dark graphite surfaces, terminal green accents, monospace interface text, and restrained motion.

Live at [https://www.meihuizen.ai](https://www.meihuizen.ai).

## What Is Included

The website is contained in `website/docs` and can be opened directly from the filesystem or served by any static web server.

### Pages

- `index.html` is the home page. It contains the terminal-style hero, a short builds teaser linking to `builds.html`, contact form, social links, and footer.
- `builds.html` is the recent-builds/work index page. It presents the same work list that used to live inline on the home page (project tags and image previews for each case study), plus links to about and contact.
- `about.html` presents the professional background, technology stack, page navigation, social links, and footer.
- `projects/vegetarian-ecommerce-website.html` presents the completed vegetarian ecommerce project and links into the active project sequence.
- `projects/off-grid-ai-homestead.html` presents the active One Acre, Zero Dependency off-grid farming project, including SEO metadata, project galleries, and image lightboxes.
- `projects/terminal-portfolio-website.html` is a case study on this site's own build, covering its interface, functionality, implementation, and security practices. It's written from the inside since Nico built it. It's not yet promoted to the home page's active work list.
- `projects/project-four.html` is reserved for the next case study once a new project ships.
- `projects/project-pages.css` provides the shared layout and visual system for all project pages.

### Assets

Images are stored in `website/docs/images` and use descriptive filenames. The `project_one`/`project_two`/`project_three` folder names predate the page-slug renames above and were intentionally left alone. Renaming them would mean updating every image `src` path across multiple HTML files for no real benefit. Each entry below is labeled by the page it supports, using the current filename:

- `main/digital-nomad-logo.png` is the hero logo.
- `main/ai-software-engineering-workspace.png` is the about-page image.
- `project_three/homepage-screenshot.png`, `project_three/homepage-interactions-code.png`, and `project_three/lightbox-interactions-code.png` support `terminal-portfolio-website.html`.
- `project_one/buuf-louise-food.jpg`, `project_one/buuf-louise-logo.png`, `project_one/buuf-louise-package.jpg`, and `project_one/buuf-louise-project.jpg` support `vegetarian-ecommerce-website.html`.
- `project_two/birdbox-farm-campervan-scene.png`, `project_two/birdbox-station-system-diagram.png`, and `project_two/biodynamic-farming-calendar.png` support `off-grid-ai-homestead.html`.
- `project_two/birdbox-farm-campervan-scene.png` is also used for the `off-grid-ai-homestead.html` card on the home page.
- `project_two/one-acre-project-overview.pdf` is available from `off-grid-ai-homestead.html` as an openable and downloadable project document.
- `project_two/pdf.png` is the visual thumbnail for the PDF download block.

All image references are relative so the pages work without a build step. External Google Fonts are loaded for Space Grotesk, JetBrains Mono, and Inter.

### SEO And Deployment Files

- `docs/robots.txt` allows all crawlers and points to `docs/sitemap.xml`.
- `docs/sitemap.xml` lists every page (home, about, and each project page) with `lastmod`, `changefreq`, and `priority`.
- `docs/CNAME` pins the GitHub Pages custom domain to `www.meihuizen.ai`.
- `docs/favicon.ico` is a root-level copy served for browsers that request `/favicon.ico` directly, in addition to the `favicon/` set referenced by `<link>` tags in every page's `<head>`.
- `docs/_headers` carries the response-level CSP (see Security Measures) for hosts that read it; it has no effect on GitHub Pages itself.

## Design And Structure

The pages share a dark terminal visual language defined by CSS custom properties such as `--bg`, `--bg-raised`, `--line`, `--text-muted`, and `--accent`. The primary accent is terminal green (`#5FBF8E`).

The pages include a restrictive CSP meta policy. Deployments should also serve the policy from the included `docs/_headers` file so response-only directives such as `frame-ancestors` are enforced.

The home page uses:

- A sticky navigation bar with links to builds, about, and contact.
- A terminal window with a three-dot bar and an animated headline that plays once per browser session and skips on same-site returns.
- A short builds teaser (one line plus a button) linking out to `builds.html`, which holds the full work list.
- A contact form with client-side name, email, message, and honeypot validation that `fetch()`-POSTs to a separately deployed Vercel serverless function (see Third-Party Integrations).
- Accessible inline GitHub, LinkedIn, and X SVG marks styled as green terminal controls.

`builds.html` reuses the home page's terminal window pattern and holds the responsive work list (project tags and image previews) that used to live inline on the home page, as a standalone, indexable page of its own.

The about and project pages reuse the same terminal window pattern, responsive spacing, typography, borders, and green/blue status colors. Project pages use a shared stylesheet rather than duplicating their CSS. Project previews use centered `cover` cropping inside responsive frames; clicking a preview opens the uncropped source image in a fixed in-page lightbox overlay, which closes through the image, backdrop, close button, or Escape.

## Client-Side Behavior

The inline scripts provide these behaviors:

1. The hero animation in `index.html` types two lines in sequence, highlights `AI Native` in green, respects `prefers-reduced-motion`, and shows the final headline immediately when reduced motion or same-site navigation applies.
2. The contact form in `index.html` (via `docs/scripts/contact-form.js`) trims and validates the name, email, and message fields and rejects honeypot submissions. Valid submissions are `fetch()`-POSTed as JSON to the Vercel-hosted `send-email` endpoint, showing a bold green success message or a bold red error message inline.
3. The project pages use hidden fixed overlays for full-size image previews and restore page scrolling when the lightbox is closed.

The social links open GitHub, LinkedIn, and X in a new tab with `rel="noopener"`. SVG paths are hidden from assistive technology while each link retains an accessible `aria-label`.

## Security Measures

- Every HTML page includes a restrictive Content Security Policy meta tag. The deployable `docs/_headers` file adds the response-level policy, including `frame-ancestors 'none'` for hosts that support header configuration.
- Inline executable JavaScript was moved to same-origin files under `website/docs/scripts`, and the unpinned Google Tag Manager dependency was removed.
- The contact form's cross-origin POST target is pinned to a single origin via the CSP `connect-src` directive (`https://website-contact-function-4efp.vercel.app`), and the receiving function enforces its own `ALLOWED_ORIGIN` allowlist server-side. It validates name, email, message length, and the honeypot field client-side before sending.
- Dynamic page content is created with DOM APIs and `textContent`; user input is never inserted through `innerHTML`, `eval`, or dynamically generated code.
- Image lightboxes use static, relative asset paths from page markup. They do not accept URLs from query parameters or other user-controlled sources.
- External links use HTTPS and `rel="noopener"` when opened in a new tab. No cookies, authentication tokens, or sensitive values are stored in browser storage.
- The site has no file uploads, redirects based on user input, database requests, `postMessage` handlers, or server-side state-changing endpoints.

The response-header policy requires deployment support for `_headers`; GitHub Pages-style static hosting may require configuring the equivalent CSP in the hosting platform.

## Third-Party Integrations

### Google Analytics (GA4)

Every page loads `gtag.js` (measurement ID `G-BNWQ23V8KC`) directly after `<head>` for pageview tracking. Each page's CSP allowlists exactly the origins this requires: `https://www.googletagmanager.com` in `script-src` and `img-src`, and `https://*.google-analytics.com`/`https://*.analytics.google.com` in `connect-src`. No other third-party script origins are permitted.

### Contact Form Backend (Vercel)

The home page contact form does not send email itself. `docs/scripts/contact-form.js` POSTs the validated form fields as JSON to a Node.js serverless function deployed separately on Vercel (`https://website-contact-function-4efp.vercel.app/api/send-email`), which sends the message over SMTP with nodemailer. That function lives in the sibling `contact-form/` repo, not this one. It's deployed and configured independently, with SMTP credentials and the `ALLOWED_ORIGIN` CORS allowlist set as Vercel environment variables and never committed to source control. Only `index.html`, the only page with the form, includes this origin in its `connect-src` CSP directive.

## Continuous Integration

`.github/workflows/codeql.yml` runs GitHub CodeQL static analysis (`javascript-typescript` query set, configured by `.github/codeql/codeql-config.yml`) on every push and pull request to `main` and on a weekly schedule, surfacing results under the repo's Security tab.

## Built With AI-Assisted Development

This repo is set up for AI-assisted development. `agents.md` defines the conventions an AI agent (or any contributor) enforces on every change: PascalCase classes, camelCase functions/variables, kebab-case filenames, no `var`, no nested ternaries, no stray `console.log`, and short, specific comments over restated ones. `diagnostics.py` (see Audit below) turns the SEO, heading, image, and security rules into an automated check rather than a manual review.

The TypeScript/Jest-specific rules in `agents.md` don't apply here. This is a static HTML/CSS/JavaScript site with no build step or test suite.

## Audit

`diagnostics.py` (repo root) is a dependency-free Python script that statically audits every page in `docs/` against the "Webpage SEO & Metadata", "Webpage Heading Hierarchy", "Webpage Images", and applicable "HTML and JavaScript Security Hardening" rules in `agents.md`. It checks, per page:

- Canonical link, Open Graph, Twitter Card, and JSON-LD tags are present, absolute where required, and consistent with each other (e.g. `og:url` matches the canonical href). They also appear in the order the rules specify (after `theme-color`/`robots`, before the CSP meta tag).
- Exactly one `<h1>` per page with non-generic text, and no `div`/`span` styled as a section caption acting as the only heading for its section.
- Every `<img>` has non-empty, sitewide-unique alt text, explicit `width`/`height` that matches (or has a reasonable aspect ratio to) the file's real pixel dimensions, `loading="lazy"` below the fold, and a WebP `<picture>` source where practical.
- Every page ships a CSP meta tag without `unsafe-inline`/`unsafe-eval` in `script-src`, and site JavaScript avoids `innerHTML`/`document.write`, `eval`/`new Function`, unvalidated `postMessage` origins, and token-like values in `localStorage`/`sessionStorage`.

Run it from the repo root:

```sh
python diagnostics.py
```

It prints one line per issue (`[ERROR]`, `[WARN]`, or `[INFO]`) with the file, line number, and rule, followed by a summary count. The process exits `1` if any `ERROR`-level issue is found, so it can be wired into CI.

## Validation

There is no package manager or build pipeline required for the current static site. Before committing changes:

1. Serve `website/docs` locally and test homepage navigation, the session-scoped hero animation, the contact form, and all social links.
2. Open `website/docs/about.html` and each project page and check that all images load.
3. Test the `vegetarian-ecommerce-website.html` and `off-grid-ai-homestead.html` active navigation sequence and confirm `terminal-portfolio-website.html` and `project-four.html` are not active destinations.
4. Test project image cropping, full-size lightbox opening, and closing with the image, backdrop, close button, and Escape.
5. Run the VS Code diagnostics for every HTML and CSS file under `website/docs`.
6. Extract and syntax-check inline scripts in `index.html` and the project pages with Node.js when JavaScript changes are made.
7. Verify that all referenced image files still exist after renaming or moving assets.

```sh
python -m http.server 8000 --directory website/docs
```

Then visit `http://localhost:8000/`.
