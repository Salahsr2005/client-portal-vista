"use client"

import { motion, useInView } from "framer-motion"
import { useTranslation } from "react-i18next"
import { useRef } from "react"
import { Calendar, CheckCircle, ClipboardCheck, FileSearch, MessageSquare, Sparkles } from "lucide-react"

export function HowItWorksSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  // Steps data with translations
  const steps = [
    {
      number: 1,
      title: t("howItWorks.steps.consultation.title"),
      description: t("howItWorks.steps.consultation.description"),
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
    },
    {
      number: 2,
      title: t("howItWorks.steps.plan.title"),
      description: t("howItWorks.steps.plan.description"),
      icon: <ClipboardCheck className="h-6 w-6 text-primary" />,
    },
    {
      number: 3,
      title: t("howItWorks.steps.documents.title"),
      description: t("howItWorks.steps.documents.description"),
      icon: <FileSearch className="h-6 w-6 text-primary" />,
    },
    {
      number: 4,
      title: t("howItWorks.steps.submission.title"),
      description: t("howItWorks.steps.submission.description"),
      icon: <Calendar className="h-6 w-6 text-primary" />,
    },
    {
      number: 5,
      title: t("howItWorks.steps.tracking.title"),
      description: t("howItWorks.steps.tracking.description"),
      icon: <Sparkles className="h-6 w-6 text-primary" />,
    },
    {
      number: 6,
      title: t("howItWorks.steps.success.title"),
      description: t("howItWorks.steps.success.description"),
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
    },
  ]

  return (
    <section className="py-24" ref={sectionRef}>
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("howItWorks.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("howItWorks.subtitle")}</p>
        </motion.div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/80 to-blue-300/30 transform -translate-x-1/2 rounded-full hidden md:block" />

          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className={`
                  md:flex items-center
                  ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}
                `}
                >
                  {/* Content */}
                  <div
                    className={`
                    md:w-1/2 p-6 rounded-xl glass
                    ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}
                    bg-card/50 backdrop-blur-sm border border-blue-200/20 shadow-lg
                    hover:shadow-blue-200/10 transition-all duration-300
                    transform hover:-translate-y-1
                  `}
                  >
                    <div className="flex items-center mb-4 gap-3">
                      <div
                        className={`
                        h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg
                        ${index % 2 === 0 ? "md:order-last" : "md:order-first"}
                      `}
                      >
                        {step.number}
                      </div>
                      <h3
                        className={`text-xl font-semibold flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Timeline center point */}
                  <div className="hidden md:flex w-12 justify-center relative z-10">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 border-4 border-background">
                      {step.icon}
                    </div>
                  </div>

                  {/* Empty space on the other side */}
                  <div className="md:w-1/2"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

