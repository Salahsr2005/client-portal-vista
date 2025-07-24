"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, MapPin, Globe, Users, Sparkles, Target, ArrowRight } from "lucide-react"

interface ConsultationTypeStepProps {
  data: any
  updateData: (data: any) => void
  onValidation: (isValid: boolean) => void
}

const CONSULTATION_TYPES = [
  {
    id: "programs",
    title: "Find Study Programs",
    subtitle: "Academic Programs",
    description:
      "Discover specific degree programs, courses, and academic opportunities that match your field of interest",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    features: [
      "Specific degree programs",
      "Course curriculum details",
      "University rankings",
      "Academic requirements",
      "Scholarship opportunities",
    ],
    stats: "2,500+ Programs",
  },
  {
    id: "destinations",
    title: "Find Study Destinations",
    subtitle: "Countries & Procedures",
    description: "Explore countries and their study abroad procedures, visa requirements, and application processes",
    icon: MapPin,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    features: [
      "Country procedures",
      "Visa requirements",
      "Application processes",
      "Living costs by country",
      "Success rates",
    ],
    stats: "50+ Destinations",
  },
]

export function ConsultationTypeStep({ data, updateData, onValidation }: ConsultationTypeStepProps) {
  const selectedType = data.consultationType

  useEffect(() => {
    onValidation(!!selectedType)
  }, [selectedType, onValidation])

  const handleTypeSelect = (type: string) => {
    updateData({ consultationType: type })
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
        >
          <Target className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          What are you looking for?
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose whether you want to find specific study programs or explore study destinations and their procedures
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {CONSULTATION_TYPES.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 ${
                selectedType === type.id
                  ? `ring-4 ring-offset-4 ring-blue-400 ${type.bgColor} ${type.borderColor} shadow-2xl scale-105`
                  : "hover:shadow-xl border-slate-200 dark:border-slate-700"
              }`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${type.color} shadow-lg`}>
                        <type.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{type.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {type.subtitle}
                        </Badge>
                      </div>
                    </div>
                    {selectedType === type.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{type.description}</p>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                      What you'll get:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {type.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Available Options</span>
                      </div>
                      <Badge className={`bg-gradient-to-r ${type.color} text-white border-0`}>{type.stats}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center space-x-3 text-blue-700 dark:text-blue-300">
            <Globe className="w-6 h-6" />
            <span className="font-semibold text-lg">
              Perfect! We'll help you find the best{" "}
              {selectedType === "programs" ? "study programs" : "study destinations"} for your goals.
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
