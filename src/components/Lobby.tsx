import { useMemo } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useStore } from "../store";
import { useGLTF, Text, Grid, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface DoorProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  room: 'room1' | 'room2' | 'room3' | 'room4';
  label: string;
  color: string;
}

const Door = ({ position, rotation = [0, 0, 0], room, label, color }: DoorProps) => {
  const setRoom = useStore((state) => state.setRoom);
  const { scene } = useGLTF("/models/office_door_open_40_degrees.glb");

  // Clone the glTF scene so it can be rendered multiple times, and enable shadows
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as any).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Find the door panel sub-mesh (Three.js sanitizes spaces to underscores)
    const doorPanel = clone.getObjectByName("SM_Office_Door_Door_0") || clone.getObjectByName("SM Office Door_Door_0");
    if (doorPanel) {
      // The hinge is offset from the node's local origin at yh = 0.4531m.
      // To rotate around the hinge rather than the center of the doorway,
      // we must translate the node's position to compensate.
      const yh = 0.4531; 
      const theta = -0.9; // Rotate an additional ~52 degrees (total ~92 degrees open)
      
      doorPanel.rotation.z = theta;
      doorPanel.position.x = yh * Math.sin(theta);
      doorPanel.position.y = yh * (1 - Math.cos(theta));
    }

    return clone;
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      {/* Dark recessed doorway background (portal effect) */}
      <mesh position={[0, 2.06, -0.08]}>
        <boxGeometry args={[2.0, 4.0, 0.02]} />
        <meshStandardMaterial color="#020202" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* Hollow glowing frame around the doorway */}
      <group position={[0, 0, -0.05]}>
        {/* Left post */}
        <mesh position={[-1.05, 2.06, 0]}>
          <boxGeometry args={[0.1, 4.12, 0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
        {/* Right post */}
        <mesh position={[1.05, 2.06, 0]}>
          <boxGeometry args={[0.1, 4.12, 0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
        {/* Top lintel */}
        <mesh position={[0, 4.12, 0]}>
          <boxGeometry args={[2.2, 0.1, 0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      </group>
      
      {/* The door GLB model - rotated 90deg (Math.PI / 2) to align flat against the wall and swing inward */}
      <primitive object={clonedScene} scale={[0.02, 0.02, 0.02]} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Physics colliders for the frame posts only (keeping the doorway clear) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.05, 2.06, 0.05]} position={[-1.05, 2.06, 0]} />
        <CuboidCollider args={[0.05, 2.06, 0.05]} position={[1.05, 2.06, 0]} />
      </RigidBody>
      
      {/* The trigger area in front of the door */}
      <RigidBody type="fixed">
        <CuboidCollider 
          args={[1.1, 2, 0.75]} 
          position={[0, 2, 1.2]} 
          sensor 
          onIntersectionEnter={() => setRoom(room)}
        />
      </RigidBody>

      {/* Floating neon room text */}
      <Text 
        position={[0, 4.5, 0]} 
        fontSize={0.35} 
        color={color} 
        anchorY="bottom"
        outlineWidth={0.015}
        outlineColor={color}
        material-toneMapped={false}
      >
        {label}
      </Text>
    </group>
  );
};

export const Lobby = () => {
  const { scene: wetFloorSign } = useGLTF("/models/psx_wet_floor_sign/scene.gltf");

  // Enable shadows for the wet floor sign centerpiece model
  const wetFloorSignModel = useMemo(() => {
    const clone = wetFloorSign.clone();
    clone.traverse((child) => {
      if ((child as any).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [wetFloorSign]);

  // Load laminate floor textures
  const floorTextures = useTexture({
    map: "/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg",
    normalMap: "/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg",
    roughnessMap: "/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg",
  });

  // Setup texture wrapping and repeat/tiling
  useMemo(() => {
    Object.values(floorTextures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(8, 8); // Tiling factor for 30x30m floor
    });
  }, [floorTextures]);

  return (
    <group>
      {/* Floor - Laminate floor textures applied with a slightly dark tint */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[30, 0.2, 30]} />
          <meshStandardMaterial 
            {...floorTextures}
            color="#666666" 
            roughness={1.0} 
            metalness={0.0} 
          />
        </mesh>
      </RigidBody>
      
      {/* Subtle floor grid overlay */}
      <Grid 
        position={[0, 0.01, 0]} 
        args={[30, 30]} 
        cellSize={1.5} 
        cellThickness={0.3} 
        cellColor="#222" 
        sectionSize={4.5} 
        sectionThickness={0.6} 
        sectionColor="#444" 
        fadeDistance={25} 
      />

      {/* Walls - Matte structural panels */}
      <RigidBody type="fixed" position={[0, 3, -15]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[30, 6, 0.4]} />
          <meshStandardMaterial color="#121215" roughness={0.5} metalness={0.6} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 3, 15]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[30, 6, 0.4]} />
          <meshStandardMaterial color="#121215" roughness={0.5} metalness={0.6} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-15, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 30]} />
          <meshStandardMaterial color="#121215" roughness={0.5} metalness={0.6} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[15, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 30]} />
          <meshStandardMaterial color="#121215" roughness={0.5} metalness={0.6} />
        </mesh>
      </RigidBody>

      {/* Glowing border running along the top edges of the walls (futuristic architecture style) */}
      <mesh position={[0, 5.95, -14.75]}>
        <boxGeometry args={[30, 0.08, 0.08]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 5.95, 14.75]}>
        <boxGeometry args={[30, 0.08, 0.08]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[-14.75, 5.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 0.08, 0.08]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[14.75, 5.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 0.08, 0.08]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* Centerpiece structure */}
      <group position={[0, 0, -2]}>
        <primitive object={wetFloorSignModel} scale={2.5} />
        <pointLight position={[0, 3.8, 0]} intensity={1.5} color="#ffa500" distance={8} decay={2} castShadow />
      </group>

      {/* Modern Neon Doors */}
      <Door position={[-7, 0, -14.7]} room="room1" label="Rom 1: Agentens Natur" color="#ff2a44" />
      <Door position={[7, 0, -14.7]} room="room2" label="Rom 2: Agenten i Arbeid" color="#10ff70" />
      <Door position={[-14.7, 0, 0]} rotation={[0, Math.PI / 2, 0]} room="room3" label="Rom 3: Tilkoblinger" color="#3080ff" />
      <Door position={[14.7, 0, 0]} rotation={[0, -Math.PI / 2, 0]} room="room4" label="Rom 4: Mestring" color="#ffff30" />
      
      {/* Lights with a shadow-casting DirectionalLight */}
      <directionalLight 
        position={[5, 15, 5]} 
        intensity={0.6} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005}
      />
      <spotLight position={[0, 9, -5]} intensity={1.2} angle={0.7} penumbra={1} castShadow />
    </group>
  );
};

useGLTF.preload("/models/psx_wet_floor_sign/scene.gltf");
useGLTF.preload("/models/office_door_open_40_degrees.glb");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_diff_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_nor_gl_1k.jpg");
useTexture.preload("/textures/laminate_floor_03/laminate_floor_03_rough_1k.jpg");


