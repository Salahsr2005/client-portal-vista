"use client"

import { useState, useEffect, useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { usePrograms, type ProgramsQueryParams } from "@/hooks/usePrograms"
import { useIsMobile } from "@/hooks/use-mobile"
import { ModernProgramCard } from "@/components/programs/ModernProgramCard"
import { MobileProgramCard } from "@/components/programs/MobileProgramCard"
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  ChevronUp,
  X,
  MapPin,
  GraduationCap,
  Euro,
  Award,
  Loader2,
  AlertCircle,
  BookOpen,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 12

export default function GuestPrograms() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isMobile = useIsMobile()

  // State management
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get("country") || "all")
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level") || "all")
  const [selectedField, setSelectedField] = useState(searchParams.get("field") || "all")
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get("language") || "all")
  const [budgetRange, setBudgetRange] = useState([0, 50000])
  const [withScholarship, setWithScholarship] = useState(searchParams.get("scholarship") === "true")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">((searchParams.get("sortOrder") as "asc" | "desc") || "asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filtersExpanded, setFiltersExpanded] = useState({
    location: true,
    academic: true,
    financial: true,
    features: true,
  })

  // Query parameters - Fixed to properly handle filtering
  const queryParams: ProgramsQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchQuery || undefined,
      country: selectedCountry !== "all" ? selectedCountry : undefined,
      level: selectedLevel !== "all" ? selectedLevel : undefined,
      field: selectedField !== "all" ? selectedField : undefined,
      language: selectedLanguage !== "all" ? selectedLanguage : undefined,
      minBudget: budgetRange[0] > 0 ? budgetRange[0] : undefined,
      maxBudget: budgetRange[1] < 50000 ? budgetRange[1] : undefined,
      withScholarship: withScholarship || undefined,
      sortBy,
      sortOrder,
      calculateMatchScores: false, // Disable match scores for guest view
    }),
    [
      currentPage,
      searchQuery,
      selectedCountry,
      selectedLevel,
      selectedField,
      selectedLanguage,
      budgetRange,
      withScholarship,
      sortBy,
      sortOrder,
    ],
  )

  // Fetch programs with proper error handling
  const { data, isLoading, error, refetch } = usePrograms(queryParams)

  // Filter options state
  const [filterOptions, setFilterOptions] = useState({
    countries: [] as string[],
    levels: [] as string[],
    fields: [] as string[],
    languages: [] as string[],
  })

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        // Fetch all programs to get unique values
        const allProgramsQuery = { limit: 1000, calculateMatchScores: false }
        const allProgramsResponse = await fetch("/api/programs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(allProgramsQuery),
        })
        const allPrograms = await allProgramsResponse.json()

        if (allPrograms?.programs) {
          const countries = [...new Set(allPrograms.programs.map((p) => p.country).filter(Boolean))].sort()
          const levels = [...new Set(allPrograms.programs.map((p) => p.study_level).filter(Boolean))].sort()
          const fields = [...new Set(allPrograms.programs.map((p) => p.field).filter(Boolean))].sort()
          const languages = [...new Set(allPrograms.programs.map((p) => p.program_language).filter(Boolean))].sort()

          setFilterOptions({
            countries,
            levels,
            fields,
            languages,
          })
        }
      } catch (err) {
        console.error("Error loading filter options:", err)
      }
    }

    loadFilterOptions()
  }, [])

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (selectedCountry !== "all") params.set("country", selectedCountry)
    if (selectedLevel !== "all") params.set("level", selectedLevel)
    if (selectedField !== "all") params.set("field", selectedField)
    if (selectedLanguage !== "all") params.set("language", selectedLanguage)
    if (withScholarship) params.set("scholarship", "true")
    if (sortBy !== "name") params.set("sortBy", sortBy)
    if (sortOrder !== "asc") params.set("sortOrder", sortOrder)

    setSearchParams(params)
  }, [
    searchQuery,
    selectedCountry,
    selectedLevel,
    selectedField,
    selectedLanguage,
    withScholarship,
    sortBy,
    sortOrder,
    setSearchParams,
  ])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [
    queryParams.search,
    queryParams.country,
    queryParams.level,
    queryParams.field,
    queryParams.language,
    queryParams.maxBudget,
    queryParams.withScholarship,
  ])

  const handleViewDetails = (program: any) => {
    navigate(`/guest/programs/${program.id}`)
  }

  const handleApply = (program: any) => {
    navigate("/register", {
      state: {
        returnTo: `/programs/${program.id}`,
        message: "Please create an account to apply for programs",
      },
    })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCountry("all")
    setSelectedLevel("all")
    setSelectedField("all")
    setSelectedLanguage("all")
    setBudgetRange([0, 50000])
    setWithScholarship(false)
    setSortBy("name")
    setSortOrder("asc")
    setCurrentPage(1)
  }

  const activeFiltersCount = [
    searchQuery,
    selectedCountry !== "all" ? selectedCountry : null,
    selectedLevel !== "all" ? selectedLevel : null,
    selectedField !== "all" ? selectedField : null,
    selectedLanguage !== "all" ? selectedLanguage : null,
    budgetRange[0] > 0 || budgetRange[1] < 50000 ? "budget" : null,
    withScholarship ? "scholarship" : null,
  ].filter(Boolean).length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Programs</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="search"
            placeholder="Search by program name, university, or field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Location Filters */}
      <Collapsible
        open={filtersExpanded.location}
        onOpenChange={(open) => setFiltersExpanded((prev) => ({ ...prev, location: open }))}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Location</span>
          </div>
          {filtersExpanded.location ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {filterOptions.countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Academic Filters */}
      <Collapsible
        open={filtersExpanded.academic}
        onOpenChange={(open) => setFiltersExpanded((prev) => ({ ...prev, academic: open }))}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="font-medium">Academic</span>
          </div>
          {filtersExpanded.academic ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Study Level</Label>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {filterOptions.levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Field of Study</Label>
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                {filterOptions.fields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {filterOptions.languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Financial Filters */}
      <Collapsible
        open={filtersExpanded.financial}
        onOpenChange={(open) => setFiltersExpanded((prev) => ({ ...prev, financial: open }))}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            <span className="font-medium">Financial</span>
          </div>
          {filtersExpanded.financial ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Budget Range (Annual)</Label>
            <div className="px-2">
              <Slider
                value={budgetRange}
                onValueChange={setBudgetRange}
                max={50000}
                min={0}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{formatCurrency(budgetRange[0])}</span>
                <span>{budgetRange[1] >= 50000 ? "50,000+" : formatCurrency(budgetRange[1])}</span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Features */}
      <Collapsible
        open={filtersExpanded.features}
        onOpenChange={(open) => setFiltersExpanded((prev) => ({ ...prev, features: open }))}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="font-medium">Features</span>
          </div>
          {filtersExpanded.features ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Switch id="scholarship" checked={withScholarship} onCheckedChange={setWithScholarship} />
            <Label htmlFor="scholarship">Scholarship Available</Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Explore Study Programs
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover thousands of educational opportunities worldwide. Find the perfect program that matches your
                goals and aspirations.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
            >
              <Card className="text-center p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{data?.totalCount || 0}</div>
                <div className="text-sm text-muted-foreground">Programs</div>
              </Card>
              <Card className="text-center p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{filterOptions.countries.length}</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </Card>
              <Card className="text-center p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{filterOptions.fields.length}</div>
                <div className="text-sm text-muted-foreground">Fields</div>
              </Card>
              <Card className="text-center p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </Card>
            </motion.div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Filters Sidebar */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-80 flex-shrink-0"
              >
                <Card className="sticky top-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FilterSection />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Header with Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search programs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Mobile Filters */}
                  {isMobile && (
                    <Sheet open={showFilters} onOpenChange={setShowFilters}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                          <SlidersHorizontal className="h-4 w-4 mr-2" />
                          Filters
                          {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {activeFiltersCount}
                            </Badge>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                          <FilterSection />
                        </div>
                      </SheetContent>
                    </Sheet>
                  )}

                  {/* Sort */}
                  <Select
                    value={`${sortBy}-${sortOrder}`}
                    onValueChange={(value) => {
                      const [field, order] = value.split("-")
                      setSortBy(field)
                      setSortOrder(order as "asc" | "desc")
                    }}
                  >
                    <SelectTrigger className="w-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">Name A-Z</SelectItem>
                      <SelectItem value="name-desc">Name Z-A</SelectItem>
                      <SelectItem value="tuition_min-asc">Price Low-High</SelectItem>
                      <SelectItem value="tuition_min-desc">Price High-Low</SelectItem>
                      <SelectItem value="created_at-desc">Newest First</SelectItem>
                      <SelectItem value="created_at-asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="flex border rounded-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: {searchQuery}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                    </Badge>
                  )}
                  {selectedCountry !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Country: {selectedCountry}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCountry("all")} />
                    </Badge>
                  )}
                  {selectedLevel !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Level: {selectedLevel}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLevel("all")} />
                    </Badge>
                  )}
                  {selectedField !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Field: {selectedField}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedField("all")} />
                    </Badge>
                  )}
                  {selectedLanguage !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Language: {selectedLanguage}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLanguage("all")} />
                    </Badge>
                  )}
                  {(budgetRange[0] > 0 || budgetRange[1] < 50000) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Budget: {formatCurrency(budgetRange[0])} -{" "}
                      {budgetRange[1] >= 50000 ? "50,000+" : formatCurrency(budgetRange[1])}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setBudgetRange([0, 50000])} />
                    </Badge>
                  )}
                  {withScholarship && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Scholarship Available
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setWithScholarship(false)} />
                    </Badge>
                  )}
                </motion.div>
              )}

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-muted-foreground">
                  {isLoading
                    ? "Loading programs..."
                    : data?.programs
                      ? `Showing ${data.programs.length} of ${data.totalCount} programs`
                      : "No programs found"}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {/* Error State */}
              {error && (
                <Card className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Error Loading Programs</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={() => refetch()}>Try Again</Button>
                </Card>
              )}

              {/* Programs Grid */}
              {!isLoading && !error && data?.programs && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentPage}-${viewMode}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "grid gap-6",
                      viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1",
                    )}
                  >
                    {data.programs.map((program, index) => (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        {viewMode === "grid" ? (
                          isMobile ? (
                            <MobileProgramCard
                              program={program}
                              onViewDetails={handleViewDetails}
                              onApply={handleApply}
                            />
                          ) : (
                            <ModernProgramCard
                              program={program}
                              onViewDetails={handleViewDetails}
                              onApply={handleApply}
                            />
                          )
                        ) : (
                          <ModernProgramCard
                            program={program}
                            onViewDetails={handleViewDetails}
                            onApply={handleApply}
                          />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Empty State */}
              {!isLoading && !error && data?.programs && data.programs.length === 0 && (
                <Card className="p-12 text-center">
                  <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Programs Found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any programs matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </Card>
              )}

              {/* Pagination */}
              {!isLoading && !error && data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}

                    {data.totalPages > 5 && (
                      <>
                        <span className="px-2">...</span>
                        <Button
                          variant={currentPage === data.totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(data.totalPages)}
                        >
                          {data.totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(data.totalPages, prev + 1))}
                    disabled={currentPage === data.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}

              {/* Guest CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-12"
              >
                <Card className="p-8 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-dashed border-primary/20">
                  <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Ready to Start Your Journey?</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Create an account to apply for programs, save favorites, and get personalized recommendations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={() => navigate("/register")}>
                      Create Account
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate("/guest/consultation")}>
                      Get Free Consultation
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}








