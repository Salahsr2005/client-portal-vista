import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface LaunchCounterProps {
  targetDate: string
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function LaunchCounter({ targetDate, className }: LaunchCounterProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const target = new Date(targetDate).getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!mounted) {
    return <div className="h-32" /> // Prevent hydration mismatch
  }

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds }
  ]

  return (
    <div className={cn("text-center", className)}>
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
      >
        Launch Countdown
      </motion.h3>
      
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-sm border border-primary/20 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <AnimatePresence mode="wait">
                <motion.div
                  key={unit.value}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="text-2xl md:text-3xl font-bold text-primary mb-1"
                >
                  {unit.value.toString().padStart(2, '0')}
                </motion.div>
              </AnimatePresence>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                {unit.label}
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl blur-xl opacity-50 -z-10" />
          </motion.div>
        ))}
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-muted-foreground text-sm md:text-base"
      >
        Coming September 1st, 2025
      </motion.p>
    </div>
  )
}