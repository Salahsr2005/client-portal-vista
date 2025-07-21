"use client"

import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { WavyBackground } from "@/components/WavyBackground"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useState } from "react"

export function ModernTestimonialsSection() {
  const { t } = useTranslation()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Amina Benali",
      role: t("testimonials.role1", "Student in Paris"),
      location: t("testimonials.location1", "Algiers, Algeria"),
      content: t(
        "testimonials.content1",
        "Euro Visa made my dream of studying in France a reality. Their guidance through the visa process was invaluable. The team was always available to answer my questions and helped me navigate the complex application process.",
      ),
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      name: "Mohamed Alami",
      role: t("testimonials.role2", "Engineering Student"),
      location: t("testimonials.location2", "Casablanca, Morocco"),
      content: t(
        "testimonials.content2",
        "The consultation system helped me find the perfect engineering program in Germany. The personalized recommendations were spot-on and saved me months of research.",
      ),
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      name: "Sarah Mansouri",
      role: t("testimonials.role3", "Business Student"),
      location: t("testimonials.location3", "Tunis, Tunisia"),
      content: t(
        "testimonials.content3",
        "Excellent service from start to finish. Euro Visa handled all the paperwork and made the entire process stress-free. I'm now studying my dream program in Canada.",
      ),
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <WavyBackground
      className="py-24"
      colors={["#1e3a8a", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"]}
      backgroundFill="#0f172a"
      speed="slow"
      waveOpacity={0.6}
    >
      <section className="relative py-24 overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("testimonials.title", "Ce que disent nos étudiants")}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t(
                "testimonials.subtitle",
                "Écoutez les témoignages d'étudiants qui ont réussi à commencer leur parcours éducatif international avec Euro Visa.",
              )}
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 text-center">
                <Quote className="h-12 w-12 text-blue-400 mx-auto mb-6" />

                <blockquote className="text-lg md:text-xl text-white leading-relaxed mb-8">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={testimonials[currentTestimonial].avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-500 text-white text-lg">
                      {testimonials[currentTestimonial].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h4 className="text-xl font-semibold text-white">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-blue-300">{testimonials[currentTestimonial].role}</p>
                    <p className="text-gray-400 text-sm">{testimonials[currentTestimonial].location}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? "bg-blue-400" : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </WavyBackground>
  )
}
