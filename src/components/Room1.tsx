import { RigidBody } from "@react-three/rapier";
import { Text } from "@react-three/drei";
import { AudioZone } from "./AudioZone";


export const Room1 = () => {
  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[20, 0.2, 20]} />
          <meshStandardMaterial color="#0f0f12" roughness={0.8} metalness={0.2} />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 3, -10]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[20, 6, 0.4]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.6} metalness={0.4} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 3, 10]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[20, 6, 0.4]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.6} metalness={0.4} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-10, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 20]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.6} metalness={0.4} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[10, 3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.4, 6, 20]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.6} metalness={0.4} />
        </mesh>
      </RigidBody>

      {/* Ceiling Neon Border */}
      <mesh position={[0, 5.95, -9.75]}>
        <boxGeometry args={[20, 0.08, 0.08]} />
        <meshBasicMaterial color="#ff2a44" toneMapped={false} />
      </mesh>
      <mesh position={[0, 5.95, 9.75]}>
        <boxGeometry args={[20, 0.08, 0.08]} />
        <meshBasicMaterial color="#ff2a44" toneMapped={false} />
      </mesh>
      <mesh position={[-9.75, 5.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 0.08, 0.08]} />
        <meshBasicMaterial color="#ff2a44" toneMapped={false} />
      </mesh>
      <mesh position={[9.75, 5.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 0.08, 0.08]} />
        <meshBasicMaterial color="#ff2a44" toneMapped={false} />
      </mesh>

      {/* Centerpiece Pedestal & Representation of "The Bomb" */}
      <group position={[0, 0, 0]}>
        {/* Pedestal */}
        <RigidBody type="fixed" position={[0, 0.5, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.2, 1.4, 1.0, 32]} />
            <meshStandardMaterial color="#2d2d3a" roughness={0.4} metalness={0.7} />
          </mesh>
        </RigidBody>

        {/* The Bomb Mesh */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color="#111115" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Bomb details - fins */}
        <mesh position={[0, 2.6, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.5, 0.8, 4, 1, true]} />
          <meshStandardMaterial color="#3a3a4a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.73, 0.04, 16, 100]} />
          <meshStandardMaterial color="#ff2a44" roughness={0.5} metalness={0.8} />
        </mesh>
        {/* Glowing warning light */}
        <mesh position={[0, 1.8, 0.72]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ff0000" toneMapped={false} />
        </mesh>
        <pointLight position={[0, 1.8, 0.8]} intensity={1.5} color="#ff0000" distance={5} decay={2} />

        {/* Floating Room Label */}
        <Text
          position={[0, 3.2, 0]}
          fontSize={0.4}
          color="#ff2a44"
          outlineWidth={0.015}
          outlineColor="#ff2a44"
          material-toneMapped={false}
        >
          KJERNEKRAFT & AGENTER
        </Text>
      </group>

      {/* Audio & Subtitle Trigger Zone around the pedestal */}
      {/* Players triggers it when they walk within a 7x7x7 meter box in the center of the room */}
      <AudioZone
        position={[0, 1.5, 0]}
        size={[7, 4, 7]}
        audioUrl="/tts/Generated Audio June 22, 2026 - 1_16PM Da kjernekraft kom -good .mp3"
        subtitleUrl="/tts/Generated Audio June 22, 2026 - 1_16PM Da kjernekraft kom -good .json"
      />

      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[2, 10, 2]} intensity={0.5} castShadow />
      <spotLight position={[0, 8, 0]} angle={0.5} penumbra={1} intensity={2.5} castShadow color="#ffaaaa" />
    </group>
  );
};
