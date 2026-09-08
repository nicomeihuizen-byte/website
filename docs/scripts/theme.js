/*
 * Light and dark for a site with no server.
 *
 * Five decides the theme on the server and writes it into the HTML before
 * anything paints. GitHub Pages has no server to ask, so the next best
 * thing is this: light is the default in the CSS itself, and the only job
 * here is to stamp data-theme="dark" on <html> for a visitor who has
 * already chosen dark. That is why the tag is in <head> without defer -
 * it has to run before the first paint, or the returning dark visitor
 * sees a white flash. It is small and same-origin, so the cost of
 * blocking is a cache hit.
 *
 * The stored value is checked against the two known words rather than
 * trusted: it goes straight into an attribute, and localStorage is
 * writable by anything else that runs on this origin.
 */
(function () {
  var KEY = 'mh-theme';
  var root = document.documentElement;

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch (e) {
      // Private mode, or storage blocked. The default theme still works.
      return null;
    }
  }

  var initial = stored();
  if (initial) { root.setAttribute('data-theme', initial); }

  // The browser chrome around the page: the address bar on Android, the
  // status bar of an installed PWA. Left alone it keeps the colour of
  // whichever theme was in the markup, which reads as the page ending
  // early in a strip of the wrong colour.
  function paintBrowserChrome() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { return; }
    var bg = getComputedStyle(root).getPropertyValue('--bg').trim();
    if (bg) { meta.setAttribute('content', bg); }
  }

  function wire() {
    paintBrowserChrome();

    // The buttons are in the markup already, visible, hidden by a
    // <noscript> rule when there is nothing here to drive them. This used
    // to reveal them instead, which meant a script that did not run left a
    // nav separator with nothing after it and no clue why.
    var buttons = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
        paintBrowserChrome();
        // Anything that paints its own pixels rather than reading CSS -
        // the hero canvas - listens for this.
        document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
