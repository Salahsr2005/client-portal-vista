"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Clock, Users, Globe, Award, Star, Sparkles, User } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Elegant Button Component
const ElegantButton = ({ children, variant = "primary", className = "", onClick, icon: Icon, ...props }) => {
  const variants = {
    primary: `
      relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 
      hover:from-blue-700 hover:to-blue-800 text-white font-semibold
      px-8 py-4 rounded-lg shadow-lg hover:shadow-xl
      transition-all duration-300 transform hover:scale-[1.02]
      border border-blue-500/20
    `,
    guest: `
      relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-600/30
      hover:bg-slate-700/50 text-slate-200 font-semibold
      px-8 py-4 rounded-lg transition-all duration-300
      transform hover:scale-[1.02] group
    `,
  }

  return (
    <button className={`${variants[variant]} ${className}`} onClick={onClick} {...props}>
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
          <span className="text-sm font-medium">{"We're coming back in:"}</span>
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

// Stats Component
const StatsGrid = () => {
  const stats = [
    { icon: Award, number: "15+", label: "Years Experience", color: "text-amber-400" },
    { icon: Users, number: "10K+", label: "Success Stories", color: "text-blue-400" },
    { icon: Globe, number: "50+", label: "Countries", color: "text-emerald-400" },
    { icon: Star, number: "98%", label: "Success Rate", color: "text-purple-400" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="text-center group">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30 hover:bg-slate-800/40 transition-all duration-300 hover:scale-[1.02]">
            <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
            <div className="text-3xl font-bold text-slate-200 mb-2">{stat.number}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Main Hero Component
export const ElegantHeroSection = () => {
  const router = useRouter()

  const handleGuestMode = () => {
    router.push("/guest")
  }

  const handleJoinUs = () => {
    router.push("/register")
  }

  const typewriterTexts = ["rêves d'études", "ambitions académiques", "projets universitaires"]

  return (
    <section className="relative min-h-screen bg-slate-900 overflow-hidden">
      {/* Elegant Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

      {/* Corner Spotlights */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-blue-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-purple-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-emerald-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-amber-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl" />

      {/* Subtle Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-800/20 via-transparent to-slate-800/20" />



        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Hero Title with Typewriter Effect */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-slate-200 mb-2">Réalisez vos</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 min-h-[1.2em]">
                  <TypewriterText texts={typewriterTexts} />
                </span>
                <span className="block text-slate-200">à l'étranger</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              Euro Visa vous accompagne dans toutes les étapes de votre projet d'études en Europe. De la sélection des
              universités à l'obtention du visa, nous sommes à vos côtés.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <ElegantButton variant="guest" onClick={handleGuestMode} icon={User}>
                Guest Mode
              </ElegantButton>
              <ElegantButton variant="primary" onClick={handleJoinUs} icon={ArrowRight}>
                Join Us
              </ElegantButton>
            </div>
          </div>

          {/* Right Content - Professional Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-slate-600/30 bg-slate-800/20 backdrop-blur-sm">
              <Image
                src="/images/euro-visa-professional.jpg"
                alt="Euro Visa Professional"
                width={600}
                height={500}
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

        {/* Stats Grid */}
        <div className="mb-20">
          <StatsGrid />
        </div>

        {/* Countdown Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-200 mb-8">{"We're Currently Updating Our Platform"}</h3>
          <CountdownTimer targetDate="2025-09-01T00:00:00" />
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  )
}

export default ElegantHeroSection



