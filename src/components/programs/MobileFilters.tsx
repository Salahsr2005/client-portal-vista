"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileFiltersProps {
  selectedCountry: string
  selectedLevel: string
  selectedField: string
  selectedLanguage: string
  maxBudget?: number
  withScholarship: boolean
  onCountryChange: (value: string) => void
  onLevelChange: (value: string) => void
  onFieldChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onBudgetChange: (value: number) => void
  onScholarshipChange: (value: boolean) => void
  onClose: () => void
}

export default function MobileFilters({
  selectedCountry,
  selectedLevel,
  selectedField,
  selectedLanguage,
  maxBudget = 50000,
  withScholarship,
  onCountryChange,
  onLevelChange,
  onFieldChange,
  onLanguageChange,
  onBudgetChange,
  onScholarshipChange,
  onClose,
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [budget, setBudget] = useState([0, maxBudget])
  const [expandedSections, setExpandedSections] = useState<string[]>(["basic"])

  const countries = [
    "France",
    "Germany",
    "Spain",
    "Italy",
    "Poland",
    "Belgium",
    "Netherlands",
    "Sweden",
    "Norway",
    "Austria",
    "Switzerland",
    "Denmark",
    "Finland",
    "Portugal",
    "Czech Republic",
  ]

  const levels = ["Bachelor", "Master", "PhD", "Certificate", "Diploma"]

  const fields = [
    "Business & Management",
    "Engineering & Technology",
    "Medicine & Health Sciences",
    "Arts & Humanities",
    "Natural Sciences",
    "Social Sciences",
    "Law",
    "Computer Science & IT",
    "Education",
    "Architecture",
  ]

  const languages = ["English", "French", "German", "Spanish", "Italian", "Dutch", "Portuguese"]

  const activeFiltersCount =
    [selectedCountry, selectedLevel, selectedField, selectedLanguage].filter((f) => f && f !== "").length +
    (withScholarship ? 1 : 0) +
    (budget[1] < 50000 ? 1 : 0)

  const clearAllFilters = () => {
    onCountryChange("")
    onLevelChange("")
    onFieldChange("")
    onLanguageChange("")
    onBudgetChange(50000)
    onScholarshipChange(false)
    setBudget([0, 50000])
    onClose()
    setIsOpen(false)
  }

  const applyFilters = () => {
    onBudgetChange(budget[1])
    onClose()
    setIsOpen(false)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const filterSections = [
    {
      id: "basic",
      title: "Basic Filters",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Study Level</Label>
            <Select value={selectedLevel || "All Levels"} onValueChange={onLevelChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Levels">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Country</Label>
            <Select value={selectedCountry || "All Countries"} onValueChange={onCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Countries">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Field of Study</Label>
            <Select value={selectedField || "All Fields"} onValueChange={onFieldChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Fields" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Fields">All Fields</SelectItem>
                {fields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Language</Label>
            <Select value={selectedLanguage || "All Languages"} onValueChange={onLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Languages">All Languages</SelectItem>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      id: "advanced",
      title: "Advanced Filters",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Budget Range (€): {budget[0].toLocaleString()} - {budget[1].toLocaleString()}
            </Label>
            <Slider value={budget} onValueChange={setBudget} min={0} max={50000} step={1000} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>€0</span>
              <span>€50,000</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="scholarship" className="text-sm font-medium">
                Scholarship Available
              </Label>
              <p className="text-xs text-muted-foreground">Show only programs with scholarships</p>
            </div>
            <Switch id="scholarship" checked={withScholarship} onCheckedChange={onScholarshipChange} />
          </div>
        </div>
      ),
    },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative w-full bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[85vh] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Filter Programs</SheetTitle>
                <SheetDescription>Refine your search to find the perfect program</SheetDescription>
              </div>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="h-6 px-2">
                  {activeFiltersCount} active
                </Badge>
              )}
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6">
            <div className="py-4 space-y-6">
              {filterSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-sm bg-slate-50 dark:bg-slate-800/50">
                    <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleSection(section.id)}>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{section.title}</CardTitle>
                        {expandedSections.includes(section.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </CardHeader>

                    <AnimatePresence>
                      {expandedSections.includes(section.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CardContent className="pt-0">{section.content}</CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}

              {/* Active Filters Summary */}
              {activeFiltersCount > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-950/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Active Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {selectedCountry && (
                          <Badge variant="secondary" className="gap-1">
                            {selectedCountry}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => onCountryChange("")} />
                          </Badge>
                        )}
                        {selectedLevel && (
                          <Badge variant="secondary" className="gap-1">
                            {selectedLevel}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => onLevelChange("")} />
                          </Badge>
                        )}
                        {selectedField && (
                          <Badge variant="secondary" className="gap-1">
                            {selectedField.length > 15 ? `${selectedField.substring(0, 15)}...` : selectedField}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => onFieldChange("")} />
                          </Badge>
                        )}
                        {selectedLanguage && (
                          <Badge variant="secondary" className="gap-1">
                            {selectedLanguage}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => onLanguageChange("")} />
                          </Badge>
                        )}
                        {withScholarship && (
                          <Badge variant="secondary" className="gap-1">
                            Scholarship
                            <X className="h-3 w-3 cursor-pointer" onClick={() => onScholarshipChange(false)} />
                          </Badge>
                        )}
                        {budget[1] < 50000 && (
                          <Badge variant="secondary" className="gap-1">
                            Budget: €{budget[1].toLocaleString()}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => setBudget([0, 50000])} />
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="border-t bg-white dark:bg-slate-900 px-6 py-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="flex-1 bg-transparent"
                disabled={activeFiltersCount === 0}
              >
                Clear All
              </Button>
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

