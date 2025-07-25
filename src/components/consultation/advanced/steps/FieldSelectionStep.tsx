"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Users, Target } from "lucide-react"
import { useAvailableFields } from "@/hooks/usePrograms"

interface FieldSelectionStepProps {
  data: {
    fields?: string[]
  }
  updateData: (data: any) => void
  onValidation: (isValid: boolean) => void
}

export function FieldSelectionStep({ data, updateData, onValidation }: FieldSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: availableFields, isLoading } = useAvailableFields()
  const selectedFields = data?.fields || []

  useEffect(() => {
    onValidation(selectedFields.length > 0)
  }, [selectedFields, onValidation])

  const filteredFields =
    availableFields?.filter((field) => field.toLowerCase().includes(searchTerm.toLowerCase())) || []

  const handleFieldToggle = (field: string) => {
    const newFields = selectedFields.includes(field)
      ? selectedFields.filter((f) => f !== field)
      : [...selectedFields, field]

    updateData({ fields: newFields })
  }

  const getFieldCategory = (field: string) => {
    const categories = {
      Engineering: ["Engineering", "Mechanical", "Electrical", "Civil", "Chemical", "Aerospace", "Biomedical"],
      Business: ["Business", "Management", "Finance", "Marketing", "Economics", "Accounting"],
      Technology: ["Computer Science", "Information Technology", "Data Science", "Cybersecurity", "Software"],
      Health: ["Medicine", "Nursing", "Pharmacy", "Dentistry", "Public Health", "Veterinary"],
      Sciences: ["Physics", "Chemistry", "Biology", "Mathematics", "Environmental Science"],
      "Arts & Humanities": ["Arts", "Literature", "Philosophy", "History", "Languages"],
      "Social Sciences": ["Psychology", "Sociology", "Political Science", "International Relations"],
    }

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => field.toLowerCase().includes(keyword.toLowerCase()))) {
        return category
      }
    }
    return "Other"
  }

  const getFieldIcon = (field: string) => {
    const category = getFieldCategory(field)
    const icons = {
      Engineering: "⚙️",
      Business: "💼",
      Technology: "💻",
      Health: "🏥",
      Sciences: "🔬",
      "Arts & Humanities": "🎨",
      "Social Sciences": "👥",
      Other: "📚",
    }
    return icons[category as keyof typeof icons] || "📚"
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Loading Fields of Study...</h2>
          <p className="text-muted-foreground">Fetching available programs from our database</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
        >
          <Target className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">What would you like to study?</h2>
        <p className="text-muted-foreground text-lg">
          Select one or more fields that interest you. We have {availableFields?.length || 0} fields available.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search fields of study..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Fields */}
      {selectedFields.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Selected Fields ({selectedFields.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedFields.map((field) => (
              <Badge
                key={field}
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                onClick={() => handleFieldToggle(field)}
              >
                {getFieldIcon(field)} {field} ✕
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Available Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {filteredFields.map((field, index) => (
          <motion.div
            key={field}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                selectedFields.includes(field)
                  ? "ring-2 ring-offset-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "hover:shadow-md"
              }`}
              onClick={() => handleFieldToggle(field)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getFieldIcon(field)}</span>
                      <div>
                        <h3 className="font-semibold text-sm leading-tight">{field}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {getFieldCategory(field)}
                        </Badge>
                      </div>
                    </div>
                    {selectedFields.includes(field) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredFields.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No fields found</h3>
          <p className="text-muted-foreground">Try adjusting your search term or browse all available fields.</p>
        </div>
      )}
    </div>
  )
}





