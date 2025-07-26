"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, GraduationCap, ArrowRight, Sparkles, BookOpen } from "lucide-react"

interface ConsultationTypeSelectorProps {
  onSelectType: (type: "destinations" | "programs") => void
}

export default function ConsultationTypeSelector({ onSelectType }: ConsultationTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<"destinations" | "programs" | null>(null)

  const consultationTypes = [
    {
      id: "destinations" as const,
      title: "Destination Consultation",
      description: "Find the perfect country and university for your studies",
      icon: <MapPin className="w-8 h-8" />,
      features: [
        "Country-specific recommendations",
        "University matching",
        "Cost of living analysis",
        "Visa requirements",
        "Cultural fit assessment",
      ],
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-500/10 group-hover:bg-blue-500",
      color: "text-blue-600",
      darkColor: "dark:text-blue-400",
    },
    {
      id: "programs" as const,
      title: "Program Consultation",
      description: "Discover academic programs that match your goals and qualifications",
      icon: <GraduationCap className="w-8 h-8" />,
      features: [
        "Program-specific matching",
        "Academic requirements",
        "Tuition fee analysis",
        "Duration and timeline",
        "Career prospects",
      ],
      gradient: "from-purple-500/10 to-pink-500/10",
      iconBg: "bg-purple-500/10 group-hover:bg-purple-500",
      color: "text-purple-600",
      darkColor: "dark:text-purple-400",
    },
  ]

  const handleContinue = () => {
    if (selectedType) {
      onSelectType(selectedType)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="relative z-10 py-8 sm:py-12 lg:py-16">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 rounded-full">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-600 dark:from-white dark:via-blue-200 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              AI-Powered Consultation
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Choose your consultation type to get personalized recommendations powered by advanced AI
            </p>
          </motion.div>

          {/* Consultation Type Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {consultationTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <Card
                  className={`relative overflow-hidden cursor-pointer border-2 transition-all duration-500 bg-gradient-to-br ${type.gradient} backdrop-blur-sm hover:shadow-2xl ${
                    selectedType === type.id
                      ? "ring-4 ring-indigo-500/50 dark:ring-indigo-400/50 border-indigo-500 dark:border-indigo-400 bg-white/90 dark:bg-slate-800/90"
                      : "border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-white/90 dark:hover:bg-slate-800/90"
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 dark:from-slate-800/0 dark:via-slate-800/5 dark:to-slate-800/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-start space-x-6 mb-6">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl ${type.iconBg} flex items-center justify-center ${type.color} ${type.darkColor} group-hover:text-white transition-all duration-300 group-hover:scale-110`}
                        whileHover={{ rotate: 12 }}
                      >
                        {type.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{type.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{type.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        What you'll get:
                      </h4>
                      <ul className="space-y-2">
                        {type.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <div className="w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Selection Indicator */}
                    {selectedType === type.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4">
                        <Badge className="bg-indigo-500 dark:bg-indigo-400 text-white">Selected</Badge>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button
              onClick={handleContinue}
              disabled={!selectedType}
              size="lg"
              className="px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-400 dark:to-purple-500 dark:hover:from-indigo-500 dark:hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue with {selectedType === "destinations" ? "Destination" : "Program"} Consultation</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
