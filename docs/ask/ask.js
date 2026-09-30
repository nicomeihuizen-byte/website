/*
 * Agent Fritz: the chat in the corner of every page. Named after Nico's dog.
 *
 * This file is only the window. The agent runs server side (api/chat.js in
 * the website-contact-function project): it reads this site's pages through
 * a read_page tool, answers from what it read, and can file a free scan
 * request by email. Every step streams back here and is shown as it
 * happens, because watching the agent work is the demo.
 *
 * Built for the site's CSP: no inline style attributes, no innerHTML with
 * anything the model wrote. Text is placed with textContent, and the only
 * links rendered are to this site and to info@meihuizen.ai.
 *
 * The conversation survives page navigation through sessionStorage and
 * disappears with the tab. This file stores nothing anywhere else.
 */
(function () {
  'use strict';
  if (window.__fritz) { return; }
  window.__fritz = true;

  let script = document.currentScript;
  let ENDPOINT = (script && script.getAttribute('data-endpoint')) ||
    'https://website-contact-function-4efp.vercel.app/api/chat';
  const KEY = 'fritz-v1';
  const MAX_CHARS = 800;
  const MAX_HISTORY = 16;
  const SPIN = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  const T = {
    en: {
      book: "Rather talk right away? Pick a time →",
      contactIntro: "That information is not on our website, so I won’t promise anything. But it’s exactly the kind of question Nico answers himself. Can I get your name and a way he can reach you, email or phone?",
      contactIntros: { via_nico: "Can I get your name and a way Nico can reach you, email or phone?", fit: "Whether it fits your business is Nico’s call, not mine. Can I get your name and a way he can reach you, email or phone?", off_topic: "I only answer questions about meihuizen.ai. Nico might still be able to help you further, though. Can I get your name and a way he can reach you, email or phone?" },
      contactForm: ["Name:", "Company:", "Email:", "Phone:"],
      contact: ["request passed on", "Nico has it in his inbox and will reach out personally.", "A confirmation is on its way to you."], contactHint: "Your name, and an email or phone number",
      proof: ["where does it say so?", "hide", ""],
      pages: {"fritz": {"ready": "You’re on my own page. Want to try to trip me up?", "s": ["What can’t you answer?", "How do you know you’re right?", "Can I get you for my own website?"]}, "five": {"ready": "You’re looking at Five. Ask me anything about it.", "s": ["What does Five cost?", "Who is Five for?", "Can Five run on a private server?"]}, "sa": {"s": ["What does a scan find?", "How does the free scan work?", "I’d like a free scan"]}, "cred": {"s": ["Is meihuizen.ai a registered company?", "What did Nico do before this?", "What is the VAT number?"]}, "about": {"s": ["What did Nico do before this?", "What stack do you build with?", "Can you come to us in person?"]}, "builds": {"s": ["What is Second Audience?", "How does Five work?", "Can I get Fritz on my own website?"]}, "privacy": {"s": ["Does Fritz store my conversation?", "Which cookies does this site set?", "How do I get my data deleted?"]}, "status": {"s": ["What do the colours mean?", "What does Agent Fritz run on?", "Where do the vendor lights come from?"]}, "acre": {"s": ["Why two plots?", "What does the field module measure?", "Is anything built yet?"]}, "portfolio": {"s": ["What is the second audience?", "Is this website for sale?", "Can you build a site like this for me?"]}},
      scanIntro: 'I can help you request a free Second Audience scan. I\u2019ll need the following things to complete your request:', scanForm: ['Requester:', 'Domain to scan:', 'Phone:', 'Email:'],
      launch: 'ask fritz', tip: 'Questions about meihuizen.ai? Fritz reads the site so you don’t have to.',
      status: 'online · answers from this site only', down: 'asleep · email info@meihuizen.ai',
      boot: ['{n} pages indexed', 'answers only from what the pages say', 'can file a free scan request for you'],
      ready: 'Ready. What do you want to know?',
      placeholder: 'Ask about meihuizen.ai…', send: 'Send', reset: 'New conversation', close: 'Close', open: 'Open Agent Fritz, the chat assistant',
      thinking: 'sniffing through the pages…', miss: 'not on our website', sources: 'read', you: 'you',
      scan: ['scan request filed', 'Nico has it in his inbox. A confirmation is on its way to you.'],
      err: { offline: 'Fritz is asleep right now. Email info@meihuizen.ai.', rate: 'That’s a lot of questions. Give Fritz a minute.', timeout: 'That took too long. Try again, or email info@meihuizen.ai.', network: 'Can’t reach Fritz. Check your connection, or email info@meihuizen.ai.', input: 'Keep it under 800 characters.', upstream: 'Something went wrong on Fritz’s side. Try again, or email info@meihuizen.ai.' },
      suggest: ['What does meihuizen.ai build?', 'Is meihuizen.ai a registered company?', 'What is Second Audience?', 'I’d like a free scan'],
      foot: 'Answers come only from this site’s pages. AI can still be wrong, so check the source. Don’t share sensitive data.', how: 'How Fritz works'
    },
    nl: {
      book: "Liever meteen praten? Kies een moment →",
      contactIntro: "Die informatie staat niet op onze website, dus ik beloof niets. Maar het is precies het soort vraag dat Nico zelf beantwoordt. Mag ik uw naam en een manier waarop hij u kan bereiken, e-mail of telefoon?",
      contactIntros: { via_nico: "Mag ik uw naam en een manier waarop Nico u kan bereiken, e-mail of telefoon?", fit: "Of het bij uw bedrijf past, beoordeelt Nico, niet ik. Mag ik uw naam en een manier waarop hij u kan bereiken, e-mail of telefoon?", off_topic: "Ik beantwoord alleen vragen over meihuizen.ai. Misschien kan Nico u wel verder helpen. Mag ik uw naam en een manier waarop hij u kan bereiken, e-mail of telefoon?" },
      contactForm: ["Naam:", "Bedrijf:", "E-mail:", "Telefoon:"],
      contact: ["verzoek doorgegeven", "Nico heeft het in zijn inbox en neemt persoonlijk contact op.", "Er is een bevestiging naar u onderweg."], contactHint: "Uw naam, en een e-mailadres of telefoonnummer",
      proof: ["waar staat dat?", "verbergen", "uit de Engelse pagina"],
      pages: {"fritz": {"ready": "U bent op mijn eigen pagina. Zin om me op een fout te betrappen?", "s": ["Wat kun je niet beantwoorden?", "Hoe weet je dat je gelijk hebt?", "Kan ik jou op mijn eigen website krijgen?"]}, "five": {"ready": "U kijkt naar Five. Vraag me er alles over.", "s": ["Wat kost Five?", "Voor wie is Five?", "Kan Five op een eigen server draaien?"]}, "sa": {"s": ["Wat vindt een scan?", "Hoe werkt de gratis scan?", "Ik wil een gratis scan"]}, "cred": {"s": ["Is meihuizen.ai een ingeschreven bedrijf?", "Wat deed Nico hiervoor?", "Wat is het btw-nummer?"]}, "about": {"s": ["Wat deed Nico hiervoor?", "Met welke stack bouwen jullie?", "Kunnen jullie bij ons langskomen?"]}, "builds": {"s": ["Wat is Second Audience?", "Hoe werkt Five?", "Kan ik Fritz op mijn eigen website krijgen?"]}, "privacy": {"s": ["Slaat Fritz mijn gesprek op?", "Welke cookies zet deze site?", "Hoe laat ik mijn gegevens verwijderen?"]}, "status": {"s": ["Wat betekenen de kleuren?", "Waar draait Agent Fritz op?", "Waar komen de lampjes van de leveranciers vandaan?"]}, "acre": {"s": ["Waarom twee percelen?", "Wat meet de veldmodule?", "Is er al iets gebouwd?"]}, "portfolio": {"s": ["Wat is de second audience?", "Is deze website te koop?", "Kunnen jullie zo’n site voor mij bouwen?"]}},
      scanIntro: 'Ik kan u helpen een gratis Second Audience-scan aan te vragen. Ik heb de volgende gegevens nodig om uw aanvraag af te ronden:', scanForm: ['Aanvrager:', 'Te scannen domein:', 'Telefoon:', 'E-mail:'],
      launch: 'vraag fritz', tip: 'Vragen over meihuizen.ai? Fritz leest de site, dan hoeft u dat niet.',
      status: 'online · antwoordt alleen vanuit deze site', down: 'slaapt · mail info@meihuizen.ai',
      boot: ['{n} pagina’s geïndexeerd', 'antwoordt alleen met wat de pagina’s zeggen', 'kan een gratis scan voor u aanvragen'],
      ready: 'Klaar. Wat wilt u weten?',
      placeholder: 'Vraag iets over meihuizen.ai…', send: 'Versturen', reset: 'Nieuw gesprek', close: 'Sluiten', open: 'Open Agent Fritz, de chatassistent',
      thinking: 'snuffelt door de pagina’s…', miss: 'staat niet op onze website', sources: 'gelezen', you: 'u',
      scan: ['scanaanvraag verstuurd', 'Nico heeft hem in zijn inbox. Er is een bevestiging naar u onderweg.'],
      err: { offline: 'Fritz slaapt even. Mail info@meihuizen.ai.', rate: 'Dat zijn veel vragen. Geef Fritz een minuut.', timeout: 'Dat duurde te lang. Probeer het opnieuw of mail info@meihuizen.ai.', network: 'Fritz is niet bereikbaar. Controleer uw verbinding of mail info@meihuizen.ai.', input: 'Houd het onder de 800 tekens.', upstream: 'Er ging iets mis aan de kant van Fritz. Probeer het opnieuw of mail info@meihuizen.ai.' },
      suggest: ['Wat bouwt meihuizen.ai?', 'Is meihuizen.ai een ingeschreven bedrijf?', 'Wat is Second Audience?', 'Ik wil een gratis scan'],
      foot: 'Antwoorden komen alleen van de pagina’s van deze site. AI kan zich nog steeds vergissen, dus controleer de bron. Deel geen gevoelige gegevens.', how: 'Hoe Fritz werkt'
    },
    de: {
      book: "Lieber gleich sprechen? Termin wählen →",
      contactIntro: "Diese Information steht nicht auf unserer Website, also verspreche ich nichts. Aber genau solche Fragen beantwortet Nico selbst. Verraten Sie mir Ihren Namen und wie er Sie erreichen kann, per E-Mail oder Telefon?",
      contactIntros: { via_nico: "Verraten Sie mir Ihren Namen und wie Nico Sie erreichen kann, per E-Mail oder Telefon?", fit: "Ob es zu Ihrem Unternehmen passt, entscheidet Nico, nicht ich. Verraten Sie mir Ihren Namen und wie er Sie erreichen kann, per E-Mail oder Telefon?", off_topic: "Ich beantworte nur Fragen zu meihuizen.ai. Vielleicht kann Nico Ihnen trotzdem weiterhelfen. Verraten Sie mir Ihren Namen und wie er Sie erreichen kann, per E-Mail oder Telefon?" },
      contactForm: ["Name:", "Unternehmen:", "E-Mail:", "Telefon:"],
      contact: ["Anfrage weitergeleitet", "Nico hat sie im Postfach und meldet sich persönlich.", "Eine Bestätigung ist auf dem Weg zu Ihnen."], contactHint: "Ihr Name und eine E-Mail-Adresse oder Telefonnummer",
      proof: ["wo steht das?", "ausblenden", "aus der englischen Seite"],
      pages: {"fritz": {"ready": "Sie sind auf meiner eigenen Seite. Lust, mich bei einem Fehler zu erwischen?", "s": ["Was kannst du nicht beantworten?", "Woher weißt du, dass du recht hast?", "Kann ich dich für meine eigene Website bekommen?"]}, "five": {"ready": "Sie sehen sich Five an. Fragen Sie mich alles dazu.", "s": ["Was kostet Five?", "Für wen ist Five?", "Kann Five auf einem eigenen Server laufen?"]}, "sa": {"s": ["Was findet ein Scan?", "Wie funktioniert der kostenlose Scan?", "Ich möchte einen kostenlosen Scan"]}, "cred": {"s": ["Ist meihuizen.ai ein eingetragenes Unternehmen?", "Was hat Nico vorher gemacht?", "Wie lautet die USt-IdNr.?"]}, "about": {"s": ["Was hat Nico vorher gemacht?", "Mit welchem Stack wird gebaut?", "Können Sie zu uns vor Ort kommen?"]}, "builds": {"s": ["Was ist Second Audience?", "Wie funktioniert Five?", "Kann ich Fritz für meine eigene Website bekommen?"]}, "privacy": {"s": ["Speichert Fritz mein Gespräch?", "Welche Cookies setzt diese Website?", "Wie lasse ich meine Daten löschen?"]}, "status": {"s": ["Was bedeuten die Farben?", "Worauf läuft Agent Fritz?", "Woher kommen die Ampeln der Anbieter?"]}, "acre": {"s": ["Warum zwei Grundstücke?", "Was misst das Feldmodul?", "Ist schon etwas gebaut?"]}, "portfolio": {"s": ["Was ist die Second Audience?", "Steht diese Website zum Verkauf?", "Können Sie so eine Website für mich bauen?"]}},
      scanIntro: 'Ich kann Ihnen helfen, einen kostenlosen Second-Audience-Scan anzufragen. Für Ihre Anfrage brauche ich Folgendes:', scanForm: ['Anfragender:', 'Zu scannende Domain:', 'Telefon:', 'E-Mail:'],
      launch: 'frag fritz', tip: 'Fragen zu meihuizen.ai? Fritz liest die Website, damit Sie es nicht müssen.',
      status: 'online · antwortet nur aus dieser Website', down: 'schläft · info@meihuizen.ai',
      boot: ['{n} Seiten indexiert', 'antwortet nur mit dem, was auf den Seiten steht', 'kann für Sie einen kostenlosen Scan anfragen'],
      ready: 'Bereit. Was möchten Sie wissen?',
      placeholder: 'Fragen Sie etwas zu meihuizen.ai…', send: 'Senden', reset: 'Neues Gespräch', close: 'Schließen', open: 'Agent Fritz öffnen, den Chat-Assistenten',
      thinking: 'schnüffelt durch die Seiten…', miss: 'nicht auf unserer Website', sources: 'gelesen', you: 'Sie',
      scan: ['Scan-Anfrage gesendet', 'Nico hat sie im Postfach. Eine Bestätigung ist auf dem Weg zu Ihnen.'],
      err: { offline: 'Fritz schläft gerade. Schreiben Sie an info@meihuizen.ai.', rate: 'Das sind viele Fragen. Geben Sie Fritz eine Minute.', timeout: 'Das hat zu lange gedauert. Versuchen Sie es erneut oder schreiben Sie an info@meihuizen.ai.', network: 'Fritz ist nicht erreichbar. Prüfen Sie Ihre Verbindung oder schreiben Sie an info@meihuizen.ai.', input: 'Bitte unter 800 Zeichen bleiben.', upstream: 'Bei Fritz ist etwas schiefgegangen. Versuchen Sie es erneut oder schreiben Sie an info@meihuizen.ai.' },
      suggest: ['Was baut meihuizen.ai?', 'Ist meihuizen.ai ein eingetragenes Unternehmen?', 'Was ist Second Audience?', 'Ich möchte einen kostenlosen Scan'],
      foot: 'Antworten stammen nur von den Seiten dieser Website. KI kann sich trotzdem irren, prüfen Sie also die Quelle. Teilen Sie keine sensiblen Daten.', how: 'So arbeitet Fritz'
    },
    fr: {
      book: "Envie d’en parler tout de suite ? Choisir un créneau →",
      contactIntro: "Cette information ne figure pas sur notre site, donc je ne promets rien. Mais c’est exactement le genre de question à laquelle Nico répond lui-même. Puis-je avoir votre nom et un moyen de vous joindre, e-mail ou téléphone ?",
      contactIntros: { via_nico: "Puis-je avoir votre nom et un moyen pour Nico de vous joindre, e-mail ou téléphone ?", fit: "Savoir si cela convient à votre entreprise, c’est à Nico d’en juger, pas à moi. Puis-je avoir votre nom et un moyen de vous joindre, e-mail ou téléphone ?", off_topic: "Je ne réponds qu’aux questions sur meihuizen.ai. Nico pourra peut-être quand même vous aider. Puis-je avoir votre nom et un moyen de vous joindre, e-mail ou téléphone ?" },
      contactForm: ["Nom :", "Entreprise :", "E-mail :", "Téléphone :"],
      contact: ["demande transmise", "Nico l’a dans sa boîte de réception et vous contactera personnellement.", "Une confirmation est en route."], contactHint: "Votre nom, et un e-mail ou un numéro de téléphone",
      proof: ["où est-ce écrit ?", "masquer", "extrait de la page anglaise"],
      pages: {"fritz": {"ready": "Vous êtes sur ma propre page. Envie de me prendre en défaut ?", "s": ["À quoi ne peux-tu pas répondre ?", "Comment sais-tu que tu as raison ?", "Puis-je t’avoir sur mon propre site ?"]}, "five": {"ready": "Vous regardez Five. Posez-moi toutes vos questions.", "s": ["Combien coûte Five ?", "À qui s’adresse Five ?", "Five peut-il tourner sur un serveur privé ?"]}, "sa": {"s": ["Que trouve un scan ?", "Comment fonctionne le scan gratuit ?", "Je voudrais un scan gratuit"]}, "cred": {"s": ["meihuizen.ai est-elle une société immatriculée ?", "Que faisait Nico avant ?", "Quel est le numéro de TVA ?"]}, "about": {"s": ["Que faisait Nico avant ?", "Avec quelle stack travaillez-vous ?", "Pouvez-vous venir chez nous ?"]}, "builds": {"s": ["Qu’est-ce que Second Audience ?", "Comment fonctionne Five ?", "Puis-je avoir Fritz sur mon propre site ?"]}, "privacy": {"s": ["Fritz enregistre-t-il ma conversation ?", "Quels cookies ce site dépose-t-il ?", "Comment faire supprimer mes données ?"]}, "status": {"s": ["Que signifient les couleurs ?", "Sur quoi tourne Agent Fritz ?", "D’où viennent les voyants des fournisseurs ?"]}, "acre": {"s": ["Pourquoi deux terrains ?", "Que mesure le module de terrain ?", "Y a-t-il déjà quelque chose de construit ?"]}, "portfolio": {"s": ["Qu’est-ce que la second audience ?", "Ce site est-il à vendre ?", "Pouvez-vous me construire un site comme celui-ci ?"]}},
      scanIntro: 'Je peux vous aider à demander un scan Second Audience gratuit. Pour finaliser votre demande, il me faut\u00a0:', scanForm: ['Demandeur\u00a0:', 'Domaine à scanner\u00a0:', 'Téléphone\u00a0:', 'E-mail\u00a0:'],
      launch: 'demander à fritz', tip: 'Des questions sur meihuizen.ai ? Fritz lit le site pour vous.',
      status: 'en ligne · répond uniquement à partir de ce site', down: 'endormi · info@meihuizen.ai',
      boot: ['{n} pages indexées', 'répond uniquement avec ce que disent les pages', 'peut demander un scan gratuit pour vous'],
      ready: 'Prêt. Que voulez-vous savoir ?',
      placeholder: 'Posez une question sur meihuizen.ai…', send: 'Envoyer', reset: 'Nouvelle conversation', close: 'Fermer', open: 'Ouvrir Agent Fritz, l’assistant de chat',
      thinking: 'flaire les pages…', miss: 'absent de notre site', sources: 'lu', you: 'vous',
      scan: ['demande de scan envoyée', 'Nico l’a dans sa boîte de réception. Une confirmation est en route.'],
      err: { offline: 'Fritz dort pour l’instant. Écrivez à info@meihuizen.ai.', rate: 'Cela fait beaucoup de questions. Laissez une minute à Fritz.', timeout: 'C’était trop long. Réessayez ou écrivez à info@meihuizen.ai.', network: 'Impossible de joindre Fritz. Vérifiez votre connexion ou écrivez à info@meihuizen.ai.', input: 'Restez sous 800 caractères.', upstream: 'Un problème est survenu du côté de Fritz. Réessayez ou écrivez à info@meihuizen.ai.' },
      suggest: ['Que construit meihuizen.ai ?', 'meihuizen.ai est-elle une société immatriculée ?', 'Qu’est-ce que Second Audience ?', 'Je voudrais un scan gratuit'],
      foot: 'Les réponses viennent uniquement des pages de ce site. L’IA peut tout de même se tromper, vérifiez donc la source. Ne partagez pas de données sensibles.', how: 'Comment Fritz fonctionne'
    },
    es: {
      book: "¿Prefiere hablar ya? Elija una hora →",
      contactIntro: "Esa información no está en nuestro sitio web, así que no prometo nada. Pero es justo el tipo de pregunta que Nico responde personalmente. ¿Me deja su nombre y una forma de contactarle, correo o teléfono?",
      contactIntros: { via_nico: "¿Me deja su nombre y una forma de que Nico le contacte, correo o teléfono?", fit: "Si encaja con su empresa lo decide Nico, no yo. ¿Me deja su nombre y una forma de contactarle, correo o teléfono?", off_topic: "Solo respondo preguntas sobre meihuizen.ai. Aun así, puede que Nico pueda ayudarle. ¿Me deja su nombre y una forma de contactarle, correo o teléfono?" },
      contactForm: ["Nombre:", "Empresa:", "Correo:", "Teléfono:"],
      contact: ["solicitud enviada", "Nico la tiene en su bandeja de entrada y se pondrá en contacto personalmente.", "Le llega una confirmación."], contactHint: "Su nombre y un correo o un teléfono",
      proof: ["¿dónde lo dice?", "ocultar", "de la página en inglés"],
      pages: {"fritz": {"ready": "Está en mi propia página. ¿Se anima a pillarme en un error?", "s": ["¿Qué no puedes responder?", "¿Cómo sabes que tienes razón?", "¿Puedo tenerte en mi propio sitio web?"]}, "five": {"ready": "Está viendo Five. Pregúnteme lo que quiera.", "s": ["¿Cuánto cuesta Five?", "¿Para quién es Five?", "¿Puede Five funcionar en un servidor privado?"]}, "sa": {"s": ["¿Qué encuentra un escaneo?", "¿Cómo funciona el escaneo gratuito?", "Quiero un escaneo gratuito"]}, "cred": {"s": ["¿Es meihuizen.ai una empresa registrada?", "¿Qué hacía Nico antes?", "¿Cuál es el número de IVA?"]}, "about": {"s": ["¿Qué hacía Nico antes?", "¿Con qué stack trabajan?", "¿Pueden venir a vernos en persona?"]}, "builds": {"s": ["¿Qué es Second Audience?", "¿Cómo funciona Five?", "¿Puedo tener a Fritz en mi propio sitio web?"]}, "privacy": {"s": ["¿Guarda Fritz mi conversación?", "¿Qué cookies usa este sitio?", "¿Cómo pido que borren mis datos?"]}, "status": {"s": ["¿Qué significan los colores?", "¿Sobre qué funciona Agent Fritz?", "¿De dónde salen los indicadores de los proveedores?"]}, "acre": {"s": ["¿Por qué dos terrenos?", "¿Qué mide el módulo de campo?", "¿Ya hay algo construido?"]}, "portfolio": {"s": ["¿Qué es la second audience?", "¿Está a la venta este sitio web?", "¿Pueden construirme un sitio así?"]}},
      scanIntro: 'Puedo ayudarle a solicitar un escaneo gratuito de Second Audience. Para completar su solicitud necesito lo siguiente:', scanForm: ['Solicitante:', 'Dominio a escanear:', 'Teléfono:', 'Correo:'],
      launch: 'pregunta a fritz', tip: '¿Preguntas sobre meihuizen.ai? Fritz lee el sitio por usted.',
      status: 'en línea · responde solo a partir de este sitio', down: 'dormido · info@meihuizen.ai',
      boot: ['{n} páginas indexadas', 'responde solo con lo que dicen las páginas', 'puede solicitar un escaneo gratuito por usted'],
      ready: 'Listo. ¿Qué quiere saber?',
      placeholder: 'Pregunte sobre meihuizen.ai…', send: 'Enviar', reset: 'Nueva conversación', close: 'Cerrar', open: 'Abrir Agent Fritz, el asistente de chat',
      thinking: 'olfateando las páginas…', miss: 'no está en nuestro sitio web', sources: 'leído', you: 'usted',
      scan: ['solicitud de escaneo enviada', 'Nico la tiene en su bandeja de entrada. Le llega una confirmación.'],
      err: { offline: 'Fritz está durmiendo. Escriba a info@meihuizen.ai.', rate: 'Son muchas preguntas. Dele un minuto a Fritz.', timeout: 'Tardó demasiado. Inténtelo de nuevo o escriba a info@meihuizen.ai.', network: 'No se puede contactar con Fritz. Compruebe su conexión o escriba a info@meihuizen.ai.', input: 'Menos de 800 caracteres, por favor.', upstream: 'Algo falló del lado de Fritz. Inténtelo de nuevo o escriba a info@meihuizen.ai.' },
      suggest: ['¿Qué construye meihuizen.ai?', '¿Es meihuizen.ai una empresa registrada?', '¿Qué es Second Audience?', 'Quiero un escaneo gratuito'],
      foot: 'Las respuestas salen solo de las páginas de este sitio. La IA aún puede equivocarse, así que compruebe la fuente. No comparta datos sensibles.', how: 'Cómo funciona Fritz'
    },
    it: {
      book: "Preferite parlarne subito? Scegliete un orario →",
      contactIntro: "Questa informazione non è sul nostro sito, quindi non prometto nulla. Ma è proprio il tipo di domanda a cui Nico risponde di persona. Posso avere il vostro nome e un modo per contattarvi, email o telefono?",
      contactIntros: { via_nico: "Posso avere il vostro nome e un modo in cui Nico possa contattarvi, email o telefono?", fit: "Se è adatto alla vostra azienda lo valuta Nico, non io. Posso avere il vostro nome e un modo per contattarvi, email o telefono?", off_topic: "Rispondo solo a domande su meihuizen.ai. Forse però Nico può aiutarvi. Posso avere il vostro nome e un modo per contattarvi, email o telefono?" },
      contactForm: ["Nome:", "Azienda:", "Email:", "Telefono:"],
      contact: ["richiesta inoltrata", "Nico l’ha nella sua casella di posta e vi ricontatterà personalmente.", "Una conferma è in arrivo."], contactHint: "Il vostro nome e un’email o un numero di telefono",
      proof: ["dove c’è scritto?", "nascondi", "dalla pagina inglese"],
      pages: {"fritz": {"ready": "Siete sulla mia pagina. Volete provare a cogliermi in fallo?", "s": ["A cosa non sai rispondere?", "Come sai di avere ragione?", "Posso averti sul mio sito?"]}, "five": {"ready": "State guardando Five. Chiedetemi tutto.", "s": ["Quanto costa Five?", "Per chi è Five?", "Five può girare su un server privato?"]}, "sa": {"s": ["Cosa trova una scansione?", "Come funziona la scansione gratuita?", "Vorrei una scansione gratuita"]}, "cred": {"s": ["meihuizen.ai è una società registrata?", "Cosa faceva Nico prima?", "Qual è la partita IVA?"]}, "about": {"s": ["Cosa faceva Nico prima?", "Con quale stack lavorate?", "Potete venire da noi di persona?"]}, "builds": {"s": ["Cos’è Second Audience?", "Come funziona Five?", "Posso avere Fritz sul mio sito?"]}, "privacy": {"s": ["Fritz salva la mia conversazione?", "Quali cookie usa questo sito?", "Come faccio a far cancellare i miei dati?"]}, "status": {"s": ["Cosa significano i colori?", "Su cosa gira Agent Fritz?", "Da dove vengono le spie dei fornitori?"]}, "acre": {"s": ["Perché due terreni?", "Cosa misura il modulo sul campo?", "C’è già qualcosa di costruito?"]}, "portfolio": {"s": ["Cos’è la second audience?", "Questo sito è in vendita?", "Potete costruirmi un sito così?"]}},
      scanIntro: 'Posso aiutarvi a richiedere una scansione gratuita Second Audience. Per completare la richiesta mi servono i seguenti dati:', scanForm: ['Richiedente:', 'Dominio da scansionare:', 'Telefono:', 'Email:'],
      launch: 'chiedi a fritz', tip: 'Domande su meihuizen.ai? Fritz legge il sito al posto vostro.',
      status: 'online · risponde solo da questo sito', down: 'dorme · info@meihuizen.ai',
      boot: ['{n} pagine indicizzate', 'risponde solo con ciò che dicono le pagine', 'può richiedere per voi una scansione gratuita'],
      ready: 'Pronto. Cosa volete sapere?',
      placeholder: 'Chiedete qualcosa su meihuizen.ai…', send: 'Invia', reset: 'Nuova conversazione', close: 'Chiudi', open: 'Apri Agent Fritz, l’assistente in chat',
      thinking: 'annusa tra le pagine…', miss: 'non è sul nostro sito', sources: 'letto', you: 'voi',
      scan: ['richiesta di scansione inviata', 'Nico l’ha nella sua casella di posta. Una conferma è in arrivo.'],
      err: { offline: 'Fritz sta dormendo. Scrivete a info@meihuizen.ai.', rate: 'Sono tante domande. Date un minuto a Fritz.', timeout: 'Ci è voluto troppo. Riprovate o scrivete a info@meihuizen.ai.', network: 'Fritz non è raggiungibile. Controllate la connessione o scrivete a info@meihuizen.ai.', input: 'Restate sotto gli 800 caratteri.', upstream: 'Qualcosa è andato storto dal lato di Fritz. Riprovate o scrivete a info@meihuizen.ai.' },
      suggest: ['Cosa costruisce meihuizen.ai?', 'meihuizen.ai è una società registrata?', 'Cos’è Second Audience?', 'Vorrei una scansione gratuita'],
      foot: 'Le risposte vengono solo dalle pagine di questo sito. L’IA può comunque sbagliare, quindi controllate la fonte. Non condividete dati sensibili.', how: 'Come funziona Fritz'
    },
    pt: {
      book: "Prefere falar já? Escolha uma hora →",
      contactIntro: "Essa informação não está no nosso site, por isso não prometo nada. Mas é exatamente o tipo de pergunta a que o Nico responde pessoalmente. Pode deixar-me o seu nome e uma forma de o contactar, email ou telefone?",
      contactIntros: { via_nico: "Pode deixar-me o seu nome e uma forma de o Nico o contactar, email ou telefone?", fit: "Se encaixa na sua empresa é o Nico que avalia, não eu. Pode deixar-me o seu nome e uma forma de o contactar, email ou telefone?", off_topic: "Só respondo a perguntas sobre a meihuizen.ai. Ainda assim, o Nico talvez o possa ajudar. Pode deixar-me o seu nome e uma forma de o contactar, email ou telefone?" },
      contactForm: ["Nome:", "Empresa:", "Email:", "Telefone:"],
      contact: ["pedido enviado", "O Nico já o tem na caixa de entrada e entrará em contacto pessoalmente.", "Vai receber uma confirmação."], contactHint: "O seu nome e um email ou número de telefone",
      proof: ["onde diz isso?", "esconder", "da página em inglês"],
      pages: {"fritz": {"ready": "Está na minha própria página. Quer tentar apanhar-me num erro?", "s": ["O que é que não consegues responder?", "Como sabes que tens razão?", "Posso ter-te no meu próprio site?"]}, "five": {"ready": "Está a ver o Five. Pergunte-me o que quiser.", "s": ["Quanto custa o Five?", "Para quem é o Five?", "O Five pode correr num servidor privado?"]}, "sa": {"s": ["O que encontra uma análise?", "Como funciona a análise gratuita?", "Quero uma análise gratuita"]}, "cred": {"s": ["A meihuizen.ai é uma empresa registada?", "O que fazia o Nico antes?", "Qual é o número de IVA?"]}, "about": {"s": ["O que fazia o Nico antes?", "Com que stack trabalham?", "Podem vir ter connosco pessoalmente?"]}, "builds": {"s": ["O que é o Second Audience?", "Como funciona o Five?", "Posso ter o Fritz no meu próprio site?"]}, "privacy": {"s": ["O Fritz guarda a minha conversa?", "Que cookies usa este site?", "Como peço para apagarem os meus dados?"]}, "status": {"s": ["O que significam as cores?", "Em que corre o Agent Fritz?", "De onde vêm os indicadores dos fornecedores?"]}, "acre": {"s": ["Porquê dois terrenos?", "O que mede o módulo de campo?", "Já há alguma coisa construída?"]}, "portfolio": {"s": ["O que é a second audience?", "Este site está à venda?", "Podem construir-me um site assim?"]}},
      scanIntro: 'Posso ajudá-lo a pedir uma análise gratuita Second Audience. Para concluir o pedido preciso do seguinte:', scanForm: ['Requerente:', 'Domínio a analisar:', 'Telefone:', 'Email:'],
      launch: 'pergunte ao fritz', tip: 'Perguntas sobre a meihuizen.ai? O Fritz lê o site por si.',
      status: 'online · responde apenas a partir deste site', down: 'a dormir · info@meihuizen.ai',
      boot: ['{n} páginas indexadas', 'responde apenas com o que as páginas dizem', 'pode pedir uma análise gratuita por si'],
      ready: 'Pronto. O que quer saber?',
      placeholder: 'Pergunte sobre a meihuizen.ai…', send: 'Enviar', reset: 'Nova conversa', close: 'Fechar', open: 'Abrir o Agent Fritz, o assistente de chat',
      thinking: 'a farejar as páginas…', miss: 'não está no nosso site', sources: 'lido', you: 'você',
      scan: ['pedido de análise enviado', 'O Nico já o tem na caixa de entrada. Vai receber uma confirmação.'],
      err: { offline: 'O Fritz está a dormir. Escreva para info@meihuizen.ai.', rate: 'São muitas perguntas. Dê um minuto ao Fritz.', timeout: 'Demorou demasiado. Tente de novo ou escreva para info@meihuizen.ai.', network: 'Não é possível contactar o Fritz. Verifique a ligação ou escreva para info@meihuizen.ai.', input: 'Menos de 800 caracteres, por favor.', upstream: 'Algo correu mal do lado do Fritz. Tente de novo ou escreva para info@meihuizen.ai.' },
      suggest: ['O que constrói a meihuizen.ai?', 'A meihuizen.ai é uma empresa registada?', 'O que é o Second Audience?', 'Quero uma análise gratuita'],
      foot: 'As respostas vêm apenas das páginas deste site. A IA pode mesmo assim enganar-se, por isso confirme a fonte. Não partilhe dados sensíveis.', how: 'Como funciona o Fritz'
    },
    lt: {
      book: "Norite pasikalbėti iš karto? Pasirinkite laiką →",
      contactIntro: "Šios informacijos mūsų svetainėje nėra, todėl nieko nežadu. Bet būtent į tokius klausimus Nico atsako pats. Ar galiu gauti jūsų vardą ir kontaktą, kaip jis galėtų su jumis susisiekti: el. paštą arba telefoną?",
      contactIntros: {"via_nico": "Ar galiu gauti jūsų vardą ir kontaktą, kaip Nico galėtų su jumis susisiekti: el. paštą arba telefoną?", "fit": "Ar tai tinka jūsų įmonei, sprendžia Nico, ne aš. Ar galiu gauti jūsų vardą ir kontaktą, kaip jis galėtų su jumis susisiekti: el. paštą arba telefoną?", "off_topic": "Atsakau tik į klausimus apie meihuizen.ai. Vis dėlto Nico gali jums padėti. Ar galiu gauti jūsų vardą ir kontaktą, kaip jis galėtų su jumis susisiekti: el. paštą arba telefoną?"},
      contactForm: ["Vardas:", "Įmonė:", "El. paštas:", "Telefonas:"],
      contact: ["užklausa perduota", "Nico ją gavo ir susisieks su jumis asmeniškai.", "Patvirtinimas jau siunčiamas jums."], contactHint: "Jūsų vardas ir el. paštas arba telefono numeris",
      proof: ["kur tai parašyta?", "slėpti", ""],
      pages: {"fritz": {"ready": "Esate mano paties puslapyje. Norite pabandyti mane suklaidinti?", "s": ["Į ką negalite atsakyti?", "Iš kur žinote, kad esate teisus?", "Ar galiu jus gauti savo svetainei?"]}, "five": {"ready": "Žiūrite į Five. Klauskite apie jį ko tik norite.", "s": ["Kiek kainuoja Five?", "Kam skirtas Five?", "Ar Five gali veikti privačiame serveryje?"]}, "sa": {"s": ["Ką randa patikrinimas?", "Kaip veikia nemokamas patikrinimas?", "Norėčiau nemokamo patikrinimo"]}, "cred": {"s": ["Ar meihuizen.ai yra registruota įmonė?", "Ką Nico veikė anksčiau?", "Koks PVM mokėtojo kodas?"]}, "about": {"s": ["Ką Nico veikė anksčiau?", "Kokias technologijas naudojate?", "Ar galite atvykti pas mus?"]}, "builds": {"s": ["Kas yra Second Audience?", "Kaip veikia Five?", "Ar galiu turėti Fritz savo svetainėje?"]}, "privacy": {"s": ["Ar Fritz išsaugo mano pokalbį?", "Kokius slapukus naudoja ši svetainė?", "Kaip ištrinti mano duomenis?"]}, "status": {"s": ["Ką reiškia spalvos?", "Kokiomis paslaugomis veikia Agent Fritz?", "Iš kur gaunama tiekėjų būsena?"]}, "acre": {"s": ["Kodėl du sklypai?", "Ką matuoja lauko modulis?", "Ar jau kas nors pastatyta?"]}, "portfolio": {"s": ["Kas yra second audience?", "Ar ši svetainė parduodama?", "Ar galite man sukurti tokią svetainę?"]}},
      scanIntro: "Galiu padėti jums užsakyti nemokamą Second Audience patikrinimą. Užklausai užbaigti man reikės šių duomenų:",
      scanForm: ["Užsakovas:", "Tikrinamas domenas:", "Telefonas:", "El. paštas:"],
      launch: "klauskite fritz",
      tip: "Klausimų apie meihuizen.ai? Fritz perskaito svetainę, kad jums nereikėtų.",
      status: "prisijungęs · atsako tik pagal šią svetainę",
      down: "miega · rašykite info@meihuizen.ai",
      boot: ["suindeksuota puslapių: {n}", "atsako tik pagal tai, kas parašyta puslapiuose", "gali už jus pateikti nemokamo patikrinimo užklausą"],
      ready: "Pasiruošęs. Ką norite sužinoti?",
      placeholder: "Klauskite apie meihuizen.ai…",
      send: "Siųsti",
      reset: "Naujas pokalbis",
      close: "Uždaryti",
      open: "Atidaryti Agent Fritz, pokalbių asistentą",
      thinking: "uostinėja puslapius…",
      miss: "mūsų svetainėje nėra",
      sources: "perskaityta",
      you: "Jūs",
      scan: ["patikrinimo užklausa pateikta", "Nico ją gavo. Patvirtinimas jau siunčiamas jums."],
      err: {"offline": "Fritz šiuo metu miega. Rašykite info@meihuizen.ai.", "rate": "Labai daug klausimų. Duokite Fritzui minutę.", "timeout": "Užtruko per ilgai. Bandykite dar kartą arba rašykite info@meihuizen.ai.", "network": "Nepavyksta pasiekti Fritzo. Patikrinkite ryšį arba rašykite info@meihuizen.ai.", "input": "Neviršykite 800 simbolių.", "upstream": "Fritzo pusėje kažkas nutiko. Bandykite dar kartą arba rašykite info@meihuizen.ai."},
      suggest: ["Ką kuria meihuizen.ai?", "Ar meihuizen.ai yra registruota įmonė?", "Kas yra Second Audience?", "Norėčiau nemokamo patikrinimo"],
      foot: "Atsakymai pateikiami tik pagal šios svetainės puslapius. DI vis tiek gali klysti, todėl patikrinkite šaltinį. Nesidalykite jautriais duomenimis.",
      how: "Kaip veikia Fritz"
    }
  };

  let LANG = (document.documentElement.getAttribute('lang') || 'en').slice(0, 2).toLowerCase();
  if (!T[LANG]) { LANG = 'en'; }
  let t = T[LANG];
  let PREFIX = LANG === 'en' ? '/' : '/' + LANG + '/';
  // Which page the visitor is on decides the opening line and the first
  // suggestions: on the Five page, questions about Five.
  const PAGE_KEY = {
    'projects/agent-fritz.html': 'fritz', 'projects/ai-sales-deal-intelligence.html': 'five',
    'projects/second-audience.html': 'sa', 'credentials.html': 'cred',
    'about.html': 'about', 'builds.html': 'builds', 'privacy.html': 'privacy', 'status.html': 'status',
    'projects/off-grid-ai-homestead.html': 'acre', 'projects/terminal-portfolio-website.html': 'portfolio'
  }[location.pathname.replace(/^\/(nl|de|fr|es|it|pt|lt)(\/|$)/, '/').replace(/^\//, '')];
  const PAGE = (PAGE_KEY && t.pages[PAGE_KEY]) || {};
  let PAGE_NAMES = {
    'index.html': 'home', 'projects/second-audience.html': 'second audience',
    'projects/ai-sales-deal-intelligence.html': 'five', 'projects/off-grid-ai-homestead.html': 'one acre',
    'projects/terminal-portfolio-website.html': 'portfolio', 'projects/agent-fritz.html': 'agent fritz'
  };

  // --- state ---------------------------------------------------------
  let state = { open: false, items: [], history: [], tipped: false };
  try {
    let saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (saved && Array.isArray(saved.items) && Array.isArray(saved.history)) { state = saved; }
  } catch (e) { /* storage blocked: the chat still works, it just forgets */ }
  function save() {
    try {
      state.items = state.items.slice(-40);
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }

  // --- tiny DOM helpers ------------------------------------------------
  function el(tag, cls, text) {
    let n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (text != null) { n.textContent = text; }
    return n;
  }
  function svgPaw() {
    let NS = 'http://www.w3.org/2000/svg';
    let s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'fritz-paw'); s.setAttribute('aria-hidden', 'true');
    [['ellipse', { cx: 12, cy: 16.2, rx: 5.2, ry: 4.3 }], ['circle', { cx: 5.8, cy: 10.6, r: 2 }],
     ['circle', { cx: 9.4, cy: 6.6, r: 2.15 }], ['circle', { cx: 14.6, cy: 6.6, r: 2.15 }], ['circle', { cx: 18.2, cy: 10.6, r: 2 }]]
      .forEach(function (d) {
        let c = document.createElementNS(NS, d[0]);
        Object.keys(d[1]).forEach(function (k) { c.setAttribute(k, d[1][k]); });
        s.appendChild(c);
      });
    return s;
  }

  // Minimal markdown: paragraphs, lists, **bold**, `code`, and links that
  // stay on this site. Built node by node; model text never becomes HTML.
  let LIST_RE = /^\s*(?:[-*•]|\d+[.)])\s+/;
  function renderText(text, parent) {
    let blocks = text.replace(/\r/g, '').replace(/ +,/g, ',').split(/\n{2,}/);
    blocks.forEach(function (block) {
      let lines = block.split('\n');
      let list = null, para = null;
      lines.forEach(function (line) {
        if (!line.trim()) { return; }
        if (LIST_RE.test(line)) {
          para = null;
          if (!list) { list = el(/^\s*\d/.test(line) ? 'ol' : 'ul'); parent.appendChild(list); }
          let li = el('li'); inline(line.replace(LIST_RE, ''), li); list.appendChild(li);
        } else {
          list = null;
          if (!para) { para = el('p'); parent.appendChild(para); } else { para.appendChild(el('br')); }
          inline(line, para);
        }
      });
    });
  }
  let INLINE_RE = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|(info@meihuizen\.ai)/g;
  function safeHref(url) {
    if (/^https:\/\/(www\.)?meihuizen\.ai(\/|$)/.test(url)) { return url; }
    if (/^\/(?!\/)/.test(url)) { return url; }
    return null;
  }
  function inline(s, parent) {
    let last = 0, m;
    INLINE_RE.lastIndex = 0;
    while ((m = INLINE_RE.exec(s))) {
      if (m.index > last) { parent.appendChild(document.createTextNode(s.slice(last, m.index))); }
      if (m[1]) { parent.appendChild(el('strong', null, m[1])); }
      else if (m[2]) { parent.appendChild(el('code', null, m[2])); }
      else if (m[3]) {
        let href = safeHref(m[4]);
        if (href) { let a = el('a', null, m[3]); a.href = href; parent.appendChild(a); }
        else { parent.appendChild(document.createTextNode(m[3])); }
      } else if (m[5]) { let mail = el('a', null, m[5]); mail.href = 'mailto:' + m[5]; parent.appendChild(mail); }
      last = INLINE_RE.lastIndex;
    }
    if (last < s.length) { parent.appendChild(document.createTextNode(s.slice(last))); }
  }

  // --- build ------------------------------------------------------------
  let root, panel, log, form, input, sendBtn, suggest, count, status, launch, tip, live;
  let busy = false, spinTimer = null, spinFrame = 0, pagesCount = null;

  function build() {
    root = el('div', 'fritz');
    root.setAttribute('data-nosnippet', '');

    launch = el('button', 'fritz-launch');
    launch.type = 'button';
    launch.setAttribute('aria-label', t.open);
    launch.setAttribute('aria-haspopup', 'dialog');
    launch.setAttribute('aria-expanded', 'false');
    launch.appendChild(svgPaw());
    let lab = el('span');
    lab.appendChild(el('span', 'fritz-prompt', '~/'));
    lab.appendChild(document.createTextNode(t.launch));
    launch.appendChild(lab);
    launch.appendChild(el('span', 'fritz-live'));
    launch.addEventListener('click', function () { setOpen(true); });

    tip = el('div', 'fritz-tip', t.tip);
    tip.setAttribute('aria-hidden', 'true');

    panel = el('section', 'fritz-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Agent Fritz');

    let bar = el('div', 'fritz-bar');
    let dots = el('div', 'fritz-dots'); dots.appendChild(el('i')); dots.appendChild(el('i')); dots.appendChild(el('i'));
    let title = el('div', 'fritz-title');
    title.appendChild(el('b', null, 'fritz'));
    title.appendChild(document.createTextNode('@meihuizen.ai: ~/ask'));
    let resetBtn = el('button', 'fritz-icon-btn', '↺');
    resetBtn.type = 'button'; resetBtn.title = t.reset; resetBtn.setAttribute('aria-label', t.reset);
    resetBtn.addEventListener('click', reset);
    let closeBtn = el('button', 'fritz-icon-btn', '×');
    closeBtn.type = 'button'; closeBtn.title = t.close; closeBtn.setAttribute('aria-label', t.close);
    closeBtn.addEventListener('click', function () { setOpen(false); launch.focus(); });
    bar.appendChild(dots); bar.appendChild(title); bar.appendChild(resetBtn); bar.appendChild(closeBtn);

    status = el('div', 'fritz-status');
    status.appendChild(el('span', 'fritz-live'));
    status.appendChild(el('span', 'fritz-status-text', t.status));

    log = el('div', 'fritz-log');
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'off');
    log.tabIndex = 0;

    suggest = el('div', 'fritz-suggest');
    (PAGE.s || t.suggest).forEach(function (q) {
      let b = el('button', null, q); b.type = 'button';
      b.addEventListener('click', function () { ask(q); });
      suggest.appendChild(b);
    });

    count = el('div', 'fritz-count');

    form = el('form', 'fritz-form');
    form.appendChild(el('span', 'fritz-prompt', '›'));
    input = el('textarea', 'fritz-input');
    input.rows = 1; input.maxLength = MAX_CHARS + 200;
    input.placeholder = t.placeholder;
    input.setAttribute('aria-label', t.placeholder);
    sendBtn = el('button', 'fritz-send', '↵');
    sendBtn.type = 'submit'; sendBtn.setAttribute('aria-label', t.send); sendBtn.title = t.send;
    form.appendChild(input); form.appendChild(sendBtn);
    form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        if (formMode && nextFormLine()) { return; }
        ask(input.value);
      }
    });
    input.addEventListener('input', onType);

    let foot = el('div', 'fritz-foot');
    foot.appendChild(document.createTextNode(t.foot + ' '));
    let how = el('a', null, t.how + ' →'); how.href = PREFIX + 'projects/agent-fritz.html';
    foot.appendChild(how);

    live = el('div', 'fritz-sr');
    live.setAttribute('aria-live', 'polite');

    panel.appendChild(bar); panel.appendChild(status); panel.appendChild(log);
    panel.appendChild(suggest); panel.appendChild(count); panel.appendChild(form); panel.appendChild(foot); panel.appendChild(live);
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setOpen(false); launch.focus(); }
    });

    root.appendChild(tip); root.appendChild(launch); root.appendChild(panel);
    document.body.appendChild(root);
  }

  // --- open / close -------------------------------------------------------
  let booted = false;
  function setOpen(open, quiet) {
    state.open = open;
    root.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('fritz-lock', open);
    launch.setAttribute('aria-expanded', String(open));
    tip.classList.remove('is-shown');
    state.tipped = true;
    save();
    if (open) {
      if (!booted) { booted = true; renderAll(!quiet && state.items.length === 0); }
      // Reopened by a page change: the visitor is reading the new page, so
      // the caret stays where it was instead of jumping into the chat.
      if (!quiet) { setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }, 60); }
    }
  }

  function reset() {
    if (busy) { return; }
    state.items = []; state.history = [];
    // A fresh conversation starts with an empty input, not with a scan form
    // left over from the one before.
    input.value = ''; formMode = false; onType();
    save();
    renderAll(false);
    input.focus();
  }

  // --- rendering ------------------------------------------------------------
  function bootBlock(animate) {
    let box = el('div', 'fritz-boot');
    let lines = [['cmd', 'fritz --grounded --site meihuizen.ai']];
    t.boot.forEach(function (l, i) {
      if (i === 0) {
        if (pagesCount) { lines.push(['ok', l.replace('{n}', pagesCount)]); }
      } else { lines.push(['ok', l]); }
    });
    lines.push(['ready', PAGE.ready || t.ready]);
    let reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!animate || reduce) {
      lines.forEach(function (l) { box.appendChild(el('div', l[0], l[1])); });
      return box;
    }
    // Typed out once, the first time the window opens in a session.
    let i = 0;
    (function next() {
      if (i >= lines.length) { return; }
      let line = el('div', lines[i][0], '');
      box.appendChild(line);
      let full = lines[i][1], c = 0, step = lines[i][0] === 'cmd' ? 1 : 3;
      (function type() {
        c += step;
        line.textContent = full.slice(0, c);
        if (c < full.length) { setTimeout(type, 14); } else { i++; setTimeout(next, 90); }
        scrollDown();
      })();
    })();
    return box;
  }

  function renderAll(animateBoot) {
    log.textContent = '';
    log.appendChild(bootBlock(animateBoot));
    state.items.forEach(function (item, i) { log.appendChild(renderItem(item, false, i === state.items.length - 1)); });
    suggest.hidden = state.items.length > 0;
    scrollDown(true);
  }

  function renderItem(item, streaming, isLast) {
    if (item.type === 'user') {
      let u = el('div', 'fritz-msg user');
      u.appendChild(el('div', 'fritz-who', t.you + ' ›'));
      u.appendChild(el('div', 'fritz-body', item.text));
      return u;
    }
    if (item.type === 'error') {
      return el('div', 'fritz-error', t.err[item.code] || t.err.upstream);
    }
    let b = el('div', 'fritz-msg bot');
    fillBot(b, item, streaming, isLast);
    return b;
  }

  // A quote links to the English page it came from, scrolled to and
  // highlighted: browsers that support text fragments mark the sentence.
  function proofHref(page, quote) {
    const words = quote.replace(/[.,;:]+$/, '').split(/\s+/);
    const enc = function (x) { return encodeURIComponent(x).replace(/-/g, '%2D').replace(/,/g, '%2C'); };
    const frag = words.length > 12
      ? enc(words.slice(0, 5).join(' ')) + ',' + enc(words.slice(-4).join(' '))
      : enc(words.join(' '));
    return '/' + (page === 'index.html' ? '' : page) + '#:~:text=' + frag;
  }

  function fillBot(node, item, streaming, isLast) {
    node.textContent = '';
    node.appendChild(el('div', 'fritz-who', 'fritz ›'));
    let steps = null, lastText = null;
    item.segs.forEach(function (seg) {
      if (seg.kind === 'step') {
        if (!steps) { steps = el('div', 'fritz-steps'); node.appendChild(steps); }
        let row = el('div', 'fritz-step ' + (seg.status === 'run' ? 'run' : seg.ok ? 'done' : 'miss'));
        row.appendChild(el('span', 'glyph', seg.status === 'run' ? SPIN[spinFrame] : seg.ok ? '✓' : '✗'));
        row.appendChild(el('span', 'tool', seg.tool));
        let arg = seg.arg || '';
        if (seg.status !== 'run' && !seg.ok && seg.tool === 'read_page') { arg = (arg ? arg + ' · ' : '') + t.miss; }
        row.appendChild(el('span', 'arg', arg));
        if (seg.ms != null) { row.appendChild(el('span', 'ms', (seg.ms / 1000).toFixed(1) + 's')); }
        steps.appendChild(row);
      } else {
        steps = null;
        lastText = el('div', 'fritz-text');
        renderText(seg.text, lastText);
        node.appendChild(lastText);
      }
    });
    let last = item.segs[item.segs.length - 1];
    if (streaming) {
      if (!last || last.kind === 'step') {
        let th = el('div', 'fritz-thinking');
        th.appendChild(el('span', 'glyph', SPIN[spinFrame]));
        th.appendChild(document.createTextNode(t.thinking));
        node.appendChild(th);
      } else if (lastText) {
        let tail = lastText.lastElementChild || lastText;
        if (tail.tagName === 'UL' || tail.tagName === 'OL') { tail = tail.lastElementChild || tail; }
        tail.appendChild(el('span', 'fritz-caret'));
      }
    }
    if (item.action) {
      let card = el('div', 'fritz-action');
      let at = T[item.action.lang] || t;
      if (item.action.type === 'contact_requested') {
        card.appendChild(el('b', null, '✓ ' + at.contact[0]));
        card.appendChild(el('span', null, item.action.confirm === false || !at.contact[2] ? at.contact[1] : at.contact[1] + ' ' + at.contact[2]));
      } else {
        card.appendChild(el('b', null, '✓ ' + at.scan[0] + ' · ' + item.action.domain));
        card.appendChild(el('span', null, at.scan[1]));
      }
      // Nico's Proton booking page, straight after the lead is captured:
      // who and why first, the calendar second.
      if (item.action.booking && /^https:\/\/calendar\.proton\.me\/bookings/.test(item.action.booking)) {
        let bk = el('a', 'fritz-book', at.book);
        bk.href = item.action.booking; bk.target = '_blank'; bk.rel = 'noopener';
        card.appendChild(bk);
      }
      node.appendChild(card);
    }
    if (!streaming && item.sources && item.sources.length) {
      let src = el('div', 'fritz-sources');
      src.appendChild(el('span', null, t.sources + ':'));
      item.sources.forEach(function (p) {
        let a = el('a', null, PAGE_NAMES[p] || p.replace(/^.*\//, '').replace(/\.html$/, '').replace(/-/g, ' '));
        a.href = PREFIX + (p === 'index.html' ? '' : p);
        src.appendChild(a);
      });
      if (item.evidence && item.evidence.length) {
        let tog = el('button', 'fritz-proof-toggle', (item.showProof ? '▾ ' : '▸ ') + (item.showProof ? t.proof[1] : t.proof[0]));
        tog.type = 'button';
        tog.setAttribute('aria-expanded', String(!!item.showProof));
        tog.addEventListener('click', function () { item.showProof = !item.showProof; save(); fillBot(node, item, false, isLast); });
        src.appendChild(tog);
      }
      node.appendChild(src);
    }
    if (!streaming && item.showProof && item.evidence && item.evidence.length) {
      let proof = el('div', 'fritz-proof');
      item.evidence.forEach(function (ev) {
        let q = el('a', 'fritz-quote');
        q.href = proofHref(ev.page, ev.quote);
        q.appendChild(el('mark', null, '\u201c' + ev.quote + '\u201d'));
        proof.appendChild(q);
        let meta = el('div', 'fritz-quote-meta', (PAGE_NAMES[ev.page] || ev.page.replace(/^.*\//, '').replace(/\.html$/, '').replace(/-/g, ' ')) + (t.proof[2] ? ' · ' + t.proof[2] : ''));
        proof.appendChild(meta);
      });
      node.appendChild(proof);
    }
    if (!streaming && isLast && item.next && item.next.length) {
      let nx = el('div', 'fritz-next');
      item.next.forEach(function (q) {
        let b = el('button', null, q); b.type = 'button';
        b.addEventListener('click', function () { ask(q); });
        nx.appendChild(b);
      });
      node.appendChild(nx);
    }
  }

  function scrollDown(force) {
    let near = log.scrollHeight - log.scrollTop - log.clientHeight < 120;
    if (force || near) { log.scrollTop = log.scrollHeight; }
  }

  function onType() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 110) + 'px';
    let n = input.value.length;
    count.textContent = n > MAX_CHARS - 200 ? n + ' / ' + MAX_CHARS : '';
    count.classList.toggle('warn', n > MAX_CHARS);
  }

  // The scan form lives in the input itself: one line per field, caret on
  // the first. Enter moves to the next line instead of sending, until the
  // last line, so nobody sends a half-filled form by habit.
  let formMode = false;
  function fillForm(kind, lt) {
    lt = lt || t;
    // Contact details are asked for in plain words: the visitor types a name
    // and an email or phone however they like, Fritz reads it back.
    if (kind === 'contact') {
      input.placeholder = lt.contactHint || t.placeholder;
      input.focus();
      return;
    }
    const fields = kind === 'contact' ? lt.contactForm : lt.scanForm;
    input.value = fields.map(function (l) { return l + ' '; }).join('\n');
    formMode = true;
    onType();
    const firstEnd = fields[0].length + 1;
    input.focus();
    input.setSelectionRange(firstEnd, firstEnd);
  }
  function nextFormLine() {
    const v = input.value;
    const pos = input.selectionStart;
    const nl = v.indexOf('\n', pos);
    if (nl === -1) { return false; }
    const end = v.indexOf('\n', nl + 1);
    const target = end === -1 ? v.length : end;
    input.setSelectionRange(target, target);
    return true;
  }

  function setBusy(on) {
    busy = on;
    sendBtn.disabled = on;
    clearInterval(spinTimer);
    if (on) {
      spinTimer = setInterval(function () {
        spinFrame = (spinFrame + 1) % SPIN.length;
        let g = log.querySelectorAll('.fritz-step.run .glyph, .fritz-thinking .glyph');
        for (let i = 0; i < g.length; i++) { g[i].textContent = SPIN[spinFrame]; }
      }, 80);
    }
  }

  function setDown(down) {
    status.classList.toggle('is-down', down);
    status.lastChild.textContent = down ? t.down : t.status;
  }

  // --- the conversation --------------------------------------------------------
  function ask(raw) {
    let q = (raw || '').trim();
    if (!q || busy) { return; }
    if (q.length > MAX_CHARS) { onType(); return; }
    input.value = ''; formMode = false; onType();
    input.placeholder = t.placeholder;
    suggest.hidden = true;

    let userItem = { type: 'user', text: q };
    state.items.push(userItem);
    log.appendChild(renderItem(userItem));
    state.history.push({ role: 'user', content: q });
    while (state.history.length > MAX_HISTORY) { state.history.splice(0, 2); }

    let bot = { type: 'bot', segs: [], sources: [], action: null, evidence: [], next: [] };
    // Only the newest answer offers follow-up questions.
    Array.prototype.forEach.call(log.querySelectorAll('.fritz-next'), function (n) { n.remove(); });
    let node = renderItem(bot, true);
    log.appendChild(node);
    scrollDown(true);
    setBusy(true);
    save();

    let queued = false;
    let pendingForm = false;
    let formT = t;
    function paint() {
      if (queued) { return; }
      queued = true;
      requestAnimationFrame(function () { queued = false; fillBot(node, bot, busy, true); scrollDown(); });
    }

    function handle(event, data) {
      if (event === 'text') {
        let last = bot.segs[bot.segs.length - 1];
        if (last && last.kind === 'text') { last.text += data.t; } else { bot.segs.push({ kind: 'text', text: data.t }); }
      } else if (event === 'step') {
        if (data.status === 'start') {
          bot.segs.push({ kind: 'step', id: data.id, tool: data.tool, status: 'run', t0: Date.now() });
        } else {
          for (let i = 0; i < bot.segs.length; i++) {
            let s = bot.segs[i];
            if (s.kind === 'step' && s.id === data.id) {
              s.status = 'done'; s.ok = !!data.ok; s.ms = Date.now() - (s.t0 || Date.now()); delete s.t0;
              s.arg = data.paths ? data.paths.join(', ') : data.domain || '';
            }
          }
        }
      } else if (event === 'sources') {
        bot.sources = data.pages || [];
      } else if (event === 'form') {
        // In the language Fritz is replying in, which is not always the
        // page's: a Dutch visitor on an English page gets a Dutch form.
        pendingForm = data.type === 'contact' ? 'contact' : 'scan';
        formT = T[data.lang] || t;
        bot.segs.push({ kind: 'text', text: pendingForm === 'contact' ? ((formT.contactIntros || {})[data.reason] || formT.contactIntro) : formT.scanIntro });
      } else if (event === 'evidence') {
        bot.evidence = data.items || [];
      } else if (event === 'next') {
        bot.next = data.questions || [];
      } else if (event === 'action') {
        bot.action = { type: data.type, domain: data.domain, booking: data.booking || null, lang: T[data.lang] ? data.lang : null, confirm: data.confirm !== false };
      } else if (event === 'error') {
        throw new Error(data.code || 'upstream');
      }
      paint();
    }

    stream(handle).then(function () {
      let answer = bot.segs.filter(function (s) { return s.kind === 'text'; })
        .map(function (s) { return s.text.trim(); }).join('\n\n').trim();
      if (!answer) { throw new Error('upstream'); }
      bot.segs.forEach(function (s) { delete s.id; });
      state.items.push(bot);
      state.history.push({ role: 'assistant', content: answer });
      setDown(false);
      live.textContent = answer;
      if (pendingForm) { fillForm(pendingForm, formT); }
    }).catch(function (err) {
      let code = String(err && err.message || 'network');
      if (!t.err[code]) { code = 'network'; }
      state.history.pop();
      if (bot.segs.some(function (s) { return s.kind === 'text'; })) { state.items.push(bot); } else { node.remove(); }
      let errItem = { type: 'error', code: code };
      state.items.push(errItem);
      log.appendChild(renderItem(errItem));
      if (code === 'offline') { setDown(true); }
      if (!input.value) { input.value = q; onType(); }
      live.textContent = t.err[code];
    }).then(function () {
      setBusy(false);
      if (node.isConnected) { fillBot(node, bot, false, true); }
      save();
      scrollDown();
    });

    function stream(onEvent) {
      return fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.history, lang: LANG, page: location.pathname,
          browserLang: (navigator.language || '').slice(0, 2).toLowerCase(),
          // Lets Fritz say "09:00 your time" instead of making the visitor convert from Kaunas.
          tz: (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || null; } catch (e) { return null; } })(),
          // The history sent is capped, so an offer made ten questions ago
          // falls out of it. The window keeps the whole conversation and
          // says so outright.
          scanOffered: state.items.some(function (it) {
            return it.type === 'bot' && it.segs.some(function (sg) { return sg.kind === 'text' && /\?\s*$/.test(sg.text.trim()) && /scan|análise|escaneo|scansione|patikrinim/i.test(sg.text.trim().split(/\n/).pop()); });
          }),
          scanDone: state.items.some(function (it) { return it.type === 'bot' && !!it.action && it.action.type !== 'contact_requested'; })
        })
      }).then(function (res) {
        if (!res.ok) {
          return res.json().catch(function () { return {}; }).then(function (j) {
            let map = { offline: 'offline', rate: 'rate', input: 'input' };
            throw new Error(map[j.error] || (res.status === 429 ? 'rate' : 'upstream'));
          });
        }
        let reader = res.body.getReader();
        let decoder = new TextDecoder();
        let buffer = '';
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) { return; }
            buffer += decoder.decode(r.value, { stream: true });
            let cut;
            while ((cut = buffer.indexOf('\n\n')) !== -1) {
              let frame = buffer.slice(0, cut);
              buffer = buffer.slice(cut + 2);
              let ev = 'message', data = '';
              frame.split('\n').forEach(function (line) {
                if (line.indexOf('event:') === 0) { ev = line.slice(6).trim(); }
                else if (line.indexOf('data:') === 0) { data += line.slice(5).trim(); }
              });
              if (data) { onEvent(ev, JSON.parse(data)); }
            }
            return pump();
          });
        }
        return pump();
      }, function () {
        // The browser cannot tell a dead connection from a server that is not
        // answering (a missing route fails the same way). Only blame the
        // visitor's connection when the browser says it is actually offline.
        throw new Error(navigator.onLine === false ? 'network' : 'offline');
      });
    }
  }

  // --- start -----------------------------------------------------------------
  function start() {
    build();
    // Anything on a page marked data-fritz-ask opens Fritz and asks that
    // question: the project page uses it for its "try it" buttons.
    document.addEventListener('click', function (e) {
      const trigger = e.target.closest && e.target.closest('[data-fritz-ask]');
      if (!trigger) { return; }
      e.preventDefault();
      setOpen(true);
      ask(trigger.getAttribute('data-fritz-ask'));
    });
    // Page count for the boot line, from the same file Fritz answers from.
    fetch('/ask/knowledge.json').then(function (r) { return r.ok ? r.json() : null; })
      .then(function (k) { if (k && k.pages) { pagesCount = k.pages.length; } }).catch(function () {});
    // The conversation survives a page change, and so does an open window,
    // until the visitor closes it. Except on a phone or a short window, where
    // the chat covers the whole page someone just navigated to: there it
    // waits closed, with the conversation intact, one tap away.
    const wasOpen = state.open;
    const small = window.matchMedia && window.matchMedia('(max-width: 600px), (max-height: 500px)').matches;
    state.open = false;
    if (wasOpen && !small) { setOpen(true, true); }
    if (!state.tipped) {
      setTimeout(function () {
        if (state.open || state.tipped) { return; }
        tip.classList.add('is-shown');
        setTimeout(function () { tip.classList.remove('is-shown'); }, 7000);
        state.tipped = true; save();
      }, 5000);
    }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
