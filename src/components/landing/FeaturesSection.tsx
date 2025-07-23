"use client"

import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, DollarSign, FileText, Loader, Map, Settings, Shield, Users } from "lucide-react"

interface FeatureItem {
  id: number
  name: string
  description: string
  icon: string
}

interface FeaturesSectionProps {
  featuresData: any[]
  isLoading: boolean
}

export function FeaturesSection({ featuresData, isLoading }: FeaturesSectionProps) {
  const { t } = useTranslation()

  // Map service data to features with icons
  const getIconComponent = (serviceName: string) => {
    const name = serviceName.toLowerCase()
    if (name.includes("visa")) return <FileText />
    if (name.includes("consult")) return <Users />
    if (name.includes("application")) return <FileText />
    if (name.includes("immigration")) return <Map />
    if (name.includes("support")) return <Shield />
    if (name.includes("document")) return <FileText />
    return <Settings />
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  // Fallback features if data is not available
  const fallbackFeatures = [
    {
      id: 1,
      name: t("features.expert.title"),
      description: t("features.expert.description"),
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      id: 2,
      name: "Document Preparation",
      description: "Professional assistance with all required documentation for your application.",
      icon: <FileText className="h-6 w-6 text-primary" />,
    },
    {
      id: 3,
      name: t("features.support.title"),
      description: t("features.support.description"),
      icon: <Shield className="h-6 w-6 text-primary" />,
    },
    {
      id: 4,
      name: "Immigration Guidance",
      description: "Expert advice on immigration pathways and requirements.",
      icon: <Map className="h-6 w-6 text-primary" />,
    },
    {
      id: 5,
      name: "Fast Processing",
      description: "Expedited processing options for urgent visa and study applications.",
      icon: <Clock className="h-6 w-6 text-primary" />,
    },
    {
      id: 6,
      name: "Affordable Packages",
      description: "Cost-effective service packages tailored to your specific needs.",
      icon: <DollarSign className="h-6 w-6 text-primary" />,
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("features.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("features.subtitle")}</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {(featuresData.length > 0 ? featuresData : fallbackFeatures).map((feature, index) => (
              <motion.div
                key={feature.id || index}
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card className="h-full border border-primary/10 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      {feature.icon || getIconComponent(feature.name)}
                    </div>
                    <CardTitle>{feature.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {feature.duration && (
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{feature.duration}</span>
                      </div>
                    )}
                    {feature.fee && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>{feature.fee}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

