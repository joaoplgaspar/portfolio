"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Hero3D v1 — um "produto" premium flutuando sob luz de estúdio.
 * Slab de osso com filete oxblood (a marca), leve e restrito. Sem postprocessing.
 */
function Slab() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.55, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.32, 0.05);
  });

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.6}>
      <group ref={group}>
        <RoundedBox args={[2.5, 3.3, 0.3]} radius={0.14} smoothness={6}>
          <meshStandardMaterial color="#ede8de" roughness={0.45} metalness={0.14} />
        </RoundedBox>
        {/* filete oxblood — detalhe de marca */}
        <mesh position={[0, -1.28, 0.161]}>
          <planeGeometry args={[1.7, 0.055]} />
          <meshBasicMaterial color="#7c2d2d" toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroObject({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      frameloop={active ? "always" : "never"}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} />
      <pointLight position={[-5, -1, 2]} intensity={40} color="#a84343" distance={16} />
      <Slab />
      <ContactShadows
        position={[0, -2.3, 0]}
        opacity={0.38}
        scale={12}
        blur={2.6}
        far={4}
        color="#000000"
      />
    </Canvas>
  );
}
