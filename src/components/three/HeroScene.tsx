"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/** Gera a textura do emblema: um disco luminoso com a silhueta do morcego. */
function makeSignalTexture(): THREE.CanvasTexture {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;

  // disco de luz
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.04, size / 2, size / 2, size * 0.5);
  g.addColorStop(0, "rgba(255,244,200,1)");
  g.addColorStop(0.42, "rgba(255,210,63,0.95)");
  g.addColorStop(0.75, "rgba(255,180,40,0.32)");
  g.addColorStop(1, "rgba(255,170,30,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // silhueta do morcego
  const cx = size / 2;
  const cy = size / 2;
  const w = size * 0.34;
  const h = size * 0.17;
  ctx.fillStyle = "rgba(6,7,11,0.94)";
  ctx.beginPath();
  ctx.moveTo(cx, cy - h * 0.35);
  ctx.lineTo(cx - w * 0.12, cy - h * 1.05);
  ctx.lineTo(cx - w * 0.17, cy - h * 0.45);
  ctx.quadraticCurveTo(cx - w * 0.3, cy - h * 0.78, cx - w * 0.46, cy - h * 0.55);
  ctx.quadraticCurveTo(cx - w * 0.56, cy - h * 0.35, cx - w * 0.7, cy - h * 0.55);
  ctx.quadraticCurveTo(cx - w * 0.82, cy - h * 0.28, cx - w * 1.0, cy - h * 0.5);
  ctx.quadraticCurveTo(cx - w * 0.8, cy + h * 0.12, cx - w * 0.82, cy + h * 0.9);
  ctx.quadraticCurveTo(cx - w * 0.62, cy + h * 0.35, cx - w * 0.5, cy + h * 0.98);
  ctx.quadraticCurveTo(cx - w * 0.38, cy + h * 0.45, cx - w * 0.26, cy + h * 0.98);
  ctx.quadraticCurveTo(cx - w * 0.14, cy + h * 0.55, cx, cy + h * 0.72);
  ctx.quadraticCurveTo(cx + w * 0.14, cy + h * 0.55, cx + w * 0.26, cy + h * 0.98);
  ctx.quadraticCurveTo(cx + w * 0.38, cy + h * 0.45, cx + w * 0.5, cy + h * 0.98);
  ctx.quadraticCurveTo(cx + w * 0.62, cy + h * 0.35, cx + w * 0.82, cy + h * 0.9);
  ctx.quadraticCurveTo(cx + w * 0.8, cy + h * 0.12, cx + w * 1.0, cy - h * 0.5);
  ctx.quadraticCurveTo(cx + w * 0.82, cy - h * 0.28, cx + w * 0.7, cy - h * 0.55);
  ctx.quadraticCurveTo(cx + w * 0.56, cy - h * 0.35, cx + w * 0.46, cy - h * 0.55);
  ctx.quadraticCurveTo(cx + w * 0.3, cy - h * 0.78, cx + w * 0.17, cy - h * 0.45);
  ctx.lineTo(cx + w * 0.12, cy - h * 1.05);
  ctx.lineTo(cx, cy - h * 0.35);
  ctx.closePath();
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

// Poeira pré-computada uma vez (escopo de módulo, client-only via import dinâmico).
const DUST_COUNT = 600;
const dustBasePositions = (() => {
  const arr = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 11;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
  }
  return arr;
})();
const dustSpeeds = (() => {
  const arr = new Float32Array(DUST_COUNT);
  for (let i = 0; i < DUST_COUNT; i++) arr[i] = 0.08 + Math.random() * 0.28;
  return arr;
})();

/** Poeira flutuante que sobe pela cena (atmosfera de Gotham). */
function Dust() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => dustBasePositions.slice(), []);

  useFrame((_, dt) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < DUST_COUNT; i++) {
      arr[i * 3 + 1] += dustSpeeds[i] * dt;
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#ffe9b0"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Bat-signal: facho volumétrico + emblema, que varre seguindo o mouse. */
function Signal() {
  const group = useRef<THREE.Group>(null);
  const emblem = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => makeSignalTexture(), []);

  useFrame((state) => {
    const { pointer, clock } = state;
    if (group.current) {
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -pointer.x * 0.28, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.16, 0.05);
    }
    if (emblem.current) {
      emblem.current.position.y = 6.2 + Math.sin(clock.elapsedTime * 0.8) * 0.09;
    }
  });

  return (
    <group ref={group} position={[0, -2.6, 0]}>
      {/* facho de luz (estreito embaixo, largo no topo) */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[1.7, 0.06, 6, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffd96b"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* projetor */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#fff3c0" toneMapped={false} />
      </mesh>
      {/* emblema */}
      <mesh ref={emblem} position={[0, 6.2, 0]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Parallax sutil de câmera com o mouse. */
function Rig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.4 + pointer.y * 0.3, 0.04);
    camera.lookAt(0, 0.6, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0.4, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#06070b"]} />
      <fog attach="fog" args={["#06070b", 6, 17]} />
      <ambientLight intensity={0.2} />
      <Signal />
      <Dust />
      <Rig />
      <EffectComposer>
        <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.25} luminanceSmoothing={0.3} />
      </EffectComposer>
    </Canvas>
  );
}
