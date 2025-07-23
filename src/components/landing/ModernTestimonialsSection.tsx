"use client"

import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ModernTestimonialsSection() {
  const { t } = useTranslation()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Karim Hadj",
      role: "Student in Brussels",
      location: "Oran, Algeria",
      content:
        "I couldn't have navigated the complex application process without Euro Visa's expert help. They provided personalized guidance and made sure all my documents were in order. Thanks to them, I'm now studying in my dream university!",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Amina Benali",
      role: "Master's Student",
      location: "Casablanca, Morocco",
      content:
        "Euro Visa made my dream of studying in Europe a reality. Their comprehensive support throughout the visa process was exceptional, and their team was always available to answer my questions.",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Mohamed Trabelsi",
      role: "PhD Candidate",
      location: "Tunis, Tunisia",
      content:
        "The expertise and professionalism of Euro Visa exceeded my expectations. From university selection to visa approval, they guided me every step of the way with remarkable efficiency.",
      avatar: "/placeholder.svg",
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 relative bg-gradient-to-br from-primary/5 via-blue-500/5 to-background">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t("testimonials.modernTitle")}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t("testimonials.modernSubtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8 md:p-12 glass border-primary/10 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Quote icon */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Quote className="h-8 w-8 text-primary" />
                </div>
              </div>

              {/* Testimonial content */}
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6"
              >
                <blockquote className="text-lg md:text-xl leading-relaxed text-foreground">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={testimonials[currentTestimonial].avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {testimonials[currentTestimonial].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center">
                    <h4 className="font-semibold text-lg">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-primary">{testimonials[currentTestimonial].role}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].location}</p>
                  </div>
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="rounded-full border-primary/20 hover:border-primary/40 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Dots indicator */}
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? "bg-primary scale-125"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="rounded-full border-primary/20 hover:border-primary/40 bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
