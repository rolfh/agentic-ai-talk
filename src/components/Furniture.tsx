import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

interface FurnitureProps {
  /** Filnavn uten endelse, f.eks. "loungeSofa" (se public/models/furniture). */
  name: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  /** Default 2 → Kenney-møblene blir omtrent virkelig størrelse. */
  scale?: number | [number, number, number];
  /** Sett true for å la møbelet blokkere spilleren (boks-collider). */
  solid?: boolean;
}

export const Furniture = ({
  name,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 2,
  solid = false,
}: FurnitureProps) => {
  const { scene } = useGLTF(`/models/furniture/${name}.glb`);

  const cloned = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as { isMesh?: boolean }).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  const model = (
    <primitive object={cloned} position={position} rotation={rotation} scale={scale} />
  );

  if (solid) {
    return (
      <RigidBody type="fixed" colliders="cuboid">
        {model}
      </RigidBody>
    );
  }
  return model;
};
