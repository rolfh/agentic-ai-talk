import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PointerLockControls, Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EffectComposer, Bloom, BrightnessContrast, HueSaturation } from "@react-three/postprocessing";
import { Player } from "./components/Player";
import { Outside } from "./components/Outside";
import { Lobby } from "./components/Lobby";
import { Room2 } from "./components/Room2";
import { Room3 } from "./components/Room3";
import { Room4 } from "./components/Room4";
import { useStore } from "./store";
import { Suspense, useState, useEffect } from "react";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
];

import { useThree, useFrame } from "@react-three/fiber";

const viewPresets = [
  { position: [0, 8, 38], lookAt: [0, 2, 25], room: "outside" },
  { position: [-3, 6, 4], lookAt: [-6, 2, -2], room: "lobby" },
  { position: [-6, 7, -6], lookAt: [2, 1, -2], room: "lobby" },
  { position: [-5, 4, -4], lookAt: [4, 1, 2], room: "room2" },
  { position: [6, 5, 6], lookAt: [-4, 2, -3], room: "room3" },
  { position: [0, 6, 5], lookAt: [0, 2, -1], room: "room4" },
] as const;

function SpectatorCamera({ viewIndex }: { viewIndex: number }) {
  const { camera } = useThree();
  const preset = viewPresets[viewIndex] || viewPresets[0];

  useFrame(() => {
    camera.position.set(preset.position[0], preset.position[1], preset.position[2]);
    camera.lookAt(preset.lookAt[0], preset.lookAt[1], preset.lookAt[2]);
    camera.updateProjectionMatrix();
  });

  return null;
}

export default function App() {
  const currentRoom = useStore((state) => state.currentRoom);
  const setRoom = useStore((state) => state.setRoom);
  const subtitle = useStore((state) => state.subtitle);
  const [showHint, setShowHint] = useState(true);
  const [dpr, setDpr] = useState(1);

  const viewParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("view") : null;
  const isSpectating = viewParam !== null;
  const viewIndex = viewParam !== null ? parseInt(viewParam, 10) : 0;

  // Force title on mount to override browser caching of old title
  useEffect(() => {
    document.title = "Agentic AI talk";
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Update room based on spectator view index
  useEffect(() => {
    if (isSpectating) {
      const preset = viewPresets[viewIndex];
      if (preset) {
        setRoom(preset.room);
      }
    }
  }, [isSpectating, viewIndex, setRoom]);

  // Read resolution query parameter (res) on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const resVal = params.get("res");
      if (resVal !== null && !isNaN(Number(resVal))) {
        setDpr(window.devicePixelRatio * Number(resVal));
      } else {
        setDpr(window.devicePixelRatio);
      }
    }
  }, []);

  // Teleport keyboard listener (Ctrl/Cmd + 1..5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        let room: typeof currentRoom | null = null;
        if (e.key === "1") room = "outside";
        else if (e.key === "2") room = "lobby";
        else if (e.key === "3") room = "room2";
        else if (e.key === "4") room = "room3";
        else if (e.key === "5") room = "room4";

        if (room) {
          e.preventDefault();
          setRoom(room);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setRoom]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050505] relative font-sans">

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-1.5 h-1.5 rounded-full bg-white/70 pointer-events-none mix-blend-difference" />

      {/* 3D Canvas */}
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows gl={{ toneMappingExposure: 0.85 }} camera={{ fov: 75, position: [0, 2, 5] }} dpr={dpr}>
          <Suspense fallback={null}>
            <Environment 
              files="/hdri/evening_field_1k.exr" 
              background 
              environmentIntensity={currentRoom === "outside" ? 0.9 : 0.03} 
            />
            {currentRoom === "outside" && <fog attach="fog" args={["#96736a", 10, 45]} />}
            <ambientLight intensity={currentRoom === "outside" ? 0.15 : 0.01} />
            
            {!isSpectating && <PointerLockControls />}
            {isSpectating && <SpectatorCamera viewIndex={viewIndex} />}
            
            <Physics>
              <Player />
              
              {currentRoom === "outside" && <Outside />}
              {currentRoom === "lobby" && <Lobby />}
              {currentRoom === "room2" && <Room2 />}
              {currentRoom === "room3" && <Room3 />}
              {currentRoom === "room4" && <Room4 />}
            </Physics>

            {/* Postprocessing effects */}
            <EffectComposer enableNormalPass={false}>
              <Bloom luminanceThreshold={1.0} mipmapBlur intensity={0.25} />
              <BrightnessContrast contrast={0.12} brightness={0.02} />
              <HueSaturation saturation={0.08} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </KeyboardControls>
      
      {/* Subtitles HUD Overlay */}
      {subtitle && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 max-w-2xl text-center px-6 py-3 bg-black/75 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl pointer-events-none transition-all duration-200">
          <p className="text-lg md:text-xl font-medium text-white tracking-wide leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {subtitle}
          </p>
        </div>
      )}

      {/* Controls Hint */}
      <div className={`absolute bottom-6 left-6 z-40 text-white/50 text-sm font-mono pointer-events-none transition-opacity duration-1000 ${showHint ? "opacity-100" : "opacity-0"}`}>
        WASD &middot; Mellomrom for å hoppe &middot; ESC
      </div>

    </div>
  );
}
