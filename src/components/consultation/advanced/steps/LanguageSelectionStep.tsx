"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Target, BookOpen, Loader2 } from "lucide-react"
import { useAvailableLanguages } from "@/hooks/usePrograms"

interface LanguageSelectionStepProps {
  data: {
    language?: string
  }
  updateData: (data: any) => void
  onValidation: (isValid: boolean) => void
}

const LANGUAGE_INFO: Record<
  string,
  {
    nativeName: string
    flag: string
    countries: string[]
    color: string
    bgColor: string
    borderColor: string
  }
> = {
  English: {
    nativeName: "English",
    flag: "🇺🇸",
    countries: ["USA", "UK", "Canada", "Australia"],
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  French: {
    nativeName: "Français",
    flag: "🇫🇷",
    countries: ["France", "Belgium", "Switzerland", "Canada"],
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  German: {
    nativeName: "Deutsch",
    flag: "🇩🇪",
    countries: ["Germany", "Austria", "Switzerland"],
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  Spanish: {
    nativeName: "Español",
    flag: "🇪🇸",
    countries: ["Spain", "Mexico", "Argentina"],
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  Italian: {
    nativeName: "Italiano",
    flag: "🇮🇹",
    countries: ["Italy", "Switzerland"],
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  Dutch: {
    nativeName: "Nederlands",
    flag: "🇳🇱",
    countries: ["Netherlands", "Belgium"],
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  Portuguese: {
    nativeName: "Português",
    flag: "🇵🇹",
    countries: ["Portugal", "Brazil"],
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    borderColor: "border-teal-200 dark:border-teal-800",
  },
  Turkish: {
    nativeName: "Türkçe",
    flag: "🇹🇷",
    countries: ["Turkey"],
    color: "from-red-600 to-red-700",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
}

export function LanguageSelectionStep({ data, updateData, onValidation }: LanguageSelectionStepProps) {
  const { data: availableLanguages, isLoading } = useAvailableLanguages()
  const selectedLanguage = data?.language

  useEffect(() => {
    onValidation(!!selectedLanguage)
  }, [selectedLanguage, onValidation])

  const handleLanguageSelect = (language: string) => {
    updateData({ language })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Loading Available Languages...</h2>
          <p className="text-muted-foreground">Fetching languages from our programs database</p>
        </div>
      </div>
    )
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
          Choose from {availableLanguages?.length || 0} languages available in our programs database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
        {availableLanguages?.map((language, index) => {
          const languageInfo = LANGUAGE_INFO[language] || {
            nativeName: language,
            flag: "🌍",
            countries: ["Various"],
            color: "from-gray-500 to-gray-600",
            bgColor: "bg-gray-50 dark:bg-gray-900/20",
            borderColor: "border-gray-200 dark:border-gray-800",
          }

          return (
            <motion.div
              key={language}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full"
            >
              <Card
                className={`cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 sm:hover:-translate-y-2 h-full ${
                  selectedLanguage === language
                    ? `ring-2 sm:ring-4 ring-offset-2 sm:ring-offset-4 ring-blue-400 ${languageInfo.bgColor} ${languageInfo.borderColor} shadow-xl sm:shadow-2xl scale-105`
                    : "hover:shadow-xl border-slate-200 dark:border-slate-700"
                }`}
                onClick={() => handleLanguageSelect(language)}
              >
                <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                  <div className="space-y-4 flex-1">
                    {/* Header */}
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl mb-3">{languageInfo.flag}</div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                        {language}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{languageInfo.nativeName}</p>
                    </div>

                    {/* Countries */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Available in:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {languageInfo.countries.slice(0, 3).map((country) => (
                          <Badge
                            key={country}
                            variant="secondary"
                            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            {country}
                          </Badge>
                        ))}
                        {languageInfo.countries.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            +{languageInfo.countries.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {selectedLanguage === language && (
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
          )
        })}
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

      {availableLanguages?.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No languages available</h3>
          <p className="text-muted-foreground">Please check back later or contact support.</p>
        </div>
      )}
    </div>
  )
}
