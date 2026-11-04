import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload, useTexture } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../layout/Loader";
import { getDeviceCapabilities, getSafePixelRatio } from "../../utils/deviceDetection";
import { getQualitySettings } from "../../utils/qualityConfig";

// Import tech icons
import reactIcon from "../../assets/tech/reactjs.png";
import htmlIcon from "../../assets/tech/html.png";
import jsIcon from "../../assets/tech/javascript.png";
import mongoIcon from "../../assets/tech/mongodb.png";
import nodeIcon from "../../assets/tech/nodejs.png";

// Brand colors from HD NEXORA WEBTEC
const BRAND_COLORS = {
  blue: "#4169E1",
  cyan: "#00CED1",
  neonPink: "#FF1493",
  purple: "#915EFF",
};

// Tech icons configuration for floating inside Earth
const TECH_ICONS_CONFIG = [
  {
    icon: reactIcon,
    position: [0.5, 0.3, 0.2],
    color: BRAND_COLORS.cyan,
    name: "React",
    orbitSpeed: 0.8,
  },
  {
    icon: htmlIcon,
    position: [-0.4, 0.2, 0.4],
    color: BRAND_COLORS.neonPink,
    name: "HTML5",
    orbitSpeed: 1.2,
  },
  {
    icon: jsIcon,
    position: [0.3, -0.3, -0.3],
    color: BRAND_COLORS.blue,
    name: "JavaScript",
    orbitSpeed: 1.0,
  },
  {
    icon: mongoIcon,
    position: [-0.3, -0.2, 0.5],
    color: BRAND_COLORS.purple,
    name: "MongoDB",
    orbitSpeed: 0.9,
  },
  {
    icon: nodeIcon,
    position: [0.2, 0.4, -0.4],
    color: "#68A063",
    name: "Node.js",
    orbitSpeed: 1.1,
  },
];

// Marketing bar charts - positioned inside Earth
const MARKETING_DATA = [
  { height: 0.6, color: BRAND_COLORS.blue, position: [0.7, -0.3, 0], radius: 0.8 },
  { height: 0.75, color: BRAND_COLORS.cyan, position: [0.5, -0.3, 0.5], radius: 0.8 },
  { height: 0.45, color: BRAND_COLORS.neonPink, position: [0, -0.3, 0.7], radius: 0.8 },
  { height: 0.65, color: BRAND_COLORS.purple, position: [-0.5, -0.3, 0.5], radius: 0.8 },
  { height: 0.55, color: BRAND_COLORS.blue, position: [-0.7, -0.3, 0], radius: 0.8 },
  { height: 0.7, color: BRAND_COLORS.cyan, position: [-0.5, -0.3, -0.5], radius: 0.8 },
  { height: 0.5, color: BRAND_COLORS.neonPink, position: [0, -0.3, -0.7], radius: 0.8 },
  { height: 0.6, color: BRAND_COLORS.purple, position: [0.5, -0.3, -0.5], radius: 0.8 },
];

// Floating Tech Icon Component
const FloatingTechIcon: React.FC<{
  iconTexture: string;
  position: [number, number, number];
  color: string;
  index: number;
  orbitSpeed: number;
}> = ({ iconTexture, position, color, index, orbitSpeed }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Load texture
  const texture = useLoader(THREE.TextureLoader, iconTexture);

  // Cleanup texture on unmount
  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [texture]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * orbitSpeed * 0.3;

      // Orbital floating motion inside sphere
      const radius = 0.6;
      const orbitAngle = (index / TECH_ICONS_CONFIG.length) * Math.PI * 2 + time;
      const verticalFloat = Math.sin(time * 2 + index) * 0.1;

      meshRef.current.position.x = Math.cos(orbitAngle) * radius * 0.7;
      meshRef.current.position.y = verticalFloat;
      meshRef.current.position.z = Math.sin(orbitAngle) * radius * 0.7;

      // Gentle rotation of icon
      meshRef.current.rotation.y = time * 0.5;
    }

    // Pulsing glow
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.8;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <planeGeometry args={[0.25, 0.25]} />
        <meshStandardMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      {/* Glow ring around icon */}
      <mesh ref={glowRef} position={position}>
        <ringGeometry args={[0.15, 0.18, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// 3D Bar Chart Component
const MarketingBar: React.FC<{
  height: number;
  color: string;
  position: [number, number, number];
  index: number;
}> = ({ height, color, position, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing height animation
      const pulse = Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.05 + 1;
      meshRef.current.scale.y = pulse;

      // Subtle floating
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[0.08, height, 0.08]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.7}
        roughness={0.2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

// Realistic Earth Globe Component
const RealisticEarth: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Load Earth texture
  const earthTexture = useTexture("./planet/textures/Planet_baseColor.png");
  const cloudsTexture = useTexture("./planet/textures/Clouds_baseColor.png");

  useFrame((state) => {
    if (meshRef.current) {
      // Slow Earth rotation
      meshRef.current.rotation.y += 0.001;
    }

    if (cloudsRef.current) {
      // Slightly faster cloud rotation for depth
      cloudsRef.current.rotation.y += 0.0015;
    }

    if (glowRef.current) {
      // Pulsing atmospheric glow
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.03 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  // Custom shader material for atmospheric glow
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
          gl_FragColor = vec4(glowColor, 1.0) * intensity * 1.2;
        }
      `,
      uniforms: {
        glowColor: { value: new THREE.Color(BRAND_COLORS.cyan) },
      },
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
  }, []);

  return (
    <group>
      {/* Main Earth Sphere with realistic texture */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1.0, 128, 128]} />
        <meshStandardMaterial
          map={earthTexture}
          metalness={0.05}
          roughness={0.8}
          emissive="#1a2a3a"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.01, 96, 96]} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.35}
          depthWrite={false}
          roughness={1.0}
        />
      </mesh>

      {/* Atmospheric glow using custom shader */}
      <mesh ref={glowRef} scale={1.15}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Additional soft outer glow */}
      <mesh scale={1.2}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial
          color={BRAND_COLORS.cyan}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// Main Marketing Earth Scene
const MarketingEarthScene: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Gentle overall scene rotation
      groupRef.current.rotation.y += 0.0005;
    }
  });

  const scale = isMobile ? 0.6 : 1.2;
  const position: [number, number, number] = isMobile ? [0, -1, 0] : [2, -1, 0]; // Centered better for visibility
  const rotation: [number, number, number] = [-0.2, -0.3, 0.1]; // Optimal viewing angle

  return (
    <group ref={groupRef} scale={scale} position={position} rotation={rotation}>
      {/* Advanced Lighting Setup for Realism */}
      <ambientLight intensity={0.2} />

      {/* Main sun light from upper right - simulates sunlight */}
      <directionalLight
        position={[8, 4, 3]}
        intensity={2.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#ffffff"
      />

      {/* Rim lights for depth */}
      <pointLight position={[-3, 2, -3]} intensity={0.6} color={BRAND_COLORS.blue} />
      <pointLight position={[3, -2, 3]} intensity={0.5} color={BRAND_COLORS.neonPink} />
      <pointLight position={[0, 3, 0]} intensity={0.4} color={BRAND_COLORS.cyan} />

      {/* Accent spotlight */}
      <spotLight
        position={[0, 5, 5]}
        angle={0.4}
        penumbra={1}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />

      {/* Realistic Earth Globe */}
      <RealisticEarth />

      {/* Floating Tech Icons Inside Earth */}
      {TECH_ICONS_CONFIG.map((icon, index) => (
        <FloatingTechIcon
          key={`tech-${index}`}
          iconTexture={icon.icon}
          position={icon.position as [number, number, number]}
          color={icon.color}
          index={index}
          orbitSpeed={icon.orbitSpeed}
        />
      ))}

      {/* Marketing Bar Charts Inside Earth */}
      {MARKETING_DATA.map((data, index) => (
        <MarketingBar
          key={`bar-${index}`}
          height={data.height}
          color={data.color}
          position={data.position as [number, number, number]}
          index={index}
        />
      ))}

      {/* Additional particle-like accent lights */}
      <pointLight position={[0.5, 0.5, 0.5]} intensity={0.3} color={BRAND_COLORS.purple} distance={2} />
      <pointLight position={[-0.5, -0.5, -0.5]} intensity={0.3} color={BRAND_COLORS.cyan} distance={2} />
    </group>
  );
};

// Canvas Wrapper Component
const MarketingEarthCanvas: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  // Get device capabilities for performance optimization
  const deviceCaps = useMemo(() => getDeviceCapabilities(), []);
  const qualitySettings = useMemo(() => getQualitySettings(deviceCaps.quality), [deviceCaps.quality]);
  const pixelRatio = useMemo(() => getSafePixelRatio(), []);

  return (
    <>
      <Canvas
        frameloop={qualitySettings.frameloop}
        shadows={qualitySettings.shadows}
        dpr={pixelRatio}
        camera={{
          position: isMobile ? [0, 0, 6] : [0, 0, 7],
          fov: isMobile ? 70 : 60,
        }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: qualitySettings.antialias,
          alpha: true,
          powerPreference: isMobile ? "default" : "high-performance",
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={!isMobile}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            target={isMobile ? [0, -1, 0] : [2, -1, 0]} // Focus on centered Earth
          />
          <MarketingEarthScene isMobile={isMobile} />
          <Preload all />
        </Suspense>
      </Canvas>
    </>
  );
};

export default MarketingEarthCanvas;
