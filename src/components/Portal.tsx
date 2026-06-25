import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useStore } from "../store";
import { Text } from "@react-three/drei";
import { Furniture } from "./Furniture";

interface PortalProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  room: 'lobby' | 'room2' | 'room3' | 'room4';
  label: string;
  color: string;
}

export const Portal = ({ position, rotation = [0, 0, 0], room, label, color }: PortalProps) => {
  const setRoom = useStore((state) => state.setRoom);

  return (
    <group position={position} rotation={rotation} scale={[1.5, 1.5, 1.5]}>
      {/* Dark recessed doorway background - sized to fit the opening */}
      <mesh position={[0, 2.0, -0.1]} receiveShadow>
        <planeGeometry args={[1.7, 3.9]} />
        <meshStandardMaterial 
          color="#1a140d" 
          emissive="#2a1605" 
          emissiveIntensity={0.2}
          roughness={1} 
          metalness={0} 
        />
      </mesh>
      
      {/* The doorway Furniture model - scaled to fit the 4.12 height frame */}
      <Furniture name="doorwayOpen" scale={4.0} position={[0, 0, 0]} />

      {/* Doormat at the threshold */}
      <Furniture name="rugDoormat" scale={3.5} position={[0, 0.01, 1.0]} />

      {/* Warm inviting light at the threshold */}
      <pointLight position={[0, 1.0, 0.5]} intensity={1.5} distance={4} color="#ffcc88" />

      <RigidBody type="fixed" colliders={false}>
        {/* Door frame colliders (left and right) */}
        <CuboidCollider args={[0.05, 2.06, 0.05]} position={[-1.05, 2.06, 0]} />
        <CuboidCollider args={[0.05, 2.06, 0.05]} position={[1.05, 2.06, 0]} />
      </RigidBody>
      
      <RigidBody type="fixed">
        {/* Sensor to change rooms */}
        <CuboidCollider 
          args={[1.0, 2, 0.2]} 
          position={[0, 2, -0.2]} 
          sensor 
          onIntersectionEnter={() => setRoom(room)}
        />
      </RigidBody>

      <Text 
        position={[0, 4.4, 0]} 
        fontSize={0.35} 
        color={color} 
        anchorY="bottom"
        outlineWidth={0.005}
        outlineColor={color}
        material-toneMapped={true}
      >
        {label}
      </Text>
    </group>
  );
};

