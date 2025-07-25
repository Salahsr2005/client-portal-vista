"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  BookOpen,
  Lightbulb,
  Briefcase,
  Heart,
  Cpu,
  Palette,
  Globe,
  Calculator,
  Microscope,
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

interface FieldSelectionStepProps {
  data: {
    consultationType?: string
    studyLevel?: string
    selectedFields?: string[]
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
  onValidation: (isValid: boolean) => void
}

// Popular field categories with icons
const fieldCategories = [
  { name: "Engineering", icon: Cpu, color: "bg-blue-100 text-blue-800" },
  { name: "Business", icon: Briefcase, color: "bg-green-100 text-green-800" },
  { name: "Medicine", icon: Heart, color: "bg-red-100 text-red-800" },
  { name: "Arts", icon: Palette, color: "bg-purple-100 text-purple-800" },
  { name: "Science", icon: Microscope, color: "bg-cyan-100 text-cyan-800" },
  { name: "Mathematics", icon: Calculator, color: "bg-orange-100 text-orange-800" },
  { name: "Languages", icon: Globe, color: "bg-indigo-100 text-indigo-800" },
  { name: "Education", icon: BookOpen, color: "bg-yellow-100 text-yellow-800" },
]

export const FieldSelectionStep: React.FC<FieldSelectionStepProps> = ({
  data = {},
  onUpdate,
  onNext,
  onBack,
  onValidation,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFields, setSelectedFields] = useState<string[]>(data.selectedFields || [])

  // Fetch available fields from the programs table
  const { data: availableFields = [], isLoading } = useQuery({
    queryKey: ["program-fields"],
    queryFn: async () => {
      try {
        // Get unique field names from the programs table
        const { data: programs, error } = await supabase.from("programs").select("name").not("name", "is", null)

        if (error) {
          console.error("Error fetching program fields:", error)
          return []
        }

        // Extract unique field names and clean them
        const fieldNames =
          programs
            ?.map((program) => program.name)
            .filter(Boolean)
            .map((name) => name.trim())
            .filter((name, index, array) => array.indexOf(name) === index)
            .sort() || []

        return fieldNames
      } catch (error) {
        console.error("Error in field query:", error)
        return []
      }
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  })

  // Filter fields based on search term
  const filteredFields = availableFields.filter((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))

  // Get category suggestions based on search
  const categoryMatches = fieldCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const isValid = selectedFields.length > 0
    onValidation(isValid)
  }, [selectedFields, onValidation])

  const handleFieldToggle = (field: string) => {
    const updatedFields = selectedFields.includes(field)
      ? selectedFields.filter((f) => f !== field)
      : [...selectedFields, field]

    setSelectedFields(updatedFields)
    onUpdate({
      ...data,
      selectedFields: updatedFields,
    })
  }

  const handleCategorySelect = (categoryName: string) => {
    // Find fields that contain the category name
    const categoryFields = availableFields.filter((field) => field.toLowerCase().includes(categoryName.toLowerCase()))

    if (categoryFields.length > 0) {
      // Add the first few matching fields
      const fieldsToAdd = categoryFields.slice(0, 3).filter((field) => !selectedFields.includes(field))

      if (fieldsToAdd.length > 0) {
        const updatedFields = [...selectedFields, ...fieldsToAdd]
        setSelectedFields(updatedFields)
        onUpdate({
          ...data,
          selectedFields: updatedFields,
        })
      }
    }
  }

  const handleNext = () => {
    if (selectedFields.length > 0) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Select Your Fields of Interest
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose the academic fields you're interested in studying. You can select multiple fields.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for fields of study..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Fields */}
          {selectedFields.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Fields:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedFields.map((field) => (
                  <Badge
                    key={field}
                    variant="default"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleFieldToggle(field)}
                  >
                    {field} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Category Suggestions */}
          {searchTerm && categoryMatches.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Field Categories:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categoryMatches.map((category) => {
                  const Icon = category.icon
                  return (
                    <Button
                      key={category.name}
                      variant="outline"
                      size="sm"
                      className="justify-start h-auto p-3 bg-transparent"
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Popular Categories (when no search) */}
          {!searchTerm && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Popular Categories:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {fieldCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Button
                      key={category.name}
                      variant="outline"
                      size="sm"
                      className="justify-start h-auto p-3 bg-transparent"
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Available Fields */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{searchTerm ? "Search Results:" : "Available Programs:"}</h4>

            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading fields...</p>
              </div>
            ) : filteredFields.length > 0 ? (
              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredFields.slice(0, 50).map((field) => (
                  <Button
                    key={field}
                    variant={selectedFields.includes(field) ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-left h-auto p-2"
                    onClick={() => handleFieldToggle(field)}
                  >
                    <span className="text-xs truncate">{field}</span>
                    {selectedFields.includes(field) && <span className="ml-auto text-xs">✓</span>}
                  </Button>
                ))}
                {filteredFields.length > 50 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    Showing first 50 results. Use search to narrow down.
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "No fields found matching your search." : "No fields available."}
                </p>
                {searchTerm && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Try a different search term or browse categories above.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={selectedFields.length === 0}>
          Next ({selectedFields.length} selected)
        </Button>
      </div>
    </div>
  )
}




