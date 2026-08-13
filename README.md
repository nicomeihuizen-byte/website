# Metana Website

Personal portfolio website for Nico Meihuizen, built as a lightweight static site during the Metana bootcamp. The visual direction is a terminal-inspired portfolio: dark graphite surfaces, terminal green accents, monospace interface text, restrained motion, and content presented as practical work rather than a marketing landing page.

## What Is Included

The website is contained in `website/docs` and can be opened directly from the filesystem or served by any static web server.

### Pages

- `index.html` is the home page. It contains the terminal-style hero, work list, contact form, social links, and footer.
- `about.html` presents the professional background, technology stack, page navigation, social links, and footer.
- `projects/project-one.html` presents the completed vegetarian ecommerce project.
- `projects/project-two.html`, `project-three.html`, and `project-four.html` are prepared project-page templates for future work.
- `projects/project-pages.css` provides the shared layout and visual system for all project pages.

### Assets

Images are stored in `website/docs/images` and use descriptive kebab-case filenames:

- `logo.png` is the hero logo.
- `ai-workspace.png` is the about-page image.
- `buuf-louise.jpg`, `buuf-louise.png`, `buuf-package.jpg`, and `04-project.jpg` support the project previews.

All image references are relative so the pages work without a build step. External Google Fonts are loaded for Space Grotesk, JetBrains Mono, and Inter.

## Design And Structure

The pages share a dark terminal visual language defined by CSS custom properties such as `--bg`, `--bg-raised`, `--line`, `--text-muted`, and `--accent`. The primary accent is terminal green (`#5FBF8E`).

The home page uses:

- A sticky navigation bar with links to work, about, and contact.
- A terminal window with a three-dot bar and an animated headline.
- A responsive work list with project tags and image previews.
- A contact form that opens a pre-filled `mailto:` URL in the visitor's email client.
- Accessible inline GitHub and LinkedIn SVG marks styled as green terminal controls.

The about and project pages reuse the same terminal window pattern, responsive spacing, typography, borders, and green/blue status colors. Project pages use a shared stylesheet rather than duplicating their CSS.

## Client-Side Behavior

The inline script in `index.html` contains two isolated functions:

1. The hero animation types two lines in sequence and highlights `AI Native` in green. It respects `prefers-reduced-motion` and shows the final headline immediately when reduced motion is enabled.
2. The contact form trims the name, email, and message fields, URL-encodes the subject and body, resets the form, and navigates to a `mailto:` URL. No form data is sent to a website backend.

The social links open GitHub and LinkedIn in a new tab with `rel="noopener"`. SVG paths are hidden from assistive technology while each link retains an accessible `aria-label`.

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

1. Open `website/docs/index.html` and test navigation, the hero animation, the contact form, and both social links.
2. Open `website/docs/about.html` and each project page and check that all images load.
3. Run the VS Code diagnostics for every HTML and CSS file under `website/docs`.
4. Extract and syntax-check the inline script in `index.html` with Node.js when JavaScript changes are made.
5. Verify that all referenced image files still exist after renaming or moving assets.

## Suggested Local Server

Direct file opening is sufficient for this site. A local static server is useful when testing browser behavior:

```text
python -m http.server 8000 --directory website/docs
```

Then visit `http://localhost:8000/`.
