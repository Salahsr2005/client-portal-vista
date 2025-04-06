
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';

// Component for each particle
const Particle = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Random rotation speed for each particle
  const rotationSpeed = useMemo(() => {
    return {
      x: Math.random() * 0.01,
      y: Math.random() * 0.01,
      z: Math.random() * 0.01
    };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed.x;
      meshRef.current.rotation.y += rotationSpeed.y;
      meshRef.current.rotation.z += rotationSpeed.z;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
};

// Component for the particle field
export const ParticleField = () => {
  const { theme } = useTheme();
  const controlsRef = useRef<any>(null);
  
  // Generate particle positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 25;
      const z = (Math.random() - 0.5) * 25;
      temp.push([x, y, z]);
    }
    return temp;
  }, []);
  
  // Colors based on theme
  const colors = useMemo(() => {
    const lightColors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];
    const darkColors = ['#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9'];
    
    return theme === 'dark' ? darkColors : lightColors;
  }, [theme]);

  // Auto-rotation for the entire scene
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = 0.5;
      controlsRef.current.enableZoom = false;
      controlsRef.current.enablePan = false;
      controlsRef.current.enableDamping = true;
    }
  });

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls ref={controlsRef} enableRotate={false} />
        
        {particles.map((pos, i) => (
          <Particle 
            key={i} 
            position={pos as [number, number, number]} 
            color={colors[i % colors.length]} 
          />
        ))}
        
        {/* Add a subtle glow in the center */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[5, 32, 32]} />
          <meshBasicMaterial color={theme === 'dark' ? "#1e293b" : "#dbeafe"} transparent opacity={0.05} />
        </mesh>
      </Canvas>
    </div>
  );
};
