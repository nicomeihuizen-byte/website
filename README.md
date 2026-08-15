# Personal Website

Personal portfolio website for Nico Meihuizen, built as a lightweight static site during the Metana bootcamp. The visual direction is a terminal-inspired portfolio: dark graphite surfaces, terminal green accents, monospace interface text, restrained motion, and content presented as practical work rather than a marketing landing page.

## What Is Included

The website is contained in `website/docs` and can be opened directly from the filesystem or served by any static web server.

### Pages

- `index.html` is the home page. It contains the terminal-style hero, work list, contact form, social links, and footer.
- `about.html` presents the professional background, technology stack, page navigation, social links, and footer.
- `projects/project-one.html` presents the completed vegetarian ecommerce project and links into the active project sequence.
- `projects/project-two.html` presents the active One Acre, Zero Dependency off-grid farming project, including SEO metadata, project galleries, and image lightboxes.
- `projects/project-three.html` documents the portfolio website itself, including its interface, functionality, implementation, and security practices. It remains inactive in the project sequence.
- `projects/project-four.html` remains an inactive project-page template and is not linked from the active project sequence.
- `projects/project-pages.css` provides the shared layout and visual system for all project pages.

### Assets

Images are stored in `website/docs/images` and use descriptive filenames:

- `main/digital-nomad-logo.png` is the hero logo.
- `main/ai-software-engineering-workspace.png` is the about-page image.
- `project_three/homepage-screenshot.png`, `project_three/homepage-interactions-code.png`, and `project_three/lightbox-interactions-code.png` support the Project Three case study.
- `project_one/buuf-louise-food.jpg`, `project_one/buuf-louise-logo.png`, `project_one/buuf-louise-package.jpg`, and `project_one/buuf-louise-project.jpg` support the Project One previews.
- `project_two/birdbox-farm-campervan-scene.png`, `project_two/birdbox-station-system-diagram.png`, and `project_two/biodynamic-farming-calendar.png` support the Project Two gallery.
- `project_two/birdbox-farm-campervan-scene.png` is used for the Project Two card on the home page.
- `project_two/one-acre-project-overview.pdf` is available from Project Two as an openable and downloadable project document.
- `project_two/pdf.png` is the visual thumbnail for the PDF download block.

All image references are relative so the pages work without a build step. External Google Fonts are loaded for Space Grotesk, JetBrains Mono, and Inter.

## Design And Structure

The pages share a dark terminal visual language defined by CSS custom properties such as `--bg`, `--bg-raised`, `--line`, `--text-muted`, and `--accent`. The primary accent is terminal green (`#5FBF8E`).

The pages include a restrictive CSP meta policy. Deployments should also serve the policy from the included `docs/_headers` file so response-only directives such as `frame-ancestors` are enforced.

The home page uses:

- A sticky navigation bar with links to work, about, and contact.
- A terminal window with a three-dot bar and an animated headline that plays once per browser session and skips on same-site returns.
- A responsive work list with project tags and image previews.
- A contact form with client-side name, email, message, and honeypot validation that opens a pre-filled `mailto:` URL without sending a cross-site form request.
- Accessible inline GitHub, LinkedIn, and X SVG marks styled as green terminal controls.

The about and project pages reuse the same terminal window pattern, responsive spacing, typography, borders, and green/blue status colors. Project pages use a shared stylesheet rather than duplicating their CSS. Project previews use centered `cover` cropping inside responsive frames; clicking a preview opens the uncropped source image in a fixed in-page lightbox overlay, which closes through the image, backdrop, close button, or Escape.

## Client-Side Behavior

The inline scripts provide these behaviors:

1. The hero animation in `index.html` types two lines in sequence, highlights `AI Native` in green, respects `prefers-reduced-motion`, and shows the final headline immediately when reduced motion or same-site navigation applies.
2. The contact form in `index.html` trims and validates the name, email, and message fields, rejects honeypot submissions, and opens a fixed `mailto:` URL for valid submissions.
3. The project pages use hidden fixed overlays for full-size image previews and restore page scrolling when the lightbox is closed.

The social links open GitHub, LinkedIn, and X in a new tab with `rel="noopener"`. SVG paths are hidden from assistive technology while each link retains an accessible `aria-label`.

## Security Measures

- Every HTML page includes a restrictive Content Security Policy meta tag. The deployable `docs/_headers` file adds the response-level policy, including `frame-ancestors 'none'` for hosts that support header configuration.
- Inline executable JavaScript was moved to same-origin files under `website/docs/scripts`, and the unpinned Google Tag Manager dependency was removed.
- The contact form no longer sends a cross-site POST. It validates name, email, message length, and the honeypot field before opening a fixed `mailto:` destination.
- Dynamic page content is created with DOM APIs and `textContent`; user input is never inserted through `innerHTML`, `eval`, or dynamically generated code.
- Image lightboxes use static, relative asset paths from page markup. They do not accept URLs from query parameters or other user-controlled sources.
- External links use HTTPS and `rel="noopener"` when opened in a new tab. No cookies, authentication tokens, or sensitive values are stored in browser storage.
- The site has no file uploads, redirects based on user input, database requests, `postMessage` handlers, or server-side state-changing endpoints.

The response-header policy requires deployment support for `_headers`; GitHub Pages-style static hosting may require configuring the equivalent CSP in the hosting platform.

## Applicable Coding Rules

The repository rules are defined in `agents.md`. The following rules apply to this static HTML/CSS/JavaScript website:

- Use `UPPER_CASE` for constants, PascalCase for classes and interfaces, camelCase for functions, methods, variables, and parameters, and kebab-case for filenames.
- Do not use `console.log` in production code.
- Do not use the JavaScript `var` keyword. Use `const` for values that are not reassigned and `let` for values that are reassigned.
- Do not use nested ternary operators.
- Use descriptive names instead of vague names such as `data`, `info`, `temp`, `Manager`, or `Helper`.
- Keep comments short and specific. Do not leave unexplained placeholder comments or large dead code blocks without a clear restoration reason.
- Keep changes focused and preserve existing public links, accessibility labels, and relative asset paths.

The TypeScript version, decorators, Jest, `jest.mock()`, coverage, and Jest snapshot rules in `agents.md` do not apply because this website contains no TypeScript or Jest test suite. The site's JavaScript follows the applicable naming and prohibition rules.

## Validation

There is no package manager or build pipeline required for the current static site. Before committing changes:

1. Serve `website/docs` locally and test homepage navigation, the session-scoped hero animation, the contact form, and all social links.
2. Open `website/docs/about.html` and each project page and check that all images load.
3. Test the Project One and Project Two active navigation sequence and confirm Projects Three and Four are not active destinations.
4. Test project image cropping, full-size lightbox opening, and closing with the image, backdrop, close button, and Escape.
5. Run the VS Code diagnostics for every HTML and CSS file under `website/docs`.
6. Extract and syntax-check inline scripts in `index.html` and the project pages with Node.js when JavaScript changes are made.
7. Verify that all referenced image files still exist after renaming or moving assets.

```sh
python -m http.server 8000 --directory website/docs
```

Then visit `http://localhost:8000/`.
