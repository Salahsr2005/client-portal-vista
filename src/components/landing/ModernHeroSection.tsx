"use client"

import { useState, useEffect, useRef } from "react"
import {
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Play,
  Star,
  Globe,
  Award,
  Users,
  ChevronRight,
  Zap,
  Target,
  BookOpen,
  GraduationCap,
  Plane,
} from "lucide-react"

// Modern Button Component
const ModernButton = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-500 gap-2 group relative overflow-hidden transform-gpu"
  const variants = {
    default:
      "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl",
    ghost: "border-2 border-white/30 text-foreground hover:bg-white/20 backdrop-blur-xl shadow-lg hover:shadow-xl",
    shimmer: "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-2xl",
  }
  const sizes = {
    default: "px-4 py-2 text-sm sm:px-6 sm:py-3",
    lg: "px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  )
}

// Animated Spotlight Component
const AnimatedSpotlight = ({ delay = 0, duration = 8, size = 300, color = "blue" }) => {
  const [position, setPosition] = useState({ x: Math.random() * 100, y: Math.random() * 100 })

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [duration])

  const colors = {
    blue: "from-blue-500/30 via-cyan-400/20 to-transparent",
    purple: "from-purple-500/30 via-pink-400/20 to-transparent",
    green: "from-emerald-500/30 via-green-400/20 to-transparent",
    orange: "from-orange-500/30 via-yellow-400/20 to-transparent",
  }

  return (
    <div
      className={`absolute rounded-full bg-gradient-radial ${colors[color]} blur-3xl opacity-60 transition-all ease-in-out pointer-events-none`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        animationDelay: `${delay}s`,
        transitionDuration: `${duration * 1000}ms`,
      }}
    />
  )
}

// Floating Element Component
const FloatingElement = ({ children, className = "", delay = 0 }) => (
  <div
    className={`absolute animate-float opacity-40 pointer-events-none ${className}`}
    style={{ animationDelay: `${delay}s`, animationDuration: "6s" }}
  >
    {children}
  </div>
)

// Particle System Component
const ParticleSystem = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white/20 rounded-full animate-float-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// Stat Card Component
const StatCard = ({ icon: Icon, value, label, gradient, delay = 0 }) => (
  <div className="relative group transform-gpu" style={{ animationDelay: `${delay}s` }}>
    <div
      className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500`}
    />
    <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/30 rounded-2xl p-4 sm:p-6 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 shadow-lg hover:shadow-2xl transform-gpu">
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 transform-gpu`}
        >
          <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
        <div>
          <div
            className={`text-lg sm:text-2xl font-bold bg-gradient-to-r ${gradient.replace("to-purple-600", "to-purple-700")} bg-clip-text text-transparent`}
          >
            {value}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground font-medium">{label}</div>
        </div>
      </div>
    </div>
  </div>
)

// Main Hero Section Component
export const ModernHeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    const handleScroll = () => setScrollY(window.scrollY)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
    }
  }, [])

  const achievements = [
    { icon: Award, value: "15+", label: "Years Excellence", gradient: "from-amber-400 to-yellow-600" },
    { icon: Users, value: "10K+", label: "Success Stories", gradient: "from-blue-400 to-cyan-600" },
    { icon: Globe, value: "50+", label: "Countries", gradient: "from-green-400 to-emerald-600" },
    { icon: Star, value: "98%", label: "Success Rate", gradient: "from-purple-400 to-pink-600" },
  ]

  const contactInfo = [
    { icon: Phone, text: "+213 123 456 789", color: "text-blue-400", bg: "from-blue-500/10 to-cyan-500/10" },
    { icon: Mail, text: "contact@eurovisa.com", color: "text-purple-400", bg: "from-purple-500/10 to-pink-500/10" },
    { icon: MapPin, text: "Algiers, Algeria", color: "text-green-400", bg: "from-green-500/10 to-emerald-500/10" },
    { icon: Clock, text: "9h - 18h", color: "text-orange-400", bg: "from-orange-500/10 to-yellow-500/10" },
  ]

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)] opacity-30 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Particle System */}
      <ParticleSystem />

      {/* Animated Spotlights */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedSpotlight delay={0} duration={10} size={400} color="blue" />
        <AnimatedSpotlight delay={2} duration={8} size={320} color="purple" />
        <AnimatedSpotlight delay={4} duration={12} size={280} color="green" />
        <AnimatedSpotlight delay={1} duration={9} size={360} color="orange" />
        <AnimatedSpotlight delay={6} duration={7} size={240} color="blue" />
        <AnimatedSpotlight delay={8} duration={11} size={200} color="purple" />
      </div>

      {/* Mouse-following gradient */}
      <div
        className="absolute inset-0 opacity-20 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 25%, transparent 50%)`,
        }}
      />

      {/* Floating geometric elements */}
      <div className="absolute inset-0">
        <FloatingElement className="top-10 left-5 sm:top-20 sm:left-10" delay={0}>
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-blue-400/40 rounded-full animate-spin-slow" />
        </FloatingElement>
        <FloatingElement className="top-16 right-10 sm:top-32 sm:right-20" delay={1}>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-lg rotate-45" />
        </FloatingElement>
        <FloatingElement className="bottom-16 left-10 sm:bottom-32 sm:left-20" delay={2}>
          <div className="w-10 h-10 sm:w-16 sm:h-16 border border-green-400/40 rounded-lg animate-pulse" />
        </FloatingElement>
        <FloatingElement className="bottom-10 right-16 sm:bottom-20 sm:right-32" delay={3}>
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400/60 animate-pulse" />
        </FloatingElement>
        <FloatingElement className="top-1/2 left-16 sm:left-32" delay={4}>
          <Target className="h-4 w-4 sm:h-6 sm:w-6 text-cyan-400/50 animate-spin-slow" />
        </FloatingElement>
        <FloatingElement className="top-1/3 right-1/4" delay={5}>
          <Zap className="h-6 w-6 sm:h-10 sm:w-10 text-purple-400/40 animate-bounce" />
        </FloatingElement>
        <FloatingElement className="top-1/4 left-1/3" delay={6}>
          <BookOpen className="h-5 w-5 sm:h-7 sm:w-7 text-blue-400/50 animate-pulse" />
        </FloatingElement>
        <FloatingElement className="bottom-1/3 right-1/3" delay={7}>
          <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-green-400/50 animate-bounce" />
        </FloatingElement>
        <FloatingElement className="top-3/4 left-1/4" delay={8}>
          <Plane className="h-5 w-5 sm:h-7 sm:w-7 text-orange-400/50 animate-pulse" />
        </FloatingElement>
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 xl:gap-20 items-center">
          {/* Left Content */}
          <div
            className={`space-y-6 sm:space-y-8 lg:space-y-10 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            {/* Hero Title */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-none">
                <span className="block text-foreground mb-2 sm:mb-3 hover:scale-105 transition-transform duration-300 cursor-default">
                  Transform
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x mb-2 sm:mb-3 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-1000 cursor-default">
                  Your Dreams
                </span>
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-gradient-x hover:from-orange-500 hover:via-pink-600 hover:to-purple-600 transition-all duration-1000 cursor-default">
                  Into Reality
                </span>
              </h1>
            </div>

            {/* Description */}
            <div className="max-w-2xl">
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed">
                Embark on your
                <span className="font-bold text-foreground bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  European education journey{" "}
                </span>
                with confidence. From university selection to visa approval,
                <span className="font-bold text-foreground"> we make the impossible possible</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
              <ModernButton
                size="lg"
                className="transform hover:scale-110 hover:-translate-y-2 transition-all duration-500"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300" />
              </ModernButton>

              <ModernButton
                variant="ghost"
                size="lg"
                className="transform hover:scale-110 hover:-translate-y-2 transition-all duration-500"
              >
                Explore Services
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-all duration-300" />
              </ModernButton>

              <ModernButton
                variant="shimmer"
                size="lg"
                className="transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 animate-pulse hover:animate-none"
              >
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-spin group-hover:animate-none" />
                Free Consultation
              </ModernButton>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 pt-4 sm:pt-6">
              {contactInfo.map((item, i) => (
                <div key={i} className="group relative transform-gpu">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${item.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`}
                  />
                  <div className="relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1 shadow-lg hover:shadow-xl">
                    <div
                      className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${item.bg} group-hover:scale-110 transition-transform duration-300 shadow-lg transform-gpu`}
                    >
                      <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.color}`} />
                    </div>
                    <span className="font-semibold text-sm sm:text-base text-foreground group-hover:text-blue-600 transition-colors duration-300">
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pt-6 sm:pt-8">
              {achievements.map((achievement, i) => (
                <StatCard
                  key={i}
                  icon={achievement.icon}
                  value={achievement.value}
                  label={achievement.label}
                  gradient={achievement.gradient}
                  delay={i * 0.2}
                />
              ))}
            </div>
          </div>

          {/* Right Content - Creative Image Integration */}
          <div
            className={`flex flex-col gap-6 sm:gap-10 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            {/* Main Creative Image Section */}
            <div className="relative group transform-gpu">
              {/* Outer Glow */}
              <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 rounded-3xl blur-3xl group-hover:blur-4xl transition-all duration-1000 opacity-80 animate-pulse" />

              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-1000 border-4 border-white/30 backdrop-blur-sm group-hover:scale-105 transform-gpu">
                <div
                  className="w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url('https://nzdmouebmzugmadypibz.supabase.co/storage/v1/object/sign/landing/481202563_656157353656624_7685818458725184910_n.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMGM1M2YzOS1iOGRiLTRiNWUtYTgwNy1lY2I5NTc0Yzk3NDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsYW5kaW5nLzQ4MTIwMjU2M182NTYxNTczNTM2NTY2MjRfNzY4NTgxODQ1ODcyNTE4NDkxMF9uLmpwZyIsImlhdCI6MTc1MzE5NzE2NSwiZXhwIjoxOTEwODc3MTY1fQ.FbNtHCDVwpdXuhLjDAgKlwOM-sVGPcCjRzPLaaYjTUw')`,
                  }}
                >
                  {/* Creative Overlay Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />

                  {/* Animated Floating Elements on Image */}
                  <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl animate-bounce-slow">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs sm:text-sm font-bold text-green-600">Success Story</span>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl animate-spin-slow">
                    <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>

                  <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl animate-pulse">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Award className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-gray-800">Top Rated</div>
                        <div className="text-xs text-gray-600">5-Star Service</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl animate-float">
                    <div className="text-center text-white">
                      <div className="text-lg sm:text-2xl font-bold">98%</div>
                      <div className="text-xs">Success Rate</div>
                    </div>
                  </div>

                  {/* Magical Particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full opacity-60 animate-float-particle"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500" />
              </div>
            </div>

            {/* Instagram Reel Card */}
            <div className="relative group transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-orange-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />

              <div className="relative bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-2xl border-2 border-white/30 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                <div className="flex items-center gap-3 sm:gap-5 mb-4 sm:mb-6">
                  <div className="relative animate-spin-slow">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Instagram className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-pink-400 rounded-2xl animate-ping opacity-30" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg sm:text-2xl text-foreground mb-1">Success Stories Live</h3>
                    <p className="text-muted-foreground font-medium text-sm sm:text-base">
                      @eurovisa00 • Real testimonials
                    </p>
                  </div>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
                </div>

                <p className="text-muted-foreground mb-6 sm:mb-8 leading-relaxed text-sm sm:text-lg">
                  Watch our students share their incredible journeys from dream to diploma. Real stories, real success,
                  real inspiration.
                </p>

                <a
                  href="https://www.instagram.com/eurovisa00/reel/DMYiUZ2I6mu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 sm:gap-4 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 transition-all duration-500 shadow-xl hover:shadow-2xl font-bold text-sm sm:text-lg group transform hover:scale-110 hover:-translate-y-2"
                >
                  <Play className="h-4 w-4 sm:h-6 sm:w-6 group-hover:scale-125 transition-transform duration-300" />
                  Watch Success Stories
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-size: 400% 400%; background-position: 0% 50%; }
          50% { background-size: 400% 400%; background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-particle {
          animation: float-particle 4s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 8s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .transform-gpu {
          transform: translateZ(0);
        }
      `}</style>
    </section>
  )
}

export default ModernHeroSection


