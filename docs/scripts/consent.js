/*
 * consent.js: Google Analytics, only after the visitor says yes.
 *
 * Replaces the inline Google tag that used to sit at the top of every page.
 * Nothing from Google loads, and no analytics cookie is set, until the
 * visitor clicks "Accept". Reject is exactly as easy. The choice is kept in
 * localStorage on this device only. Every footer gets a "Privacy" link, and the
 * "Cookie settings" button on the privacy page reopens the banner, so a yes
 * can become a no at any time.
 *
 * Loaded in <head> without defer, like theme.js: it is 'self', so the CSP
 * needs no hash for it. Its stylesheet sits next to it (consent.css) and is
 * found relative to this file, which keeps pages opened from disk working.
 */
(function () {
  var GA_ID = 'G-BNWQ23V8KC';
  var KEY = 'mz-consent';
  var PRIVACY_TRANSLATED = ['en'];
  var T = {
    en: ['We use Google Analytics to count visits, but only if you agree. Nothing loads until you choose.', 'Accept analytics', 'Reject', 'Privacy', 'Cookie settings', 'Cookie choice'],
    nl: ['We gebruiken Google Analytics om bezoeken te tellen, maar alleen als u akkoord gaat. Er laadt niets totdat u kiest.', 'Analytics accepteren', 'Weigeren', 'Privacy', 'Cookie-instellingen', 'Cookiekeuze'],
    de: ['Wir nutzen Google Analytics, um Besuche zu zählen, aber nur, wenn Sie zustimmen. Bis Sie wählen, wird nichts geladen.', 'Analytics akzeptieren', 'Ablehnen', 'Datenschutz', 'Cookie-Einstellungen', 'Cookie-Auswahl'],
    fr: ['Nous utilisons Google Analytics pour compter les visites, uniquement si vous l’acceptez. Rien ne se charge tant que vous n’avez pas choisi.', 'Accepter l’analyse', 'Refuser', 'Confidentialité', 'Paramètres des cookies', 'Choix des cookies'],
    es: ['Usamos Google Analytics para contar visitas, solo si usted lo acepta. No se carga nada hasta que elija.', 'Aceptar analítica', 'Rechazar', 'Privacidad', 'Configuración de cookies', 'Elección de cookies'],
    it: ['Usiamo Google Analytics per contare le visite, solo se siete d’accordo. Nulla viene caricato finché non scegliete.', 'Accetta analytics', 'Rifiuta', 'Privacy', 'Impostazioni cookie', 'Scelta dei cookie'],
    pt: ['Usamos o Google Analytics para contar visitas, apenas se concordar. Nada é carregado até escolher.', 'Aceitar análise', 'Recusar', 'Privacidade', 'Definições de cookies', 'Escolha de cookies'],
    lt: ['Naudojame Google Analytics lankytojams skaičiuoti, bet tik jei sutinkate. Kol nepasirinksite, niekas neįkeliama.', 'Leisti analitiką', 'Atsisakyti', 'Privatumas', 'Slapukų nustatymai', 'Slapukų pasirinkimas']
  };

  var lang = (document.documentElement.getAttribute('lang') || 'en').slice(0, 2).toLowerCase();
  if (!T[lang]) { lang = 'en'; }
  var t = T[lang];

  // Site root, worked out from where this script lives (…/scripts/consent.js).
  var me = document.currentScript && document.currentScript.src || '';
  var root = me.replace(/scripts\/consent\.js(\?.*)?$/, '');
  var privacyHref = root + (lang !== 'en' && PRIVACY_TRANSLATED.indexOf(lang) >= 0 ? lang + '/' : '') + 'privacy.html';

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

  var loaded = false;
  function loadAnalytics() {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    if (loaded) { return; }
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function dropCookies() {
    var host = location.hostname, parts = host.split('.');
    var domains = ['', host, '.' + host];
    if (parts.length > 2) { domains.push('.' + parts.slice(-2).join('.')); }
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^_ga(_|$)/.test(name)) { return; }
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  var bar = null;
  function hide() { if (bar) { bar.hidden = true; } }
  function choose(v) {
    write(v);
    if (v === 'granted') { loadAnalytics(); }
    else { gtag('consent', 'update', { analytics_storage: 'denied' }); dropCookies(); }
    hide();
  }

  function show() {
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'mz-consent';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', t[5]);
      var p = document.createElement('p');
      p.appendChild(document.createTextNode(t[0] + ' '));
      var a = document.createElement('a');
      a.href = privacyHref; a.textContent = t[3];
      p.appendChild(a);
      var row = document.createElement('div');
      row.className = 'mz-consent-actions';
      [['granted', t[1]], ['denied', t[2]]].forEach(function (b) {
        var btn = document.createElement('button');
        btn.type = 'button'; btn.textContent = b[1];
        btn.addEventListener('click', function () { choose(b[0]); });
        row.appendChild(btn);
      });
      bar.appendChild(p); bar.appendChild(row);
      document.body.appendChild(bar);
    }
    bar.hidden = false;
  }

  function settingsLink() {
    // No footer link: the privacy page is reached from the contact page and
    // from the cookie banner. The cookie choice is changed from the privacy
    // page ([data-consent-open]).
    Array.prototype.forEach.call(document.querySelectorAll('[data-consent-open]'), function (b) {
      b.addEventListener('click', show);
    });
  }


  var css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = root + 'scripts/consent.css';
  document.head.appendChild(css);

  var choice = read();
  if (choice === 'granted') { loadAnalytics(); }
  function ready() {
    settingsLink();
    if (choice !== 'granted' && choice !== 'denied') { show(); }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', ready); } else { ready(); }
})();
