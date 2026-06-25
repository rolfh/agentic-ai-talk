# Oppgave 03 — Fjern start-skjerm, legg til hopp, fjern rom1-ruting

React Three Fiber-prosjekt (walkable "Agentisk AI"-demo). Du står i prosjektets
ROTMAPPE. Ikke kjør `find`/`grep -r` over disken — bruk relative stier direkte.

## Filer du eier (rør KUN disse)
- `src/App.tsx`
- `src/components/Player.tsx`

(Andre filer som også fjerner "room1" håndteres av en annen oppgave — ikke rør
store.ts, Room1.tsx eller Lobby.tsx.)

## Gjør dette

### 1. Fjern start-skjermen (src/App.tsx)
- Fjern hele start-overlay-blokken (`{!started && (...)}` med "Agentisk AI", "Klikk
  for å starte"-knappen og kontroll-hintene).
- Opplevelsen skal være aktiv umiddelbart: `<PointerLockControls />` og `<Player />`
  skal alltid rendres (fjern `started`-gatingen). Rydd vekk `started`/`setStarted`
  og ubrukt `useState`-import hvis den blir overflødig.
- Behold crosshair-prikken (den skal alltid vises nå).
- Behold undertekst-HUD-en nederst.
- Legg til et LITE, diskret kontroll-hint nederst til venstre (WASD · Mellomrom for å
  hoppe · ESC) som fader ut etter ~5 sekunder. Ikke en modal — bare en liten tekst.

### 2. Legg til hopp
- I `src/App.tsx`: legg til `{ name: "jump", keys: ["Space"] }` i `keyboardMap`.
- I `src/components/Player.tsx`: les `jump` fra `getKeys()`. Når spilleren er omtrent
  på bakken (f.eks. `Math.abs(velocity.y) < 0.05`) og `jump` er trykket, sett en
  oppover-hastighet (f.eks. `setLinvel({ x, y: 7, z }, true)`). Sørg for at man ikke
  kan dobbelt-hoppe i lufta. Behold eksisterende bevegelse uendret.

### 3. Fjern room1 fra ruting (src/App.tsx)
- Fjern `import { Room1 } ...` og linja `{currentRoom === "room1" && <Room1 />}`.
  (Selve Room1.tsx-fila og store-typen fjernes av en annen oppgave — bare fjern
  referansene i App.tsx.)

## Verifisering
- `npm run lint` — ingen NYE feil (2 pre-eksisterende i AudioZone er OK).
- TypeScript kompilerer (`npx tsc -b`). MERK: hvis du ser en forbigående type-feil om
  at "room1" mangler i store-typen, er det fordi en parallell oppgave fjerner den —
  sørg bare for at DIN App.tsx ikke lenger refererer "room1".

## Rapporter kort hva du endret.
