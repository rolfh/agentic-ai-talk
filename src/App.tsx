import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PointerLockControls, Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Player } from "./components/Player";
import { Lobby } from "./components/Lobby";
import { Room1 } from "./components/Room1";
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
];

export default function App() {
  const currentRoom = useStore((state) => state.currentRoom);
  const setRoom = useStore((state) => state.setRoom);
  const subtitle = useStore((state) => state.subtitle);
  const [started, setStarted] = useState(true);

  // Force title on mount to override browser caching of old title
  useEffect(() => {
    document.title = "Agentic AI talk";
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050505] relative font-sans">


      {/* HUD HUD Overlay removed as per user request */}

      {/* 3D Canvas */}
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ fov: 75, position: [0, 2, 5] }}>
          <Suspense fallback={null}>
            <Environment files="/hdri/photo_studio_loft_hall_1k.exr" background blur={0.2} />
            <ambientLight intensity={0.15} />
            
            {started && <PointerLockControls />}
            
            <Physics>
              {started && <Player />}
              
              {currentRoom === "lobby" && <Lobby />}
              {currentRoom === "room1" && <Room1 />}
              {currentRoom === "room2" && <Room2 />}
              {currentRoom === "room3" && <Room3 />}
              {currentRoom === "room4" && <Room4 />}
            </Physics>

            {/* Postprocessing Bloom */}
            <EffectComposer enableNormalPass={false}>
              <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.5} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </KeyboardControls>
      
      {/* Subtitles HUD Overlay */}
      {started && subtitle && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 max-w-2xl text-center px-6 py-3 bg-black/75 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl pointer-events-none transition-all duration-200">
          <p className="text-lg md:text-xl font-medium text-white tracking-wide leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {subtitle}
          </p>
        </div>
      )}


    </div>
  );
}
