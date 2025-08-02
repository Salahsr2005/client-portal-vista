"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Lock, CreditCard, User, ArrowRight, Sparkles, Pill, Star, Zap, Shield, Heart } from "lucide-react"
import { useGuestMode } from "@/contexts/GuestModeContext"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSelector } from "@/components/LanguageSelector"
import { useTranslation } from "react-i18next"

export default function Guest() {
  const navigate = useNavigate()
  const { enableGuestMode } = useGuestMode()
  const { t } = useTranslation()

  useEffect(() => {
    enableGuestMode()
  }, [enableGuestMode])

  const guestFeatures = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: t("guest.features.browseDestinations.title"),
      description: t("guest.features.browseDestinations.description"),
      path: "/guest/destinations",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500 group-hover:to-cyan-500",
      color: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200/50 dark:border-blue-800/50",
      size: "large",
      position: "top-left",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: t("guest.features.viewPrograms.title"),
      description: t("guest.features.viewPrograms.description"),
      path: "/guest/programs",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500 group-hover:to-pink-500",
      color: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-200/50 dark:border-purple-800/50",
      size: "large",
      position: "top-center",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: t("guest.features.checkServices.title"),
      description: t("guest.features.checkServices.description"),
      path: "/guest/services",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconBg:
        "bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:from-green-500 group-hover:to-emerald-500",
      color: "text-green-600 dark:text-green-400",
      borderColor: "border-green-200/50 dark:border-green-800/50",
      size: "small",
      position: "top-right",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: t("guest.features.tryConsultation.title"),
      description: t("guest.features.tryConsultation.description"),
      path: "/guest/consultation",
      gradient: "from-orange-500/20 to-red-500/20",
      iconBg: "bg-gradient-to-br from-orange-500/20 to-red-500/20 group-hover:from-orange-500 group-hover:to-red-500",
      color: "text-orange-600 dark:text-orange-400",
      borderColor: "border-orange-200/50 dark:border-orange-800/50",
      size: "large",
      position: "bottom-left",
    },
    {
      icon: <Pill className="h-6 w-6" />,
      title: t("guest.features.dawiniService.title"),
      description: t("guest.features.dawiniService.description"),
      path: "/guest/dawini",
      gradient: "from-amber-400/30 via-yellow-400/30 to-amber-500/30",
      iconBg:
        "bg-gradient-to-br from-amber-400/30 to-yellow-500/30 group-hover:from-amber-500 group-hover:to-yellow-600",
      color: "text-amber-800 dark:text-amber-200",
      borderColor: "border-amber-300/60 dark:border-amber-700/60",
      isSpecial: true,
      size: "full",
      position: "bottom-full",
    },
  ]

  const restrictions = [
    {
      icon: <Lock className="h-5 w-5" />,
      text: t("guest.restrictions.applyPrograms"),
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      text: t("guest.restrictions.noPaymentFeatures"),
    },
    {
      icon: <User className="h-5 w-5" />,
      text: t("guest.restrictions.limitedProfileAccess"),
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
      scale: 1.03,
      y: -12,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const floatingElements = [
    { icon: <Star className="h-6 w-6" />, delay: 0, color: "text-yellow-400" },
    { icon: <Zap className="h-5 w-5" />, delay: 2, color: "text-blue-400" },
    { icon: <Shield className="h-5 w-5" />, delay: 4, color: "text-green-400" },
    { icon: <Heart className="h-4 w-4" />, delay: 1, color: "text-pink-400" },
    { icon: <Sparkles className="h-5 w-5" />, delay: 3, color: "text-purple-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Animated Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-2000" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-500" />

      {/* Floating Icons */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.color} opacity-20`}
          style={{
            top: `${20 + index * 15}%`,
            left: `${10 + index * 20}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + index,
            repeat: Number.POSITIVE_INFINITY,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <div className="relative z-10 py-8 sm:py-12 lg:py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 lg:mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <Badge
                variant="outline"
                className="border-2 border-blue-200/50 bg-blue-50/50 text-blue-700 px-6 py-3 rounded-full backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-950/50 dark:text-blue-300 text-sm font-medium"
              >
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                {t("guest.badge")}
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-400 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t("guest.title")}
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t("guest.description")}
            </motion.p>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
            >
              {[
                { number: "10K+", label: "Active Users" },
                { number: "50+", label: "Countries" },
                { number: "98%", label: "Success Rate" },
                { number: "24/7", label: "Support" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Perfect Grid Layout Matching Your Image */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-16 lg:mb-20">
            <div className="space-y-6">
              {/* Top Row - 3 cards with different sizes */}
              <div className="grid grid-cols-12 gap-6 h-64">
                {/* Browse Destinations - Large card */}
                <motion.div
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  initial="rest"
                  className="col-span-5"
                >
                  <motion.div variants={cardHoverVariants} className="h-full">
                    <Card
                      className={`relative overflow-hidden h-full cursor-pointer border-2 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${guestFeatures[0].gradient} backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/90 group ${guestFeatures[0].borderColor}`}
                      onClick={() => navigate(guestFeatures[0].path)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
                        <div className="flex flex-col h-full">
                          <motion.div
                            className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl ${guestFeatures[0].iconBg} flex items-center justify-center ${guestFeatures[0].color} group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg mb-4 flex-shrink-0`}
                            whileHover={{ rotate: 12, scale: 1.15 }}
                          >
                            {guestFeatures[0].icon}
                          </motion.div>
                          <div className="flex-1 min-w-0 flex flex-col">
                            <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                              {guestFeatures[0].title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed flex-1">
                              {guestFeatures[0].description}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          initial={{ x: -10, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
                          </div>
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>

                {/* View Programs - Large card */}
                <motion.div
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  initial="rest"
                  className="col-span-4"
                >
                  <motion.div variants={cardHoverVariants} className="h-full">
                    <Card
                      className={`relative overflow-hidden h-full cursor-pointer border-2 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${guestFeatures[1].gradient} backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/90 group ${guestFeatures[1].borderColor}`}
                      onClick={() => navigate(guestFeatures[1].path)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
                        <div className="flex flex-col h-full">
                          <motion.div
                            className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl ${guestFeatures[1].iconBg} flex items-center justify-center ${guestFeatures[1].color} group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg mb-4 flex-shrink-0`}
                            whileHover={{ rotate: 12, scale: 1.15 }}
                          >
                            {guestFeatures[1].icon}
                          </motion.div>
                          <div className="flex-1 min-w-0 flex flex-col">
                            <h3 className="text-xl lg:text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                              {guestFeatures[1].title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed flex-1">
                              {guestFeatures[1].description}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          initial={{ x: -10, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
                          </div>
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>

                {/* Check Services - Small card */}
                <motion.div
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  initial="rest"
                  className="col-span-3"
                >
                  <motion.div variants={cardHoverVariants} className="h-full">
                    <Card
                      className={`relative overflow-hidden h-full cursor-pointer border-2 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${guestFeatures[2].gradient} backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/90 group ${guestFeatures[2].borderColor}`}
                      onClick={() => navigate(guestFeatures[2].path)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <div className="relative z-10 p-6 h-full flex flex-col">
                        <div className="flex flex-col h-full">
                          <motion.div
                            className={`w-12 h-12 rounded-2xl ${guestFeatures[2].iconBg} flex items-center justify-center ${guestFeatures[2].color} group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg mb-4 flex-shrink-0`}
                            whileHover={{ rotate: 12, scale: 1.15 }}
                          >
                            {guestFeatures[2].icon}
                          </motion.div>
                          <div className="flex-1 min-w-0 flex flex-col">
                            <h3 className="text-lg lg:text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                              {guestFeatures[2].title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1">
                              {guestFeatures[2].description}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          initial={{ x: -10, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
                          </div>
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              </div>

              {/* Bottom Row - 1 card on left, space on right */}
              <div className="grid grid-cols-12 gap-6 h-64">
                {/* Try Consultation - Large card */}
                <motion.div
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  initial="rest"
                  className="col-span-5"
                >
                  <motion.div variants={cardHoverVariants} className="h-full">
                    <Card
                      className={`relative overflow-hidden h-full cursor-pointer border-2 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${guestFeatures[3].gradient} backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/90 group ${guestFeatures[3].borderColor}`}
                      onClick={() => navigate(guestFeatures[3].path)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
                        <div className="flex flex-col h-full">
                          <motion.div
                            className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl ${guestFeatures[3].iconBg} flex items-center justify-center ${guestFeatures[3].color} group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg mb-4 flex-shrink-0`}
                            whileHover={{ rotate: 12, scale: 1.15 }}
                          >
                            {guestFeatures[3].icon}
                          </motion.div>
                          <div className="flex-1 min-w-0 flex flex-col">
                            <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                              {guestFeatures[3].title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed flex-1">
                              {guestFeatures[3].description}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          initial={{ x: -10, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
                          </div>
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              </div>

              {/* Full Width Dawini Card */}
              <motion.div
                variants={itemVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                initial="rest"
                className="w-full"
              >
                <motion.div variants={cardHoverVariants} className="h-full">
                  <Card
                    className={`relative overflow-hidden h-48 cursor-pointer border-2 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${guestFeatures[4].gradient} backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/90 group ${guestFeatures[4].borderColor} ring-2 ring-amber-300/50 dark:ring-amber-700/50`}
                    onClick={() => navigate(guestFeatures[4].path)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -skew-x-12 animate-shimmer" />
                    <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
                      <div className="flex flex-col items-center text-center h-full max-w-2xl mx-auto">
                        <motion.div
                          className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl ${guestFeatures[4].iconBg} flex items-center justify-center ${guestFeatures[4].color} group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg mb-4 flex-shrink-0`}
                          whileHover={{ rotate: 12, scale: 1.15 }}
                        >
                          {guestFeatures[4].icon}
                        </motion.div>
                        <div className="flex-1 min-w-0 flex flex-col items-center text-center">
                          <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-white transition-colors text-center">
                            {guestFeatures[4].title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed flex-1 text-center">
                            {guestFeatures[4].description}
                          </p>
                          <div className="mt-4 flex justify-center">
                            <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-300 px-4 py-2">
                              <Sparkles className="h-4 w-4 mr-2" />
                              Premium Service
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <motion.div
                        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        initial={{ x: -10, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
                        </div>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Restrictions Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16 lg:mb-20"
          >
            <Card className="relative overflow-hidden p-8 lg:p-10 border-2 border-amber-200/50 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/50 backdrop-blur-sm dark:from-amber-950/20 dark:via-orange-950/10 dark:to-yellow-950/20 dark:border-amber-800/50 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-orange-400/5 dark:from-amber-600/5 dark:to-orange-600/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-amber-800 dark:text-amber-200">
                    {t("guest.limitations.title")}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {restrictions.map((restriction, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-amber-200/30 dark:border-amber-800/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                    >
                      <div className="text-amber-600 dark:text-amber-400 flex-shrink-0">{restriction.icon}</div>
                      <span className="text-amber-700 dark:text-amber-300 font-medium text-sm lg:text-base">
                        {restriction.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Enhanced CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-10 lg:p-16 border-2 border-white/30 dark:border-slate-700/30 shadow-2xl">
                <motion.h3
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-blue-700 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-300 dark:to-purple-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  {t("guest.cta.title")}
                </motion.h3>
                <motion.div
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => navigate("/register")}
                      size="lg"
                      className="px-10 py-5 rounded-2xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                    >
                      <span>{t("guest.cta.signUpFree")}</span>
                      <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/login")}
                      size="lg"
                      className="px-10 py-5 rounded-2xl text-lg font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {t("guest.cta.signIn")}
                    </Button>
                  </motion.div>
                </motion.div>
                {/* Additional Benefits */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Free to Join</div>
                    <div className="text-blue-700 dark:text-blue-300 text-sm">No membership fees</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7 Access</div>
                    <div className="text-purple-700 dark:text-purple-300 text-sm">Available anytime</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Verified Network</div>
                    <div className="text-green-700 dark:text-green-300 text-sm">Trusted providers only</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
