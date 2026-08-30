'use client';

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Procedural Olympic Barbell + Metallic Plates
function ProceduralBarbell({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Continuous subtle 3D rotation + smooth mouse parallax response
    groupRef.current.rotation.y += delta * 0.35;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.current[1] * 0.2, 0.04);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -mouse.current[0] * 0.2, 0.04);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.45}>
      {/* 1. Main Olympic Steel Bar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 7.2, 32]} />
        <meshStandardMaterial color="#8e9298" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Knurling Grips */}
      {[-1.3, 1.3].map((x, i) => (
        <mesh key={`knurl-${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.072, 0.072, 1.4, 32]} />
          <meshStandardMaterial color="#b0b4b8" metalness={0.8} roughness={0.5} />
        </mesh>
      ))}

      {/* Sleeves */}
      {[-3.0, 3.0].map((x, i) => (
        <mesh key={`sleeve-${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 1.4, 32]} />
          <meshStandardMaterial color="#d4d8dc" metalness={0.98} roughness={0.1} />
        </mesh>
      ))}

      {/* 2. Left Bumper Plates Stack (Gold & Obsidian) */}
      <group position={[-2.5, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.95, 0.95, 0.24, 32]} />
          <meshStandardMaterial color="#F5C518" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.92, 0.92, 0.22, 32]} />
          <meshStandardMaterial color="#161622" metalness={0.75} roughness={0.35} />
        </mesh>
        <mesh position={[-0.54, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.88, 0.88, 0.2, 32]} />
          <meshStandardMaterial color="#F5C518" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Right Bumper Plates Stack (Gold & Obsidian) */}
      <group position={[2.5, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.95, 0.95, 0.24, 32]} />
          <meshStandardMaterial color="#F5C518" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.92, 0.92, 0.22, 32]} />
          <meshStandardMaterial color="#161622" metalness={0.75} roughness={0.35} />
        </mesh>
        <mesh position={[0.54, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.88, 0.88, 0.2, 32]} />
          <meshStandardMaterial color="#F5C518" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// Full-Screen Floating Chalk Dust Particles
function ChalkDustParticles({ count = 450 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.025;
    pointsRef.current.rotation.x += delta * 0.012;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#FFD966"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

export default function BarbellHeroScene() {
  const mouse = useRef<[number, number]>([0, 0]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouse.current = [
      (clientX / innerWidth) * 2 - 1,
      -(clientY / innerHeight) * 2 + 1,
    ];
  };

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto"
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 48 }}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 10]} intensity={1.8} color="#ffffff" />
          <spotLight position={[-10, -10, 10]} intensity={1.5} color="#F5C518" angle={0.6} />
          <pointLight position={[0, 2, 2.5]} intensity={2.2} color="#FFD966" />

          {/* 3D Elements in Background */}
          <ProceduralBarbell mouse={mouse} />
          <ChalkDustParticles count={450} />
        </Canvas>
      </Suspense>

      {/* Atmospheric Vignette & Contrast Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/40 via-background/60 to-background" />
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient" style={{ background: 'radial-gradient(circle at center, rgba(10, 10, 15, 0.4) 0%, rgba(10, 10, 15, 0.85) 100%)' }} />
    </div>
  );
}
