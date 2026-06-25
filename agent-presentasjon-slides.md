# Sånn jobber jeg med agenter
### Slide-manus — manus, slide-tekst og illustrasjon per slide

Illustrasjonene er rangert etter innsats: 🟢 nesten gratis · 🟡 litt jobb · 🔴 unngå (krever tegning).
Ryggraden er ekte skjermbilder og opptak — lettest å lage *og* mest overbevisende for et «sånn jobber jeg»-foredrag.

---

## Slide 1 — Tittel

**Slide-tekst:** «Sånn jobber jeg med agenter»
*Undertittel: et innblikk, ikke en oppskrift*

**Manus:** «Jeg er ikke markedsfører, så jeg skal ikke fortelle dere hvordan dere bør gjøre jobben deres. Jeg ble bedt om å gi et innblikk i hvordan jeg jobber — så får dere selv trekke koblingene til deres hverdag. Mye av det jeg viser handler om kode, men grepene under er de samme uansett hva slags filer du jobber med.»

**Illustrasjon:** 🟢 Ren typografi-slide. Stor tittel, dempet undertittel. Ingen bilde nødvendig — la tittelen puste.

---

## Slide 2 — Chat vs. agent

**Slide-tekst:** «Spørre vs. delegere»

**Manus:** «De fleste har prøvd AI som en chat på en nettside — du spør, den svarer med tekst. Det vi bruker er noe annet: en agent, som Claude Code eller Google Antigravity. Forskjellen er at en agent kan *bruke verktøy*. Den leser og skriver filer rett på maskina di, kjører ting, åpner nettleseren, tar skjermbilde. Den gir deg ikke bare et svar — den gjør jobben.»

**Illustrasjon:** 🟢 To skjermbilder side om side: venstre = en vanlig chat-boble (claude.ai), høyre = et terminalvindu midt i en agent-kjøring der den leser/skriver filer. Begge har du på maskina allerede — bare ta to screenshots. Kontrasten gjør hele jobben.

---

## Slide 3 — Loopen

**Slide-tekst:** «Den jobber til den er ferdig»

**Manus:** «Det som gjør en agent til en agent, er at den kjører i en loop. Den planlegger, gjør et kall — søker på nett, leser en fil på maskina, spør deg om noe — ser på resultatet, justerer, og gjentar. Den stopper ikke etter første svar; den jobber seg gjennom oppgaven, sjekker sitt eget arbeid, og avslutter først når den er i mål.»

**Illustrasjon:** 🟡 Enkel sirkel-loop med fire ord: Planlegg → Handle → Verifiser → (tilbake), med en «ferdig»-pil ut. Lett å lage med fire tekstbokser og piler i Keynote/Figma — ingen tegning. *Alternativ 🟢:* bare de fire ordene som stor tekst på rad med piler imellom.

---

## Slide 4 — Den jobber med filene dine

**Slide-tekst:** «På dine egne filer»

**Manus:** «At agenten har tilgang til filsystemet er åpenbart nyttig for kode — men det er like nyttig for helt vanlige filer. Word, Excel, CSV, PDF, bilder. Du peker på filer som allerede ligger på maskina, beskriver hva du vil ha ut, og agenten gjør mellomstegene. Og en fin detalj: under panseret skriver den ofte litt kode for å løse oppgaven — det skjer skjult for deg. Men ber du om å få selve skriptet, så du kan kjøre det igjen neste gang, får du det også.»

**Illustrasjon:** 🟢 Skjermbilde av en helt vanlig mappe i Finder/Utforsker full av blanda filtyper (xlsx, pdf, png, docx). Det er det publikum kjenner igjen fra sin egen maskin.

---

## Slide 5 — Cowork: inngangen uten terminal

**Slide-tekst:** «Uten å røre terminalen»

**Manus:** «Claude Code kjører i en terminal, og det er en barriere for noen. Men inne i Claude Desktop-appen finnes en egen modus som heter Cowork — ved siden av Chat og Code. Den er laget nettopp for å jobbe agentisk med kontorfiler — Word, Excel, PowerPoint, PDF — uten kommandolinje. Samme idé, mykere inngang. Den finnes på både Mac og Windows nå, og krever en betalt plan. Det er trolig der flere av dere ville begynt.»

**Illustrasjon:** 🟢 Skjermbilde av Claude Desktop der de tre fanene Chat / Cowork / Code er synlige øverst, med Cowork valgt. Det viser direkte at det er en modus, ikke en egen app — og avliver forvirringen i samme bilde.

> Faktasjekket: Cowork er en modus i Claude Desktop (ikke egen app), på Mac og Windows, krever betalt plan. Forbeholdet fra forrige utkast er fjernet.

---

## Slide 6 — Den strekker seg ut

**Slide-tekst:** «Den strekker seg ut»

**Manus:** «Til nå har vi snakket om filer på maskina. Men agenten kan også strekke seg ut. MCP — Model Context Protocol — er en standard kobling som lar agenten snakke med tjenester som Gmail, Drive og Slack. Og med Claude in Chrome kan den styre nettleseren toveis: se hva som skjer på skjermen, fylle skjema, trykke knapper — bruke nettsider sånn du gjør.

Tenk deg en markedsplan i Excel — datoer, budsjett, produkt, landingssider — som alt skal punches inn i et system manuelt. I stedet for en hel dag med copy-paste, lar du agenten lese arket og fylle inn for deg.

Den kan til og med fikse småting på selve maskina — installere et program, rydde i innstillinger. Men det er for den trygge og nysgjerrige, med godkjenning på hvert steg: jo mer en endring tar på systemet ditt, jo viktigere er det at du forstår hva du sier ja til.»

**Illustrasjon:** 🟢 Skjermbilde av connectors-/koblinger-panelet i Claude (Gmail, Drive, Slack-ikoner synlige). *Eller* 🟡 ett midt-element med fire tjeneste-ikoner rundt — men screenshot er lettere og mer ekte.

> Faktasjekket: nettleserstyring = Claude in Chrome; koblinger til tjenester = MCP. Maskin-fiksing er bevisst rammet som «krydder, med godkjenning» — ikke en hovedsøyle.

---

## Slide 7 — Fil-flyt: Rydde en kaotisk mappe

**Slide-tekst:** «kampanje_final_FINAL_v3.png»

**Manus:** «La oss gjøre det konkret. Alle har en mappe som ser sånn ut» *(pek på slide-teksten)* «— to hundre filer med navn ingen forstår. I stedet for å døpe om dem én etter én, peker du agenten på mappa og sier: gi alt konsistente navn etter dette mønsteret, og sorter i undermapper. Den leser hver fil, finner ut hva den er, og rydder. Det du ville brukt en formiddag på, tar minutter.»

**Illustrasjon:** 🟢 Før/etter-skjermbilde av en ekte mappe — venstre rotete, høyre ryddig og navngitt. Du lager «rotet» selv på to minutter og tar to screenshots. Mest overbevisende bildet i hele decket fordi det er ekte.

---

## Slide 8 — Fil-flyt: 30 PDF-er → ett regneark

**Slide-tekst:** «30 dokumenter → 1 oversikt»

**Manus:** «Et til: du har en mappe med tretti rapporter, fakturaer eller brief — alle som PDF. Du trenger nøkkeltallene fra hver, samlet ett sted. Du slipper hele mappa inn og ber om én oversiktstabell. Agenten åpner hver PDF, finner det du spurte om, og bygger regnearket. Den typen oppgave som er dødkjedelig manuelt og som ingen liker å gjøre.»

**Illustrasjon:** 🟢 Skjermbilde delt i to: venstre = mappe full av PDF-ikoner, høyre = et rent regneark med rader. Begge er ekte filer du allerede kan lage.

---

## Slide 9 — Fil-flyt: Spør et tungt dokument

**Slide-tekst:** «80 sider → ett svar»

**Manus:** «Og en mange kjenner seg igjen i: en brand guide eller manual på åtti sider som ingen orker å lese. Du kan be agenten lage et ett-siders sammendrag — eller bare stille spørsmål til dokumentet direkte. ‘Hva sier vi om fargebruk på sosiale medier?’ Dokumentet går fra dødt PDF til noe du kan snakke med.»

**Illustrasjon:** 🟢 Skjermbilde av en faktisk chat der du spør et dokument og får et kort, presist svar. Ekte interaksjon > illustrert spørsmålstegn.

---

## Slide 10 — Det forenende grepet

**Slide-tekst:** «Pek. Beskriv utfallet. La den jobbe.»

**Manus:** «Hvis dere skal ta med dere én ting: mønsteret er det samme i alt jeg har vist. Du peker på filer som allerede ligger der. Du beskriver utfallet du vil ha — ikke hvert steg, bare målet. Og du lar agenten gjøre mellomstegene. Det er nøyaktig den samme mentale modellen jeg bruker når jeg koder — bare på filer dere eier. Det er broa over til deres hverdag.»

**Illustrasjon:** 🟢 Ren typografi: de tre setningene i slide-teksten, stor skrift, godt luftet, hver på sin linje. Dette er en «pust»-slide — den skal være enkel.

---

## Slide 11 — Vil du prøve selv?

**Slide-tekst:** «Start her»

**Manus:** «Hvis du vil prøve: den enkleste inngangen er Cowork inne i Claude Desktop — peker du den mot en mappe og beskriver oppgaven, er du i gang, ingen terminal. Vil du kjenne på agent-flyten helt gratis først, finnes kode-orienterte agenter som Google Antigravity eller OpenAI Codex som har gratisnivåer — samme grunnidé, du betaler ingenting for å teste. Og det viktigste: start smått. Ta én kjedelig, repeterende oppgave dere allerede har, og se hva som skjer.»

**Illustrasjon:** 🟢 Ren typografi med tre korte linjer: «Cowork — enklest» / «Gratis å teste: Antigravity, Codex» / «Start med én kjedelig oppgave». *NB i talenotat:* gratisnivåer endrer seg fort (Gemini CLI ble pensjonert i juni) — sjekk status før du nevner et konkret verktøy live.

---

## Notater til deg

- **Tre fil-flyter, ikke flere.** Vil du bytte ut én, er find-and-replace på tvers av mange dokumenter eller batch-bildetilpasning de neste-beste — men hold deg på tre.
- **Skjermopptak-fallback** for alt du kjører live, så et heng ikke dreper momentet.
- **Den eneste illustrasjonstypen som koster deg noe** er loop-sirkelen (slide 3) — alt annet er screenshots eller typografi. Lag den én gang, gjenbruk stilen.
- **Bonus-poeng å lene seg på:** i Anthropics egne tidlige enterprise-utrullinger var det ikke bare utviklere som tok i bruk Cowork — også markedsføring, finans og juss, mest til «bindevev»-arbeidet rundt kjernejobben. Det er argumentet ditt, fra kilden selv.
