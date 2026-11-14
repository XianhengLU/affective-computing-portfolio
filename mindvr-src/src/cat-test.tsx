import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import CatPlay from "./components/CatPlay";

/* 仅用于本地核验 CatPlay 的建模与动作，不参与正式构建产物 */
createRoot(document.getElementById("root")!).render(
  <Canvas
    shadows
    camera={{ position: [3.4, 0.85, 4.3], fov: 40 }}
    onCreated={({ scene }) => {
      (window as unknown as Record<string, unknown>).__scene = scene;
    }}
  >
    <color attach="background" args={["#0d1620"]} />
    <ambientLight intensity={0.9} color="#8fa6d8" />
    <hemisphereLight intensity={0.7} color="#3a4a66" groundColor="#0c0a08" />
    <directionalLight
      position={[5, 8, 5]}
      intensity={2.2}
      castShadow
      shadow-mapSize={[1024, 1024]}
    />
    <pointLight position={[2.6, 2.8, 2.0]} intensity={9} distance={9} color="#ffd9a0" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[24, 24]} />
      <meshStandardMaterial color="#141d24" roughness={0.92} />
    </mesh>
    <gridHelper args={[24, 24, "#2fbf71", "#1c2c33"]} position={[0, 0.002, 0]} />
    <Suspense fallback={null}>
      <CatPlay accent="#2fbf71" />
    </Suspense>
    <ContactShadows
      position={[0, 0.016, 0]}
      opacity={0.5}
      scale={14}
      blur={2.4}
      far={4}
      resolution={1024}
    />
    <OrbitControls target={[2.6, 0.15, 2.6]} enablePan={false} />
  </Canvas>,
);
