# Homepage redesign (2 Oct 2026)

Design source for the new meihuizen.ai homepage. Not served: lives outside docs/.

Live canvas (open, comment, edit): https://claude.ai/artifact/QbmcAbTdmHhnY4UjCi9ncj

## Files
- Main.dc.html: the homepage. Prop `theme`: light, dark or kaunas (follows Kaunas office hours).
- Dark.dc.html: Main in dark.
- Mobile.dc.html: Main at 390px, theme follows Kaunas hours live.
- canvas.json: canvas layout.
- assets/: the site images the design uses (copies from docs/images/main).

The .dc.html files need the canvas runtime to render; they will not open as plain pages from disk.
Image paths inside them are canvas uploads (/_blob/...). Map them to assets/ when building:
- 6d1d2bf1... = digital-nomad-logo-meihuizen-transparent.png
- 8df94e5e... = hero-van-dog-sit.png
- 48580eac... = hero-van-dog-walk.png
- 6b2093d8... = camper-van-green.png

## Sections, top to bottom
nav · status strip (live Kaunas clock) · hero with live Fritz · bento builds · four buying steps with decision gates · principles + crew · CTA band · footer with ~/agents line

## Still placeholder copy (content round)
Second Audience sample readout, buying steps wording, principle 04, "here next" CTA line, "then books the call".

## Before building
Move the inlined CSS into one shared stylesheet first, so the redesign lands once instead of across 8 languages.
