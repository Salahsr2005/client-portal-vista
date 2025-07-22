"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { motion } from "framer-motion"

const ModernButton = ({ children, className, variant = "default", size = "default", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-500 gap-2 group relative overflow-hidden"
  const variants = {
    default:
      "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl",
    ghost: "border-2 border-white/30 text-foreground hover:bg-white/20 backdrop-blur-xl shadow-lg hover:shadow-xl",
    shimmer: "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-2xl",
  }
  const sizes = {
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  )
}

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
      className={`absolute w-${size} h-${size} rounded-full bg-gradient-radial ${colors[color]} blur-3xl opacity-60 transition-all duration-${duration * 1000} ease-in-out`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        animationDelay: `${delay}s`,
      }}
    />
  )
}

const FloatingElement = ({ children, className, delay = 0 }) => (
  <div
    className={`absolute animate-float opacity-40 ${className}`}
    style={{ animationDelay: `${delay}s`, animationDuration: "6s" }}
  >
    {children}
  </div>
)

const StatCard = ({ icon: Icon, value, label, gradient, delay = 0 }) => (
  <motion.div
    className="relative group"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.05, y: -8 }}
  >
    <div
      className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500`}
    />
    <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/30 rounded-2xl p-6 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all duration-500 shadow-lg hover:shadow-2xl">
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <div
            className={`text-2xl font-bold bg-gradient-to-r ${gradient.replace("to-purple-600", "to-purple-700")} bg-clip-text text-transparent`}
          >
            {value}
          </div>
          <div className="text-sm text-muted-foreground font-medium">{label}</div>
        </div>
      </div>
    </div>
  </motion.div>
)

export default function CreativeHeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

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

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)] opacity-30 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Animated Spotlights */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedSpotlight delay={0} duration={10} size="96" color="blue" />
        <AnimatedSpotlight delay={2} duration={8} size="80" color="purple" />
        <AnimatedSpotlight delay={4} duration={12} size="72" color="green" />
        <AnimatedSpotlight delay={1} duration={9} size="88" color="orange" />
        <AnimatedSpotlight delay={6} duration={7} size="64" color="blue" />
        <AnimatedSpotlight delay={8} duration={11} size="56" color="purple" />
      </div>

      {/* Mouse-following gradient */}
      <div
        className="absolute inset-0 opacity-20 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 25%, transparent 50%)`,
        }}
      />

      {/* Floating geometric elements */}
      <div className="absolute inset-0">
        <FloatingElement className="top-20 left-10" delay={0}>
          <div className="w-12 h-12 border-2 border-blue-400/40 rounded-full animate-spin-slow" />
        </FloatingElement>
        <FloatingElement className="top-32 right-20" delay={1}>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-lg rotate-45" />
        </FloatingElement>
        <FloatingElement className="bottom-32 left-20" delay={2}>
          <div className="w-16 h-16 border border-green-400/40 rounded-lg animate-pulse" />
        </FloatingElement>
        <FloatingElement className="bottom-20 right-32" delay={3}>
          <Sparkles className="h-8 w-8 text-yellow-400/60 animate-pulse" />
        </FloatingElement>
        <FloatingElement className="top-1/2 left-32" delay={4}>
          <Target className="h-6 w-6 text-cyan-400/50 animate-spin-slow" />
        </FloatingElement>
        <FloatingElement className="top-1/3 right-1/4" delay={5}>
          <Zap className="h-10 w-10 text-purple-400/40 animate-bounce" />
        </FloatingElement>
      </div>

      <div className="relative z-10 container max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8 lg:space-y-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Hero Title */}
            <div className="space-y-6">
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="block text-foreground mb-3 hover:scale-105 transition-transform duration-300 cursor-default">
                  Transform
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x mb-3 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-1000 cursor-default">
                  Your Dreams
                </span>
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-gradient-x hover:from-orange-500 hover:via-pink-600 hover:to-purple-600 transition-all duration-1000 cursor-default">
                  Into Reality
                </span>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed">
                Embark on your
                <span className="font-bold text-foreground bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  European education journey{" "}
                </span>
                with confidence. From university selection to visa approval,
                <span className="font-bold text-foreground"> we make the impossible possible</span>.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 lg:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <ModernButton
                size="lg"
                className="transform hover:scale-110 hover:-translate-y-2 transition-all duration-500"
              >
                Start Your Journey
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300" />
              </ModernButton>

              <ModernButton
                variant="ghost"
                size="lg"
                className="transform hover:scale-110 hover:-translate-y-2 transition-all duration-500"
              >
                Explore Services
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-all duration-300" />
              </ModernButton>

              <ModernButton
                variant="shimmer"
                size="lg"
                className="transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 animate-pulse hover:animate-none"
              >
                <Sparkles className="h-5 w-5 animate-spin group-hover:animate-none" />
                Free Consultation
              </ModernButton>
            </motion.div>

            {/* Contact Info Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {contactInfo.map((item, i) => (
                <motion.div
                  key={i}
                  className="group relative"
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${item.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`}
                  />
                  <div className="relative flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-500 shadow-lg hover:shadow-xl">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${item.bg} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <span className="font-semibold text-foreground group-hover:text-blue-600 transition-colors duration-300">
                      {item.text}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-8">
              {achievements.map((achievement, i) => (
                <StatCard
                  key={i}
                  icon={achievement.icon}
                  value={achievement.value}
                  label={achievement.label}
                  gradient={achievement.gradient}
                  delay={i * 0.2 + 1.0}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Content - Creative Image Integration */}
          <motion.div
            className="flex flex-col gap-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Main Creative Image Section */}
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 rounded-3xl blur-3xl group-hover:blur-4xl transition-all duration-1000 opacity-80 animate-pulse" />

              {/* Main Image Container */}
              <motion.div
                className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-1000 border-4 border-white/30 backdrop-blur-sm"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="w-full h-[500px] lg:h-[600px] bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url('https://nzdmouebmzugmadypibz.supabase.co/storage/v1/object/sign/landing/481202563_656157353656624_7685818458725184910_n.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMGM1M2YzOS1iOGRiLTRiNWUtYTgwNy1lY2I5NTc0Yzk3NDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsYW5kaW5nLzQ4MTIwMjU2M182NTYxNTczNTM2NTY2MjRfNzY4NTgxODQ1ODcyNTE4NDkxMF9uLmpwZyIsImlhdCI6MTc1MzE5NzE2NSwiZXhwIjoxOTEwODc3MTY1fQ.FbNtHCDVwpdXuhLjDAgKlwOM-sVGPcCjRzPLaaYjTUw')`,
                  }}
                >
                  {/* Creative Overlay Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />

                  {/* Animated Floating Elements on Image */}
                  <motion.div
                    className="absolute top-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-green-600">Success Story</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute top-8 left-8 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="h-6 w-6 text-white" />
                  </motion.div>

                  <motion.div
                    className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-3">
                      <Award className="h-6 w-6 text-yellow-500" />
                      <div>
                        <div className="text-sm font-bold text-gray-800">Top Rated</div>
                        <div className="text-xs text-gray-600">5-Star Service</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-8 right-8 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
                  >
                    <div className="text-center text-white">
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-xs">Success Rate</div>
                    </div>
                  </motion.div>

                  {/* Magical Particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                        animate={{
                          x: [Math.random() * 400, Math.random() * 400],
                          y: [Math.random() * 500, Math.random() * 500],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500" />
              </motion.div>
            </div>

            {/* Instagram Reel Card */}
            <motion.div className="relative group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-orange-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />

              <div className="relative bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-2xl border-2 border-white/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-5 mb-6">
                  <motion.div
                    className="relative"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Instagram className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-pink-400 rounded-2xl animate-ping opacity-30" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl text-foreground mb-1">Success Stories Live</h3>
                    <p className="text-muted-foreground font-medium">@eurovisa00 • Real testimonials</p>
                  </div>
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
                </div>

                <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                  Watch our students share their incredible journeys from dream to diploma. Real stories, real success,
                  real inspiration.
                </p>

                <motion.a
                  href="https://www.instagram.com/eurovisa00/reel/DMYiUZ2I6mu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 transition-all duration-500 shadow-xl hover:shadow-2xl font-bold text-lg group"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="h-6 w-6 group-hover:scale-125 transition-transform duration-300" />
                  Watch Success Stories
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
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
      `}</style>
    </section>
  )
}

