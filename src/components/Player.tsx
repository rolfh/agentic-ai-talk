import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, CapsuleCollider, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useStore } from "../store";

const SPEED = 14;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export const Player = () => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const [, getKeys] = useKeyboardControls();
  const currentRoom = useStore((state) => state.currentRoom);

  // Teleport player to a safe position inside the room upon room transitions
  useEffect(() => {
    if (rigidBody.current) {
      // Reset velocity to prevent carrying speed through teleportation
      rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBody.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      // Spawn at a safe coordinate depending on the room
      if (currentRoom === "lobby") {
        rigidBody.current.setTranslation({ x: 0, y: 2, z: 0 }, true);
      } else {
        // Place player near the entry of the selected exhibition room (within its floor limits)
        rigidBody.current.setTranslation({ x: 0, y: 2, z: 10 }, true);
      }
    }
  }, [currentRoom]);


  useFrame((state) => {
    if (!rigidBody.current) return;
    const { forward, backward, left, right, jump } = getKeys();
    
    // Get current velocity and position
    const velocity = rigidBody.current.linvel();
    const pos = rigidBody.current.translation();
    
    // Attach camera to the player body position (with some eye height offset)
    state.camera.position.set(pos.x, pos.y + 1.5, pos.z);
    
    // Calculate movement vector based on camera rotation
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    
    // Normalize and apply speed and camera direction
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);
    
    let nextVelY = velocity.y;
    if (jump && Math.abs(velocity.y) < 0.05) {
      nextVelY = 7;
    }
    
    // Update velocity, keeping the Y velocity for gravity/jumping
    rigidBody.current.setLinvel({ x: direction.x, y: nextVelY, z: direction.z }, true);
  });

  return (
    <RigidBody 
      ref={rigidBody} 
      colliders={false} 
      mass={1} 
      type="dynamic" 
      position={[0, 2, 0]} 
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.5, 0.5]} />
      <mesh visible={false}>
        <capsuleGeometry args={[0.5, 1, 4]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </RigidBody>
  );
};
