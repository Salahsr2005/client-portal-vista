"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { LaunchCounter } from "@/components/ui/launch-counter"
import { FloatingIcons } from "@/components/ui/floating-icons"
import { GradientCard } from "@/components/ui/gradient-card"
import { SpotlightGrid } from "@/components/ui/spotlight-grid"
import { useTranslation } from "@/i18n"
import {
  Heart,
  Users,
  MapPin,
  CheckCircle,
  Zap,
  ArrowRight,
  UserPlus,
  MessageCircle,
  Sparkles,
  Shield,
  HandHeart,
  Globe,
  Star,
  Rocket,
  Clock
} from "lucide-react"

export default function GuestDawini() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const communitySteps = [
    {
      step: "1",
      title: t("dawini.community.steps.request.title"),
      description: t("dawini.community.steps.request.description"),
      icon: <MessageCircle className="h-8 w-8" />,
      gradient: "from-blue-500/20 via-cyan-500/20 to-blue-600/20",
      iconColor: "text-blue-500",
    },
    {
      step: "2", 
      title: t("dawini.community.steps.connect.title"),
      description: t("dawini.community.steps.connect.description"),
      icon: <Users className="h-8 w-8" />,
      gradient: "from-purple-500/20 via-pink-500/20 to-purple-600/20",
      iconColor: "text-purple-500",
    },
    {
      step: "3",
      title: t("dawini.community.steps.help.title"),
      description: t("dawini.community.steps.help.description"),
      icon: <HandHeart className="h-8 w-8" />,
      gradient: "from-green-500/20 via-emerald-500/20 to-green-600/20",
      iconColor: "text-green-500",
    },
    {
      step: "4",
      title: t("dawini.community.steps.grow.title"),
      description: t("dawini.community.steps.grow.description"),
      icon: <Sparkles className="h-8 w-8" />,
      gradient: "from-orange-500/20 via-amber-500/20 to-orange-600/20",
      iconColor: "text-orange-500",
    },
  ]

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: t("dawini.features.list.verified.title"),
      description: t("dawini.features.list.verified.description"),
      gradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t("dawini.features.list.local.title"), 
      description: t("dawini.features.list.local.description"),
      gradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: <HandHeart className="h-6 w-6" />,
      title: t("dawini.features.list.mutual.title"),
      description: t("dawini.features.list.mutual.description"),
      gradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t("dawini.features.list.transparent.title"),
      description: t("dawini.features.list.transparent.description"),
      gradient: "from-orange-500/10 to-amber-500/10"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: t("dawini.features.list.caring.title"),
      description: t("dawini.features.list.caring.description"),
      gradient: "from-red-500/10 to-pink-500/10"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: t("dawini.features.list.secure.title"),
      description: t("dawini.features.list.secure.description"),
      gradient: "from-indigo-500/10 to-purple-500/10"
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 dark:from-background dark:via-background/95 dark:to-primary/10">
      {/* Hero Section */}
      <SpotlightGrid className="relative overflow-hidden">
        <FloatingIcons />
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Logo Animation */}
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="p-6 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full backdrop-blur-sm border border-primary/30 shadow-2xl"
                >
                  <Heart className="h-16 w-16 md:h-20 md:w-20 text-primary" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse" />
              </motion.div>
            </div>

            {/* Title with Gradient */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight"
            >
              {t("dawini.title")}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl lg:text-3xl mb-4 text-primary font-semibold"
            >
              {t("dawini.hero.title")}
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl mb-8 text-muted-foreground font-medium"
            >
              {t("dawini.hero.subtitle")}
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-base md:text-lg mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              {t("dawini.hero.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate("/register")}
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  {t("dawini.cta.joinButton")}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate("/login")}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  {t("dawini.cta.loginButton")}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </SpotlightGrid>

      {/* Launch Counter Section */}
      <div className="py-16 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <LaunchCounter targetDate="2025-09-01T00:00:00" />
          </motion.div>
        </div>
      </div>

      {/* How Community Works Section */}
      <div className="py-24 bg-gradient-to-br from-muted/30 to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t("dawini.community.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("dawini.community.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {communitySteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <GradientCard 
                  gradient={step.gradient}
                  className="h-full"
                >
                  <div className="text-center">
                    {/* Step Icon */}
                    <div className="flex justify-center mb-6">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} border border-primary/20 flex items-center justify-center ${step.iconColor} shadow-lg`}
                      >
                        {step.icon}
                      </motion.div>
                    </div>

                    {/* Step Number */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3, type: "spring", stiffness: 300 }}
                      className="mb-4"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-sm">
                        {step.step}
                      </span>
                    </motion.div>

                    <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t("dawini.features.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("dawini.features.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <GradientCard gradient={feature.gradient} className="h-full p-6">
                  <div className="flex items-start space-x-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary flex-shrink-0 shadow-lg"
                    >
                      {feature.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-primary via-purple-500 to-pink-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-white"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <Rocket className="h-16 w-16 mx-auto text-white/90" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("dawini.cta.title")}
            </h2>
            <p className="text-xl mb-12 text-white/90 max-w-3xl mx-auto">
              {t("dawini.cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-8 py-4 text-lg backdrop-blur-sm"
                  onClick={() => navigate("/register")}
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  {t("dawini.cta.joinButton")}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent backdrop-blur-sm"
                  onClick={() => navigate("/login")}
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  {t("dawini.cta.loginButton")}
                </Button>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-2xl font-bold mb-2">{t("dawini.cta.benefits.free")}</div>
                <div className="text-white/80">No membership fees</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-2xl font-bold mb-2">{t("dawini.cta.benefits.community")}</div>
                <div className="text-white/80">Always available help</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-2xl font-bold mb-2">{t("dawini.cta.benefits.verified")}</div>
                <div className="text-white/80">Trusted members only</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="py-8 bg-muted/50 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm max-w-4xl mx-auto">
            <strong>Important:</strong> {t("dawini.footer.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  )
}