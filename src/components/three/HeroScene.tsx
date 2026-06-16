"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { thunder } from "@/lib/audio";

/** emblema: disco luminoso com a silhueta do morcego. */
function makeSignalTexture(): THREE.CanvasTexture {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.04, size / 2, size / 2, size * 0.5);
  g.addColorStop(0, "rgba(255,244,200,1)");
  g.addColorStop(0.42, "rgba(255,210,63,0.95)");
  g.addColorStop(0.75, "rgba(255,180,40,0.32)");
  g.addColorStop(1, "rgba(255,170,30,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

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

// ── tempestade (relâmpagos) — estado compartilhado, instância única ──
const STORM = { flash: 0 };
const bgColor = new THREE.Color("#06070b");
const BG_BASE = new THREE.Color("#06070b");
const BG_FLASH = new THREE.Color("#33405e");

function Storm() {
  const dir = useRef<THREE.DirectionalLight>(null);
  const t = useRef(0);
  const next = useRef(0.6);
  useFrame((state, dt) => {
    t.current += dt;
    if (t.current >= next.current) {
      STORM.flash = 1;
      thunder(); // só soa se o usuário ligou o som
      t.current = 0;
      next.current = 2.4 + Math.random() * 5.5;
    }
    STORM.flash = Math.max(0, STORM.flash - dt * 3.2);
    const f = STORM.flash;
    if (dir.current) dir.current.intensity = 0.12 + f * 7;
    bgColor.copy(BG_BASE).lerp(BG_FLASH, f * 0.7);
    state.scene.background = bgColor;
  });
  return <directionalLight ref={dir} position={[4, 9, 6]} color="#dbe7ff" intensity={0.12} />;
}

// ── skyline de Gotham (pré-computado) ──
type Bldg = { x: number; y: number; z: number; w: number; h: number; d: number };
const BUILDINGS: Bldg[] = (() => {
  const list: Bldg[] = [];
  const rowsZ = [-7.5, -5.2, -3.2];
  const baseY = -3.4;
  for (let r = 0; r < rowsZ.length; r++) {
    const z = rowsZ[r];
    const count = 16 - r * 2;
    for (let i = 0; i < count; i++) {
      const w = 0.8 + Math.random() * 1.5;
      const h = (1.4 + Math.random() * 3.4) * (1 + r * 0.18);
      const d = 0.8 + Math.random() * 1.1;
      const x = -13 + (26 / (count - 1)) * i + (Math.random() - 0.5) * 0.9;
      list.push({ x, y: baseY + h / 2, z, w, h, d });
    }
  }
  return list;
})();

const WINDOWS: Float32Array = (() => {
  const pts: number[] = [];
  for (const b of BUILDINGS) {
    const cols = Math.max(1, Math.floor(b.w / 0.3));
    const rows = Math.max(1, Math.floor(b.h / 0.34));
    for (let cxi = 0; cxi < cols; cxi++) {
      for (let ryi = 0; ryi < rows; ryi++) {
        if (Math.random() > 0.28) continue;
        pts.push(
          b.x - b.w / 2 + 0.16 + cxi * (b.w / cols),
          b.y - b.h / 2 + 0.2 + ryi * (b.h / rows),
          b.z + b.d / 2 + 0.02,
        );
      }
    }
  }
  return new Float32Array(pts);
})();

function Skyline() {
  return (
    <group>
      {BUILDINGS.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color="#070910" roughness={1} metalness={0} />
        </mesh>
      ))}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[WINDOWS, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffd98a"
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

// ── chuva ──
const RAIN_N = 340;
const STREAK = 0.55;
const rainBase = (() => {
  const a = new Float32Array(RAIN_N * 6);
  for (let i = 0; i < RAIN_N; i++) {
    const x = (Math.random() - 0.5) * 26;
    const y = (Math.random() - 0.5) * 22;
    const z = (Math.random() - 0.5) * 11 - 1;
    a[i * 6] = x;
    a[i * 6 + 1] = y + STREAK;
    a[i * 6 + 2] = z;
    a[i * 6 + 3] = x;
    a[i * 6 + 4] = y;
    a[i * 6 + 5] = z;
  }
  return a;
})();
const rainSpeed = (() => {
  const a = new Float32Array(RAIN_N);
  for (let i = 0; i < RAIN_N; i++) a[i] = 7 + Math.random() * 7;
  return a;
})();

function Rain() {
  const ref = useRef<THREE.LineSegments>(null);
  const positions = useMemo(() => rainBase.slice(), []);
  useFrame((_, dt) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const a = pos.array as Float32Array;
    for (let i = 0; i < RAIN_N; i++) {
      const d = rainSpeed[i] * dt;
      a[i * 6 + 1] -= d;
      a[i * 6 + 4] -= d;
      if (a[i * 6 + 4] < -11) {
        a[i * 6 + 1] += 22;
        a[i * 6 + 4] += 22;
      }
    }
    pos.needsUpdate = true;
  });
  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#9fc8ff" transparent opacity={0.3} />
    </lineSegments>
  );
}

// ── poeira/brasas ──
const DUST_N = 240;
const dustBase = (() => {
  const a = new Float32Array(DUST_N * 3);
  for (let i = 0; i < DUST_N; i++) {
    a[i * 3] = (Math.random() - 0.5) * 14;
    a[i * 3 + 1] = (Math.random() - 0.5) * 10;
    a[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
  }
  return a;
})();
const dustSpeed = (() => {
  const a = new Float32Array(DUST_N);
  for (let i = 0; i < DUST_N; i++) a[i] = 0.08 + Math.random() * 0.3;
  return a;
})();

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => dustBase.slice(), []);
  useFrame((_, dt) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const a = pos.array as Float32Array;
    for (let i = 0; i < DUST_N; i++) {
      a[i * 3 + 1] += dustSpeed[i] * dt;
      if (a[i * 3 + 1] > 5) a[i * 3 + 1] = -5;
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffe9b0" transparent opacity={0.5} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ── bat-signal: facho + emblema, varre com o mouse e flameja no relâmpago ──
function Signal() {
  const group = useRef<THREE.Group>(null);
  const emblem = useRef<THREE.Mesh>(null);
  const beam = useRef<THREE.MeshBasicMaterial>(null);
  const tex = useMemo(() => makeSignalTexture(), []);
  useFrame((state) => {
    const { pointer, clock } = state;
    if (group.current) {
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -pointer.x * 0.28, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.16, 0.05);
    }
    if (emblem.current) {
      emblem.current.position.y = 6.2 + Math.sin(clock.elapsedTime * 0.8) * 0.09;
      const s = 1 + STORM.flash * 0.06;
      emblem.current.scale.setScalar(s);
    }
    if (beam.current) beam.current.opacity = 0.1 + STORM.flash * 0.25;
  });
  return (
    <group ref={group} position={[0, -2.6, 0]}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[1.7, 0.06, 6, 32, 1, true]} />
        <meshBasicMaterial ref={beam} color="#ffd96b" transparent opacity={0.1} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#fff3c0" toneMapped={false} />
      </mesh>
      <mesh ref={emblem} position={[0, 6.2, 0]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── câmera: só parallax suave do mouse (controlável, sem sequestrar o scroll) ──
function Rig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.45, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.4 + pointer.y * 0.22, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6, 0.04);
    camera.lookAt(0, 0.8, 0);
  });
  return null;
}

export default function HeroScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 6], fov: 48 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true }}
      frameloop={active ? "always" : "never"}
    >
      <fog attach="fog" args={["#06070b", 7, 22]} />
      <ambientLight intensity={0.08} />
      <Storm />
      <Skyline />
      <Rain />
      <Signal />
      <Dust />
      <Rig />
      <EffectComposer>
        <Bloom mipmapBlur intensity={1.0} luminanceThreshold={0.3} luminanceSmoothing={0.3} />
      </EffectComposer>
    </Canvas>
  );
}
