import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";
import {
  CanvasTexture,
  Group,
  PerspectiveCamera,
  PointsMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";

import CanvasLoader from "../layout/Loader";

const RADIUS = 2.2;
const NETWORK_RADIUS = RADIUS * 1.09;
const NODE_COUNT = 220;
const LINKS_PER_NODE = 3;
const MAX_LINK_DISTANCE = RADIUS * 0.6;

// Deterministic PRNG so the network layout is identical on every load.
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildNetwork = () => {
  const random = mulberry32(7);
  const nodes: Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  // Fibonacci sphere with jitter: evenly spread but not grid-like.
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i + (random() - 0.5) * 0.9;
    const lift = 1 + (random() - 0.5) * 0.06;
    nodes.push(
      new Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r)
        .normalize()
        .multiplyScalar(NETWORK_RADIUS * lift)
    );
  }

  const seen = new Set<string>();
  const linePositions: number[] = [];
  nodes.forEach((node, i) => {
    nodes
      .map((other, j) => ({ j, d: node.distanceTo(other) }))
      .filter(({ j, d }) => j !== i && d < MAX_LINK_DISTANCE)
      .sort((a, b) => a.d - b.d)
      .slice(0, LINKS_PER_NODE)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        linePositions.push(node.x, node.y, node.z);
        linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
      });
  });

  const nodePositions = new Float32Array(nodes.flatMap((n) => [n.x, n.y, n.z]));
  const hubPositions = new Float32Array(
    nodes.filter(() => random() < 0.14).flatMap((n) => [n.x, n.y, n.z])
  );

  return {
    nodePositions,
    hubPositions,
    linePositions: new Float32Array(linePositions),
  };
};

const createGlowSprite = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(200,240,255,0.9)");
  gradient.addColorStop(0.5, "rgba(90,180,255,0.25)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
};

const Earth = () => {
  const [dayMap, normalMap, lightsMap, cloudsMap] = useTexture([
    "./planet/earth/earth_day.jpg",
    "./planet/earth/earth_normal.jpg",
    "./planet/earth/earth_lights.jpg",
    "./planet/earth/earth_clouds.png",
  ]);
  dayMap.colorSpace = SRGBColorSpace;
  lightsMap.colorSpace = SRGBColorSpace;
  cloudsMap.colorSpace = SRGBColorSpace;

  const network = useMemo(buildNetwork, []);
  const sprite = useMemo(createGlowSprite, []);
  const hubMaterial = useRef<PointsMaterial>(null);
  const networkGroup = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (hubMaterial.current) {
      hubMaterial.current.size = 0.34 + Math.sin(t * 2.2) * 0.08;
    }
    if (networkGroup.current) {
      networkGroup.current.rotation.y = t * 0.015;
    }
  });

  return (
    <group rotation={[0.35, 0, 0]}>
      {/* Night-side surface: blue-tinted land and oceans with city lights */}
      <mesh>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshPhongMaterial
          map={dayMap}
          color="#5b9cff"
          normalMap={normalMap}
          emissiveMap={lightsMap}
          emissive="#ffe2a8"
          emissiveIntensity={1.4}
          shininess={8}
        />
      </mesh>

      {/* Faint blue cloud layer */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.01, 96, 96]} />
        <meshLambertMaterial
          map={cloudsMap}
          color="#9fd2ff"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Connection network */}
      <group ref={networkGroup}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[network.linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </lineSegments>

        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[network.nodePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            map={sprite}
            color="#ffffff"
            size={0.14}
            transparent
            depthWrite={false}
          />
        </points>

        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[network.hubPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={hubMaterial}
            map={sprite}
            color="#ffffff"
            size={0.34}
            transparent
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
};

// Keeps the whole globe and its network in view whatever the container's shape.
const FIT_RADIUS = NETWORK_RADIUS * 1.12;
const FitCamera = () => {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const { width, height } = useThree((state) => state.size);

  useEffect(() => {
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (width / height));
    const distance = FIT_RADIUS / Math.sin(Math.min(vFov, hFov) / 2);
    camera.position.setLength(distance);
    camera.updateProjectionMatrix();
  }, [camera, width, height]);

  return null;
};

const EarthCanvas = () => {
  return (
    <div className="earth-network-canvas">
      <Canvas
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <ambientLight intensity={2.4} />
        <directionalLight position={[-6, 4, 6]} intensity={1.6} color="#9cc8ff" />

        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            autoRotate
            autoRotateSpeed={0.6}
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Earth />
          <FitCamera />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default EarthCanvas;
