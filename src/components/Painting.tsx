import * as THREE from "three";

interface LampConfig {
  intensity?: number;
  distance?: number;
  color?: string;
  yOffset?: number;
}

interface PaintingProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  texture: THREE.Texture;
  width: number;
  height: number;
  frameWidth?: number;
  frameHeight?: number;
  frameColor?: string;
  frameRoughness?: number;
  canvasRoughness?: number;
  canvasMetalness?: number;
  lamp?: boolean | LampConfig;
}

export const Painting = ({
  position,
  rotation = [0, 0, 0],
  texture,
  width,
  height,
  frameWidth,
  frameHeight,
  frameColor = "#1a1a1a",
  frameRoughness = 0.8,
  canvasRoughness = 0.3,
  canvasMetalness = 0.0,
  lamp,
}: PaintingProps) => {
  const fWidth = frameWidth ?? (width + 0.2);
  const fHeight = frameHeight ?? (height + 0.2);

  // If lamp config is provided
  const hasLamp = !!lamp;
  const lampConfig = typeof lamp === "object" ? lamp : {};
  const lampIntensity = lampConfig.intensity ?? 8;
  const lampDistance = lampConfig.distance ?? 5;
  const lampColor = lampConfig.color ?? "#fff1dd";
  const lampYOffset = lampConfig.yOffset ?? 1.4;

  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[fWidth, fHeight, 0.08]} />
        <meshStandardMaterial color={frameColor} roughness={frameRoughness} />
      </mesh>
      {/* Canvas */}
      <mesh position={[0, 0, 0.041]} castShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} roughness={canvasRoughness} metalness={canvasMetalness} />
      </mesh>

      {/* Optional Lamp */}
      {hasLamp && (
        <group>
          {/* Support Bar */}
          <mesh position={[0, lampYOffset, 0]}>
            <boxGeometry args={[0.05, 0.05, 0.4]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {/* Cylinder head */}
          <mesh position={[0, lampYOffset - 0.05, 0.2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {/* Point Light */}
          <pointLight
            position={[0, lampYOffset - 0.2, 0.2]}
            intensity={lampIntensity}
            color={lampColor}
            distance={lampDistance}
            decay={2}
            castShadow
          />
        </group>
      )}
    </group>
  );
};
