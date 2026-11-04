import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  Vector3,
} from "three";

const FOG = "#17387f";
const ACCENT = "#2563eb";
const HIGHLIGHT = "#60a5fa";

const RADIUS = 2;
const NODE_COUNT = 120;
const LINKS_PER_NODE = 3;
const MAX_LINK_DISTANCE = RADIUS * 0.62;
const PULSE_COUNT = 6;
const PARTICLE_COUNT = 24;

// Deterministic PRNG so the visual looks identical on every load.
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildNetwork = () => {
  const random = mulberry32(21);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const nodes: Vector3[] = [];

  // Fibonacci sphere with jitter: even coverage without looking like a grid.
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i + (random() - 0.5) * 0.7;
    nodes.push(
      new Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r)
        .normalize()
        .multiplyScalar(RADIUS)
    );
  }

  const seen = new Set<string>();
  const links: [number, number][] = [];
  const neighbours: number[][] = nodes.map(() => []);
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
        links.push([i, j]);
        neighbours[i].push(j);
        neighbours[j].push(i);
      });
  });

  const particles = Array.from({ length: PARTICLE_COUNT }, () => {
    const direction = new Vector3(
      random() - 0.5,
      random() - 0.5,
      random() - 0.5
    ).normalize();
    return direction.multiplyScalar(RADIUS * (1.12 + random() * 0.3)).toArray();
  });

  return {
    nodes,
    neighbours,
    linePositions: new Float32Array(
      links.flatMap(([a, b]) => [...nodes[a].toArray(), ...nodes[b].toArray()])
    ),
    nodePositions: new Float32Array(nodes.flatMap((n) => n.toArray())),
    hubPositions: new Float32Array(
      nodes.filter(() => random() < 0.08).flatMap((n) => n.toArray())
    ),
    particlePositions: new Float32Array(particles.flat()),
    pulses: Array.from({ length: PULSE_COUNT }, () => {
      const from = Math.floor(random() * nodes.length);
      return {
        from,
        to: neighbours[from][0] ?? from,
        progress: random(),
        speed: 0.3 + random() * 0.2,
      };
    }),
  };
};

const createDotSprite = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.45, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.7, "rgba(255,255,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
};

// Soft blue edge glow that gives the network a sense of volume.
const glowShader = {
  uniforms: { glowColor: { value: new Color(ACCENT) } },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewDir = normalize(-mvPosition.xyz);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 glowColor;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      float facing = abs(dot(vNormal, vViewDir));
      float alpha = pow(facing, 2.2) * 0.32;
      gl_FragColor = vec4(glowColor, alpha);
    }
  `,
};

const NetworkGlobe = ({ animate }: { animate: boolean }) => {
  const network = useMemo(buildNetwork, []);
  const sprite = useMemo(createDotSprite, []);
  const globe = useRef<Group>(null);
  const pulseGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(PULSE_COUNT * 3), 3)
    );
    return geometry;
  }, []);
  const point = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    if (!animate) return;
    if (globe.current) globe.current.rotation.y += delta * 0.08;

    const { nodes, neighbours, pulses } = network;
    const attribute = pulseGeometry.attributes.position as BufferAttribute;
    pulses.forEach((pulse, i) => {
      pulse.progress += delta * pulse.speed;
      if (pulse.progress >= 1) {
        const options = neighbours[pulse.to];
        pulse.from = pulse.to;
        pulse.to = options[Math.floor(Math.random() * options.length)] ?? pulse.to;
        pulse.progress = 0;
      }
      point.copy(nodes[pulse.from]).lerp(nodes[pulse.to], pulse.progress);
      attribute.setXYZ(i, point.x, point.y, point.z);
    });
    attribute.needsUpdate = true;
  });

  return (
    <group rotation={[0.32, 0, -0.1]}>
      <mesh renderOrder={-1}>
        <sphereGeometry args={[RADIUS * 1.0, 48, 48]} />
        <shaderMaterial
          args={[glowShader]}
          side={BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>

      <group ref={globe}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[network.linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={HIGHLIGHT} transparent opacity={0.55} />
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
            color={HIGHLIGHT}
            size={0.09}
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
            map={sprite}
            color="#ffffff"
            size={0.17}
            transparent
            depthWrite={false}
          />
        </points>

        {animate && (
          <points geometry={pulseGeometry}>
            <pointsMaterial
              map={sprite}
              color="#ffffff"
              size={0.12}
              transparent
              depthWrite={false}
            />
          </points>
        )}
      </group>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[network.particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={sprite}
          color={HIGHLIGHT}
          size={0.05}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

const HeroNetworkCanvas = () => {
  const container = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const animate = useMemo(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const fogColor = useMemo(() => new Color(FOG), []);

  // Stop rendering once the hero has scrolled away.
  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting)
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={animate && inView ? "always" : "demand"}
        camera={{ fov: 40, near: 0.1, far: 50, position: [0, 0, 7] }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Fog fades the far side of the network for depth. */}
        <fog attach="fog" args={[fogColor, 5.6, 9]} />
        <NetworkGlobe animate={animate} />
      </Canvas>
    </div>
  );
};

export default HeroNetworkCanvas;
