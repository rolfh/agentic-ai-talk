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
import { Suspense, useState } from "react";

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
  const [started, setStarted] = useState(false);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050505] relative font-sans">
      {/* Premium Start Screen Overlay */}
      {!started && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white/10 p-12 rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center max-w-lg text-center backdrop-blur-xl">
            <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
              Agentisk KI
            </h1>
            <h2 className="text-2xl font-medium text-gray-200 mb-6">3D Presentasjon</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Utforsk agentens natur i første person. Bruk <kbd className="bg-gray-800 text-gray-200 px-2 py-1 rounded">W A S D</kbd> for å bevege deg og musen for å se deg rundt.
            </p>
            <button 
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              onClick={() => setStarted(true)}
            >
              Start Opplevelsen
            </button>
          </div>
        </div>
      )}

      {/* HUD HUD Overlay */}
      {started && (
        <div className="absolute top-6 left-6 z-10 text-white/80 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-sm flex gap-4">
          <span><span className="font-bold text-white">Esc</span> = Meny</span>
          <span><span className="font-bold text-white">WASD</span> = Gå</span>
        </div>
      )}

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

      {/* Back Button HUD */}
      {currentRoom !== "lobby" && started && (
         <button 
          onClick={() => setRoom("lobby")} 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-lg border border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-colors shadow-lg"
         >
           ← Tilbake til Lobby
         </button>
      )}
    </div>
  );
}
