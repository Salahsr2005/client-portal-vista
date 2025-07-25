"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, BookOpen, Award, Users, Clock, Target } from "lucide-react"

interface LevelSelectionStepProps {
  data: {
    level?: string
    consultationType?: "programs" | "destinations"
  }
  updateData: (data: any) => void
  onValidation: (isValid: boolean) => void
  consultationType?: "programs" | "destinations"
}

const STUDY_LEVELS = [
  {
    id: "Bachelor",
    title: "Bachelor's Degree",
    subtitle: "Undergraduate",
    description: "3-4 year undergraduate programs leading to a bachelor's degree",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    duration: "3-4 years",
    requirements: "High school diploma",
    features: ["Foundation knowledge", "Core subject mastery", "Research introduction", "Career preparation"],
  },
  {
    id: "Master",
    title: "Master's Degree",
    subtitle: "Postgraduate",
    description: "1-2 year advanced programs for specialized knowledge and skills",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    duration: "1-2 years",
    requirements: "Bachelor's degree",
    features: ["Advanced specialization", "Research methodology", "Professional development", "Industry connections"],
  },
  {
    id: "PhD",
    title: "PhD / Doctorate",
    subtitle: "Doctoral",
    description: "3-5 year research-intensive programs for academic and research careers",
    icon: Award,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    duration: "3-5 years",
    requirements: "Master's degree",
    features: ["Original research", "Academic expertise", "Teaching experience", "Publication opportunities"],
  },
]

export function LevelSelectionStep({ data, updateData, onValidation, consultationType }: LevelSelectionStepProps) {
  const selectedLevel = data?.level
  const currentConsultationType = consultationType || data?.consultationType

  useEffect(() => {
    onValidation(!!selectedLevel)
  }, [selectedLevel, onValidation])

  const handleLevelSelect = (level: string) => {
    updateData({ level })
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center"
        >
          <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          What level of study?
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Select the academic level you're interested in pursuing
          {currentConsultationType === "destinations" && " in your chosen destination"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
        {STUDY_LEVELS.map((level, index) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full"
          >
            <Card
              className={`cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 sm:hover:-translate-y-2 h-full ${
                selectedLevel === level.id
                  ? `ring-2 sm:ring-4 ring-offset-2 sm:ring-offset-4 ring-blue-400 ${level.bgColor} ${level.borderColor} shadow-xl sm:shadow-2xl scale-105`
                  : "hover:shadow-xl border-slate-200 dark:border-slate-700"
              }`}
              onClick={() => handleLevelSelect(level.id)}
            >
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Header */}
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${level.color} shadow-lg flex items-center justify-center`}
                    >
                      <level.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                      {level.title}
                    </h3>
                    <Badge variant="outline" className="mb-3">
                      {level.subtitle}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-center text-sm sm:text-base leading-relaxed">
                    {level.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>Duration</span>
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{level.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>Requirements</span>
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-right">
                        {level.requirements}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Key Features:</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {level.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400"
                        >
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex-shrink-0"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedLevel === level.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedLevel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-blue-700 dark:text-blue-300">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="font-semibold text-base sm:text-lg text-center">
              Great choice! {selectedLevel} level programs offer excellent opportunities for your academic journey.
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

