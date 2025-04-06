
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from 'next-themes';

// Component for each particle
const Particle = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
};

// Component for the particles field
const ParticleField3D = () => {
  const { theme } = useTheme();
  
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

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} />
      
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
    </>
  );
};

// Main component wrapper
export const ParticleField = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 text-blue-500 animate-spin rounded-full border-4 border-t-transparent border-blue-500" />
        </div>
      ) : (
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
          <ParticleField3D />
        </Canvas>
      )}
      
      {/* Subtle gradient overlay to enhance depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20 rounded-lg pointer-events-none"></div>
    </motion.div>
  );
};
