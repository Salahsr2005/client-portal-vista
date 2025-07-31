"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, Clock, Users, Globe, Award, Star, Sparkles, User } from "lucide-react"
import { useRouter } from "next/navigation"
// Animated Counter Hook
const useAnimatedCounter = (end: number, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const countRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * (end - start) + start)

      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isVisible, end, start, duration])

  return { count, ref: countRef }
}

// Elegant Button Component
const ElegantButton = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  icon: Icon,
  disabled = false,
  ...props
}) => {
  const variants = {
    primary: `
      relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 
      hover:from-blue-700 hover:to-blue-800 text-white font-semibold
      px-8 py-4 rounded-lg shadow-lg hover:shadow-xl
      transition-all duration-300 transform hover:scale-[1.02]
      border border-blue-500/20
      ${disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}
    `,
    guest: `
      relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-600/30
      hover:bg-slate-700/50 text-slate-200 font-semibold
      px-8 py-4 rounded-lg transition-all duration-300
      transform hover:scale-[1.02] group
    `,
  }

  return (
    <button
      className={`${variants[variant]} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />}
        {children}
      </span>
    </button>
  )
}

// Typewriter Effect Component
const TypewriterText = ({ texts, className = "" }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const text = texts[currentTextIndex]

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 2000)
      return () => clearTimeout(pauseTimer)
    }

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < text.length) {
            setCurrentText(text.slice(0, currentText.length + 1))
          } else {
            setIsPaused(true)
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timer)
  }, [currentText, isDeleting, isPaused, currentTextIndex, texts])

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Countdown Timer Component
const CountdownTimer = ({ targetDate }) => {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
      <div className="flex items-center justify-center gap-6 text-slate-200">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium">{t("modernHero.countdown.subtitle")}</span>
        </div>
        <div className="flex gap-4">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-600/30">
                <div className="text-xl font-bold tabular-nums">{value.toString().padStart(2, "0")}</div>
              </div>
              <div className="text-xs text-slate-400 mt-1 capitalize">{unit}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Animated Stat Card Component
const AnimatedStatCard = ({ icon: Icon, number, suffix = "", label, color, isAnimated = false }) => {
  const numericValue = isAnimated ? Number.parseInt(number.replace(/\D/g, "")) : 0
  const { count, ref } = useAnimatedCounter(numericValue, 2500)

  const displayValue = isAnimated ? `${count}${suffix}` : number

  return (
    <div className="text-center group">
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30 hover:bg-slate-800/40 transition-all duration-300 hover:scale-[1.02]">
        <Icon className={`h-8 w-8 ${color} mx-auto mb-3`} />
        <div ref={ref} className="text-3xl font-bold text-slate-200 mb-2 tabular-nums">
          {displayValue}
        </div>
        <div className="text-slate-400 text-sm">{label}</div>
      </div>
    </div>
  )
}

// Stats Component with Animated Counters
const StatsGrid = () => {
  const { t } = useTranslation()

  const stats = [
    {
      icon: Award,
      number: "5",
      suffix: "+",
      label: t("modernHero.stats.experience"),
      color: "text-amber-400",
      isAnimated: true,
    },
    {
      icon: Users,
      number: "1000",
      suffix: "+",
      label: t("modernHero.stats.students"),
      color: "text-blue-400",
      isAnimated: true,
    },
    {
      icon: Globe,
      number: "10",
      suffix: "+",
      label: t("modernHero.stats.countries"),
      color: "text-emerald-400",
      isAnimated: true,
    },
    {
      icon: Star,
      number: "98",
      suffix: "%",
      label: t("modernHero.stats.success"),
      color: "text-purple-400",
      isAnimated: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <AnimatedStatCard
          key={index}
          icon={stat.icon}
          number={stat.number}
          suffix={stat.suffix}
          label={stat.label}
          color={stat.color}
          isAnimated={stat.isAnimated}
        />
      ))}
    </div>
  )
}

// Main Hero Component
export const ModernHeroSection = () => {
  const { t } = useTranslation()

  const handleGuestMode = () => {
    window.location.href = "/guest"
  }

  const handleJoinUs = () => {
    window.location.href = "/register"
  }

  const typewriterTexts = [t("modernHero.subtitle"), t("modernHero.subtitle2"), t("modernHero.subtitle3")]

  return (
    <section className="relative min-h-screen bg-slate-900 overflow-hidden">
      {/* Elegant Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

      {/* Corner Spotlights */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 100%)",
        }}
      />

      {/* Subtle Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-800/20 via-transparent to-slate-800/20" />

      <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Guest Mode Badge */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-full px-4 py-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-slate-300 text-sm font-medium">{t("modernHero.badge")}</span>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Hero Title with Typewriter Effect */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-slate-200 mb-2">{t("modernHero.title")}</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 min-h-[1.2em]">
                  <TypewriterText texts={typewriterTexts} />
                </span>
                <span className="block text-slate-200">à l'étranger</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">{t("modernHero.description")}</p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center space-y-6">
              {/* Application Season Countdown */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-200 mb-4">{t("modernHero.countdown.title")}</h3>
                <CountdownTimer targetDate="2025-09-01T00:00:00" />
              </div>

              {/* Disabled Buttons with Explanation */}
              <div className="flex flex-col sm:flex-row gap-4 ">
                <ElegantButton variant="guest" onClick={handleGuestMode} icon={User}>
                  {t("modernHero.guestMode")} 
                 </ElegantButton>
                <ElegantButton
                  variant="primary"
                  onClick={() => {}}
                  icon={ArrowRight}
                  disabled
                  className="cursor-not-allowed"
                >
                  {t("modernHero.joinUs")} - Coming Soon
                </ElegantButton>
              </div>

              <p className="text-sm text-slate-400 text-center max-w-md">
                Registration and applications will open on September 1st, 2025. Get ready for the new academic season!
              </p>
            </div>
          </div>

          {/* Right Content - Professional Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-slate-600/30 bg-slate-800/20 backdrop-blur-sm">
              <img
                src="/assets/hero-image?height=500&width=600"
                alt="Euro Visa Professional"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-slate-200">
                <h3 className="text-2xl font-bold mb-1">Euro Visa</h3>
                <p className="text-slate-300">Votre passerelle vers l'Europe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid with Animated Counters */}
        <div className="mb-20">
          <StatsGrid />
        </div>

        {/* Countdown Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-200 mb-8">{t("modernHero.countdown.title")}</h3>
          <CountdownTimer targetDate="2025-09-01T00:00:00" />
        </div>
      </div>
    </section>
  )
}

// Default export for compatibility
export default ModernHeroSection




