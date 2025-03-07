
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const parentWidth = canvas.parentElement?.clientWidth || 500;
      const parentHeight = canvas.parentElement?.clientHeight || 500;
      canvas.width = parentWidth;
      canvas.height = parentHeight;
    };
    
    // Initialize canvas size
    setCanvasDimensions();
    
    // Handle resize
    window.addEventListener('resize', setCanvasDimensions);
    
    // Globe parameters
    const dots: { x: number; y: number; z: number; radius: number; alpha: number }[] = [];
    const numDots = 500;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
    const rotationSpeed = 0.001;
    let angle = 0;
    
    // Create dots on the globe surface
    for (let i = 0; i < numDots; i++) {
      // Random spherical coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Convert to Cartesian coordinates
      const x = maxRadius * Math.sin(phi) * Math.cos(theta);
      const y = maxRadius * Math.sin(phi) * Math.sin(theta);
      const z = maxRadius * Math.cos(phi);
      
      dots.push({
        x,
        y,
        z,
        radius: 1 + Math.random() * 1.5,
        alpha: 0.5 + Math.random() * 0.5
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Move the origin to the center
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Update rotation angle
      angle += rotationSpeed;
      
      // Sort dots by z value (for proper rendering order)
      const sortedDots = [...dots].sort((a, b) => a.z - b.z);
      
      // Draw each dot
      sortedDots.forEach(dot => {
        // Apply rotation on Y axis
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rotatedX = dot.x * cosA - dot.z * sinA;
        const rotatedZ = dot.x * sinA + dot.z * cosA;
        
        // Perspective projection - objects appear smaller as they get further
        const scale = (1000 / (1000 - rotatedZ));
        const projectedX = rotatedX * scale;
        const projectedY = dot.y * scale;
        
        // Dot brightness based on z-coordinate
        const brightness = (rotatedZ / maxRadius + 1) / 2;
        
        // Draw the dot
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, dot.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 149, 237, ${brightness * dot.alpha})`;
        ctx.fill();
      });
      
      ctx.restore();
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  return (
    <motion.div 
      className="relative w-full h-full min-h-[500px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0" 
      />
    </motion.div>
  );
}
