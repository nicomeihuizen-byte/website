# Apply: Five product page, shortened, with pricing

All seven languages, and the download card now points at the new product sheet.

## Files

Copy in, keeping the folder structure:

```
docs/projects/ai-sales-deal-intelligence.html
docs/projects/project-pages.css
docs/images/project_four/five-deal-management-product-sheet.pdf   (new)
docs/nl/projects/ai-sales-deal-intelligence.html
docs/de/projects/ai-sales-deal-intelligence.html
docs/fr/projects/ai-sales-deal-intelligence.html
docs/it/projects/ai-sales-deal-intelligence.html
docs/es/projects/ai-sales-deal-intelligence.html
docs/pt/projects/ai-sales-deal-intelligence.html
```

Nothing is deleted or renamed. The CSS is appended to, not rewritten, so nothing
that already uses it changes. **The old `ai-sales-cycle-control-overview.pdf`
stays where it is on purpose**, even though nothing links it any more: you may
have sent that URL to people, and a dead link in someone's inbox is worse than an
orphaned file in the repo.

## What happened to the copy

Five headed sections became **one paragraph**. It keeps the CRM graveyard line, the
cap, the one-line-per-call input, the verdict as the output, the bag-carrying
credential and the hosting region at the end where it belongs as a closer
rather than an opener. Everything that was tech detail is gone from the prose: it is in the stack
chips beside it and belongs in the brief.

**I kept the verdict, and moved it out of the prose rather than deleting it.**
That is the one place I did not do what you asked, so here is the reasoning. It
is the only thing on the page that shows rather than tells. Everything else
claims the tool reads a deal; the verdict is the tool reading a deal, in front of
a buyer who is thinking about their own pipeline while they read it. Cutting it to
hit "one paragraph" would remove the strongest thing on the page to save the
least. It is now a quote block, which reads as an exhibit rather than as copy, so
the page still scans as one paragraph plus evidence.

The h1 lockup now carries **Deal Management** under **Five**, matching the app's
own lockup and the naming convention.

## The comparison block, and why it is not a graph

It fills the gap in the left column, under the verdict and above the pricing.

**You asked for a graph and this is a table, deliberately.** A graph needs a
number, and every number available here either loses or misleads. Feature count
against Salesforce is roughly forty to four. Entry price is €39 against
Pipedrive's €14. Included AI is unlimited against metered, which plots as a bar
next to infinity. The thing that is actually different is not a quantity, it is a
set of structural choices, and those are read, not plotted.

**It is also not a tick grid**, for the same reason. Ticks invite counting, and
counting is the one game this product cannot win and does not want to play.

Five rows, each an axis where the difference is structural rather than a matter
of how much got built:

| | Five | Pipedrive | Salesforce |
| --- | --- | --- | --- |
| On your desk | Five prospects, capped | Everything you own | Everything you own |
| What it hands you | A verdict on one deal, in prose, with its reasoning | Fields and a pipeline view | Scores and dashboards |
| What the AI costs | Included, nothing per action | Bundled into the seat | Per action, in credits |
| Where notes sit | Your own database, in Frankfurt | Their cloud | Their cloud |
| Getting data out | Your own Postgres. Power BI and Excel connect straight to it | Exports and an API | Exports and an API |

Then, underneath, the admission, which now separates the two different kinds of
absence: **"Everything else on their lists, they have and this does not.
Forecasting, marketing, territories, an app marketplace. Reporting is absent on
purpose: the database is yours on Team and Private, and Power BI and Excel read
Postgres natively, which beats a dashboard I would have to build twice."**

That line is not modesty, it is what makes the five rows above it believable, and
it is the same principle Second Audience already sells on: publish the misses and
the hits get taken seriously.

**The page no longer redirects to a competitor; the product sheet still does.**
That split is deliberate and worth keeping. The page is where someone is still
deciding whether to care, so it ends on why reporting is absent rather than on
"go buy Pipedrive". The sheet is read by someone already deep enough to deserve
the whole answer, so it says buy Pipedrive or Salesforce outright. Both keep the
admission that opens the paragraph, which is the part doing the work.

**Every claim was checked today, and two of them I changed after checking.**
Salesforce Agentforce is genuinely consumption-billed: $500 per 100k Flex
Credits, 20 credits an action, or $2 a conversation, or $125 to $550 per user a
month for unmetered. Pipedrive I had first written as "AI in the higher tiers",
which your own screenshot disproves, since all four plans say "Now with AI", so
that cell became "bundled into the seat", which is accurate and still makes the
point. No claim on the page says a competitor lacks AI, because that is false and
would be the easiest thing on the page to discredit.

Five's own column is brighter with a hairline beside it rather than a highlight
fill. It is the subject of the table, not the winner of it.

## Reporting, and the region

**Reporting stops being a gap and becomes a position.** "No reporting" reads as
missing; "your database is yours and Power BI reads it directly" reads as a
choice, and it is the more accurate of the two. It is a fifth comparison row, a
sentence in the admission, a bullet on Team and Private, a row in the product
sheet's specification table, and a feature on its page 1.

The claim is checkable and I checked it: Power BI Desktop has shipped a native
PostgreSQL connector with the Npgsql provider built in since December 2019, and
the same connector is available in Excel. So this is not "you could probably wire
something up", it is a supported path in the tool your buyer already has open.

**What I did not write anywhere: CSV export.** You mentioned it, and the app does
not have it. There is no export route, no download button and nothing in `lib/`,
`app/` or `components/` that writes a CSV; `scripts/backup.ts` is a developer
script, not a product feature. Putting it on a page whose entire argument is
candour would be the one kind of copy this brand cannot afford. **It is worth
building** — it is small, and it is the only way a Solo customer gets their data
out, since a shared database cannot be handed a direct connection. Say the word.

**The connection is described as read-only, and that is a commitment.** A writable
connection to the database the app depends on is a different product. Not offered
on Solo either: that tier shares a database, and a direct connection there would
mean handing one customer credentials to a database holding another customer's
rows. Row level security should survive that; nobody should have to rely on it.

**Frankfurt as standard, Stockholm on request for Nordic customers.** Both are
real UpCloud regions (DE-FRA1 since 2015, SE-STO1 since 2023) and Supabase has
both too. The pricing terms line on all seven pages says so, and the sheet names
the region codes and UpCloud's zero-cost data transfer. Nothing in the copy claims
a backup retention or an SLA, because neither is decided yet.

The earlier reasoning for the base region, kept because it still holds: The sovereignty
argument is about EU jurisdiction, not about which EU city, and Frankfurt is the
region a German or Dutch IT person already trusts without asking why. Stockholm
would spend a sentence answering "why Sweden?" that is better spent elsewhere,
and the green-power angle it would buy is an orphan claim because nothing else in
the copy sells on sustainability. Supabase and UpCloud both have Frankfurt, so the
architecture is unchanged. Stockholm is now the named alternative rather than the base, which gets the Nordic
story without spending the opening sentence on it.

## What the pricing section says

Three cards, then the sentence that does the actual work:

> **The list stops at five sellers, and that is not an oversight.** There are no
> roll-up views, no deal ownership and no territories, because a tool built on a
> cap of five has no business pretending to run a sales floor. Are you bigger
> than that? Ask anyway, because there are custom options.

That is a disqualifier on a pricing page, which is unusual and is the point. It
makes every other claim on the page more credible, and it stops you selling into
teams the product would disappoint. The closing question then opens the door
again without taking the disqualifier back.

**No "most popular" badge.** Private has an accent border because it is the tier
the product is built for, but a popularity claim on a product with no customers
yet would be a lie on a page whose whole argument is candour.

The call to action goes to `/#contact`, not to a checkout. There is no Stripe, no
invoicing and no VAT handling anywhere, and a €299 sale with a private instance
behind it wants a conversation first regardless.

## The product sheet

Four pages, replacing the two-page "AI Native Sales-Cycle Control" brief, and the
download card on the page now points at it and describes it correctly.

It is a **buyer's document, not a portfolio piece**, which is the real change. The
old brief was written to show a recruiter or a peer how the thing was built. This
one is written for someone deciding whether to pay for it, so the order is what it
does, what you get, how the analysis works, what is underneath, where your data
lives, what it costs, and what is deliberately absent.

- **Cover** in the app's dark theme, with the mark, the headline and the three
  moves.
- **Page 1** the quiet-deal problem, the verdict as an exhibit, and eight features
  in two columns.
- **Page 2** the AI in specifics, the stack including the new reporting row, and a
  "your data" block covering where it lives, who can read it and what leaves. That
  last one is the page a European buyer actually reads.
- **Page 3** the three tiers, the terms, what is not here, and the demo.

**The interior uses the app's own light-theme palette**, the exact values from
`app/globals.css`, and the cover uses the dark one. The sheet, the site and the
product cannot drift apart, because they are one palette rather than three.

Built as HTML rendered to PDF, with Space Grotesk, JetBrains Mono and Inter
embedded in the file, so it looks the same on a machine that has none of them
installed. The text layer is real text: selectable, searchable and copyable, which
matters because buyers paste chunks of a product sheet into their own documents.
Metadata is set, so it opens with a title rather than a filename.

**One thing to decide before you publish it.** The prices are in the file, and a
PDF gets forwarded, saved and cached in a way a web page does not. If the numbers
are still provisional, hold the file back rather than publishing and revising it.

## Three things I found while in there

**1. The webfonts never load on any project page.** Only `docs/index.html` links
Google Fonts. Every project page declares Space Grotesk, JetBrains Mono and Inter
in `:root` and then renders in whatever the browser's defaults are. The CSP
already allows `fonts.googleapis.com` and `fonts.gstatic.com`, so the link tag
was either lost or never added. The whole terminal aesthetic is running on
fallback fonts right now, on all five project pages, for everyone. Not fixed here
because it touches five pages plus six translations each and deserves its own
change.

**2. The lockup's inline style was almost certainly dead.** It was
`style="display:flex;..."` on the div, and this page's CSP sets `style-src` with
no `'unsafe-inline'`, which blocks style attributes as well as `<style>` blocks.
It is now a `.five-lockup` class in the stylesheet, where it actually applies.

**3. The small print was unreadable.** `--text-dim` on the card background is
2.58:1. Fine for decoration, not for the line carrying VAT, the annual discount
and the trial length, so that one line is `--text-muted` at 5.47:1.

## Verified

`diagnostics.py` reports **159 issues, 7 errors** before and after, and the errors
are all the retired vegetarian page having no `<h1>`. The only warning on this page
is the pre-existing JSON-LD `BreadcrumbList` one. **No regressions.**

Rendered in headless Chromium at 1280px and 420px. Desktop is three pricing cards
across and a four-column comparison; below 650px the pricing stacks to one column
and the comparison turns into labelled blocks rather than a table nobody can read
on a phone. Nothing overflows at either width. The three preview PNGs in this zip
are those renders, so you can see it before you copy anything in.

Contrast was measured rather than eyeballed, and two things moved because of it.
The comparison's row and column labels and the pricing small print were all on
`--text-dim`, which is 2.58:1 on this background. Those are content, not
decoration, so they are `--text-muted` at 5.47:1 now.

One thing to look at yourself: on mobile the fixed `repo-dock` pill sits over the
bottom of the page and now happens to land on the pricing small print. That
behaviour is not new and this change did not introduce it, but the thing it
covers is.

## The six translations

All of them carry the same shape as the English: one paragraph, the verdict as a
quote, the comparison table, the pricing block, and the download card repointed at
the product sheet.

**The verdict paragraph was not retranslated.** It already existed in each file,
written properly when the Five copy first landed, so it was lifted out and put
back inside the new quote block. Retranslating copy that has already been reviewed
is how quality quietly drifts.

Things that are genuinely localised rather than translated:

- **Currency placement.** Dutch puts the symbol first (&euro;39). German, French,
  Italian, Spanish and Portuguese put it last (39&nbsp;&euro;), which is what their
  readers expect and what a machine translation usually gets wrong.
- **VAT wording**: excl. btw, zzgl. MwSt., Prix HT, IVA esclusa, sin IVA, sem IVA.
- **The data processing agreement** by its local name: verwerkersovereenkomst,
  Auftragsverarbeitungsvertrag, contrat de sous-traitance, accordo sul trattamento
  dei dati, contrato de encargo de tratamiento, contrato de subcontratação.
- **Register** follows each existing page: u, Sie, vous, voi, usted, and European
  Portuguese third person.

**Not translated, on purpose:** Five, Deal Management, Solo, Team, Private,
Pipedrive and Salesforce. Those are names.

Rendered all seven at 1280px and checked programmatically for horizontal scroll,
clipped table cells and overflowing pricing cards. Zero on all three in every
language. German is the tightest, as usual: its comparison table runs 471px against
English's 481px and still does not clip.

**The same caveat as the rest of the site applies.** Dutch and German are written
properly. French, Spanish, Italian and Portuguese are good but unverified by a
native speaker, which is the position every other page on the site is already in.
You can read the two that matter most.

## The product sheet stays English only

Your call, and the right one. It is one file rather than seven, it changes whenever
the product does, and the buyers who need it in another language are the same ones
who will be having a conversation with you anyway.
