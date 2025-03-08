
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const Globe3D = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let particles: any[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor(width * height / 6000); // More particles for denser globe
      
      for (let i = 0; i < numParticles; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        // Create a gold/blue color theme for particles with more gold
        const colorChoice = Math.random();
        let color;
        if (colorChoice < 0.8) {
          // Gold particles (more of these)
          color = `rgba(255, 215, 0, ${Math.random() * 0.7 + 0.3})`;
        } else {
          // Blue particles
          color = `rgba(65, 105, 225, ${Math.random() * 0.7 + 0.3})`;
        }
        
        const radius = Math.min(width, height) * 0.35;
        
        const x = width / 2 + radius * Math.sin(phi) * Math.cos(theta);
        const y = height / 2 + radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        particles.push({
          x,
          y,
          z,
          origX: x,
          origY: y,
          origZ: z,
          radius: Math.random() * 2.5 + 1, // Slightly larger particles
          color: color,
        });
      }
    };

    const drawParticles = () => {
      if (!context) return;
      
      context.clearRect(0, 0, width, height);
      
      // Draw connections - more connections for aceternity style
      context.beginPath();
      context.strokeStyle = 'rgba(255,215,0,0.15)'; // More visible connections
      context.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 70) { // Increased connection distance
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
          }
        }
      }
      context.stroke();
      
      // Draw particles
      for (const p of particles) {
        context.beginPath();
        context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        context.fillStyle = p.color;
        context.fill();
      }

      // Add glow effect
      const gradient = context.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.min(width, height) * 0.4
      );
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      
      context.beginPath();
      context.arc(width / 2, height / 2, Math.min(width, height) * 0.4, 0, Math.PI * 2);
      context.fillStyle = gradient;
      context.fill();
    };

    const animateParticles = () => {
      const time = Date.now() * 0.0005; // Slower rotation for more elegance
      
      for (const p of particles) {
        // Rotate around the center of the sphere
        const rotSpeed = 0.1;
        const angle = time * rotSpeed;
        
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        
        // Rotate on Y axis
        const x = p.origX - width / 2;
        const z = p.origZ;
        
        p.x = cosAngle * x - sinAngle * z + width / 2;
        p.z = sinAngle * x + cosAngle * z;

        // Add slight pulsing effect
        const pulseSpeed = 0.0015;
        const pulseAmplitude = 0.03;
        const pulse = Math.sin(time * pulseSpeed * Math.PI * 2) * pulseAmplitude + 1;
        
        p.radius = (Math.random() * 2.5 + 1) * pulse;
      }
      
      drawParticles();
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div 
      className="relative w-full h-full"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg"></div>
    </motion.div>
  );
};
