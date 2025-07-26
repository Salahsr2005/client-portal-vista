"use client"

import { Calendar } from "@/components/ui/calendar"
import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { GuestModeWrapper } from "@/components/layout/GuestModeWrapper"
import { usePrograms, type Program } from "@/hooks/usePrograms"
import { ModernProgramCard } from "@/components/programs/ModernProgramCard"
import ComparePrograms from "@/components/programs/ComparePrograms"
import AdvancedFilters from "@/components/programs/AdvancedFilters"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Search,
  MapPin,
  BookOpen,
  Award,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  GitCompare,
  Grid3X3,
  List,
  TrendingUp,
  Star,
  Heart,
  Share2,
  Plus,
  Eye,
  Download,
  Zap,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Skeleton as SkeletonComponent } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function GuestPrograms() {
  const { t } = useTranslation()
  const { toast } = useToast()

  // View and layout states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    countries: [] as string[],
    levels: [] as string[],
    fields: [] as string[],
    languages: [] as string[],
    budgetRange: [0, 100000] as [number, number],
    durationRange: [1, 8] as [number, number],
    withScholarship: false,
    withReligiousFacilities: false,
    withHalalFood: false,
    applicationDeadline: "",
    startDate: "",
    ranking: "",
    universityType: [] as string[],
    studyMode: [] as string[],
  })

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
    search: filters.search,
    country: filters.countries.join(","),
    field: filters.fields.join(","),
    level: filters.levels.join(",") as any,
    language: filters.languages.join(","),
    maxBudget: filters.budgetRange[1],
    withScholarship: filters.withScholarship,
  })

  // Available options for filters
  const availableOptions = useMemo(() => {
    if (!programsData?.programs)
      return {
        countries: [],
        levels: [],
        fields: [],
        languages: [],
        universityTypes: [],
        studyModes: [],
      }

    return {
      countries: [...new Set(programsData.programs.map((p) => p.country))].sort(),
      levels: [...new Set(programsData.programs.map((p) => p.study_level || p.type))].sort(),
      fields: [...new Set(programsData.programs.map((p) => p.field))].sort(),
      languages: [...new Set(programsData.programs.map((p) => p.program_language))].sort(),
      universityTypes: ["Public", "Private", "Research", "Technical", "Liberal Arts"],
      studyModes: ["Full-time", "Part-time", "Online", "Hybrid", "Evening"],
    }
  }, [programsData?.programs])

  // Filter and sort programs
  const filteredPrograms = useMemo(() => {
    if (!programsData?.programs) return []

    let filtered = programsData.programs

    // Apply additional client-side filters
    if (filters.budgetRange[1] < 100000) {
      filtered = filtered.filter(
        (program) => program.tuition_min <= filters.budgetRange[1] && program.tuition_min >= filters.budgetRange[0],
      )
    }

    if (filters.withReligiousFacilities) {
      filtered = filtered.filter((p) => p.religious_facilities || p.hasReligiousFacilities)
    }

    if (filters.withHalalFood) {
      filtered = filtered.filter((p) => p.halal_food_availability || p.hasHalalFood)
    }

    // Sort programs
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "tuition_low":
        filtered.sort((a, b) => (a.tuition_min || 0) - (b.tuition_min || 0))
        break
      case "tuition_high":
        filtered.sort((a, b) => (b.tuition_min || 0) - (a.tuition_min || 0))
        break
      case "ranking":
        filtered.sort((a, b) => (a.ranking || 999) - (b.ranking || 999))
        break
      case "deadline":
        filtered.sort((a, b) => {
          const dateA = new Date(a.application_deadline || a.deadline || "9999-12-31")
          const dateB = new Date(b.application_deadline || b.deadline || "9999-12-31")
          return dateA.getTime() - dateB.getTime()
        })
        break
      default:
        // Keep original order (relevance)
        break
    }

    return filtered
  }, [programsData?.programs, filters, sortBy])

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
    setFilters({
      search: "",
      countries: [],
      levels: [],
      fields: [],
      languages: [],
      budgetRange: [0, 100000],
      durationRange: [1, 8],
      withScholarship: false,
      withReligiousFacilities: false,
      withHalalFood: false,
      applicationDeadline: "",
      startDate: "",
      ranking: "",
      universityType: [],
      studyMode: [],
    })
    setCurrentPage(1)
  }

  const getActiveFiltersCount = () => {
    return [
      filters.search,
      filters.countries.length > 0,
      filters.levels.length > 0,
      filters.fields.length > 0,
      filters.languages.length > 0,
      filters.withScholarship,
      filters.withReligiousFacilities,
      filters.withHalalFood,
      filters.budgetRange[1] < 100000,
      filters.durationRange[0] > 1 || filters.durationRange[1] < 8,
      filters.applicationDeadline,
      filters.startDate,
      filters.ranking,
      filters.universityType.length > 0,
      filters.studyMode.length > 0,
    ].filter(Boolean).length
  }

  return (
    <GuestModeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000" />

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800&text=Programs')] bg-cover bg-center opacity-10" />

          <div className="relative container mx-auto px-4 py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Discover Your Future</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Find Your Perfect Study Program
              </h1>

              <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed">
                Explore thousands of programs from top universities worldwide
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-6 text-blue-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm">{programsData?.totalCount || 0} Programs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">{availableOptions.countries.length} Countries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="text-sm">Scholarships Available</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Comparison Bar */}
          <AnimatePresence>
            {comparePrograms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <GitCompare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-blue-900 dark:text-blue-100">
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
                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          <GitCompare className="w-4 h-4 mr-2" />
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

          {/* Search and Filters Bar */}
          <Card className="mb-8 border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 w-full lg:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search programs, universities, or fields..."
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                    className="pl-10 border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                  <Select
                    value={filters.countries[0] || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        countries: value === "all" ? [] : [value],
                      }))
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {availableOptions.countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.levels[0] || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        levels: value === "all" ? [] : [value],
                      }))
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {availableOptions.levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Advanced Filters Button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Advanced Filters
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                    <ChevronDown
                      className={cn("w-4 h-4 ml-1 transition-transform", showAdvancedFilters && "rotate-180")}
                    />
                  </Button>

                  {/* View Mode Toggle */}
                  <div className="flex items-center border rounded-lg p-1 bg-muted/50">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Relevance
                        </div>
                      </SelectItem>
                      <SelectItem value="name">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Name A-Z
                        </div>
                      </SelectItem>
                      <SelectItem value="tuition_low">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Price: Low to High
                        </div>
                      </SelectItem>
                      <SelectItem value="tuition_high">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 rotate-180" />
                          Price: High to Low
                        </div>
                      </SelectItem>
                      <SelectItem value="ranking">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          University Ranking
                        </div>
                      </SelectItem>
                      <SelectItem value="deadline">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Application Deadline
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Display */}
              {getActiveFiltersCount() > 0 && (
                <div className="flex flex-wrap gap-2 items-center mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {filters.search && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {filters.search}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                      />
                    </Badge>
                  )}
                  {filters.countries.map((country) => (
                    <Badge key={country} variant="secondary" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {country}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            countries: prev.countries.filter((c) => c !== country),
                          }))
                        }
                      />
                    </Badge>
                  ))}
                  {filters.levels.map((level) => (
                    <Badge key={level} variant="secondary" className="gap-1">
                      <Award className="w-3 h-3" />
                      {level}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            levels: prev.levels.filter((l) => l !== level),
                          }))
                        }
                      />
                    </Badge>
                  ))}
                  {filters.withScholarship && (
                    <Badge variant="secondary" className="gap-1">
                      <Award className="w-3 h-3" />
                      Scholarship Available
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setFilters((prev) => ({ ...prev, withScholarship: false }))}
                      />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advanced Filters */}
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            availableOptions={availableOptions}
            isOpen={showAdvancedFilters}
            onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
          />

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search Results</h2>
              <p className="text-muted-foreground">
                {isLoading
                  ? "Loading programs..."
                  : `Found ${filteredPrograms.length} programs${programsData?.totalCount ? ` of ${programsData.totalCount} total` : ""}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("/guest/consultation", "_blank")}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Get Recommendations
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export Results
              </Button>
            </div>
          </div>

          {/* Programs Grid */}
          {isLoading ? (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
              )}
            >
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-t-lg" />
                  <CardContent className="p-6 space-y-4">
                    <SkeletonComponent className="h-6 w-3/4" />
                    <SkeletonComponent className="h-4 w-full" />
                    <SkeletonComponent className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <SkeletonComponent className="h-6 w-16" />
                      <SkeletonComponent className="h-6 w-20" />
                    </div>
                    <SkeletonComponent className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80">
              <CardContent className="p-12 text-center">
                <div className="text-red-500 mb-4">
                  <BookOpen className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Error Loading Programs</h3>
                <p className="text-muted-foreground">
                  We encountered an error while loading programs. Please try again later.
                </p>
                <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : filteredPrograms.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80">
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Programs Found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any programs matching your criteria. Try adjusting your filters.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                  <Button onClick={() => window.open("/guest/consultation", "_blank")}>Get Recommendations</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "grid gap-6",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
              )}
            >
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  <ModernProgramCard program={program} onViewDetails={handleProgramView} onApply={handleProgramApply} />

                  {/* Compare Button Overlay */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => addToComparison(program)}
                      disabled={comparePrograms.find((p) => p.id === program.id) !== undefined}
                      className={cn(
                        "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg border-2",
                        comparePrograms.find((p) => p.id === program.id)
                          ? "border-green-500 text-green-700 dark:text-green-400"
                          : "border-blue-500 hover:border-blue-600 text-blue-700 dark:text-blue-400",
                      )}
                    >
                      {comparePrograms.find((p) => p.id === program.id) ? (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Compare
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                        onClick={() => handleProgramView(program)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
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
                  className="bg-white/80 dark:bg-slate-800/80"
                >
                  Previous
                </Button>

                {[...Array(Math.min(5, programsData.totalPages))].map((_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "" : "bg-white/80 dark:bg-slate-800/80"}
                    >
                      {page}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(programsData.totalPages, currentPage + 1))}
                  disabled={currentPage === programsData.totalPages}
                  className="bg-white/80 dark:bg-slate-800/80"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Modal */}
      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden">
          <ComparePrograms
            programs={comparePrograms}
            onClose={() => setShowComparison(false)}
            onRemoveProgram={removeFromComparison}
          />
        </DialogContent>
      </Dialog>
    </GuestModeWrapper>
  )
}
