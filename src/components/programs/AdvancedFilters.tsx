"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  MapPin,
  GraduationCap,
  Languages,
  Euro,
  Building2,
  Star,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface AdvancedFiltersProps {
  filters: {
    search: string
    countries: string[]
    levels: string[]
    fields: string[]
    languages: string[]
    budgetRange: [number, number]
    durationRange: [number, number]
    withScholarship: boolean
    withReligiousFacilities: boolean
    withHalalFood: boolean
    applicationDeadline: string
    startDate: string
    ranking: string
    universityType: string[]
    studyMode: string[]
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
  availableOptions: {
    countries: string[]
    levels: string[]
    fields: string[]
    languages: string[]
    universityTypes: string[]
    studyModes: string[]
  }
  isOpen: boolean
  onToggle: () => void
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  availableOptions,
  isOpen,
  onToggle,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["location", "academic"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: string, value: string) => {
    const currentArray = filters[key as keyof typeof filters] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.countries.length > 0) count++
    if (filters.levels.length > 0) count++
    if (filters.fields.length > 0) count++
    if (filters.languages.length > 0) count++
    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 100000) count++
    if (filters.durationRange[0] > 1 || filters.durationRange[1] < 8) count++
    if (filters.withScholarship) count++
    if (filters.withReligiousFacilities) count++
    if (filters.withHalalFood) count++
    if (filters.applicationDeadline) count++
    if (filters.startDate) count++
    if (filters.ranking) count++
    if (filters.universityType.length > 0) count++
    if (filters.studyMode.length > 0) count++
    return count
  }

  const filterSections = [
    {
      id: "location",
      title: "Location & Geography",
      icon: MapPin,
      color: "blue",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Countries</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {availableOptions.countries.map((country) => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${country}`}
                    checked={filters.countries.includes(country)}
                    onCheckedChange={() => toggleArrayFilter("countries", country)}
                  />
                  <Label htmlFor={`country-${country}`} className="text-sm cursor-pointer">
                    {country}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "academic",
      title: "Academic Details",
      icon: GraduationCap,
      color: "green",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Study Levels</Label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.levels.map((level) => (
                <Badge
                  key={level}
                  variant={filters.levels.includes(level) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleArrayFilter("levels", level)}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Fields of Study</Label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {availableOptions.fields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`field-${field}`}
                    checked={filters.fields.includes(field)}
                    onCheckedChange={() => toggleArrayFilter("fields", field)}
                  />
                  <Label htmlFor={`field-${field}`} className="text-sm cursor-pointer">
                    {field}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Program Duration (Years)</Label>
            <div className="px-2">
              <Slider
                value={filters.durationRange}
                onValueChange={(value) => updateFilter("durationRange", value)}
                max={8}
                min={1}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{filters.durationRange[0]} years</span>
                <span>{filters.durationRange[1]} years</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "language",
      title: "Language & Communication",
      icon: Languages,
      color: "purple",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Instruction Languages</Label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.languages.map((language) => (
                <Badge
                  key={language}
                  variant={filters.languages.includes(language) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleArrayFilter("languages", language)}
                >
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "financial",
      title: "Financial Information",
      icon: Euro,
      color: "yellow",
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="deadline" className="text-sm font-medium">
              Application Deadline
            </Label>
            <Select
              value={filters.applicationDeadline}
              onValueChange={(value) => updateFilter("applicationDeadline", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any deadline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any deadline</SelectItem>
                <SelectItem value="next-month">Next month</SelectItem>
                <SelectItem value="next-3-months">Next 3 months</SelectItem>
                <SelectItem value="next-6-months">Next 6 months</SelectItem>
                <SelectItem value="rolling">Rolling admission</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="start-date" className="text-sm font-medium">
              Program Start
            </Label>
            <Select value={filters.startDate} onValueChange={(value) => updateFilter("startDate", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any start date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any start date</SelectItem>
                <SelectItem value="fall">Fall semester</SelectItem>
                <SelectItem value="spring">Spring semester</SelectItem>
                <SelectItem value="summer">Summer semester</SelectItem>
                <SelectItem value="year-round">Year-round</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      id: "facilities",
      title: "Facilities & Services",
      icon: Building2,
      color: "indigo",
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="religious"
              checked={filters.withReligiousFacilities}
              onCheckedChange={(checked) => updateFilter("withReligiousFacilities", checked)}
            />
            <Label htmlFor="religious" className="text-sm font-medium cursor-pointer">
              Religious Facilities
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="halal"
              checked={filters.withHalalFood}
              onCheckedChange={(checked) => updateFilter("withHalalFood", checked)}
            />
            <Label htmlFor="halal" className="text-sm font-medium cursor-pointer">
              Halal Food Available
            </Label>
          </div>
        </div>
      ),
    },
    {
      id: "university",
      title: "University Details",
      icon: Star,
      color: "orange",
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="ranking" className="text-sm font-medium">
              University Ranking
            </Label>
            <Select value={filters.ranking} onValueChange={(value) => updateFilter("ranking", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any ranking" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any ranking</SelectItem>
                <SelectItem value="top-100">Top 100</SelectItem>
                <SelectItem value="top-500">Top 500</SelectItem>
                <SelectItem value="top-1000">Top 1000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">University Type</Label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.universityTypes.map((type) => (
                <Badge
                  key={type}
                  variant={filters.universityType.includes(type) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleArrayFilter("universityType", type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Study Mode</Label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.studyModes.map((mode) => (
                <Badge
                  key={mode}
                  variant={filters.studyMode.includes(mode) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleArrayFilter("studyMode", mode)}
                >
                  {mode}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ]

  const getSectionColor = (color: string) => {
    const colors = {
      blue: "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20",
      green: "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20",
      purple: "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20",
      yellow: "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20",
      indigo: "border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20",
      red: "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20",
      orange: "border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Filter className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Advanced Filters</CardTitle>
                    <p className="text-sm text-muted-foreground">Refine your search with detailed criteria</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30">
                      {getActiveFiltersCount()} active
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={onClearFilters} disabled={getActiveFiltersCount() === 0}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                  <Button variant="ghost" size="icon" onClick={onToggle}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {filterSections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Collapsible
                        open={expandedSections.includes(section.id)}
                        onOpenChange={() => toggleSection(section.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-between p-4 h-auto border-2 rounded-lg hover:bg-transparent",
                              getSectionColor(section.color),
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <section.icon className="h-5 w-5" />
                              <span className="font-medium">{section.title}</span>
                            </div>
                            {expandedSections.includes(section.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <div className="p-4 border-2 border-t-0 rounded-b-lg border-current/20 bg-white/50 dark:bg-slate-800/50">
                            {section.content}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AdvancedFilters
