"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/** progresso da descida (0 = entrada, 1 = fundo da caverna). */
type Progress = { current: number };

const dummy = new THREE.Object3D();

// ── ambiente: cor + névoa por profundidade ──
const caveBg = new THREE.Color("#0b0b12");
const caveFog = new THREE.Fog("#0b0b12", 5, 18);
const TOP = new THREE.Color("#0c0c14");
const MID = new THREE.Color("#06080f");
const DEEP = new THREE.Color("#020308");

function CaveEnv({ progress }: { progress: Progress }) {
  useFrame((state) => {
    const p = progress.current;
    if (p < 0.5) caveBg.copy(TOP).lerp(MID, p / 0.5);
    else caveBg.copy(MID).lerp(DEEP, (p - 0.5) / 0.5);
    caveFog.color.copy(caveBg);
    caveFog.near = 5 - p * 2;
    caveFog.far = 18 - p * 6;
    state.scene.background = caveBg;
    state.scene.fog = caveFog;
  });
  return null;
}

// ── silhueta do morcego (transparente) p/ o enxame ──
function makeBatTexture(): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  const w = size * 0.46;
  const h = size * 0.22;
  ctx.fillStyle = "#04050a";
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
  tex.anisotropy = 2;
  return tex;
}

const BAT_N = 72;
const batData = Array.from({ length: BAT_N }, () => ({
  x: (Math.random() - 0.5) * 16,
  y: (Math.random() - 0.5) * 16,
  z: (Math.random() - 0.5) * 9 - 1,
  speed: 0.8 + Math.random() * 1.7,
  phase: Math.random() * Math.PI * 2,
  flap: 5 + Math.random() * 6,
  size: 0.22 + Math.random() * 0.5,
  sway: 0.3 + Math.random() * 0.9,
}));

function Bats() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const tex = useMemo(() => makeBatTexture(), []);
  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < BAT_N; i++) {
      const b = batData[i];
      b.y += b.speed * dt; // sobem = sensação de descida
      if (b.y > 8) b.y = -8;
      dummy.position.set(b.x + Math.sin(t * 0.5 + b.phase) * b.sway, b.y, b.z);
      const flap = 0.32 + Math.abs(Math.sin(t * b.flap + b.phase)) * 0.68;
      dummy.scale.set(b.size * flap, b.size, 1);
      dummy.rotation.z = Math.sin(t * 0.7 + b.phase) * 0.22;
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, BAT_N]} frustumCulled={false}>
      <planeGeometry args={[1, 0.7]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

// ── rocha (estalactites/estalagmites) ──
type Rock = { x: number; y: number; z: number; r: number; h: number; flip: boolean };
const ROCKS: Rock[] = [
  { x: -5.5, y: 6, z: -4, r: 0.9, h: 4, flip: true },
  { x: 5.2, y: 6.5, z: -5, r: 1.1, h: 5, flip: true },
  { x: -3, y: 7, z: -6, r: 0.7, h: 3, flip: true },
  { x: 3.4, y: 7.2, z: -3.5, r: 0.6, h: 3.4, flip: true },
  { x: -6, y: -8.5, z: -4, r: 1.2, h: 4.5, flip: false },
  { x: 5.8, y: -9, z: -5, r: 1, h: 4, flip: false },
];

function Rocks() {
  return (
    <group>
      {ROCKS.map((r, i) => (
        <mesh key={i} position={[r.x, r.y, r.z]} rotation={[0, 0, r.flip ? Math.PI : 0]}>
          <coneGeometry args={[r.r, r.h, 7]} />
          <meshStandardMaterial color="#0a0b12" roughness={1} metalness={0} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// ── cachoeira (entrada da Batcave) ──
const waterTex = makeWaterTexture();
function makeWaterTexture(): THREE.CanvasTexture {
  const w = 64;
  const h = 128;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  for (let i = 0; i < 28; i++) {
    const x = Math.random() * w;
    const a = 0.05 + Math.random() * 0.22;
    ctx.fillStyle = `rgba(180,225,255,${a})`;
    ctx.fillRect(x, 0, 1 + Math.random() * 1.6, h);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2.5);
  return tex;
}

function Waterfall() {
  useFrame((_, dt) => {
    waterTex.offset.y -= dt * 0.7;
  });
  return (
    <mesh position={[-6.5, -1, -5]} rotation={[0, 0.5, 0]}>
      <planeGeometry args={[3.5, 16]} />
      <meshBasicMaterial map={waterTex} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

// ── Batcomputador: brilho azul que cresce com a profundidade ──
function Batcomputer({ progress }: { progress: Progress }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const i = Math.max(0, (progress.current - 0.35) / 0.65);
    if (mat.current) mat.current.opacity = 0.12 + i * 0.85;
    if (light.current) light.current.intensity = i * 9;
  });
  return (
    <group position={[0, -6, -3]}>
      <mesh>
        <planeGeometry args={[7.5, 2.8]} />
        <meshBasicMaterial ref={mat} color="#2ad4ff" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 1, 1.5]} color="#39c6ff" intensity={0} distance={16} />
    </group>
  );
}

// ── Batmóvel: revelado no fundo ──
function Batmobile({ progress }: { progress: Progress }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    const v = Math.max(0, (progress.current - 0.72) / 0.28);
    if (group.current) {
      group.current.visible = v > 0.01;
      group.current.scale.setScalar(0.6 + v * 0.4);
    }
  });
  return (
    <group ref={group} position={[0, -9.4, -1]} visible={false}>
      <mesh>
        <boxGeometry args={[3.6, 0.5, 1.5]} />
        <meshStandardMaterial color="#050609" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.36, -0.1]}>
        <boxGeometry args={[1.7, 0.42, 1.1]} />
        <meshStandardMaterial color="#050609" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[-1.85, 0.12, 0]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshBasicMaterial color="#ff2a2a" toneMapped={false} />
      </mesh>
      <mesh position={[1.85, 0.12, 0]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshBasicMaterial color="#ff2a2a" toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── luz da entrada (some na descida) + raios de luz do topo ──
function EntranceLight({ progress }: { progress: Progress }) {
  const l = useRef<THREE.PointLight>(null);
  const rays = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const fade = Math.max(0, 1 - progress.current * 1.5);
    if (l.current) l.current.intensity = fade * 2.4;
    if (rays.current) rays.current.opacity = fade * 0.4;
  });
  return (
    <group>
      <pointLight ref={l} position={[0, 7, 2]} color="#ffd9a0" intensity={2.4} distance={18} />
      <mesh position={[0.5, 5, -2]} rotation={[0, 0, 0.12]}>
        <planeGeometry args={[3, 12]} />
        <meshBasicMaterial ref={rays} color="#ffe6bd" transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── brasas/poeira ──
const EMBER_N = 220;
const emberBase = (() => {
  const a = new Float32Array(EMBER_N * 3);
  for (let i = 0; i < EMBER_N; i++) {
    a[i * 3] = (Math.random() - 0.5) * 14;
    a[i * 3 + 1] = (Math.random() - 0.5) * 18;
    a[i * 3 + 2] = (Math.random() - 0.5) * 9 - 1;
  }
  return a;
})();
const emberSpeed = (() => {
  const a = new Float32Array(EMBER_N);
  for (let i = 0; i < EMBER_N; i++) a[i] = 0.1 + Math.random() * 0.3;
  return a;
})();

function Embers() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => emberBase.slice(), []);
  useFrame((_, dt) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const a = pos.array as Float32Array;
    for (let i = 0; i < EMBER_N; i++) {
      a[i * 3 + 1] += emberSpeed[i] * dt;
      if (a[i * 3 + 1] > 9) a[i * 3 + 1] = -9;
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#9fdcff" transparent opacity={0.5} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Rig({ progress }: { progress: Progress }) {
  useFrame((state) => {
    const p = progress.current;
    const { camera, pointer } = state;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.5 - p * 8.6 + pointer.y * 0.3, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6.5, 0.05);
    camera.lookAt(0, -p * 8.6, -1);
  });
  return null;
}

export default function BatcaveScene({
  progress,
  active = true,
}: {
  progress: Progress;
  active?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 6.5], fov: 52 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true }}
      frameloop={active ? "always" : "never"}
    >
      <ambientLight intensity={0.12} />
      <CaveEnv progress={progress} />
      <EntranceLight progress={progress} />
      <Rocks />
      <Waterfall />
      <Bats />
      <Batcomputer progress={progress} />
      <Batmobile progress={progress} />
      <Embers />
      <Rig progress={progress} />
      <EffectComposer>
        <Bloom mipmapBlur intensity={1.0} luminanceThreshold={0.25} luminanceSmoothing={0.35} />
      </EffectComposer>
    </Canvas>
  );
}
