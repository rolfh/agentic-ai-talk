import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

interface ModelProps {
  /** Poly Haven-id, f.eks. "sofa_03" (se public/models/realistic). */
  id: string;
  /** Teksturoppløsning lastet ned (default 2k). */
  res?: "1k" | "2k" | "4k";
  position?: [number, number, number];
  rotation?: [number, number, number];
  /** Poly Haven-modeller er i virkelig skala (meter) — default 1. */
  scale?: number | [number, number, number];
  /** Sett true for å la modellen blokkere spilleren (boks-collider). */
  solid?: boolean;
}

export const Model = ({
  id,
  res = "2k",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  solid = false,
}: ModelProps) => {
  const { scene } = useGLTF(`/models/realistic/${id}/${id}_${res}.gltf`);

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
