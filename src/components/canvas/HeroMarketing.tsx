import { ReactNode, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, RoundedBox, Text } from "@react-three/drei";
import { BoxGeometry, ExtrudeGeometry, Group, Mesh, Shape } from "three";
import type { Line2 } from "three-stdlib";

type Vec3 = [number, number, number];

const FONT = "/fonts/manrope-800.woff";
const BLUE = "#1a73e8";
const RED = "#ea4335";
const YELLOW = "#fbbc05";
const GREEN = "#34a853";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- shared building blocks ---------- */

interface ICard {
  position: Vec3;
  rotation?: Vec3;
  size: [number, number];
  tint?: string;
  speed?: number;
  children?: ReactNode;
}

// Floating frosted-glass slab; children sit on its front face.
const GlassCard = ({
  position,
  rotation = [0, 0, 0],
  size: [w, h],
  tint = "#ffffff",
  speed = 1.4,
  children,
}: ICard) => {
  const still = useMemo(prefersReducedMotion, []);
  return (
    <Float speed={still ? 0 : speed} rotationIntensity={0.25} floatIntensity={0.45}>
      <group position={position} rotation={rotation}>
        <RoundedBox args={[w, h, 0.08]} radius={0.035} smoothness={4}>
          <meshPhysicalMaterial
            color={tint}
            transparent
            opacity={0.72}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>
        <group position={[0, 0, 0.045]}>{children}</group>
      </group>
    </Float>
  );
};

// Grey "text placeholder" bar.
const Bar = ({ position, width, color = "#9aa3b2" }: { position: Vec3; width: number; color?: string }) => (
  <RoundedBox args={[width, 0.055, 0.03]} radius={0.012} smoothness={2} position={position}>
    <meshStandardMaterial color={color} roughness={0.5} />
  </RoundedBox>
);

const Label = ({
  children,
  position,
  size,
  color = "#ffffff",
}: {
  children: string;
  position: Vec3;
  size: number;
  color?: string;
}) => (
  // Own boundary so the scene renders while the font is still loading.
  <Suspense fallback={null}>
    <Text font={FONT} fontSize={size} color={color} position={position} anchorX="center" anchorY="middle">
      {children}
    </Text>
  </Suspense>
);

/* ---------- cards ---------- */

const AdsCard = () => (
  <GlassCard position={[0.05, 2.3, 0]} size={[1.55, 1.05]} speed={1.2}>
    <RoundedBox args={[1.15, 0.5, 0.12]} radius={0.05} smoothness={4} position={[0, 0.16, 0.06]}>
      <meshStandardMaterial color={BLUE} roughness={0.3} metalness={0.1} />
    </RoundedBox>
    <Label position={[0, 0.16, 0.13]} size={0.3}>Ads</Label>
    <Bar position={[-0.12, -0.22, 0.02]} width={0.95} />
    <Bar position={[-0.27, -0.35, 0.02]} width={0.65} />
  </GlassCard>
);

const arcGeometry = (start: number, length: number, inner: number, outer: number) => {
  const shape = new Shape();
  shape.absarc(0, 0, outer, start, start + length, false);
  shape.absarc(0, 0, inner, start + length, start, true);
  return new ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.012,
    bevelSegments: 2,
    curveSegments: 40,
  });
};

const DONUT = [
  { share: 0.4, color: BLUE },
  { share: 0.22, color: RED },
  { share: 0.18, color: YELLOW },
  { share: 0.2, color: GREEN },
];

const DonutCard = () => {
  const donut = useRef<Group>(null);
  const still = useMemo(prefersReducedMotion, []);
  const segments = useMemo(() => {
    const gap = 0.05;
    let start = 0;
    return DONUT.map(({ share, color }) => {
      const length = share * Math.PI * 2 - gap;
      const geometry = arcGeometry(start, length, 0.2, 0.34);
      start += share * Math.PI * 2;
      return { geometry, color };
    });
  }, []);

  useFrame((_, delta) => {
    if (!still && donut.current) donut.current.rotation.z -= delta * 0.9;
  });

  return (
    <GlassCard position={[-1.7, 1.95, -0.2]} rotation={[0, 0.28, 0]} size={[1.65, 0.98]} speed={1.6}>
      <group ref={donut} position={[-0.4, 0, 0.01]}>
        {segments.map(({ geometry, color }) => (
          <mesh key={color} geometry={geometry}>
            <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
          </mesh>
        ))}
      </group>
      {DONUT.map(({ color }, i) => (
        <group key={color} position={[0.2, 0.26 - i * 0.17, 0.03]}>
          <mesh>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
          <Bar position={[0.3, 0, 0]} width={0.42} />
        </group>
      ))}
    </GlassCard>
  );
};

const BARS = [
  { color: BLUE, base: 0.42 },
  { color: RED, base: 0.58 },
  { color: GREEN, base: 0.36 },
  { color: YELLOW, base: 0.66 },
  { color: BLUE, base: 0.5 },
  { color: RED, base: 0.78 },
  { color: GREEN, base: 0.6 },
  { color: BLUE, base: 0.9 },
];
const BAR_FLOOR = -0.46;
const barX = (i: number) => -0.7 + i * 0.2;

const BarChartCard = () => {
  const bars = useRef<(Mesh | null)[]>([]);
  const trend = useRef<Line2>(null);
  const still = useMemo(prefersReducedMotion, []);
  // Unit-height box anchored at its base so scale.y grows it upward.
  const geometry = useMemo(() => new BoxGeometry(0.13, 1, 0.13).translate(0, 0.5, 0), []);
  const initialTrend = useMemo(
    () => BARS.map((b, i) => [barX(i), BAR_FLOOR + b.base + 0.08, 0.14] as Vec3),
    []
  );

  useFrame(({ clock }) => {
    if (still) return;
    const t = clock.getElapsedTime();
    const points: number[] = [];
    BARS.forEach((bar, i) => {
      const height = bar.base * (0.72 + 0.28 * Math.sin(t * 1.6 + i * 0.9));
      const mesh = bars.current[i];
      if (mesh) mesh.scale.y = height;
      points.push(barX(i), BAR_FLOOR + height + 0.08, 0.14);
    });
    trend.current?.geometry.setPositions(points);
  });

  return (
    <GlassCard position={[-1.95, 0.35, 0.5]} rotation={[0, 0.3, 0]} size={[1.85, 1.2]} speed={1.3}>
      {BARS.map((bar, i) => (
        <mesh
          key={i}
          ref={(el) => (bars.current[i] = el)}
          geometry={geometry}
          position={[barX(i), BAR_FLOOR, 0.07]}
          scale={[1, bar.base, 1]}
        >
          <meshStandardMaterial color={bar.color} roughness={0.35} metalness={0.1} />
        </mesh>
      ))}
      <Line ref={trend} points={initialTrend} color="#1f2937" lineWidth={2.4} />
    </GlassCard>
  );
};

const KPIS = [
  { value: "114K", color: BLUE },
  { value: "7.59K", color: RED },
  { value: "$57.47", color: YELLOW },
  { value: "$470K", color: GREEN },
];

const wave = (phase: number, amp: number, offset: number) =>
  Array.from({ length: 40 }, (_, i) => {
    const x = -0.95 + (i / 39) * 1.9;
    return [x, offset + Math.sin(x * 4 + phase) * amp, 0.03] as Vec3;
  });

const KpiCard = () => {
  const cyan = useRef<Line2>(null);
  const violet = useRef<Line2>(null);
  const still = useMemo(prefersReducedMotion, []);

  useFrame(({ clock }) => {
    if (still) return;
    const t = clock.getElapsedTime();
    cyan.current?.geometry.setPositions(wave(t * 1.4, 0.06, -0.22).flat());
    violet.current?.geometry.setPositions(wave(t * 1.1 + 1.5, 0.05, -0.28).flat());
  });

  return (
    <GlassCard position={[0.75, -0.8, 1.3]} size={[2.15, 0.85]} speed={1.5}>
      {KPIS.map(({ value, color }, i) => (
        <group key={value} position={[-0.75 + i * 0.5, 0.15, 0]}>
          <RoundedBox args={[0.46, 0.28, 0.09]} radius={0.03} smoothness={3} position={[0, 0, 0.045]}>
            <meshStandardMaterial color={color} roughness={0.3} />
          </RoundedBox>
          <Label position={[0, 0, 0.1]} size={0.1} color={color === YELLOW ? "#422006" : "#ffffff"}>
            {value}
          </Label>
        </group>
      ))}
      <Line ref={cyan} points={wave(0, 0.06, -0.22)} color="#06b6d4" lineWidth={2.2} />
      <Line ref={violet} points={wave(1.5, 0.05, -0.28)} color="#8b5cf6" lineWidth={1.8} />
    </GlassCard>
  );
};

const playShape = (() => {
  const s = new Shape();
  s.moveTo(-0.07, -0.09);
  s.lineTo(0.1, 0);
  s.lineTo(-0.07, 0.09);
  s.closePath();
  return s;
})();

const VideoCard = () => (
  <GlassCard position={[1.7, 1.8, -0.2]} rotation={[0, -0.3, 0]} size={[1.5, 0.72]} speed={1.7}>
    <RoundedBox args={[0.56, 0.4, 0.06]} radius={0.03} smoothness={3} position={[-0.38, 0, 0.03]}>
      <meshStandardMaterial color="#334155" roughness={0.4} />
    </RoundedBox>
    <RoundedBox args={[0.5, 0.34, 0.06]} radius={0.025} smoothness={3} position={[-0.38, 0, 0.05]}>
      <meshStandardMaterial color="#ffffff" roughness={0.3} />
    </RoundedBox>
    <mesh position={[-0.38, 0, 0.08]}>
      <extrudeGeometry args={[playShape, { depth: 0.05, bevelEnabled: false }]} />
      <meshStandardMaterial color={RED} roughness={0.3} />
    </mesh>
    <Bar position={[0.32, 0.12, 0.02]} width={0.55} />
    <Bar position={[0.32, 0, 0.02]} width={0.55} />
    <Bar position={[0.23, -0.12, 0.02]} width={0.38} />
  </GlassCard>
);

const mountainShape = (() => {
  const s = new Shape();
  s.moveTo(-0.24, -0.14);
  s.lineTo(-0.08, 0.04);
  s.lineTo(0.02, -0.05);
  s.lineTo(0.1, 0.03);
  s.lineTo(0.24, -0.14);
  s.closePath();
  return s;
})();

const MobileAdCard = () => (
  <GlassCard position={[2.15, 0.35, 0.6]} rotation={[0, -0.35, 0]} size={[0.95, 1.35]} tint="#fcd34d" speed={1.25}>
    <RoundedBox args={[0.75, 0.48, 0.07]} radius={0.03} smoothness={3} position={[0, 0.34, 0.035]}>
      <meshStandardMaterial color="#3b82f6" roughness={0.3} />
    </RoundedBox>
    <mesh position={[0, 0.34, 0.07]}>
      <extrudeGeometry args={[mountainShape, { depth: 0.03, bevelEnabled: false }]} />
      <meshStandardMaterial color="#ffffff" roughness={0.4} />
    </mesh>
    <mesh position={[-0.17, 0.46, 0.09]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="#ffffff" roughness={0.4} />
    </mesh>
    <Bar position={[0, -0.05, 0.02]} width={0.7} color="#b45309" />
    <Bar position={[0, -0.17, 0.02]} width={0.7} color="#b45309" />
    <Bar position={[-0.12, -0.29, 0.02]} width={0.46} color="#b45309" />
    {/* Magnifier */}
    <group position={[0, -0.5, 0.04]} rotation={[0, 0, -0.6]}>
      <mesh>
        <torusGeometry args={[0.06, 0.016, 12, 32]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.08, 12]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.3} />
      </mesh>
    </group>
  </GlassCard>
);

const IconTile = ({ position, children }: { position: Vec3; children: ReactNode }) => (
  <group position={position}>
    <RoundedBox args={[0.36, 0.36, 0.1]} radius={0.06} smoothness={4}>
      <meshPhysicalMaterial color="#ffffff" roughness={0.15} clearcoat={1} transparent opacity={0.9} />
    </RoundedBox>
    <group position={[0, 0, 0.07]}>{children}</group>
  </group>
);

const IconColumn = () => {
  const globe = useRef<Mesh>(null);
  const still = useMemo(prefersReducedMotion, []);
  useFrame((_, delta) => {
    if (!still && globe.current) globe.current.rotation.y += delta * 0.8;
  });

  return (
    <Float speed={still ? 0 : 1.8} rotationIntensity={0.25} floatIntensity={0.45}>
      <group position={[-2.75, 1.05, -0.3]} rotation={[0, 0.4, 0]}>
        <IconTile position={[0, 0.46, 0]}>
          <mesh ref={globe}>
            <sphereGeometry args={[0.11, 12, 10]} />
            <meshStandardMaterial color={BLUE} wireframe />
          </mesh>
        </IconTile>
        <IconTile position={[0, 0, 0]}>
          <Label position={[0, 0, 0]} size={0.13} color={BLUE}>AI</Label>
        </IconTile>
        <IconTile position={[0, -0.46, 0]}>
          <RoundedBox args={[0.2, 0.14, 0.03]} radius={0.01} smoothness={2}>
            <meshStandardMaterial color={BLUE} roughness={0.4} />
          </RoundedBox>
          <mesh position={[0, 0.02, 0.02]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.1, 0.1, 0.005]} />
            <meshStandardMaterial color="#dbeafe" />
          </mesh>
        </IconTile>
      </group>
    </Float>
  );
};

const HEXES = [RED, "#06b6d4", YELLOW, BLUE, RED];

const HexRow = () => {
  const hexes = useRef<(Group | null)[]>([]);
  const still = useMemo(prefersReducedMotion, []);
  useFrame(({ clock }) => {
    if (still) return;
    const t = clock.getElapsedTime();
    hexes.current.forEach((hex, i) => {
      if (hex) hex.rotation.y = Math.sin(t * 1.2 + i * 0.7) * 0.6;
    });
  });

  return (
    <Float speed={still ? 0 : 1.4} rotationIntensity={0.15} floatIntensity={0.35}>
      <group position={[-0.65, -1.85, 1.55]}>
        {HEXES.map((color, i) => (
          <group key={i} ref={(el) => (hexes.current[i] = el)} position={[i * 0.42, 0, 0]}>
            {/* Coloured rim prism with a white face inset */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.08, 6]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
              <cylinderGeometry args={[0.145, 0.145, 0.06, 6]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.06]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color={color} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
};

/* ---------- devices ---------- */

const screenArea = (() => {
  const s = new Shape();
  const pts: [number, number][] = [
    [-1.05, -0.55], [-0.75, -0.3], [-0.45, -0.4], [-0.15, 0.0], [0.15, -0.1], [0.45, 0.3], [1.05, 0.45],
  ];
  s.moveTo(-1.05, -0.75);
  pts.forEach(([x, y]) => s.lineTo(x, y));
  s.lineTo(1.05, -0.75);
  s.closePath();
  return { shape: s, line: pts.map(([x, y]) => [x, y, 0.012] as Vec3) };
})();

const Laptop = () => (
  <group position={[-0.35, -1.55, -0.3]} rotation={[0, 0.4, 0]} scale={0.88}>
    {/* Base */}
    <RoundedBox args={[3.2, 0.1, 2.1]} radius={0.04} smoothness={4}>
      <meshStandardMaterial color="#d7dbe0" metalness={0.6} roughness={0.32} />
    </RoundedBox>
    {/* Keyboard keys */}
    {Array.from({ length: 4 }).map((_, row) =>
      Array.from({ length: 12 }).map((__, col) => (
        <mesh key={`${row}-${col}`} position={[-1.27 + col * 0.23, 0.065, -0.62 + row * 0.2]}>
          <boxGeometry args={[0.19, 0.03, 0.16]} />
          <meshStandardMaterial color="#2b2f36" roughness={0.55} />
        </mesh>
      ))
    )}
    {/* Trackpad */}
    <mesh position={[0, 0.052, 0.62]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1, 0.55]} />
      <meshStandardMaterial color="#c4c9d0" metalness={0.5} roughness={0.25} />
    </mesh>
    {/* Lid, hinged at the back edge */}
    <group position={[0, 0.05, -1.05]} rotation={[-0.22, 0, 0]}>
      <RoundedBox args={[3.2, 2.05, 0.07]} radius={0.03} smoothness={4} position={[0, 1.02, 0]}>
        <meshStandardMaterial color="#d7dbe0" metalness={0.6} roughness={0.32} />
      </RoundedBox>
      <group position={[0, 1.02, 0.037]}>
        <mesh>
          <planeGeometry args={[3.0, 1.88]} />
          <meshStandardMaterial color="#0f1d45" emissive="#0b1a4a" emissiveIntensity={0.6} roughness={0.2} />
        </mesh>
        {/* Window dots */}
        {[RED, YELLOW, GREEN].map((c, i) => (
          <mesh key={c} position={[-1.35 + i * 0.1, 0.82, 0.01]}>
            <circleGeometry args={[0.03, 16]} />
            <meshBasicMaterial color={c} />
          </mesh>
        ))}
        {/* Sidebar */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-1.22, 0.55 - i * 0.18, 0.01]}>
            <planeGeometry args={[0.36, 0.06]} />
            <meshBasicMaterial color="#334a7d" />
          </mesh>
        ))}
        <group position={[0.35, 0, 0]} scale={[1, 0.95, 1]}>
          <mesh position={[0, 0, 0.005]}>
            <shapeGeometry args={[screenArea.shape]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.45} />
          </mesh>
          <Line points={screenArea.line} color="#7dd3fc" lineWidth={2.5} />
        </group>
      </group>
    </group>
  </group>
);

const Phone = () => (
  <group position={[1.75, -1.35, 1.0]} rotation={[1.05, -0.35, 0.12]}>
    <RoundedBox args={[0.82, 0.08, 1.62]} radius={0.035} smoothness={4}>
      <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.25} />
    </RoundedBox>
    <group position={[0, 0.042, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry args={[0.72, 1.5]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.35} roughness={0.15} />
      </mesh>
      {[0.45, 0.25, 0.05].map((y, i) => (
        <mesh key={y} position={[0, y, 0.005]}>
          <planeGeometry args={[i === 0 ? 0.56 : 0.46, i === 0 ? 0.22 : 0.06]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  </group>
);

const MarketingScene = () => (
  <>
    <Laptop />
    <Phone />
    <AdsCard />
    <DonutCard />
    <BarChartCard />
    <KpiCard />
    <VideoCard />
    <MobileAdCard />
    <IconColumn />
    <HexRow />
  </>
);

const HeroMarketingCanvas = () => (
  <Canvas
    dpr={[1, 2]}
    camera={{ fov: 40, near: 0.1, far: 50, position: [0, 0.8, 8.7] }}
    gl={{ antialias: true, alpha: true }}
    onCreated={({ camera }) => camera.lookAt(0, 0.15, 0)}
  >
    <ambientLight intensity={1.5} />
    <directionalLight position={[-3, 6, 6]} intensity={2.6} />
    <directionalLight position={[4, 2, 3]} intensity={0.9} color="#bfdbfe" />
    <MarketingScene />
  </Canvas>
);

export default HeroMarketingCanvas;
