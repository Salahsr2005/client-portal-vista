"use client"
import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import {
  Pill,
  Heart,
  Sparkles,
  Shield,
  Rocket,
  FileText,
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  Search,
  HandHeart,
  Activity,
  Cross,
} from "lucide-react"
import { useTranslation } from "@/i18n"

// Advanced Launch Counter Component
const LaunchCounter = ({ targetDate }: { targetDate: string }) => {
  const { t } = useTranslation()
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
      } else {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
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
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-amber-400/40 to-yellow-600/30 rounded-3xl blur-2xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 via-amber-300/30 to-orange-400/20 rounded-3xl blur-xl" />
        <Card className="relative bg-gradient-to-br from-yellow-400/90 via-amber-400/95 to-yellow-600/90 backdrop-blur-xl border-2 border-yellow-300/50 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 via-transparent to-amber-600/30 rounded-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.3),transparent_50%)] rounded-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,193,7,0.2),transparent_50%)] rounded-3xl" />
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
              <h3 className="text-2xl lg:text-3xl font-bold mb-2 text-amber-900 drop-shadow-sm">
                {t("translation.dawini.launchCounter.title")}
              </h3>
              <p className="text-amber-800 text-lg font-medium">{t("translation.dawini.launchCounter.subtitle")}</p>
            </div>
            <div className="grid grid-cols-4 gap-4 lg:gap-8">
              {[
                { label: t("translation.dawini.launchCounter.days"), value: timeLeft.days },
                { label: t("translation.dawini.launchCounter.hours"), value: timeLeft.hours },
                { label: t("translation.dawini.launchCounter.minutes"), value: timeLeft.minutes },
                { label: t("translation.dawini.launchCounter.seconds"), value: timeLeft.seconds },
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
    { Icon: Shield, color: "text-green-400", delay: 1 },
    { Icon: Cross, color: "text-red-400", delay: 2 },
    { Icon: Activity, color: "text-purple-400", delay: 3 },
    { Icon: Heart, color: "text-pink-400", delay: 4 },
    { Icon: MapPin, color: "text-cyan-400", delay: 5 },
    { Icon: Search, color: "text-orange-400", delay: 6 },
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
  const { t } = useTranslation()

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: t("translation.dawini.features.prescriptionVerified.title"),
      description: t("translation.dawini.features.prescriptionVerified.description"),
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: t("translation.dawini.features.locationBasedMatching.title"),
      description: t("translation.dawini.features.locationBasedMatching.description"),
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: t("translation.dawini.features.urgentCarePriority.title"),
      description: t("translation.dawini.features.urgentCarePriority.description"),
      gradient: "from-red-500/20 to-pink-500/20",
      iconColor: "text-red-400",
    },
    {
      icon: <HandHeart className="h-8 w-8" />,
      title: t("translation.dawini.features.communitySupport.title"),
      description: t("translation.dawini.features.communitySupport.description"),
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
    },
  ]

  const howItWorksSteps = [
    {
      id: 1,
      title: t("translation.dawini.howItWorks.step1.title"),
      description: t("translation.dawini.howItWorks.step1.description"),
      icon: <FileText className="h-10 w-10" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: 2,
      title: t("translation.dawini.howItWorks.step2.title"),
      description: t("translation.dawini.howItWorks.step2.description"),
      icon: <Shield className="h-10 w-10" />,
      color: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-500/20 to-green-500/20",
    },
    {
      id: 3,
      title: t("translation.dawini.howItWorks.step3.title"),
      description: t("translation.dawini.howItWorks.step3.description"),
      icon: <Search className="h-10 w-10" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: 4,
      title: t("translation.dawini.howItWorks.step4.title"),
      description: t("translation.dawini.howItWorks.step4.description"),
      icon: <Phone className="h-10 w-10" />,
      color: "from-orange-500 to-amber-500",
      bgColor: "from-orange-500/20 to-amber-500/20",
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
      {/* Hero Section - Overview */}
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
                {t("translation.dawini.hero.title")}
              </span>
            </motion.h1>
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-2xl sm:text-3xl lg:text-4xl mb-6 font-semibold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent"
            >
              {t("translation.dawini.hero.subtitle")}
            </motion.p>
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="text-lg sm:text-xl lg:text-2xl mb-12 text-slate-300 max-w-4xl mx-auto leading-relaxed"
            >
              {t("translation.dawini.hero.description")}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
      {/* Launch Counter Section */}
      <div className="relative z-10 py-16 bg-gradient-to-r from-blue-900/20 via-green-900/20 to-cyan-900/20 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LaunchCounter targetDate="2025-09-01T00:00:00" />
        </div>
      </div>
      {/* How It Works Section - Advanced Visualization */}
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
                  <Badge className="bg-gradient-to-r from-amber-400/20 to-yellow-500/20 border-amber-300/50 text-amber-200 px-6 py-2 text-lg font-bold rounded-full backdrop-blur-xl">
                    <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                    {t("translation.dawini.notice.badge")}
                  </Badge>
                </motion.div>
                <p className="text-lg font-semibold text-amber-100 max-w-4xl mx-auto leading-relaxed">
                  <strong className="text-amber-200">Dawini</strong> {t("translation.dawini.notice.textPart1")}{" "}
                  <strong className="text-yellow-300">{t("translation.dawini.notice.launchDate")}</strong>.{" "}
                  {t("translation.dawini.notice.textPart2")}{" "}
                  <strong className="text-amber-200">{t("translation.dawini.notice.prescriptionRequired")}</strong>{" "}
                  {t("translation.dawini.notice.textPart3")}{" "}
                  <strong className="text-amber-200">{t("translation.dawini.notice.medicalVerification")}</strong>{" "}
                  {t("translation.dawini.notice.textPart4")}
                </p>
                <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
                  {[
                    {
                      icon: <FileText className="h-5 w-5" />,
                      text: t("translation.dawini.notice.prescriptionRequiredShort"),
                    },
                    {
                      icon: <Shield className="h-5 w-5" />,
                      text: t("translation.dawini.notice.medicalVerificationShort"),
                    },
                    { icon: <CheckCircle className="h-5 w-5" />, text: t("translation.dawini.notice.legalCompliance") },
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
                {t("translation.dawini.howItWorks.badge")}
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
                {t("translation.dawini.howItWorks.title")}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
            >
              {t("translation.dawini.howItWorks.descriptionPart1")}{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold">
                {t("translation.dawini.howItWorks.descriptionHighlight")}
              </span>{" "}
              {t("translation.dawini.howItWorks.descriptionPart2")}
            </motion.p>
          </motion.div>
          {/* Advanced Interactive Process Visualization */}
          <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-center">
            {/* Central AI Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
              className="relative w-full h-96 flex items-center justify-center lg:col-span-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse-slow" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="relative w-64 h-64 rounded-full bg-gradient-to-br from-blue-600/50 via-purple-600/50 to-pink-600/50 flex items-center justify-center shadow-2xl border border-white/20"
              >
                <Sparkles className="h-24 w-24 text-white/80 animate-pulse-fast" />
                {/* Orbiting particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-white rounded-full"
                    animate={{
                      pathOffset: [0, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 15 + i * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: i * 0.5,
                    }}
                    style={{
                      x: `calc(100px * cos(${i * 45}deg))`,
                      y: `calc(100px * sin(${i * 45}deg))`,
                    }}
                  />
                ))}
              </motion.div>
              <div className="absolute text-center text-white font-bold text-xl mt-4">AI Core</div>
            </motion.div>

            {/* Step Cards - arranged in a grid for responsiveness */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:col-span-1">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.2, duration: 0.8, type: "spring" }}
                  className="relative group"
                >
                  <Card
                    className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-white/20
                      bg-gradient-to-br ${step.bgColor} backdrop-blur-xl border-2 border-white/10 rounded-3xl h-full flex flex-col`}
                  >
                    <CardContent className="p-8 text-center relative z-10 flex flex-col items-center justify-center flex-grow">
                      {/* Step Number */}
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-xl border-2 border-white/30 mb-6`}
                      >
                        {step.id}
                      </div>
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="mb-6"
                      >
                        <div
                          className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-2xl mx-auto border-2 border-white/20 backdrop-blur-sm`}
                        >
                          {step.icon}
                        </div>
                      </motion.div>
                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
              {t("translation.dawini.whyChoose.title")}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">{t("translation.dawini.whyChoose.description")}</p>
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
      {/* Footer - Note only, no CTA */}
      <div className="relative z-10 py-8 bg-slate-950/80 backdrop-blur-sm border-t border-white/10">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm max-w-4xl mx-auto">
            <strong className="text-blue-400">Important:</strong> {t("translation.dawini.footer.textPart1")}{" "}
            <strong className="text-blue-400">{t("translation.dawini.footer.launchDate")}</strong>.{" "}
            {t("translation.dawini.footer.textPart2")}
          </p>
        </div>
      </div>
    </div>
  )
}

