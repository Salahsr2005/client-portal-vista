"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { GoldenCard } from "@/components/ui/golden-card"
import {
  Pill,
  Shield,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Heart,
  Zap,
  ArrowRight,
  FileText,
  DollarSign,
  Lock,
  UserPlus,
  MessageCircle,
  Sparkles,
} from "lucide-react"

export default function GuestDawini() {
  const navigate = useNavigate()

  const processSteps = [
    {
      step: "1",
      title: "Post Your Request",
      description: "Submit your medication needs with prescription details, urgency level, and location",
      icon: <FileText className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-500",
      features: ["Medication name & dosage", "Urgency classification", "Location details", "Contact information"],
    },
    {
      step: "2",
      title: "Provider Matching",
      description: "Our system matches you with verified providers and pharmacies in your area",
      icon: <Users className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500",
      features: ["Verified providers only", "Location-based matching", "Specialty filtering", "Real-time availability"],
    },
    {
      step: "3",
      title: "Direct Contact",
      description: "Providers contact you directly with availability and pricing information",
      icon: <MessageCircle className="h-8 w-8" />,
      color: "from-green-500 to-emerald-500",
      features: ["Direct communication", "Price negotiation", "Availability confirmation", "Prescription verification"],
    },
    {
      step: "4",
      title: "Secure Transaction",
      description: "Complete your purchase safely through our verified provider network",
      icon: <Shield className="h-8 w-8" />,
      color: "from-orange-500 to-red-500",
      features: ["Secure payments", "Provider verification", "Transaction protection", "Delivery coordination"],
    },
  ]

  const urgencyLevels = [
    {
      level: "Critical",
      description: "Life-threatening situations requiring immediate attention",
      color: "bg-red-500",
      icon: <AlertTriangle className="h-5 w-5" />,
      responseTime: "< 30 minutes",
      cardType: "Golden Card Priority",
    },
    {
      level: "High",
      description: "Urgent medical needs that cannot wait",
      color: "bg-orange-500",
      icon: <Zap className="h-5 w-5" />,
      responseTime: "< 2 hours",
      cardType: "Priority Listing",
    },
    {
      level: "Medium",
      description: "Important medications needed within days",
      color: "bg-yellow-500",
      icon: <Clock className="h-5 w-5" />,
      responseTime: "< 24 hours",
      cardType: "Standard Listing",
    },
    {
      level: "Low",
      description: "Routine medications with flexible timing",
      color: "bg-green-500",
      icon: <CheckCircle className="h-5 w-5" />,
      responseTime: "< 48 hours",
      cardType: "Standard Listing",
    },
  ]

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Verified Providers",
      description: "All providers are verified and licensed professionals",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location-Based",
      description: "Find providers and pharmacies in your local area",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Fast Response",
      description: "Get responses from providers within hours, not days",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Price Transparency",
      description: "Compare prices and negotiate directly with providers",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Community Driven",
      description: "Built by the community, for the community's health needs",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your medical information is protected and confidential",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Medication Requests Fulfilled" },
    { number: "500+", label: "Verified Providers" },
    { number: "50+", label: "Cities Covered" },
    { number: "98%", label: "Success Rate" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden dawini-hero-bg text-white">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="p-4 bg-white/10 rounded-full backdrop-blur-sm"
              >
                <Pill className="h-16 w-16 text-amber-300" />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Dawini
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">Medication Access Network</p>
            <p className="text-lg mb-12 text-blue-200 max-w-2xl mx-auto">
              Connecting patients with medication providers when you need it most. A community-driven platform that
              helps people find essential medications through verified providers and pharmacies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-amber-900 font-semibold px-8 py-4 text-lg"
                onClick={() => navigate("/register")}
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Join Dawini Network
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
                onClick={() => navigate("/login")}
              >
                <Shield className="mr-2 h-5 w-5" />
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">How Dawini Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple, secure, and fast medication access through our verified network
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="process-step"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      {step.icon}
                    </div>
                    <div className="mb-4">
                      <span className="inline-block w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-600 dark:text-gray-300 font-bold text-sm flex items-center justify-center">
                        {step.step}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-3">{step.title}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgency Levels Section */}
      <div className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Urgency Classification</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We prioritize requests based on medical urgency to ensure critical needs are met first
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {urgencyLevels.map((level, index) => {
              const CardComponent = level.level === "Critical" ? GoldenCard : Card

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CardComponent
                    isUrgent={level.level === "Critical"}
                    className="h-full hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        <Badge className={`${level.color} text-white flex items-center gap-2 px-4 py-2`}>
                          {level.icon}
                          {level.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{level.cardType}</CardTitle>
                      <CardDescription>{level.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Response Time:</span>
                        </div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{level.responseTime}</div>
                      </div>
                    </CardContent>
                  </CardComponent>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-amber-600" />
                <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200">Golden Card Priority</h3>
              </div>
              <p className="text-amber-700 dark:text-amber-300">
                Critical medication requests receive our premium Golden Card treatment with immediate visibility,
                priority matching, and expedited provider responses to ensure life-saving medications reach patients
                quickly.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Why Choose Dawini?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with patient safety and accessibility at the core
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 medication-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Access Medications When You Need Them?</h2>
            <p className="text-xl mb-12 text-blue-100">
              Join thousands of patients and providers in our trusted medication access network
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-amber-900 font-semibold px-8 py-4 text-lg"
                  onClick={() => navigate("/register")}
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Free Account
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
                  onClick={() => navigate("/login")}
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Sign In to Continue
                </Button>
              </motion.div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold mb-2">Free to Join</div>
                <div className="text-blue-200">No membership fees</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">24/7 Access</div>
                <div className="text-blue-200">Post requests anytime</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">Verified Network</div>
                <div className="text-blue-200">Licensed providers only</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="py-8 bg-gray-50 dark:bg-slate-900 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            <strong>Important:</strong> Dawini is a platform connecting patients with medication providers. Always
            consult with healthcare professionals and verify prescriptions before purchasing medications.
          </p>
        </div>
      </div>
    </div>
  )
}
