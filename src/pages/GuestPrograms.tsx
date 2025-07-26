"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { GuestModeWrapper } from "@/components/layout/GuestModeWrapper"
import { usePrograms, type Program } from "@/hooks/usePrograms"
import { ModernProgramCard } from "@/components/programs/ModernProgramCard"
import ComparePrograms from "@/components/programs/ComparePrograms"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Filter,
  MapPin,
  BookOpen,
  Award,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  GitCompare,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function GuestPrograms() {
  const { t } = useTranslation()
  const { toast } = useToast()

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedField, setSelectedField] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [budgetRange, setBudgetRange] = useState([0, 100000])
  const [withScholarship, setWithScholarship] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Comparison state
  const [comparePrograms, setComparePrograms] = useState<Program[]>([])
  const [showComparison, setShowComparison] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Fetch programs with filters
  const {
    data: programsData,
    isLoading,
    error,
  } = usePrograms({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    country: selectedCountry,
    field: selectedField,
    level: selectedLevel as any,
    language: selectedLanguage,
    maxBudget: budgetRange[1],
    withScholarship,
  })

  // Filter and sort programs
  const filteredPrograms = useMemo(() => {
    if (!programsData?.programs) return []

    let filtered = programsData.programs

    // Apply budget filter
    if (budgetRange[1] < 100000) {
      filtered = filtered.filter(
        (program) => program.tuition_min <= budgetRange[1] && program.tuition_max >= budgetRange[0],
      )
    }

    // Sort programs
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "tuition_low":
        filtered.sort((a, b) => a.tuition_min - b.tuition_min)
        break
      case "tuition_high":
        filtered.sort((a, b) => b.tuition_min - a.tuition_min)
        break
      case "ranking":
        filtered.sort((a, b) => (a.ranking || 999) - (b.ranking || 999))
        break
      default:
        // Keep original order (relevance)
        break
    }

    return filtered
  }, [programsData?.programs, budgetRange, sortBy])

  // Get unique values for filters
  const countries = useMemo(() => {
    if (!programsData?.programs) return []
    return [...new Set(programsData.programs.map((p) => p.country))].sort()
  }, [programsData?.programs])

  const fields = useMemo(() => {
    if (!programsData?.programs) return []
    return [...new Set(programsData.programs.map((p) => p.field))].sort()
  }, [programsData?.programs])

  const languages = useMemo(() => {
    if (!programsData?.programs) return []
    return [...new Set(programsData.programs.map((p) => p.program_language))].sort()
  }, [programsData?.programs])

  const handleProgramView = (program: Program) => {
    window.open(`/guest/programs/${program.id}`, "_blank")
  }

  const handleProgramApply = (program: Program) => {
    toast({
      title: t("programs.guestApply.title"),
      description: t("programs.guestApply.description"),
      action: (
        <Button size="sm" onClick={() => window.open("/register", "_blank")}>
          {t("programs.guestApply.action")}
        </Button>
      ),
    })
  }

  // Comparison functions
  const addToComparison = (program: Program) => {
    if (comparePrograms.length >= 3) {
      toast({
        title: "Comparison Limit",
        description: "You can compare up to 3 programs at a time.",
        variant: "destructive",
      })
      return
    }

    if (comparePrograms.find((p) => p.id === program.id)) {
      toast({
        title: "Already Added",
        description: "This program is already in your comparison list.",
        variant: "destructive",
      })
      return
    }

    setComparePrograms((prev) => [...prev, program])
    toast({
      title: "Added to Comparison",
      description: `${program.name} has been added to comparison.`,
    })
  }

  const removeFromComparison = (programId: string) => {
    setComparePrograms((prev) => prev.filter((p) => p.id !== programId))
  }

  const clearComparison = () => {
    setComparePrograms([])
    setShowComparison(false)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCountry("")
    setSelectedField("")
    setSelectedLevel("")
    setSelectedLanguage("")
    setBudgetRange([0, 100000])
    setWithScholarship(false)
    setCurrentPage(1)
  }

  const activeFiltersCount = [
    searchTerm,
    selectedCountry,
    selectedField,
    selectedLevel,
    selectedLanguage,
    withScholarship,
    budgetRange[1] < 100000,
  ].filter(Boolean).length

  return (
    <GuestModeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="absolute inset-0 bg-black/20" />
         <div className="absolute inset-0 bg-[url('https://hips.hearstapps.com/hmg-prod/images/berry-college-historic-campus-at-twilight-royalty-free-image-1652127954.jpg?crop=1xw:0.84415xh\\;center,top&resize=1200:*?height=400&width=800&text=Programs')] bg-cover bg-center opacity-30" />


          <div className="relative container mx-auto px-4 py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">{t("programs.hero.badge")}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t("programs.hero.title")}
              </h1>

              <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed">{t("programs.hero.subtitle")}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-6 text-blue-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm">
                      {t("programs.hero.stats.programs", { count: programsData?.totalCount || 0 })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">{t("programs.hero.stats.countries", { count: countries.length })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="text-sm">{t("programs.hero.stats.scholarships")}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Comparison Bar */}
          <AnimatePresence>
            {comparePrograms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <Card className="border-2 border-blue-200 bg-blue-50/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <GitCompare className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">
                            Compare Programs ({comparePrograms.length}/3)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {comparePrograms.map((program) => (
                            <Badge key={program.id} variant="secondary" className="gap-1">
                              {program.name.substring(0, 20)}...
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-red-500"
                                onClick={() => removeFromComparison(program.id)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setShowComparison(true)}
                          disabled={comparePrograms.length < 2}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Compare Now
                        </Button>
                        <Button variant="outline" onClick={clearComparison}>
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comparison Modal */}
          <AnimatePresence>
            {showComparison && comparePrograms.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setShowComparison(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ComparePrograms
                    programs={comparePrograms}
                    onClose={() => setShowComparison(false)}
                    onRemoveProgram={removeFromComparison}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search and Filters Bar */}
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 w-full lg:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={t("programs.search.placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t("programs.filters.country")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("programs.filters.allCountries")}</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t("programs.filters.level")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("programs.filters.allLevels")}</SelectItem>
                      <SelectItem value="Bachelor">{t("programs.levels.bachelor")}</SelectItem>
                      <SelectItem value="Master">{t("programs.levels.master")}</SelectItem>
                      <SelectItem value="PhD">{t("programs.levels.phd")}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Mobile Filters Button */}
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden bg-transparent">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        {t("programs.filters.title")}
                        {activeFiltersCount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader>
                        <SheetTitle>{t("programs.filters.title")}</SheetTitle>
                      </SheetHeader>
                      <div className="py-6">
                        <MobileFilters
                          selectedField={selectedField}
                          setSelectedField={setSelectedField}
                          selectedLanguage={selectedLanguage}
                          setSelectedLanguage={setSelectedLanguage}
                          budgetRange={budgetRange}
                          setBudgetRange={setBudgetRange}
                          withScholarship={withScholarship}
                          setWithScholarship={setWithScholarship}
                          fields={fields}
                          languages={languages}
                          clearFilters={clearFilters}
                          activeFiltersCount={activeFiltersCount}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Desktop Advanced Filters */}
                  <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="hidden lg:flex">
                    <Filter className="w-4 h-4 mr-2" />
                    {t("programs.filters.advanced")}
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                  </Button>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">{t("programs.sort.relevance")}</SelectItem>
                      <SelectItem value="name">{t("programs.sort.name")}</SelectItem>
                      <SelectItem value="tuition_low">{t("programs.sort.tuitionLow")}</SelectItem>
                      <SelectItem value="tuition_high">{t("programs.sort.tuitionHigh")}</SelectItem>
                      <SelectItem value="ranking">{t("programs.sort.ranking")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Desktop Advanced Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="hidden lg:block mt-6 pt-6 border-t"
                  >
                    <DesktopFilters
                      selectedField={selectedField}
                      setSelectedField={setSelectedField}
                      selectedLanguage={selectedLanguage}
                      setSelectedLanguage={setSelectedLanguage}
                      budgetRange={budgetRange}
                      setBudgetRange={setBudgetRange}
                      withScholarship={withScholarship}
                      setWithScholarship={setWithScholarship}
                      fields={fields}
                      languages={languages}
                      clearFilters={clearFilters}
                      activeFiltersCount={activeFiltersCount}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("programs.results.title")}</h2>
              <p className="text-muted-foreground">
                {isLoading
                  ? t("programs.results.loading")
                  : t("programs.results.found", {
                      count: filteredPrograms.length,
                      total: programsData?.totalCount || 0,
                    })}
              </p>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">{t("programs.filters.active")}:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    {searchTerm}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </Badge>
                )}
                {selectedCountry && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCountry}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCountry("")} />
                  </Badge>
                )}
                {selectedField && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedField}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedField("")} />
                  </Badge>
                )}
                {selectedLevel && (
                  <Badge variant="secondary" className="gap-1">
                    {t(`programs.levels.${selectedLevel.toLowerCase()}`)}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLevel("")} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  {t("programs.filters.clear")}
                </Button>
              </div>
            )}
          </div>

          {/* Programs Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-red-500 mb-4">
                  <BookOpen className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("programs.error.title")}</h3>
                <p className="text-muted-foreground">{t("programs.error.message")}</p>
              </CardContent>
            </Card>
          ) : filteredPrograms.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("programs.empty.title")}</h3>
                <p className="text-muted-foreground mb-4">{t("programs.empty.message")}</p>
                <Button onClick={clearFilters} variant="outline">
                  {t("programs.empty.clearFilters")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <ModernProgramCard program={program} onViewDetails={handleProgramView} onApply={handleProgramApply} />

                  {/* Compare Button Overlay */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => addToComparison(program)}
                      disabled={comparePrograms.find((p) => p.id === program.id) !== undefined}
                      className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                    >
                      <GitCompare className="w-4 h-4 mr-1" />
                      {comparePrograms.find((p) => p.id === program.id) ? "Added" : "Compare"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {programsData && programsData.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  {t("programs.pagination.previous")}
                </Button>

                {[...Array(Math.min(5, programsData.totalPages))].map((_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(programsData.totalPages, currentPage + 1))}
                  disabled={currentPage === programsData.totalPages}
                >
                  {t("programs.pagination.next")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </GuestModeWrapper>
  )
}

// Desktop Filters Component
const DesktopFilters: React.FC<{
  selectedField: string
  setSelectedField: (field: string) => void
  selectedLanguage: string
  setSelectedLanguage: (language: string) => void
  budgetRange: number[]
  setBudgetRange: (range: number[]) => void
  withScholarship: boolean
  setWithScholarship: (value: boolean) => void
  fields: string[]
  languages: string[]
  clearFilters: () => void
  activeFiltersCount: number
}> = ({
  selectedField,
  setSelectedField,
  selectedLanguage,
  setSelectedLanguage,
  budgetRange,
  setBudgetRange,
  withScholarship,
  setWithScholarship,
  fields,
  languages,
  clearFilters,
  activeFiltersCount,
}) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Field Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("programs.filters.field")}</Label>
        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger>
            <SelectValue placeholder={t("programs.filters.allFields")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("programs.filters.allFields")}</SelectItem>
            {fields.map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("programs.filters.language")}</Label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger>
            <SelectValue placeholder={t("programs.filters.allLanguages")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("programs.filters.allLanguages")}</SelectItem>
            {languages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Budget Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("programs.filters.budget")}: €{budgetRange[0].toLocaleString()} - €{budgetRange[1].toLocaleString()}
        </Label>
        <Slider
          value={budgetRange}
          onValueChange={setBudgetRange}
          max={100000}
          min={0}
          step={1000}
          className="w-full"
        />
      </div>

      {/* Scholarship Filter */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id="scholarship" checked={withScholarship} onCheckedChange={setWithScholarship} />
          <Label htmlFor="scholarship" className="text-sm font-medium">
            {t("programs.filters.withScholarship")}
          </Label>
        </div>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
            {t("programs.filters.clear")} ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  )
}

// Mobile Filters Component
const MobileFilters: React.FC<{
  selectedField: string
  setSelectedField: (field: string) => void
  selectedLanguage: string
  setSelectedLanguage: (language: string) => void
  budgetRange: number[]
  setBudgetRange: (range: number[]) => void
  withScholarship: boolean
  setWithScholarship: (value: boolean) => void
  fields: string[]
  languages: string[]
  clearFilters: () => void
  activeFiltersCount: number
}> = ({
  selectedField,
  setSelectedField,
  selectedLanguage,
  setSelectedLanguage,
  budgetRange,
  setBudgetRange,
  withScholarship,
  setWithScholarship,
  fields,
  languages,
  clearFilters,
  activeFiltersCount,
}) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Field Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("programs.filters.field")}</Label>
        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger>
            <SelectValue placeholder={t("programs.filters.allFields")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("programs.filters.allFields")}</SelectItem>
            {fields.map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("programs.filters.language")}</Label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger>
            <SelectValue placeholder={t("programs.filters.allLanguages")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("programs.filters.allLanguages")}</SelectItem>
            {languages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Budget Filter */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">
          {t("programs.filters.budget")}: €{budgetRange[0].toLocaleString()} - €{budgetRange[1].toLocaleString()}
        </Label>
        <Slider
          value={budgetRange}
          onValueChange={setBudgetRange}
          max={100000}
          min={0}
          step={1000}
          className="w-full"
        />
      </div>

      {/* Scholarship Filter */}
      <div className="flex items-center space-x-2">
        <Switch id="scholarship-mobile" checked={withScholarship} onCheckedChange={setWithScholarship} />
        <Label htmlFor="scholarship-mobile" className="text-sm font-medium">
          {t("programs.filters.withScholarship")}
        </Label>
      </div>

      <Separator />

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          {t("programs.filters.clear")} ({activeFiltersCount})
        </Button>
      )}
    </div>
  )
}



