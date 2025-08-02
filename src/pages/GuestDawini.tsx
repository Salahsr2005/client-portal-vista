"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "@/i18n"
import {
  Heart,
  Users,
  HandHeart,
  MessageCircle,
  Sparkles,
  Shield,
  Star,
  Rocket,
  ArrowRight,
  UserPlus,
  Crown,
  Gem,
  Compass,
  Lightbulb,
  Coffee,
  BookOpen,
  Camera,
  Music,
  Palette,
  Code,
  Briefcase,
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
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 rounded-3xl blur-xl animate-pulse" />
      <Card className="relative bg-white/10 dark:bg-slate-900/10 backdrop-blur-xl border-2 border-white/20 dark:border-slate-700/20 rounded-3xl overflow-hidden">
        <CardContent className="p-8 lg:p-12">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Rocket className="h-12 w-12 text-purple-400" />
            </motion.div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Launching Soon
            </h3>
            <p className="text-slate-300 text-lg">Get ready for something amazing</p>
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
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-sm" />
                  <div className="relative bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 dark:border-slate-700/20">
                    <div className="text-3xl lg:text-5xl font-bold bg-gradient-to-br from-white to-purple-200 bg-clip-text text-transparent">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                  </div>
                </motion.div>
                <div className="text-sm lg:text-base text-slate-400 mt-2 font-medium">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Advanced Floating Icons Component
const FloatingIcons = () => {
  const icons = [
    { Icon: Heart, color: "text-pink-400", delay: 0 },
    { Icon: Users, color: "text-blue-400", delay: 1 },
    { Icon: HandHeart, color: "text-green-400", delay: 2 },
    { Icon: Sparkles, color: "text-purple-400", delay: 3 },
    { Icon: Star, color: "text-yellow-400", delay: 4 },
    { Icon: Crown, color: "text-orange-400", delay: 5 },
    { Icon: Gem, color: "text-cyan-400", delay: 6 },
    { Icon: Compass, color: "text-indigo-400", delay: 7 },
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
  const { t } = useTranslation()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  const communityFeatures = [
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Ask for Help",
      description: "Need assistance with something? Post your request and let the community support you.",
      gradient: "from-blue-500/20 via-cyan-500/20 to-blue-600/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/30",
    },
    {
      icon: <HandHeart className="h-8 w-8" />,
      title: "Offer Support",
      description: "Share your skills and knowledge to help fellow community members achieve their goals.",
      gradient: "from-green-500/20 via-emerald-500/20 to-green-600/20",
      iconColor: "text-green-400",
      borderColor: "border-green-500/30",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Build Connections",
      description: "Form meaningful relationships with like-minded individuals who share your interests.",
      gradient: "from-purple-500/20 via-pink-500/20 to-purple-600/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/30",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Grow Together",
      description: "Learn from each other's experiences and grow as a supportive community.",
      gradient: "from-orange-500/20 via-amber-500/20 to-orange-600/20",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/30",
    },
  ]

  const helpCategories = [
    { icon: <BookOpen className="h-6 w-6" />, label: "Academic Support", color: "text-blue-400" },
    { icon: <Briefcase className="h-6 w-6" />, label: "Career Guidance", color: "text-green-400" },
    { icon: <Code className="h-6 w-6" />, label: "Tech Help", color: "text-purple-400" },
    { icon: <Palette className="h-6 w-6" />, label: "Creative Projects", color: "text-pink-400" },
    { icon: <Music className="h-6 w-6" />, label: "Arts & Music", color: "text-yellow-400" },
    { icon: <Camera className="h-6 w-6" />, label: "Photography", color: "text-cyan-400" },
    { icon: <Coffee className="h-6 w-6" />, label: "Life Advice", color: "text-orange-400" },
    { icon: <Lightbulb className="h-6 w-6" />, label: "Innovation", color: "text-indigo-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 relative overflow-hidden">
      {/* Advanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-orange-600/25 to-amber-600/25 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <FloatingIcons />

      {/* Hero Section */}
      <motion.div style={{ y }} className="relative z-10 py-16 sm:py-24 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Animated Logo */}
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-pink-600/40 to-orange-600/40 rounded-full blur-2xl animate-pulse" />
                  <div className="relative p-8 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-full backdrop-blur-xl border-2 border-white/20 shadow-2xl">
                    <Heart className="h-20 w-20 md:h-24 md:w-24 text-pink-400" />
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
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
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
              Community-Powered Mutual Support
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="text-lg sm:text-xl lg:text-2xl mb-12 text-slate-300 max-w-4xl mx-auto leading-relaxed"
            >
              Where community members help each other grow, learn, and succeed together. No middlemen, no fees - just
              genuine peer-to-peer support and collaboration.
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
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-10 py-4 text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 rounded-2xl border border-purple-500/50"
                  onClick={() => navigate("/register")}
                >
                  <UserPlus className="mr-3 h-5 w-5" />
                  Join the Community
                  <Sparkles className="ml-3 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-500/50 hover:bg-purple-500/10 text-purple-300 hover:text-purple-200 px-10 py-4 text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 rounded-2xl backdrop-blur-sm bg-white/5"
                  onClick={() => navigate("/login")}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Launch Counter Section */}
      <div className="relative z-10 py-16 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-orange-900/20 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LaunchCounter targetDate="2025-09-01T00:00:00" />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 py-24 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300 rounded-full text-sm font-medium">
              <Crown className="h-4 w-4 mr-2" />
              Peer-to-Peer Community
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              How Our Community Works
            </h2>
            <p className="text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              A revolutionary approach to mutual support where every member both gives and receives help
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityFeatures.map((feature, index) => (
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
                  className={`h-full bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border-2 ${feature.borderColor} rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20`}
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
                    <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white group-hover:text-purple-100 transition-colors">
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

      {/* Help Categories Section */}
      <div className="relative z-10 py-24 bg-gradient-to-br from-slate-900/50 to-purple-900/20 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              What Can You Share & Learn?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our community covers every aspect of personal and professional growth
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {helpCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`${category.color} mb-3 flex justify-center`}
                  >
                    {category.icon}
                  </motion.div>
                  <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {category.label}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative z-10 py-24 lg:py-32 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
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
                <Rocket className="relative h-20 w-20 text-white/90" />
              </div>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Ready to Join the Revolution?
            </h2>
            <p className="text-xl lg:text-2xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
              Be part of a community where everyone contributes, everyone benefits, and everyone grows together
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
                { title: "100% Free", subtitle: "No hidden fees or charges", icon: <Heart className="h-8 w-8" /> },
                {
                  title: "Peer-to-Peer",
                  subtitle: "Direct community connections",
                  icon: <Users className="h-8 w-8" />,
                },
                {
                  title: "Verified Members",
                  subtitle: "Safe and trusted environment",
                  icon: <Shield className="h-8 w-8" />,
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
            <strong className="text-purple-400">Important:</strong> Dawini is a peer-to-peer community platform
            launching September 1st, 2025. Join our early access to be among the first to experience true
            community-powered mutual support.
          </p>
        </div>
      </div>
    </div>
  )
}
