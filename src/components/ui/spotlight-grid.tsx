import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightGridProps {
  className?: string;
  children: React.ReactNode;
}

export function SpotlightGrid({ className, children }: SpotlightGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Spotlight Effect */}
      <div
        className="absolute inset-0 opacity-80 pointer-events-none"
        style={{
          background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, 
            hsl(var(--primary) / 0.1) 0%, 
            hsl(var(--primary) / 0.05) 30%, 
            transparent 70%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}