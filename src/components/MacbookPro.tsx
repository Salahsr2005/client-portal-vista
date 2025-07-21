"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface MacbookProProps {
  src?: string
  className?: string
}

export function MacbookPro({
  src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nJyCXg9oYY06boIyx0soQAY2ZZ3CFh.png",
  className = "",
}: MacbookProProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const laptopRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -10, 0])
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 5, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9])

  useEffect(() => {
    const laptop = laptopRef.current
    const screen = screenRef.current

    if (!laptop || !screen) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: laptop,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    })

    // Screen glow animation
    tl.to(screen, {
      boxShadow: "0 0 50px rgba(59, 130, 246, 0.5), 0 0 100px rgba(59, 130, 246, 0.3)",
      duration: 0.5,
    })

    // Floating animation
    gsap.to(laptop, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-4xl mx-auto ${className}`}
      style={{ perspective: "1000px" }}
    >
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
              <div className="bg-white rounded-xl h-[400px] relative overflow-hidden">
                <img
                  src={src || "/placeholder.svg"}
                  alt="Platform Preview"
                  className="w-full h-full object-cover rounded-xl"
                />

                {/* Animated elements */}
                <motion.div
                  className="absolute bottom-4 left-4 w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
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
  )
}
