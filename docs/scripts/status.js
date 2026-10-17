/*
 * status.js: fills status.html from our monitor (api/status on Vercel).
 * One call, refreshed every minute. The page's static vendor links stay
 * useful even when the monitor itself cannot be reached. The last good
 * answer is kept in this browser and painted first, so a returning visitor
 * sees the lights at once; its own "Checked" time says how old it is.
 */
(function () {
  var URL_ = 'https://website-contact-function-4efp.vercel.app/api/status';
  var KEY = 'st-last';
  // Words live on the page (data-w-*, data-n-* on the banner) so each language version carries its own.
  var B = document.querySelector('[data-status-banner]');
  function t(key, fallback) { var v = B && B.getAttribute('data-' + key); return v || fallback; }
  var WORD = { green: t('w-green', 'operational'), amber: t('w-amber', 'degraded'), red: t('w-red', 'down'), unknown: t('w-unknown', 'unknown') };
  var LANG = document.documentElement.lang || undefined;
  function name(n) {
    if (/website/i.test(n)) { return t('n-website', n); }
    if (/contact/i.test(n)) { return t('n-contact', n); }
    if (/scan/i.test(n)) { return t('n-scans', n); }
    return n;
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) { e.className = cls; } if (text != null) { e.textContent = text; } return e; }
  function when(iso) {
    if (!iso) { return ''; }
    var d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleString(LANG, { dateStyle: 'medium', timeStyle: 'short' });
  }
  function row(item, withSource) {
    var r = el('div', 'st-row');
    var k = el('div', 'st-k');
    k.appendChild(el('span', 'st-light st-' + item.light, ''));
    k.lastChild.setAttribute('aria-hidden', 'true');
    k.appendChild(el('span', 'st-name', name(item.name || '')));
    var v = el('div', 'st-v');
    v.appendChild(el('span', 'st-word st-' + item.light + '-text', WORD[item.light] || item.light));
    if (item.note) { v.appendChild(el('span', 'st-note', item.note)); }
    var meta = [];
    if (item.depends && item.depends.length) { meta.push(t('w-runs', 'runs on') + ' ' + item.depends.join(', ')); }
    if (item.updated) { meta.push(t('w-update', 'vendor update') + ' ' + when(item.updated)); }
    if (meta.length) { v.appendChild(el('span', 'st-meta', meta.join(' · '))); }
    if (withSource && item.source) {
      var a = el('a', 'st-src', t('w-source', 'source →')); a.href = item.source; a.rel = 'noopener'; v.appendChild(a);
    }
    r.appendChild(k); r.appendChild(v);
    return r;
  }
  function render(d) {
    var s = document.getElementById('st-services'), v = document.getElementById('st-vendors');
    s.textContent = ''; v.textContent = '';
    d.services.forEach(function (x) { s.appendChild(row(x, false)); });
    d.vendors.forEach(function (x) { v.appendChild(row(x, true)); });
    document.getElementById('st-checked').textContent = t('w-checked', 'Checked {when}. Refreshes every minute.').replace('{when}', when(d.checked));
    document.getElementById('st-down').hidden = true;
  }
  function load() {
    fetch(URL_)
      .then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); })
      .then(function (d) { render(d); try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} })
      .catch(function () {
        document.getElementById('st-down').hidden = false;
        document.getElementById('st-checked').textContent = t('w-attempt', 'Last attempt {when}.').replace('{when}', when(new Date().toISOString()));
      });
  }
  try { var last = JSON.parse(localStorage.getItem(KEY)); if (last) { render(last); } } catch (e) {}
  load();
  setInterval(load, 60000);
})();
