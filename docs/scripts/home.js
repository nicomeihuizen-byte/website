/*
 * home.js: the moving parts of the redesigned pages (2026-10-02).
 *
 *  1. Office hours, everywhere a [data-office-*] element sits: the status
 *     strip and the CTA band. Open or closed comes from window.mhOffice in
 *     scripts/theme.js, so holidays and hours live in one place only. This
 *     file only adds the wording for when a reply can be expected.
 *  2. The live status bits in the strip, read from the same monitor that
 *     fills status.html. If the monitor cannot be reached the strip keeps
 *     its neutral text: it never claims green it did not see.
 *  3. The hero chat: a replay of a real Fritz exchange, typed out line by
 *     line. The first exchange is in the HTML, so without JavaScript (or with
 *     reduced motion) the window still shows a real answer.
 *  4. Typing in the hero box hands the question to the real Fritz, through
 *     the data-fritz-ask hook that ask/ask.js listens for.
 */
(function () {
  'use strict';

  // ---- 0. language ----------------------------------------------------------
  // Lithuanian pages set <html lang="lt">. Every sentence this file writes
  // comes from W, so one script serves both languages. English is the default.
  var LT = (document.documentElement.getAttribute('lang') || 'en').slice(0, 2).toLowerCase() === 'lt';
  var W = LT ? {
    today: 'atsakome šiandien', next: 'atsakysime kitą darbo dieną', from10: 'atsakysime nuo 10:00',
    tomorrow: 'atsakysime rytoj nuo 10:00', monday: 'atsakysime pirmadienį nuo 10:00',
    open: 'dirbame', closed: 'nedirbame',
    online: 'veikia', slow: 'lėtai', down: 'neveikia',
    lights: { green: 'veikia', amber: 'sutrikimai', red: 'neveikia', unknown: 'būsena' },
    here: 'prisijungęs', away: 'neprisijungęs',
    green: 'viskas veikia →', degraded: function (n) { return 'sutrikimų: ' + n + ' →'; },
    nicoFrom: 'nico · iš telefono', source: 'šaltinis: ', where: 'kur tai parašyta?', reading: 'fritz skaito',
    ask: 'Labas, Fritz, kuo gali man padėti?',
    running: function (a, b) { return 'vykdoma ' + a + ' iš ' + b; }
  } : {
    today: 'we reply today', next: 'reply next working day', from10: 'reply from 10:00',
    tomorrow: 'reply tomorrow from 10:00', monday: 'reply Monday from 10:00',
    open: 'open', closed: 'closed',
    online: 'online', slow: 'slow', down: 'down',
    lights: { green: 'online', amber: 'degraded', red: 'down', unknown: 'status' },
    here: 'online', away: 'offline',
    green: 'all systems green →', degraded: function (n) { return n + ' service' + (n > 1 ? 's' : '') + ' degraded →'; },
    nicoFrom: 'nico · from his phone', source: 'source: ', where: 'where does it say so?', reading: 'fritz is reading',
    ask: 'Hi Fritz, what can you do for me?',
    running: function (a, b) { return 'running ' + a + ' of ' + b; }
  };

  // ---- 1. office hours ------------------------------------------------------
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var fmt = null;
  try {
    fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Vilnius', hourCycle: 'h23', weekday: 'short', hour: '2-digit' });
  } catch (e) { fmt = null; }

  function replyText(open) {
    if (open) { return W.today; }
    if (!fmt) { return W.next; }
    var p = {};
    fmt.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var day = DAYS.indexOf(p.weekday), hour = Number(p.hour);
    if (day >= 0 && day <= 4 && hour < 10) { return W.from10; }
    if (day >= 0 && day <= 3 && hour >= 18) { return W.tomorrow; }
    if (day >= 4) { return W.monday; }
    return W.next;
  }

  function setAll(sel, text) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (n) { n.textContent = text; });
  }

  function tick() {
    if (!window.mhOffice) { return; }
    var o = window.mhOffice.now();
    if (!o) { return; }
    document.documentElement.setAttribute('data-office', o.open ? 'open' : 'closed');
    setAll('[data-office-time]', o.time);
    setAll('[data-office-state]', o.open ? W.open : W.closed);
    setAll('[data-office-reply]', replyText(o.open));
    // Nico's presence light (about page): online only inside Kaunas office hours.
    Array.prototype.forEach.call(document.querySelectorAll('[data-office-light]'), function (n) {
      n.setAttribute('data-office-light', o.open ? 'open' : 'closed');
      var w = n.querySelector('span'); if (w) { w.textContent = o.open ? W.here : W.away; }
    });
    return o;
  }
  tick();
  setInterval(tick, 30000);

  // ---- 2. live status -------------------------------------------------------
  var STATUS_URL = 'https://website-contact-function-4efp.vercel.app/api/status';
  var fritzEl = document.querySelector('[data-status-fritz]');
  var allEl = document.querySelector('[data-status-all]');
  var banner = document.querySelector('[data-status-banner]');
  function setBanner(state, title, sub) {
    if (!banner) { return; }
    banner.setAttribute('data-state', state);
    var light = banner.querySelector('.st-light');
    if (light) { light.className = 'st-light st-' + state + (state === 'green' ? ' pulse' : ''); }
    var t = banner.querySelector('[data-status-title]'), s = banner.querySelector('[data-status-sub]');
    if (t) { t.textContent = title; }
    if (s) { s.textContent = sub; }
  }
  // The hero window's light: same four states as status.html.
  var liveEls = document.querySelectorAll('[data-status-light]');
  function setLive(light) {
    if (!W.lights[light]) { light = 'unknown'; }
    Array.prototype.forEach.call(liveEls, function (n) {
      n.setAttribute('data-status-light', light);
      var w = n.querySelector('span'); if (w) { w.textContent = W.lights[light]; }
    });
  }
  if (fritzEl || allEl || banner || liveEls.length) {
    // Shared with ask/ask.js, so the page asks the monitor once.
    window.mhStatus = fetch(STATUS_URL).then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); });
    window.mhStatus
      .then(function (d) {
        var services = (d && d.services) || [];
        var fritz = services.filter(function (s) { return /fritz/i.test(s.name || ''); })[0];
        setLive(fritz ? fritz.light : 'unknown');
        if (fritzEl && fritz) {
          var word = { green: W.online, amber: W.slow, red: W.down }[fritz.light];
          if (word) { fritzEl.textContent = word; fritzEl.classList.toggle('ok', fritz.light === 'green'); }
        }
        if (allEl && services.length) {
          var bad = services.filter(function (s) { return s.light !== 'green'; }).length;
          allEl.textContent = bad ? W.degraded(bad) : W.green;
          allEl.classList.toggle('ok', !bad);
          allEl.classList.toggle('warn', !!bad);
        }
        if (services.length) {
          var down = services.filter(function (s) { return s.light === 'red'; }).length;
          var slow = services.filter(function (s) { return s.light !== 'green' && s.light !== 'red'; }).length;
          if (!down && !slow) { setBanner('green', 'All services operational', 'Every service green. Details per service and vendor below.'); }
          else { setBanner(down ? 'red' : 'amber', (down + slow) + ' of ' + services.length + ' services affected', 'See which one below, and whether the vendor it runs on reports a problem.'); }
        }
      }).catch(function () {
        setLive('unknown');
        setBanner('unknown', 'Our monitor cannot be reached', 'The vendor pages below still work.');
      });
  }

  // ---- 3. hero chat replay --------------------------------------------------
  var chat = document.querySelector('[data-chat]');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (chat && !reduced) {
    // The script is rebuilt at the start of every replay, because the last
    // scene depends on the clock: Fritz only brings Nico into the chat when
    // the office is open. Outside hours he does what he really does then.
    var base = LT ? [
      { k: 'user', t: 'Ar tai tikra įmonė?' },
      { k: 'tool', t: '↳ read_page  credentials.html' },
      { k: 'fritz', t: 'Taip. MB Meihuizen AI, įmonės kodas 308157412, Lietuvos juridinis asmuo. Galite patys patikrinti Registrų centre.', src: 'credentials.html' },
      { k: 'user', t: 'Kiek kainuotų Fritz mūsų svetainei?' },
      { k: 'tool', t: '↳ read_page  projects/agent-fritz.html' },
      { k: 'fritz', price: true, src: 'agent-fritz.html' },
      { k: 'user', t: 'Ar galiu pakalbėti tiesiogiai su Nico?' }
    ] : [
      { k: 'user', t: 'Is this a real company?' },
      { k: 'tool', t: '↳ read_page  credentials.html' },
      { k: 'fritz', t: 'Yes. MB Meihuizen AI, company code 308157412, a Lithuanian legal entity. You can check it yourself at Registrų centras.', src: 'credentials.html' },
      { k: 'user', t: 'What would Fritz cost for our site?' },
      { k: 'tool', t: '↳ read_page  projects/agent-fritz.html' },
      { k: 'fritz', price: true, src: 'agent-fritz.html' },
      { k: 'user', t: 'Can I talk to Nico directly?' }
    ];
    var live = LT ? [
      { k: 'fritz', t: 'Jis darbe. Pakviesti jį į šį pokalbį?' },
      { k: 'user', t: 'taip, prašau' },
      { k: 'ok', t: '✓ Nico telefonas skamba' },
      { k: 'nico', t: 'Labas, čia Nico. Mielai aptarsiu kainas. @Fritz, pasidalink Fritz produkto aprašu.' },
      { k: 'tool', t: '↳ share_document  agent-fritz-product-sheet.pdf' },
      { k: 'ok', t: '✓ produkto aprašas pasidalintas · žodis vėl Nico' }
    ] : [
      { k: 'fritz', t: 'He is in. Want me to bring him into this chat?' },
      { k: 'user', t: 'yes please' },
      { k: 'ok', t: '✓ Nico’s phone is ringing' },
      { k: 'nico', t: 'Hi, Nico here. Happy to talk numbers. @Fritz share the Fritz product sheet.' },
      { k: 'tool', t: '↳ share_document  agent-fritz-product-sheet.pdf' },
      { k: 'ok', t: '✓ product sheet shared · floor back to Nico' }
    ];
    var later = LT ? [
      { k: 'fritz', closed: true },
      { k: 'ok', t: '✓ užklausa kartu su šiuo pokalbiu išsiųsta į Nico telefoną' }
    ] : [
      { k: 'fritz', closed: true },
      { k: 'ok', t: '✓ request sent to Nico’s phone, with this chat' }
    ];
    var steps = base;
    function script() {
      var o = window.mhOffice && window.mhOffice.now();
      steps = base.concat(o && !o.open ? later : live);
    }
    function closedLine() {
      var o = window.mhOffice && window.mhOffice.now();
      if (LT) { return 'Kaune dabar ' + (o ? o.time : 'ne darbo laikas') + ', Nico nedirba. Jūsų klausimą ir šį pokalbį siunčiu į jo telefoną; ' + replyText(false) + '.'; }
      return 'It is ' + (o ? o.time : 'after hours') + ' in Kaunas, so Nico is off. I am sending your question and this chat to his phone now; you get a ' + replyText(false) + '.';
    }
    function priceLine() {
      var o = window.mhOffice && window.mhOffice.now();
      if (LT) {
        var b = 'Kaina nustatoma kiekvienam atvejui: Fritz kuriamas pagal užsakymą, tai ne apvalkalas. ';
        if (!o) { return b + 'Perduoti tai Nico, kad jis jums paskambintų?'; }
        return o.open
          ? b + 'Kaune dabar ' + o.time + ' ir Nico darbe. Perduoti tai jam, kad jis jums paskambintų?'
          : b + 'Kaune dabar ' + o.time + ', Nico nedirba. Galiu perduoti dabar; ' + replyText(false) + '.';
      }
      var base = 'Priced per case: Fritz is a custom build, not a wrapper. ';
      if (!o) { return base + 'Shall I pass this on to Nico so he can call you back?'; }
      return o.open
        ? base + 'It is ' + o.time + ' in Kaunas and Nico is in. Shall I pass this on so he can call you back?'
        : base + 'It is ' + o.time + ' in Kaunas, so Nico is off. I can pass this on now, and you get a ' + replyText(false) + '.';
    }
    function node(s) {
      var d = document.createElement('div');
      d.className = 'msg msg-' + s.k;
      if (s.k === 'nico') {
        var who = document.createElement('small');
        who.textContent = W.nicoFrom;
        d.appendChild(who);
        d.appendChild(document.createTextNode(s.t));
      } else {
        d.textContent = s.price ? priceLine() : (s.closed ? closedLine() : s.t);
      }
      if (s.src) {
        var src = document.createElement('div');
        src.className = 'msg-src';
        var a = document.createElement('span'); a.textContent = W.source + s.src;
        var b = document.createElement('span'); b.textContent = W.where;
        src.appendChild(a); src.appendChild(b); d.appendChild(src);
      }
      return d;
    }
    var typing = document.createElement('div');
    typing.className = 'typing';
    typing.appendChild(document.createTextNode(W.reading));
    var cur = document.createElement('span'); cur.className = 'blink'; cur.textContent = '_';
    typing.appendChild(cur);

    var i = 0;
    function next() {
      if (typing.parentNode) { typing.parentNode.removeChild(typing); }
      if (i >= steps.length) {
        setTimeout(function () { chat.textContent = ''; i = 0; script(); next(); }, 7000);
        return;
      }
      chat.appendChild(node(steps[i]));
      i += 1;
      if (i < steps.length && (steps[i].k === 'fritz' || steps[i].k === 'tool')) { chat.appendChild(typing); }
      setTimeout(next, steps[i - 1].k === 'fritz' ? 3200 : 1500);
    }
    // Let the static first exchange be read before the replay starts over.
    setTimeout(function () { chat.textContent = ''; script(); next(); }, 5000);
  }

  // ---- 4. hero box hands over to the real Fritz -----------------------------
  var heroForm = document.querySelector('[data-hero-ask]');
  if (heroForm) {
    heroForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = heroForm.querySelector('input');
      var q = (input.value || '').trim() || W.ask;
      // A throwaway type="button": clicking the form's own submit button
      // from inside its submit handler would submit again, forever, if
      // ask.js ever failed to load and preventDefault never came.
      var hand = document.createElement('button');
      hand.type = 'button';
      hand.hidden = true;
      hand.setAttribute('data-fritz-ask', q);
      heroForm.appendChild(hand);
      hand.click();
      heroForm.removeChild(hand);
      input.value = '';
    });
  }
  // ---- 5. the "how we ship" pipeline -----------------------------------------
  // The HTML shows every stage green, which is also the reduced-motion view.
  // With motion allowed, a run walks through the stages and lands green again.
  var pipe = document.querySelector('[data-pipe]');
  if (pipe && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var stages = pipe.querySelectorAll('li');
    var label = document.querySelector('[data-pipe-label]');
    var done = label ? label.textContent : '';
    var at = -2;
    setInterval(function () {
      at = at >= stages.length + 2 ? 0 : at + 1;
      Array.prototype.forEach.call(stages, function (li, i) {
        li.classList.toggle('done', at < 0 || i < at || at >= stages.length);
        li.classList.toggle('run', i === at);
      });
      if (label) {
        label.textContent = (at >= 0 && at < stages.length) ? W.running(at + 1, stages.length) : done;
      }
    }, 1100);
  }
  // ---- 6. demo tabs (product pages) ------------------------------------------
  // [data-tabs] holds role="tab" buttons and role="tabpanel" panels. Classes
  // and the hidden attribute only: project pages allow no inline styles.
  Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) { p.hidden = !on; }
      });
    }
    tabs.forEach(function (t, i) {
      t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!n) { return; }
        e.preventDefault();
        var next = tabs[(i + n + tabs.length) % tabs.length];
        select(next); next.focus();
      });
    });
  });
})();
