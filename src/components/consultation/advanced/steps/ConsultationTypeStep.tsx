"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, MapPin, Globe, Users, Sparkles, Target, ArrowRight } from "lucide-react"

interface ConsultationTypeStepProps {
  data: {
    consultationType?: "programs" | "destinations"
  }
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
  const selectedType = data?.consultationType

  useEffect(() => {
    onValidation(!!selectedType)
  }, [selectedType, onValidation])

  const handleTypeSelect = (type: "programs" | "destinations") => {
    updateData({ consultationType: type })
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
        >
          <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          What are you looking for?
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Choose whether you want to find specific study programs or explore study destinations and their procedures
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4">
        {CONSULTATION_TYPES.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="w-full"
          >
            <Card
              className={`cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 sm:hover:-translate-y-2 ${
                selectedType === type.id
                  ? `ring-2 sm:ring-4 ring-offset-2 sm:ring-offset-4 ring-blue-400 ${type.bgColor} ${type.borderColor} shadow-xl sm:shadow-2xl scale-105`
                  : "hover:shadow-xl border-slate-200 dark:border-slate-700"
              }`}
              onClick={() => handleTypeSelect(type.id as "programs" | "destinations")}
            >
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-4 sm:space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                      <div
                        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${type.color} shadow-lg flex-shrink-0`}
                      >
                        <type.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                          {type.title}
                        </h3>
                        <Badge variant="outline" className="mt-1 text-xs sm:text-sm">
                          {type.subtitle}
                        </Badge>
                      </div>
                    </div>
                    {selectedType === type.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                    {type.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center text-sm sm:text-base">
                      <Sparkles className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                      What you'll get:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {type.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex-shrink-0"></div>
                          <span className="leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">Available Options</span>
                      </div>
                      <Badge className={`bg-gradient-to-r ${type.color} text-white border-0 text-xs sm:text-sm`}>
                        {type.stats}
                      </Badge>
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
          className="text-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-blue-700 dark:text-blue-300">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="font-semibold text-base sm:text-lg text-center">
              Perfect! We'll help you find the best{" "}
              {selectedType === "programs" ? "study programs" : "study destinations"} for your goals.
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}


