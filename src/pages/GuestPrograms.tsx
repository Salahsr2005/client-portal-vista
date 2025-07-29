"use client"

import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { usePrograms } from "@/hooks/usePrograms"
import { ModernProgramCard } from "@/components/programs/ModernProgramCard"
import { MobileProgramCard } from "@/components/programs/MobileProgramCard"
import MobileFilters from "@/components/programs/MobileFilters"
import { ComparePrograms } from "@/components/programs/ComparePrograms"
import AdvancedFilters from "@/components/programs/AdvancedFilters"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/useDebounce"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  MapPin,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  GitCompare,
  Sparkles,
  ArrowUpDown,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface FilterState {
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

export default function GuestPrograms() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { toast } = useToast()

  // View and UI state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [compareList, setCompareList] = useState<string[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
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

  // Legacy filter state for compatibility
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [selectedField, setSelectedField] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [maxBudget, setMaxBudget] = useState<number | undefined>(undefined)
  const [withScholarship, setWithScholarship] = useState(false)

  // Debounced search
  const debouncedSearch = useDebounce(filters.search || searchQuery, 300)

  // Available options for filters
  const availableOptions = {
    countries: [
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
      "Hungary",
      "Romania",
      "Bulgaria",
      "Croatia",
      "Slovenia",
      "Slovakia",
      "Estonia",
      "Latvia",
      "Lithuania",
      "Luxembourg",
      "Malta",
      "Cyprus",
    ],
    levels: ["Bachelor", "Master", "PhD", "Certificate", "Diploma", "Foundation"],
    fields: [
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
      "Agriculture",
      "Tourism",
      "Psychology",
      "Economics",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Environmental Sciences",
      "Media & Communications",
      "Design",
      "Music",
      "Sports Science",
      "Veterinary Medicine",
      "Pharmacy",
    ],
    languages: [
      "English",
      "French",
      "German",
      "Spanish",
      "Italian",
      "Dutch",
      "Portuguese",
      "Swedish",
      "Norwegian",
      "Danish",
      "Finnish",
      "Polish",
      "Czech",
      "Hungarian",
      "Romanian",
      "Bulgarian",
    ],
    universityTypes: ["Public", "Private", "Research University", "Applied Sciences", "Technical University"],
    studyModes: ["Full-time", "Part-time", "Online", "Hybrid", "Evening", "Weekend"],
  }

  // Build query parameters
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: isMobile ? 6 : 12,
      search: debouncedSearch || undefined,
      country: filters.countries.length > 0 ? filters.countries[0] : selectedCountry || undefined,
      level: filters.levels.length > 0 ? filters.levels[0] : selectedLevel || undefined,
      field: filters.fields.length > 0 ? filters.fields[0] : selectedField || undefined,
      language: filters.languages.length > 0 ? filters.languages[0] : selectedLanguage || undefined,
      maxBudget: filters.budgetRange[1] < 100000 ? filters.budgetRange[1] : maxBudget || undefined,
      withScholarship: filters.withScholarship || withScholarship || undefined,
      sortBy,
      sortOrder,
    }),
    [
      currentPage,
      debouncedSearch,
      filters,
      selectedCountry,
      selectedLevel,
      selectedField,
      selectedLanguage,
      maxBudget,
      withScholarship,
      sortBy,
      sortOrder,
      isMobile,
    ],
  )

  const { data, isLoading, error } = usePrograms(queryParams)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [
    debouncedSearch,
    filters,
    selectedCountry,
    selectedLevel,
    selectedField,
    selectedLanguage,
    maxBudget,
    withScholarship,
  ])

  // Filter handlers
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
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
    setSearchQuery("")
    setSelectedCountry("")
    setSelectedLevel("")
    setSelectedField("")
    setSelectedLanguage("")
    setMaxBudget(undefined)
    setWithScholarship(false)
    setCurrentPage(1)
  }

  // Legacy filter handlers for compatibility
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setCurrentPage(1)
  }

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level)
    setCurrentPage(1)
  }

  const handleFieldChange = (field: string) => {
    setSelectedField(field)
    setCurrentPage(1)
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setCurrentPage(1)
  }

  const handleBudgetChange = (budget: number) => {
    setMaxBudget(budget)
    setCurrentPage(1)
  }

  const handleScholarshipChange = (scholarship: boolean) => {
    setWithScholarship(scholarship)
    setCurrentPage(1)
  }

  // Comparison functions
  const addToCompare = (programId: string) => {
    if (compareList.length >= 3) {
      toast({
        title: "Comparison Limit",
        description: "You can compare up to 3 programs at once.",
        variant: "destructive",
      })
      return
    }

    if (!compareList.includes(programId)) {
      setCompareList([...compareList, programId])
      toast({
        title: "Added to Comparison",
        description: "Program added to comparison list.",
      })
    }
  }

  const removeFromCompare = (programId: string) => {
    setCompareList(compareList.filter((id) => id !== programId))
    toast({
      title: "Removed from Comparison",
      description: "Program removed from comparison list.",
    })
  }

  const clearCompareList = () => {
    setCompareList([])
  }

  // Program handlers
  const handleViewDetails = (program: any) => {
    navigate(`/guest/programs/${program.id}`)
  }

  const handleApply = (program: any) => {
    toast({
      title: "Sign Up Required",
      description: "Please create an account to apply for programs.",
      action: (
        <Button variant="outline" size="sm" onClick={() => navigate("/register")}>
          Sign Up
        </Button>
      ),
    })
  }

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search || searchQuery) count++
    if (filters.countries.length > 0 || selectedCountry) count++
    if (filters.levels.length > 0 || selectedLevel) count++
    if (filters.fields.length > 0 || selectedField) count++
    if (filters.languages.length > 0 || selectedLanguage) count++
    if (filters.budgetRange[1] < 100000 || maxBudget) count++
    if (filters.withScholarship || withScholarship) count++
    if (filters.withReligiousFacilities) count++
    if (filters.withHalalFood) count++
    return count
  }

  // Pagination component
  const renderPagination = () => {
    if (!data || data.totalPages <= 1) return null

    const { currentPage: page, totalPages } = data
    const maxVisiblePages = isMobile ? 3 : 5

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={() => setCurrentPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="bg-white/80 dark:bg-slate-800/80"
        >
          <ChevronLeft className="h-4 w-4" />
          {!isMobile && "Previous"}
        </Button>

        <div className="flex gap-1">
          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() => setCurrentPage(1)}
                className="bg-white/80 dark:bg-slate-800/80"
              >
                1
              </Button>
              {startPage > 2 && <span className="px-2 py-1 text-sm">...</span>}
            </>
          )}

          {pages.map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              size={isMobile ? "sm" : "default"}
              onClick={() => setCurrentPage(pageNum)}
              className={pageNum === page ? "" : "bg-white/80 dark:bg-slate-800/80"}
            >
              {pageNum}
            </Button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 py-1 text-sm">...</span>}
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() => setCurrentPage(totalPages)}
                className="bg-white/80 dark:bg-slate-800/80"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={() => setCurrentPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="bg-white/80 dark:bg-slate-800/80"
        >
          {!isMobile && "Next"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Loading skeleton
  const renderLoadingSkeleton = () => (
    <div
      className={cn(
        "grid gap-4 sm:gap-6",
        isMobile ? "grid-cols-1" : viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1",
      )}
    >
      {Array.from({ length: isMobile ? 3 : 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden bg-white/80 dark:bg-slate-800/80">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4 sm:p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const ProgramCardComponent = isMobile ? MobileProgramCard : ModernProgramCard

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="relative z-10 p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="w-full sm:w-auto">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Study Programs
                </h1>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400">
                Discover your perfect educational journey with advanced filtering
              </p>
            </div>

            {!isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>

          {/* Search and Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  {/* Search */}
                  <div className="w-full">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search programs, universities, or fields..."
                        value={filters.search || searchQuery}
                        onChange={(e) => {
                          const value = e.target.value
                          setSearchQuery(value)
                          setFilters((prev) => ({ ...prev, search: value }))
                        }}
                        className="pl-10 bg-white dark:bg-slate-700 border-2 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                      {isLoading && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Quick Filters - Desktop */}
                  {!isMobile && (
                    <div className="flex flex-wrap gap-2">
                      <Select
                        value={selectedCountry || "all"}
                        onValueChange={(value) => setSelectedCountry(value === "all" ? "" : value)}
                      >
                        <SelectTrigger className="w-[140px]">
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
                        value={selectedLevel || "all"}
                        onValueChange={(value) => setSelectedLevel(value === "all" ? "" : value)}
                      >
                        <SelectTrigger className="w-[120px]">
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

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="tuition_min">Price</SelectItem>
                          <SelectItem value="ranking">Ranking</SelectItem>
                          <SelectItem value="created_at">Date Added</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="gap-2"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Advanced Filters
                        {getActiveFiltersCount() > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {getActiveFiltersCount()}
                          </Badge>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Mobile Filter Button */}
                  {isMobile && (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex-1 gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                        {getActiveFiltersCount() > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {getActiveFiltersCount()}
                          </Badge>
                        )}
                      </Button>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="tuition_min">Price</SelectItem>
                          <SelectItem value="ranking">Ranking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Active Filters */}
                  {getActiveFiltersCount() > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(filters.search || searchQuery) && (
                        <Badge variant="secondary" className="gap-1">
                          <Search className="h-3 w-3" />
                          {(filters.search || searchQuery).substring(0, 20)}
                          {(filters.search || searchQuery).length > 20 && "..."}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => {
                              setSearchQuery("")
                              setFilters((prev) => ({ ...prev, search: "" }))
                            }}
                          />
                        </Badge>
                      )}
                      {(filters.countries.length > 0 || selectedCountry) && (
                        <Badge variant="secondary" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          {selectedCountry || filters.countries.join(", ")}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => {
                              setSelectedCountry("")
                              setFilters((prev) => ({ ...prev, countries: [] }))
                            }}
                          />
                        </Badge>
                      )}
                      {(filters.levels.length > 0 || selectedLevel) && (
                        <Badge variant="secondary" className="gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {selectedLevel || filters.levels.join(", ")}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => {
                              setSelectedLevel("")
                              setFilters((prev) => ({ ...prev, levels: [] }))
                            }}
                          />
                        </Badge>
                      )}
                      {(filters.withScholarship || withScholarship) && (
                        <Badge variant="secondary" className="gap-1">
                          Scholarship Available
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => {
                              setWithScholarship(false)
                              setFilters((prev) => ({ ...prev, withScholarship: false }))
                            }}
                          />
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 px-2 text-xs">
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <AdvancedFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearAllFilters}
                availableOptions={availableOptions}
                isOpen={showAdvancedFilters}
                onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
              />
            )}
          </AnimatePresence>

          {/* Mobile Filters */}
          {isMobile && showFilters && (
            <MobileFilters
              selectedCountry={selectedCountry}
              selectedLevel={selectedLevel}
              selectedField={selectedField}
              selectedLanguage={selectedLanguage}
              maxBudget={maxBudget}
              withScholarship={withScholarship}
              onCountryChange={handleCountryChange}
              onLevelChange={handleLevelChange}
              onFieldChange={handleFieldChange}
              onLanguageChange={handleLanguageChange}
              onBudgetChange={handleBudgetChange}
              onScholarshipChange={handleScholarshipChange}
              onClose={() => setShowFilters(false)}
            />
          )}

          {/* Comparison Bar */}
          <AnimatePresence>
            {compareList.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <GitCompare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                          {compareList.length} program{compareList.length > 1 ? "s" : ""} selected for comparison
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          onClick={() => setShowCompareModal(true)}
                          disabled={compareList.length < 2}
                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 flex-1 sm:flex-none"
                          size={isMobile ? "sm" : "default"}
                        >
                          Compare ({compareList.length})
                        </Button>
                        <Button variant="outline" onClick={clearCompareList} size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
          >
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {data ? `${data.totalCount} programs found` : isLoading ? "Searching..." : "No results"}
            </div>
            {data && data.totalPages > 1 && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Page {data.currentPage} of {data.totalPages}
              </div>
            )}
          </motion.div>

          {/* Programs Grid */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {renderLoadingSkeleton()}
              </motion.div>
            ) : error ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="bg-white/80 dark:bg-slate-800/80">
                  <CardContent className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Error loading programs. Please try again.</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : data?.programs.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="bg-white/80 dark:bg-slate-800/80">
                  <CardContent className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No programs found</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Try adjusting your search criteria or filters to find more programs.
                    </p>
                    <Button onClick={clearAllFilters} variant="outline">
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div
                  className={cn(
                    "grid gap-4 sm:gap-6",
                    isMobile
                      ? "grid-cols-1"
                      : viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1",
                  )}
                >
                  {data?.programs.map((program, index) => (
                    <motion.div
                      key={program.id}
                      className="relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProgramCardComponent program={program} onViewDetails={handleViewDetails} onApply={handleApply} />

                      {/* Compare Button Overlay */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        {compareList.includes(program.id) ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => removeFromCompare(program.id)}
                            className="bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 shadow-lg"
                          >
                            <X className="h-4 w-4 mr-1" />
                            {!isMobile && "Remove"}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => addToCompare(program.id)}
                            disabled={compareList.length >= 3}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 shadow-lg"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            {!isMobile && "Compare"}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {renderPagination()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Compare Modal */}
      <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compare Programs</DialogTitle>
          </DialogHeader>
          {data && (
            <ComparePrograms
              programs={data.programs.filter((p) => compareList.includes(p.id))}
              onClose={() => setShowCompareModal(false)}
              onRemoveProgram={removeFromCompare}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}



