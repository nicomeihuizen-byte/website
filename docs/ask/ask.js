/*
 * Agent Fritz: the chat in the corner of every page. Named after Nico's dog.
 *
 * This file is only the window. The agent runs server side (api/chat.js in
 * the website-contact-function project): it reads this site's pages through
 * a read_page tool, answers from what it read, and can file a free scan
 * request by email. Every step streams back here and is shown as it
 * happens, because watching the agent work is the demo.
 *
 * Built for the site's CSP: no inline style attributes, no innerHTML with
 * anything the model wrote. Text is placed with textContent, and the only
 * links rendered are to this site and to info@meihuizen.ai.
 *
 * The conversation survives page navigation through sessionStorage and
 * disappears with the tab. This file stores nothing anywhere else.
 */
(function () {
  'use strict';
  if (window.__fritz) { return; }
  window.__fritz = true;

  let script = document.currentScript;
  let ENDPOINT = (script && script.getAttribute('data-endpoint')) ||
    'https://website-contact-function-4efp.vercel.app/api/chat';
  const KEY = 'fritz-v1';
  const MAX_CHARS = 800;
  const MAX_HISTORY = 16;
  const SPIN = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  const T = {
    en: {
      launch: 'ask fritz', tip: 'Questions about meihuizen.ai? Fritz reads the site so you don’t have to.',
      status: 'online · answers from this site only', down: 'asleep · email info@meihuizen.ai',
      boot: ['{n} pages indexed', 'answers only from what the pages say', 'can file a free scan request for you'],
      ready: 'Ready. What do you want to know?',
      placeholder: 'Ask about meihuizen.ai…', send: 'Send', reset: 'New conversation', close: 'Close', open: 'Open Agent Fritz, the chat assistant',
      thinking: 'sniffing through the pages…', miss: 'not on this site', sources: 'read', you: 'you',
      scan: ['scan request filed', 'Nico has it in his inbox.'],
      err: { offline: 'Fritz is asleep right now. Email info@meihuizen.ai.', rate: 'That’s a lot of questions. Give Fritz a minute.', timeout: 'That took too long. Try again, or email info@meihuizen.ai.', network: 'Can’t reach Fritz. Check your connection, or email info@meihuizen.ai.', input: 'Keep it under 800 characters.', upstream: 'Something went wrong on Fritz’s side. Try again, or email info@meihuizen.ai.' },
      suggest: ['What does meihuizen.ai build?', 'Is meihuizen.ai a registered company?', 'What is Second Audience?', 'I’d like a free scan'],
      foot: 'Answers come only from this site’s pages. AI can still be wrong, so check the source. Don’t share sensitive data.', how: 'How Fritz works'
    },
    nl: {
      launch: 'vraag fritz', tip: 'Vragen over meihuizen.ai? Fritz leest de site, dan hoeft u dat niet.',
      status: 'online · antwoordt alleen vanuit deze site', down: 'slaapt · mail info@meihuizen.ai',
      boot: ['{n} pagina’s geïndexeerd', 'antwoordt alleen met wat de pagina’s zeggen', 'kan een gratis scan voor u aanvragen'],
      ready: 'Klaar. Wat wilt u weten?',
      placeholder: 'Vraag iets over meihuizen.ai…', send: 'Versturen', reset: 'Nieuw gesprek', close: 'Sluiten', open: 'Open Agent Fritz, de chatassistent',
      thinking: 'snuffelt door de pagina’s…', miss: 'staat niet op deze site', sources: 'gelezen', you: 'u',
      scan: ['scanaanvraag verstuurd', 'Nico heeft hem in zijn inbox.'],
      err: { offline: 'Fritz slaapt even. Mail info@meihuizen.ai.', rate: 'Dat zijn veel vragen. Geef Fritz een minuut.', timeout: 'Dat duurde te lang. Probeer het opnieuw of mail info@meihuizen.ai.', network: 'Fritz is niet bereikbaar. Controleer uw verbinding of mail info@meihuizen.ai.', input: 'Houd het onder de 800 tekens.', upstream: 'Er ging iets mis aan de kant van Fritz. Probeer het opnieuw of mail info@meihuizen.ai.' },
      suggest: ['Wat bouwt meihuizen.ai?', 'Is meihuizen.ai een ingeschreven bedrijf?', 'Wat is Second Audience?', 'Ik wil een gratis scan'],
      foot: 'Antwoorden komen alleen van de pagina’s van deze site. AI kan zich nog steeds vergissen, dus controleer de bron. Deel geen gevoelige gegevens.', how: 'Hoe Fritz werkt'
    },
    de: {
      launch: 'frag fritz', tip: 'Fragen zu meihuizen.ai? Fritz liest die Website, damit Sie es nicht müssen.',
      status: 'online · antwortet nur aus dieser Website', down: 'schläft · info@meihuizen.ai',
      boot: ['{n} Seiten indexiert', 'antwortet nur mit dem, was auf den Seiten steht', 'kann für Sie einen kostenlosen Scan anfragen'],
      ready: 'Bereit. Was möchten Sie wissen?',
      placeholder: 'Fragen Sie etwas zu meihuizen.ai…', send: 'Senden', reset: 'Neues Gespräch', close: 'Schließen', open: 'Agent Fritz öffnen, den Chat-Assistenten',
      thinking: 'schnüffelt durch die Seiten…', miss: 'nicht auf dieser Website', sources: 'gelesen', you: 'Sie',
      scan: ['Scan-Anfrage gesendet', 'Nico hat sie im Postfach.'],
      err: { offline: 'Fritz schläft gerade. Schreiben Sie an info@meihuizen.ai.', rate: 'Das sind viele Fragen. Geben Sie Fritz eine Minute.', timeout: 'Das hat zu lange gedauert. Versuchen Sie es erneut oder schreiben Sie an info@meihuizen.ai.', network: 'Fritz ist nicht erreichbar. Prüfen Sie Ihre Verbindung oder schreiben Sie an info@meihuizen.ai.', input: 'Bitte unter 800 Zeichen bleiben.', upstream: 'Bei Fritz ist etwas schiefgegangen. Versuchen Sie es erneut oder schreiben Sie an info@meihuizen.ai.' },
      suggest: ['Was baut meihuizen.ai?', 'Ist meihuizen.ai ein eingetragenes Unternehmen?', 'Was ist Second Audience?', 'Ich möchte einen kostenlosen Scan'],
      foot: 'Antworten stammen nur von den Seiten dieser Website. KI kann sich trotzdem irren, prüfen Sie also die Quelle. Teilen Sie keine sensiblen Daten.', how: 'So arbeitet Fritz'
    },
    fr: {
      launch: 'demander à fritz', tip: 'Des questions sur meihuizen.ai ? Fritz lit le site pour vous.',
      status: 'en ligne · répond uniquement à partir de ce site', down: 'endormi · info@meihuizen.ai',
      boot: ['{n} pages indexées', 'répond uniquement avec ce que disent les pages', 'peut demander un scan gratuit pour vous'],
      ready: 'Prêt. Que voulez-vous savoir ?',
      placeholder: 'Posez une question sur meihuizen.ai…', send: 'Envoyer', reset: 'Nouvelle conversation', close: 'Fermer', open: 'Ouvrir Agent Fritz, l’assistant de chat',
      thinking: 'flaire les pages…', miss: 'absent de ce site', sources: 'lu', you: 'vous',
      scan: ['demande de scan envoyée', 'Nico l’a dans sa boîte de réception.'],
      err: { offline: 'Fritz dort pour l’instant. Écrivez à info@meihuizen.ai.', rate: 'Cela fait beaucoup de questions. Laissez une minute à Fritz.', timeout: 'C’était trop long. Réessayez ou écrivez à info@meihuizen.ai.', network: 'Impossible de joindre Fritz. Vérifiez votre connexion ou écrivez à info@meihuizen.ai.', input: 'Restez sous 800 caractères.', upstream: 'Un problème est survenu du côté de Fritz. Réessayez ou écrivez à info@meihuizen.ai.' },
      suggest: ['Que construit meihuizen.ai ?', 'meihuizen.ai est-elle une société immatriculée ?', 'Qu’est-ce que Second Audience ?', 'Je voudrais un scan gratuit'],
      foot: 'Les réponses viennent uniquement des pages de ce site. L’IA peut tout de même se tromper, vérifiez donc la source. Ne partagez pas de données sensibles.', how: 'Comment Fritz fonctionne'
    },
    es: {
      launch: 'pregunta a fritz', tip: '¿Preguntas sobre meihuizen.ai? Fritz lee el sitio por usted.',
      status: 'en línea · responde solo a partir de este sitio', down: 'dormido · info@meihuizen.ai',
      boot: ['{n} páginas indexadas', 'responde solo con lo que dicen las páginas', 'puede solicitar un escaneo gratuito por usted'],
      ready: 'Listo. ¿Qué quiere saber?',
      placeholder: 'Pregunte sobre meihuizen.ai…', send: 'Enviar', reset: 'Nueva conversación', close: 'Cerrar', open: 'Abrir Agent Fritz, el asistente de chat',
      thinking: 'olfateando las páginas…', miss: 'no está en este sitio', sources: 'leído', you: 'usted',
      scan: ['solicitud de escaneo enviada', 'Nico la tiene en su bandeja de entrada.'],
      err: { offline: 'Fritz está durmiendo. Escriba a info@meihuizen.ai.', rate: 'Son muchas preguntas. Dele un minuto a Fritz.', timeout: 'Tardó demasiado. Inténtelo de nuevo o escriba a info@meihuizen.ai.', network: 'No se puede contactar con Fritz. Compruebe su conexión o escriba a info@meihuizen.ai.', input: 'Menos de 800 caracteres, por favor.', upstream: 'Algo falló del lado de Fritz. Inténtelo de nuevo o escriba a info@meihuizen.ai.' },
      suggest: ['¿Qué construye meihuizen.ai?', '¿Es meihuizen.ai una empresa registrada?', '¿Qué es Second Audience?', 'Quiero un escaneo gratuito'],
      foot: 'Las respuestas salen solo de las páginas de este sitio. La IA aún puede equivocarse, así que compruebe la fuente. No comparta datos sensibles.', how: 'Cómo funciona Fritz'
    },
    it: {
      launch: 'chiedi a fritz', tip: 'Domande su meihuizen.ai? Fritz legge il sito al posto vostro.',
      status: 'online · risponde solo da questo sito', down: 'dorme · info@meihuizen.ai',
      boot: ['{n} pagine indicizzate', 'risponde solo con ciò che dicono le pagine', 'può richiedere per voi una scansione gratuita'],
      ready: 'Pronto. Cosa volete sapere?',
      placeholder: 'Chiedete qualcosa su meihuizen.ai…', send: 'Invia', reset: 'Nuova conversazione', close: 'Chiudi', open: 'Apri Agent Fritz, l’assistente in chat',
      thinking: 'annusa tra le pagine…', miss: 'non è su questo sito', sources: 'letto', you: 'voi',
      scan: ['richiesta di scansione inviata', 'Nico l’ha nella sua casella di posta.'],
      err: { offline: 'Fritz sta dormendo. Scrivete a info@meihuizen.ai.', rate: 'Sono tante domande. Date un minuto a Fritz.', timeout: 'Ci è voluto troppo. Riprovate o scrivete a info@meihuizen.ai.', network: 'Fritz non è raggiungibile. Controllate la connessione o scrivete a info@meihuizen.ai.', input: 'Restate sotto gli 800 caratteri.', upstream: 'Qualcosa è andato storto dal lato di Fritz. Riprovate o scrivete a info@meihuizen.ai.' },
      suggest: ['Cosa costruisce meihuizen.ai?', 'meihuizen.ai è una società registrata?', 'Cos’è Second Audience?', 'Vorrei una scansione gratuita'],
      foot: 'Le risposte vengono solo dalle pagine di questo sito. L’IA può comunque sbagliare, quindi controllate la fonte. Non condividete dati sensibili.', how: 'Come funziona Fritz'
    },
    pt: {
      launch: 'pergunte ao fritz', tip: 'Perguntas sobre a meihuizen.ai? O Fritz lê o site por si.',
      status: 'online · responde apenas a partir deste site', down: 'a dormir · info@meihuizen.ai',
      boot: ['{n} páginas indexadas', 'responde apenas com o que as páginas dizem', 'pode pedir uma análise gratuita por si'],
      ready: 'Pronto. O que quer saber?',
      placeholder: 'Pergunte sobre a meihuizen.ai…', send: 'Enviar', reset: 'Nova conversa', close: 'Fechar', open: 'Abrir o Agent Fritz, o assistente de chat',
      thinking: 'a farejar as páginas…', miss: 'não está neste site', sources: 'lido', you: 'você',
      scan: ['pedido de análise enviado', 'O Nico já o tem na caixa de entrada.'],
      err: { offline: 'O Fritz está a dormir. Escreva para info@meihuizen.ai.', rate: 'São muitas perguntas. Dê um minuto ao Fritz.', timeout: 'Demorou demasiado. Tente de novo ou escreva para info@meihuizen.ai.', network: 'Não é possível contactar o Fritz. Verifique a ligação ou escreva para info@meihuizen.ai.', input: 'Menos de 800 caracteres, por favor.', upstream: 'Algo correu mal do lado do Fritz. Tente de novo ou escreva para info@meihuizen.ai.' },
      suggest: ['O que constrói a meihuizen.ai?', 'A meihuizen.ai é uma empresa registada?', 'O que é o Second Audience?', 'Quero uma análise gratuita'],
      foot: 'As respostas vêm apenas das páginas deste site. A IA pode mesmo assim enganar-se, por isso confirme a fonte. Não partilhe dados sensíveis.', how: 'Como funciona o Fritz'
    }
  };

  let LANG = (document.documentElement.getAttribute('lang') || 'en').slice(0, 2).toLowerCase();
  if (!T[LANG]) { LANG = 'en'; }
  let t = T[LANG];
  let PREFIX = LANG === 'en' ? '/' : '/' + LANG + '/';
  let PAGE_NAMES = {
    'index.html': 'home', 'projects/second-audience.html': 'second audience',
    'projects/ai-sales-deal-intelligence.html': 'five', 'projects/off-grid-ai-homestead.html': 'one acre',
    'projects/terminal-portfolio-website.html': 'portfolio', 'projects/agent-fritz.html': 'agent fritz'
  };

  // --- state ---------------------------------------------------------
  let state = { open: false, items: [], history: [], tipped: false };
  try {
    let saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (saved && Array.isArray(saved.items) && Array.isArray(saved.history)) { state = saved; }
  } catch (e) { /* storage blocked: the chat still works, it just forgets */ }
  function save() {
    try {
      state.items = state.items.slice(-40);
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }

  // --- tiny DOM helpers ------------------------------------------------
  function el(tag, cls, text) {
    let n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (text != null) { n.textContent = text; }
    return n;
  }
  function svgPaw() {
    let NS = 'http://www.w3.org/2000/svg';
    let s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'fritz-paw'); s.setAttribute('aria-hidden', 'true');
    [['ellipse', { cx: 12, cy: 16.2, rx: 5.2, ry: 4.3 }], ['circle', { cx: 5.8, cy: 10.6, r: 2 }],
     ['circle', { cx: 9.4, cy: 6.6, r: 2.15 }], ['circle', { cx: 14.6, cy: 6.6, r: 2.15 }], ['circle', { cx: 18.2, cy: 10.6, r: 2 }]]
      .forEach(function (d) {
        let c = document.createElementNS(NS, d[0]);
        Object.keys(d[1]).forEach(function (k) { c.setAttribute(k, d[1][k]); });
        s.appendChild(c);
      });
    return s;
  }

  // Minimal markdown: paragraphs, lists, **bold**, `code`, and links that
  // stay on this site. Built node by node; model text never becomes HTML.
  let LIST_RE = /^\s*(?:[-*•]|\d+[.)])\s+/;
  function renderText(text, parent) {
    let blocks = text.replace(/\r/g, '').split(/\n{2,}/);
    blocks.forEach(function (block) {
      let lines = block.split('\n');
      let list = null, para = null;
      lines.forEach(function (line) {
        if (!line.trim()) { return; }
        if (LIST_RE.test(line)) {
          para = null;
          if (!list) { list = el(/^\s*\d/.test(line) ? 'ol' : 'ul'); parent.appendChild(list); }
          let li = el('li'); inline(line.replace(LIST_RE, ''), li); list.appendChild(li);
        } else {
          list = null;
          if (!para) { para = el('p'); parent.appendChild(para); } else { para.appendChild(el('br')); }
          inline(line, para);
        }
      });
    });
  }
  let INLINE_RE = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|(info@meihuizen\.ai)/g;
  function safeHref(url) {
    if (/^https:\/\/(www\.)?meihuizen\.ai(\/|$)/.test(url)) { return url; }
    if (/^\/(?!\/)/.test(url)) { return url; }
    return null;
  }
  function inline(s, parent) {
    let last = 0, m;
    INLINE_RE.lastIndex = 0;
    while ((m = INLINE_RE.exec(s))) {
      if (m.index > last) { parent.appendChild(document.createTextNode(s.slice(last, m.index))); }
      if (m[1]) { parent.appendChild(el('strong', null, m[1])); }
      else if (m[2]) { parent.appendChild(el('code', null, m[2])); }
      else if (m[3]) {
        let href = safeHref(m[4]);
        if (href) { let a = el('a', null, m[3]); a.href = href; parent.appendChild(a); }
        else { parent.appendChild(document.createTextNode(m[3])); }
      } else if (m[5]) { let mail = el('a', null, m[5]); mail.href = 'mailto:' + m[5]; parent.appendChild(mail); }
      last = INLINE_RE.lastIndex;
    }
    if (last < s.length) { parent.appendChild(document.createTextNode(s.slice(last))); }
  }

  // --- build ------------------------------------------------------------
  let root, panel, log, form, input, sendBtn, suggest, count, status, launch, tip, live;
  let busy = false, spinTimer = null, spinFrame = 0, pagesCount = null;

  function build() {
    root = el('div', 'fritz');
    root.setAttribute('data-nosnippet', '');

    launch = el('button', 'fritz-launch');
    launch.type = 'button';
    launch.setAttribute('aria-label', t.open);
    launch.setAttribute('aria-haspopup', 'dialog');
    launch.setAttribute('aria-expanded', 'false');
    launch.appendChild(svgPaw());
    let lab = el('span');
    lab.appendChild(el('span', 'fritz-prompt', '~/'));
    lab.appendChild(document.createTextNode(t.launch));
    launch.appendChild(lab);
    launch.appendChild(el('span', 'fritz-live'));
    launch.addEventListener('click', function () { setOpen(true); });

    tip = el('div', 'fritz-tip', t.tip);
    tip.setAttribute('aria-hidden', 'true');

    panel = el('section', 'fritz-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Agent Fritz');

    let bar = el('div', 'fritz-bar');
    let dots = el('div', 'fritz-dots'); dots.appendChild(el('i')); dots.appendChild(el('i')); dots.appendChild(el('i'));
    let title = el('div', 'fritz-title');
    title.appendChild(el('b', null, 'fritz'));
    title.appendChild(document.createTextNode('@meihuizen.ai: ~/ask'));
    let resetBtn = el('button', 'fritz-icon-btn', '↺');
    resetBtn.type = 'button'; resetBtn.title = t.reset; resetBtn.setAttribute('aria-label', t.reset);
    resetBtn.addEventListener('click', reset);
    let closeBtn = el('button', 'fritz-icon-btn', '×');
    closeBtn.type = 'button'; closeBtn.title = t.close; closeBtn.setAttribute('aria-label', t.close);
    closeBtn.addEventListener('click', function () { setOpen(false); launch.focus(); });
    bar.appendChild(dots); bar.appendChild(title); bar.appendChild(resetBtn); bar.appendChild(closeBtn);

    status = el('div', 'fritz-status');
    status.appendChild(el('span', 'fritz-live'));
    status.appendChild(el('span', 'fritz-status-text', t.status));

    log = el('div', 'fritz-log');
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'off');
    log.tabIndex = 0;

    suggest = el('div', 'fritz-suggest');
    t.suggest.forEach(function (q) {
      let b = el('button', null, q); b.type = 'button';
      b.addEventListener('click', function () { ask(q); });
      suggest.appendChild(b);
    });

    count = el('div', 'fritz-count');

    form = el('form', 'fritz-form');
    form.appendChild(el('span', 'fritz-prompt', '›'));
    input = el('textarea', 'fritz-input');
    input.rows = 1; input.maxLength = MAX_CHARS + 200;
    input.placeholder = t.placeholder;
    input.setAttribute('aria-label', t.placeholder);
    sendBtn = el('button', 'fritz-send', '↵');
    sendBtn.type = 'submit'; sendBtn.setAttribute('aria-label', t.send); sendBtn.title = t.send;
    form.appendChild(input); form.appendChild(sendBtn);
    form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(input.value); }
    });
    input.addEventListener('input', onType);

    let foot = el('div', 'fritz-foot');
    foot.appendChild(document.createTextNode(t.foot + ' '));
    let how = el('a', null, t.how + ' →'); how.href = PREFIX + 'projects/agent-fritz.html';
    foot.appendChild(how);

    live = el('div', 'fritz-sr');
    live.setAttribute('aria-live', 'polite');

    panel.appendChild(bar); panel.appendChild(status); panel.appendChild(log);
    panel.appendChild(suggest); panel.appendChild(count); panel.appendChild(form); panel.appendChild(foot); panel.appendChild(live);
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setOpen(false); launch.focus(); }
    });

    root.appendChild(tip); root.appendChild(launch); root.appendChild(panel);
    document.body.appendChild(root);
  }

  // --- open / close -------------------------------------------------------
  let booted = false;
  function setOpen(open) {
    state.open = open;
    root.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('fritz-lock', open);
    launch.setAttribute('aria-expanded', String(open));
    tip.classList.remove('is-shown');
    state.tipped = true;
    save();
    if (open) {
      if (!booted) { booted = true; renderAll(state.items.length === 0); }
      setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }, 60);
    }
  }

  function reset() {
    if (busy) { return; }
    state.items = []; state.history = [];
    save();
    renderAll(false);
    input.focus();
  }

  // --- rendering ------------------------------------------------------------
  function bootBlock(animate) {
    let box = el('div', 'fritz-boot');
    let lines = [['cmd', 'fritz --grounded --site meihuizen.ai']];
    t.boot.forEach(function (l, i) {
      if (i === 0) {
        if (pagesCount) { lines.push(['ok', l.replace('{n}', pagesCount)]); }
      } else { lines.push(['ok', l]); }
    });
    lines.push(['ready', t.ready]);
    let reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!animate || reduce) {
      lines.forEach(function (l) { box.appendChild(el('div', l[0], l[1])); });
      return box;
    }
    // Typed out once, the first time the window opens in a session.
    let i = 0;
    (function next() {
      if (i >= lines.length) { return; }
      let line = el('div', lines[i][0], '');
      box.appendChild(line);
      let full = lines[i][1], c = 0, step = lines[i][0] === 'cmd' ? 1 : 3;
      (function type() {
        c += step;
        line.textContent = full.slice(0, c);
        if (c < full.length) { setTimeout(type, 14); } else { i++; setTimeout(next, 90); }
        scrollDown();
      })();
    })();
    return box;
  }

  function renderAll(animateBoot) {
    log.textContent = '';
    log.appendChild(bootBlock(animateBoot));
    state.items.forEach(function (item) { log.appendChild(renderItem(item, false)); });
    suggest.hidden = state.items.length > 0;
    scrollDown(true);
  }

  function renderItem(item, streaming) {
    if (item.type === 'user') {
      let u = el('div', 'fritz-msg user');
      u.appendChild(el('div', 'fritz-who', t.you + ' ›'));
      u.appendChild(el('div', 'fritz-body', item.text));
      return u;
    }
    if (item.type === 'error') {
      return el('div', 'fritz-error', t.err[item.code] || t.err.upstream);
    }
    let b = el('div', 'fritz-msg bot');
    fillBot(b, item, streaming);
    return b;
  }

  function fillBot(node, item, streaming) {
    node.textContent = '';
    node.appendChild(el('div', 'fritz-who', 'fritz ›'));
    let steps = null, lastText = null;
    item.segs.forEach(function (seg) {
      if (seg.kind === 'step') {
        if (!steps) { steps = el('div', 'fritz-steps'); node.appendChild(steps); }
        let row = el('div', 'fritz-step ' + (seg.status === 'run' ? 'run' : seg.ok ? 'done' : 'miss'));
        row.appendChild(el('span', 'glyph', seg.status === 'run' ? SPIN[spinFrame] : seg.ok ? '✓' : '✗'));
        row.appendChild(el('span', 'tool', seg.tool));
        let arg = seg.arg || '';
        if (seg.status !== 'run' && !seg.ok && seg.tool === 'read_page') { arg = (arg ? arg + ' · ' : '') + t.miss; }
        row.appendChild(el('span', 'arg', arg));
        if (seg.ms != null) { row.appendChild(el('span', 'ms', (seg.ms / 1000).toFixed(1) + 's')); }
        steps.appendChild(row);
      } else {
        steps = null;
        lastText = el('div', 'fritz-text');
        renderText(seg.text, lastText);
        node.appendChild(lastText);
      }
    });
    let last = item.segs[item.segs.length - 1];
    if (streaming) {
      if (!last || last.kind === 'step') {
        let th = el('div', 'fritz-thinking');
        th.appendChild(el('span', 'glyph', SPIN[spinFrame]));
        th.appendChild(document.createTextNode(t.thinking));
        node.appendChild(th);
      } else if (lastText) {
        let tail = lastText.lastElementChild || lastText;
        if (tail.tagName === 'UL' || tail.tagName === 'OL') { tail = tail.lastElementChild || tail; }
        tail.appendChild(el('span', 'fritz-caret'));
      }
    }
    if (item.action) {
      let card = el('div', 'fritz-action');
      card.appendChild(el('b', null, '✓ ' + t.scan[0] + ' · ' + item.action.domain));
      card.appendChild(el('span', null, t.scan[1]));
      node.appendChild(card);
    }
    if (!streaming && item.sources && item.sources.length) {
      let src = el('div', 'fritz-sources');
      src.appendChild(el('span', null, t.sources + ':'));
      item.sources.forEach(function (p) {
        let a = el('a', null, PAGE_NAMES[p] || p.replace(/^.*\//, '').replace(/\.html$/, '').replace(/-/g, ' '));
        a.href = PREFIX + (p === 'index.html' ? '' : p);
        src.appendChild(a);
      });
      node.appendChild(src);
    }
  }

  function scrollDown(force) {
    let near = log.scrollHeight - log.scrollTop - log.clientHeight < 120;
    if (force || near) { log.scrollTop = log.scrollHeight; }
  }

  function onType() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 110) + 'px';
    let n = input.value.length;
    count.textContent = n > MAX_CHARS - 200 ? n + ' / ' + MAX_CHARS : '';
    count.classList.toggle('warn', n > MAX_CHARS);
  }

  function setBusy(on) {
    busy = on;
    sendBtn.disabled = on;
    clearInterval(spinTimer);
    if (on) {
      spinTimer = setInterval(function () {
        spinFrame = (spinFrame + 1) % SPIN.length;
        let g = log.querySelectorAll('.fritz-step.run .glyph, .fritz-thinking .glyph');
        for (let i = 0; i < g.length; i++) { g[i].textContent = SPIN[spinFrame]; }
      }, 80);
    }
  }

  function setDown(down) {
    status.classList.toggle('is-down', down);
    status.lastChild.textContent = down ? t.down : t.status;
  }

  // --- the conversation --------------------------------------------------------
  function ask(raw) {
    let q = (raw || '').trim();
    if (!q || busy) { return; }
    if (q.length > MAX_CHARS) { onType(); return; }
    input.value = ''; onType();
    suggest.hidden = true;

    let userItem = { type: 'user', text: q };
    state.items.push(userItem);
    log.appendChild(renderItem(userItem));
    state.history.push({ role: 'user', content: q });
    while (state.history.length > MAX_HISTORY) { state.history.splice(0, 2); }

    let bot = { type: 'bot', segs: [], sources: [], action: null };
    let node = renderItem(bot, true);
    log.appendChild(node);
    scrollDown(true);
    setBusy(true);
    save();

    let queued = false;
    function paint() {
      if (queued) { return; }
      queued = true;
      requestAnimationFrame(function () { queued = false; fillBot(node, bot, busy); scrollDown(); });
    }

    function handle(event, data) {
      if (event === 'text') {
        let last = bot.segs[bot.segs.length - 1];
        if (last && last.kind === 'text') { last.text += data.t; } else { bot.segs.push({ kind: 'text', text: data.t }); }
      } else if (event === 'step') {
        if (data.status === 'start') {
          bot.segs.push({ kind: 'step', id: data.id, tool: data.tool, status: 'run', t0: Date.now() });
        } else {
          for (let i = 0; i < bot.segs.length; i++) {
            let s = bot.segs[i];
            if (s.kind === 'step' && s.id === data.id) {
              s.status = 'done'; s.ok = !!data.ok; s.ms = Date.now() - (s.t0 || Date.now()); delete s.t0;
              s.arg = data.paths ? data.paths.join(', ') : data.domain || '';
            }
          }
        }
      } else if (event === 'sources') {
        bot.sources = data.pages || [];
      } else if (event === 'action') {
        bot.action = { domain: data.domain };
      } else if (event === 'error') {
        throw new Error(data.code || 'upstream');
      }
      paint();
    }

    stream(handle).then(function () {
      let answer = bot.segs.filter(function (s) { return s.kind === 'text'; })
        .map(function (s) { return s.text.trim(); }).join('\n\n').trim();
      if (!answer) { throw new Error('upstream'); }
      bot.segs.forEach(function (s) { delete s.id; });
      state.items.push(bot);
      state.history.push({ role: 'assistant', content: answer });
      setDown(false);
      live.textContent = answer;
    }).catch(function (err) {
      let code = String(err && err.message || 'network');
      if (!t.err[code]) { code = 'network'; }
      state.history.pop();
      if (bot.segs.some(function (s) { return s.kind === 'text'; })) { state.items.push(bot); } else { node.remove(); }
      let errItem = { type: 'error', code: code };
      state.items.push(errItem);
      log.appendChild(renderItem(errItem));
      if (code === 'offline') { setDown(true); }
      if (!input.value) { input.value = q; onType(); }
      live.textContent = t.err[code];
    }).then(function () {
      setBusy(false);
      if (node.isConnected) { fillBot(node, bot, false); }
      save();
      scrollDown();
    });

    function stream(onEvent) {
      return fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: state.history, lang: LANG, page: location.pathname })
      }).then(function (res) {
        if (!res.ok) {
          return res.json().catch(function () { return {}; }).then(function (j) {
            let map = { offline: 'offline', rate: 'rate', input: 'input' };
            throw new Error(map[j.error] || (res.status === 429 ? 'rate' : 'upstream'));
          });
        }
        let reader = res.body.getReader();
        let decoder = new TextDecoder();
        let buffer = '';
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) { return; }
            buffer += decoder.decode(r.value, { stream: true });
            let cut;
            while ((cut = buffer.indexOf('\n\n')) !== -1) {
              let frame = buffer.slice(0, cut);
              buffer = buffer.slice(cut + 2);
              let ev = 'message', data = '';
              frame.split('\n').forEach(function (line) {
                if (line.indexOf('event:') === 0) { ev = line.slice(6).trim(); }
                else if (line.indexOf('data:') === 0) { data += line.slice(5).trim(); }
              });
              if (data) { onEvent(ev, JSON.parse(data)); }
            }
            return pump();
          });
        }
        return pump();
      }, function () {
        // The browser cannot tell a dead connection from a server that is not
        // answering (a missing route fails the same way). Only blame the
        // visitor's connection when the browser says it is actually offline.
        throw new Error(navigator.onLine === false ? 'network' : 'offline');
      });
    }
  }

  // --- start -----------------------------------------------------------------
  function start() {
    build();
    // Anything on a page marked data-fritz-ask opens Fritz and asks that
    // question: the project page uses it for its "try it" buttons.
    document.addEventListener('click', function (e) {
      const trigger = e.target.closest && e.target.closest('[data-fritz-ask]');
      if (!trigger) { return; }
      e.preventDefault();
      setOpen(true);
      ask(trigger.getAttribute('data-fritz-ask'));
    });
    // Page count for the boot line, from the same file Fritz answers from.
    fetch('/ask/knowledge.json').then(function (r) { return r.ok ? r.json() : null; })
      .then(function (k) { if (k && k.pages) { pagesCount = k.pages.length; } }).catch(function () {});
    if (state.open) { setOpen(true); }
    if (!state.tipped) {
      setTimeout(function () {
        if (state.open || state.tipped) { return; }
        tip.classList.add('is-shown');
        setTimeout(function () { tip.classList.remove('is-shown'); }, 7000);
        state.tipped = true; save();
      }, 5000);
    }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
