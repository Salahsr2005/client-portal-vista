import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function MacbookPro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -10, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 5, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);

  useEffect(() => {
    const laptop = laptopRef.current;
    const screen = screenRef.current;

    if (!laptop || !screen) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: laptop,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      }
    });

    // Screen glow animation
    tl.to(screen, {
      boxShadow: "0 0 50px rgba(59, 130, 246, 0.5), 0 0 100px rgba(59, 130, 246, 0.3)",
      duration: 0.5
    });

    // Floating animation
    gsap.to(laptop, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto" style={{ perspective: '1000px' }}>
      <motion.div
        ref={laptopRef}
        style={{
          rotateX,
          rotateY,
          scale,
        }}
        className="relative transform-gpu"
      >
        {/* MacBook Body */}
        <div className="relative">
          {/* Screen */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-black rounded-t-[2rem] p-6 shadow-2xl">
            {/* Camera notch */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
            </div>
            
            {/* Screen bezel */}
            <div 
              ref={screenRef}
              className="bg-black rounded-2xl p-4 relative overflow-hidden transition-all duration-500"
            >
              {/* Screen content */}
              <div className="bg-gradient-to-br from-background via-muted to-accent/10 rounded-xl h-[400px] relative overflow-hidden">
                {/* Mock Dashboard Interface */}
                <div className="absolute inset-0 p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">EV</span>
                      </div>
                      <h1 className="text-xl font-bold text-foreground">Euro Visa Dashboard</h1>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {/* Left Panel */}
                    <div className="space-y-4">
                      <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-border/50">
                        <h3 className="font-semibold text-card-foreground mb-2">Quick Stats</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Applications</span>
                            <span className="text-sm font-medium text-primary">24</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full w-3/4"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-border/50">
                        <h3 className="font-semibold text-card-foreground mb-2">Recent Activity</h3>
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">Document verified</div>
                          <div className="text-xs text-muted-foreground">Application submitted</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel */}
                    <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-4 text-primary-foreground relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                        <div className="text-4xl">📚</div>
                      </div>
                      <h3 className="font-bold text-lg mb-2">Consultation</h3>
                      <p className="text-sm opacity-90 mb-4">
                        Start your personalized consultation to find the perfect destination
                      </p>
                      <motion.button 
                        className="bg-primary-foreground/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-foreground/30 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Start Now
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Animated elements */}
                <motion.div
                  className="absolute bottom-4 left-4 w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Keyboard/Base */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black h-8 rounded-b-[2rem] relative">
            {/* Trackpad indicator */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-slate-600 rounded-full"></div>
          </div>

          {/* Reflection */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-primary/10 rounded-[2rem] pointer-events-none"></div>
        </div>

        {/* Glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 blur-3xl opacity-50 -z-10 scale-110 animate-pulse"></div>
      </motion.div>
    </div>
  );
}