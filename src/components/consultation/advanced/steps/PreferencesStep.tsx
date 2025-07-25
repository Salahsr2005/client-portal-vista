"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Target, Heart, Utensils, GraduationCap, CheckCircle } from "lucide-react"

interface PreferencesStepProps {
  data: {
    specialRequirements?: {
      religiousFacilities: boolean
      halalFood: boolean
      scholarshipRequired: boolean
    }
  }
  updateData: (data: any) => void
  onValidation: (isValid: boolean) => void
}

const PREFERENCES = [
  {
    id: "religiousFacilities",
    title: "Religious Facilities",
    description: "Access to prayer rooms, religious centers, and spiritual support",
    icon: Heart,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    id: "halalFood",
    title: "Halal Food Options",
    description: "Availability of halal food in campus dining and nearby restaurants",
    icon: Utensils,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    id: "scholarshipRequired",
    title: "Scholarship Opportunities",
    description: "Programs with available scholarships and financial aid options",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
]

export function PreferencesStep({ data, updateData, onValidation }: PreferencesStepProps) {
  const specialRequirements = data?.specialRequirements || {
    religiousFacilities: false,
    halalFood: false,
    scholarshipRequired: false,
  }

  useEffect(() => {
    // This step is always valid as preferences are optional
    onValidation(true)
  }, [onValidation])

  const handlePreferenceChange = (key: keyof typeof specialRequirements, value: boolean) => {
    const updatedRequirements = {
      ...specialRequirements,
      [key]: value,
    }
    updateData({ specialRequirements: updatedRequirements })
  }

  const activePreferences = Object.entries(specialRequirements).filter(([_, value]) => value).length

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center"
        >
          <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Any special preferences?
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Select any special requirements or preferences that are important to you. These are optional but help us find
          better matches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
        {PREFERENCES.map((preference, index) => (
          <motion.div
            key={preference.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full"
          >
            <Card
              className={`transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1 h-full ${
                specialRequirements[preference.id as keyof typeof specialRequirements]
                  ? `ring-2 ring-blue-400 ${preference.bgColor} ${preference.borderColor} shadow-lg scale-105`
                  : "hover:shadow-md border-slate-200 dark:border-slate-700"
              }`}
            >
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Header */}
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${preference.color} shadow-lg flex items-center justify-center`}
                    >
                      <preference.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                      {preference.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-center text-sm sm:text-base leading-relaxed flex-1">
                    {preference.description}
                  </p>
                </div>

                {/* Toggle Switch */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-center space-x-3">
                    <Label htmlFor={preference.id} className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {specialRequirements[preference.id as keyof typeof specialRequirements] ? "Required" : "Optional"}
                    </Label>
                    <Switch
                      id={preference.id}
                      checked={specialRequirements[preference.id as keyof typeof specialRequirements]}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange(preference.id as keyof typeof specialRequirements, checked)
                      }
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                </div>

                {/* Selection indicator */}
                {specialRequirements[preference.id as keyof typeof specialRequirements] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Required</span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="font-semibold text-base sm:text-lg">
              {activePreferences === 0
                ? "No special requirements selected - that's perfectly fine!"
                : `${activePreferences} special requirement${activePreferences > 1 ? "s" : ""} selected`}
            </span>
          </div>

          {activePreferences > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {Object.entries(specialRequirements)
                .filter(([_, value]) => value)
                .map(([key, _]) => {
                  const pref = PREFERENCES.find((p) => p.id === key)
                  return (
                    <Badge key={key} className={`bg-gradient-to-r ${pref?.color} text-white border-0`}>
                      {pref?.title}
                    </Badge>
                  )
                })}
            </div>
          )}

          <p className="text-sm text-blue-600 dark:text-blue-400">
            We'll prioritize options that match your preferences
          </p>
        </div>
      </motion.div>
    </div>
  )
}

