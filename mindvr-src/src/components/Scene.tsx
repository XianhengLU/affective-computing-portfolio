import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Html,
  Lightformer,
  MeshReflectorMaterial,
  RoundedBox,
  Sparkles,
  useGLTF,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { DoubleSide, Plane, RepeatWrapping, Vector2, Vector3, type Group, type Mesh, type Object3D } from "three";
import * as THREE from "three";
import type { RiskLevel } from "../types";
import CatPlay from "./CatPlay";

export type HotspotId = "breathing" | "board" | "window" | "shelf";

interface Palette {
  floor: string;
  wall: string;
  accent: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  particles: number;
  breath: number;
  light: number;
}

const PALETTE: Record<RiskLevel, Palette> = {
  normal: {
    floor: "#101a20", wall: "#0d1620", accent: "#2fbf71", fog: "#0a1a16",
    fogNear: 14, fogFar: 40, particles: 70, breath: 0.9, light: 18,
  },
  mild: {
    floor: "#1a1710", wall: "#15130d", accent: "#e0b32c", fog: "#171207",
    fogNear: 13, fogFar: 36, particles: 95, breath: 1.2, light: 17,
  },
  moderate: {
    floor: "#1d1410", wall: "#17110d", accent: "#e07b39", fog: "#1b1008",
    fogNear: 12, fogFar: 32, particles: 120, breath: 1.5, light: 16,
  },
  severe: {
    floor: "#1d1010", wall: "#170d0d", accent: "#d64b4b", fog: "#1c0a0a",
    fogNear: 10, fogFar: 28, particles: 150, breath: 1.9, light: 15,
  },
};

/* ==========================================================================
   程序化纹理 —— 全部离线生成，不依赖任何外部贴图资源
   ========================================================================== */
function makeWoodTexture(base: string, dark: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 512);
  /* 纵向木纹：一条条深浅交替的细线，带轻微波动 */
  for (let i = 0; i < 90; i++) {
    const x0 = Math.random() * 512;
    const w = 1 + Math.random() * 5;
    ctx.globalAlpha = 0.06 + Math.random() * 0.16;
    ctx.fillStyle = Math.random() > 0.5 ? dark : base;
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    for (let y = 0; y <= 512; y += 32) {
      ctx.lineTo(x0 + Math.sin(y * 0.02 + i) * 6, y);
    }
    ctx.lineWidth = w;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.stroke();
  }
  /* 稀疏的木节 */
  for (let i = 0; i < 5; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = dark;
    for (let r = 3; r < 16; r += 4) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 1.7, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  return texture;
}

function makePlasterTexture(base: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 256);
  /* 细腻噪点，避免大面积纯色显得"塑料" */
  for (let i = 0; i < 2600; i++) {
    ctx.globalAlpha = 0.02 + Math.random() * 0.05;
    ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#000000";
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(6, 2);
  return texture;
}

/* ==========================================================================
   GLB 模型加载 —— 真实 PBR 资产，替代「盒子拼装」
   来源均为官方开放样例库（three.js examples / Khronos glTF-Sample-Assets），
   授权宽松可自由分发。统一做「归一化」：按目标尺寸缩放、底部落地、
   平面对齐几何中心，这样完全不用关心每个模型原始的坐标约定。
   ========================================================================== */
function GLBModel({
  url,
  position,
  rotation,
  targetHeight,
  targetWidth,
  anchor = "bottom",
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  targetHeight?: number;
  targetWidth?: number;
  anchor?: "bottom" | "top";
}) {
  const { scene } = useGLTF(url);
  const inner = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const scale = targetHeight
      ? targetHeight / Math.max(size.y, 1e-4)
      : (targetWidth ?? size.x) / Math.max(size.x, 1e-4);
    clone.scale.setScalar(scale);
    const box2 = new THREE.Box3().setFromObject(clone);
    const center = box2.getCenter(new THREE.Vector3());
    clone.position.x -= center.x;
    clone.position.z -= center.z;
    clone.position.y -= anchor === "top" ? box2.max.y : box2.min.y;
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene, targetHeight, targetWidth, anchor]);
  return <primitive object={inner} position={position} rotation={rotation ?? [0, 0, 0]} />;
}

/* ==========================================================================
   房间外壳：地板 / 天花板 / 四墙 / 踢脚线 / 护墙板 / 顶角线 / 角柱
   ========================================================================== */
const ROOM = { half: 9, height: 4 };

function RoomShell({ palette }: { palette: Palette }) {
  const plaster = useMemo(() => makePlasterTexture(palette.wall), [palette.wall]);
  const woodDark = useMemo(() => makeWoodTexture("#241a12", "#0e0a06"), []);

  const skirting = "#1b1512";
  const rail = "#141a20";

  return (
    <group>
      {/* 反光地板：实时镜像反射，模糊一点更有"抛光石材"感 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.half * 2, ROOM.half * 2]} />
        <MeshReflectorMaterial
          resolution={1024}
          blur={[420, 110]}
          mixBlur={0.9}
          mixStrength={1.6}
          depthScale={0.6}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.2}
          mirror={0.42}
          color={palette.floor}
          metalness={0.28}
          roughness={0.82}
        />
      </mesh>

      {/* 中央地毯：压住反射面，划定休息区 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.4]}>
        <circleGeometry args={[3.4, 64]} />
        <meshStandardMaterial color="#10161f" roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0.4]}>
        <ringGeometry args={[3.05, 3.4, 64]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.16} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0.4]}>
        <ringGeometry args={[2.1, 2.16, 64]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.1} />
      </mesh>

      {/* 天花板 + 中央吊顶槽 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, 0]}>
        <planeGeometry args={[ROOM.half * 2, ROOM.half * 2]} />
        <meshStandardMaterial color="#0a0e15" roughness={0.95} />
      </mesh>
      <mesh position={[0, ROOM.height - 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.6, 3.0, 64]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.08} side={DoubleSide} />
      </mesh>

      {/* 四面墙（贴了细腻噪点材质，不再是大面积纯色） */}
      <mesh position={[0, 2, -ROOM.half]} receiveShadow>
        <planeGeometry args={[18, 4]} />
        <meshStandardMaterial map={plaster} color={palette.wall} roughness={0.92} />
      </mesh>
      <mesh position={[-ROOM.half, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[18, 4]} />
        <meshStandardMaterial map={plaster} color={palette.wall} roughness={0.92} />
      </mesh>
      <mesh position={[ROOM.half, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[18, 4]} />
        <meshStandardMaterial map={plaster} color={palette.wall} roughness={0.92} />
      </mesh>
      <mesh position={[0, 2, ROOM.half]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[18, 4]} />
        <meshStandardMaterial map={plaster} color={palette.wall} roughness={0.92} />
      </mesh>

      {/* 踢脚线（四面） */}
      {[
        { p: [0, 0.12, -ROOM.half + 0.02], r: 0 },
        { p: [0, 0.12, ROOM.half - 0.02], r: Math.PI },
        { p: [-ROOM.half + 0.02, 0.12, 0], r: Math.PI / 2 },
        { p: [ROOM.half - 0.02, 0.12, 0], r: -Math.PI / 2 },
      ].map((s, i) => (
        <mesh key={i} position={s.p as [number, number, number]} rotation={[0, s.r, 0]}>
          <boxGeometry args={[17.6, 0.24, 0.06]} />
          <meshStandardMaterial color={skirting} roughness={0.6} metalness={0.1} />
        </mesh>
      ))}

      {/* 护墙板竖条（后墙与左右墙各一排，形成节奏感） */}
      {Array.from({ length: 14 }, (_, i) => -6.5 + i * 1.0).map((x) => (
        <mesh key={`bw${x}`} position={[x, 1.05, -ROOM.half + 0.03]}>
          <boxGeometry args={[0.55, 1.7, 0.02]} />
          <meshStandardMaterial color={rail} roughness={0.7} metalness={0.16} />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => -5.5 + i * 1.0).map((z) => (
        <mesh key={`bl${z}`} position={[-ROOM.half + 0.03, 1.05, z]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.55, 1.7, 0.02]} />
          <meshStandardMaterial color={rail} roughness={0.7} metalness={0.16} />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => -5.5 + i * 1.0).map((z) => (
        <mesh key={`br${z}`} position={[ROOM.half - 0.03, 1.05, z]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[0.55, 1.7, 0.02]} />
          <meshStandardMaterial color={rail} roughness={0.7} metalness={0.16} />
        </mesh>
      ))}

      {/* 护墙板顶腰线 */}
      {[
        { p: [0, 1.95, -ROOM.half + 0.04], r: 0 },
        { p: [0, 1.95, ROOM.half - 0.04], r: Math.PI },
        { p: [-ROOM.half + 0.04, 1.95, 0], r: Math.PI / 2 },
        { p: [ROOM.half - 0.04, 1.95, 0], r: -Math.PI / 2 },
      ].map((s, i) => (
        <mesh key={i} position={s.p as [number, number, number]} rotation={[0, s.r, 0]}>
          <boxGeometry args={[17.6, 0.06, 0.05]} />
          <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.35} metalness={0.4} roughness={0.4} />
        </mesh>
      ))}

      {/* 四根角柱 + 顶角线 */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <group key={i} position={[sx * (ROOM.half - 0.3), 0, sz * (ROOM.half - 0.3)]}>
          <mesh position={[0, 2, 0]} castShadow>
            <boxGeometry args={[0.6, 4, 0.6]} />
            <meshStandardMaterial color="#11161d" roughness={0.8} metalness={0.15} />
          </mesh>
          <mesh position={[0, ROOM.height - 0.12, 0]}>
            <boxGeometry args={[0.7, 0.1, 0.7]} />
            <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* 靠墙置物台（木纹），右侧墙根 */}
      <mesh position={[8.2, 0.3, -3.2]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.06, 4.4]} />
        <meshStandardMaterial map={woodDark} color="#8a705a" roughness={0.55} metalness={0.08} />
      </mesh>
      {[-5.0, -3.8, -2.6, -1.4].map((z) => (
        <mesh key={z} position={[8.2, 0.15, z]}>
          <boxGeometry args={[0.5, 0.3, 0.12]} />
          <meshStandardMaterial color="#181210" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ==========================================================================
   假窗：发光窗体 + 窗框 + 百叶片 + 投在地板上的光斑
   ========================================================================== */
function FakeWindow({
  x,
  palette,
}: {
  x: number;
  palette: Palette;
}) {
  const pane = "#bcd8ff";
  const frame = "#1c232c";
  return (
    <group position={[x, 2.15, -ROOM.half + 0.06]}>
      {/* 发光窗面 */}
      <mesh>
        <planeGeometry args={[1.7, 1.5]} />
        <meshBasicMaterial color={pane} transparent opacity={0.32} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.7, 1.5]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.05} />
      </mesh>
      {/* 窗框：外框 + 十字棂 */}
      {[
        { p: [0, 0.78, 0.03], s: [1.86, 0.1, 0.07] },
        { p: [0, -0.78, 0.03], s: [1.86, 0.1, 0.07] },
        { p: [-0.88, 0, 0.03], s: [0.1, 1.66, 0.07] },
        { p: [0.88, 0, 0.03], s: [0.1, 1.66, 0.07] },
        { p: [0, 0, 0.03], s: [1.76, 0.05, 0.05] },
        { p: [0, 0, 0.03], s: [0.05, 1.6, 0.05] },
      ].map((b, i) => (
        <mesh key={i} position={b.p as [number, number, number]}>
          <boxGeometry args={b.s as [number, number, number]} />
          <meshStandardMaterial color={frame} roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
      {/* 百叶片 */}
      {Array.from({ length: 5 }, (_, i) => -0.55 + i * 0.28).map((y) => (
        <mesh key={y} position={[0, y, 0.05]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[1.7, 0.1, 0.02]} />
          <meshStandardMaterial color="#2a3340" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
      {/* 窗台 */}
      <mesh position={[0, -0.92, 0.12]}>
        <boxGeometry args={[2.0, 0.08, 0.3]} />
        <meshStandardMaterial color={frame} roughness={0.6} />
      </mesh>
      {/* 地板光斑 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.14, 3.4]}>
        <planeGeometry args={[1.7, 4.6]} />
        <meshBasicMaterial color={pane} transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

/* ==========================================================================
   家具 —— 全部换成真实 GLB 资产
   ========================================================================== */
/* 绒面沙发（Khronos GlamVelvetSofa）：真实的织物 Sheen 材质与曲面造型 */
function Sofa() {
  return (
    <GLBModel
      url="models/GlamVelvetSofa.glb"
      position={[6.3, 0, -5.2]}
      rotation={[0, -Math.PI / 2 - 0.5, 0]}
      targetWidth={2.4}
    />
  );
}

/* 设计师单椅（three.js SheenChair）：沙发对面的会客位 */
function LoungeChair({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <GLBModel
      url="models/SheenChair.glb"
      position={position}
      rotation={[0, rotation, 0]}
      targetHeight={0.95}
    />
  );
}

/* 盆栽（Khronos DiffuseTransmissionPlant）：真实叶片拓扑，替换锥形叶拼装 */
function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <GLBModel
      url="models/DiffuseTransmissionPlant.glb"
      position={position}
      targetHeight={1.55 * scale}
    />
  );
}

/* 复古车间吊灯（three.js AnisotropyBarnLamp）：顶部锚定挂上天花板 */
function CeilingLamp({ x, z, palette }: { x: number; z: number; palette: Palette }) {
  return (
    <group position={[x, 0, z]}>
      {/* 吊杆 */}
      <mesh position={[0, 3.78, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.44, 8]} />
        <meshStandardMaterial color="#20242b" metalness={0.6} roughness={0.4} />
      </mesh>
      <GLBModel
        url="models/AnisotropyBarnLamp.glb"
        position={[0, ROOM.height - 0.62, 0]}
        anchor="top"
        targetHeight={0.62}
      />
      {/* 灯下补光 + 地面光晕 */}
      <pointLight position={[0, 2.95, 0]} intensity={2.2} distance={7} color="#ffd9a0" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.1, 40]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

/* 沙发旁的边几 + 鸢尾灯（three.js IridescenceLamp）：会客区氛围光源 */
function LampTable() {
  const wood = useMemo(() => makeWoodTexture("#241c15", "#0e0a07"), []);
  return (
    <group position={[7.9, 0, -3.1]}>
      <mesh position={[0, 0.27, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.26, 0.54, 20]} />
        <meshStandardMaterial map={wood} color="#6d5644" roughness={0.6} />
      </mesh>
      <GLBModel url="models/IridescenceLamp.glb" position={[0, 0.54, 0]} targetHeight={0.58} />
      <pointLight position={[0, 1.05, 0]} intensity={1.6} distance={5} color="#cfe0ff" />
    </group>
  );
}

/* 咖啡角：左墙边柜 + 马克杯（three.js coffeeMug）+ 一摞书 */
function CoffeeCorner() {
  const wood = useMemo(() => makeWoodTexture("#2a221b", "#120d09"), []);
  const bookColors = ["#5a4632", "#6e3b3b", "#34506b", "#4c5a37"];
  return (
    <group position={[-8.45, 0, -4.6]} rotation={[0, Math.PI / 2, 0]}>
      {/* 边柜：柜身 + 门缝线 + 台面 */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.9, 0.55]} />
        <meshStandardMaterial map={wood} color="#6d5644" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.45, 0.278]}>
        <planeGeometry args={[1.34, 0.74]} />
        <meshStandardMaterial color="#120d09" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.925, 0]} castShadow>
        <boxGeometry args={[1.56, 0.05, 0.6]} />
        <meshStandardMaterial map={wood} color="#8a705a" roughness={0.5} />
      </mesh>
      {/* 马克杯 */}
      <GLBModel
        url="models/coffeeMug.glb"
        position={[0.4, 0.95, 0.06]}
        rotation={[0, 0.7, 0]}
        targetHeight={0.14}
      />
      {/* 一摞随手放的书 */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[-0.42, 0.975 + i * 0.045, 0]}
          rotation={[0, i * 0.06, 0]}
          castShadow
        >
          <boxGeometry args={[0.26, 0.042, 0.19]} />
          <meshStandardMaterial color={bookColors[i % bookColors.length]} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Bookshelf({ palette }: { palette: Palette }) {
  const wood = useMemo(() => makeWoodTexture("#26201a", "#0f0b08"), []);
  const bookColors = ["#5a4632", "#6e3b3b", "#34506b", "#4c5a37", "#705a2c", "#403a5c", "#5c4a41"];
  /* 靠左墙的立式书架：4 层板 + 两块侧板 + 每层一排书 */
  const layers = [0.32, 0.92, 1.52, 2.12];
  return (
    <group position={[-ROOM.half + 0.4, 0, 2.6]} rotation={[0, Math.PI / 2, 0]}>
      {/* 侧板 */}
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} position={[x, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 2.5, 0.34]} />
          <meshStandardMaterial map={wood} color="#7a6350" roughness={0.6} metalness={0.05} />
        </mesh>
      ))}
      {/* 背板 */}
      <mesh position={[0, 1.25, -0.16]}>
        <boxGeometry args={[1.3, 2.5, 0.03]} />
        <meshStandardMaterial color="#191410" roughness={0.9} />
      </mesh>
      {/* 层板 */}
      {layers.map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.045, 0.34]} />
          <meshStandardMaterial map={wood} color="#8a705a" roughness={0.55} metalness={0.05} />
        </mesh>
      ))}
      {/* 顶板 + 底板 */}
      {[2.44, 0.06].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <boxGeometry args={[1.34, 0.06, 0.36]} />
          <meshStandardMaterial map={wood} color="#8a705a" roughness={0.55} />
        </mesh>
      ))}
      {/* 每层一排书：高度/厚度/颜色随机，留几个缺口 */}
      {layers.slice(0, 3).map((y, li) =>
        Array.from({ length: 9 }, (_, i) => {
          if ((li + i) % 5 === 3) return null; /* 缺口更自然 */
          const h = 0.24 + ((i * 7 + li * 3) % 5) * 0.028;
          const t = 0.035 + ((i * 5) % 4) * 0.012;
          return (
            <mesh
              key={`${y}-${i}`}
              position={[-0.52 + i * 0.125, y + 0.023 + h / 2, 0.02]}
              rotation={[0, 0, (i % 4 === 2 ? -0.06 : 0)]}
              castShadow
            >
              <boxGeometry args={[t, h, 0.24]} />
              <meshStandardMaterial
                color={bookColors[(i + li * 3) % bookColors.length]}
                roughness={0.85}
              />
            </mesh>
          );
        })
      )}
      {/* 顶层摆件：小球 + 相框 */}
      <mesh position={[-0.3, 2.56, 0.02]} castShadow>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.4} roughness={0.4} />
      </mesh>
      <group position={[0.3, 2.56, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.16, 0.02]} />
          <meshStandardMaterial color="#2a221a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.16, 0.11]} />
          <meshBasicMaterial color={palette.accent} transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  );
}

/* ==========================================================================
   交互热点（原有逻辑保留，外观精修）
   ========================================================================== */
function BreathingOrb({
  color,
  speed,
  onSelect,
  active,
}: {
  color: string;
  speed: number;
  onSelect: () => void;
  active: boolean;
}) {
  const core = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const outer = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scale = 1 + Math.sin(t * speed) * 0.12;
    if (core.current) {
      core.current.scale.setScalar(scale);
    }
    if (halo.current) {
      halo.current.scale.setScalar(1 + Math.sin(t * speed + 0.6) * 0.1);
      halo.current.rotation.z = t * 0.12;
    }
    if (outer.current) {
      outer.current.rotation.y = t * 0.05;
      outer.current.rotation.x = t * 0.03;
    }
  });

  return (
    <group position={[0, 1.55, -2.4]}>
      <mesh onClick={onSelect} visible={false}>
        <sphereGeometry args={[1.0, 16, 16]} />
      </mesh>
      <mesh ref={core} onClick={onSelect}>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 1.6 : 1.0}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={halo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]}>
        <ringGeometry args={[active ? 0.9 : 0.72, active ? 1.12 : 0.8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.85 : 0.45} />
      </mesh>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} wireframe />
      </mesh>
      <Html center distanceFactor={9} position={[0, 0.82, 0]} wrapperClass="hotspot-tag-wrap">
        <div className={active ? "hotspot-tag active" : "hotspot-tag"}>呼吸引导</div>
      </Html>
    </group>
  );
}

function HotspotNode({
  position,
  color,
  onSelect,
  phase,
  label,
  active,
}: {
  position: [number, number, number];
  color: string;
  onSelect: () => void;
  phase: number;
  label: string;
  active: boolean;
}) {
  const ring = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ring.current) return;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2.2 + phase) * 0.14;
    ring.current.scale.setScalar(scale);
  });

  return (
    <group position={position}>
      <mesh onClick={onSelect} visible={false}>
        <sphereGeometry args={[0.58, 16, 16]} />
      </mesh>
      <mesh onClick={onSelect}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 2.6 : 1.6}
        />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, active ? 0.46 : 0.34, 32]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.9 : 0.55} />
      </mesh>
      <Html
        center
        distanceFactor={9}
        position={[0, 0.42, 0]}
        wrapperClass="hotspot-tag-wrap"
      >
        <div className={active ? "hotspot-tag active" : "hotspot-tag"}>{label}</div>
      </Html>
    </group>
  );
}

function GroundRings({ color }: { color: string }) {
  const rings = useRef<Group>(null);

  useFrame((state) => {
    if (!rings.current) return;
    rings.current.rotation.z = state.clock.elapsedTime * 0.02;
  });

  return (
    <group ref={rings} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {[2.4, 3.6, 5.2].map((radius, index) => (
        <mesh key={radius}>
          <ringGeometry args={[radius, radius + 0.05, 96]} />
          <meshBasicMaterial color={color} transparent opacity={0.3 - index * 0.08} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingShard({
  position,
  color,
  phase,
  scale,
}: {
  position: [number, number, number];
  color: string;
  phase: number;
  scale: number;
}) {
  const shard = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!shard.current) return;
    shard.current.rotation.x = t * 0.12 + phase;
    shard.current.rotation.y = t * 0.16 + phase;
    shard.current.position.y = position[1] + Math.sin(t * 0.55 + phase) * 0.2;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={shard} position={position} scale={scale}>
        <icosahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          transparent
          opacity={0.5}
          flatShading
        />
      </mesh>
    </Float>
  );
}

function LightBeam({
  position,
  height,
  color,
}: {
  position: [number, number, number];
  height: number;
  color: string;
}) {
  return (
    <mesh position={[position[0], height / 2, position[2]]}>
      <cylinderGeometry args={[0.06, 0.2, height, 12, 1, true]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} side={DoubleSide} />
    </mesh>
  );
}

/* 评估依据面板：升级成带外框和支撑柱的展示屏 */
function AbstractPanel({
  position,
  color,
  active,
  onSelect,
}: {
  position: [number, number, number];
  color: string;
  active: boolean;
  onSelect: () => void;
}) {
  const lines = [0.45, 0.15, -0.15, -0.45];
  return (
    <group position={position}>
      {/* 两根支撑柱 + 底座 */}
      {[-1.2, 1.2].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.82, -0.05]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 0.42, 12]} />
            <meshStandardMaterial color="#1a2027" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[x, -1.03, -0.05]}>
            <cylinderGeometry args={[0.14, 0.16, 0.04, 16]} />
            <meshStandardMaterial color="#11161d" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {/* 屏体外框（微凸，有厚度） */}
      <RoundedBox args={[2.76, 1.76, 0.08]} radius={0.04} smoothness={4} position={[0, 0, -0.03]} castShadow>
        <meshStandardMaterial color="#0c1219" metalness={0.45} roughness={0.4} />
      </RoundedBox>
      {/* 发光屏面 */}
      <mesh onClick={onSelect} position={[0, 0, 0.02]}>
        <planeGeometry args={[2.6, 1.6]} />
        <meshStandardMaterial
          color="#0a121e"
          emissive={color}
          emissiveIntensity={active ? 0.55 : 0.22}
          transparent
          opacity={0.85}
          side={DoubleSide}
        />
      </mesh>
      {/* 内容线条 */}
      {lines.map((y, index) => (
        <mesh key={y} position={[-0.2, y, 0.03]}>
          <planeGeometry args={[1.8 - index * 0.2, 0.03]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* 高亮描边 */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[2.7, 1.7]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.16 : 0.07} />
      </mesh>
      {/* 顶部标识灯 */}
      <mesh position={[0, 0.96, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 2.2 : 1.2} />
      </mesh>
    </group>
  );
}

function LightGate({
  position,
  color,
  active,
  onSelect,
}: {
  position: [number, number, number];
  color: string;
  active: boolean;
  onSelect: () => void;
}) {
  const width = 2.4;
  return (
    <group position={position}>
      {[-width / 2, width / 2].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.07, 2.6, 0.07]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 1.32, 0]}>
        <boxGeometry args={[width + 0.07, 0.07, 0.07]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      <mesh onClick={onSelect}>
        <planeGeometry args={[width, 2.6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.18 : 0.07}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

function MemoryPillar({
  position,
  color,
  active,
  onSelect,
}: {
  position: [number, number, number];
  color: string;
  active: boolean;
  onSelect: () => void;
}) {
  const orbit = useRef<Group>(null);

  useFrame((state) => {
    if (orbit.current) {
      orbit.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <group position={position}>
      <mesh onClick={onSelect}>
        <cylinderGeometry args={[0.18, 0.26, 2.2, 20, 1, true]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.9 : 0.4}
          transparent
          opacity={0.5}
          side={DoubleSide}
        />
      </mesh>
      <mesh onClick={onSelect} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.13, 18, 18]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 1.8 : 1.1}
        />
      </mesh>
      <group ref={orbit}>
        {[0, 1, 2, 3].map((index) => (
          <mesh
            key={index}
            position={[
              Math.cos(index * 1.6) * 0.55,
              1.15 + (index % 2) * 0.22,
              Math.sin(index * 1.6) * 0.55,
            ]}
          >
            <boxGeometry args={[0.09, 0.09, 0.09]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ==========================================================================
   积木桌：加桌腿 + 木纹桌面，交互逻辑保持不变
   ========================================================================== */
const TABLE_X = -4.2;
const TABLE_Z = 3.6;
const TABLE_TOP = 0.96;

type BlockShape = "box" | "cylinder" | "cone" | "sphere" | "tetra";

interface BlockSpec {
  id: number;
  shape: BlockShape;
  size: [number, number, number];
  color: string;
  position: [number, number, number];
}

const BLOCK_SCALE = 0.72;

const BASE_BLOCKS: BlockSpec[] = [
  { id: 1, shape: "box", size: [0.5, 0.4, 0.5], color: "#d9b382", position: [TABLE_X - 0.8, TABLE_TOP + 0.2, TABLE_Z - 0.5] },
  { id: 2, shape: "cylinder", size: [0.36, 0.42, 0.36], color: "#b07b4f", position: [TABLE_X + 0.1, TABLE_TOP + 0.21, TABLE_Z + 0.3] },
  { id: 3, shape: "cone", size: [0.38, 0.5, 0.38], color: "#8c5a38", position: [TABLE_X + 0.9, TABLE_TOP + 0.25, TABLE_Z - 0.6] },
  { id: 4, shape: "sphere", size: [0.34, 0.34, 0.34], color: "#e0c39a", position: [TABLE_X - 1.1, TABLE_TOP + 0.17, TABLE_Z + 0.7] },
  { id: 5, shape: "tetra", size: [0.42, 0.42, 0.42], color: "#7fa8c9", position: [TABLE_X + 0.3, TABLE_TOP + 0.2, TABLE_Z - 1.1] },
  { id: 6, shape: "box", size: [0.62, 0.24, 0.34], color: "#c9a06a", position: [TABLE_X + 0.7, TABLE_TOP + 0.12, TABLE_Z + 0.8] },
  { id: 7, shape: "cylinder", size: [0.28, 0.5, 0.28], color: "#a9784f", position: [TABLE_X - 0.3, TABLE_TOP + 0.25, TABLE_Z + 1.0] },
  { id: 8, shape: "box", size: [0.4, 0.32, 0.4], color: "#6f8fa8", position: [TABLE_X + 1.1, TABLE_TOP + 0.16, TABLE_Z + 0.1] },
];

const BLOCK_SPECS: BlockSpec[] = BASE_BLOCKS.map((block) => {
  const size: [number, number, number] = [
    block.size[0] * BLOCK_SCALE,
    block.size[1] * BLOCK_SCALE,
    block.size[2] * BLOCK_SCALE,
  ];
  return {
    ...block,
    size,
    position: [
      TABLE_X + (block.position[0] - TABLE_X) * 0.8,
      TABLE_TOP + size[1] / 2,
      TABLE_Z + (block.position[2] - TABLE_Z) * 0.8,
    ],
  };
});

function settleBlocks(list: BlockSpec[]): BlockSpec[] {
  const order = [...list].sort((a, b) => a.position[1] - b.position[1]);
  const settled = new Map<number, BlockSpec>();
  const placed: BlockSpec[] = [];

  for (const block of order) {
    let bottom = TABLE_TOP;
    for (const other of placed) {
      const dx = Math.abs(other.position[0] - block.position[0]);
      const dz = Math.abs(other.position[2] - block.position[2]);
      const reachX = ((other.size[0] + block.size[0]) / 2) * 0.9;
      const reachZ = ((other.size[2] + block.size[2]) / 2) * 0.9;
      if (dx < reachX && dz < reachZ) {
        bottom = Math.max(bottom, other.position[1] + other.size[1] / 2);
      }
    }
    const next: BlockSpec = {
      ...block,
      position: [block.position[0], bottom + block.size[1] / 2, block.position[2]],
    };
    settled.set(block.id, next);
    placed.push(next);
  }

  return list.map((block) => settled.get(block.id) ?? block);
}

function BlockGeometry({ shape, size }: { shape: BlockShape; size: [number, number, number] }) {
  if (shape === "cylinder") {
    return <cylinderGeometry args={[size[0] / 2, size[0] / 2, size[1], 24]} />;
  }
  if (shape === "cone") {
    return <coneGeometry args={[size[0] / 2, size[1], 24]} />;
  }
  if (shape === "sphere") {
    return <sphereGeometry args={[size[0] / 2, 24, 18]} />;
  }
  if (shape === "tetra") {
    return <coneGeometry args={[size[0] / 2, size[1], 4]} />;
  }
  return <boxGeometry args={size} />;
}

function BlockVisual({ block }: { block: BlockSpec }) {
  const material = (
    <meshStandardMaterial
      color={block.color}
      roughness={0.72}
      metalness={0.05}
      emissive={block.color}
      emissiveIntensity={0.05}
    />
  );

  if (block.shape === "box") {
    return (
      <RoundedBox
        args={block.size}
        radius={0.03}
        smoothness={3}
        castShadow
        receiveShadow
      >
        {material}
      </RoundedBox>
    );
  }

  return (
    <mesh castShadow receiveShadow>
      <BlockGeometry shape={block.shape} size={block.size} />
      {material}
    </mesh>
  );
}

function BlockTable({
  accent,
  onSelect,
}: {
  accent: string;
  onSelect: (id: HotspotId) => void;
}) {
  const [blocks, setBlocks] = useState(BLOCK_SPECS);
  const [dragging, setDragging] = useState<number | null>(null);
  const groupRefs = useRef<Record<number, Group | null>>({});
  const grabOffset = useRef(new Vector3());
  const controls = useThree((state) => state.controls) as any;
  const { camera, raycaster, pointer, scene } = useThree();
  const plane = useMemo(() => new Plane(new Vector3(0, 1, 0), -TABLE_TOP), []);
  const tableWood = useMemo(() => makeWoodTexture("#3a2a20", "#1a120c"), []);

  const dropBlock = useCallback(
    (id: number) => {
      setBlocks((prev) => {
        const moved = prev.map((block) => {
          if (block.id !== id) return block;
          const group = groupRefs.current[block.id];
          if (!group) return block;
          return {
            ...block,
            position: [group.position.x, group.position.y, group.position.z] as [
              number,
              number,
              number,
            ],
          };
        });

        const settled = settleBlocks(moved);
        settled.forEach((block) => {
          const group = groupRefs.current[block.id];
          if (!group) return;
          group.userData.targetY = block.position[1];
          group.position.y = block.position[1];
        });
        return settled;
      });

      setDragging(null);
      if (controls) controls.enabled = true;
    },
    [controls]
  );

  useEffect(() => {
    const release = () => {
      if (dragging === null) return;
      if (document.pointerLockElement) return;
      dropBlock(dragging);
    };
    window.addEventListener("pointerup", release);
    return () => window.removeEventListener("pointerup", release);
  }, [dragging, dropBlock]);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (!document.pointerLockElement || event.button !== 0) return;

      if (dragging !== null) {
        dropBlock(dragging);
        return;
      }

      raycaster.setFromCamera(new Vector2(0, 0), camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      for (const hit of hits) {
        let current: Object3D | null = hit.object;
        while (current) {
          const hotspot = current.userData?.hotspot as HotspotId | undefined;
          if (hotspot) {
            onSelect(hotspot);
            return;
          }
          const blockId = current.userData?.blockId as number | undefined;
          if (typeof blockId === "number") {
            setDragging(blockId);
            return;
          }
          current = current.parent;
        }
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [camera, raycaster, scene, dragging, dropBlock, onSelect]);

  useEffect(() => {
    const onLockChange = () => {
      if (!document.pointerLockElement && dragging !== null) {
        dropBlock(dragging);
      }
    };
    document.addEventListener("pointerlockchange", onLockChange);
    return () => document.removeEventListener("pointerlockchange", onLockChange);
  }, [dragging, dropBlock]);

  useFrame(() => {
    if (dragging !== null) {
      const group = groupRefs.current[dragging];
      const current = blocks.find((item) => item.id === dragging);
      if (!group || !current) return;

      let targetX = group.position.x;
      let targetZ = group.position.z;
      let snappedSupport: number | null = null;

      const rayOrigin = document.pointerLockElement ? new Vector2(0, 0) : pointer;
      raycaster.setFromCamera(rayOrigin, camera);
      const hits = raycaster.intersectObjects(scene.children, true);

      for (const hit of hits) {
        let cursor: Object3D | null = hit.object;
        let isSelf = false;
        while (cursor) {
          if (cursor === group) {
            isSelf = true;
            break;
          }
          cursor = cursor.parent;
        }
        if (isSelf) continue;

        let node: Object3D | null = hit.object;
        while (node) {
          const otherId = node.userData?.blockId as number | undefined;
          if (typeof otherId === "number" && otherId !== current.id) {
            const otherGroup = groupRefs.current[otherId];
            const other = blocks.find((item) => item.id === otherId);
            if (otherGroup && other) {
              targetX = otherGroup.position.x;
              targetZ = otherGroup.position.z;
              snappedSupport = otherGroup.position.y + other.size[1] / 2;
            }
            break;
          }
          node = node.parent;
        }
        if (snappedSupport !== null) break;
      }

      if (snappedSupport === null) {
        if (document.pointerLockElement) {
          const direction = new Vector3();
          camera.getWorldDirection(direction);
          let distance = 2.4;
          if (direction.y < -0.08) {
            distance = (TABLE_TOP - camera.position.y) / direction.y;
          }
          distance = Math.min(Math.max(distance, 0.8), 4.5);
          const point = camera.position.clone().addScaledVector(direction, distance);
          targetX = point.x;
          targetZ = point.z;
        } else {
          raycaster.setFromCamera(pointer, camera);
          const hit = new Vector3();
          if (!raycaster.ray.intersectPlane(plane, hit)) return;
          targetX = hit.x - grabOffset.current.x;
          targetZ = hit.z - grabOffset.current.z;
        }
      }

      const dx = targetX - TABLE_X;
      const dz = targetZ - TABLE_Z;
      const radius = Math.hypot(dx, dz);
      const limit = 1.75;
      const factor = radius > limit ? limit / radius : 1;
      const finalX = TABLE_X + dx * factor;
      const finalZ = TABLE_Z + dz * factor;

      let support = snappedSupport ?? TABLE_TOP;
      if (snappedSupport === null) {
        let bestScore = Number.POSITIVE_INFINITY;
        for (const other of blocks) {
          if (other.id === current.id) continue;
          const ox = Math.abs(other.position[0] - finalX);
          const oz = Math.abs(other.position[2] - finalZ);
          const reachX = ((other.size[0] + current.size[0]) / 2) * 0.9;
          const reachZ = ((other.size[2] + current.size[2]) / 2) * 0.9;
          if (ox < reachX && oz < reachZ) {
            const score = ox / reachX + oz / reachZ;
            if (score < bestScore) {
              bestScore = score;
              const otherGroup = groupRefs.current[other.id];
              const otherY = otherGroup ? otherGroup.position.y : other.position[1];
              support = otherY + other.size[1] / 2;
            }
          }
        }
      }

      group.position.x = finalX;
      group.position.z = finalZ;
      group.position.y = support + current.size[1] / 2 + 0.06;
      return;
    }

    for (const block of blocks) {
      const group = groupRefs.current[block.id];
      const target = group?.userData.targetY as number | undefined;
      if (!group || target === undefined) continue;
      group.position.y += (target - group.position.y) * 0.4;
      if (Math.abs(group.position.y - target) < 0.001) {
        group.position.y = target;
      }
    }
  });

  return (
    <>
      {/* 桌面：木纹圆盘，带倒角边缘 */}
      <mesh position={[TABLE_X, 0.9, TABLE_Z]} receiveShadow castShadow>
        <cylinderGeometry args={[2, 2.1, 0.12, 48]} />
        <meshStandardMaterial map={tableWood} color="#9a7c62" roughness={0.5} metalness={0.06} />
      </mesh>
      {/* 桌沿发光环 */}
      <mesh position={[TABLE_X, TABLE_TOP + 0.01, TABLE_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.82, 2.0, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} />
      </mesh>
      {/* 四条桌腿（外倾，稳健感）+ 腿脚 */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => {
        const lx = TABLE_X + sx * 1.45;
        const lz = TABLE_Z + sz * 1.45;
        const angleY = Math.atan2(sx * 0.16, sz * 0.16);
        return (
          <group key={i}>
            <mesh position={[lx, 0.42, lz]} rotation={[sz * 0.05, angleY, -sx * 0.05]} castShadow>
              <cylinderGeometry args={[0.07, 0.1, 0.84, 12]} />
              <meshStandardMaterial color="#241a13" roughness={0.6} metalness={0.1} />
            </mesh>
            <mesh position={[lx + sx * 0.04, 0.02, lz + sz * 0.04]}>
              <cylinderGeometry args={[0.1, 0.12, 0.05, 12]} />
              <meshStandardMaterial color="#0e0a07" metalness={0.4} roughness={0.5} />
            </mesh>
          </group>
        );
      })}
      {/* 桌下横撑 */}
      <mesh position={[TABLE_X, 0.28, TABLE_Z]} castShadow>
        <torusGeometry args={[1.35, 0.035, 8, 40]} />
        <meshStandardMaterial color="#241a13" roughness={0.65} />
      </mesh>
      {blocks.map((block) => (
        <group
          key={block.id}
          ref={(node) => {
            groupRefs.current[block.id] = node;
          }}
          position={block.position}
          userData={{ blockId: block.id, height: block.size[1], targetY: block.position[1] }}
        >
          <mesh
            scale={1.3}
            onPointerDown={(event) => {
              event.stopPropagation();
              const group = groupRefs.current[block.id];
              if (group) {
                grabOffset.current.set(
                  event.point.x - group.position.x,
                  0,
                  event.point.z - group.position.z
                );
              }
              setDragging(block.id);
              if (controls) controls.enabled = false;
            }}
          >
            <BlockGeometry shape={block.shape} size={block.size} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <BlockVisual block={block} />
        </group>
      ))}
      <Html
        center
        distanceFactor={11}
        position={[TABLE_X, 1.55, TABLE_Z]}
        wrapperClass="hotspot-tag-wrap"
      >
        <div className="hotspot-tag">自由搭建</div>
      </Html>
    </>
  );
}

const SHARDS: { position: [number, number, number]; phase: number; scale: number }[] = [
  { position: [-6.4, 1.5, -4.2], phase: 0.4, scale: 1.0 },
  { position: [6.2, 2.1, -5.4], phase: 1.7, scale: 0.8 },
  { position: [-7.1, 2.4, 2.6], phase: 2.9, scale: 1.15 },
  { position: [5.6, 1.3, 4.4], phase: 4.1, scale: 0.75 },
  { position: [-2.6, 2.8, -6.4], phase: 5.2, scale: 0.65 },
  { position: [2.9, 1.9, 6.2], phase: 0.9, scale: 0.85 },
];

const BEAMS: { position: [number, number, number]; height: number }[] = [
  { position: [-7.4, 0, -7.2], height: 3.6 },
  { position: [7.2, 0, -6.6], height: 3.2 },
  { position: [-6.8, 0, 6.4], height: 2.8 },
];

export default function RoomScene({
  level,
  onSelect,
  active,
  xrOk = false,
}: {
  level: RiskLevel;
  onSelect: (id: HotspotId) => void;
  active: HotspotId | null;
  xrOk?: boolean;
}) {
  const palette = PALETTE[level];

  return (
    <>
      <fog attach="fog" args={[palette.fog, palette.fogNear, palette.fogFar]} />
      <ambientLight intensity={0.85} color="#8fa6d8" />
      <hemisphereLight intensity={0.65} color="#3a4a66" groundColor="#0c0a08" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0004}
      />
      <pointLight
        position={[0, 4.2, 0]}
        intensity={palette.light}
        distance={26}
        color={palette.accent}
      />
      <pointLight position={[0, 1.4, -4]} intensity={6} distance={12} color={palette.accent} />
      {/* 积木桌上方补一盏暖光，突出木质感 */}
      <pointLight position={[TABLE_X, 2.6, TABLE_Z]} intensity={5} distance={9} color="#ffd9a0" />
      {/* 会客区主光：把沙发的绒面质感从暗部里提出来 */}
      <pointLight position={[6.3, 3.4, -3.6]} intensity={10} distance={10} color="#ffe2c0" />
      <pointLight position={[7.4, 3.2, 1.2]} intensity={5} distance={8} color="#dfe8ff" />

      {/* 程序化环境贴图：给 PBR 材质提供反射内容，纯本地生成 */}
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.2} color="#aebfd8" position={[0, 5, -6]} scale={[8, 3, 1]} />
        <Lightformer intensity={1.1} color={palette.accent} position={[0, 4, 6]} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={1.6} color="#e8eef8" position={[-7, 4, 0]} rotation={[0, Math.PI / 2, 0]} scale={[3, 3, 1]} />
        <Lightformer form="ring" intensity={1.6} color="#e8eef8" position={[7, 4, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 3, 1]} />
        <Lightformer intensity={0.5} color="#202836" position={[0, -4, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 10, 1]} />
      </Environment>

      <RoomShell palette={palette} />

      {/* 后墙两扇窗 */}
      <FakeWindow x={-2.6} palette={palette} />
      <FakeWindow x={2.6} palette={palette} />

      {/* 家具（GLB 资产异步加载，先出空房再逐步落位，不阻塞交互） */}
      <Suspense fallback={null}>
        <Sofa />
        <Bookshelf palette={palette} />
        <Plant position={[-7.6, 0, -7.4]} scale={1.15} />
        <Plant position={[7.7, 0, 6.6]} scale={1.0} />
        <LoungeChair position={[4.4, 0, -2.3]} rotation={2.45} />
        <LoungeChair position={[7.75, 0, -1.35]} rotation={-2.75} />
        <LampTable />
        <CoffeeCorner />
        <CeilingLamp x={TABLE_X} z={TABLE_Z} palette={palette} />
        <CeilingLamp x={-5.4} z={-4.4} palette={palette} />
        <CeilingLamp x={5.6} z={3.8} palette={palette} />
      </Suspense>

      <GroundRings color={palette.accent} />

      {/* 房间里的活物：小猫追毛线球。猫模型为异步 GLB，同样走 Suspense 落位 */}
      <Suspense fallback={null}>
        <CatPlay accent={palette.accent} />
      </Suspense>

      <BreathingOrb
        color={palette.accent}
        speed={palette.breath}
        active={active === "breathing"}
        onSelect={() => onSelect("breathing")}
      />

      <group userData={{ hotspot: "board" }}>
        <AbstractPanel
          position={[-5, 2.05, -8.86]}
          color={palette.accent}
          active={active === "board"}
          onSelect={() => onSelect("board")}
        />
        <HotspotNode
          position={[-5, 1.1, -8.5]}
          color={palette.accent}
          phase={0}
          label="评估依据"
          active={active === "board"}
          onSelect={() => onSelect("board")}
        />
      </group>

      <group userData={{ hotspot: "window" }}>
        <LightGate
          position={[5, 1.4, -8.86]}
          color={palette.accent}
          active={active === "window"}
          onSelect={() => onSelect("window")}
        />
        <HotspotNode
          position={[5, 1.1, -8.5]}
          color={palette.accent}
          phase={1.2}
          label="环境感知"
          active={active === "window"}
          onSelect={() => onSelect("window")}
        />
      </group>

      <group userData={{ hotspot: "shelf" }}>
        <MemoryPillar
          position={[7.4, 0, 2]}
          color={palette.accent}
          active={active === "shelf"}
          onSelect={() => onSelect("shelf")}
        />
        <HotspotNode
          position={[7.4, 1.85, 2]}
          color={palette.accent}
          phase={2.4}
          label="项目说明"
          active={active === "shelf"}
          onSelect={() => onSelect("shelf")}
        />
      </group>

      {SHARDS.map((shard) => (
        <FloatingShard
          key={`${shard.position[0]}-${shard.position[2]}`}
          position={shard.position}
          phase={shard.phase}
          scale={shard.scale}
          color={palette.accent}
        />
      ))}

      {BEAMS.map((beam) => (
        <LightBeam
          key={`${beam.position[0]}-${beam.position[2]}`}
          position={beam.position}
          height={beam.height}
          color={palette.accent}
        />
      ))}

      <BlockTable accent={palette.accent} onSelect={onSelect} />

      {/* 接触阴影：让家具"站"在地面上，而不是悬浮 */}
      <ContactShadows
        position={[0, 0.016, 0]}
        opacity={0.42}
        scale={22}
        blur={2.4}
        far={4}
        resolution={1024}
        color="#000000"
      />

      <Sparkles
        count={palette.particles}
        scale={[16, 3.6, 16]}
        size={2.6}
        speed={0.35}
        color={palette.accent}
        opacity={0.5}
      />

      {/* 后期：泛光让发光体有真实的辉光衰减，暗角把视线压向房间中心。
          WebXR 会话下必须关掉（后处理管线与 XR 不兼容）。 */}
      {!xrOk && (
        <EffectComposer multisampling={4}>
          <Bloom intensity={0.55} luminanceThreshold={0.72} luminanceSmoothing={0.22} mipmapBlur />
          <Vignette offset={0.18} darkness={0.42} />
        </EffectComposer>
      )}
    </>
  );
}
