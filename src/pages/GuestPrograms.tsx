"use client"

import { useState, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X, MapPin, Clock, DollarSign, BookOpen, Globe, Award, TrendingUp } from "lucide-react"
import { GuestModeWrapper } from "@/components/layout/GuestModeWrapper"
import { usePrograms } from "@/hooks/usePrograms"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useNavigate } from "react-router-dom"
import { useDebounce } from "@/hooks/useDebounce"

interface Program {
  id: string
  name: string
  university: string
  country: string
  level: string
  field: string
  language: string
  tuition_fee: number
  duration: string
  description: string
  requirements: string[]
  scholarship_available: boolean
  application_deadline: string
  ranking: number
  image_url?: string
}

const ITEMS_PER_PAGE = 12

export default function GuestPrograms() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { programs, loading, error } = usePrograms()

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedField, setSelectedField] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [budgetRange, setBudgetRange] = useState([0, 50000])
  const [scholarshipOnly, setScholarshipOnly] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Get unique filter options
  const filterOptions = useMemo(() => {
    if (!programs) return { countries: [], levels: [], fields: [], languages: [] }

    return {
      countries: [...new Set(programs.map((p) => p.country))].sort(),
      levels: [...new Set(programs.map((p) => p.level))].sort(),
      fields: [...new Set(programs.map((p) => p.field))].sort(),
      languages: [...new Set(programs.map((p) => p.language))].sort(),
    }
  }, [programs])

  // Filter and sort programs
  const filteredPrograms = useMemo(() => {
    if (!programs) return []

    const filtered = programs.filter((program) => {
      const matchesSearch =
        !debouncedSearchTerm ||
        program.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        program.university.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        program.field.toLowerCase().includes(debouncedSearchTerm.toLowerCase())

      const matchesCountry = selectedCountry === "all" || program.country === selectedCountry
      const matchesLevel = selectedLevel === "all" || program.level === selectedLevel
      const matchesField = selectedField === "all" || program.field === selectedField
      const matchesLanguage = selectedLanguage === "all" || program.language === selectedLanguage
      const matchesBudget = program.tuition_fee >= budgetRange[0] && program.tuition_fee <= budgetRange[1]
      const matchesScholarship = !scholarshipOnly || program.scholarship_available

      return (
        matchesSearch &&
        matchesCountry &&
        matchesLevel &&
        matchesField &&
        matchesLanguage &&
        matchesBudget &&
        matchesScholarship
      )
    })

    // Sort programs
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "tuitionLow":
        filtered.sort((a, b) => a.tuition_fee - b.tuition_fee)
        break
      case "tuitionHigh":
        filtered.sort((a, b) => b.tuition_fee - a.tuition_fee)
        break
      case "ranking":
        filtered.sort((a, b) => (a.ranking || 999) - (b.ranking || 999))
        break
      default:
        // Keep original order for relevance
        break
    }

    return filtered
  }, [
    programs,
    debouncedSearchTerm,
    selectedCountry,
    selectedLevel,
    selectedField,
    selectedLanguage,
    budgetRange,
    scholarshipOnly,
    sortBy,
  ])

  // Pagination
  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE)
  const paginatedPrograms = filteredPrograms.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Active filters count
  const activeFiltersCount = [
    selectedCountry !== "all",
    selectedLevel !== "all",
    selectedField !== "all",
    selectedLanguage !== "all",
    budgetRange[0] > 0 || budgetRange[1] < 50000,
    scholarshipOnly,
  ].filter(Boolean).length

  const clearAllFilters = () => {
    setSelectedCountry("all")
    setSelectedLevel("all")
    setSelectedField("all")
    setSelectedLanguage("all")
    setBudgetRange([0, 50000])
    setScholarshipOnly(false)
    setCurrentPage(1)
  }

  const handleProgramClick = (programId: string) => {
    navigate(`/guest/programs/${programId}`)
  }

  const handleSignUp = () => {
    navigate("/register")
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [
    debouncedSearchTerm,
    selectedCountry,
    selectedLevel,
    selectedField,
    selectedLanguage,
    budgetRange,
    scholarshipOnly,
    sortBy,
  ])

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">{t("programs.filters.country")}</h3>
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger>
            <SelectValue placeholder={t("programs.filters.allCountries")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("programs.filters.allCountries")}</SelectItem>
            {filterOptions.countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">{t("programs.filters.level")}</h3>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger>
            <SelectValue placeholder={t("programs.filters.allLevels")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("programs.filters.allLevels")}</SelectItem>
            {filterOptions.levels.map((level) => (
              <SelectItem key={level} value={level}>
                {t(`programs.levels.${level.toLowerCase()}`, level)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">{t("programs.filters.field")}</h3>
        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger>
            <SelectValue placeholder={t("programs.filters.allFields")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("programs.filters.allFields")}</SelectItem>
            {filterOptions.fields.map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">{t("programs.filters.language")}</h3>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger>
            <SelectValue placeholder={t("programs.filters.allLanguages")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("programs.filters.allLanguages")}</SelectItem>
            {filterOptions.languages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">{t("programs.filters.budget")}</h3>
        <div className="px-2">
          <Slider
            value={budgetRange}
            onValueChange={setBudgetRange}
            max={50000}
            min={0}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${budgetRange[0].toLocaleString()}</span>
            <span>${budgetRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="scholarship" className="font-semibold">
          {t("programs.filters.withScholarship")}
        </label>
        <Switch id="scholarship" checked={scholarshipOnly} onCheckedChange={setScholarshipOnly} />
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full bg-transparent">
          {t("programs.filters.clear")}
        </Button>
      )}
    </div>
  )

  const ProgramCard = ({ program }: { program: Program }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="h-full cursor-pointer group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
        onClick={() => handleProgramClick(program.id)}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
            {program.image_url && (
              <img
                src={program.image_url || "/placeholder.svg"}
                alt={program.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute top-4 right-4 flex gap-2">
              {program.scholarship_available && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <Award className="w-3 h-3 mr-1" />
                  Scholarship
                </Badge>
              )}
              {program.ranking && program.ranking <= 100 && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Top {program.ranking}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                {program.name}
              </h3>
              <p className="text-muted-foreground font-medium">{program.university}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {program.country}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {program.duration}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="font-medium">
                {t(`programs.levels.${program.level.toLowerCase()}`, program.level)}
              </Badge>
              <div className="flex items-center gap-1 font-bold text-lg">
                <DollarSign className="w-4 h-4" />
                {program.tuition_fee.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{program.language}</span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (error) {
    return (
      <GuestModeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">{t("programs.error.title")}</h2>
              <p className="text-muted-foreground">{t("programs.error.message")}</p>
            </div>
          </div>
        </div>
      </GuestModeWrapper>
    )
  }

  return (
    <GuestModeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                {t("programs.hero.badge")}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("programs.hero.title")}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("programs.hero.subtitle")}</p>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {t("programs.hero.stats.programs", { count: programs?.length || 0 })}
                  </div>
                  <div className="text-muted-foreground">Available Programs</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {t("programs.hero.stats.countries", { count: filterOptions.countries.length })}
                  </div>
                  <div className="text-muted-foreground">Countries</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-pink-600 mb-2">
                    <Award className="w-8 h-8 inline-block mr-2" />
                  </div>
                  <div className="text-muted-foreground">{t("programs.hero.stats.scholarships")}</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 border-b bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t("programs.search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">{t("programs.sort.relevance")}</SelectItem>
                  <SelectItem value="name">{t("programs.sort.name")}</SelectItem>
                  <SelectItem value="tuitionLow">{t("programs.sort.tuitionLow")}</SelectItem>
                  <SelectItem value="tuitionHigh">{t("programs.sort.tuitionHigh")}</SelectItem>
                  <SelectItem value="ranking">{t("programs.sort.ranking")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden bg-white dark:bg-gray-800">
                    <Filter className="w-4 h-4 mr-2" />
                    {t("programs.filters.title")}
                    {activeFiltersCount > 0 && <Badge className="ml-2 bg-blue-500">{activeFiltersCount}</Badge>}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>{t("programs.filters.title")}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-sm font-medium">{t("programs.filters.active")}:</span>
                {selectedCountry !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCountry}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCountry("all")} />
                  </Badge>
                )}
                {selectedLevel !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {t(`programs.levels.${selectedLevel.toLowerCase()}`, selectedLevel)}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLevel("all")} />
                  </Badge>
                )}
                {selectedField !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedField}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedField("all")} />
                  </Badge>
                )}
                {scholarshipOnly && (
                  <Badge variant="secondary" className="gap-1">
                    {t("programs.filters.withScholarship")}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setScholarshipOnly(false)} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  {t("programs.filters.clear")}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {/* Desktop Filters */}
              <div className="hidden lg:block w-80 shrink-0">
                <Card className="sticky top-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {t("programs.filters.title")}
                      {activeFiltersCount > 0 && <Badge className="bg-blue-500">{activeFiltersCount}</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FilterContent />
                  </CardContent>
                </Card>
              </div>

              {/* Programs Grid */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{t("programs.results.title")}</h2>
                  <p className="text-muted-foreground">
                    {t("programs.results.found", {
                      count: filteredPrograms.length,
                      total: programs?.length || 0,
                    })}
                  </p>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="h-96">
                        <Skeleton className="h-48 w-full rounded-t-lg" />
                        <CardContent className="p-6 space-y-4">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredPrograms.length === 0 ? (
                  <div className="text-center py-16">
                    <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t("programs.empty.title")}</h3>
                    <p className="text-muted-foreground mb-4">{t("programs.empty.message")}</p>
                    {activeFiltersCount > 0 && (
                      <Button onClick={clearAllFilters}>{t("programs.empty.clearFilters")}</Button>
                    )}
                  </div>
                ) : (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      >
                        {paginatedPrograms.map((program) => (
                          <ProgramCard key={program.id} program={program} />
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-12">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          {t("programs.pagination.previous")}
                        </Button>

                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            )
                          })}
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          {t("programs.pagination.next")}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-white"
            >
              <h2 className="text-3xl font-bold mb-4">{t("programs.guestApply.title")}</h2>
              <p className="text-xl mb-8 opacity-90">{t("programs.guestApply.description")}</p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={handleSignUp}>
                {t("programs.guestApply.action")}
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </GuestModeWrapper>
  )
}

