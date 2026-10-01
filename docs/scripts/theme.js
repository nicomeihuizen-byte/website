/*
 * The site keeps office hours, and so does its light.
 *
 * Open (Monday to Friday, 10:00 to 18:00 Kaunas time, not on a Lithuanian
 * public holiday): light. Closed: dark. There is no toggle; the theme says
 * whether Nico is at work, the way a shop window does.
 *
 * This tag sits in <head> without defer because it has to run before the
 * first paint: the CSS is light by default, and a closed office would
 * otherwise flash white first. It is small and same-origin, so the cost of
 * blocking is a cache hit. It checks again every 30 seconds, so a page left
 * open at 18:00 goes dark by itself.
 *
 * The calendar mirrors lib/fritz-time.js in the contact-form repo, and the
 * Kaunas clock in scripts/site.js reads it from here (window.mhOffice):
 * change the hours or holidays there and here, nowhere else.
 */
(function () {
  var root = document.documentElement;
  var TZ = 'Europe/Vilnius';
  var OPEN = 10 * 60;
  var CLOSE = 18 * 60;
  var FIXED = ['1-1', '2-16', '3-11', '5-1', '6-24', '7-6', '8-15', '11-1', '11-2', '12-24', '12-25', '12-26'];

  function easterMonday(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31);
    var day = ((h + l - 7 * m + 114) % 31) + 1;
    var monday = new Date(Date.UTC(y, month - 1, day + 1));
    return (monday.getUTCMonth() + 1) + '-' + monday.getUTCDate();
  }

  var fmt = null;
  try {
    fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: TZ, hourCycle: 'h23', weekday: 'short',
      year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch (e) { fmt = null; }

  // { time: "18:07", open: false } for this moment in Kaunas, or null when
  // the browser cannot tell (then the page stays light, its default).
  function now() {
    if (!fmt) { return null; }
    var p = {};
    fmt.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var md = Number(p.month) + '-' + Number(p.day);
    var holiday = FIXED.indexOf(md) !== -1 || md === easterMonday(Number(p.year));
    var weekend = p.weekday === 'Sat' || p.weekday === 'Sun';
    var minutes = Number(p.hour) * 60 + Number(p.minute);
    return { time: p.hour + ':' + p.minute, open: !holiday && !weekend && minutes >= OPEN && minutes < CLOSE };
  }
  window.mhOffice = { now: now };

  // The browser chrome around the page: the address bar on Android, the
  // status bar of an installed PWA. Left alone it keeps the colour of the
  // theme in the markup, which reads as the page ending early in a strip of
  // the wrong colour.
  function paintBrowserChrome() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { return; }
    var bg = getComputedStyle(root).getPropertyValue('--bg').trim();
    if (bg) { meta.setAttribute('content', bg); }
  }

  function apply() {
    var o = now();
    var next = o && !o.open ? 'dark' : 'light';
    if (root.getAttribute('data-theme') === next) { return; }
    root.setAttribute('data-theme', next);
    if (document.readyState !== 'loading') {
      paintBrowserChrome();
      // Anything that paints its own pixels rather than reading CSS (the
      // hero canvas) listens for this.
      document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    }
  }

  // The old toggle stored a choice; the office decides now.
  try { localStorage.removeItem('mh-theme'); } catch (e) {}

  apply();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paintBrowserChrome);
  } else {
    paintBrowserChrome();
  }
  setInterval(apply, 30000);
})();
