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
  // Every sentence this file writes comes from I18N, keyed by <html lang>, so
  // one script serves all eight languages. English is the fallback. The table
  // is generated from tools/i18n/home_<lang>.json by tools/build_home_i18n.py:
  // edit the JSON files and rerun it, do not edit the table by hand.
  var I18N = /*I18N-START*/{
 "en": {
  "W": {
   "today": "we reply today",
   "next": "reply next working day",
   "from10": "reply from 10:00",
   "tomorrow": "reply tomorrow from 10:00",
   "monday": "reply Monday from 10:00",
   "open": "open",
   "closed": "closed",
   "online": "online",
   "slow": "slow",
   "down": "down",
   "lights": {
    "green": "online",
    "amber": "degraded",
    "red": "down",
    "unknown": "status"
   },
   "here": "online",
   "away": "offline",
   "green": "all systems green →",
   "degraded_one": "1 service degraded →",
   "degraded_many": "{n} services degraded →",
   "nicoFrom": "nico · from his phone",
   "source": "source: ",
   "where": "where does it say so?",
   "reading": "fritz is reading",
   "ask": "Hi Fritz, what can you do for me?",
   "running": "running {a} of {b}"
  },
  "chat": {
   "q1": "Is this a real company?",
   "a1": "Yes. MB Meihuizen AI, company code 308157412, a Lithuanian legal entity. You can check it yourself at Registrų centras.",
   "q2": "What would Fritz cost for our site?",
   "q3": "Can I talk to Nico directly?",
   "live1": "He is in. Want me to bring him into this chat?",
   "live2": "yes please",
   "live3": "✓ Nico’s phone is ringing",
   "live4": "Hi, Nico here. Happy to talk numbers. @Fritz share the Fritz product sheet.",
   "live5": "✓ product sheet shared · floor back to Nico",
   "later1": "✓ request sent to Nico’s phone, with this chat"
  },
  "closed": "It is {time} in Kaunas, so Nico is off. I am sending your question and this chat to his phone now; you get a {reply}.",
  "afterHours": "after hours",
  "price": {
   "base": "Priced per case: Fritz is a custom build, not a wrapper. ",
   "none": "Shall I pass this on to Nico so he can call you back?",
   "open": "It is {time} in Kaunas and Nico is in. Shall I pass this on so he can call you back?",
   "closed": "It is {time} in Kaunas, so Nico is off. I can pass this on now, and you get a {reply}."
  }
 },
 "nl": {
  "W": {
   "today": "antwoord vandaag",
   "next": "antwoord op de volgende werkdag",
   "from10": "antwoord vanaf 10:00",
   "tomorrow": "antwoord morgen vanaf 10:00",
   "monday": "antwoord maandag vanaf 10:00",
   "open": "open",
   "closed": "gesloten",
   "online": "online",
   "slow": "traag",
   "down": "storing",
   "lights": {
    "green": "online",
    "amber": "verstoord",
    "red": "storing",
    "unknown": "status"
   },
   "here": "online",
   "away": "offline",
   "green": "alle systemen groen →",
   "degraded_one": "1 dienst verstoord →",
   "degraded_many": "{n} diensten verstoord →",
   "nicoFrom": "nico · vanaf zijn telefoon",
   "source": "bron: ",
   "where": "waar staat dat?",
   "reading": "fritz leest",
   "ask": "Hallo Fritz, wat kun je voor me doen?",
   "running": "bezig met {a} van {b}"
  },
  "chat": {
   "q1": "Is dit een echt bedrijf?",
   "a1": "Ja. MB Meihuizen AI, registratienummer 308157412, een Litouwse rechtspersoon. U kunt het zelf controleren bij Registrų centras.",
   "q2": "Wat zou Fritz kosten voor onze site?",
   "q3": "Kan ik Nico rechtstreeks spreken?",
   "live1": "Hij is er. Zal ik hem bij dit gesprek halen?",
   "live2": "graag",
   "live3": "✓ Nico’s telefoon gaat over",
   "live4": "Hallo, met Nico. Over de prijs praat ik graag. @Fritz deel de productsheet van Fritz.",
   "live5": "✓ productsheet gedeeld · het woord is weer aan Nico",
   "later1": "✓ verzoek met dit gesprek naar Nico’s telefoon gestuurd"
  },
  "closed": "Het is {time} in Kaunas, dus Nico is er niet. Ik stuur uw vraag en dit gesprek nu naar zijn telefoon; u krijgt {reply}.",
  "afterHours": "buiten kantooruren",
  "price": {
   "base": "Prijs per opdracht: Fritz is maatwerk, geen wrapper. ",
   "none": "Zal ik dit aan Nico doorgeven, zodat hij u terugbelt?",
   "open": "Het is {time} in Kaunas en Nico is er. Zal ik dit doorgeven, zodat hij u terugbelt?",
   "closed": "Het is {time} in Kaunas, dus Nico is er niet. Ik kan dit nu doorgeven; u krijgt dan {reply}."
  }
 },
 "de": {
  "W": {
   "today": "Antwort heute",
   "next": "Antwort am nächsten Werktag",
   "from10": "Antwort ab 10:00 Uhr",
   "tomorrow": "Antwort morgen ab 10:00 Uhr",
   "monday": "Antwort am Montag ab 10:00 Uhr",
   "open": "geöffnet",
   "closed": "geschlossen",
   "online": "online",
   "slow": "langsam",
   "down": "ausgefallen",
   "lights": {
    "green": "online",
    "amber": "eingeschränkt",
    "red": "ausgefallen",
    "unknown": "status"
   },
   "here": "online",
   "away": "offline",
   "green": "alle Systeme grün →",
   "degraded_one": "1 Dienst eingeschränkt →",
   "degraded_many": "{n} Dienste eingeschränkt →",
   "nicoFrom": "nico · von seinem Handy",
   "source": "Quelle: ",
   "where": "wo steht das?",
   "reading": "fritz liest",
   "ask": "Hallo Fritz, was können Sie für mich tun?",
   "running": "Schritt {a} von {b}"
  },
  "chat": {
   "q1": "Ist das ein echtes Unternehmen?",
   "a1": "Ja. MB Meihuizen AI, Unternehmenscode 308157412, eine juristische Person nach litauischem Recht. Sie können das selbst beim Registrų centras prüfen.",
   "q2": "Was würde Fritz für unsere Website kosten?",
   "q3": "Kann ich direkt mit Nico sprechen?",
   "live1": "Er ist da. Soll ich ihn in diesen Chat holen?",
   "live2": "ja, bitte",
   "live3": "✓ Nicos Handy klingelt",
   "live4": "Hallo, hier ist Nico. Über Zahlen rede ich gern. @Fritz teile das Produktblatt zu Fritz.",
   "live5": "✓ Produktblatt geteilt · Nico hat wieder das Wort",
   "later1": "✓ Anfrage an Nicos Handy geschickt, mit diesem Chat"
  },
  "closed": "Es ist {time} in Kaunas, Nico hat also Feierabend. Ich schicke Ihre Frage und diesen Chat jetzt auf sein Handy. Sie erhalten Ihre {reply}.",
  "afterHours": "außerhalb der Bürozeiten",
  "price": {
   "base": "Der Preis richtet sich nach dem Einzelfall: Fritz ist eine Maßanfertigung, kein Wrapper. ",
   "none": "Soll ich das an Nico weitergeben, damit er Sie zurückruft?",
   "open": "Es ist {time} in Kaunas und Nico ist da. Soll ich das weitergeben, damit er Sie zurückruft?",
   "closed": "Es ist {time} in Kaunas, Nico hat also Feierabend. Ich kann das jetzt weitergeben, und Sie erhalten Ihre {reply}."
  }
 },
 "fr": {
  "W": {
   "today": "réponse aujourd’hui",
   "next": "réponse le jour ouvré suivant",
   "from10": "réponse dès 10 h",
   "tomorrow": "réponse demain dès 10 h",
   "monday": "réponse lundi dès 10 h",
   "open": "ouvert",
   "closed": "fermé",
   "online": "en ligne",
   "slow": "lent",
   "down": "hors service",
   "lights": {
    "green": "en ligne",
    "amber": "dégradé",
    "red": "hors service",
    "unknown": "statut"
   },
   "here": "en ligne",
   "away": "hors ligne",
   "green": "tous les systèmes au vert →",
   "degraded_one": "1 service dégradé →",
   "degraded_many": "{n} services dégradés →",
   "nicoFrom": "nico · depuis son téléphone",
   "source": "source : ",
   "where": "où est-ce écrit ?",
   "reading": "fritz lit",
   "ask": "Bonjour Fritz, que pouvez-vous faire pour moi ?",
   "running": "exécution {a} sur {b}"
  },
  "chat": {
   "q1": "Est-ce une vraie entreprise ?",
   "a1": "Oui. MB Meihuizen AI, code d’entreprise 308157412, une personne morale de droit lituanien. Vous pouvez le vérifier vous-même auprès du Registrų centras.",
   "q2": "Combien coûterait Fritz pour notre site ?",
   "q3": "Puis-je parler directement à Nico ?",
   "live1": "Il est là. Voulez-vous que je le fasse entrer dans cette conversation ?",
   "live2": "oui, merci",
   "live3": "✓ le téléphone de Nico sonne",
   "live4": "Bonjour, ici Nico. Parlons chiffres, avec plaisir. @Fritz partage la fiche produit de Fritz.",
   "live5": "✓ fiche produit partagée · la parole revient à Nico",
   "later1": "✓ demande envoyée sur le téléphone de Nico, avec cette conversation"
  },
  "closed": "Il est {time} à Kaunas, Nico n’est pas au bureau. J’envoie dès maintenant votre question et cette conversation sur son téléphone ; vous aurez une {reply}.",
  "afterHours": "en dehors des heures de bureau",
  "price": {
   "base": "Tarif au cas par cas : Fritz est un développement sur mesure, pas un wrapper. ",
   "none": "Voulez-vous que je transmette votre demande à Nico pour qu’il vous rappelle ?",
   "open": "Il est {time} à Kaunas et Nico est au bureau. Voulez-vous que je transmette votre demande pour qu’il vous rappelle ?",
   "closed": "Il est {time} à Kaunas, Nico n’est pas au bureau. Je peux transmettre votre demande dès maintenant, et vous aurez une {reply}."
  }
 },
 "it": {
  "W": {
   "today": "risposta oggi",
   "next": "risposta il prossimo giorno lavorativo",
   "from10": "risposta dalle 10:00",
   "tomorrow": "risposta domani dalle 10:00",
   "monday": "risposta lunedì dalle 10:00",
   "open": "aperto",
   "closed": "chiuso",
   "online": "online",
   "slow": "lento",
   "down": "fuori servizio",
   "lights": {
    "green": "online",
    "amber": "rallentato",
    "red": "fuori servizio",
    "unknown": "stato"
   },
   "here": "online",
   "away": "offline",
   "green": "tutti i sistemi verdi →",
   "degraded_one": "1 servizio rallentato →",
   "degraded_many": "{n} servizi rallentati →",
   "nicoFrom": "nico · dal suo telefono",
   "source": "fonte: ",
   "where": "dove c’è scritto?",
   "reading": "fritz sta leggendo",
   "ask": "Ciao Fritz, cosa puoi fare per me?",
   "running": "in esecuzione {a} di {b}"
  },
  "chat": {
   "q1": "È un’azienda vera?",
   "a1": "Sì. MB Meihuizen AI, codice societario 308157412, persona giuridica lituana. Può verificarlo Lei stesso presso il Registrų centras.",
   "q2": "Quanto costerebbe Fritz per il nostro sito?",
   "q3": "Posso parlare direttamente con Nico?",
   "live1": "È in ufficio. Vuole che lo faccia entrare in questa chat?",
   "live2": "sì, grazie",
   "live3": "✓ il telefono di Nico sta squillando",
   "live4": "Buongiorno, sono Nico. Parliamo pure di numeri. @Fritz condividi la scheda prodotto di Fritz.",
   "live5": "✓ scheda prodotto condivisa · la parola torna a Nico",
   "later1": "✓ richiesta inviata al telefono di Nico, con questa chat"
  },
  "closed": "Ora di Kaunas: {time}, Nico non è in ufficio. Invio subito la Sua domanda e questa chat al suo telefono; Le arriverà una {reply}.",
  "afterHours": "fuori orario",
  "price": {
   "base": "Il prezzo si definisce caso per caso: Fritz è uno sviluppo su misura, non un wrapper. ",
   "none": "Vuole che giri la richiesta a Nico, così La richiama?",
   "open": "Ora di Kaunas: {time}, e Nico è in ufficio. Vuole che gli giri la richiesta, così La richiama?",
   "closed": "Ora di Kaunas: {time}, Nico non è in ufficio. Posso girargli la richiesta subito, e Le arriverà una {reply}."
  }
 },
 "es": {
  "W": {
   "today": "respuesta hoy",
   "next": "respuesta el próximo día laborable",
   "from10": "respuesta a partir de las 10:00",
   "tomorrow": "respuesta mañana a partir de las 10:00",
   "monday": "respuesta el lunes a partir de las 10:00",
   "open": "abierto",
   "closed": "cerrado",
   "online": "en línea",
   "slow": "lento",
   "down": "caído",
   "lights": {
    "green": "en línea",
    "amber": "degradado",
    "red": "caído",
    "unknown": "estado"
   },
   "here": "en línea",
   "away": "desconectado",
   "green": "todos los sistemas en verde →",
   "degraded_one": "1 servicio degradado →",
   "degraded_many": "{n} servicios degradados →",
   "nicoFrom": "nico · desde su teléfono",
   "source": "fuente: ",
   "where": "¿dónde lo dice?",
   "reading": "fritz está leyendo",
   "ask": "Hola, Fritz: ¿qué puede hacer por mí?",
   "running": "ejecutando {a} de {b}"
  },
  "chat": {
   "q1": "¿Es una empresa real?",
   "a1": "Sí. MB Meihuizen AI, código de empresa 308157412, una persona jurídica lituana. Puede comprobarlo usted mismo en el Registrų centras.",
   "q2": "¿Cuánto costaría Fritz para nuestra web?",
   "q3": "¿Puedo hablar directamente con Nico?",
   "live1": "Está disponible. ¿Quiere que lo incorpore a este chat?",
   "live2": "sí, por favor",
   "live3": "✓ está sonando el teléfono de Nico",
   "live4": "Hola, soy Nico. Encantado de hablar de números. @Fritz comparte la ficha de producto de Fritz.",
   "live5": "✓ ficha de producto compartida · la palabra vuelve a Nico",
   "later1": "✓ solicitud enviada al teléfono de Nico, con este chat"
  },
  "closed": "Hora en Kaunas: {time}; Nico ya ha terminado su jornada. Envío ahora su pregunta y este chat a su teléfono; recibirá {reply}.",
  "afterHours": "fuera de horario",
  "price": {
   "base": "El precio depende de cada caso: Fritz es un desarrollo a medida, no un envoltorio. ",
   "none": "¿Se lo paso a Nico para que le devuelva la llamada?",
   "open": "Hora en Kaunas: {time}, y Nico está en la oficina. ¿Se lo paso para que le devuelva la llamada?",
   "closed": "Hora en Kaunas: {time}; Nico ya ha terminado su jornada. Puedo pasárselo ahora, y recibirá {reply}."
  }
 },
 "pt": {
  "W": {
   "today": "resposta hoje",
   "next": "resposta no próximo dia útil",
   "from10": "resposta a partir das 10:00",
   "tomorrow": "resposta amanhã a partir das 10:00",
   "monday": "resposta na segunda-feira a partir das 10:00",
   "open": "aberto",
   "closed": "fechado",
   "online": "online",
   "slow": "lento",
   "down": "em baixo",
   "lights": {
    "green": "online",
    "amber": "degradado",
    "red": "em baixo",
    "unknown": "estado"
   },
   "here": "online",
   "away": "offline",
   "green": "todos os sistemas a verde →",
   "degraded_one": "1 serviço degradado →",
   "degraded_many": "{n} serviços degradados →",
   "nicoFrom": "nico · do telemóvel",
   "source": "fonte: ",
   "where": "onde é que isso está escrito?",
   "reading": "o fritz está a ler",
   "ask": "Olá Fritz, o que pode fazer por mim?",
   "running": "a executar {a} de {b}"
  },
  "chat": {
   "q1": "Esta empresa é real?",
   "a1": "Sim. MB Meihuizen AI, código de empresa 308157412, uma pessoa coletiva lituana. Pode confirmá-lo no Registrų centras.",
   "q2": "Quanto custaria o Fritz para o nosso site?",
   "q3": "Posso falar diretamente com o Nico?",
   "live1": "Ele está disponível. Quer que o chame para esta conversa?",
   "live2": "sim, por favor",
   "live3": "✓ o telemóvel do Nico está a tocar",
   "live4": "Olá, fala o Nico. Falamos de números com todo o gosto. @Fritz partilha a ficha de produto do Fritz.",
   "live5": "✓ ficha de produto partilhada · a palavra volta para o Nico",
   "later1": "✓ pedido enviado para o telemóvel do Nico, com esta conversa"
  },
  "closed": "Hora de Kaunas: {time}, por isso o Nico já não está. Vou enviar agora a sua pergunta e esta conversa para o telemóvel dele; terá {reply}.",
  "afterHours": "fora de horas",
  "price": {
   "base": "Preço por caso: o Fritz é desenvolvido à medida, não é um wrapper. ",
   "none": "Quer que passe isto ao Nico, para ele lhe ligar de volta?",
   "open": "Hora de Kaunas: {time}, e o Nico está disponível. Quer que passe isto ao Nico, para ele lhe ligar de volta?",
   "closed": "Hora de Kaunas: {time}, por isso o Nico já não está. Posso passar isto agora, e terá {reply}."
  }
 },
 "lt": {
  "W": {
   "today": "atsakome šiandien",
   "next": "atsakysime kitą darbo dieną",
   "from10": "atsakysime nuo 10:00",
   "tomorrow": "atsakysime rytoj nuo 10:00",
   "monday": "atsakysime pirmadienį nuo 10:00",
   "open": "dirbame",
   "closed": "nedirbame",
   "online": "veikia",
   "slow": "lėtai",
   "down": "neveikia",
   "lights": {
    "green": "veikia",
    "amber": "sutrikimai",
    "red": "neveikia",
    "unknown": "būsena"
   },
   "here": "prisijungęs",
   "away": "neprisijungęs",
   "green": "viskas veikia →",
   "degraded_one": "sutrikimų: 1 →",
   "degraded_many": "sutrikimų: {n} →",
   "nicoFrom": "nico · iš telefono",
   "source": "šaltinis: ",
   "where": "kur tai parašyta?",
   "reading": "fritz skaito",
   "ask": "Labas, Fritz, kuo gali man padėti?",
   "running": "vykdoma {a} iš {b}"
  },
  "chat": {
   "q1": "Ar tai tikra įmonė?",
   "a1": "Taip. MB Meihuizen AI, įmonės kodas 308157412, Lietuvos juridinis asmuo. Galite patys patikrinti Registrų centre.",
   "q2": "Kiek kainuotų Fritz mūsų svetainei?",
   "q3": "Ar galiu pakalbėti tiesiogiai su Nico?",
   "live1": "Jis darbe. Pakviesti jį į šį pokalbį?",
   "live2": "taip, prašau",
   "live3": "✓ Nico telefonas skamba",
   "live4": "Labas, čia Nico. Mielai aptarsiu kainas. @Fritz, pasidalink Fritz produkto aprašu.",
   "live5": "✓ produkto aprašas pasidalintas · žodis vėl Nico",
   "later1": "✓ užklausa kartu su šiuo pokalbiu išsiųsta į Nico telefoną"
  },
  "closed": "Kaune dabar {time}, Nico nedirba. Jūsų klausimą ir šį pokalbį siunčiu į jo telefoną; {reply}.",
  "afterHours": "ne darbo laikas",
  "price": {
   "base": "Kaina nustatoma kiekvienam atvejui: Fritz kuriamas pagal užsakymą, tai ne apvalkalas. ",
   "none": "Perduoti tai Nico, kad jis jums paskambintų?",
   "open": "Kaune dabar {time} ir Nico darbe. Perduoti tai jam, kad jis jums paskambintų?",
   "closed": "Kaune dabar {time}, Nico nedirba. Galiu perduoti dabar; {reply}."
  }
 }
}/*I18N-END*/;
  var LANG = (document.documentElement.getAttribute('lang') || 'en').slice(0, 2).toLowerCase();
  var L = I18N[LANG] || I18N.en;
  function fill(t, v) { return t.replace(/\{(\w+)\}/g, function (m, k) { return k in v ? String(v[k]) : m; }); }
  var W = {};
  Object.keys(L.W).forEach(function (k) { W[k] = L.W[k]; });
  W.degraded = function (n) { return n === 1 ? L.W.degraded_one : fill(L.W.degraded_many, { n: n }); };
  W.running = function (a, b) { return fill(L.W.running, { a: a, b: b }); };

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
    var C = L.chat;
    var base = [
      { k: 'user', t: C.q1 },
      { k: 'tool', t: '↳ read_page  credentials.html' },
      { k: 'fritz', t: C.a1, src: 'credentials.html' },
      { k: 'user', t: C.q2 },
      { k: 'tool', t: '↳ read_page  projects/agent-fritz.html' },
      { k: 'fritz', price: true, src: 'agent-fritz.html' },
      { k: 'user', t: C.q3 }
    ];
    var live = [
      { k: 'fritz', t: C.live1 },
      { k: 'user', t: C.live2 },
      { k: 'ok', t: C.live3 },
      { k: 'nico', t: C.live4 },
      { k: 'tool', t: '↳ share_document  agent-fritz-product-sheet.pdf' },
      { k: 'ok', t: C.live5 }
    ];
    var later = [
      { k: 'fritz', closed: true },
      { k: 'ok', t: C.later1 }
    ];
    var steps = base;
    function script() {
      var o = window.mhOffice && window.mhOffice.now();
      steps = base.concat(o && !o.open ? later : live);
    }
    function closedLine() {
      var o = window.mhOffice && window.mhOffice.now();
      return fill(L.closed, { time: o ? o.time : L.afterHours, reply: replyText(false) });
    }
    function priceLine() {
      var o = window.mhOffice && window.mhOffice.now();
      if (!o) { return L.price.base + L.price.none; }
      return L.price.base + fill(o.open ? L.price.open : L.price.closed, { time: o.time, reply: replyText(false) });
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
  // ---- 5b. stepped highlight (Agent Fritz capability cards) ------------------
  // [data-step] holds the cards. The HTML shows them all plain, which is also the
  // reduced-motion view. With motion allowed, a highlight walks the cards like
  // the pipeline: past cards tick, the current one lifts, then it starts over.
  // Hovering the grid pauses the walk so a card can be read.
  var stepBox = document.querySelector('[data-step]');
  if (stepBox && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    stepBox.classList.add('stepping');
    var cards = stepBox.children;
    var pos = -1;
    var paused = false;
    stepBox.addEventListener('mouseenter', function () { paused = true; });
    stepBox.addEventListener('mouseleave', function () { paused = false; });
    setInterval(function () {
      if (paused) { return; }
      pos = pos >= cards.length + 1 ? 0 : pos + 1;
      Array.prototype.forEach.call(cards, function (c, i) {
        c.classList.toggle('seen', pos < cards.length && i < pos);
        c.classList.toggle('on', i === pos);
      });
    }, 1400);
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
