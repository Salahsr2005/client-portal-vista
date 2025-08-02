"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import {
  Pill,
  Heart,
  Sparkles,
  Shield,
  Rocket,
  ArrowRight,
  UserPlus,
  Stethoscope,
  FileText,
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  Search,
  Package,
  HandHeart,
  Activity,
  Cross,
} from "lucide-react"

// Advanced Launch Counter Component
const LaunchCounter = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, type: "spring" }}
      className="relative"
    >
      {/* Premium Gold Card Design */}
      <div className="relative">
        {/* Gold glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-amber-400/40 to-yellow-600/30 rounded-3xl blur-2xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 via-amber-300/30 to-orange-400/20 rounded-3xl blur-xl" />

        {/* Main gold card */}
        <Card className="relative bg-gradient-to-br from-yellow-400/90 via-amber-400/95 to-yellow-600/90 backdrop-blur-xl border-2 border-yellow-300/50 rounded-3xl overflow-hidden shadow-2xl">
          {/* Gold texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 via-transparent to-amber-600/30 rounded-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.3),transparent_50%)] rounded-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,193,7,0.2),transparent_50%)] rounded-3xl" />

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />

          <CardContent className="relative z-10 p-8 lg:p-12">
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="inline-block mb-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/50 to-yellow-600/50 rounded-full blur-lg" />
                  <div className="relative bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full p-3 shadow-xl">
                    <Rocket className="h-12 w-12 text-amber-800" />
                  </div>
                </div>
              </motion.div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-2 text-amber-900 drop-shadow-sm">Launching Soon</h3>
              <p className="text-amber-800 text-lg font-medium">Revolutionary Healthcare Access</p>
            </div>

            <div className="grid grid-cols-4 gap-4 lg:gap-8">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <motion.div
                    key={item.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 to-yellow-500/30 rounded-2xl blur-sm" />
                    <div className="relative bg-gradient-to-br from-yellow-200/80 to-amber-200/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-yellow-300/50 shadow-lg">
                      <div className="text-3xl lg:text-5xl font-bold text-amber-900 drop-shadow-sm">
                        {item.value.toString().padStart(2, "0")}
                      </div>
                    </div>
                  </motion.div>
                  <div className="text-sm lg:text-base text-amber-800 mt-2 font-semibold">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

// Floating Medical Icons
const FloatingMedicalIcons = () => {
  const icons = [
    { Icon: Pill, color: "text-blue-400", delay: 0 },
    { Icon: Stethoscope, color: "text-green-400", delay: 1 },
    { Icon: Cross, color: "text-red-400", delay: 2 },
    { Icon: Activity, color: "text-purple-400", delay: 3 },
    { Icon: Heart, color: "text-pink-400", delay: 4 },
    { Icon: Shield, color: "text-cyan-400", delay: 5 },
    { Icon: Package, color: "text-orange-400", delay: 6 },
    { Icon: FileText, color: "text-indigo-400", delay: 7 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, color, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} opacity-20`}
          style={{
            top: `${10 + index * 12}%`,
            left: `${5 + index * 11}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-15, 15, -15],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + index,
            repeat: Number.POSITIVE_INFINITY,
            delay: delay,
            ease: "easeInOut",
          }}
        >
          <Icon className="h-6 w-6" />
        </motion.div>
      ))}
    </div>
  )
}

export default function GuestDawini() {
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Prescription Verified",
      description: "All medication requests require valid prescriptions and medical verification for safety.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Location-Based Matching",
      description: "Connect with nearby providers to ensure quick and convenient medication access.",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Urgent Care Priority",
      description: "Critical medication needs are prioritized to ensure timely healthcare access.",
      gradient: "from-red-500/20 to-pink-500/20",
      iconColor: "text-red-400",
    },
    {
      icon: <HandHeart className="h-8 w-8" />,
      title: "Community Support",
      description: "Built on the principle of community members helping each other in times of need.",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900 relative overflow-hidden">
      {/* Advanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-600/25 to-pink-600/25 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <FloatingMedicalIcons />

      {/* Hero Section */}
      <motion.div style={{ y }} className="relative z-10 py-16 sm:py-24 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Animated Medical Logo */}
            <div className="flex justify-center mb-12">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1, 1.05, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-green-600/40 to-cyan-600/40 rounded-full blur-2xl animate-pulse" />
                  <div className="relative p-8 bg-gradient-to-br from-blue-500/20 via-green-500/20 to-cyan-500/20 rounded-full backdrop-blur-xl border-2 border-white/20 shadow-2xl">
                    <Pill className="h-20 w-20 md:h-24 md:w-24 text-blue-400" />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                Dawini
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-2xl sm:text-3xl lg:text-4xl mb-6 font-semibold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent"
            >
              Connecting Patients with Medication Providers
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="text-lg sm:text-xl lg:text-2xl mb-12 text-slate-300 max-w-4xl mx-auto leading-relaxed"
            >
              A revolutionary platform where patients in need of medications can connect directly with verified
              providers, ensuring safe and accessible healthcare for everyone.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-10 py-4 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 rounded-2xl border border-blue-500/50"
                  onClick={() => navigate("/register")}
                >
                  <UserPlus className="mr-3 h-5 w-5" />
                  Join Early Access
                  <Sparkles className="ml-3 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-500/50 hover:bg-blue-500/10 text-blue-300 hover:text-blue-200 px-10 py-4 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 rounded-2xl backdrop-blur-sm bg-white/5"
                  onClick={() => navigate("/login")}
                >
                  <Stethoscope className="mr-3 h-5 w-5" />
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Launch Counter Section */}
      <div className="relative z-10 py-16 bg-gradient-to-r from-blue-900/20 via-green-900/20 to-cyan-900/20 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LaunchCounter targetDate="2025-09-01T00:00:00" />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 py-24 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Important Notice at the top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative mb-16"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-yellow-400/30 to-amber-500/20 rounded-3xl blur-xl animate-pulse" />
            <Card className="relative bg-gradient-to-r from-amber-400/10 via-yellow-400/15 to-amber-500/10 backdrop-blur-xl border-2 border-amber-300/30 rounded-3xl overflow-hidden">
              {/* Shining effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />

              <CardContent className="p-8 text-center relative z-10">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="inline-flex items-center gap-3 mb-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-gradient-to-r from-amber-400/20 to-yellow-500/20 border-amber-300/50 text-amber-200 px-6 py-2 text-lg font-bold rounded-full">
                    <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                    IMPORTANT NOTICE
                  </Badge>
                </motion.div>

                <p className="text-lg font-semibold text-amber-100 max-w-4xl mx-auto leading-relaxed">
                  <strong className="text-amber-200">Dawini</strong> is a prescription-verified medication sharing
                  platform launching <strong className="text-yellow-300">September 1st, 2025</strong>. All medication
                  exchanges require <strong className="text-amber-200">valid prescriptions</strong> and{" "}
                  <strong className="text-amber-200">medical verification</strong> for safety and legal compliance.
                </p>

                <div className="flex items-center justify-center gap-6 mt-6">
                  {[
                    { icon: <FileText className="h-5 w-5" />, text: "Prescription Required" },
                    { icon: <Shield className="h-5 w-5" />, text: "Medical Verification" },
                    { icon: <CheckCircle className="h-5 w-5" />, text: "Legal Compliance" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-center gap-2 text-amber-200 text-sm font-medium"
                    >
                      {item.icon}
                      {item.text}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(147, 51, 234, 0.4)",
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="inline-block mb-6"
            >
              <Badge className="px-8 py-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border-2 border-blue-400/30 text-blue-300 rounded-full text-lg font-bold backdrop-blur-xl">
                <Activity className="h-5 w-5 mr-3 animate-pulse" />
                AI-Powered Process
                <Sparkles className="h-5 w-5 ml-3 animate-spin" />
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                How Dawini Works
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
            >
              Experience the future of medication access with our{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold">
                AI-powered, secure, and instant
              </span>{" "}
              matching system
            </motion.p>
          </motion.div>

          {/* Advanced Interactive Process Visualization */}
          <div className="relative max-w-6xl mx-auto">
            {/* Animated Connection Flow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-32" viewBox="0 0 800 120">
                {/* Animated flow line */}
                <motion.path
                  d="M 50 60 Q 200 20 350 60 Q 500 100 650 60 Q 750 40 800 60"
                  stroke="url(#flowGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="10,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />

                {/* Animated particles */}
                {[...Array(5)].map((_, i) => (
                  <motion.circle
                    key={i}
                    r="4"
                    fill="url(#particleGradient)"
                    initial={{ x: 50, y: 60 }}
                    animate={{
                      x: [50, 200, 350, 500, 650, 800],
                      y: [60, 20, 60, 100, 60, 60],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.6,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                <defs>
                  <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="25%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                  </linearGradient>
                  <radialGradient id="particleGradient">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* Interactive Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  id: 1,
                  title: "Patient Request",
                  subtitle: "Need Medication",
                  description: "Patient uploads prescription and medication details",
                  icon: <FileText className="h-10 w-10" />,
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "from-blue-500/20 to-cyan-500/20",
                  position: { x: 0, y: 0 },
                  avatar: "👤",
                },
                {
                  id: 2,
                  title: "AI Verification",
                  subtitle: "Smart Validation",
                  description: "Advanced AI verifies prescription authenticity and safety",
                  icon: <Shield className="h-10 w-10" />,
                  color: "from-emerald-500 to-green-500",
                  bgColor: "from-emerald-500/20 to-green-500/20",
                  position: { x: 1, y: 0 },
                  avatar: "🤖",
                },
                {
                  id: 3,
                  title: "Smart Matching",
                  subtitle: "Find Providers",
                  description: "AI matches with verified providers in your area",
                  icon: <Search className="h-10 w-10" />,
                  color: "from-purple-500 to-pink-500",
                  bgColor: "from-purple-500/20 to-pink-500/20",
                  position: { x: 2, y: 0 },
                  avatar: "🎯",
                },
                {
                  id: 4,
                  title: "Secure Connection",
                  subtitle: "Direct Contact",
                  description: "Provider contacts patient for safe medication transfer",
                  icon: <Phone className="h-10 w-10" />,
                  color: "from-orange-500 to-amber-500",
                  bgColor: "from-orange-500/20 to-amber-500/20",
                  position: { x: 3, y: 0 },
                  avatar: "🏥",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8, type: "spring" }}
                  className="relative group cursor-pointer"
                >
                  {/* Floating Avatar */}
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20"
                  >
                    <div className="text-4xl bg-white/10 backdrop-blur-xl rounded-full p-2 border border-white/20 shadow-2xl">
                      {step.avatar}
                    </div>
                  </motion.div>

                  {/* Main Card */}
                  <Card
                    className={`relative overflow-hidden transition-all duration-700 ${
                      index === 0
                        ? `bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-white/40 shadow-2xl scale-105 shadow-blue-500/30`
                        : index === 1
                          ? `bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-2 border-white/40 shadow-2xl scale-105 shadow-green-500/30`
                          : index === 2
                            ? `bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-white/40 shadow-2xl scale-105 shadow-pink-500/30`
                            : `bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-2 border-white/40 shadow-2xl scale-105 shadow-amber-500/30`
                    } backdrop-blur-xl rounded-3xl h-80`}
                  >
                    {/* Animated Background */}
                    <AnimatePresence>
                      {index === 0 && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 0.3, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl`}
                          />

                          {/* Floating Pills Animation */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0, x: 100, y: 100 }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                x: Math.random() * 200,
                                y: Math.random() * 200,
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.5,
                              }}
                              className="absolute"
                            >
                              <Pill className="h-4 w-4 text-white/30" />
                            </motion.div>
                          ))}
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 0.3, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className={`absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-500 rounded-3xl`}
                          />

                          {/* Floating Pills Animation */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0, x: 100, y: 100 }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                x: Math.random() * 200,
                                y: Math.random() * 200,
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.5,
                              }}
                              className="absolute"
                            >
                              <Pill className="h-4 w-4 text-white/30" />
                            </motion.div>
                          ))}
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 0.3, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className={`absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl`}
                          />

                          {/* Floating Pills Animation */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0, x: 100, y: 100 }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                x: Math.random() * 200,
                                y: Math.random() * 200,
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.5,
                              }}
                              className="absolute"
                            >
                              <Pill className="h-4 w-4 text-white/30" />
                            </motion.div>
                          ))}
                        </>
                      )}
                      {index === 3 && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 0.3, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className={`absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl`}
                          />

                          {/* Floating Pills Animation */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0, x: 100, y: 100 }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                x: Math.random() * 200,
                                y: Math.random() * 200,
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.5,
                              }}
                              className="absolute"
                            >
                              <Pill className="h-4 w-4 text-white/30" />
                            </motion.div>
                          ))}
                        </>
                      )}
                    </AnimatePresence>

                    <CardContent className="p-8 text-center relative z-10 h-full flex flex-col justify-center">
                      {/* Step Number with Pulse */}
                      <motion.div
                        animate={
                          index === 0
                            ? {
                                scale: [1, 1.2, 1],
                                boxShadow: [
                                  "0 0 0 0 rgba(59, 130, 246, 0.7)",
                                  "0 0 0 20px rgba(59, 130, 246, 0)",
                                  "0 0 0 0 rgba(59, 130, 246, 0)",
                                ],
                              }
                            : index === 1
                              ? {
                                  scale: [1, 1.2, 1],
                                  boxShadow: [
                                    "0 0 0 0 rgba(52, 211, 153, 0.7)",
                                    "0 0 0 20px rgba(52, 211, 153, 0)",
                                    "0 0 0 0 rgba(52, 211, 153, 0)",
                                  ],
                                }
                              : index === 2
                                ? {
                                    scale: [1, 1.2, 1],
                                    boxShadow: [
                                      "0 0 0 0 rgba(139, 92, 246, 0.7)",
                                      "0 0 0 20px rgba(139, 92, 246, 0)",
                                      "0 0 0 0 rgba(139, 92, 246, 0)",
                                    ],
                                  }
                                : {
                                    scale: [1, 1.2, 1],
                                    boxShadow: [
                                      "0 0 0 0 rgba(251, 146, 60, 0.7)",
                                      "0 0 0 20px rgba(251, 146, 60, 0)",
                                      "0 0 0 0 rgba(251, 146, 60, 0)",
                                    ],
                                  }
                        }
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                      >
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-r ${index === 0 ? "from-blue-500 to-cyan-500" : index === 1 ? "from-emerald-500 to-green-500" : index === 2 ? "from-purple-500 to-pink-500" : "from-orange-500 to-amber-500"} flex items-center justify-center text-white font-bold text-lg shadow-2xl border-2 border-white/30`}
                        >
                          {index + 1}
                        </div>
                      </motion.div>

                      {/* Icon with Advanced Animation */}
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        animate={
                          index === 0
                            ? {
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                              }
                            : index === 1
                              ? {
                                  rotate: [0, 10, -10, 0],
                                  scale: [1, 1.1, 1],
                                }
                              : index === 2
                                ? {
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1],
                                  }
                                : {
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1],
                                  }
                        }
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="mb-6 mt-6"
                      >
                        <div
                          className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${index === 0 ? "from-blue-500 to-cyan-500" : index === 1 ? "from-emerald-500 to-green-500" : index === 2 ? "from-purple-500 to-pink-500" : "from-orange-500 to-amber-500"} flex items-center justify-center text-white shadow-2xl mx-auto border-2 border-white/20 backdrop-blur-sm`}
                        >
                          {index === 0 ? (
                            <FileText className="h-10 w-10" />
                          ) : index === 1 ? (
                            <Shield className="h-10 w-10" />
                          ) : index === 2 ? (
                            <Search className="h-10 w-10" />
                          ) : (
                            <Phone className="h-10 w-10" />
                          )}
                        </div>
                      </motion.div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white">
                          {index === 0
                            ? "Patient Request"
                            : index === 1
                              ? "AI Verification"
                              : index === 2
                                ? "Smart Matching"
                                : "Secure Connection"}
                        </h3>
                        <p className="text-lg font-semibold text-blue-200">
                          {index === 0
                            ? "Need Medication"
                            : index === 1
                              ? "Smart Validation"
                              : index === 2
                                ? "Find Providers"
                                : "Direct Contact"}
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {index === 0
                            ? "Patient uploads prescription and medication details"
                            : index === 1
                              ? "Advanced AI verifies prescription authenticity and safety"
                              : index === 2
                                ? "AI matches with verified providers in your area"
                                : "Provider contacts patient for safe medication transfer"}
                        </p>
                      </div>

                      {/* Progress Indicator */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4 }}
                        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${index === 0 ? "from-blue-500 to-cyan-500" : index === 1 ? "from-emerald-500 to-green-500" : index === 2 ? "from-purple-500 to-pink-500" : "from-orange-500 to-amber-500"} rounded-full`}
                      />
                    </CardContent>
                  </Card>

                  {/* Connecting Arrow */}
                  {index < 3 && (
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-30"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Central Process Hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Pill className="h-12 w-12 text-blue-400" />
                  </motion.div>
                </motion.div>

                {/* Orbiting Elements */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 10 + i * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: i * 0.5,
                    }}
                    className="absolute inset-0"
                  >
                    <div className="relative w-full h-full">
                      <div
                        className={`absolute w-3 h-3 bg-gradient-to-r ${i === 0 ? "from-blue-500 to-cyan-500" : i === 1 ? "from-emerald-500 to-green-500" : i === 2 ? "from-purple-500 to-pink-500" : "from-orange-500 to-amber-500"} rounded-full top-0 left-1/2 transform -translate-x-1/2 shadow-lg`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-24 bg-gradient-to-br from-slate-900/50 to-blue-900/20 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
              Why Choose Dawini?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Built with safety, accessibility, and community support at its core
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card
                  className={`h-full bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border-2 border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-white/20`}
                >
                  <CardContent className="p-8 text-center">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex justify-center mb-6"
                    >
                      <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center ${feature.iconColor} shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                      >
                        {feature.icon}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white group-hover:text-blue-100 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-sm lg:text-base">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative z-10 py-24 lg:py-32 bg-gradient-to-r from-blue-600 via-green-600 to-cyan-600">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
                <Cross className="relative h-20 w-20 text-white/90" />
              </div>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Ready to Transform Healthcare Access?
            </h2>
            <p className="text-xl lg:text-2xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
              Join the revolution in medication accessibility. Help build a community where no one goes without
              essential healthcare.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 font-semibold px-12 py-4 text-lg backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300"
                  onClick={() => navigate("/register")}
                >
                  <UserPlus className="mr-3 h-6 w-6" />
                  Join Early Access
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                {
                  title: "100% Secure",
                  subtitle: "Prescription verified platform",
                  icon: <Shield className="h-8 w-8" />,
                },
                {
                  title: "Community Driven",
                  subtitle: "People helping people",
                  icon: <HandHeart className="h-8 w-8" />,
                },
                {
                  title: "Always Available",
                  subtitle: "24/7 medication access",
                  icon: <Clock className="h-8 w-8" />,
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-white/80 mb-3 flex justify-center">{benefit.icon}</div>
                  <div className="text-2xl font-bold mb-2">{benefit.title}</div>
                  <div className="text-white/80">{benefit.subtitle}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-8 bg-slate-950/80 backdrop-blur-sm border-t border-white/10">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm max-w-4xl mx-auto">
            <strong className="text-blue-400">Important:</strong> Dawini is a prescription-verified medication sharing
            platform launching September 1st, 2025. All medication exchanges require valid prescriptions and medical
            verification for safety and legal compliance.
          </p>
        </div>
      </div>
    </div>
  )
}
