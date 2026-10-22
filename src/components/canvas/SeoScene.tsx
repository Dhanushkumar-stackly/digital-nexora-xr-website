import { ReactNode, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Text } from "@react-three/drei";
import { BoxGeometry, Group, Mesh, Shape } from "three";

type Vec3 = [number, number, number];

const FONT = "/fonts/manrope-800.woff";
const NAVY = "#1f3b57";
const SLATE = "#3d4f5c";
const BLUE = "#2b6c8f";
const TEAL = "#3aa597";
const RED = "#d93a45";
const CREAM = "#fbf3dc";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

/* ---------- growth bars and arrow ---------- */

const BARS = [
  { x: -1.35, height: 0.75, color: SLATE },
  { x: -0.55, height: 1.25, color: BLUE },
  { x: 0.25, height: 1.85, color: TEAL },
  { x: 1.05, height: 2.6, color: RED },
];
const FLOOR = -2.1;

const arrowShape = (() => {
  const s = new Shape();
  s.moveTo(-0.09, 0);
  s.lineTo(0.09, 0);
  s.lineTo(0.09, 1.9);
  s.lineTo(0.3, 1.9);
  s.lineTo(0, 2.4);
  s.lineTo(-0.3, 1.9);
  s.lineTo(-0.09, 1.9);
  s.closePath();
  return s;
})();

const GrowthChart = () => {
  const bars = useRef<(Mesh | null)[]>([]);
  const arrow = useRef<Group>(null);
  const still = useMemo(prefersReducedMotion, []);
  // Unit-height box anchored at its base so scale.y grows it upward.
  const geometry = useMemo(() => new BoxGeometry(0.72, 1, 0.6).translate(0, 0.5, 0), []);

  useFrame(({ clock }) => {
    if (still) return;
    const t = clock.getElapsedTime();
    BARS.forEach((bar, i) => {
      const mesh = bars.current[i];
      if (mesh) mesh.scale.y = bar.height * (0.88 + 0.12 * Math.sin(t * 1.4 + i * 0.8));
    });
    if (arrow.current) arrow.current.position.y = FLOOR + 0.1 + Math.sin(t * 1.4) * 0.08;
  });

  return (
    <group position={[0.05, 0, -0.4]}>
      {/* Ground plate */}
      <mesh position={[-0.15, FLOOR - 0.04, 0]}>
        <boxGeometry args={[3.6, 0.08, 1.1]} />
        <meshStandardMaterial color="#e9dcc0" roughness={0.7} />
      </mesh>
      {BARS.map((bar, i) => (
        <mesh
          key={bar.color}
          ref={(el) => (bars.current[i] = el)}
          geometry={geometry}
          position={[bar.x, FLOOR, 0]}
          scale={[1, bar.height, 1]}
        >
          <meshStandardMaterial color={bar.color} roughness={0.45} metalness={0.05} />
        </mesh>
      ))}
      {/* Rising arrow */}
      <group ref={arrow} position={[1.5, FLOOR + 0.1, 0.45]} rotation={[0, 0, -0.42]}>
        <mesh>
          <extrudeGeometry args={[arrowShape, { depth: 0.16, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }]} />
          <meshStandardMaterial color={RED} roughness={0.35} />
        </mesh>
      </group>
      {/* Trend line */}
      <Line
        points={[[-1.75, -1.55, 0.4], [-0.95, -1.15, 0.4], [-0.55, -1.4, 0.4], [0.1, -0.7, 0.4], [0.45, -0.95, 0.4], [1.2, 0.05, 0.4], [1.75, 0.25, 0.4]]}
        color="#f2a33a"
        lineWidth={3}
      />
    </group>
  );
};

/* ---------- magnifying glass ---------- */

const MagnifyingGlass = () => {
  const still = useMemo(prefersReducedMotion, []);
  return (
    <Float speed={still ? 0 : 1.3} rotationIntensity={0.3} floatIntensity={0.4}>
      <group position={[-0.25, 0.55, 0.9]} rotation={[0.1, 0.25, 0]}>
        {/* Rim */}
        <mesh>
          <torusGeometry args={[0.95, 0.11, 24, 80]} />
          <meshStandardMaterial color={NAVY} roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Lens */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.06, 64]} />
          <meshPhysicalMaterial
            color={CREAM}
            transparent
            opacity={0.88}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>
        {/* Lens glare */}
        <mesh position={[-0.35, 0.42, 0.05]} rotation={[0, 0, 0.6]}>
          <torusGeometry args={[0.62, 0.025, 8, 40, 1.1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
        <Label position={[0, 0.2, 0.06]} size={0.2} color={NAVY}>Social Media</Label>
        <Label position={[0, -0.16, 0.06]} size={0.46} color={NAVY}>SEO</Label>
        {/* Handle */}
        <group position={[0.78, -0.78, 0]} rotation={[0, 0, Math.PI / 4]}>
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.3, 24]} />
            <meshStandardMaterial color="#5b6b78" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.75, 0]}>
            <capsuleGeometry args={[0.14, 0.95, 8, 24]} />
            <meshStandardMaterial color="#141c24" roughness={0.35} />
          </mesh>
        </group>
      </group>
    </Float>
  );
};

/* ---------- orbiting social icons ---------- */

const playShape = (() => {
  const s = new Shape();
  s.moveTo(-0.07, -0.09);
  s.lineTo(0.1, 0);
  s.lineTo(-0.07, 0.09);
  s.closePath();
  return s;
})();

const Glyph = ({ kind }: { kind: string }) => {
  switch (kind) {
    case "play":
      return (
        <mesh position={[0, 0, 0.04]}>
          <extrudeGeometry args={[playShape, { depth: 0.03, bevelEnabled: false }]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      );
    case "camera":
      return (
        <group position={[0, 0, 0.05]}>
          <mesh>
            <torusGeometry args={[0.09, 0.022, 10, 32]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.1, 0.1, 0]}>
            <sphereGeometry args={[0.025, 10, 10]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      );
    case "check":
      return (
        <group position={[0, 0, 0.05]}>
          <mesh position={[-0.05, -0.02, 0]} rotation={[0, 0, -0.8]}>
            <boxGeometry args={[0.04, 0.12, 0.03]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.04, 0.03, 0]} rotation={[0, 0, 0.6]}>
            <boxGeometry args={[0.04, 0.22, 0.03]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      );
    case "share":
      return (
        <group position={[0, 0, 0.05]}>
          {([[-0.08, 0], [0.08, 0.08], [0.08, -0.08]] as [number, number][]).map(([x, y]) => (
            <mesh key={`${x}${y}`} position={[x, y, 0]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          ))}
          <Line points={[[0.08, 0.08, 0], [-0.08, 0, 0], [0.08, -0.08, 0]]} color="#ffffff" lineWidth={2} />
        </group>
      );
    default:
      return <Label position={[0, 0, 0.05]} size={0.17}>{kind}</Label>;
  }
};

const ICONS = [
  { color: RED, kind: "play" },
  { color: "#1d9bf0", kind: "share" },
  { color: "#c13584", kind: "camera" },
  { color: NAVY, kind: "W" },
  { color: "#2a7f8f", kind: "check" },
  { color: "#1877f2", kind: "f" },
  { color: "#e60023", kind: "P" },
  { color: "#c9a227", kind: "in" },
];
const ORBIT_RADIUS = 1.75;

const IconDisc = ({ color, children }: { color: string; children: ReactNode }) => (
  <group>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.24, 0.24, 0.08, 40]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
    </mesh>
    {children}
  </group>
);

const SocialOrbit = () => {
  const ring = useRef<Group>(null);
  const icons = useRef<(Group | null)[]>([]);
  const still = useMemo(prefersReducedMotion, []);

  useFrame(({ clock }) => {
    const t = still ? 0 : clock.getElapsedTime() * 0.25;
    ICONS.forEach((_, i) => {
      const icon = icons.current[i];
      if (!icon) return;
      const angle = t + (i / ICONS.length) * Math.PI * 2;
      icon.position.set(Math.cos(angle) * ORBIT_RADIUS, Math.sin(angle) * ORBIT_RADIUS, Math.sin(angle * 2) * 0.15);
    });
  });

  return (
    <group ref={ring} position={[-0.25, 0.55, 0.3]}>
      {/* Orbit path */}
      <mesh>
        <torusGeometry args={[ORBIT_RADIUS, 0.012, 8, 160]} />
        <meshBasicMaterial color={RED} transparent opacity={0.55} />
      </mesh>
      <mesh>
        <torusGeometry args={[ORBIT_RADIUS * 0.78, 0.008, 8, 160]} />
        <meshBasicMaterial color="#e8b98a" transparent opacity={0.6} />
      </mesh>
      {ICONS.map(({ color, kind }, i) => (
        <group key={kind} ref={(el) => (icons.current[i] = el)}>
          <IconDisc color={color}>
            <Glyph kind={kind} />
          </IconDisc>
        </group>
      ))}
    </group>
  );
};

/* ---------- confetti ---------- */

const Confetti = () => {
  const group = useRef<Group>(null);
  const still = useMemo(prefersReducedMotion, []);
  const dots = useMemo(() => {
    const colors = [RED, TEAL, "#f2a33a", BLUE, "#9bc53d"];
    let seed = 3;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 40 }, (_, i) => ({
      position: [(random() - 0.5) * 6, (random() - 0.5) * 5.4, (random() - 0.5) * 2 - 0.5] as Vec3,
      color: colors[i % colors.length],
      size: 0.025 + random() * 0.03,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!still && group.current) group.current.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.08;
  });

  return (
    <group ref={group}>
      {dots.map((dot, i) => (
        <mesh key={i} position={dot.position}>
          <sphereGeometry args={[dot.size, 8, 8]} />
          <meshStandardMaterial color={dot.color} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const SeoSceneCanvas = () => (
  <Canvas
    dpr={[1, 2]}
    camera={{ fov: 38, near: 0.1, far: 50, position: [0, 0.2, 9.8] }}
    gl={{ antialias: true, alpha: true }}
  >
    <ambientLight intensity={1.5} />
    <directionalLight position={[-3, 5, 6]} intensity={2.4} />
    <directionalLight position={[4, -1, 3]} intensity={0.7} color="#ffe4c4" />
    <group rotation={[0, -0.18, 0]}>
      <GrowthChart />
      <SocialOrbit />
      <MagnifyingGlass />
      <Confetti />
    </group>
  </Canvas>
);

export default SeoSceneCanvas;
