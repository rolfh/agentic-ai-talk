import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

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

const realisticIds = [
  "ArmChair_01",
  "SchoolChair_01",
  "Television_01",
  "book_encyclopedia_set_01",
  "classic_laptop",
  "desk_lamp_arm_01",
  "drawer_cabinet",
  "korean_public_payphone_01",
  "metal_office_desk",
  "mid_century_lounge_chair",
  "modern_arm_chair_01",
  "modern_ceiling_lamp_01",
  "modern_coffee_table_01",
  "potted_plant_01",
  "potted_plant_02",
  "round_wooden_table_01",
  "side_table_01",
  "sofa_03",
  "vintage_oil_lamp",
  "wooden_bookshelf_worn",
];

export const Model = ({
  id,
  res = "2k",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  solid = false,
}: ModelProps) => {
  const modelPath = useMemo(() => {
    if (realisticIds.includes(id)) {
      return `/models/realistic/${id}/${id}_${res}.gltf`;
    }
    const baseId = id.endsWith("_1k") ? id : `${id}_1k`;
    return `/models/${baseId}.gltf/${baseId}.gltf`;
  }, [id, res]);

  const { scene } = useGLTF(modelPath);

  const cloned = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const stdMat = mat as THREE.MeshStandardMaterial;
              // Make things less shiny
              stdMat.roughness = Math.max(stdMat.roughness ?? 0, 0.65);
              if (stdMat.metalness > 0.8) {
                stdMat.roughness = Math.max(stdMat.roughness, 0.45);
              } else {
                stdMat.metalness = Math.min(stdMat.metalness ?? 0, 0.1);
              }
            }
          });
        }
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
