"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Lock, CreditCard, User, ArrowRight, Sparkles, Pill } from "lucide-react" // Changed Star to Pill icon
import { useGuestMode } from "@/contexts/GuestModeContext"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSelector } from "@/components/LanguageSelector"
import { useTranslation } from "react-i18next" // Import useTranslation

export default function Guest() {
  const navigate = useNavigate()
  const { enableGuestMode } = useGuestMode()
  const { t } = useTranslation() // Initialize useTranslation

  useEffect(() => {
    enableGuestMode()
  }, [enableGuestMode])

  const guestFeatures = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: t("guest.features.browseDestinations.title"), // Translated
      description: t("guest.features.browseDestinations.description"), // Translated
      path: "/guest/destinations",
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-500/10 group-hover:bg-blue-500",
      color: "text-blue-600",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: t("guest.features.viewPrograms.title"), // Translated
      description: t("guest.features.viewPrograms.description"), // Translated
      path: "/guest/programs",
      gradient: "from-purple-500/10 to-pink-500/10",
      iconBg: "bg-purple-500/10 group-hover:bg-purple-500",
      color: "text-purple-600",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: t("guest.features.checkServices.title"), // Translated
      description: t("guest.features.checkServices.description"), // Translated
      path: "/guest/services",
      gradient: "from-green-500/10 to-emerald-500/10",
      iconBg: "bg-green-500/10 group-hover:bg-green-500",
      color: "text-green-600",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: t("guest.features.tryConsultation.title"), // Translated
      description: t("guest.features.tryConsultation.description"), // Translated
      path: "/guest/consultation",
      gradient: "from-orange-500/10 to-red-500/10",
      iconBg: "bg-orange-500/10 group-hover:bg-orange-500",
      color: "text-orange-600",
    },
    {
      icon: <Pill className="h-6 w-6" />, // Pill icon for Dawini
      title: t("guest.features.dawiniService.title"), // Translated
      description: t("guest.features.dawiniService.description"), // Translated
      path: "/guest/dawini-service", // New path for Dawini service
      // Enhanced golden styling
      gradient:
        "from-amber-200/20 via-yellow-300/20 to-amber-400/20 group-hover:from-amber-400 group-hover:via-yellow-500 group-hover:to-amber-600",
      iconBg: "bg-amber-400/20 group-hover:bg-amber-500",
      color: "text-amber-700",
    },
  ]

  const restrictions = [
    {
      icon: <Lock className="h-5 w-5" />,
      text: t("guest.restrictions.applyPrograms"), // Translated
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      text: t("guest.restrictions.noPaymentFeatures"), // Translated
    },
    {
      icon: <User className="h-5 w-5" />,
      text: t("guest.restrictions.limitedProfileAccess"), // Translated
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000" />

      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <div className="relative z-10 py-8 sm:py-12 lg:py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <Badge
                variant="outline"
                className="border-2 border-blue-200/50 bg-blue-50/50 text-blue-700 px-4 py-2 rounded-full backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-950/50 dark:text-blue-300"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t("guest.badge")} {/* Translated */}
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t("guest.title")} {/* Translated */}
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t("guest.description")} {/* Translated */}
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 lg:mb-16"
          >
            {guestFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                initial="rest"
              >
                <motion.div variants={cardHoverVariants}>
                  <Card
                    className={`relative overflow-hidden p-6 lg:p-8 cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/90 group-hover:border-white/20 ${feature.title === t("guest.features.dawiniService.title") ? "border-2 border-amber-300/50 dark:border-amber-700/50" : ""}`}
                    onClick={() => navigate(feature.path)}
                  >
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                        <motion.div
                          className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center ${feature.color} group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                          whileHover={{ rotate: 12, scale: 1.1 }}
                        >
                          {feature.icon}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl lg:text-2xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <motion.div
                        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        initial={{ x: -10, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                      >
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Restrictions Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12 lg:mb-16"
          >
            <Card className="relative overflow-hidden p-6 lg:p-8 border-2 border-amber-200/50 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/50 backdrop-blur-sm dark:from-amber-950/20 dark:via-orange-950/10 dark:to-yellow-950/20 dark:border-amber-800/50">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-orange-400/5 dark:from-amber-600/5 dark:to-orange-600/5" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-amber-800 dark:text-amber-200">
                    {t("guest.limitations.title")} {/* Translated */}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {restrictions.map((restriction, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                    >
                      <div className="text-amber-600 dark:text-amber-400">{restriction.icon}</div>
                      <span className="text-amber-700 dark:text-amber-300 font-medium text-sm lg:text-base">
                        {restriction.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl" />

              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl">
                <motion.h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-700 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-300 dark:to-purple-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  {t("guest.cta.title")} {/* Translated */}
                </motion.h3>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => navigate("/register")}
                      size="lg"
                      className="px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <span>{t("guest.cta.signUpFree")}</span> {/* Translated */}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/login")}
                      size="lg"
                      className="px-8 py-4 rounded-2xl text-lg font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                    >
                      {t("guest.cta.signIn")} {/* Translated */}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}



