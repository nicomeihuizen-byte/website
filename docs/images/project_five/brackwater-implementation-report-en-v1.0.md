# Brackwater Institute · Implementation Report

**brackwater.example · English · version 1.0 · 31 August 2026**

Prepared by meihuizen.ai. Scope: brackwater.example. This document follows the free scan of
31 August 2026 and is the recipe for the work priced on page 15 of it. Every euro of this report
comes off anything bought afterwards.

We are not lawyers and this is not legal or regulatory advice. We report which text a machine can
read on which page of brackwater.example, and what came out afterwards.

> **Brackwater Institute is fictional.** brackwater.example is a domain reserved by RFC 2606 for
> documentation and cannot be registered by anyone. The site behind every finding in this document
> was built by meihuizen.ai to carry six defect classes at once, is served only on a local machine
> and is never published. Everything else here is a real measurement of those real files, taken with
> the instrument we run on a live domain. This is a worked demonstration of the middle tier, not a
> client deliverable.

---

## How to read this document

Two parts, and the first one is measurement rather than preamble.

**Part One, what the scan could not close.** The free scan reported six findings from the visible
text of fifteen pages. This report adds the layers underneath: the raw head of every page, meaning
structured data, canonical tags and hreflang; the complete address layer, meaning every sitemap and
what is and is not in it; and the file layer, meaning what is actually inside both PDFs. Sixteen
measurements, each with its date, its time and its own limitations. Two of them change a finding.

**Part Two, the work.** Six findings became twenty four work items, because several findings need two
or three changes with different owners and different tests. Each item states which finding it closes,
and each has the same seven parts in the same order:

| Part | What it is |
|---|---|
| Finding | which scan finding this closes |
| Where | every URL, listed, never summarised |
| Now | what is there today, quoted, with the measurement it came from |
| Change to | the target state in plain words |
| Paste | the copy or code, ready, only bracketed values to fill |
| Test | something you can run today and get yes or no |
| Done when | the single condition the verification remeasurement grades |

An item skips **Now** only where the thing being asked for does not exist yet.

**Owners.** Every item carries one of four.

| Owner | Meaning |
|---|---|
| **Author** | content rights, no release needed |
| **Template** | a developer and a release |
| **Estate** | crosses pages, sitemaps or documents, so the shape has to be decided first |
| **Decision** | not our call, and not a copy question. Section D. |

The reason findings like these survive for years is almost never difficulty. It is that nobody could
tell whose job it was.

**Where a prescription rests on something only Brackwater knows, we name nothing.** Three of the
five decisions need a fact we do not have and we supply none.

**The four free actions from page 15 of the scan reappear here, named as already given.** All four
are work items in this document with the words written out. They are listed for completeness, **not
to be sold back to you.**

---

# Section D · Five decisions, before any work

Each states what we would do and why, then says plainly that it is not our decision. Fifteen of the
twenty four items are blocked until these are answered, and they are marked in the order of operations.

## D-1 · What a place actually costs, and what the &euro;16,500 is

**The question.** Six places on the domain state a fee. The programme page and /fees/ say
&euro;16,500. The September cohort page says &euro;18,500 with a residential fee of &euro;1,900 four
lines below it. The 2024 blog post says &euro;14,750 all inclusive. Your fee schedule says tuition
&euro;18,500, residential &euro;1,900, **total per participant &euro;20,400 excluding VAT**, and that
&euro;16,500 is the four place corporate sponsor rate (M-06, M-07).

**What we would do.** Publish the total. One sentence on the programme page giving the tuition, the
residential fee, the sum, and the VAT position, and the sponsor rates named as sponsor rates in a
separate block. The word "from" in front of a sponsor rate is the whole finding.

**Where it stops being our decision.** Whether the individual price for the September cohort is
&euro;20,400 or something else in practice is a Brackwater fact. So is whether you want the sponsor
tiers public at all, which is a commercial choice and not a readability one. We supply the mechanics
for either answer.

**What it blocks.** FE-1, FE-2, FE-3, FE-5.

## D-2 · Which cohort you are selling

**The question.** The March 2026 cohort ended on 20 March. It is in your sitemap, it is the only page
on the domain carrying a `Course` record, and that record declares
`availability: https://schema.org/InStock` with `endDate: 2026-03-20` (M-03, M-04). The September
2026 cohort is live, carries no structured record of any kind, and is not in the sitemap.

**What we would do.** Move the record. The `Course` and `CourseInstance` belong on the cohort you are
selling, with its real dates and its real price, and the March page keeps a record whose dates have
passed or loses its record and points at the current one.

**Where it stops being our decision.** Whether the March page should stay live at all is a question
about your inbound links and your archive, not about readability. Both answers work. What does not
work is the current position, where the finished cohort is the one a machine is invited to read.

**What it blocks.** CO-1, CO-2, CO-4.

## D-3 · Which text is the promise

**The question.** /admissions/ and the programme page say *"Free cancellation up to 30 days before
the programme starts."* Your booking terms say *"50% of the programme fee falls due on confirmation
of a place and is not refundable"* and that the 50% is retained *"irrespective of when notice is
given"* (M-09). These are not two phrasings of one promise.

**What we would do.** Make the marketing pages a short, accurate reading of the booking terms, and
make the booking terms the only place a number is introduced. That is the direction that cannot
produce a third version.

**Where it stops being our decision.** Aligning them is not copywriting. Somebody has to decide what
the offer was for anyone who confirmed a place while the marketing page said "free cancellation", and
that question belongs to whoever owns the terms. It should be answered before CO-3 is written, not
after.

**What it blocks.** CO-3, CO-5.

## D-4 · The accreditation

**The question.** /about/accreditation/ states you are an accredited provider. The body's name exists
only inside an image carrying `alt=""`. There is no registration number and no link anywhere on the
domain. The certificate is in the blocked directory, it has a working text layer, and it reads
*"valid for three years from the date of issue and expires on 13 June 2024"* (M-10, M-13).

**What we would do.** Publish the body's name as text, the register entry number, and a link to your
entry on the body's own site, then put the same number in the `identifier` field of your
`Organization` record. A registration number takes a machine to a register. A logo takes it nowhere,
and an empty alt attribute does not even tell it there is a logo.

**Where it stops being our decision.** We do not know your current accreditation status and we are
not going to infer one from an expiry date on a 2021 certificate. Every value in AC-1 is bracketed
for that reason. If the answer is that the accreditation has lapsed, the repair is a different
sentence and it is still a sentence.

**What it blocks.** AC-1, AC-2, AC-3.

## D-5 · Which promotion figure is the current one

**The question.** Three figures, three timeframes, one survey, no year and no count: *"9 in 10 alumni
advance to a wider role within 18 months"* on the home page, *"87% of participants report a step up
in scope"* on the programme page, *"92% &hellip; within two years"* on /outcomes/ (M-08).

**What we would do.** One figure is the published figure. It carries its cohort year, the group it
covers and how many people that was, and it appears identically everywhere. Any other figure that
stays live says in the same sentence which different group and which different year it measures.

**Where it stops being our decision.** Which of the three is the one you stand behind, and what the
denominator is, are facts only your alumni survey holds. We supply none of them, and page 9 of the
scan is the reason we would not guess even if we could.

**What it blocks.** OU-1, OU-2, OU-3.

---

# Part One · What the scan could not close

Sixteen measurements, all taken on **31 August 2026 between 14:10 and 15:58 CEST**, all against
brackwater.example as served, without cookies and without logging in. Nothing was submitted, no form
was filled and no account was created.

**The limitations that travel with all of them.** Plain text files (robots.txt, both sitemaps, the
404 responses) are exact: what is printed below is the file. HTML readings are taken from the
document the server sends and parsed with no script executed, so canonical tags, meta robots and
JSON-LD are read as published rather than as a browser leaves them. The rendering comparison is
between that document and the finished page after scripts ran, block by block, counting text nodes of
four characters or more. PDF readings are structural: we counted pages, font objects, embedded font
programs and image streams, and we ran one text extraction. We did not read either PDF as a document.
Where a measurement did not run, it says so and names the method it would need.

---

## M-01 · The rendering comparison, all fifteen pages

| URL | Blocks in a browser | Missing from the server document | Readable |
|---|---|---|---|
| `/faculty/` | 38 | **24** | **36.8%** |
| `/` | 29 | **2** | 93.1% |
| `/programmes/` | 17 | 0 | 100% |
| `/programmes/advanced-board/` | 38 | 0 | 100% |
| `/programmes/advanced-board/march-2026/` | 17 | 0 | 100% |
| `/programmes/advanced-board/september-2026/` | 18 | 0 | 100% |
| `/programmes/senior-leadership/` | 16 | 0 | 100% |
| `/fees/` | 25 | 0 | 100% |
| `/admissions/` | 22 | 0 | 100% |
| `/outcomes/` | 18 | 0 | 100% |
| `/about/accreditation/` | 16 | 0 | 100% |
| `/contact/` | 17 | 0 | 100% |
| `/legal/booking-terms/` | 30 | 0 | 100% |
| `/legal/privacy/` | 14 | 0 | 100% |
| `/blog/what-the-programme-costs-2024/` | 19 | 0 | 100% |

Thirteen of fifteen at a rendering delta of exactly zero. That is a better result than most sites
manage and it is why this report is about two pages rather than about your site.

## M-02 · The twenty six blocks that do not exist until a browser runs your script

On `/faculty/`, missing from the document your server sends, in order:

```
Name · Teaches
Dr Aurelie Vanthoor        · Chair of the programme. Twenty two years on listed boards.
Prof. Michiel Sanderink    · Governance and capital structure.
Dr Ines Karadag            · Succession and executive assessment.
Joachim Brekelmans         · Former group CFO. Crisis and disclosure.
Dr Petra Lindqvist         · Board dynamics and decision quality.
Samuel Okonkwo             · Regulatory strategy.
Dr Hanne Vestergaard       · Remuneration and incentive design.
Tobias Reinders            · Board simulation lead.
Dr Marion Delacroix        · Stakeholder and activist engagement.
Ferdinand Aalders          · Audit committee practice.
Dr Sunniva Halvorsen       · Ethics and the limits of process.
```

The table headings are missing too, because the same script writes them. A fetcher that does not run
scripts receives a heading, a lede and an empty `div`.

On `/`, exactly two blocks are missing, and they are the only place on the home page that names the
current cohort:

```
Next cohort: 14 September 2026.
Applications close 31 July 2026. Two places remain.
```

## M-03 · The address layer

| File | Status | What is in it |
|---|---|---|
| `sitemap.xml` | 200 | An index naming exactly one child: `sitemap-pages.xml` |
| `sitemap-pages.xml` | 200 | **14 URLs** |
| `llms.txt` | **404** | |
| `llms-full.txt`, `ai.txt`, `/.well-known/ai.txt` | not requested | see M-16 |

Fifteen pages are live and reachable. Fourteen are in the sitemap. The one that is not is
`/programmes/advanced-board/september-2026/`, which is the cohort you are selling.

**llms.txt is reported as not a finding.** It is a proposal, no major agent has committed to reading
it, and its absence costs you nothing today. It appears in this report only because the scan said it
would check.

## M-04 · The only structured record on the domain describes a cohort that has ended

`/programmes/advanced-board/march-2026/`, verbatim, the offer and instance nodes:

```json
"offers": {
  "@type": "Offer",
  "price": "16500",
  "priceCurrency": "EUR",
  "availability": "https://schema.org/InStock",
  "url": "https://brackwater.example/programmes/advanced-board/march-2026/"
},
"hasCourseInstance": {
  "@type": "CourseInstance",
  "courseMode": "Onsite",
  "startDate": "2026-03-09",
  "endDate": "2026-03-20",
  "location": { "@type": "Place", "name": "Brackwater Institute" }
}
```

Measured against today's date: **the instance ended 164 days ago and still declares itself
`InStock`.** Its price, &euro;16,500, is the sponsor rate, published as the offer price for an
individual.

`/programmes/advanced-board/september-2026/` carries no JSON-LD at all. Neither does the programme
page, `/fees/`, `/admissions/`, `/outcomes/`, `/about/accreditation/`, `/faculty/` or the booking
terms. The only other record on the domain is the `WebSite` and `Organization` pair on the home page.

## M-05 · The Organization record, and what is missing from it

`https://brackwater.example#organization`, verbatim:

```json
{
  "@type": "Organization",
  "@id": "https://brackwater.example#organization",
  "name": "Brackwater Institute",
  "url": "https://brackwater.example",
  "description": "Executive education for board members and senior leaders.",
  "logo": { "@type": "ImageObject", "url": "https://brackwater.example/assets/logo.png" },
  "address": { "@type": "PostalAddress" },
  "contactPoint": { "@type": "ContactPoint", "telephone": "" },
  "sameAs": [ "https://www.linkedin.com/company/brackwater-institute" ]
}
```

A `PostalAddress` is declared and nothing is put in it. A `contactPoint` is declared with an empty
telephone. There is no `identifier`, no `legalName`, no `vatID` and no `email`. Your contact page
prints a street address in its own text, so this is a template that forgot to fill its fields rather
than a company withholding anything.

The record also exists on one page only. Every other page on the domain is, structurally, anonymous.

## M-06 · Every amount on the domain, and where it is

| Amount | Where it appears |
|---|---|
| &euro;16,500 | `/`, `/programmes/advanced-board/`, `/programmes/advanced-board/march-2026/`, `/fees/` |
| &euro;18,500 | `/programmes/advanced-board/september-2026/` only |
| &euro;1,900 | `/programmes/advanced-board/september-2026/`, `/legal/booking-terms/` |
| &euro;14,750 | `/blog/what-the-programme-costs-2024/` only |
| &euro;9,750 | `/programmes/senior-leadership/`, `/fees/` |
| **&euro;20,400** | **nowhere in any HTML page on the domain** |

Searched as a literal string across every served page including inside scripts: `20,400` occurs
**zero** times.

## M-07 · What is in the fee schedule, and why nothing can read it

`/downloads/fee-schedule-2026.pdf`, structural read:

| | |
|---|---|
| Status | 200 |
| Size | 242,558 bytes |
| Pages | 2 |
| Image streams | **2** |
| `/Type /Font` objects | 1, declared and never used to draw a glyph |
| Embedded font programs | **0** |
| Characters returned by a text extraction | **0** |

Two pages, two page images, no embedded font, and an extraction that returns an empty string. This is
not a PDF with a damaged text layer. It is a picture of a document, and no re-upload of the same
export will change that.

What it contains, read as a human reads it: tuition &euro;18,500, residential fee &euro;1,900,
**total per participant &euro;20,400 excluding VAT**, a sponsor table at &euro;18,500 / &euro;17,600 /
&euro;16,500 for one, two to three and four or more places, and the sentence *"The &euro;16,500 figure
quoted on brackwater.example is the four place sponsor rate."*

So the one document that reconciles every number on your domain is the one document nothing on your
domain can quote.

## M-08 · The outcome figures, counted

| Figure | Where | Window | Group | Count |
|---|---|---|---|---|
| 9 in 10 | `/` | 18 months | "alumni" | not stated |
| 87% | `/programmes/advanced-board/` | not stated | "participants" | not stated |
| 92% | `/outcomes/` | two years | "participants" | not stated |

The only sourcing statement anywhere is *"Source: our alumni survey."* No year, no denominator, no
response rate. `/outcomes/` carries one further percentage and it is a promotional *"20% OFF"* style
figure rather than an outcome.

## M-09 · The two cancellation texts, side by side

| | `/admissions/` and the programme page | `/legal/booking-terms/` |
|---|---|---|
| On cancelling early | *"Free cancellation up to 30 days before the programme starts."* | *"50% of the programme fee falls due on confirmation of a place and is not refundable."* |
| Whether notice helps | *"After that, the fee is due in full."* | *"the 50% payable under 1.2 is retained by Brackwater Institute irrespective of when notice is given"* |
| Residential fee | not stated on `/admissions/` | *"A residential fee of &euro;1,900 applies to the Advanced Board Programme"* |
| VAT | not stated | *"All fees are stated excluding VAT."* |
| Transfer | not stated | *"may be transferred once, to the next cohort of the same programme, at no charge"* |

The booking terms page opens by stating that it governs where anything else on the site differs from
it. That sentence is doing real work: it is the reason the one session that read it gave the right
answer and warned the buyer about the marketing page.

## M-10 · The accreditation certificate, which is readable and blocked

`/downloads/accreditation-2021.pdf`, structural read:

| | |
|---|---|
| Status | 200 |
| Pages | 2 |
| `/Type /Font` objects | 36 |
| Embedded font programs | 16 |
| Characters returned by a text extraction | 785 |
| First 200 characters | *"EUROPEAN COUNCIL FOR EXECUTIVE DEVELOPMENT · Certificate of accreditation · Issued 14 June 2021 · The European Council for Executive Development certifies that · Brackwater Institute &hellip;"* |

It contains, in readable text: *"This certificate is valid for three years from the date of issue and
expires on 13 June 2024."*

**The pairing is the finding.** Your unreadable document is the one you point people at. Your readable
document is the one you block. If a machine could read either, it would read the wrong one.

## M-11 · robots.txt, verbatim, and exactly what it blocks

```
User-agent: *
Disallow: /downloads/
Disallow: /cgi-bin/

Sitemap: https://brackwater.example/sitemap.xml
```

No AI crawler is named anywhere: no GPTBot, no OAI-SearchBot, no ChatGPT-User, no ClaudeBot, no
CCBot, no Google-Extended, no PerplexityBot. `/cgi-bin/` does not exist.

`Disallow: /downloads/` blocks exactly two documents, and they are these:

| Blocked document | What it is |
|---|---|
| `fee-schedule-2026.pdf` | the only statement of what a place costs in total |
| `accreditation-2021.pdf` | the only evidence of the accreditation you claim |

**One line of your robots.txt blocks the only two documents on your domain that would settle a fact.**
Nothing else on the site is blocked, and nothing else in that directory exists.

## M-12 · Canonical and hreflang

Every one of the fifteen pages carries `<meta name="robots" content="index,follow">` and a canonical
pointing at itself. There is no duplicate-address problem on this domain and nothing needs a
canonical changed. Zero hreflang declarations anywhere, on a single language site, which is correct
and is reported as **not a finding**.

## M-13 · What the accreditation page actually publishes

```html
<p><img src="/assets/ecied-mark.png" alt="" width="180" height="90"></p>
```

The accrediting body's name appears in the page text once, in the sentence
*"Our accreditation is reviewed on a three year cycle."* The body is not named in that sentence. The
name **European Council for Executive Development** exists on the domain in exactly two places: inside
the pixels of `ecied-mark.png`, and inside the blocked certificate.

The image's `alt` attribute is empty, which tells a machine the image is decorative.

## M-14 · Correction to the scan, printed rather than fixed quietly

The scan's finding 01 table reports the September cohort page at **&euro;20,400**. That is our
arithmetic, not their text. The page states &euro;18,500 in one place and *"A residential fee of
&euro;1,900 applies for the three modules"* four lines lower, and **it never adds them together**. The
scan's table has been corrected to show the two figures separately.

The correction makes the finding stronger rather than weaker: no page on brackwater.example states a
total at all. We are printing it because a correction we found ourselves is worth more to you than one
you find later, and because the tier exists to catch exactly this.

## M-15 · The reading test, and its method

Three independent model sessions, given only the documents the server sends for the fifteen pages a
buyer can reach, with the blocked directory withheld, no memory, no search and no other source. Four
questions each, two written the way a tester writes them and two the way people type. Twelve answers.
Full transcripts in appendix A.

Counted:

| | |
|---|---|
| Different totals given for one programme fee | 3 |
| Answers containing &euro;20,400 | **0** |
| Answers naming a member of faculty | **0** |
| Answers giving the `/outcomes/` figure of 92% | **0** |
| Sessions saying Brackwater is accredited | 3 of 3 |
| Sessions able to check that claim | 0 of 3 |
| Sessions that warned the buyer about the marketing page unprompted | 1 |
| Sessions that gave two incompatible cancellation answers in one paragraph | 1 |
| Sessions naming a correct source URL on the follow-up | 3 of 3 |

**This is not a claim about what any live agent says about Brackwater Institute**, which does not
exist. It measures what a model answers when the only thing it has is what this server sends. That is
a harder test for the site than the live one, because nothing can be rescued from training data.

## M-16 · Not run

Named rather than dropped, so you can see the edge of what this document knows.

- **The directory and register layer.** The accrediting body's own register, and whatever third party
  listings carry your programme. On a live domain this is where a price that is not yours comes from,
  and it needs a sweep the free scan does not run, including who administers each listing. An
  unclaimed listing is publicly editable.
- **`llms-full.txt`, `ai.txt` and `/.well-known/ai.txt`.** Not requested. `llms.txt` returned 404 and
  the others would not change the finding.
- **Server logs.** The only honest before and after, and it needs thirty to ninety days of your own
  access logs.
- **The Senior Leadership Programme.** Every measurement above was taken on the Advanced Board estate.
  The six day programme runs on the same templates and we have not read its text. FE-5, CO-4 and OU-3
  are written so that fixing the template fixes it at the same time.
- **Any live agent, on any question.** By construction. See M-15.

---

# Part Two · The work

Twenty four items in four blocks. Block prices are on page 15 of the scan and are unchanged by this
document. Where a block turned out to be larger than the scan could see, the price does not move,
because the tier is set by judgement and not by keystrokes.

| Block | Items | Difficulty | Price |
|---|---|---|---|
| **FE** · One fee | FE-1 to FE-6 | Extensive | &euro; 5,500 |
| **CO** · One offer | CO-1 to CO-5 | Extensive | &euro; 5,500 |
| **RC** · Readable claims | FA-1 to FA-3, AC-1 to AC-3, OU-1 to OU-3 | Extensive | &euro; 5,500 |
| **PR** · Permission and reading list | PR-1 to PR-4 | Fast | &euro; 1,250 |
| Verification remeasurement | | Included | &euro; 0 |
| | | **Total** | **&euro; 17,750** |

---

# Block FE · One fee

Closes finding 01. Six items. Blocked until D-1 is answered.

## FE-1 · Publish the total, on the page where the buyer is

**Finding** 01. **Owner** Author. **Blocked by** D-1. **This is free action 1 from page 15 of the
scan, listed for completeness and not to be sold back to you. The scan called it fifteen minutes and
that is right.**

**Where** `https://brackwater.example/programmes/advanced-board/`

**Now** The page says `from €16,500` in a single element with nothing beside it. No VAT position, no
residential fee, no plan name, and no total anywhere (M-06). &euro;16,500 is the four place sponsor
rate, per your own fee schedule (M-07).

**Change to** One sentence, above the fold, containing every number a buyer needs and their sum.

**Paste** Replacing the current fee line. Bracketed values from D-1:

> **[€18,500] tuition, plus a [€1,900] residential fee for the three modules.
> Total [€20,400] per participant, excluding VAT.**
> Payable [50%] on confirmation and [50%] thirty days before Module I. Corporate sponsors booking
> [four or more] places in a calendar year pay [€16,500] per participant: see [URL].

The last line is the load-bearing one. It is what stops a machine that has found &euro;16,500 and
&euro;18,500 concluding that the price changed.

**Test**

```
curl -s https://brackwater.example/programmes/advanced-board/ | grep -c "20,400"
```

Must return at least 1. Today it returns 0, on every page of the domain.

**Done when** The programme page states a total, in text, within one sentence of the tuition figure
and the VAT position.

## FE-2 · The same sentence on /fees/

**Finding** 01. **Owner** Author. **Blocked by** D-1.

**Where** `https://brackwater.example/fees/`

**Now** A two row table giving &euro;16,500 and &euro;9,750 "excluding VAT", with the note
*"A residential fee applies"* and no amount for it. The page then refers the reader to the blocked
PDF (M-06, M-11).

**Change to** The table carries every component and the total. The PDF becomes a convenience rather
than the only source.

**Paste** Replace the table body with columns for Programme, Tuition, Residential, **Total excluding
VAT**, and a Notes column that names the sponsor tiers.

**Test** Read only the table. If you cannot get from it to the number on an invoice without opening
another document, a machine cannot either.

**Done when** `/fees/` states a total for each programme in its own text.

## FE-3 · Name the sponsor rates as sponsor rates

**Finding** 01. **Owner** Author. **Blocked by** D-1.

**Where** `/programmes/advanced-board/`, `/fees/`, `/programmes/senior-leadership/`

**Now** Your fee schedule holds a three tier sponsor table, &euro;18,500 for one place, &euro;17,600
for two to three, &euro;16,500 for four or more, and it says in terms that the figure quoted on the
website is the four place rate (M-07). Nothing on the website says so.

**Change to** Either the tiers are published, with the qualifying condition beside each, or the
website stops quoting the four place rate to individuals. Both work. Quoting it without the condition
is the only option that does not.

**Paste**

> **Corporate sponsors.** [€18,500] per participant for one place, [€17,600] for two to three places
> in the same calendar year, [€16,500] for four or more. All excluding VAT and the residential fee.

**Test** Search the domain for `16,500`. Every surviving match must sit within one sentence of the
words that qualify it.

**Done when** No occurrence of the sponsor rate appears on brackwater.example without the condition
that earns it.

## FE-4 · Date the 2024 blog post in its own first line

**Finding** 01. **Owner** Author.

**Where** `https://brackwater.example/blog/what-the-programme-costs-2024/`

**Now** *"Published 4 March 2024."* is on the page, and it works: not one of the twelve answers quoted
the &euro;14,750 from this post, and every session read the date and left it alone (M-15). This is the
best behaved document on your domain and we predicted the opposite.

**Change to** Keep it, and make the same treatment the rule rather than the accident. Add one line at
the top rather than removing the post: a two year old price with a date on it is a useful artefact, and
retiring material without publishing a replacement leaves a machine with less than it had.

**Paste** As the first line of the post body, above the existing text:

> This post is from March 2024 and the fee it quotes is no longer current. The current fee is
> [€20,400] per participant including the residential fee, excluding VAT: see
> https://brackwater.example/programmes/advanced-board/

**Test** Read the first two hundred characters of the post. The superseding sentence must be inside
them, because that is roughly what a summariser carries forward.

**Done when** The post's first two hundred characters name its date and point at the current fee.

## FE-5 · Put the offer in a structured record, with a seller

**Finding** 01 and 02. **Owner** Template. **Blocked by** D-1 and D-2.

**Where** The cohort page chosen in D-2, and `/programmes/senior-leadership/`

**Now** The only `Offer` on the domain is on the March cohort page, it carries the sponsor rate as its
price, and it has no `seller` (M-04). No other page carries a price in a form a machine treats as a
price at all.

**Change to** One `Offer` per real price, on the cohort you are selling, joined to your organisation.

**Paste**

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://brackwater.example/programmes/advanced-board/#course",
  "name": "The Advanced Board Programme",
  "description": "Eleven days, residential, across three modules.",
  "provider": { "@id": "https://brackwater.example#organization" },
  "offers": [
    {
      "@type": "Offer",
      "name": "Individual place",
      "price": "[20400]",
      "priceCurrency": "EUR",
      "valueAddedTaxIncluded": false,
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "[YYYY-MM-DD]",
      "url": "https://brackwater.example/programmes/advanced-board/september-2026/",
      "seller": { "@id": "https://brackwater.example#organization" }
    },
    {
      "@type": "Offer",
      "name": "Corporate sponsor, four or more places",
      "price": "[16500]",
      "priceCurrency": "EUR",
      "valueAddedTaxIncluded": false,
      "eligibleQuantity": { "@type": "QuantitativeValue", "minValue": 4 },
      "seller": { "@id": "https://brackwater.example#organization" }
    }
  ],
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "Onsite",
    "startDate": "2026-09-14",
    "endDate": "2026-11-25",
    "location": { "@type": "Place", "name": "Brackwater Institute" }
  }
}
```

`seller.@id` is the join between the price and the company. Without it, a price and a company are two
unrelated facts on the same page.

**Test**

```
curl -s https://brackwater.example/programmes/advanced-board/ | grep -o '"price":"[0-9]*"'
```

The values returned must be the values a buyer is invoiced.

**Done when** Every published `Offer` on the domain carries a real price, a VAT flag and a `seller`
whose `@id` resolves to the `Organization` record.

## FE-6 · Give the fee schedule a text layer, or accept that the page is the source

**Finding** 01. **Owner** Author, then Template.

**Where** `https://brackwater.example/downloads/fee-schedule-2026.pdf`

**Now** Two pages, two image streams, zero embedded fonts, zero characters extractable (M-07).

**Change to** Either a PDF with a real text layer, or an accepted decision that the PDF is a designed
artefact and the HTML from FE-1 and FE-2 is the citable version. Both are defensible. What is not
defensible is the current position, where the only complete statement of your fee is a document
containing no characters.

**Paste** Not copy, a method. Export from the design tool as a text PDF rather than as flattened
images. If the source exists only as images, run OCR and embed the text layer. Then verify:

```
pdftotext fee-schedule-2026.pdf - | head -c 400
```

The first 400 characters are roughly what a summariser carries forward. If they are empty, nothing
downstream will ever quote this document. Whatever you choose, put a cover line in the first two
hundred characters of the file's own text, because **a PDF travels without its download page**:

> Brackwater Institute fee schedule [2026]. Published [date]. Total per participant [€20,400]
> excluding VAT. Current fees in HTML: https://brackwater.example/fees/

Set `dc:title`, `dc:description` and `dc:modified` to the same sentence.

**Done when** `pdftotext` on the fee schedule returns non-empty text containing the total, or the
total is live in HTML on both `/fees/` and the programme page and the PDF is labelled on the page as a
design version of it.

---

# Block CO · One offer

Closes findings 02 and 03. Five items. Blocked until D-2 and D-3 are answered.

Nothing in this block changes `/legal/booking-terms/`. It is the best built page on your domain and
the work is all on the pages that disagree with it.

## CO-1 · Move the Course record onto the cohort you are selling

**Finding** 02. **Owner** Template. **Blocked by** D-2. **Free action 2 from page 15 of the scan,
listed for completeness and not to be sold back to you.**

**Where** `/programmes/advanced-board/march-2026/` and `/programmes/advanced-board/september-2026/`

**Now** The March page carries the domain's only `Course` record. It declares
`availability: InStock` and `endDate: 2026-03-20`, which was 164 days before this measurement. The
September page carries no record of any kind (M-04).

**Change to** The record lives on the cohort on sale, with true dates, the FE-5 offer, and an
availability that is true. The March page either loses its record or carries one whose
`CourseInstance` has passed and whose offer is `SoldOut`.

**Paste** The record in FE-5, on the September page. On the March page, if it keeps one:

```json
"offers": { "@type": "Offer", "availability": "https://schema.org/SoldOut",
            "url": "https://brackwater.example/programmes/advanced-board/september-2026/" },
"hasCourseInstance": { "@type": "CourseInstance",
            "startDate": "2026-03-09", "endDate": "2026-03-20" }
```

**Test**

```
curl -s https://brackwater.example/programmes/advanced-board/march-2026/ | grep -c "InStock"
```

Must return 0.

**Done when** No page on brackwater.example declares a `CourseInstance` whose `endDate` has passed as
`InStock`.

## CO-2 · Put the cohort sentence in the HTML

**Finding** 02. **Owner** Template.

**Where** `https://brackwater.example/`

**Now** The home page is missing exactly two blocks of text from the document your server sends, and
they are the only place on it that names the current cohort (M-02):
*"Next cohort: 14 September 2026."* and *"Applications close 31 July 2026. Two places remain."*

**Change to** The sentence is in the page the server sends. The script can stay and do whatever else
it does, including updating the count.

**Paste** In the HTML, inside `#cohort-banner` rather than injected into it:

```html
<div id="cohort-banner">
  <div class="note"><strong>Next cohort: [14 September 2026].</strong>
  Applications close [31 July 2026]. [Two] places remain.</div>
</div>
```

**Test**

```
curl -s https://brackwater.example/ | grep -c "September 2026"
```

Must return at least 1. Today it returns 0.

**Done when** The current cohort date appears in the document the server sends for `/`.

## CO-3 · The load-bearing conditions on the marketing pages

**Finding** 03. **Owner** Author. **Blocked by** D-3. **Free action 3 from page 15 of the scan. The
scan called it two sentences. It is four, and the other two are the ones that stop the next dispute.**

**Where** `/admissions/` and `/programmes/advanced-board/`

**Now** Both say *"Free cancellation up to 30 days before the programme starts."* The booking terms
say 50% is due on confirmation and is retained *"irrespective of when notice is given"* (M-09).
Neither marketing page mentions the residential fee or VAT.

**Change to** The marketing pages state every condition that can cost the buyer money, in the terms
page's own numbers.

**Paste** Replacing the cancellation paragraph on both pages:

> **What you owe, and when**
>
> These are the same conditions as in the Booking Terms, which is the binding document and governs
> where anything on this page differs from it: https://brackwater.example/legal/booking-terms/
>
> - **[50%] of the fee falls due on confirmation of a place, and is not refundable**, whenever you
>   cancel.
> - The remaining [50%], and the [€1,900] residential fee, fall due [30] days before Module I.
> - Cancelling fewer than [30] days before Module I: the full fee is retained.
> - A place may be transferred once, to the next cohort of the same programme, at no charge, with at
>   least [30] days' notice.
> - All fees are stated excluding VAT.

**Test** Ask a model, given only your pages: *"What happens if I cancel a Brackwater place two months
before it starts?"* If the answer says anything other than that half the fee is already gone, the page
is not doing its job. Today one of three said exactly that, one said the opposite, and one said both.

**Done when** Every condition in the booking terms that can void a refund also appears in the text of
`/admissions/`, with the same number.

## CO-4 · Delete the free cancellation sentence everywhere it survives

**Finding** 03. **Owner** Author. **Blocked by** D-3.

**Where** `/admissions/`, `/programmes/advanced-board/`, `/blog/what-the-programme-costs-2024/`, and
`/programmes/senior-leadership/` if it carries one.

**Now** The blog post also says *"If a place is cancelled, we refund in full up to 30 days before the
programme starts."* Three live pages, one sentence, and the binding document says otherwise.

**Change to** The sentence does not exist on the domain in that form. On the blog post it is covered
by the superseding line in FE-4; on the marketing pages it is replaced by CO-3.

**Test** Search the domain for `free cancellation` and for `refund in full`. Every surviving match must
be inside the booking terms or inside a passage that names the 50%.

**Done when** No live page on brackwater.example states a cancellation position that the booking terms
contradict.

## CO-5 · Put the September page in the sitemap

**Finding** 02 and 05. **Owner** Template. **Blocked by** D-2.

**Where** `https://brackwater.example/sitemap-pages.xml`

**Now** Fourteen URLs. Fifteen pages are live. The missing one is the cohort you are selling (M-03).
All three sessions found it anyway, because your programme page links to it, and that is your site
working. It should not have to.

**Change to** The sitemap lists what you want read. The current cohort is in it with a `lastmod` that
is true, and the closed cohort either stays with an honest `lastmod` or comes out, per D-2.

**Test**

```
curl -s https://brackwater.example/sitemap-pages.xml | grep -c "september-2026"
```

Must return 1.

**Done when** Every page you intend a machine to read is in `sitemap-pages.xml`, and no page in it is
one you would rather it did not quote.

---

# Block RC · Readable claims

Closes findings 04, 05 and 06. Nine items in three groups.

## FA-1 · Render the eleven faculty names on the server

**Finding** 04. **Owner** Template.

**Where** `https://brackwater.example/faculty/`

**Now** 38 blocks in a browser, 14 in the document your server sends, 36.8% readable. The 24 missing
blocks are the eleven names, the eleven descriptions and the two table headings (M-01, M-02).

**Change to** The table is in the HTML. The script may stay.

**Paste** The same eleven rows, written into the page rather than injected:

```html
<table>
  <thead><tr><th>Name</th><th>Teaches</th></tr></thead>
  <tbody>
    <tr><td>Dr Aurelie Vanthoor</td><td>Chair of the programme. Twenty two years on listed boards.</td></tr>
    <!-- the remaining ten rows, verbatim from the FACULTY array already in the page -->
  </tbody>
</table>
```

This is not a rebuild and it is not a framework decision. It is the same list, in the page instead of
beside it.

**Test**

```
curl -s https://brackwater.example/faculty/ | grep -c "Vanthoor"
```

Must return at least 1. Today it returns 0.

**Done when** The rendering comparison on `/faculty/` returns zero missing blocks.

## FA-2 · A Person record for each

**Finding** 04. **Owner** Template. **Depends on** FA-1.

**Where** `/faculty/`

**Now** No JSON-LD of any kind on the page (M-04).

**Paste** One per person, or a single `ItemList`:

```json
{ "@context": "https://schema.org", "@type": "Person",
  "name": "[Dr Aurelie Vanthoor]",
  "jobTitle": "[Chair of the programme]",
  "knowsAbout": ["[governance]", "[board practice]"],
  "affiliation": { "@id": "https://brackwater.example#organization" },
  "sameAs": ["[LinkedIn or institutional profile URL]"] }
```

`sameAs` is what turns a name into a person a machine can look up. Where you have no profile to point
at, leave the field out rather than filling it with something adjacent.

**Test** Paste the page into a structured data validator. Eleven `Person` entities must be reported.

**Done when** Every named member of faculty is a `Person` record with an `affiliation` that resolves
to your `Organization`.

## FA-3 · Name the faculty on the programme page too

**Finding** 04. **Owner** Author.

**Where** `/programmes/advanced-board/`

**Now** The programme page does not name a single member of faculty. Neither did any of the twelve
answers, on any question, including *"is it worth it"* (M-15).

**Change to** Three or four names on the page where the buyer decides, with what each teaches, linked
to `/faculty/`.

**Test** Ask a model, given only your pages: *"Who teaches the Advanced Board Programme?"* Today the
honest answer available to it is nobody.

**Done when** `/programmes/advanced-board/` names at least three members of faculty in its own text.

## AC-1 · Publish what the accreditation actually is

**Finding** 05. **Owner** Author. **Blocked by** D-4.

**Where** `https://brackwater.example/about/accreditation/`

**Now** One sentence claiming accreditation, one image with `alt=""`, no body name in text, no
register number, no link (M-13). The certificate is blocked and expired in 2024 (M-10).

**Change to** The claim carries the three things that make it checkable: who, which entry, and where
to verify it.

**Paste**

> Brackwater Institute is accredited by the [European Council for Executive Development], register
> entry [number], valid to [date]. The Council's register is at [URL] and our entry is at [URL].
> Accreditation covers [the Advanced Board Programme] and [the Senior Leadership Programme] and is
> reviewed on a three year cycle.

And give the image a real alt attribute:

```html
<img src="/assets/ecied-mark.png" width="180" height="90"
     alt="Accredited by the [European Council for Executive Development], since [2021]">
```

**Where a value is not ours to supply, we supply none.** Every bracket above is a Brackwater fact.

**Test**

```
curl -s https://brackwater.example/about/accreditation/ | grep -c "European Council"
```

Must return at least 1. Today it returns 0, because the name exists only inside a PNG.

**Done when** The accrediting body is named as text and a register number appears on the page.

## AC-2 · The same number in the Organization record

**Finding** 05. **Owner** Template. **Blocked by** D-4. **Depends on** AC-1.

**Where** Every page carrying the `Organization` record, which today is the home page only (M-05).

**Now** No `identifier`, no `legalName`, an empty `PostalAddress`, an empty `contactPoint.telephone`.

**Paste**

```json
{
  "@type": "Organization",
  "@id": "https://brackwater.example#organization",
  "name": "Brackwater Institute",
  "legalName": "[registered name]",
  "identifier": [
    { "@type": "PropertyValue", "name": "[Chamber of Commerce]", "value": "[number]" },
    { "@type": "PropertyValue", "name": "[European Council for Executive Development]", "value": "[register entry]" }
  ],
  "vatID": "[NL……]",
  "address": { "@type": "PostalAddress", "streetAddress": "[Keizersgracht 000]",
               "postalCode": "[1015 XX]", "addressLocality": "Amsterdam", "addressCountry": "NL" },
  "contactPoint": { "@type": "ContactPoint", "contactType": "admissions",
                    "email": "admissions@brackwater.example", "telephone": "[+31 …]" },
  "hasCredential": { "@type": "EducationalOccupationalCredential",
                     "credentialCategory": "accreditation",
                     "recognizedBy": { "@type": "Organization", "name": "[European Council for Executive Development]" },
                     "validIn": "[EU]", "validFor": "[P3Y]" }
}
```

An `identifier` turns a claim into something checkable. A registration number takes a machine to a
register. A street address takes it to three directories that disagree.

**Test** Fetch any page and search for `identifier`. It must be present and populated.

**Done when** The `Organization` record carries a populated address, a contact point and at least one
identifier, and appears on every page rather than on one.

## AC-3 · The certificate, out of the blocked directory

**Finding** 05. **Owner** Author. **Blocked by** D-4. **See also** PR-1.

**Where** `https://brackwater.example/downloads/accreditation-2021.pdf`

**Now** Blocked by `Disallow: /downloads/`. It has a working text layer. It says it expired on
13 June 2024 (M-10, M-11).

**Change to** Either a current certificate, published where it can be read, or the 2021 one left
reachable with a line inside it saying what superseded it. Not blocked, in either case.

**Paste** On page one of whichever certificate is current, and inside its metadata:

> Brackwater Institute, accredited by [the European Council for Executive Development], register entry
> [number]. Issued [date], valid to [date]. Current status:
> https://brackwater.example/about/accreditation/

**Do not leave this behind a Disallow.** Two reasons, and the second matters more. Disallow is a
request not to fetch that several user-triggered fetchers ignore by design, so the file keeps being
read. And a blocked document cannot carry a cover page saying what it is. Blocking is the one
intervention that leaves the stale claim standing and removes your correction at the same time.

**Test** `pdftotext` on the certificate must return, within the first 200 characters, the register
number and the current validity date.

**Done when** The certificate a machine can reach is one that states current status in its own first
two hundred characters.

## OU-1 · One outcome figure, with a denominator

**Finding** 06. **Owner** Author. **Blocked by** D-5. **Free action 4 from page 15 of the scan,
listed for completeness and not to be sold back to you.**

**Where** `https://brackwater.example/outcomes/`

**Now** A single figure, 92%, with the sourcing line *"Source: our alumni survey."* No year, no group,
no count (M-08). Not one of the twelve answers contained it.

**Change to** The figures live on the page as an ordinary HTML table, each with its year, its group
and how many people that was.

**Paste** Every bracket is a Brackwater fact and we supply none of them:

```html
<table>
  <caption>Brackwater alumni outcomes, [2023] and [2024] cohorts. Survey conducted [month year].</caption>
  <thead><tr><th>Measure</th><th>Value</th><th>Cohort year</th><th>Group measured</th>
             <th>People in that group</th><th>Responses</th></tr></thead>
  <tbody>
    <tr><td>Promoted or took a wider role within two years</td><td>[92]%</td><td>[2023]</td>
        <td>[Advanced Board Programme participants]</td><td>[n]</td><td>[n]</td></tr>
  </tbody>
</table>
```

A percentage with a denominator is a fact. A percentage without one is a claim, and page 9 of the scan
sets out which class of fact that puts it in.

**Test**

```
curl -s https://brackwater.example/outcomes/ | grep -o "[0-9]\{1,3\}%"
```

Every figure returned must sit in a row that also states a year and a count.

**Done when** `/outcomes/` states every published outcome figure with a cohort year, a group and a
count.

## OU-2 · One value across the domain

**Finding** 06. **Owner** Author. **Blocked by** D-5. **Depends on** OU-1.

**Where** `/` and `/programmes/advanced-board/`

**Now** *"9 in 10 alumni advance to a wider role within 18 months"* on the home page and
*"87% of participants report a step up in scope"* on the programme page. Three figures, three windows,
one survey (M-08). Every session that answered the promotion question reached for the home page, which
carries the vaguest version.

**Change to** One figure is the published figure and it appears identically everywhere. Any other that
survives says in the same sentence which different group and which different year it measures.

**Paste** The single form, used verbatim on every page:

> [92]% of [Advanced Board Programme participants] were promoted or took a wider role within [two]
> years. [2023] cohort, [n] people. Method and full figures:
> https://brackwater.example/outcomes/

**Test** Search the domain for `9 in 10`, `87` and `92`. Every surviving match must carry a year and a
group in the same sentence.

**Done when** No promotion figure appears anywhere on brackwater.example without its year, group and
count.

## OU-3 · The same treatment for the Senior Leadership Programme

**Finding** 06. **Owner** Author.

**Where** `/programmes/senior-leadership/` and `/outcomes/`

**Now** Not measured (M-16). The page runs on the same templates and we have not read its claims.

**Change to** Whatever OU-1 and OU-2 establish, applied there in the same pass rather than in a second
project.

**Done when** No outcome figure anywhere on the domain lacks a year, a group and a count.

---

# Block PR · Permission and reading list

Four items. This is the fastest block and it contains the cheapest change in the document.

## PR-1 · Reconsider the Disallow, document by document

**Finding** 01, 05. **Owner** Estate. **Depends on** AC-3 and FE-6.

**Where** `https://brackwater.example/robots.txt`

**Now** One line, `Disallow: /downloads/`, blocking exactly two documents: the only complete statement
of your fee, and the only evidence of your accreditation (M-11). Nothing else is blocked and nothing
else is in that directory. `/cgi-bin/` does not exist.

**Change to** A decision per document rather than per directory. Our recommendation is that both come
out from behind it, because neither contains anything you would not tell a buyer on the phone, and both
are documents an agent is currently guessing about.

**Paste**

```
User-agent: *
Allow: /

Sitemap: https://brackwater.example/sitemap.xml
```

If a document genuinely must not be fetched, move it out of the public tree rather than asking
politely. Do not name AI crawlers. You currently block none, and that is why this report could be
written from your own pages at all.

**Test**

```
curl -s https://brackwater.example/robots.txt | grep -c "Disallow: /downloads/"
```

Must return 0, or the two documents must no longer be in that directory.

**Done when** No document that states a fee or evidences a claim sits behind a Disallow.

## PR-2 · Fifteen pages, fifteen entries

**Finding** 05. **Owner** Template. **Same change as CO-5**, repeated here because the sitemap is this
block's responsibility and CO-5 is blocked on D-2 while this is not.

**Where** `sitemap-pages.xml`

**Test** Count the `<loc>` elements. It must equal the number of pages you intend to be read.

**Done when** `sitemap-pages.xml` and the set of pages you want quoted are the same set.

## PR-3 · The Organization record on every page

**Finding** 05. **Owner** Template. **Depends on** AC-2.

**Where** All fifteen pages.

**Now** The `Organization` record exists on the home page only (M-04, M-05). Every other page is
structurally anonymous: a machine reading `/programmes/advanced-board/` in isolation has no
machine-readable statement of whose programme it is.

**Change to** The record, or a reference to it by `@id`, in the head of every page. This is a template
include, not fifteen edits.

**Test** Fetch three pages at random and search for `#organization`. All three must have it.

**Done when** Every page on brackwater.example carries or references the `Organization` record.

## PR-4 · An llms.txt, once the rest is true

**Finding** none. Found by the raw fetch. **Owner** Author. **Depends on** FE-1, CO-1, CO-3, OU-1.

**Where** `https://brackwater.example/llms.txt`, which returns 404 today (M-03).

**Change to** A short markdown file naming the pages on the domain that carry the load, one line each.

**Paste** Once the brackets above are filled:

```markdown
# Brackwater Institute

> Brackwater Institute is [registered name], an executive education provider in Amsterdam running
> residential programmes for board members and senior leaders. Fees, cohort dates and cancellation
> terms are published on the pages below and those pages are authoritative.

## The programme
- [The Advanced Board Programme](https://brackwater.example/programmes/advanced-board/): eleven days,
  residential, three modules. Total [€20,400] per participant excluding VAT. Next cohort
  [14 September 2026].

## The terms
- [Booking terms](https://brackwater.example/legal/booking-terms/): the binding document. It governs
  where any other page differs from it. [50%] of the fee is due on confirmation and is not refundable.

## Outcomes and accreditation
- [Outcomes](https://brackwater.example/outcomes/): figures with their cohort year, group and count.
  Figures not on this page are not current Brackwater figures.
- [Accreditation](https://brackwater.example/about/accreditation/): body, register entry and validity.
```

**The honest limit, stated so this is not oversold.** llms.txt is a proposal. No major agent has
committed to reading it, and its absence costs you nothing today. It is worth doing anyway, and the
exercise of writing it is the cheapest possible test of everything else in this document: **if you
cannot fill in the brackets above from your own pages, neither can an agent.**

**Test**

```
curl -s https://brackwater.example/llms.txt | head -5
```

Must name Brackwater and at least one URL.

**Done when** `llms.txt` exists, names the programme page, the booking terms and the outcomes page,
and contains no `Disallow` line.

---

# Order of operations

Not order of severity. This is the order in which the work does not have to be done twice.

| # | Item | Block | Owner | Blocked by | Closes |
|---|---|---|---|---|---|
| 1 | CO-2 · cohort sentence into the HTML | CO | Template | nothing | 02 |
| 2 | PR-2 · September page into the sitemap | PR | Template | nothing | 02, 05 |
| 3 | FA-1 · eleven faculty names on the server | RC | Template | nothing | 04 |
| 4 | **D-1 · what a place costs** | | **Decision** | | |
| 5 | FE-1 · the total on the programme page | FE | Author | D-1 | 01 |
| 6 | FE-2 · the total on /fees/ | FE | Author | D-1 | 01 |
| 7 | FE-3 · sponsor rates named as such | FE | Author | D-1 | 01 |
| 8 | FE-4 · date the 2024 post | FE | Author | FE-1 | 01 |
| 9 | **D-2 · which cohort you are selling** | | **Decision** | | |
| 10 | CO-1 · move the Course record | CO | Template | D-2 | 02 |
| 11 | CO-5 · sitemap, per D-2 | CO | Template | D-2 | 02, 05 |
| 12 | FE-5 · the offer as a record, with a seller | FE | Template | D-1, D-2 | 01, 02 |
| 13 | **D-3 · which text is the promise** | | **Decision** | | |
| 14 | CO-3 · conditions on the marketing pages | CO | Author | D-3 | 03 |
| 15 | CO-4 · remove the free cancellation sentence | CO | Author | CO-3 | 03 |
| 16 | **D-5 · which promotion figure is current** | | **Decision** | | |
| 17 | OU-1 · the outcomes table | RC | Author | D-5 | 06 |
| 18 | OU-2 · one value across the domain | RC | Author | OU-1 | 06 |
| 19 | OU-3 · the second programme | RC | Author | OU-1 | 06 |
| 20 | **D-4 · the accreditation** | | **Decision** | | |
| 21 | AC-1 · publish what it is | RC | Author | D-4 | 05 |
| 22 | AC-2 · the same number in the record | RC | Template | AC-1 | 05 |
| 23 | AC-3 · the certificate out of the blocked directory | RC | Author | AC-1 | 05 |
| 24 | PR-1 · reconsider the Disallow | PR | Estate | AC-3, FE-6 | 01, 05 |
| 25 | PR-3 · the record on every page | PR | Template | AC-2 | 05 |
| 26 | FA-2 · a Person record each | RC | Template | FA-1 | 04 |
| 27 | FA-3 · faculty on the programme page | RC | Author | FA-1 | 04 |
| 28 | FE-6 · the fee schedule text layer | FE | Author | FE-1 | 01 |
| 29 | PR-4 · llms.txt | PR | Author | everything above | |

PR-4 is last on purpose. It is a summary of every answer above it, and writing it first produces a file
that has to be rewritten. It is also the fastest way to find out whether the rest of the work landed.

## If you only do one thing, do FE-1

One sentence on the programme page giving the tuition, the residential fee, the total and the VAT
position. Fifteen minutes, no budget line, and it is the finding that costs the most: the number a
participant is invoiced, &euro;20,400, occurs in zero characters of readable text anywhere on your
domain, and three sessions consequently gave three different totals and none of them was yours.

That is the same advice page 16 of the scan gives, and this report does not improve on it.

## The two the scan could not see

**CO-1.** The March cohort's `Course` record declares `availability: InStock` with an `endDate` 164
days in the past. The free scan measured visible text and could see that two cohorts were live. It
could not see that the finished one is the only one carrying a machine-readable declaration that it is
still on sale. Two lines in a template.

**PR-3.** The `Organization` record exists on one page of fifteen. Every other page on your domain is
structurally anonymous. That is not a finding a reader can reach from the visible text at all, because
the visible text says "Brackwater Institute" in the header of every page.

Neither is in the free scan, and both are cheap. They are the clearest illustration we can give of what
the difference between the tiers actually is: the scan measured what you can read, and this report
measured what you cannot.

## If you do only what is free, do these four

All four are already in this document with the words written out. They are listed for completeness,
not to be sold back to you.

| Scan's free action | Item here | What it costs |
|---|---|---|
| The total, VAT position and residential fee in one sentence | FE-1 | fifteen minutes |
| Move the Course record onto the September cohort | CO-1 | thirty minutes |
| The 50% that is not refundable, on /admissions/ | CO-3 | two sentences |
| A year, a group and a count beside every promotion figure | OU-1 | one afternoon |

The cross-check runs both ways: all four of the scan's free actions map to a work item here, and the
two items the scan could not name (CO-1's record half and PR-3) are also free if you have a developer
and an afternoon. If a free action did not map to a work item or a decision, one of the two documents
would be wrong.

---

# The verification remeasurement

Included in the block price, at zero. A grading table and nothing else: one row per **Done when**, yes
or no, no partial credit, no narrative column.

| # | Item | Done when | Pass |
|---|---|---|---|
| 1 | FE-1 | The programme page states a total in text, within one sentence of the tuition figure and the VAT position | |
| 2 | FE-2 | `/fees/` states a total for each programme in its own text | |
| 3 | FE-3 | No occurrence of the sponsor rate appears without the condition that earns it | |
| 4 | FE-4 | The 2024 post's first 200 characters name its date and point at the current fee | |
| 5 | FE-5 | Every published `Offer` carries a real price, a VAT flag and a resolving `seller.@id` | |
| 6 | FE-6 | `pdftotext` on the fee schedule returns the total, or the total is live in HTML on both pages and the PDF is labelled as a design version | |
| 7 | CO-1 | No page declares a `CourseInstance` whose `endDate` has passed as `InStock` | |
| 8 | CO-2 | The current cohort date appears in the document the server sends for `/` | |
| 9 | CO-3 | Every condition in the booking terms that can void a refund appears in `/admissions/`, with the same number | |
| 10 | CO-4 | No live page states a cancellation position the booking terms contradict | |
| 11 | CO-5 | Every page you intend to be read is in `sitemap-pages.xml` | |
| 12 | FA-1 | The rendering comparison on `/faculty/` returns zero missing blocks | |
| 13 | FA-2 | Every named member of faculty is a `Person` record with a resolving `affiliation` | |
| 14 | FA-3 | The programme page names at least three members of faculty in its own text | |
| 15 | AC-1 | The accrediting body is named as text and a register number appears on the page | |
| 16 | AC-2 | The `Organization` record carries a populated address, contact point and at least one identifier | |
| 17 | AC-3 | The reachable certificate states current status in its first 200 characters | |
| 18 | OU-1 | `/outcomes/` states every figure with a cohort year, a group and a count | |
| 19 | OU-2 | No promotion figure appears anywhere without its year, group and count | |
| 20 | OU-3 | No outcome figure anywhere on the domain lacks a year, a group and a count | |
| 21 | PR-1 | No document that states a fee or evidences a claim sits behind a Disallow | |
| 22 | PR-2 | graded as CO-5 above: the sitemap and the set of pages you want quoted are the same set | |
| 23 | PR-3 | Every page carries or references the `Organization` record | |
| 24 | PR-4 | `llms.txt` names the programme page, the booking terms and the outcomes page | |

Plus the sixteen measurements from Part One, re-run identically and reported side by side.

## What we will not grade

We will not grade whether the agents are nicer about you. What the work changes is what there is to
read, and that is what gets graded.

## The two numbers worth watching, reported with their limits

**One · how many different totals come back for one place on the programme.** On 31 August, three
sessions gave three, and none was &euro;20,400. That is the number this work is designed to move and
it is the closest thing to a before and after this method produces.

**Two · how many answers state the cancellation position correctly.** On 31 August, one of three. One
gave the opposite and one gave both inside a single paragraph.

**And the limit, stated plainly.** Two sessions given identical documents on the same afternoon gave
answers &euro;1,900 apart, and two of our own five written-in-advance predictions were wrong. A
remeasurement that comes back better is evidence, not proof. If a finding in this report cannot be
reproduced in your presence, we refund the report.

---

# Method

Every measurement in Part One was taken on **31 August 2026 between 14:10 and 15:58 CEST** against
brackwater.example as served, using ordinary public requests, without cookies and without logging in.
No form was submitted, no account was created and nothing was probed.

**Plain text files are exact.** robots.txt, `sitemap.xml`, `sitemap-pages.xml` and the 404 response are
reproduced as served.

**HTML readings are taken at the source.** Each page was retrieved as the document the server sends and
parsed with no script executed, so the canonical tag, the meta robots directive and the JSON-LD are read
as published. The rendering comparison is between that document and the finished page after scripts ran,
compared block by block, counting text nodes of four characters or more.

**PDF readings are structural.** We counted pages, `/Type /Font` objects, embedded font programs and
image streams, and ran one text extraction on each file. We did not read either document as a reader
would, and we make no claim about anything that exists inside them only as an image.

**No live agent was asked anything about Brackwater Institute**, because there is nothing to ask about.
The twelve answers are from three independent model sessions given only the documents the server sends,
each asked the same four questions, quoted rather than characterised. Several tests in this document ask
you to run the same experiment yourself. We do not predict what will come back, and neither should
anybody selling you this kind of work.

**One correction to the free scan is printed in this document rather than fixed quietly** (M-14).

---

# Appendix A · The reading test, in full

The complete method, the five predictions as written in advance, and all twelve answers verbatim are in
the accompanying file `reading-test.md`. It is part of this deliverable and is not summarised here,
because a summary of an answer is not an answer.

# Appendix B · Reproducing this measurement

The demonstration site, the measurement harness and the report build are in the accompanying folder.
Three commands reproduce every figure in Part One from nothing:

```
python3 build_site.py        # writes the fifteen pages, robots.txt and the sitemaps
python3 build_assets.py      # renders the image-only fee schedule and the text-layer certificate
python3 measure.py           # the dual fetch, the raw head, the file layer, writes evidence.json
```

`measure.py` is the instrument. On a live domain it takes a hostname instead of a local port and does
the same six things in the same order.

---

**meihuizen.ai · info@meihuizen.ai · +31 85 060 1641**
**Cruquiuskade 251, 1018 AM Amsterdam**

Questions on this document: **report@meihuizen.ai**, with the domain in the subject line.

© 2026 meihuizen.ai · All rights reserved
