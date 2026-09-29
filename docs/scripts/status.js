/*
 * status.js: fills status.html from our monitor (api/status on Vercel).
 * One call, refreshed every minute. The page's static vendor links stay
 * useful even when the monitor itself cannot be reached.
 */
(function () {
  var URL_ = 'https://website-contact-function-4efp.vercel.app/api/status';
  var WORD = { green: 'operational', amber: 'degraded', red: 'down', unknown: 'unknown' };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) { e.className = cls; } if (text != null) { e.textContent = text; } return e; }
  function when(iso) {
    if (!iso) { return ''; }
    var d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }
  function row(item, withSource) {
    var r = el('div', 'st-row');
    var k = el('div', 'st-k');
    k.appendChild(el('span', 'st-light st-' + item.light, ''));
    k.lastChild.setAttribute('aria-hidden', 'true');
    k.appendChild(el('span', 'st-name', item.name));
    var v = el('div', 'st-v');
    v.appendChild(el('span', 'st-word st-' + item.light + '-text', WORD[item.light] || item.light));
    if (item.note) { v.appendChild(el('span', 'st-note', item.note)); }
    var meta = [];
    if (item.depends && item.depends.length) { meta.push('runs on ' + item.depends.join(', ')); }
    if (item.updated) { meta.push('vendor update ' + when(item.updated)); }
    if (meta.length) { v.appendChild(el('span', 'st-meta', meta.join(' · '))); }
    if (withSource && item.source) {
      var a = el('a', 'st-src', 'source →'); a.href = item.source; a.rel = 'noopener'; v.appendChild(a);
    }
    r.appendChild(k); r.appendChild(v);
    return r;
  }
  function render(d) {
    var s = document.getElementById('st-services'), v = document.getElementById('st-vendors');
    s.textContent = ''; v.textContent = '';
    d.services.forEach(function (x) { s.appendChild(row(x, false)); });
    d.vendors.forEach(function (x) { v.appendChild(row(x, true)); });
    document.getElementById('st-checked').textContent = 'Checked ' + when(d.checked) + '. Refreshes every minute.';
    document.getElementById('st-down').hidden = true;
  }
  function load() {
    fetch(URL_, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); })
      .then(render)
      .catch(function () {
        document.getElementById('st-down').hidden = false;
        document.getElementById('st-checked').textContent = 'Last attempt ' + when(new Date().toISOString()) + '.';
      });
  }
  load();
  setInterval(load, 60000);
})();
