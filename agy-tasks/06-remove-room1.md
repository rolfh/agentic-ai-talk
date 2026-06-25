# Oppgave 06 — Fjern bomberommet (room1) fra typer og slett komponenten

React Three Fiber-prosjekt. Du står i ROTMAPPEN. Ikke kjør `find`/`grep -r` over
disken — bruk relative stier direkte.

## Kontekst
Bombe-/kjernekraft-rommet (`room1`) skal fjernes helt. Referansene i `App.tsx`
(import + ruting) og `Lobby.tsx` (portalen til room1) fjernes av ANDRE oppgaver —
IKKE rør App.tsx eller Lobby.tsx.

## Filer du eier (rør KUN disse)
- `src/store.ts`
- `src/components/Room1.tsx` (skal SLETTES)

## Gjør dette
1. I `src/store.ts`: fjern `'room1'` fra union-typen `currentRoom` (la `'lobby' |
   'room2' | 'room3' | 'room4'` stå). Endre ingenting annet.
2. Slett filen `src/components/Room1.tsx` helt (f.eks. `rm src/components/Room1.tsx`).

## Verifisering
- `npx tsc -b` kan vise forbigående feil i App.tsx/Lobby.tsx mens parallelle oppgaver
  pågår — det er forventet. Sørg bare for at DINE to filer er korrekte: store-typen
  uten room1, og at Room1.tsx er borte.

## Rapporter kort hva du gjorde.
