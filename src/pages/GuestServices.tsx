"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { GuestModeWrapper } from "@/components/layout/GuestModeWrapper"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate } from "react-router-dom"
import {
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Headphones,
  Landmark,
  Plane,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  popular?: boolean
  category: "application" | "visa" | "accommodation" | "consultation"
  duration: string
  icon: React.ElementType
}

export default function GuestServices() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all")

  const services: Service[] = [
    {
      id: "application-basic",
      name: "Basic Application Support",
      description: "Essential support for your university application process",
      price: 299,
      features: ["Application form guidance", "Document checklist", "Basic personal statement review", "Email support"],
      category: "application",
      duration: "2 weeks",
      icon: FileText,
    },
    {
      id: "application-premium",
      name: "Premium Application Package",
      description: "Comprehensive support for competitive university applications",
      price: 599,
      features: [
        "All Basic features",
        "Personal statement development",
        "Application strategy",
        "Interview preparation",
        "Priority support",
      ],
      popular: true,
      category: "application",
      duration: "4 weeks",
      icon: GraduationCap,
    },
    {
      id: "visa-standard",
      name: "Visa Application Support",
      description: "Expert guidance through the student visa process",
      price: 349,
      features: ["Document preparation", "Application review", "Interview coaching", "Timeline management"],
      category: "visa",
      duration: "3 weeks",
      icon: Plane,
    },
    {
      id: "accommodation-search",
      name: "Accommodation Search",
      description: "Find the perfect student housing for your needs",
      price: 249,
      features: ["Personalized housing options", "Virtual tours arrangement", "Lease review", "Neighborhood guides"],
      category: "accommodation",
      duration: "2 weeks",
      icon: Landmark,
    },
    {
      id: "consultation-career",
      name: "Career Path Consultation",
      description: "Expert guidance on academic and career planning",
      price: 199,
      features: ["90-minute consultation", "Industry insights", "Program recommendations", "Career roadmap"],
      category: "consultation",
      duration: "1 week",
      icon: Users,
    },
    {
      id: "consultation-program",
      name: "Program Selection Consultation",
      description: "Find the perfect academic program for your goals",
      price: 149,
      features: [
        "60-minute consultation",
        "Program comparison",
        "Requirements analysis",
        "Admission probability assessment",
      ],
      category: "consultation",
      duration: "1 week",
      icon: Headphones,
    },
  ]

  const filteredServices = activeTab === "all" ? services : services.filter((service) => service.category === activeTab)

  const handleSignUp = () => {
    navigate("/register")
  }

  const handleServiceClick = (serviceId: string) => {
    // In a real app, this would navigate to a service detail page
    navigate(`/register?service=${serviceId}`)
  }

  return (
    <GuestModeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10" />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                {t("services.hero.badge")}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t("services.hero.title")}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("services.hero.subtitle")}</p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={handleSignUp}
                >
                  {t("services.hero.primaryCta")}
                </Button>
                <Button size="lg" variant="outline">
                  {t("services.hero.secondaryCta")}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("services.section.title")}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("services.section.subtitle")}</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <div className="flex justify-center">
                <TabsList className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <TabsTrigger value="all">{t("services.categories.all")}</TabsTrigger>
                  <TabsTrigger value="application">{t("services.categories.application")}</TabsTrigger>
                  <TabsTrigger value="visa">{t("services.categories.visa")}</TabsTrigger>
                  <TabsTrigger value="accommodation">{t("services.categories.accommodation")}</TabsTrigger>
                  <TabsTrigger value="consultation">{t("services.categories.consultation")}</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices.map((service) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card
                        className={`h-full flex flex-col relative overflow-hidden ${
                          service.popular
                            ? "border-2 border-purple-500 dark:border-purple-400"
                            : "border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {service.popular && (
                          <div className="absolute top-0 right-0">
                            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 transform rotate-0 translate-x-2 -translate-y-0">
                              {t("services.popular")}
                            </div>
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                              <service.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <Badge variant="outline">{t(`services.categories.${service.category}`)}</Badge>
                          </div>
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration}</span>
                          </div>
                          <ul className="space-y-2">
                            {service.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter className="flex flex-col items-stretch gap-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-2xl">${service.price}</div>
                            <div className="text-sm text-muted-foreground">{t("services.oneTime")}</div>
                          </div>
                          <Button
                            className={`w-full ${
                              service.popular
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                : ""
                            }`}
                            onClick={() => handleServiceClick(service.id)}
                          >
                            {t("services.getStarted")}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-white/50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("services.whyChoose.title")}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("services.whyChoose.subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Star,
                  title: t("services.whyChoose.reasons.expertise.title"),
                  description: t("services.whyChoose.reasons.expertise.description"),
                },
                {
                  icon: Shield,
                  title: t("services.whyChoose.reasons.guarantee.title"),
                  description: t("services.whyChoose.reasons.guarantee.description"),
                },
                {
                  icon: Zap,
                  title: t("services.whyChoose.reasons.speed.title"),
                  description: t("services.whyChoose.reasons.speed.description"),
                },
                {
                  icon: Users,
                  title: t("services.whyChoose.reasons.support.title"),
                  description: t("services.whyChoose.reasons.support.description"),
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("services.testimonials.title")}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("services.testimonials.subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Medical Student",
                  image: "/placeholder.svg?height=100&width=100&text=SJ",
                  quote:
                    "The application support service was invaluable. I got accepted to my dream medical school thanks to their guidance!",
                },
                {
                  name: "Michael Chen",
                  role: "Engineering Graduate",
                  image: "/placeholder.svg?height=100&width=100&text=MC",
                  quote:
                    "Their visa support made the complicated process simple. I highly recommend their services to any international student.",
                },
                {
                  name: "Aisha Patel",
                  role: "Business Student",
                  image: "/placeholder.svg?height=100&width=100&text=AP",
                  quote:
                    "The accommodation search service saved me so much time and found me the perfect place near my university.",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="mb-4">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className="inline-block w-4 h-4 text-yellow-500 fill-current"
                                fill="currentColor"
                              />
                            ))}
                        </div>
                        <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white/50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("services.faq.title")}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("services.faq.subtitle")}</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: t("services.faq.questions.q1"),
                  answer: t("services.faq.answers.a1"),
                },
                {
                  question: t("services.faq.questions.q2"),
                  answer: t("services.faq.answers.a2"),
                },
                {
                  question: t("services.faq.questions.q3"),
                  answer: t("services.faq.answers.a3"),
                },
                {
                  question: t("services.faq.questions.q4"),
                  answer: t("services.faq.answers.a4"),
                },
                {
                  question: t("services.faq.questions.q5"),
                  answer: t("services.faq.answers.a5"),
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-white"
            >
              <h2 className="text-3xl font-bold mb-4">{t("services.cta.title")}</h2>
              <p className="text-xl mb-8 opacity-90">{t("services.cta.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={handleSignUp}>
                  {t("services.cta.primaryAction")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  {t("services.cta.secondaryAction")}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </GuestModeWrapper>
  )
}
