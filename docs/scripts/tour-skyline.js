/*
 * tour-skyline.js: the terminal skyline behind the van on tour.html.
 *
 * One landmark per tour city, drawn the way the home page skyline is drawn:
 * a grid of monospace glyphs, kept only where a cell falls inside the
 * landmark's outline. Each outline is a small function of (u, v): u runs
 * 0..1 across the landmark's box, v runs 0..1 from the ground up, and `a`
 * is the box's width/height ratio in pixels, for anything round.
 *
 * The strip is painted twice side by side and slid left forever by CSS
 * (see .tour-skyline in tour.html), so the van seems to drive past
 * Europe. Painted once; no per-frame work. Decorative: aria-hidden.
 */
(function () {
  'use strict';
  var canvas = document.querySelector('[data-tour-skyline]');
  if (!canvas || !canvas.getContext) { return; }

  var GLYPHS = '#$%&@MWB80QNHKRXZ{}[]=+*9mwq'.split('');   // dense glyphs, so outlines read solid
  var ROWS = 30;            // landmark height in glyph rows
  var GAP = 12;             // empty columns between landmarks

  function circle(u, v, a, cu, cv, r) { var x = (u - cu) * a, y = v - cv; return x * x + y * y < r * r; }
  function band(v, lo, hi) { return v >= lo && v < hi; }
  function spike(u, v, cu, base, top, half) { // a spire: triangle from (cu, base) up to (cu, top)
    if (v < base || v >= top) { return false; }
    return Math.abs(u - cu) < half * (1 - (v - base) / (top - base)) + 0.008;
  }

  // name shown under the landmark, columns wide, outline
  var LANDMARKS = [
    { label: 'duomo · milano', cols: 38, f: function (u, v) {
      if (v < 0.4 && u > 0.08 && u < 0.92) { return true; }
      var tops = [0.10, 0.18, 0.26, 0.34, 0.66, 0.74, 0.82, 0.90];
      for (var i = 0; i < tops.length; i++) { if (spike(u, v, tops[i], 0.38, 0.6, 0.025)) { return true; } }
      return spike(u, v, 0.5, 0.38, 0.9, 0.06);
    } },
    { label: 'colosseo · roma', cols: 45, f: function (u, v) {
      var h = 0.56 - Math.pow((u - 0.5) * 1.2, 2) * 0.2;
      if (u > 0.7) { h = Math.min(h, 0.56 - (u - 0.7) * 1.1); }      // the broken side
      if (v >= h || u < 0.03 || u > 0.97) { return false; }
      var bands = [[0.03, 0.14], [0.19, 0.3], [0.35, 0.45]];
      for (var b = 0; b < bands.length; b++) {
        if (!band(v, bands[b][0], bands[b][1])) { continue; }
        var k = (u * 8) % 1, top = bands[b][1] - 0.04 * (1 - Math.pow((k - 0.6) / 0.3, 2));
        if (k > 0.3 && k < 0.9 && v < top) { return false; }        // round-headed arches
      }
      return true;
    } },
    { label: 'sagrada família · barcelona', cols: 38, f: function (u, v) {
      if (v < 0.34 && u > 0.1 && u < 0.9) { return true; }
      var s = [[0.16, 0.78], [0.27, 0.86], [0.73, 0.86], [0.84, 0.78], [0.4, 0.7], [0.6, 0.7]];
      for (var i = 0; i < s.length; i++) { if (spike(u, v, s[i][0], 0.3, s[i][1], 0.045)) { return true; } }
      return spike(u, v, 0.5, 0.3, 1.0, 0.06);
    } },
    { label: 'metrópolis · madrid', cols: 28, f: function (u, v, a) {
      if (v < 0.42 && u > 0.18 && u < 0.82) { return true; }
      if (v < 0.48 && u > 0.3 && u < 0.7) { return true; }
      if (v >= 0.48 && circle(u, v, a, 0.5, 0.48, 0.13)) { return true; }
      return Math.abs(u - 0.5) < 0.03 && v < 0.72;
    } },
    { label: 'fourvière · lyon', cols: 35, f: function (u, v) {
      if (v < 0.16 * (1 - Math.pow((u - 0.5) * 2, 2))) { return true; }            // the hill
      if (v < 0.44 && u > 0.26 && u < 0.74) { return true; }
      if (v < 0.58 && ((u > 0.24 && u < 0.33) || (u > 0.67 && u < 0.76))) { return true; } // towers
      return Math.abs(u - 0.5) < 0.025 && v < 0.62;
    } },
    { label: 'tour eiffel · paris', cols: 30, f: function (u, v) {
      if (v > 0.98) { return false; }
      var half = 0.42 * Math.pow(1 - v, 2.4) + 0.018;
      if (Math.abs(u - 0.5) > half) { return false; }
      if (v < 0.16 && Math.abs(u - 0.5) < 0.24 * Math.sqrt(1 - v / 0.16)) { return false; } // the arch
      return true;
    } },
    { label: 'ponte luís i · porto', cols: 48, f: function (u, v) {
      if (band(v, 0.4, 0.46)) { return true; }                                   // upper deck
      if ((u < 0.06 || u > 0.94) && v < 0.46) { return true; }                    // abutments
      var x = (u - 0.5) / 0.44, arch = 0.4 * (1 - x * x);
      if (Math.abs(x) < 1 && v > arch - 0.08 && v < arch + 0.02) { return true; } // the arch
      return Math.abs(x) < 1 && v > arch && v < 0.4 && ((u * 10) % 1) < 0.12;     // hangers
    } },
    { label: 'torre de belém · lisboa', cols: 25, f: function (u, v) {
      if (v < 0.28 && u > 0.04 && u < 0.96) { return v < 0.25 || ((u * 12) % 1) < 0.5; } // bastion, crenels
      if (v < 0.68 && u > 0.3 && u < 0.7) { return v < 0.64 || ((u * 12) % 1) < 0.5; }   // tower
      return (circle(u, v, 1.6, 0.3, 0.7, 0.045) || circle(u, v, 1.6, 0.7, 0.7, 0.045)); // turrets
    } },
    { label: 'reichstag · berlin', cols: 40, f: function (u, v, a) {
      if (v < 0.3 && u > 0.04 && u < 0.96) { return true; }
      if (v < 0.36 && (u < 0.16 || u > 0.84) && u > 0.04 && u < 0.96) { return true; }
      return v >= 0.3 && circle(u, v, a, 0.5, 0.3, 0.16);                    // the glass dome
    } },
    { label: 'fernsehturm · berlin', cols: 20, f: function (u, v, a) {
      if (circle(u, v, a, 0.5, 0.68, 0.085)) { return true; }
      if (v < 0.62 && Math.abs(u - 0.5) < 0.09 * (1 - v * 0.6)) { return true; }
      return Math.abs(u - 0.5) < 0.05 && v < 0.98;
    } },
    { label: 'gedimino pilis · vilnius', cols: 30, f: function (u, v) {
      if (v < 0.22 * Math.sqrt(Math.max(0, 1 - Math.pow((u - 0.5) * 2, 2)))) { return true; } // castle hill
      if (v < 0.5 && u > 0.38 && u < 0.62) { return v < 0.46 || ((u * 16) % 1) < 0.5; }       // tower
      if (Math.abs(u - 0.5) < 0.015 && v < 0.66) { return true; }                               // flagpole
      return v > 0.58 && v < 0.65 && u > 0.5 && u < 0.62;                                       // flag
    } },
    { label: 'prisikėlimo bažnyčia · kaunas', cols: 28, f: function (u, v) {
      if (v < 0.38 && u > 0.08 && u < 0.92) { return true; }
      if (v < 0.82 && u > 0.38 && u < 0.62) { return true; }
      if (Math.abs(u - 0.5) < 0.02 && v < 0.96) { return true; }                // cross, upright
      return Math.abs(v - 0.9) < 0.015 && Math.abs(u - 0.5) < 0.07;             // cross, arm
    } }
  ];

  function css(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function paint() {
    var cssH = canvas.clientHeight || 230;
    var fontSize = Math.max(6, Math.floor(cssH / (ROWS + 5)));   // 5 rows for the two label lines
    var colW = Math.round(fontSize * 0.62 * 10) / 10;
    var totalCols = 0;
    LANDMARKS.forEach(function (l) { totalCols += l.cols + GAP; });
    var stripW = Math.ceil(totalCols * colW);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = (stripW * 2) + 'px';
    canvas.width = Math.round(stripW * 2 * dpr);
    canvas.height = Math.round(cssH * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textBaseline = 'top';
    var green = css('--t-green', '#5FBF8E'), muted = css('--t-muted', '#8B90A3');
    var groundY = ROWS * fontSize;

    for (var copy = 0; copy < 2; copy++) {
      var col = copy * totalCols + Math.floor(GAP / 2);
      LANDMARKS.forEach(function (l) {
        var a = (l.cols * colW) / (ROWS * fontSize);
        ctx.font = fontSize + 'px "JetBrains Mono", monospace';
        for (var c = 0; c < l.cols; c++) {
          for (var r = 0; r < ROWS; r++) {
            var u = (c + 0.5) / l.cols, v = 1 - (r + 0.5) / ROWS;
            if (!l.f(u, v, a)) { continue; }
            ctx.globalAlpha = 0.55 + 0.45 * v;          // brighter toward the top, like the home skyline
            ctx.fillStyle = green;
            ctx.fillText(GLYPHS[((((c + col) * 73856093) ^ (r * 19349663)) >>> 0) % GLYPHS.length], (col + c) * colW, r * fontSize);
          }
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = muted;
        ctx.font = Math.max(9, fontSize + 1) + 'px "JetBrains Mono", monospace';
        var parts = l.label.split(' · '), cx = (col + l.cols / 2) * colW;
        ctx.fillText(parts[0], cx - ctx.measureText(parts[0]).width / 2, groundY + fontSize * 0.7);
        ctx.globalAlpha = 0.6;
        ctx.fillText(parts[1], cx - ctx.measureText(parts[1]).width / 2, groundY + fontSize * 2.3);
        ctx.globalAlpha = 1;
        col += l.cols + GAP;
      });
    }
    canvas.style.setProperty('--sky-shift', (-stripW) + 'px');
  }

  var last = 0;
  function onResize() {
    var h = canvas.clientHeight;
    if (h && h !== last) { last = h; paint(); }
  }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(onResize); } else { onResize(); }
  window.addEventListener('resize', onResize);
})();
