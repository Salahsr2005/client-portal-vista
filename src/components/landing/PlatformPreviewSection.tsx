"use client"

import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { WavyBackground } from "@/components/WavyBackground"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Link } from "react-router-dom"

export function PlatformPreviewSection() {
  const { t } = useTranslation()

  return (
    <WavyBackground
      className="py-24"
      colors={["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd"]}
      backgroundFill="#0f172a"
      speed="slow"
      waveOpacity={0.4}
    >
      <section className="relative py-24 overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              {t("platform.title", "Notre Plateforme Révolutionnaire")}
            </h2>

            <div className="max-w-4xl mx-auto space-y-4">
              <p className="text-xl md:text-2xl text-blue-300 font-medium">
                {t(
                  "platform.subtitle",
                  "Notre fonctionnalité la plus puissante - Un système de consultation intelligent qui vous guide tout au long de votre parcours d'études",
                )}
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                {t(
                  "platform.description",
                  "Explorez notre système de consultation automatisé qui vous aide à trouver la destination d'études à l'étranger parfaite en fonction de votre budget, de vos intérêts et de vos objectifs académiques",
                )}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="pt-8"
            >
              <Link to="/consultation">
                <ShimmerButton size="lg" className="px-8 py-4 text-lg">
                  {t("platform.cta", "Explorez notre plateforme avant le lancement officiel")}
                </ShimmerButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </WavyBackground>
  )
}
