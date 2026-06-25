import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PointerLockControls, Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Player } from "./components/Player";
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

export default function App() {
  const currentRoom = useStore((state) => state.currentRoom);
  const subtitle = useStore((state) => state.subtitle);
  const [showHint, setShowHint] = useState(true);

  // Force title on mount to override browser caching of old title
  useEffect(() => {
    document.title = "Agentic AI talk";
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050505] relative font-sans">

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-1.5 h-1.5 rounded-full bg-white/70 pointer-events-none mix-blend-difference" />

      {/* 3D Canvas */}
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows gl={{ toneMappingExposure: 0.85 }} camera={{ fov: 75, position: [0, 2, 5] }}>
          <color attach="background" args={["#241d15"]} />
          <Suspense fallback={null}>
            <Environment files="/hdri/evening_field_1k.exr" environmentIntensity={0.35} blur={0.2} />
            <ambientLight intensity={0.15} />
            
            <PointerLockControls />
            
            <Physics>
              <Player />
              
              {currentRoom === "lobby" && <Lobby />}
              {currentRoom === "room2" && <Room2 />}
              {currentRoom === "room3" && <Room3 />}
              {currentRoom === "room4" && <Room4 />}
            </Physics>

            {/* Postprocessing Bloom */}
            <EffectComposer enableNormalPass={false}>
              <Bloom luminanceThreshold={1.0} mipmapBlur intensity={0.25} />
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
