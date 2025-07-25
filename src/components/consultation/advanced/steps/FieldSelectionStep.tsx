"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, Target, X, Plus } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

interface FieldSelectionStepProps {
  data: {
    fields?: string[]
  }
  updateData: (data: any) => void
  onValidation: (isValid: boolean) => void
}

export function FieldSelectionStep({ data, updateData, onValidation }: FieldSelectionStepProps) {
  const [availableFields, setAvailableFields] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const selectedFields = data?.fields || []

  useEffect(() => {
    fetchProgramFields()
  }, [])

  useEffect(() => {
    onValidation(selectedFields.length > 0)
  }, [selectedFields, onValidation])

  const fetchProgramFields = async () => {
    try {
      setLoading(true)
      const { data: programs, error } = await supabase.from("programs").select("name").eq("status", "Active")

      if (error) {
        console.error("Error fetching program fields:", error)
        return
      }

      // Extract unique field names from program names
      const fields =
        programs
          ?.map((program) => program.name)
          .filter(Boolean)
          .filter((field, index, array) => array.indexOf(field) === index)
          .sort() || []

      setAvailableFields(fields)
    } catch (error) {
      console.error("Error fetching fields:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFields = availableFields.filter((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleFieldToggle = (field: string) => {
    const updatedFields = selectedFields.includes(field)
      ? selectedFields.filter((f) => f !== field)
      : [...selectedFields, field]

    updateData({ fields: updatedFields })
  }

  const handleRemoveField = (field: string) => {
    const updatedFields = selectedFields.filter((f) => f !== field)
    updateData({ fields: updatedFields })
  }

  const handleAddCustomField = () => {
    if (searchTerm.trim() && !selectedFields.includes(searchTerm.trim())) {
      const updatedFields = [...selectedFields, searchTerm.trim()]
      updateData({ fields: updatedFields })
      setSearchTerm("")
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
        >
          <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          What field interests you?
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Select one or more fields of study that match your interests and career goals
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for fields of study..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {searchTerm && !availableFields.some((field) => field.toLowerCase() === searchTerm.toLowerCase()) && (
            <Button
              onClick={handleAddCustomField}
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>

      {/* Selected Fields */}
      {selectedFields.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Selected Fields ({selectedFields.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedFields.map((field) => (
              <Badge
                key={field}
                variant="default"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-2 text-sm flex items-center space-x-2 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                onClick={() => handleRemoveField(field)}
              >
                <span>{field}</span>
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Available Fields */}
      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Loading fields...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFields.slice(0, 50).map((field, index) => (
              <motion.div
                key={field}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    selectedFields.includes(field)
                      ? "ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      : "hover:shadow-md border-slate-200 dark:border-slate-700"
                  }`}
                  onClick={() => handleFieldToggle(field)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          selectedFields.includes(field)
                            ? "bg-blue-500 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-800 dark:text-slate-200 truncate">{field}</h3>
                      </div>
                      {selectedFields.includes(field) && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredFields.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              No fields found matching "{searchTerm}". Try a different search term or add it as a custom field.
            </p>
          </div>
        )}
      </div>

      {selectedFields.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-blue-700 dark:text-blue-300">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="font-semibold text-base sm:text-lg text-center">
              Excellent! We'll find programs in {selectedFields.length === 1 ? "this field" : "these fields"} for you.
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}



