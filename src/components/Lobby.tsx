import { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";

import { Portal } from "./Portal";
import { Furniture } from "./Furniture";

export const Lobby = () => {
  // Load laminate floor textures (gir et varmt tregulv)
  const floorTextures = useTexture({
    map: "/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg",
    normalMap: "/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg",
    roughnessMap: "/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg",
  });

  useMemo(() => {
    Object.values(floorTextures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(6, 6);
    });
  }, [floorTextures]);

  return (
    <group>
      {/* Tregulv (18x18) */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[18, 0.2, 18]} />
          <meshStandardMaterial {...floorTextures} color="#b6905f" roughness={0.85} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Tak (18x18) */}
      <RigidBody type="fixed" position={[0, 6.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[18, 0.2, 18]} />
          <meshStandardMaterial color="#cdbfa6" roughness={1} />
        </mesh>
      </RigidBody>

      {/* Varme pussede vegger */}
      {/* Bakvegg (Nord) */}
      <RigidBody type="fixed" position={[0, 3, -9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[18, 6, 0.4]} />
          <meshStandardMaterial color="#d9cbb2" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>
      
      {/* Venstre vegg (Vest) */}
      <RigidBody type="fixed" position={[-9, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 18]} />
          <meshStandardMaterial color="#d9cbb2" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>
      
      {/* Høyre vegg (Øst) */}
      <RigidBody type="fixed" position={[9, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 18]} />
          <meshStandardMaterial color="#d9cbb2" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Frontvegg med vinduer (Sør, z=9) */}
      <group position={[0, 0, 9]}>
        {/* Solide veggdeler */}
        <RigidBody type="fixed" position={[-6.5, 3, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[5, 6, 0.4]} />
            <meshStandardMaterial color="#d9cbb2" roughness={0.95} metalness={0} />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" position={[6.5, 3, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[5, 6, 0.4]} />
            <meshStandardMaterial color="#d9cbb2" roughness={0.95} metalness={0} />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" position={[0, 0.75, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[8, 1.5, 0.4]} />
            <meshStandardMaterial color="#d9cbb2" roughness={0.95} metalness={0} />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" position={[0, 5, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[8, 2, 0.4]} />
            <meshStandardMaterial color="#d9cbb2" roughness={0.95} metalness={0} />
          </mesh>
        </RigidBody>

        {/* Vindusramme og glass */}
        <RigidBody type="fixed" position={[0, 2.75, 0]}>
          <mesh>
            <boxGeometry args={[8, 2.5, 0.1]} />
            <meshPhysicalMaterial color="#e0f7fa" transmission={0.8} opacity={1} transparent roughness={0.1} />
          </mesh>
        </RigidBody>
        <mesh position={[0, 2.75, 0]}>
          <boxGeometry args={[0.2, 2.5, 0.15]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>

        {/* Kveldshimmel utenfor */}
        <mesh position={[0, 3, 3]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[40, 20]} />
          <meshBasicMaterial color="#ffa550" />
        </mesh>
        
        {/* Potteplanter ved vinduet */}
        <Furniture name="plantSmall1" position={[-3, 1.5, -0.3]} scale={2.5} />
        <Furniture name="plantSmall2" position={[3, 1.5, -0.3]} scale={2.5} />
      </group>

      {/* ---------- Stue-vignett (midten) ---------- */}
      {/* Teppe */}
      <Furniture name="rugRectangle" position={[0, 0.01, 1]} scale={[4.0, 4.0, 4.0]} />

      {/* Sofa vendt mot spilleren + lenestoler rundt sofabord */}
      <Furniture name="loungeSofa" position={[0, 0, -1.5]} rotation={[0, 0, 0]} scale={2.8} solid />
      <Furniture name="loungeChair" position={[-3.5, 0, 1.5]} rotation={[0, Math.PI * 0.7, 0]} scale={2.6} solid />
      <Furniture name="loungeChair" position={[3.5, 0, 1.5]} rotation={[0, -Math.PI * 0.7, 0]} scale={2.6} solid />
      <Furniture name="tableCoffee" position={[0, 0, 1]} scale={2.8} solid />

      {/* Gulvlampe med varmt lys */}
      <Furniture name="lampRoundFloor" position={[-4.5, 0, -1.5]} scale={2.8} />
      <pointLight position={[-4.5, 2.5, -1.5]} intensity={5} color="#ffb866" distance={9} decay={2} castShadow />

      {/* Sofakrok-lampe (varm fyll) */}
      <Furniture name="lampRoundTable" position={[4.5, 0, -1.5]} scale={2.8} />
      <pointLight position={[4.5, 1.5, -1.5]} intensity={3} color="#ffcf99" distance={7} decay={2} />

      {/* Bokhylle-vegg (venstre side) */}
      <Furniture name="bookcaseOpen" position={[-8.4, 0, 4]} rotation={[0, Math.PI / 2, 0]} scale={2.8} solid />
      <Furniture name="bookcaseOpen" position={[-8.4, 0, 1.5]} rotation={[0, Math.PI / 2, 0]} scale={2.8} solid />

      {/* Planter i hjørnene */}
      <Furniture name="pottedPlant" position={[-7.5, 0, -7.5]} scale={3.0} />
      <Furniture name="pottedPlant" position={[7.5, 0, -7.5]} scale={3.0} />
      <Furniture name="pottedPlant" position={[7.5, 0, 7.5]} scale={3.0} />

      {/* ---------- Arbeidskrok ---------- */}
      <group position={[6.5, 0, 2]}>
        {/* Teppe under pult */}
        <Furniture name="rugRound" position={[0.5, 0.01, 0]} scale={3.5} />
        
        <Furniture name="desk" position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={2.6} solid />
        <Furniture name="computerScreen" position={[0.1, 1.0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={2.6} />
        <Furniture name="computerKeyboard" position={[0.45, 1.0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={2.6} />
        <Furniture name="chairDesk" position={[1.3, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={2.4} solid />
        <Furniture name="lampSquareTable" position={[-0.1, 1.0, 0.7]} scale={2.2} />
        
        {/* Mindre, varmere lys på skjermen så den ikke brenner ut */}
        <pointLight position={[0.1, 1.6, 0]} intensity={0.8} color="#ffe4cc" distance={5} decay={2} />
      </group>

      {/* ---------- Dører til rommene ---------- */}
      {/* START-DØR (Fremhevet) */}
      <Portal position={[0, 0, -8.7]} room="room2" label="Kontoret" color="#a9c08e" />
      <Furniture name="rugDoormat" position={[0, 0.01, -7.2]} scale={3.0} />
      <pointLight position={[0, 2.5, -7.2]} intensity={5} color="#ffd8a8" distance={6} decay={2} castShadow />
      <Text position={[0, 3.2, -8.6]} fontSize={0.3} color="#ffffff" outlineWidth={0.03} outlineColor="#000000">
        START HER ▼
      </Text>

      {/* Andre rom */}
      <Portal position={[-8.7, 0, -2]} rotation={[0, Math.PI / 2, 0]} room="room3" label="Postrommet" color="#93b4cc" />
      <Portal position={[8.7, 0, -2]} rotation={[0, -Math.PI / 2, 0]} room="room4" label="Biblioteket" color="#d98c6a" />

      {/* ---------- Generell belysning ---------- */}
      <ambientLight intensity={0.55} color="#ffe8cc" />
      <hemisphereLight args={["#fff1dd", "#5a4a38", 0.5]} />
      <directionalLight
        position={[6, 13, 5]}
        intensity={0.8}
        color="#ffe0b0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={45}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0005}
      />
    </group>
  );
};

useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg");
