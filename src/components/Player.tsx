import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, CapsuleCollider, CuboidCollider, RapierRigidBody, useRapier } from "@react-three/rapier";
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
  const speedFactor = useRef(0);
  const { rapier, world } = useRapier();

  // Teleport player to a safe position inside the room upon room transitions
  useEffect(() => {
    if (rigidBody.current) {
      // Reset velocity to prevent carrying speed through teleportation
      rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBody.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      speedFactor.current = 0; // Reset acceleration ramp

      // Spawn at a safe coordinate depending on the room
      if (currentRoom === "outside") {
        // Start outdoors on the path in front of the house, facing the door
        rigidBody.current.setTranslation({ x: 0, y: 2, z: 12 }, true);
      } else if (currentRoom === "lobby") {
        rigidBody.current.setTranslation({ x: 0, y: 2, z: 3.0 }, true);
      } else if (currentRoom === "room2") {
        rigidBody.current.setTranslation({ x: -6.5, y: 2, z: -5.0 }, true);
      } else if (currentRoom === "room3") {
        rigidBody.current.setTranslation({ x: 3, y: 2, z: 3.0 }, true);
      } else if (currentRoom === "room4") {
        rigidBody.current.setTranslation({ x: -3, y: 2, z: 5.0 }, true);
      }
    }
  }, [currentRoom]);

  const isSpectating = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("view");

  useFrame((state, delta) => {
    if (isSpectating) return;
    if (!rigidBody.current) return;
    const { forward, backward, left, right, jump } = getKeys();
    
    // Check if player is pressing any movement keys
    const isMoving = forward || backward || left || right;
    
    // Velocity ramp-up over 0.4 seconds, fast deceleration (0.15s) when released
    if (isMoving) {
      speedFactor.current = Math.min(1.0, speedFactor.current + delta / 0.4);
    } else {
      speedFactor.current = Math.max(0.0, speedFactor.current - delta / 0.15);
    }

    // Get current velocity and position
    const velocity = rigidBody.current.linvel();
    const pos = rigidBody.current.translation();
    
    // Attach camera to the player body position (with some eye height offset)
    state.camera.position.set(pos.x, pos.y + 1.5, pos.z);
    
    // Calculate movement vector based on camera rotation
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    
    // Normalize and apply ramp-up speed and camera direction
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * speedFactor.current)
      .applyEuler(state.camera.rotation);
    
    let nextVelY = velocity.y;
    const ray = new rapier.Ray(pos, { x: 0, y: -1, z: 0 });
    const maxToi = 1.15; // capsule half-height (0.5) + radius (0.5) + small buffer (0.15)
    const hit = world.castRay(
      ray,
      maxToi,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      (collider) => collider.parent() !== rigidBody.current
    );
    const isGrounded = hit !== null;

    if (jump && isGrounded) {
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
      position={[0, 2, 12]} 
      enabledRotations={[false, false, false]}
      name="player"
    >
      <CapsuleCollider args={[0.5, 0.5]} friction={0} />
      <CuboidCollider args={[0.3, 0.1, 0.3]} position={[0, -0.7, 0]} friction={0} />
      <mesh visible={false}>
        <capsuleGeometry args={[0.5, 1, 4]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </RigidBody>
  );
};
