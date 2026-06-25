// Manus for alle TTS-klipp. Rediger teksten her og kjør `node generate-tts.js --force`
// for å regenerere lyd (stemme/modell settes i generate-tts.js: Fenrir, trøndersk,
// gemini-3.1-flash-tts-preview). Kjør deretter `python3 transcribe.py` for undertekster.
//
// Rekkefølge følger den lineære fortellingen: Stua → Kontoret → Postrommet → Biblioteket.
// Speilet i manus.md.

export const clips = [
  // ───────────── STUA (start + intro) ─────────────
  {
    name: "stua_intro",
    text: "Velkommen til mitt faglige innslag: Agentisk AI med Rolf. De fleste av oss har brukt AI som en chat på en nettside – du spør, den svarer med tekst. En agent er noe annet. Den kan bruke verktøy: lese og skrive filer rett på maskina di, kjøre ting, åpne nettleseren. Den gir deg ikke bare et svar – den gjør jobben. I dette huset går vi rom for rom og ser hvordan.",
  },
  {
    name: "claude_cowork",
    text: "Claude Code kjører i en terminal, og det er en barriere for noen. Men inne i Claude Desktop finnes en modus som heter Cowork – ved siden av Chat og Code. Den er laget nettopp for å jobbe agentisk med vanlige kontorfiler – Word, Excel, PowerPoint, PDF – uten kommandolinje. Samme idé, mykere inngang. Det er trolig her du ville begynt.",
  },

  // ───────────── KONTORET (på dine filer) ─────────────
  {
    name: "hva_kan_agent_gjoere",
    text: "Tenk deg at du har mange filer med data du vil ut. En utvikler ville skrevet litt kode for å hente og formatere det – men du har kanskje aldri installert Node eller Python. En agent tar hele den biten: den installerer det som trengs, skriver koden, kjører den, og sjekker at resultatet ble riktig. Du peker på filene, beskriver hva du vil ha ut, og lar den gjøre mellomstegene.",
  },
  {
    name: "fil_rydde_mappe",
    text: "Alle har en mappe som ser sånn ut: to hundre filer med navn ingen forstår – kampanje_final_FINAL_v3. I stedet for å døpe om dem én etter én, peker du agenten på mappa og sier: gi alt konsistente navn etter dette mønsteret, og sorter i undermapper. Den leser hver fil, finner ut hva den er, og rydder. Det du ville brukt en formiddag på, tar minutter.",
  },
  {
    name: "fil_pdf_regneark",
    text: "Et til: en mappe med tretti rapporter eller fakturaer, alle som PDF, og du trenger nøkkeltallene fra hver – samlet ett sted. Du slipper hele mappa inn og ber om én oversiktstabell. Agenten åpner hver PDF, finner det du spurte om, og bygger regnearket. Den typen oppgave som er dødkjedelig manuelt.",
  },
  {
    name: "tusen_problemer",
    text: "Mønsteret er det samme i alt dette: du peker på filer som allerede ligger der, du beskriver utfallet du vil ha – ikke hvert steg, bare målet – og du lar agenten gjøre resten. Alt du typisk gjør på en PC kan en agent løse med kode, hvis du gir den tilgang.",
  },

  // ───────────── POSTROMMET (den strekker seg ut) ─────────────
  {
    name: "mcp_mange_programmer",
    text: "Til nå har vi snakket om filer på maskina. Men agenten kan også strekke seg ut. MCP – Model Context Protocol – er en standard kobling som lar agenten snakke med programmer og tjenester: den leser tilstanden deres og vet hvilke funksjoner som er mulige. En toveis forbindelse.",
  },
  {
    name: "mcp_servere",
    text: "MCP-servere finnes for Chrome og Firefox, Photoshop og Affinity, DaVinci Resolve og Premiere Pro, Blender, Adform, Meta, Snapchat, LinkedIn, og ditt favorittprogram!",
  },
  {
    name: "claude_in_chrome",
    text: "Og med Claude in Chrome kan agenten styre nettleseren toveis: se hva som skjer på skjermen, fylle skjema, trykke knapper – bruke nettsider sånn du gjør. Tenk deg en markedsplan i Excel som ellers skulle punches inn i et system manuelt. I stedet for en hel dag med copy-paste, lar du agenten lese arket og fylle inn for deg.",
  },

  // ───────────── BIBLIOTEKET (styre agenten + spør dokumentene) ─────────────
  {
    name: "hvordan_prompte",
    text: "Husk at en språkmodell sjelden utfordrer deg med mindre du ber den om det. Vær derfor tydelig i kommunikasjonen din – men si gjerne ifra når noe er åpent for tolkning.",
  },
  {
    name: "fremgangsmaate",
    text: "Her er en god fremgangsmåte. Utforsk: hent inn data selv, eller be agenten om å gjøre det. Be gjerne agenten om å intervjue deg for å avdekke usikkerheter. Definer: tenk på hvordan et godt resultat ser ut, og hvordan du kan kontrollere det. Planlegg: be om en stegvis plan i markdown, så kan agenten utføre punkt for punkt mens du følger med. Så: revider, kjør, verifiser og fiks.",
  },
  {
    name: "agents_md",
    text: "Noen ting gjelder for alle oppgaver: hvordan prosjektet ser ut, hvilken tone du vil ha, hvordan ting skal gjøres. Agents.md er en enkel tekstfil med slike føringer som agenten leser hver gang den starter – grunnmuren som gjelder alt arbeid.",
  },
  {
    name: "styre_agenter",
    text: "For å styre hvordan agenter oppfører seg, skiller vi mellom globale føringer og oppgavespesifikke ferdigheter. Agents.md er de faste føringene som leses hver gang – prosjektoversikt, kodestil, tone of voice. Skills er skreddersydde instrukser for spesifikke oppgaver, som aktiveres kun når du ber om det. Det holder agenten fokusert uten unødig støy.",
  },
  {
    name: "fil_spor_dokument",
    text: "En siste: en brand guide eller manual på åtti sider som ingen orker å lese. Du kan be om et ett-siders sammendrag – eller bare stille spørsmål til dokumentet direkte: hva sier vi om fargebruk på sosiale medier? Dokumentet går fra død PDF til noe du kan snakke med.",
  },
];
