/* Social rail: builds the LinkedIn / GitHub tab on the right edge.
   Styles in styles/rail.css. Built here rather than in markup so one file
   feeds every page that loads it. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var LINKS = [
    {
      name: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/nico-meihuizen/',
      d: 'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z'
    },
    {
      name: 'github',
      label: 'GitHub',
      href: 'https://github.com/nicomeihuizen-byte',
      d: 'M12 0a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.86 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.62-2.66-.3-5.46-1.34-5.46-5.98 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16.77.85 1.24 1.93 1.24 3.25 0 4.65-2.8 5.68-5.47 5.98.43.36.82 1.1.82 2.22v3.29c0 .32.22.69.82.58A12 12 0 0 0 12 0z'
    }
  ];

  function build() {
    if (document.querySelector('.side-rail')) return;
    var nav = document.createElement('nav');
    nav.className = 'side-rail';
    nav.setAttribute('aria-label', 'Social profiles');
    LINKS.forEach(function (l) {
      var a = document.createElement('a');
      a.href = l.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer me';
      a.setAttribute('aria-label', l.label + ' (opens in a new tab)');
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', l.d);
      svg.appendChild(p);
      var lab = document.createElement('span');
      lab.className = 'rail-label';
      var pr = document.createElement('span');
      pr.className = 'rail-prompt';
      pr.textContent = '~/';
      lab.appendChild(pr);
      lab.appendChild(document.createTextNode(l.name));
      a.appendChild(svg);
      a.appendChild(lab);
      nav.appendChild(a);
    });
    document.body.appendChild(nav);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
