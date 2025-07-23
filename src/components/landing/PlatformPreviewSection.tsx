"use client"

import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { SpotlightGrid } from "@/components/ui/spotlight-grid"
import { Card } from "@/components/ui/card"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Link } from "react-router-dom"
import { GraduationCap, MessageCircle, MapPin, ArrowRight, Sparkles } from "lucide-react"

export function PlatformPreviewSection() {
  const { t } = useTranslation()

  const features = [
    {
      id: 1,
      title: t("platformPreview.features.consultation.title"),
      description: t("platformPreview.features.consultation.description"),
      icon: <MessageCircle className="h-8 w-8" />,
      gradient: "gradient-card-blue",
      link: "/guest/consultation",
    },
    {
      id: 2,
      title: t("platformPreview.features.destinations.title"),
      description: t("platformPreview.features.destinations.description"),
      icon: <MapPin className="h-8 w-8" />,
      gradient: "gradient-card-teal",
      link: "/guest/destinations",
    },
    {
      id: 3,
      title: t("platformPreview.features.programs.title"),
      description: t("platformPreview.features.programs.description"),
      icon: <GraduationCap className="h-8 w-8" />,
      gradient: "gradient-card-purple",
      link: "/guest/programs",
    },
  ]

  return (
    <SpotlightGrid className="py-24 relative bg-gradient-to-br from-background via-background/90 to-muted/20">
      <div className="container max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t("platformPreview.badge")}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">{t("platformPreview.title")}</h2>
            <h3 className="text-2xl md:text-3xl text-muted-foreground">{t("platformPreview.subtitle")}</h3>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link to={feature.link}>
                  <Card
                    className={`p-8 h-full ${feature.gradient} hover:scale-105 transition-all duration-300 relative overflow-hidden group cursor-pointer`}
                  >
                    {/* Background pattern */}
                    <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                      <div className="text-4xl font-bold text-primary/20">#{index + 1}</div>
                    </div>

                    <div className="relative z-10 space-y-6 text-center">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                        {feature.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                      {/* Action indicator */}
                      <div className="flex items-center justify-center gap-2 text-primary group-hover:gap-4 transition-all duration-300">
                        <span className="text-sm font-medium">{t("platformPreview.tryNow")}</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <Link to="/guest">
              <ShimmerButton size="lg" className="px-12 py-6 text-lg">
                {t("platformPreview.cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </ShimmerButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </SpotlightGrid>
  )
}
