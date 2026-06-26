# Handoff — Agentisk AI med Rolf (walkable Three.js-demo)

Dette dokumentet er en selvstendig overlevering. Du trenger ikke tidligere chat-kontekst.
Les hele før du begynner. Prosjektet kjøres fra rotmappa `/Users/rolf/Github/agentic-ai-talk`.

## 1. Hva dette er
En walkable 3D-verden (React Three Fiber) som er den visuelle ryggraden i et norsk
foredrag: «Agentisk AI med Rolf» — hvordan jeg jobber med agenter.
- Kjernebudskap: **«Pek. Beskriv utfallet. La den jobbe.»**
- Tone: et innblikk i hverdagen, ufarlig og varmt — ikke skummelt/magisk.
- Metafor: **huset/kontoret**. Man går fra rom til rom og hører fortellingen (TTS) mens
  man utforsker. Hvert område er én del av historien, i en TYDELIG LINEÆR rekkefølge.

## 2. Teknisk stack
- React Three Fiber 9, @react-three/drei, @react-three/rapier (fysikk), @react-three/postprocessing (Bloom), zustand (store), Vite 8, TypeScript, Tailwind.
- Node 22.11 (global fetch + Buffer). ffmpeg 7.1.1 tilgjengelig. Python3 + Whisper for undertekster.
- Kjør dev: `npm run dev`. Lint: `npm run lint`. Typesjekk: `npx tsc -b`.

## 3. Nåværende tilstand (verifisert 2026-06-25)
FERDIG:
- `src/App.tsx`: startskjerm fjernet, hopp lagt til (Space), gammelt bomberom (Room1) fjernet.
  Tonemapping + kveldsstemning-HDRI (`/hdri/evening_field_1k.exr`) + Bloom satt opp. **IKKE rør HDRI/eksponering.**
- `src/store.ts`: `currentRoom: 'lobby' | 'room2' | 'room3' | 'room4'`.
- `src/components/Model.tsx`: realistisk glTF-loader (se API under). Bruk DENNE, ikke Kenney-`Furniture`.
- `src/components/Portal.tsx`, `Player.tsx`, `AudioZone.tsx`: fungerer (API under). AudioZone har 2 pre-eksisterende lint-feil som er OK å la stå.
- 20 realistiske Poly Haven-modeller (CC0) lastet ned i `public/models/realistic/<id>/<id>_2k.gltf` (+ teksturer/bin). Liste i `agy-tasks/STYLE.md`.
- `agy-tasks/STYLE.md` + `agy-tasks/07-stua.md … 10-biblioteket.md`: ferdige byggespesifikasjoner per rom.
- `manus.md`: gjennomgått manus. `tts-content.js`: 14 klipp i ny rekkefølge.

IKKE GJORT (= jobben din):
- **Rom-ombygging 07–10 er IKKE utført.** `Lobby.tsx` er fortsatt Kenney/`Furniture`; `Room2/3/4.tsx` er fortsatt gammelt neon-sci-fi.
- **Ny TTS er IKKE generert.** Mp3-ene på disk er gamle navn. Disse NYE klippene mangler og MÅ genereres: `stua_intro`, `fil_rydde_mappe`, `fil_pdf_regneark`, `claude_in_chrome`, `fil_spor_dokument` (resten finnes med gammelt innhold/stemme og bør re-genereres med `--force`).
- **Ute-scenen finnes ikke.** Ingen 'outside'-område ennå.

## 4. Oppgaver i rekkefølge

### Oppgave A — Bygg om de 4 rommene realistisk (størst jobb)
Følg spesifikasjonene som ALLEREDE er skrevet:
- `agy-tasks/STYLE.md` (les først — felles look, modell-liste, lys, lineær fortelling, APIer)
- `agy-tasks/07-stua.md` → bygg om `src/components/Lobby.tsx` (START-området, spawn her)
- `agy-tasks/08-kontoret.md` → bygg om `src/components/Room2.tsx`
- `agy-tasks/09-postrommet.md` → bygg om `src/components/Room3.tsx`
- `agy-tasks/10-biblioteket.md` → bygg om `src/components/Room4.tsx`

Hver fil er fil-disjunkt (rør kun din egen fil) → kan gjøres uavhengig.
Krav per rom: lukket rom-skall (gulv+4 vegger+tak, ~16–20 m), varm PBR-belysning,
realistiske `<Model>` (scale 1), nummererte AudioZone-stasjoner i lineær rekkefølge langs
en synlig sti, og dører (videre/tilbake) som spesifisert. Verifiser med `npm run lint` (ingen NYE feil) + `npx tsc -b`.

### Oppgave B — Regenerer all TTS (ny stemme + nytt innhold)
Stemme: Gemini 3.1 Flash TTS Preview, voice **Fenrir**, stil «Trøndersk mann, fortellende og tydelig».
Alt er allerede konfigurert i `generate-tts.js` (`DEFAULT_MODEL`, `DEFAULT_VOICE`, `STYLE_INSTRUCTION`) og innholdet i `tts-content.js`.
API-nøkkel ligger som `GPC-API-KEY` i `.env` (gitignored — ikke ekko/log verdien; scriptet leser den selv).
Kjør:
```
node generate-tts.js --force      # lager public/tts/<navn>.mp3 for alle 14 klipp
python3 transcribe.py             # lager public/tts/<navn>.json (undertekster, no, hopper over eksisterende)
```
Sjekk at disse 14 finnes etterpå: stua_intro, claude_cowork, hva_kan_agent_gjoere, fil_rydde_mappe, fil_pdf_regneark, tusen_problemer, mcp_mange_programmer, mcp_servere, claude_in_chrome, hvordan_prompte, fremgastemaate→**fremgangsmaate**, agents_md, styre_agenter, fil_spor_dokument.
NB: gamle mp3-er med navn som `dagens_bruk`, `kjernekraft`, `terminal_vs_desktop`, `noen_ting_gjelder_alle` er utdaterte og kan slettes.

### Oppgave C — Bygg ute-scene som ny startflate (krever modell fra brukeren)
Brukeren laster selv ned en CC-lisensiert husmodell (glb/gltf) fra Sketchfab til `public/models/`.
Når den er på plass:
1. Legg til `'outside'` i `currentRoom`-unionen i `src/store.ts` og sett `currentRoom: 'outside'` som start.
2. Lag `src/components/Outside.tsx`: utendørs HDRI-stemning, bakke, en sti, trær, husmodellen med en inngangsdør. En `Portal` med `room="lobby"` ved døra (gå inn = inn i stua).
3. Rut den inn i `src/App.tsx` (`{currentRoom === "outside" && <Outside />}`) og sett spillerens spawn utendørs.
4. Stua (`Lobby`) får en dør tilbake ut (`room="outside"`).

## 5. Fil-APIer du trenger
```tsx
// Realistisk modell-loader
import { Model } from "./Model";
<Model id="sofa_03" position={[x,y,z]} rotation={[0,ry,0]} scale={1} solid />
// id = mappenavn i public/models/realistic/. solid=cuboid-collider. Virkelig skala → scale=1.

// Lydsone (lineær stasjon)
import { AudioZone } from "./AudioZone";
<AudioZone position={[x,y,z]} size={[w,h,d]} audioUrl="/tts/<navn>.mp3" subtitleUrl="/tts/<navn>.json" />

// Dør mellom områder
import { Portal } from "./Portal";
<Portal position={[x,y,z]} rotation={[0,ry,0]} room="room2" label="Kontoret" color="#.." />
```
Dør-flyt: lobby(stua) → room2(kontoret) → room3(postrommet) → room4(biblioteket), med tilbake-dører.
Stua har START-døra til kontoret fremhevet + snarveier til de andre.

## 6. Fallgruver
- Bruk `<Model>` (realistisk), IKKE Kenney-`<Furniture>` i nye rom.
- Ikke rør HDRI/tonemapping i `App.tsx`.
- Ikke ekko `.env`/`GPC-API-KEY`.
- Modellene er i meter (Poly Haven) → scale 1. (Kenney var ~0.5×, ikke bland.)
- AudioZone feiler stille hvis mp3 mangler — derfor er det OK å bygge rom før TTS er generert, men begge må til slutt være på plass.
- Hold rommene LUKKET (tak + vegger), ellers ser man ut i tomrom.
