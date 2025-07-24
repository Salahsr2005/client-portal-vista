"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, Plus, X, Sparkles } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

interface FieldSelectionStepProps {
  data: any
  updateData: (data: any) => void
  onValidation: (isValid: boolean) => void
}

export function FieldSelectionStep({ data, updateData, onValidation }: FieldSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [availableFields, setAvailableFields] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [customField, setCustomField] = useState("")

  // Skip this step for destinations consultation
  useEffect(() => {
    if (data.consultationType === "destinations") {
      onValidation(true)
      return
    }

    fetchFields()
  }, [data.consultationType])

  useEffect(() => {
    if (data.consultationType === "destinations") {
      onValidation(true)
    } else {
      onValidation(!!data.field)
    }
  }, [data.field, data.consultationType, onValidation])

  const fetchFields = async () => {
    try {
      setLoading(true)
      const { data: programs, error } = await supabase.from("programs").select("name").not("name", "is", null)

      if (error) {
        console.error("Error fetching fields:", error)
        return
      }

      // Extract unique fields from program names
      const fields = new Set<string>()
      programs?.forEach((program) => {
        if (program.name) {
          // Extract field-like keywords from program names
          const words = program.name.toLowerCase().split(/[\s,\-$$$$]+/)
          words.forEach((word) => {
            if (word.length > 3 && !isCommonWord(word)) {
              fields.add(capitalizeFirst(word))
            }
          })
        }
      })

      setAvailableFields(Array.from(fields).sort())
    } catch (error) {
      console.error("Error fetching fields:", error)
    } finally {
      setLoading(false)
    }
  }

  const isCommonWord = (word: string): boolean => {
    const commonWords = [
      "and",
      "the",
      "for",
      "with",
      "from",
      "into",
      "upon",
      "over",
      "under",
      "about",
      "through",
      "during",
      "before",
      "after",
      "above",
      "below",
      "university",
      "college",
      "degree",
      "bachelor",
      "master",
      "phd",
      "program",
      "course",
      "study",
      "studies",
      "science",
      "arts",
      "technology",
      "engineering",
    ]
    return commonWords.includes(word.toLowerCase())
  }

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const filteredFields = availableFields.filter((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleFieldSelect = (field: string) => {
    updateData({
      field,
      fieldKeywords: [field.toLowerCase(), ...field.toLowerCase().split(/[\s,-]+/)],
    })
  }

  const handleCustomFieldAdd = () => {
    if (customField.trim()) {
      const field = capitalizeFirst(customField.trim())
      updateData({
        field,
        fieldKeywords: [field.toLowerCase(), ...field.toLowerCase().split(/[\s,-]+/)],
      })
      setCustomField("")
    }
  }

  // Skip rendering for destinations consultation
  if (data.consultationType === "destinations") {
    return null
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
        >
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          What's your field of interest?
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Select your area of study to find programs that match your academic interests
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search for your field of study..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Selected Field */}
      {data.field && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4"
        >
          <Card className="max-w-md mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm sm:text-base">
                    Selected: {data.field}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateData({ field: "", fieldKeywords: [] })}
                  className="text-slate-500 hover:text-slate-700 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Custom Field Input */}
      <div className="max-w-2xl mx-auto px-4">
        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-600">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Don't see your field? Add it here..."
                value={customField}
                onChange={(e) => setCustomField(e.target.value)}
                className="flex-1 text-sm sm:text-base"
                onKeyPress={(e) => e.key === "Enter" && handleCustomFieldAdd()}
              />
              <Button
                onClick={handleCustomFieldAdd}
                disabled={!customField.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Fields */}
      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading available fields...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {filteredFields.slice(0, 50).map((field, index) => (
              <motion.div
                key={field}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge
                  variant={data.field === field ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md transform hover:scale-105 p-2 sm:p-3 text-xs sm:text-sm w-full justify-center text-center ${
                    data.field === field
                      ? "bg-blue-600 text-white border-blue-600"
                      : "hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                  onClick={() => handleFieldSelect(field)}
                >
                  <span className="truncate">{field}</span>
                </Badge>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredFields.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No fields found matching "{searchTerm}"</p>
            <Button
              onClick={() => {
                setCustomField(searchTerm)
                handleCustomFieldAdd()
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add "{searchTerm}" as custom field
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

