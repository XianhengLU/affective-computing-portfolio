import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ==========================================================================
   房间里的活物 —— 一只燕尾服小猫在追毛线球
   --------------------------------------------------------------------------
   猫模型：Tuxedo Cat Animated 2.0（作者 DreamNoms，CC-BY 4.0，
   https://sketchfab.com/3d-models/tuxedo-cat-animated-20-783fcb78b55b4394a212c2b6392e1113 ）。
   自带 6 段骨骼动画（IdleNorm / WalkCycle / IdleTailSwoosh / SitDown / IdleSit /
   StandUp），用 AnimationMixer 交叉淡入驱动；扑击与拍球没有对应片段，
   由状态机在根节点上做程序化抛物线腾空 + 俯仰 + 快速摆身补足。
   毛线球：4 条绕球面走的 Tube 曲线拧成，简化刚体物理
   （重力 / 弹跳 / 滚动 / 边界反弹）。
   动作循环：观望 → 追球 → 蹲伏 → 扑击 → 出爪拍飞 → 追击；
   每扑四次真猫式坐下歇一会儿（SitDown → IdleSit → StandUp）。
   ========================================================================== */

const CAT_URL = "models/TuxedoCat.glb";

/* 归一化后的站姿肩高（米）。房间里的猫，不用真猫的 0.3 那么大 */
const CAT_H = 0.34;

/* 模型自身朝向修正：该模型的正脸在 -z，而状态机按 +z 计算 yaw，转半圈（截图校准过） */
const FACING = Math.PI;

const BALL_R = 0.078;

/* 猫的可活动范围：房间右前方空地，避开积木桌、立柱与沙发，
   并保证默认机位（相机在 +z 方向）多数时间能看到 */
const AREA = { x0: 0.9, x1: 3.6, z0: 0.5, z1: 3.7 };

/* 模块级临时量，避免每帧 new 出垃圾 */
const _v = new THREE.Vector3();

/* --------------------------------------------------------------------------
   毛线球：球芯 + 四条贴着球面绕行的线
   -------------------------------------------------------------------------- */
function WoolBall({ accent }: { accent: string }) {
  const strands = useMemo(() => {
    const palette = [accent, "#f0a6bd", "#f3e7d7", accent];
    const out: { geo: THREE.TubeGeometry; color: string }[] = [];
    for (let k = 0; k < 4; k++) {
      const pts: THREE.Vector3[] = [];
      const turns = 1.2 + k * 0.28;
      const tilt = k * 0.8 + 0.5;
      const N = 44;
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const phi = u * Math.PI * 2 * turns + k * 1.9;
        _v.set(Math.cos(phi), Math.sin(phi + tilt) * 0.9, Math.sin(phi));
        _v.normalize().multiplyScalar(BALL_R * (0.92 + Math.sin(phi * 2.3 + k) * 0.06));
        pts.push(_v.clone());
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      out.push({
        geo: new THREE.TubeGeometry(curve, 90, 0.0085, 5, false),
        color: palette[k % palette.length],
      });
    }
    return out;
  }, [accent]);

  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[BALL_R * 0.88, 18, 14]} />
        <meshStandardMaterial color="#c8576f" roughness={0.95} />
      </mesh>
      {strands.map((s, i) => (
        <mesh key={i} geometry={s.geo}>
          <meshStandardMaterial
            color={s.color}
            roughness={0.75}
            emissive={s.color}
            emissiveIntensity={0.16}
          />
        </mesh>
      ))}
    </group>
  );
}

/* --------------------------------------------------------------------------
   主组件：动画混合 + 状态机 + 毛线球物理
   -------------------------------------------------------------------------- */
type Mode =
  | "idle"
  | "chase"
  | "crouch"
  | "leap"
  | "bat"
  | "sitdown"
  | "sit"
  | "standup";

export default function CatPlay({ accent }: { accent: string }) {
  const root = useRef<THREE.Group>(null);
  const pose = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const { scene: catScene, animations } = useGLTF(CAT_URL);

  /* 归一化：按目标身高缩放、四脚落地、平面对齐几何中心。
     动画模型不能 clone（会丢骨骼绑定），全场只有一只猫，直接用原 scene。 */
  const catRoot = useMemo(() => {
    const box = new THREE.Box3().setFromObject(catScene);
    const size = box.getSize(new THREE.Vector3());
    const scale = CAT_H / Math.max(size.y, 1e-4);
    catScene.scale.setScalar(scale);
    const box2 = new THREE.Box3().setFromObject(catScene);
    const center = box2.getCenter(new THREE.Vector3());
    catScene.position.x -= center.x;
    catScene.position.z -= center.z;
    catScene.position.y -= box2.min.y - 0.002;
    catScene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.frustumCulled = false; /* 蒙皮包围盒在动画中会跑出原始 bbox */
      }
    });
    return catScene;
  }, [catScene]);

  const mixer = useMemo(() => new THREE.AnimationMixer(catRoot), [catRoot]);
  const actions = useMemo(() => {
    const map: Record<string, THREE.AnimationAction> = {};
    for (const clip of animations) map[clip.name] = mixer.clipAction(clip);
    return map;
  }, [mixer, animations]);

  /* 眼睛加一点点主题色的「反光」，暗环境里更有神 */
  useEffect(() => {
    catRoot.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const std = m as THREE.MeshStandardMaterial;
        if (std.isMeshStandardMaterial && /eye/i.test(std.name)) {
          std.emissive = new THREE.Color(accent);
          std.emissiveIntensity = 0.55;
        }
      }
    });
  }, [catRoot, accent]);

  const s = useRef({
    mode: "idle" as Mode,
    t: 0,
    dur: 2.2,
    cat: new THREE.Vector3(2.6, 0, 2.0),
    yaw: -0.9,
    pos: new THREE.Vector3(2.0, BALL_R, 2.9),
    vel: new THREE.Vector3(1.05, 0, 0.55),
    spin: new THREE.Quaternion(),
    hop: 0,
    crouch: 0,
    walkTS: 1,
    pounces: 0,
    ring: 2,
    wiggle: 0,
    leapFrom: new THREE.Vector3(),
    leapTo: new THREE.Vector3(),
    action: null as THREE.AnimationAction | null,
  });

  /* 切动画：交叉淡入；once 的片段单次播放并定格在最后一帧 */
  const play = (name: string, fade = 0.22, once = false, timeScale = 1) => {
    const st = s.current;
    const next = actions[name];
    if (!next) return;
    if (st.action === next && !once) {
      next.timeScale = timeScale;
      return;
    }
    next.reset();
    next.timeScale = timeScale;
    if (once) {
      next.setLoop(THREE.LoopOnce, 1);
      next.clampWhenFinished = true;
    }
    next.fadeIn(fade).play();
    if (st.action && st.action !== next) st.action.fadeOut(fade);
    st.action = next;
  };

  useEffect(() => {
    const st = s.current;
    if (root.current) root.current.position.set(st.cat.x, 0, st.cat.z);
    return () => {
      mixer.stopAllAction();
    };
  }, [mixer]);

  useFrame(({ clock }, rawDelta) => {
    const st = s.current;
    const dt = Math.min(rawDelta, 0.05);
    st.t += dt;

    /* ---------------- 毛线球：重力 / 弹跳 / 摩擦 / 边界 ---------------- */
    st.vel.y -= 6.2 * dt;
    st.pos.addScaledVector(st.vel, dt);

    if (st.pos.y <= BALL_R) {
      st.pos.y = BALL_R;
      if (st.vel.y < -0.02) {
        st.vel.y = -st.vel.y * 0.42;
        st.vel.x *= 0.86;
        st.vel.z *= 0.86;
      } else {
        st.vel.y = 0;
      }
      const damp = Math.max(0, 1 - 2.0 * dt);
      st.vel.x *= damp;
      st.vel.z *= damp;
      if (Math.abs(st.vel.x) < 0.02) st.vel.x = 0;
      if (Math.abs(st.vel.z) < 0.02) st.vel.z = 0;
    }
    if (st.pos.x < AREA.x0) {
      st.pos.x = AREA.x0;
      st.vel.x = Math.abs(st.vel.x) * 0.6;
    }
    if (st.pos.x > AREA.x1) {
      st.pos.x = AREA.x1;
      st.vel.x = -Math.abs(st.vel.x) * 0.6;
    }
    if (st.pos.z < AREA.z0) {
      st.pos.z = AREA.z0;
      st.vel.z = Math.abs(st.vel.z) * 0.6;
    }
    if (st.pos.z > AREA.z1) {
      st.pos.z = AREA.z1;
      st.vel.z = -Math.abs(st.vel.z) * 0.6;
    }

    const speed = Math.hypot(st.vel.x, st.vel.z);
    if (speed > 0.02) {
      _v.set(st.vel.z, 0, -st.vel.x).normalize();
      st.spin.premultiply(
        new THREE.Quaternion().setFromAxisAngle(_v, (speed * dt) / BALL_R),
      );
    }
    if (ballRef.current) {
      ballRef.current.position.copy(st.pos);
      ballRef.current.quaternion.copy(st.spin);
    }

    /* ---------------- 猫：看球 -> 靠近 -> 蹲 -> 扑 -> 拍 -> 坐下歇 ---------------- */
    _v.set(st.pos.x - st.cat.x, 0, st.pos.z - st.cat.z);
    const dist = _v.length() || 0.0001;

    const wantYaw = Math.atan2(_v.x, _v.z);
    let dy = wantYaw - st.yaw;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    /* 坐着的时候不扭头追球，起身再转 */
    const seated = st.mode === "sitdown" || st.mode === "sit" || st.mode === "standup";
    if (!seated) st.yaw += dy * Math.min(1, dt * 6);

    st.hop = 0;
    st.wiggle = 0;
    let wantCrouch = 0;
    let wantTS = 1;

    switch (st.mode) {
      case "idle":
        wantCrouch = 0.1;
        /* 一半的休息用甩尾巴版本，姿态更活 */
        play(st.pounces % 8 === 4 ? "IdleTailSwoosh" : "IdleNorm");
        if (st.t > st.dur) {
          st.mode = "chase";
          st.t = 0;
          st.dur = 3.4;
        }
        break;

      case "chase": {
        if (dist > 0.95) {
          const step = Math.min(dist - 0.9, 1.7 * dt);
          st.cat.x += (_v.x / dist) * step;
          st.cat.z += (_v.z / dist) * step;
          /* 走路动画速度跟实际步频挂钩：远=快跑，近=慢步 */
          wantTS = THREE.MathUtils.clamp(0.85 + dist * 0.35, 0.9, 1.7);
        } else {
          st.mode = "crouch";
          st.t = 0;
          st.dur = 0.4;
        }
        if (st.t > st.dur) {
          /* 追太久就放弃，原地休息一会儿再来 */
          st.mode = "idle";
          st.t = 0;
          st.dur = 2.4;
        }
        play("WalkCycle", 0.25, false, wantTS);
        break;
      }

      case "crouch":
        wantCrouch = 1;
        /* 步频降到接近停摆，身体压低蓄力 */
        play("WalkCycle", 0.12, false, 0.12);
        if (st.t >= st.dur) {
          st.leapFrom.copy(st.cat);
          st.leapTo.set(
            st.pos.x - (_v.x / dist) * 0.3,
            0,
            st.pos.z - (_v.z / dist) * 0.3,
          );
          st.mode = "leap";
          st.t = 0;
          st.dur = 0.46;
        }
        break;

      case "leap": {
        const u = Math.min(1, st.t / st.dur);
        const e = 1 - Math.pow(1 - u, 2.2);
        st.cat.x = st.leapFrom.x + (st.leapTo.x - st.leapFrom.x) * e;
        st.cat.z = st.leapFrom.z + (st.leapTo.z - st.leapFrom.z) * e;
        st.hop = Math.sin(Math.PI * u) * 0.32;
        wantCrouch = 0.25;
        /* 空中四肢快扑，看起来像腾空扑咬 */
        play("WalkCycle", 0.05, false, 2.4);
        if (u >= 1) {
          /* 落地瞬间出爪：把球朝随机偏角拍出去 */
          const ang = Math.atan2(_v.x / dist, _v.z / dist) + (Math.random() - 0.5) * 1.35;
          const power = 2.6 + Math.random() * 1.2;
          st.vel.set(Math.sin(ang) * power, 1.1, Math.cos(ang) * power);
          st.pounces += 1;
          st.ring = 0;
          st.mode = "bat";
          st.t = 0;
          st.dur = 0.15;
        }
        break;
      }

      case "bat":
        wantCrouch = 0.5;
        st.wiggle = 1; /* 快速摆身，读作连续出爪 */
        play("WalkCycle", 0.06, false, 0.35);
        if (st.t >= st.dur) {
          const rest = st.pounces % 4 === 0;
          if (rest) {
            st.mode = "sitdown";
            st.dur = 1.05;
          } else {
            st.mode = "chase";
            st.dur = 2.6;
          }
          st.t = 0;
        }
        break;

      case "sitdown":
        play("SitDown", 0.15, true);
        if (st.t >= st.dur) {
          st.mode = "sit";
          st.t = 0;
          st.dur = 3.2 + Math.random() * 2.2;
        }
        break;

      case "sit":
        play("IdleSit");
        if (st.t >= st.dur) {
          st.mode = "standup";
          st.t = 0;
          st.dur = 1.05;
        }
        break;

      case "standup":
        play("StandUp", 0.15, true);
        if (st.t >= st.dur) {
          st.mode = "idle";
          st.t = 0;
          st.dur = 1.4;
        }
        break;
    }

    /* 猫不能跑出活动范围 */
    st.cat.x = THREE.MathUtils.clamp(st.cat.x, AREA.x0, AREA.x1);
    st.cat.z = THREE.MathUtils.clamp(st.cat.z, AREA.z0, AREA.z1);

    st.crouch += (wantCrouch - st.crouch) * Math.min(1, dt * 9);
    st.walkTS += (wantTS - st.walkTS) * Math.min(1, dt * 6);

    if (root.current) {
      root.current.position.set(st.cat.x, st.hop, st.cat.z);
      /* bat 的快速摆身叠加在朝向上 */
      const wig = st.wiggle ? Math.sin(clock.elapsedTime * 42) * 0.16 : 0;
      root.current.rotation.y = st.yaw + wig;
    }

    /* 蹲伏下压 / 扑击俯冲，都作用在姿态层，不动动画骨骼 */
    if (pose.current) {
      pose.current.position.y = -st.crouch * 0.05;
      pose.current.rotation.x = st.crouch * 0.16;
    }

    mixer.update(dt);

    /* 拍中球时地面扩散一圈光 */
    if (ringRef.current) {
      if (st.ring < 1) {
        st.ring = Math.min(1, st.ring + dt * 2.4);
        const r = 0.3 + st.ring * 1.1;
        ringRef.current.visible = true;
        ringRef.current.position.set(st.cat.x, 0.026, st.cat.z);
        ringRef.current.scale.setScalar(r);
        (ringRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - st.ring) * 0.5;
      } else {
        ringRef.current.visible = false;
      }
    }
  });

  return (
    <>
      <group ref={root} position={[2.6, 0, 2.0]} rotation={[0, FACING, 0]}>
        <group ref={pose}>
          <primitive object={catRoot} />
        </group>
      </group>

      {/* 毛线球 */}
      <group ref={ballRef} position={[2.0, BALL_R, 2.9]}>
        <WoolBall accent={accent} />
      </group>

      {/* 拍击波 */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, 0]} visible={false}>
        <ringGeometry args={[0.36, 0.44, 44]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
