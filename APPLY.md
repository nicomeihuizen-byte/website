# Apply: two additions to the crew

Mistral and BigML on the about page, all seven languages.

## Files

Copy in, keeping the folder structure:

```
docs/about.html
docs/nl/about.html
docs/de/about.html
docs/fr/about.html
docs/es/about.html
docs/it/about.html
docs/pt/about.html
```

Nothing else changes. The crew CSS lives inline in each of these files, so the two
new faces travel with them and no stylesheet is touched.

## What changed in each file

1. **Two faces in the inline CSS**, `.c-mistral` and `.c-bigml`, using the two eye
   and mouth pairs not already taken by the other seven.
2. **Two figures in the grid.** Mistral sits after Kimi, with the other engines.
   BigML sits last, after Copilot, because it is not a chat model and does not
   belong among them.
3. **The roster sentence** above the grid now names both.
4. **"Four of them are also the agents I query"** became five. That count was
   wrong the moment Mistral went in, and it is the kind of number a careful
   reader checks against the grid.

The grid also stops being ragged: seven cards left a row of one, nine fill three
rows of three at desktop width. Rendered at 1280 and 420 to confirm.
`diagnostics.py` unchanged at 159 issues and 7 errors, all pre-existing.

## The one line that is not true yet

**"Mistral: fifth register, and the European one"** describes a scan that has not
been run. It becomes true after one pass through Vibe on a client domain, which is
an afternoon at most, and until then it is an aspiration sitting on the one page
whose whole value is that the list is real. Run the scan, then merge.

It says nothing about Five on purpose. The Five page offers a European model on
request, and if the crew page appeared to say Mistral is already in the product,
those two together would read as a promise that is not shipped.

**BigML is captioned as new** rather than as established, because it is. "And new
here" is the honest version and it costs nothing on a page that already keeps its
own retracted paragraph visible.
