"use client"

import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { usePrograms, type ProgramsQueryParams } from "@/hooks/usePrograms"
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
import { useTranslation } from "@/i18n"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function GuestPrograms() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [compareList, setCompareList] = useState<string[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState({
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

  // Search and filter state (legacy for compatibility)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [selectedField, setSelectedField] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [maxBudget, setMaxBudget] = useState<number | undefined>(undefined)
  const [withScholarship, setWithScholarship] = useState(false)

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
    ],
    levels: ["Bachelor", "Master", "PhD", "Certificate", "Diploma"],
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
    ],
    languages: ["English", "French", "German", "Spanish", "Italian", "Dutch", "Portuguese", "Swedish", "Norwegian"],
    universityTypes: ["Public", "Private", "Research University", "Applied Sciences"],
    studyModes: ["Full-time", "Part-time", "Online", "Hybrid"],
  }

  const handleAdvancedFiltersChange = (newFilters: typeof advancedFilters) => {
    setAdvancedFilters(newFilters)
    setCurrentPage(1)
  }

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
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

  // Comparison functions
  const addToCompare = (programId: string) => {
    if (compareList.length >= 3) {
      toast({
        title: t("programs.compare.title"),
        description: t("programs.compare.limit"),
        variant: "destructive",
      })
      return
    }

    if (!compareList.includes(programId)) {
      setCompareList([...compareList, programId])
      toast({
        title: t("programs.compare.addToCompare"),
        description: "Program added to comparison list.",
      })
    }
  }

  const removeFromCompare = (programId: string) => {
    setCompareList(compareList.filter((id) => id !== programId))
    toast({
      title: t("programs.compare.removeFromCompare"),
      description: "Program removed from comparison list.",
    })
  }

  const clearCompareList = () => {
    setCompareList([])
  }

  // Build query parameters
  const queryParams: ProgramsQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: isMobile ? 6 : 12,
      search: advancedFilters.search || searchQuery || undefined,
      country: advancedFilters.countries.length > 0 ? advancedFilters.countries[0] : selectedCountry || undefined,
      level: (advancedFilters.levels.length > 0 ? advancedFilters.levels[0] : selectedLevel) || undefined,
      field: advancedFilters.fields.length > 0 ? advancedFilters.fields[0] : selectedField || undefined,
      language: advancedFilters.languages.length > 0 ? advancedFilters.languages[0] : selectedLanguage || undefined,
      maxBudget: advancedFilters.budgetRange[1] < 100000 ? advancedFilters.budgetRange[1] : maxBudget || undefined,
      withScholarship: advancedFilters.withScholarship || withScholarship || undefined,
    }),
    [
      currentPage,
      searchQuery,
      selectedCountry,
      selectedLevel,
      selectedField,
      selectedLanguage,
      maxBudget,
      withScholarship,
      advancedFilters,
      isMobile,
    ],
  )

  const { data, isLoading, error } = usePrograms(queryParams)

  const ProgramCardComponent = isMobile ? MobileProgramCard : ModernProgramCard

  const handleViewDetails = (program: any) => {
    navigate(`/guest/programs/${program.id}`)
  }

  const handleApply = (program: any) => {
    toast({
      title: t("programs.signUpRequired.title"),
      description: t("programs.signUpRequired.description"),
      action: (
        <Button variant="outline" size="sm" onClick={() => navigate("/register")}>
          {t("programs.signUpRequired.action")}
        </Button>
      ),
    })
  }

  const renderPagination = () => {
    if (!data || data.totalPages <= 1) return null

    const { currentPage, totalPages } = data
    const maxVisiblePages = isMobile ? 3 : 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="bg-white/80 dark:bg-slate-800/80"
        >
          <ChevronLeft className="h-4 w-4" />
          {!isMobile && t("programs.pagination.previous")}
        </Button>

        <div className="flex gap-1">
          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                className="bg-white/80 dark:bg-slate-800/80"
              >
                1
              </Button>
              {startPage > 2 && <span className="px-2 py-1 text-sm">...</span>}
            </>
          )}

          {pages.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? "" : "bg-white/80 dark:bg-slate-800/80"}
            >
              {page}
            </Button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 py-1 text-sm">...</span>}
              <Button
                variant="outline"
                size="sm"
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
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="bg-white/80 dark:bg-slate-800/80"
        >
          {!isMobile && t("programs.pagination.next")}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className={cn("relative z-10", isMobile ? "p-2" : "p-6")}>
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1
                  className={cn(
                    "font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent",
                    isMobile ? "text-2xl" : "text-4xl",
                  )}
                >
                  {t("programs.title")}
                </h1>
              </div>
              <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-sm" : "text-lg")}>
                {t("programs.subtitle")}
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
              <CardContent className={isMobile ? "p-4" : "p-6"}>
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4" />
                      <Input
                        placeholder={t("programs.searchPlaceholder")}
                        value={advancedFilters.search || searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setAdvancedFilters((prev) => ({ ...prev, search: e.target.value }))
                        }}
                        className="pl-10 bg-white dark:bg-slate-700 border-2 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* Quick Filters - Desktop */}
                  {!isMobile && (
                    <div className="flex gap-2 flex-wrap">
                      <Select
                        value={selectedCountry || "all"}
                        onValueChange={(value) => setSelectedCountry(value === "all" ? "" : value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder={t("programs.filters.country")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("programs.filters.allCountries")}</SelectItem>
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
                          <SelectValue placeholder={t("programs.filters.level")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("programs.filters.allLevels")}</SelectItem>
                          {availableOptions.levels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="gap-2"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        {t("programs.filters.advancedFilters")}
                      </Button>
                    </div>
                  )}

                  {/* Mobile Filter Button */}
                  {isMobile && (
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full gap-2">
                      <Filter className="h-4 w-4" />
                      {t("programs.filters.advancedFilters")}
                    </Button>
                  )}
                </div>

                {/* Active Filters */}
                {(selectedCountry ||
                  selectedLevel ||
                  selectedField ||
                  withScholarship ||
                  advancedFilters.countries.length > 0 ||
                  advancedFilters.levels.length > 0 ||
                  advancedFilters.fields.length > 0 ||
                  advancedFilters.withScholarship ||
                  advancedFilters.withReligiousFacilities ||
                  advancedFilters.withHalalFood) && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    {selectedCountry && (
                      <Badge variant="secondary" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedCountry}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCountry("")} />
                      </Badge>
                    )}
                    {selectedLevel && (
                      <Badge variant="secondary" className="gap-1">
                        <GraduationCap className="h-3 w-3" />
                        {selectedLevel}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLevel("")} />
                      </Badge>
                    )}
                    {advancedFilters.countries.map((country) => (
                      <Badge key={country} variant="secondary" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        {country}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              countries: prev.countries.filter((c) => c !== country),
                            }))
                          }
                        />
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" onClick={clearAdvancedFilters} className="h-6 px-2 text-xs">
                      {t("programs.filters.clearFilters")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {showAdvancedFilters && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Advanced filters will be available soon.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Mobile Filters */}
          {isMobile && showFilters && (
            <MobileFilters
              selectedCountry={selectedCountry}
              selectedLevel={selectedLevel}
              selectedField={selectedField}
              selectedLanguage={selectedLanguage}
              maxBudget={maxBudget}
              withScholarship={withScholarship}
              onCountryChange={setSelectedCountry}
              onLevelChange={setSelectedLevel}
              onFieldChange={setSelectedField}
              onLanguageChange={setSelectedLanguage}
              onBudgetChange={setMaxBudget}
              onScholarshipChange={setWithScholarship}
              onClose={() => setShowFilters(false)}
              availableOptions={availableOptions}
            />
          )}

          {/* Compare Button */}
          {compareList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 right-4 z-50"
            >
              <Button
                onClick={() => setShowCompareModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg gap-2"
                size="lg"
              >
                <GitCompare className="h-5 w-5" />
                {t("programs.compare.compareSelected")} ({compareList.length})
              </Button>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <div className="text-center text-slate-600 dark:text-slate-400">{t("programs.loading")}</div>
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? isMobile
                      ? "grid-cols-1"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1",
                )}
              >
                {Array.from({ length: isMobile ? 6 : 8 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 dark:text-red-400 mb-4">{t("programs.error")}</div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          )}

          {/* Programs Grid */}
          {!isLoading && !error && data && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {data.programs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-slate-600 dark:text-slate-400 mb-4">{t("programs.noResults")}</div>
                  <Button onClick={clearAdvancedFilters} variant="outline">
                    {t("programs.filters.clearFilters")}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {data.totalCount} programs found
                    </div>
                  </div>
                  <div
                    className={cn(
                      "grid gap-6",
                      viewMode === "grid"
                        ? isMobile
                          ? "grid-cols-1"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1",
                    )}
                  >
                    {data.programs.map((program, index) => (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ProgramCardComponent
                          program={{
                            ...program,
                            location: `${program.city}, ${program.country}`,
                            duration: `${program.duration_months} months`,
                          }}
                          onViewDetails={() => handleViewDetails(program)}
                          onApply={() => handleApply(program)}
                          viewMode={viewMode}
                        />
                        />
                      </motion.div>
                    ))}
                  </div>
                  {renderPagination()}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Compare Programs Modal */}
      <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              {t("programs.compare.title")}
            </DialogTitle>
          </DialogHeader>
          <ComparePrograms
            programIds={compareList}
            onRemove={removeFromCompare}
            onClear={clearCompareList}
            onClose={() => setShowCompareModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}