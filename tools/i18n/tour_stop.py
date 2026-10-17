"""Contact page: card 1 takes the booking text, card 2 becomes 'request a tour stop'
with the 2027 dates as a roll-up of city buttons that open Fritz. Tour page: each
leg's 'request a stop' link opens Fritz the same way. All 8 languages.
Run once from the repo root: python tools/i18n/tour_stop.py
"""
import re, os, html

DOCS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'docs')
LEGS = [['Milano', 'Roma'], ['Barcelona', 'Madrid'], ['Lyon', 'Paris'], ['Porto', 'Lisboa'], ['Berlin', 'Vilnius', 'Kaunas']]

T = {
 'en': dict(or_='or', label='02 · on tour', h3='Request a tour stop', body='Pick a city and Fritz takes the request: where, when, and how to reach you.', summary='the 2027 dates', link='see the tour →',
   m=['feb · mar', 'apr · may', 'jun · jul', 'sep · oct', 'nov · dec'],
   when=['February or March 2027', 'April or May 2027', 'June or July 2027', 'September or October 2027', 'November or December 2027'],
   user="I'd like a tour stop in {city}.",
   say="Good choice. The band is in {city} in {when}. Send me where you are (address or area), the dates that suit you, your name and an email or phone, and I'll pass it straight to the frontman.",
   hint='Address or area, dates, name, email or phone'),
 'nl': dict(or_='of', label='02 · op tour', h3='Vraag een tourstop aan', body='Kies een stad en Fritz neemt de aanvraag op: waar, wanneer en hoe we u bereiken.', summary='de data van 2027', link='naar de tour →',
   m=['feb · mrt', 'apr · mei', 'jun · jul', 'sep · okt', 'nov · dec'],
   when=['februari of maart 2027', 'april of mei 2027', 'juni of juli 2027', 'september of oktober 2027', 'november of december 2027'],
   user='Ik wil graag een tourstop in {city}.',
   say='Goede keuze. De band is in {city} in {when}. Stuur me waar u zit (adres of regio), de data die u passen, uw naam en een e-mailadres of telefoonnummer, dan geef ik het meteen door aan de frontman.',
   hint='Adres of regio, data, naam, e-mail of telefoon'),
 'de': dict(or_='oder', label='02 · auf Tour', h3='Tourstopp anfragen', body='Wählen Sie eine Stadt, Fritz nimmt die Anfrage auf: wo, wann und wie wir Sie erreichen.', summary='die Termine 2027', link='zur Tour →',
   m=['Feb · Mär', 'Apr · Mai', 'Jun · Jul', 'Sep · Okt', 'Nov · Dez'],
   when=['Februar oder März 2027', 'April oder Mai 2027', 'Juni oder Juli 2027', 'September oder Oktober 2027', 'November oder Dezember 2027'],
   user='Ich hätte gern einen Tourstopp in {city}.',
   say='Gute Wahl. Die Band ist im {when} in {city}. Schicken Sie mir, wo Sie sind (Adresse oder Gegend), Ihre Wunschtermine, Ihren Namen und eine E-Mail oder Telefonnummer, dann gebe ich es sofort an den Frontmann weiter.',
   hint='Adresse oder Gegend, Termine, Name, E-Mail oder Telefon'),
 'fr': dict(or_='ou', label='02 · en tournée', h3='Demander une étape', body='Choisissez une ville, Fritz prend la demande : où, quand et comment vous joindre.', summary='les dates 2027', link='voir la tournée →',
   m=['févr. · mars', 'avr. · mai', 'juin · juil.', 'sept. · oct.', 'nov. · déc.'],
   when=['février ou mars 2027', 'avril ou mai 2027', 'juin ou juillet 2027', 'septembre ou octobre 2027', 'novembre ou décembre 2027'],
   user='J’aimerais une étape à {city}.',
   say='Bon choix. Le groupe passe à {city} en {when}. Envoyez-moi où vous êtes (adresse ou secteur), les dates qui vous conviennent, votre nom et un e-mail ou un téléphone, et je transmets tout de suite au leader du groupe.',
   hint='Adresse ou secteur, dates, nom, e-mail ou téléphone'),
 'it': dict(or_='o', label='02 · in tour', h3='Chiedi una tappa', body='Scegli una città e Fritz prende la richiesta: dove, quando e come contattarti.', summary='le date del 2027', link='vai al tour →',
   m=['feb · mar', 'apr · mag', 'giu · lug', 'set · ott', 'nov · dic'],
   when=['febbraio e marzo 2027', 'aprile e maggio 2027', 'giugno e luglio 2027', 'settembre e ottobre 2027', 'novembre e dicembre 2027'],
   user='Vorrei una tappa a {city}.',
   say='Ottima scelta. La band è a {city} tra {when}. Mandami dove ti trovi (indirizzo o zona), le date che ti vanno bene, il tuo nome e un’email o un telefono, e lo passo subito al frontman.',
   hint='Indirizzo o zona, date, nome, email o telefono'),
 'es': dict(or_='o', label='02 · de gira', h3='Solicite una parada', body='Elija una ciudad y Fritz toma la solicitud: dónde, cuándo y cómo contactarle.', summary='las fechas de 2027', link='ver la gira →',
   m=['feb · mar', 'abr · may', 'jun · jul', 'sep · oct', 'nov · dic'],
   when=['febrero o marzo de 2027', 'abril o mayo de 2027', 'junio o julio de 2027', 'septiembre u octubre de 2027', 'noviembre o diciembre de 2027'],
   user='Quiero una parada en {city}.',
   say='Buena elección. El grupo estará en {city} en {when}. Envíeme dónde está (dirección o zona), las fechas que le vienen bien, su nombre y un correo o teléfono, y se lo paso enseguida al líder del grupo.',
   hint='Dirección o zona, fechas, nombre, correo o teléfono'),
 'pt': dict(or_='ou', label='02 · em digressão', h3='Peça uma paragem', body='Escolha uma cidade e o Fritz regista o pedido: onde, quando e como o contactar.', summary='as datas de 2027', link='ver a digressão →',
   m=['fev · mar', 'abr · mai', 'jun · jul', 'set · out', 'nov · dez'],
   when=['fevereiro ou março de 2027', 'abril ou maio de 2027', 'junho ou julho de 2027', 'setembro ou outubro de 2027', 'novembro ou dezembro de 2027'],
   user='Gostaria de uma paragem em {city}.',
   say='Boa escolha. A banda está em {city} em {when}. Envie-me onde está (morada ou zona), as datas que lhe convêm, o seu nome e um email ou telefone, e passo já o pedido ao líder da banda.',
   hint='Morada ou zona, datas, nome, email ou telefone'),
 'lt': dict(or_='arba', label='02 · ture', h3='Užsisakykite sustojimą', body='Pasirinkite miestą, ir Fritz priims užklausą: kur, kada ir kaip su jumis susisiekti.', summary='2027 m. datos', link='į turą →',
   m=['vas · kov', 'bal · geg', 'bir · lie', 'rgs · spa', 'lap · grd'],
   when=['2027 m. vasaris arba kovas', '2027 m. balandis arba gegužė', '2027 m. birželis arba liepa', '2027 m. rugsėjis arba spalis', '2027 m. lapkritis arba gruodis'],
   user='Norėčiau sustojimo: {city}.',
   say='Puikus pasirinkimas. Grupė atvyksta: {city}, {when}. Atsiųskite, kur esate (adresas ar rajonas), jums tinkamas datas, savo vardą ir el. paštą ar telefoną, ir aš iškart perduosiu tai grupės lyderiui.',
   hint='Adresas ar rajonas, datos, vardas, el. paštas ar telefonas'),
}

def a(s):
    return html.escape(s, quote=True)

def stop_attrs(t):
    return 'data-stop-user="%s" data-stop-say="%s" data-stop-hint="%s"' % (a(t['user']), a(t['say']), a(t['hint']))

def contact(lang):
    t = T[lang]
    f = os.path.join(DOCS, 'contact.html' if lang == 'en' else lang + '/contact.html')
    s = open(f, encoding='utf-8').read()
    # card 2 as it is now
    m = re.search(r'    <button type="button" class="card" style="text-align:left;font:inherit;color:inherit;cursor:pointer;display:flex;flex-direction:column;border-color:var\(--accent\)" data-fritz-ask="[^"]*">\n(.*?)\n    </button>\n', s, re.S)
    assert m, f
    booking = re.search(r'<span class="muted" style="font-size:15px;flex:1">(.*?)</span>', m.group(1)).group(1)
    # card 1 takes the booking text
    c1 = re.search(r'(<span style="color:var\(--t-muted\);font-size:15px;flex:1">)(.*?)(</span>)', s)
    assert c1, f
    s = s[:c1.start(2)] + booking + s[c1.end(2):]
    m = re.search(r'    <button type="button" class="card" style="text-align:left;font:inherit;color:inherit;cursor:pointer;display:flex;flex-direction:column;border-color:var\(--accent\)" data-fritz-ask="[^"]*">\n(.*?)\n    </button>\n', s, re.S)
    rows = ''.join('          <li><span class="stop-m">%s</span>%s</li>\n' % (
        t['m'][i], ''.join('<button type="button" data-fritz-stop="%s" data-when="%s">%s</button>' % (c, a(t['when'][i]), c) for c in leg))
        for i, leg in enumerate(LEGS))
    card = ('    <div class="card stop-pick" style="display:flex;flex-direction:column;border-color:var(--accent)" %s>\n'
            '      <span class="mono" style="font-size:12px;color:var(--accent2)">%s</span>\n'
            '      <span class="h3" style="display:block;margin-top:10px">%s</span>\n'
            '      <span class="muted" style="font-size:15px">%s</span>\n'
            '      <details class="stop-roll">\n        <summary>%s</summary>\n        <ul class="stop-list">\n%s        </ul>\n      </details>\n'
            '      <a class="mono" href="tour.html" style="margin-top:auto;padding-top:18px;font-size:13px;color:var(--accent)">%s</a>\n'
            '    </div>\n') % (stop_attrs(t), t['label'], t['h3'], t['body'], t['summary'], rows, t['link'])
    s = s[:m.start()] + card + s[m.end():]
    open(f, 'w', encoding='utf-8', newline='\n').write(s)

def tour(lang):
    t = T[lang]
    f = os.path.join(DOCS, 'tour.html' if lang == 'en' else lang + '/tour.html')
    s = open(f, encoding='utf-8').read()
    s = s.replace('<ol class="legs" data-tour-legs ', '<ol class="legs" data-tour-legs %s ' % stop_attrs(t), 1)
    for i, leg in enumerate(LEGS):
        city = (' %s ' % t['or_']).join(leg) if len(leg) == 2 else ', '.join(leg[:-1]) + ' %s ' % t['or_'] + leg[-1]
        n = s.count('<a class="leg-go" href="')
        s = re.sub(r'<a class="leg-go" href="([^"]*)">', lambda m: '<a class="leg-go" href="%s" data-fritz-stop="%s" data-when="%s">' % (m.group(1), a(city), a(t['when'][i])), s, count=1)
        # mark this one done so the next leg takes the next link
        s = s.replace('<a class="leg-go" href=', '<a class="leg-go-done" href=', 1)
    s = s.replace('<a class="leg-go-done" href=', '<a class="leg-go" href=')
    open(f, 'w', encoding='utf-8', newline='\n').write(s)

for lang in T:
    contact(lang)
    tour(lang)
print('ok')
