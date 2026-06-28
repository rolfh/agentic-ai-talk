# Agentic AI Talk (Agentisk AI-presentasjon)

Dette prosjektet er en interaktiv 3D- og WebGL-basert presentasjon om agentisk AI og fremtidens programvareutvikling, bygget med React, Three.js, React Three Fiber, Rapier-fysikk og Vite.

## Kom i gang

Følg trinnene nedenfor for å installere avhengigheter og kjøre prosjektet lokalt:

### 1. Installer avhengigheter
```bash
npm install
```

### 2. Start utviklingsserveren
```bash
npm run dev
```
Dette vil starte en lokal Vite-utviklingsserver (vanligvis på `http://localhost:5173`).

### 3. Bygg prosjektet for produksjon
```bash
npm run build
```

## Kontroller og navigasjon

* **Flytte seg rundt:** Bruk `W`, `A`, `S`, `D` eller piltastene.
* **Hoppe:** Trykk på `Space` (Mellomromstast).
* **Se deg rundt:** Beveg musen (skjermen låser markøren ved klikk).
* **Avslutt markørlås:** Trykk `ESC` for å frigjøre musen.
* **Teleportering til stasjoner:** Bruk hurtigtastene `Ctrl` / `Cmd` + talltaster for å teleportere direkte til de ulike delene av presentasjonen:
  * `1` - Utendørs / Startområdet (`outside`)
  * `2` - Lobbyen (`lobby`)
  * `3` - Rom 2 / Stasjon 2 (`room2`)
  * `4` - Rom 3 / Stasjon 3 (`room3`)
  * `5` - Rom 4 / Stasjon 4 (`room4`)

## Teknologier brukt

* **Framework:** React + TypeScript (Strict Mode)
* **3D-motor:** Three.js + React Three Fiber (`@react-three/fiber`)
* **3D-verktøykasse:** `@react-three/drei`
* **Fysikkmotor:** `@react-three/rapier`
* **Post-processing:** `@react-three/postprocessing`
* **Utviklingsverktøy:** Vite + TailwindCSS + ESLint
