"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Plus, X, Search } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

interface FieldSelectionStepProps {
  selectedFields: string[]
  onFieldsChange: (fields: string[]) => void
  onNext: () => void
  onBack: () => void
}

export const FieldSelectionStep: React.FC<FieldSelectionStepProps> = ({
  selectedFields,
  onFieldsChange,
  onNext,
  onBack,
}) => {
  const [customField, setCustomField] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch available fields from programs
  const { data: availableFields = [], isLoading } = useQuery({
    queryKey: ["program-fields"],
    queryFn: async () => {
      const { data: programs, error } = await supabase
        .from("programs")
        .select("name, field, field_keywords")
        .eq("status", "Active")

      if (error) throw error

      const fieldsSet = new Set<string>()

      programs?.forEach((program) => {
        // Add main field
        if (program.field) {
          fieldsSet.add(program.field)
        }

        // Add field keywords
        if (program.field_keywords && Array.isArray(program.field_keywords)) {
          program.field_keywords.forEach((keyword) => fieldsSet.add(keyword))
        }

        // Extract meaningful keywords from program names
        if (program.name) {
          const words = program.name
            .toLowerCase()
            .split(/[\s,.-]+/)
            .filter(
              (word) =>
                word.length > 3 &&
                ![
                  "university",
                  "college",
                  "school",
                  "program",
                  "degree",
                  "bachelor",
                  "master",
                  "phd",
                  "diploma",
                ].includes(word),
            )
          words.forEach((word) => fieldsSet.add(word.charAt(0).toUpperCase() + word.slice(1)))
        }
      })

      return Array.from(fieldsSet).sort()
    },
  })

  const filteredFields = availableFields.filter((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleFieldToggle = (field: string) => {
    if (selectedFields.includes(field)) {
      onFieldsChange(selectedFields.filter((f) => f !== field))
    } else {
      onFieldsChange([...selectedFields, field])
    }
  }

  const handleAddCustomField = () => {
    if (customField.trim() && !selectedFields.includes(customField.trim())) {
      onFieldsChange([...selectedFields, customField.trim()])
      setCustomField("")
    }
  }

  const handleRemoveField = (field: string) => {
    onFieldsChange(selectedFields.filter((f) => f !== field))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Select Your Fields of Interest
          </CardTitle>
          <p className="text-muted-foreground text-sm sm:text-base">
            Choose the academic fields you're interested in studying
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Selected Fields */}
          {selectedFields.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">Selected Fields:</Label>
              <div className="flex flex-wrap gap-2">
                {selectedFields.map((field) => (
                  <Badge
                    key={field}
                    variant="default"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-3 py-1 cursor-pointer group"
                    onClick={() => handleRemoveField(field)}
                  >
                    {field}
                    <X className="w-3 h-3 ml-2 group-hover:text-red-200 transition-colors" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available Fields */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">Available Fields:</Label>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                {filteredFields.map((field) => (
                  <Button
                    key={field}
                    variant={selectedFields.includes(field) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFieldToggle(field)}
                    className={`text-xs sm:text-sm justify-start transition-all duration-200 ${
                      selectedFields.includes(field)
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0"
                        : "hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    {field}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Add Custom Field */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">Add Custom Field:</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter custom field..."
                value={customField}
                onChange={(e) => setCustomField(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddCustomField()}
                className="flex-1 border-2 focus:border-blue-500 transition-colors"
              />
              <Button
                onClick={handleAddCustomField}
                disabled={!customField.trim()}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 border-2 hover:border-gray-400 transition-colors bg-transparent"
            >
              Back
            </Button>
            <Button
              onClick={onNext}
              disabled={selectedFields.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
            >
              Continue ({selectedFields.length} selected)
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


