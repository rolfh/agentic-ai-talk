# Agentisk AI med Rolf 

Gemini TTS klar som mp3. Avspilling starter når man står på en gitt plass.   
Third person controller: [https://github.com/pmndrs/ecctrl](https://github.com/pmndrs/ecctrl) 

**Rom: The bomb**  
Rom med en bombe. Bomba har en lunte, du holder en fakkel. Man må tenne på så bomba smeller for å gå videre.   
[https://sketchfab.com/3d-models/atomic-bomb-easter-freebie-a3e1493da19d46fca7ae38b376bf9210](https://sketchfab.com/3d-models/atomic-bomb-easter-freebie-a3e1493da19d46fca7ae38b376bf9210) 

*Da kjernekraft kom, ga det oss mulighet til å gi strøm til millioner, men også total ødeleggelse. En agentisk arbeidsflyt gir både enorme muligheter, men også nye sikkerhetsvektorer å brenne seg på.* 

**Rom: Your PC and the cloud**  
Rom med en megastor PC i midten. Over skjermen er det mange skyer som sirkler over oss, 3 av de har logoene til Claude, Gemini og OpenAI.   
[https://sketchfab.com/3d-models/ibm-pcjr-4863-computer-1c3c3cd0643d44d49a1771048da74c62](https://sketchfab.com/3d-models/ibm-pcjr-4863-computer-1c3c3cd0643d44d49a1771048da74c62)   
[https://sketchfab.com/3d-models/clouds-pack-290e64250360443db2a2ef572cf4ad4a](https://sketchfab.com/3d-models/clouds-pack-290e64250360443db2a2ef572cf4ad4a) 

**Dagens bruk**  
Alle har brukt ai via en nettside. En nettside vet bare det du putter inn i den. På design og utvikling kjører vi agenter som Claude Code, Github Copilot og Google Antigravity. Agentene kjører lokalt på maskina di for å få tilgang til å kjøre verktøy. Den kan i teorien gjøre hva som helst, fra å gjøre oppgaver for deg, til å installere virus. Som standard må man godkjenne at agenten får lov til å lese og skrive til filsystemet, gjøre søk på nettet, etc. Det finnes en auto-modus for å kun spørre om potensielt farlige handlinger. At en agent er lokal betyr ikke nødvendigvis at selve modellen kjører lokalt, men at den gis tilgang til å kjøre verktøy lokalt. 

**Rom: Et rom med masse filer i skap**   
[https://sketchfab.com/3d-models/filing-cabinets-7ef1ca295ff14af2abcbe0ae0168a241](https://sketchfab.com/3d-models/filing-cabinets-7ef1ca295ff14af2abcbe0ae0168a241) 

**Claude Cowork**   
Claude Desktop har en modus som heter Cowork. Den er laget for bruk utover koding, fortsatt med tilgang til de lokale filene dine. Cowork gjør det samme som Claude Code, men med et brukergrensesnitt laget for orgnisering av filer, behandling av data, lage en presentasjoner, etc. 

**Terminal vs desktop**  
Agenten kjører typisk i terminalen for utviklere, men du trenger ikke å kjøre den der. Både Claude, OpenCode, Github Copilot, Antigravity og Codex har alle fullverdige program for skrivebordet. Ikke-utviklere kan også bruke terminalen, det er ikke så skummelt som kanskje noen tror. 

**Rom: Kode regner ned fra** 

**Hva kan en agent gjøre for deg?**   
Sett at du har mange filer som inneholder data du ønsker. For å få tak i dataen må den letes fram, og formateres rett. En utvikler ville skrevet litt kode for å løse det, men du har sikkert aldri installert Node eller Python, så å be ChatGPT om skrive kode for deg, har kanskje ikke virket som et alternativ. Men en agent kan ta kontroll på PC-en din, og installere det du trenger, skrive koden, kjøre koden, og verifisere at det ble rett. Den kan finne ut alt den trenger å vite om PC-en din, filene dine, den har tilgang på nettet og potensialet for full tilgang. Agenten kan kjøre igang en nettleser og gjøre oppgaver der også.

**1000 problemer**  
Å få en agent til å skrive kode er en måte å løse tusen problemer. Alt du typisk gjør på en PC kan en agent gjøre med kode, hvis du gir den tilgang. 

**Rom: ??**

**MCP**  
Mange programmer som kjører på maskina di har støtte for MCP (Model Context Protocol). Det er en måte å lage en 2-veis kommunikasjon til agenten. Agenten leser tilstanden til et program og vet hvilke funksjoner som er mulig.

* Chrome, Firefox  
* Photoshop, Affinity   
* DaVinci Resolve,  Premiere Pro, Final Cut Pro  
* Blender   
* Adform, Meta, Snapchat, LinkedIn, etc   
* Ditt favorittprogram

MCP servere finnes for Chrome og Firefox, Photoshop og Affinity, DaVinci Resolve og Premiere Pro, Blender, Adform, Meta, Snapchat, LinkedIn, og ditt favorittprogram\!

**Rom: Store spillekort**  
Hver av stegene er et spillekort. 

**Hvordan prompte en agent**   
Husk at en LLM sjelden utfordrer deg med mindre du ber den om det. Vær derfor tydelig i kommunikasjonen din, men spesifiser gjerne når noe er åpent for tolkning. Her er en god fremgangsmåte:

* **Utforsk**: Hent inn data selv, eller be agenten om å gjøre det – enten lokalt eller fra nettet. Be gjerne agenten om å intervjue deg for å avdekke usikkerheter; dette hjelper både deg og agenten med å forstå komplekse oppgaver bedre.  
* **Definer**: Tenk på hvordan et godt resultat ser ut, og hvordan du kan kontrollere det – spesielt hvis du ikke leser kode selv. I koding bruker vi tester for å sjekke ulike input-kombinasjoner. Sørg for å være tydelig på hva du ønsker, men også hva du vil unngå, for å treffe best mulig.  
* **Planlegg**: Be om en stegvis plan i markdown-format. Da kan agenten utføre oppgavene punkt for punkt, og du kan enkelt følge med på fremdriften og verifisere at kursen er riktig. Å bryte ned store oppgaver gjør hverdagen enklere for begge parter.  
* **Revider**  
* **Kjør**  
* **Verifiser**  
* **Fiks**

**Generelle og spesifikke intruksjoner**  
For å styre hvordan agenter oppfører seg, skiller vi mellom globale innstillinger og oppgavespesifikke ferdigheter:  
**Agents.md:** Inneholder faste føringer som leses hver gang agenten starter (f.eks. prosjektoversikt, kodestil eller tone-of-voice). Dette er agentens "grunnmur" som gjelder for alt arbeid.  
**Skills:** Skreddersydde instrukser for spesifikke oppgaver (som f.eks. "Facebook Ad Recipe"). En Skill aktiveres kun når du spesifikt ber om det, noe som holder agenten fokusert på den aktuelle oppgaven uten unødig støy.  
