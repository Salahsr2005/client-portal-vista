
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

export function AdvancedLaptop() {
  const laptopRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!laptopRef.current || !screenRef.current || !particlesRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    // Floating animation
    tl.to(laptopRef.current, {
      y: -20,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Screen glow effect
    gsap.to(screenRef.current, {
      boxShadow: "0 0 60px rgba(59, 130, 246, 0.4), 0 0 100px rgba(147, 51, 234, 0.2)",
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "power2.inOut"
    });

    // Particle animation
    const particles = particlesRef.current.children;
    gsap.set(particles, {
      x: () => gsap.utils.random(-200, 200),
      y: () => gsap.utils.random(-200, 200),
      scale: () => gsap.utils.random(0.1, 0.5),
      opacity: () => gsap.utils.random(0.1, 0.3)
    });

    gsap.to(particles, {
      rotation: 360,
      duration: () => gsap.utils.random(10, 20),
      repeat: -1,
      ease: "none",
      stagger: {
        each: 0.1,
        from: "random"
      }
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-sm"
          />
        ))}
      </div>

      {/* Laptop container */}
      <div ref={laptopRef} className="relative">
        {/* Laptop base */}
        <div className="relative">
          {/* Screen */}
          <div 
            ref={screenRef}
            className="w-80 h-52 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-t-xl border-4 border-gray-700 relative overflow-hidden"
          >
            {/* Screen content */}
            <div className="absolute inset-2 bg-gradient-to-br from-blue-950 to-purple-950 rounded-lg overflow-hidden">
              {/* Animated code lines */}
              <div className="p-4 space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ 
                      width: `${Math.random() * 60 + 40}%`, 
                      opacity: [0, 1, 0.7] 
                    }}
                    transition={{ 
                      delay: i * 0.2, 
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                  />
                ))}
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ 
                  x: [0, 20, 0], 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0] 
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-orange-400 rounded-lg"
              />
            </div>

            {/* Screen reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-t-xl" />
          </div>

          {/* Keyboard base */}
          <div className="w-96 h-4 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-xl -mt-1">
            <div className="flex justify-center pt-2">
              <div className="w-16 h-1 bg-gray-600 rounded-full" />
            </div>
          </div>

          {/* Keyboard */}
          <div className="w-80 h-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-sm mx-auto -mt-1">
            {/* Key rows */}
            <div className="flex justify-center space-x-1 pt-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-2 h-1 bg-gray-700 rounded-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Glow effects */}
        <div className="absolute -inset-10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl -z-10" />
        <div className="absolute -inset-5 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-2xl -z-10" />
      </div>
    </div>
  );
}
