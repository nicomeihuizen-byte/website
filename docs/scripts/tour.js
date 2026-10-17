/*
 * tour.js: the live bits of tour.html.
 *
 * The dates are written in the HTML (crawlers and agents read them there);
 * this file only marks each leg as played, on the road now, next up or
 * announced, and words the "next stop" line from the same data. Every word
 * it writes comes from data-* attributes on the page, so translated copies
 * of the page need no change here. Dates are read as Kaunas calendar days.
 */
(function () {
  'use strict';
  var list = document.querySelector('[data-tour-legs]');
  if (!list) { return; }

  function today() {
    try {
      var p = {};
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Vilnius', year: 'numeric', month: '2-digit', day: '2-digit' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return p.year + '-' + p.month + '-' + p.day;
    } catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  function days(from, to) {
    return Math.round((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / 864e5);
  }
  function fill(t, v) { return t.replace(/\{(\w+)\}/g, function (m, k) { return k in v ? String(v[k]) : m; }); }

  var now = today();
  var legs = Array.prototype.filter.call(list.querySelectorAll('li[data-start]'), function () { return true; });
  var current = null, next = null;
  legs.forEach(function (li) {
    var s = li.getAttribute('data-start'), e = li.getAttribute('data-end'), state;
    if (now > e) { state = 'done'; }
    else if (now >= s) { state = 'now'; current = current || li; }
    else { state = 'later'; if (!next) { next = li; } }
    li.setAttribute('data-state', state);
  });
  if (next && !current) { next.setAttribute('data-state', 'next'); }
  legs.forEach(function (li) {
    var chip = li.querySelector('[data-leg-status]');
    var word = list.getAttribute('data-l-' + li.getAttribute('data-state'));
    if (chip && word) { chip.textContent = word; }
  });

  var line = document.querySelector('[data-tour-next]');
  if (line) {
    var cities = function (li) { var c = li.querySelector('.leg-cities'); return c ? c.textContent : ''; };
    if (current) { line.textContent = fill(line.getAttribute('data-tpl-now'), { cities: cities(current) }); }
    else if (next) { line.textContent = fill(line.getAttribute('data-tpl-next'), { cities: cities(next), days: days(now, next.getAttribute('data-start')) }); }
    else { line.textContent = line.getAttribute('data-tpl-done'); }
  }

  // SMIL animations ignore CSS, so honour reduced motion here.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('svg'), function (svg) {
      if (svg.pauseAnimations) { svg.pauseAnimations(); }
    });
  }
})();
