"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/** progresso do mergulho (0 = superfície, 1 = abismo), via ref para não re-renderizar. */
type Progress = { current: number };

const SURFACE = new THREE.Color("#0e5f70");
const MID = new THREE.Color("#063048");
const ABYSS = new THREE.Color("#01070f");

function depthColor(p: number, out: THREE.Color) {
  if (p < 0.5) out.copy(SURFACE).lerp(MID, p / 0.5);
  else out.copy(MID).lerp(ABYSS, (p - 0.5) / 0.5);
  return out;
}

// Cor e névoa da cena: mutadas a cada frame, então vivem fora dos hooks.
const sceneBg = new THREE.Color("#0e5f70");
const sceneFog = new THREE.Fog("#0e5f70", 4, 16);

// "neve marinha" — partículas pré-computadas (escopo de módulo).
const SNOW = 450;
const snowBase = (() => {
  const a = new Float32Array(SNOW * 3);
  for (let i = 0; i < SNOW; i++) {
    a[i * 3] = (Math.random() - 0.5) * 14;
    a[i * 3 + 1] = (Math.random() - 0.5) * 14;
    a[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
  }
  return a;
})();
const snowSpeed = (() => {
  const a = new Float32Array(SNOW);
  for (let i = 0; i < SNOW; i++) a[i] = 0.05 + Math.random() * 0.15;
  return a;
})();

// pontos bioluminescentes
const BIO = 140;
const bioBase = (() => {
  const a = new Float32Array(BIO * 3);
  for (let i = 0; i < BIO; i++) {
    a[i * 3] = (Math.random() - 0.5) * 12;
    a[i * 3 + 1] = (Math.random() - 0.5) * 12;
    a[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
  }
  return a;
})();

/** Cor de fundo, névoa e câmera mudam com a profundidade. */
function Environment({ progress }: { progress: Progress }) {
  useFrame((state) => {
    const p = progress.current;
    depthColor(p, sceneBg);
    sceneFog.color.copy(sceneBg);
    sceneFog.near = 5 - p * 2.5;
    sceneFog.far = 17 - p * 7;
    state.scene.background = sceneBg;
    state.scene.fog = sceneFog;
    state.camera.position.y = -p * 1.5;
    state.camera.lookAt(0, -p * 1.5, 0);
  });
  return null;
}

function Snow() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => snowBase.slice(), []);
  useFrame((_, dt) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < SNOW; i++) {
      arr[i * 3 + 1] += snowSpeed[i] * dt; // sobe = sensação de descida
      if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -7;
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#cfeeff" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Bioluminescence({ progress }: { progress: Progress }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => bioBase.slice(), []);
  useFrame((_, dt) => {
    if (mat.current) mat.current.opacity = 0.2 + progress.current * 0.8; // brilha mais fundo
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.07}
        color="#2ce6c9"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function makeRayTexture(): THREE.CanvasTexture {
  const w = 64;
  const h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "rgba(190,242,255,0.55)");
  g.addColorStop(1, "rgba(190,242,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  return new THREE.CanvasTexture(c);
}

const RAYS = [
  { x: -3, r: 0.18, s: 1.0 },
  { x: 0.2, r: -0.12, s: 1.3 },
  { x: 3.4, r: 0.22, s: 0.8 },
];

/** Feixes de luz vindos da superfície, que somem conforme você desce. */
function GodRays({ progress }: { progress: Progress }) {
  const tex = useMemo(() => makeRayTexture(), []);
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  useFrame(() => {
    const o = Math.max(0, 1 - progress.current * 1.6) * 0.6;
    for (const m of mats.current) if (m) m.opacity = o;
  });
  return (
    <group position={[0, 4, -2]}>
      {RAYS.map((ry, i) => (
        <mesh key={i} position={[ry.x, 0, 0]} rotation={[0, 0, ry.r]} scale={[ry.s, 1, 1]}>
          <planeGeometry args={[1.6, 10]} />
          <meshBasicMaterial
            ref={(el) => {
              if (el) mats.current[i] = el;
            }}
            map={tex}
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function DiveScene({ progress }: { progress: Progress }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <ambientLight intensity={0.4} />
      <Environment progress={progress} />
      <GodRays progress={progress} />
      <Bioluminescence progress={progress} />
      <Snow />
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.4} />
      </EffectComposer>
    </Canvas>
  );
}
