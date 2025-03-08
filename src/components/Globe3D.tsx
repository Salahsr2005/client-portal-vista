
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export const Globe3D = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let points: any[] = [];
    let animationFrameId: number;
    let globeSize = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let lastMouseMoveTime = 0;
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseMoving = true;
        lastMouseMoveTime = Date.now();
      }
    };

    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      canvas.width = width;
      canvas.height = height;
      globeSize = Math.min(width, height) * 0.4;
      initPoints();
    };

    const initPoints = () => {
      points = [];
      // Create a denser grid of points for GitHub-like visualization
      const pointCount = Math.floor(globeSize * 2); // More points for denser look
      
      for (let i = 0; i < pointCount; i++) {
        // Sample points on a sphere using spherical coordinates
        const lat = Math.random() * Math.PI - Math.PI / 2;
        const lng = Math.random() * Math.PI * 2;
        
        // Convert to Cartesian coordinates
        const x = Math.cos(lat) * Math.sin(lng);
        const y = Math.sin(lat);
        const z = Math.cos(lat) * Math.cos(lng);
        
        // Different shades of green (GitHub style) mixed with golden for Aceternity look
        let color: string;
        const colorChoice = Math.random();
        
        if (colorChoice < 0.6) {
          // Green points (GitHub style - different intensities)
          const intensity = Math.random() * 0.7 + 0.3;
          // Use different shades of green
          const r = Math.floor(0 * intensity);
          const g = Math.floor((140 + Math.random() * 70) * intensity);
          const b = Math.floor(40 * intensity);
          color = `rgba(${r}, ${g}, ${b}, ${intensity})`;
        } else {
          // Gold points (Aceternity style)
          const intensity = Math.random() * 0.7 + 0.3;
          color = `rgba(255, 215, 0, ${intensity})`;
        }
        
        points.push({
          x,
          y,
          z,
          size: 0.5 + Math.random() * 1.5, // Varied sizes for depth
          color,
          originalX: x,
          originalY: y,
          originalZ: z,
          connections: [] // Will store indexes of connected points
        });
      }
      
      // Find connections - GitHub-style connected grid
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const p1 = points[i];
          const p2 = points[j];
          
          // Calculate 3D distance
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          // Connect close points
          if (distance < 0.3) { // Smaller threshold for more selective connections
            p1.connections.push(j);
            p2.connections.push(i);
          }
        }
      }
      
      setIsLoading(false);
    };
    
    const drawScene = () => {
      if (!context) return;
      
      context.clearRect(0, 0, width, height);
      
      // Auto-deactivate mouse movement after a period of inactivity
      if (isMouseMoving && Date.now() - lastMouseMoveTime > 2000) {
        isMouseMoving = false;
      }
      
      // Get time for rotation
      const time = Date.now() * 0.0001;
      
      // Calculate rotation
      let rotationX = time;
      let rotationY = time * 0.5;
      
      // If mouse is moving, adjust rotation based on mouse position
      if (isMouseMoving) {
        rotationX = (mouseY - height / 2) * 0.005;
        rotationY = (mouseX - width / 2) * 0.005;
      }

      // Draw connections first (behind points)
      context.beginPath();
      context.strokeStyle = 'rgba(100, 180, 100, 0.1)'; // Subtle green connections
      context.lineWidth = 0.5;
      
      const drawnConnections = new Set(); // Track connections to avoid duplicates
      
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        
        // 3D rotation transform
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        
        // Apply rotation
        let x1 = p1.originalX;
        let y1 = p1.originalY;
        let z1 = p1.originalZ;
        
        // Rotate around X
        const temp1Y = y1;
        y1 = y1 * cosX - z1 * sinX;
        z1 = temp1Y * sinX + z1 * cosX;
        
        // Rotate around Y
        const temp1X = x1;
        x1 = x1 * cosY + z1 * sinY;
        z1 = -temp1X * sinY + z1 * cosY;
        
        // Apply 3D projection
        const scale1 = 300 / (300 + z1 * 100);
        const screenX1 = width / 2 + x1 * globeSize * scale1;
        const screenY1 = height / 2 + y1 * globeSize * scale1;
        
        // Only draw if point is visible (facing camera)
        const pointVisible = z1 > -1;
        
        // Store projected coordinates for later point drawing
        p1.screenX = screenX1;
        p1.screenY = screenY1;
        p1.scale = scale1;
        p1.visible = pointVisible;
        
        // Draw connections from this point
        if (pointVisible) {
          for (const connIndex of p1.connections) {
            const p2 = points[connIndex];
            
            // Only draw each connection once
            const connectionId = i < connIndex ? `${i}-${connIndex}` : `${connIndex}-${i}`;
            if (drawnConnections.has(connectionId)) continue;
            drawnConnections.add(connectionId);
            
            // Same rotation for connected point
            let x2 = p2.originalX;
            let y2 = p2.originalY;
            let z2 = p2.originalZ;
            
            // Rotate around X
            const temp2Y = y2;
            y2 = y2 * cosX - z2 * sinX;
            z2 = temp2Y * sinX + z2 * cosX;
            
            // Rotate around Y
            const temp2X = x2;
            x2 = x2 * cosY + z2 * sinY;
            z2 = -temp2X * sinY + z2 * cosY;
            
            // Only draw if the connected point is also visible
            if (z2 > -1) {
              const scale2 = 300 / (300 + z2 * 100);
              const screenX2 = width / 2 + x2 * globeSize * scale2;
              const screenY2 = height / 2 + y2 * globeSize * scale2;
              
              // Store for later point drawing
              p2.screenX = screenX2;
              p2.screenY = screenY2;
              p2.scale = scale2;
              p2.visible = true;
              
              // Draw the connection line with gradient opacity based on depth
              const lineOpacity = 0.05 + 0.1 * Math.min(scale1, scale2);
              context.strokeStyle = `rgba(100, 180, 100, ${lineOpacity})`;
              context.beginPath();
              context.moveTo(screenX1, screenY1);
              context.lineTo(screenX2, screenY2);
              context.stroke();
            }
          }
        }
      }
      
      // Now draw all points on top of connections
      for (const p of points) {
        if (p.visible) {
          context.beginPath();
          
          // Size affected by depth
          const size = p.size * p.scale * 2;
          
          // Make points with gradient for more 3D feel
          const gradient = context.createRadialGradient(
            p.screenX, p.screenY, 0,
            p.screenX, p.screenY, size
          );
          
          // Parse the rgba to get components
          const rgba = p.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)/);
          
          if (rgba) {
            const [_, r, g, b, a] = rgba.map(Number);
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            context.fillStyle = gradient;
            context.arc(p.screenX, p.screenY, size, 0, Math.PI * 2);
            context.fill();
          }
        }
      }
      
      // Add a subtle glow in the center
      const glowGradient = context.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, globeSize
      );
      glowGradient.addColorStop(0, 'rgba(100, 255, 100, 0.05)');
      glowGradient.addColorStop(0.5, 'rgba(100, 255, 100, 0.025)');
      glowGradient.addColorStop(1, 'rgba(100, 255, 100, 0)');
      
      context.beginPath();
      context.fillStyle = glowGradient;
      context.arc(width / 2, height / 2, globeSize, 0, Math.PI * 2);
      context.fill();
      
      animationFrameId = requestAnimationFrame(drawScene);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', handleMouseMove);
    drawScene();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div 
      className="relative w-full h-full flex items-center justify-center"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Globe className="h-12 w-12 text-primary animate-pulse" />
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      
      {/* Subtle gradient overlay to enhance depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20 rounded-lg pointer-events-none"></div>
    </motion.div>
  );
};
