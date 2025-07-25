"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Target, Users, BookOpen } from "lucide-react"

interface LanguageSelectionStepProps {
  data: {
    language?: string
  }
  updateData: (data: any) => void
  onValidation: (isValid: boolean) => void
}

const LANGUAGES = [
  {
    id: "English",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    popularity: "Most Popular",
    countries: ["USA", "UK", "Canada", "Australia", "Ireland"],
    programs: "2000+",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "French",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    popularity: "Very Popular",
    countries: ["France", "Belgium", "Switzerland", "Canada"],
    programs: "800+",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    id: "German",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    popularity: "Popular",
    countries: ["Germany", "Austria", "Switzerland"],
    programs: "600+",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  {
    id: "Spanish",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    popularity: "Popular",
    countries: ["Spain", "Mexico", "Argentina", "Chile"],
    programs: "400+",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    id: "Italian",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    popularity: "Growing",
    countries: ["Italy", "Switzerland"],
    programs: "300+",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    id: "Dutch",
    name: "Dutch",
    nativeName: "Nederlands",
    flag: "🇳🇱",
    popularity: "Growing",
    countries: ["Netherlands", "Belgium"],
    programs: "250+",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
]

export function LanguageSelectionStep({ data, updateData, onValidation }: LanguageSelectionStepProps) {
  const selectedLanguage = data?.language

  useEffect(() => {
    onValidation(!!selectedLanguage)
  }, [selectedLanguage, onValidation])

  const handleLanguageSelect = (language: string) => {
    updateData({ language })
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center"
        >
          <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          What's your preferred language?
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Choose the language you'd like to study in. This will help us find programs that match your language skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
        {LANGUAGES.map((language, index) => (
          <motion.div
            key={language.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full"
          >
            <Card
              className={`cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 sm:hover:-translate-y-2 h-full ${
                selectedLanguage === language.id
                  ? `ring-2 sm:ring-4 ring-offset-2 sm:ring-offset-4 ring-blue-400 ${language.bgColor} ${language.borderColor} shadow-xl sm:shadow-2xl scale-105`
                  : "hover:shadow-xl border-slate-200 dark:border-slate-700"
              }`}
              onClick={() => handleLanguageSelect(language.id)}
            >
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Header */}
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl mb-3">{language.flag}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                      {language.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{language.nativeName}</p>
                    <Badge variant="outline" className={`bg-gradient-to-r ${language.color} text-white border-0`}>
                      {language.popularity}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <BookOpen className="w-4 h-4" />
                        <span>Programs</span>
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{language.programs}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <Globe className="w-4 h-4" />
                        <span>Countries</span>
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {language.countries.length}
                      </span>
                    </div>
                  </div>

                  {/* Countries */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Available in:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {language.countries.slice(0, 3).map((country) => (
                        <Badge
                          key={country}
                          variant="secondary"
                          className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {country}
                        </Badge>
                      ))}
                      {language.countries.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          +{language.countries.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedLanguage === language.id && (
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

      {selectedLanguage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-blue-700 dark:text-blue-300">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="font-semibold text-base sm:text-lg text-center">
              Perfect! We'll find programs taught in {selectedLanguage} for you.
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

