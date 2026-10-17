# SEO human optimizations: measurement log

Purpose: keep apart the changes that came from Nico's own competitor picks (human optimizations) from the machine-translated and machine-researched copy, so the effect of each can be measured later in Search Console.

## How to measure

- **Baseline window:** the 28 days before the merge of branch `translations-restore` to main. Note: for most of that window the NL/DE/FR/IT/ES/PT pages were noindex stubs, so the baseline for those languages is close to zero. Compare against the English pages over the same window as a control.
- **Merge date:** ____ (fill in when the PR is merged). Then wait for Google to recrawl (URL Inspection, "Request indexing" on the 8 main pages per language speeds this up).
- **Read-outs:** at 28 and 90 days after the merge, Search Console → Performance → Search results:
  - Filter Country = Germany, Austria, Switzerland (for DE), Italy (for IT), Spain (for ES), Portugal (for PT) and France, Belgium (for FR); filter Page contains `/de/` or `/it/`.
  - Record impressions, clicks, CTR, average position per page.
  - Queries tab: check whether the target terms below show up, and which queries actually bring traffic.
- **What counts as an effect of the human pass:** movement on the pages and terms listed below, compared with the agent-only pages (NL) over the same period.

| read-out | date | DE impr. | DE clicks | IT impr. | IT clicks | ES impr. | ES clicks | PT impr. | PT clicks | FR impr. | FR clicks | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline (28 d before merge) | | | | | | | | | | | | |
| +28 days | | | | | | | | | | | | |
| +90 days | | | | | | | | | | | | |

## Layers of change (so effects can be attributed)

1. **Machine translation** (commit "Restore NL, DE, FR, IT, ES, PT..."): all 8 main pages in 6 languages, standard local terms.
2. **Machine keyword research** (same commit): per-country terms from national press and agency sites (DE KI-Agenten, KI-Sichtbarkeit; FR agents IA, visibilité IA; ES agentes de IA; PT agentes de IA, IA para vendas; IT agenti AI per aziende, GEO, ChatGPT; LT DI agentai verslui, DI matomumo auditas).
3. **Human optimizations** (this file): competitor sites chosen by Nico, 17 Oct 2026.

---

## DE: human optimizations (17 Oct 2026, commit "DE: wording from DACH KI agencies")

**Competitor sites (Nico's pick, Berlin, Munich, Hamburg):** contextstudios.ai/de, contextstudios.ai/de/ki-beratung-berlin, brainhuggers.com/corporate?lang=de, factorial.io/de, oronts.com/de/ai, arctisai.com/de

**Lessons taken:**
- Every competitor names its category in the title: "KI-Agentur", "KI-Entwicklungsagentur", "KI-natives Studio".
- Trust phrases: "direkt mit dem Gründer", "gründergeführt", "in Produktion", "produktionsreif".
- "Erstgespräch" is the standard word for the first call.
- Second Audience competition: "Wie lesbar ist Ihre Website für KI?" (Brainhuggers, which runs its own scan), "Ihre Kunden fragen zuerst die KI" and "GEO & AEO" (Context Studios).

**Deliberately not copied:** city names in titles (no office there; false local claim), "Festpreis", "kostenlos/unverbindlich" for the call, "KI-Beratung" (consulting is a positioning choice, not wording).

**/de/** (home)

| field | before | after |
|---|---|---|
| title | KI-Agenten für Unternehmen, die laufen \| meihuizen.ai | KI-Agentur: KI-Agenten in Produktion \| meihuizen.ai |
| description | Wir entwickeln KI-Agenten für Unternehmen und individuelle KI-Software, die in Produktion geht, nicht nur in die Demo. Mit Erfahrung aus der Enterprise-IT. | KI-Agentur für den DACH-Raum: KI-Agenten und Individualsoftware, die in Produktion gehen statt in der Demo. Direkt mit dem Gründer, ab dem Erstgespräch. |

Target terms: KI-Agentur, KI-Agenten, Individualsoftware, DACH.

**/de/projects/second-audience.html**

| field | before | after |
|---|---|---|
| title | KI-Sichtbarkeit prüfen (GEO): Second Audience \| meihuizen.ai | KI-Sichtbarkeit prüfen (GEO & AEO) \| Second Audience |
| description | Was erzählen ChatGPT, Claude, Gemini und Perplexity über Sie? Wiederkehrender Audit Ihrer KI-Sichtbarkeit (GEO), mit Belegen. Der Scan ist kostenlos. | Wie lesbar ist Ihre Website für KI? Was ChatGPT, Claude, Gemini und Perplexity über Sie lesen und falsch verstehen, mit Belegen. Der Scan ist kostenlos. |

Target terms: KI-Sichtbarkeit, GEO, AEO, "Website für KI".

**/de/contact.html**

| field | before | after |
|---|---|---|
| title | Kontakt zu meihuizen.ai \| KI-Agenten und KI-Software | Erstgespräch mit der KI-Agentur \| meihuizen.ai |

**Buttons, all DE pages:** "15 Min. über Fritz buchen" → "15-Min.-Erstgespräch über Fritz buchen".

**Structured data, all 8 languages (home page):** areaServed now adds Germany, Austria, Switzerland next to the EU and the Netherlands.

---

## IT: human optimizations (17 Oct 2026, commit "IT: tu register and Milano agency wording")

**Competitor sites (Nico's pick, Milan and Rome):** uretech.it/servizi/agenti-ai, algoretico.it/it, syncronika.it

**Lessons taken:**
- Italian AI agencies address the reader as **tu** ("Agenti AI per la tua azienda", "falla tua"). The whole Italian site switched from Lei (pages) and voi (Fritz widget, cookie banner) to tu. This is the biggest single change, and it affects every Italian page, not only the SEO fields.
- "Agenti AI per aziende" (Uretech title) was already our home term: confirmed.
- "su misura" (Uretech x4: "Agenti AI su Misura"), "soluzioni AI", "assistente virtuale" (Uretech "Chatbot & Assistenti Virtuali"), "automazione dei processi aziendali".
- CTA style "Parliamone" / "Parliamo del tuo progetto" (all three).

**Deliberately not copied:** Milano/Roma (no office there), "consulenza gratuita" (not offered; the free offers are the scan and a 15 minute call), "ROI misurabile", "integrazione con sistemi esistenti", PMI.

**/it/**

| field | before | after |
|---|---|---|
| title | Agenti AI per aziende e AI agentica \| meihuizen.ai | Agenti AI su misura per aziende, AI agentica \| meihuizen.ai |
| description | Agenti AI per aziende: software di intelligenza artificiale, flussi di lavoro agentici e web app pronte per la produzione. Con esperienza IT enterprise. | Agenti AI su misura per aziende: soluzioni AI, flussi di lavoro agentici e web app pronte per la produzione, con esperienza IT enterprise. |

**/it/contact.html**

| field | before | after |
|---|---|---|
| title | Contatti: chieda a Fritz o scriva a Nico \| meihuizen.ai | Contatti: chiedi a Fritz o scrivi a Nico \| meihuizen.ai |
| description | Tre modi per contattare meihuizen.ai: l’assistente AI Fritz, una call di 15 minuti o un messaggio a Nico. Lun. a ven., 10:00 alle 18:00, ora di Kaunas. | Parliamone: chiedi all’assistente virtuale Fritz, prenota una call conoscitiva di 15 minuti o scrivi a Nico. Lun. a ven., 10:00 alle 18:00, ora di Kaunas. |
| h1 | Tre modi per contattarci. Scelga il più veloce. | Tre modi per contattarci. Scegli il più veloce. |

**/it/projects/second-audience.html**

| field | before | after |
|---|---|---|
| title | GEO: cosa dice ChatGPT della Sua azienda? \| Second Audience | GEO: cosa dice ChatGPT della tua azienda? \| Second Audience |
| description | Scansione GEO gratuita: misuriamo cosa ChatGPT, Claude, Gemini e Perplexity leggono davvero sul Suo sito e dove sbagliano. Audit periodico, con prove. | Scansione GEO gratuita: misuriamo cosa ChatGPT, Claude, Gemini e Perplexity leggono davvero sul tuo sito e dove sbagliano. Audit periodico, con prove. |
| h1 | Oggi il Suo sito ha due tipi di visitatori. | Oggi il tuo sito ha due tipi di visitatori. |

**/it/projects/agent-fritz.html**

| field | before | after |
|---|---|---|
| title | Agente AI per le vendite sul Suo sito \| Agent Fritz | Agente AI per le vendite sul tuo sito \| Agent Fritz |
| description | Agente AI per le vendite, non un semplice chatbot: risponde solo dalle Sue pagine, fissa incontri, qualifica i lead e invia documenti. Lo provi qui. | Agente AI per le vendite e assistente virtuale su misura: risponde solo dalle tue pagine, fissa incontri, qualifica i lead e invia documenti. Provalo qui. |

**/it/projects/ai-sales-deal-intelligence.html**

| field | before | after |
|---|---|---|
| description | Cinque trattative a settimana. Saprà quando una si ferma, e perché. AI per le vendite B2B, da uno a cinque venditori, da 39 € al mese. Provi la demo. | Cinque trattative a settimana. Saprai quando una si ferma, e perché. AI per le vendite B2B, da uno a cinque venditori, da 39 € al mese. Prova la demo. |
| h1 | Cinque trattative a settimana. Saprà quando una si ferma. | Cinque trattative a settimana. Saprai quando una si ferma. |
Other IT changes in the same commit: About card "Automated AI workflows" heading → "Automazione dei processi aziendali con l'AI"; contact buttons → "Parliamone", "Parliamo del tuo progetto", "Parliamo della tua istanza"; demo chat lines and the home hero chat switched to tu.

Target terms: agenti AI su misura, agenti AI per aziende, AI agentica, assistente virtuale, agente AI per le vendite, GEO, ChatGPT.

**Open:** Fritz's live answers come from the contact-form repo. If they answer Italian visitors in Lei or voi, the register there still needs to switch to tu, or the register test is muddied.

---

## ES: human optimizations (17 Oct 2026, commit "ES: wording from Barcelona and Madrid AI agencies")

**Sites (Nico's pick):** bldiseno.com/agencia-ia-barcelona, digitup.studio (Madrid), fundaciontelefonica.com, aigency.es (Barcelona)

**Usefulness of the picks:**
- BL Diseño (Barcelona) is the closest match: agentes de IA, automatización, auditoría IA, "control humano", "pruebas, no promesas", "en producción". It writes **usted**, which settled the register: Spain stays on usted.
- Digitup (Madrid) writes tú/vosotros, with "a medida", "de la idea a producción", "Chatbots IA", "IA para empresas".
- Fundación Telefónica is a corporate foundation for the general public, not a competitor: no usable SEO signal.
- AIgency is an AI video production house and its homepage is set to noindex, nofollow, so Google does not index it: nothing to learn for search. Its "nativa de IA" matches our existing "nativo de IA".

**Lessons taken:** "agencia de IA" as the category term (BL title and h1), "a medida" (both), "chatbot con IA" (BL service name), "Hablemos" / "Hablar de su caso" CTAs (BL), founder-direct trust angle.

**Deliberately not copied:** Barcelona/Madrid (no office there), "precio cerrado" (not offered for builds), "pymes" and sector lists (not claimed on our pages).

**/es/**

| field | before | after |
|---|---|---|
| title | Agentes de IA para empresas e IA agéntica \| meihuizen.ai | Agencia de IA: agentes de IA a medida \| meihuizen.ai |
| description | Agentes de IA para empresas que llegan a producción: IA agéntica, herramientas LLM y software nativo de IA, con experiencia en IT empresarial. | Agencia de IA para empresas: agentes de IA y software a medida que llegan a producción, no se quedan en la demo. Trato directo con el fundador. |

**/es/contact.html**

| field | before | after |
|---|---|---|
| title | Contacto \| meihuizen.ai, agentes de IA para empresas | Hablemos \| meihuizen.ai, agencia de IA para empresas |
| description | Tres formas de contactar con meihuizen.ai: pregunte a Agent Fritz, reserve 15 minutos o escriba a Nico. Lun. a vie., de 10:00 a 18:00, hora de Kaunas. | Hablemos: pregunte a Agent Fritz, reserve una llamada de 15 minutos o escriba a Nico. Lun. a vie., de 10:00 a 18:00, hora de Kaunas. |

**/es/projects/agent-fritz.html**

| field | before | after |
|---|---|---|
| title | Agente de IA de ventas para su web \| Agent Fritz | Chatbot con IA para su web: Agent Fritz \| meihuizen.ai |
| description | Más que un chatbot con IA para su web: responde solo con sus páginas, reserva reuniones, cualifica leads y entrega documentos. Pruébelo en la esquina. | Agente de IA de ventas para su web: responde solo con sus páginas, cualifica leads, reserva reuniones y le pasa a Nico lo que toca. Pruébelo en la esquina. |


**Buttons, ES pages:** "Iniciar un proyecto" → "Hablar de su proyecto" (home, about, builds).

Target terms: agencia de IA, agentes de IA a medida, chatbot con IA para su web, auditoría de visibilidad en IA (unchanged), IA para ventas (unchanged).

---

## PT: human optimizations (17 Oct 2026, commit "PT: wording from Portuguese AI studios")

**Sites (Nico's pick):** nilg.ai/pt (Porto), polarisai.studio/pt/sobre (Lisbon)

**Usefulness of the picks:**
- NILG.AI is the real match: AI strategy and automation for companies, pt-PT. It writes **tu** throughout ("Escala a tua empresa com Inteligência Artificial").
- Polaris AI Studio is a creative studio (websites, AI visuals), less comparable. It mixes registers: formal "Conheça", "Fale connosco" next to "Envia-nos".

**Register: Portugal stays formal ("o seu").** One clear tu site is not enough evidence, and keeping PT formal gives a control for the Italian switch to tu: if IT improves and PT does not, the register is a candidate cause; if both improve, it is the wording.

**Lessons taken:**
- "Inteligência Artificial" spelled out (NILG h1), not only "IA".
- "à medida" (NILG "Soluções à medida", the pt-PT form of "tailor-made").
- "automatiza(r)" + "empresa" (NILG, ~12 uses).
- "Fale connosco" as the contact CTA (Polaris; formal, standard pt-PT).
- First-person CTAs avoid the register question altogether (NILG "Analisar a minha empresa", "Quero automatizar a minha empresa"): the scan button became "Analisar o meu site, grátis".

**Deliberately not copied:** Lisboa/Porto (no office there), PMEs (not claimed), "escalar" growth promises (not on our pages).

**/pt/**

| field | before | after |
|---|---|---|
| title | Agentes de IA para empresas e IA agêntica \| meihuizen.ai | Agentes de IA à medida para empresas \| meihuizen.ai |
| description | Agentes de IA para empresas e software de IA agêntica que atua nos seus processos e entra em produção. Com anos de TI empresarial na IBM e na Oracle. | Agentes de IA à medida: software de Inteligência Artificial que automatiza os processos da sua empresa e entra em produção, não fica pela demo. |

**/pt/contact.html**

| field | before | after |
|---|---|---|
| title | Contacto \| meihuizen.ai, agentes de IA para empresas | Fale connosco \| meihuizen.ai, agentes de IA à medida |


**Buttons, PT pages:** "Iniciar um projeto" → "Fale connosco" (home, about, builds); "Pedir uma análise gratuita" → "Analisar o meu site, grátis" (Second Audience).

Target terms: agentes de IA à medida, Inteligência Artificial, automatizar processos, visibilidade em IA (unchanged), chatbot com IA (unchanged).

---

## FR: human optimizations (17 Oct 2026, commit "FR: wording from Paris AI agencies")

**Sites (Nico's pick, Paris):** thecodingmachine.com, ia.agency, flowlab.studio/studio-ia-paris, synodique.com/paris, yieldstudio.fr/agence-ia-paris, genee.tech/agence-agent-ia-paris, agence-lewis.fr/agence-ia-paris (added mid-pass)

**Usefulness of the picks:** all seven are relevant. All seven write **vous**, so France keeps vous. Six of seven put Paris in the title and h1 with a real office address.

**Direct competitor for Second Audience:** Genee sells an "Audit GEO gratuit", and IA Agency an "Agence GEO" service. In France the free GEO audit is already a known offer.

**Lessons taken:**
- "agence IA" as the category term (IA Agency ~20x, Synodique, Yield, Genee "agence d'agents IA"); "studio IA" (Flowlab).
- "sur mesure" everywhere (TCM ~15x).
- Production over slides: "on installe un système qui tourne, pas une slide" (Synodique), "De l'idée à la prod" (TCM).
- Trust: "garde-fous", "humain dans la boucle", "escalade vers un humain" (Genee). Fritz really has server-side guardrails and hands over to Nico, so this went into the Fritz description.
- "Agent commercial" as a product name (Lewis: Agent Commercial, Agent Support Client), with "chatbot" used as the contrast. Fritz keeps "chatbot IA" in the title for search volume and is called "agent commercial IA" in the description.
- Lewis also leads with "Des chiffres, pas des promesses" and "Sans engagement"; we use neither (no published results figures yet; the call is not described as no-obligation on our pages).
- CTA: "Parlons de votre projet" (TCM), "Discutons de votre projet" (IA Agency, Yield).

**Deliberately not copied:** Paris/Île-de-France (no office there), "PME/ETI" (not claimed), "devis gratuit" and diagnostic prices (not offered), "souverain/RGPD" claims for Fritz (true of the planned EU stack, but not stated on the current pages).

**/fr/**

| field | before | after |
|---|---|---|
| title | Agents IA pour entreprise, sur mesure \| meihuizen.ai | Agence IA : agents IA sur mesure \| meihuizen.ai |
| description | Agents IA pour entreprise et logiciels d’IA agentique sur mesure, prêts pour la production, pas des démos. Ancrés dans l’IT d’entreprise. | Agence IA pour entreprises : agents IA et logiciels sur mesure qui tournent en production, pas des slides. En direct avec le fondateur. |

**/fr/contact.html**

| field | before | after |
|---|---|---|
| title | Contact \| meihuizen.ai, agents IA et logiciels sur mesure | Parlons de votre projet \| meihuizen.ai, agence IA |

**/fr/projects/second-audience.html**

| field | before | after |
|---|---|---|
| description | Audit GEO récurrent : ce que ChatGPT, Claude, Gemini et Perplexity lisent, font et comprennent de travers sur votre site. Le premier scan est gratuit. | Audit GEO récurrent : ce que ChatGPT, Claude, Gemini et Perplexity lisent, font et comprennent de travers sur votre site. Le premier scan GEO est gratuit. |

**/fr/projects/agent-fritz.html**

| field | before | after |
|---|---|---|
| description | Chatbot IA commercial pour votre site : il répond à partir de vos seules pages, qualifie les leads, réserve les rendez-vous et transmet les documents. | Agent commercial IA avec garde-fous : il répond à partir de vos seules pages, qualifie les leads, réserve les rendez-vous et passe la main à un humain. |


**Buttons, FR pages:** "Lancer un projet" → "Parlons de votre projet" (home, about, builds).

Target terms: agence IA, agents IA sur mesure, chatbot IA commercial, agent commercial IA, garde-fous, audit GEO, scan GEO gratuit.

---

## All languages: focus regions (17 Oct 2026, commit "Focus regions per country, from the mobile office")

**Idea (Nico):** we cannot win on a physical address, but the mobile office can have focus regions per country, chosen for clients and for where the van can park. A pattern for now; a public tour schedule may follow.

**Regions:** DE Berlin, Hamburg, München · IT Milano, Roma · ES Barcelona, Madrid · FR Paris · PT Lisboa, Porto · NL Randstad · LT Kaunas, Vilnius.

**Where:**
- About page, "the office has wheels" section, one sentence per language (EN lists all countries, so Fritz knows them; Fritz reads the English pages).
- Home page, van card: "Anywhere in the EU" plus that country's regions.

**What to measure:** queries combining the category term with a city (KI-Agentur Berlin, agenzia AI Milano, agencia de IA Madrid, agence IA Paris, agentes de IA Lisboa, AI-bureau Randstad / Amsterdam / Utrecht, DI agentai Kaunas / Vilnius) and impressions on /about and the home page per country. Expect organic results only: the map pack needs a verified local address.

**Open:** LT sentence needs a native proofread. Lyon not included for FR (two Paris competitors are Lyon-based); add it if the van goes there.

---

## All languages: the 2027 European Tour page (17 Oct 2026, commit "The 2027 European Tour")

**Idea (Nico):** make the focus regions real, like a band: a public tour schedule. New top-level page tour.html (English first), "tour" in the main navigation on every page.

**Legs:** Feb/Mar Milano, Roma · Apr/May Barcelona, Madrid · Jun/Jul Lyon, Paris · Aug summer break · Sep/Oct Porto, Lisboa · Nov/Dec Berlin, Vilnius, Kaunas.

**Also changed:** FR focus regions now Lyon and Paris (home, about), EN about list too. Fritz's knowledge now includes tour.html.

**What to measure:** impressions and clicks on /tour.html; queries with a city name per leg; requests through the contact form that name a leg or city; whether visitors from a leg's country rise in the two months before that leg.

**Open:** DE focus regions say Berlin, Hamburg, München, but the tour stops only in Berlin; NL Randstad is a focus region with no tour stop. No Event structured data on purpose: Google's event rules are for events people attend, and a sales tour risks a manual action.

---

## All languages: tour page translated, tour cities as location markers (17 Oct 2026, commit "Tour page in all 8 languages, tour cities as location markers")

- tour.html now exists in NL, DE, FR, IT, ES, PT and LT, with hreflang between all 8 and its own sitemap entries. The nav "tour" link on every page now points to that language's own tour page.
- **Location markers:**
  - Each language's tour title and description lead with that country's leg cities and months: DE "Berlin, Nov./Dez. 2027: KI-Agentur auf Tour", IT "Milano e Roma, febbraio e marzo 2027", ES "Barcelona y Madrid, abril y mayo", FR "Lyon, Paris, juin et juillet 2027", PT "Porto e Lisboa, setembro e outubro de 2027", LT "Vilnius ir Kaunas, 2027 m. lapkritis ir gruodis". NL (no Dutch stop) leads with "Tour 2027: van Milano tot Kaunas".
  - Tour structured data: spatialCoverage lists all 11 cities as City with address (locality, country) and geo coordinates, plus temporalCoverage 2027-02-01/2027-12-31.
  - Home structured data (all 8 languages): areaServed adds the 11 tour cities, each contained in its country.
  - City names stay endonyms everywhere (Milano, Roma, Lisboa), because they are what locals search.
- **What to measure:** per country, queries of the form category term + leg city, and impressions on /<lang>/tour.html, starting about two months before each leg.
- **Not used:** geo meta tags (geo.region, geo.placename); Google ignores them.

---

## Next human passes (to add here)

NL and LT: competitor sites to be supplied by Nico. Until then NL is the agent-only comparison group (LT had an agent SEO retune only).
