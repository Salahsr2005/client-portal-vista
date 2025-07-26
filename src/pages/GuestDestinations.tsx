"use client"

import { useState, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X, MapPin, Users, Globe, Plane, Star } from "lucide-react"
import { GuestModeWrapper } from "@/components/layout/GuestModeWrapper"
import { useDestinations } from "@/hooks/useDestinations"
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

interface Destination {
  id: string
  name: string
  country: string
  description: string
  cost_of_living: number
  language: string
  visa_requirements: string
  climate: string
  safety_rating: number
  education_quality: number
  job_opportunities: number
  cultural_diversity: number
  image_url?: string
  popular_programs: string[]
  universities_count: number
  international_students: number
  work_permit_available: boolean
  scholarship_opportunities: boolean
}

const ITEMS_PER_PAGE = 12

export default function GuestDestinations() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { destinations, loading, error } = useDestinations()

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedClimate, setSelectedClimate] = useState("all")
  const [costRange, setCostRange] = useState([0, 5000])
  const [workPermitOnly, setWorkPermitOnly] = useState(false)
  const [scholarshipOnly, setScholarshipOnly] = useState(false)
  const [sortBy, setSortBy] = useState("popularity")
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Get unique filter options
  const filterOptions = useMemo(() => {
    if (!destinations) return { languages: [], climates: [] }

    return {
      languages: [...new Set(destinations.map((d) => d.language))].sort(),
      climates: [...new Set(destinations.map((d) => d.climate))].sort(),
    }
  }, [destinations])

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {
    if (!destinations) return []

    const filtered = destinations.filter((destination) => {
      const matchesSearch =
        !debouncedSearchTerm ||
        destination.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        destination.country.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        destination.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())

      const matchesLanguage = selectedLanguage === "all" || destination.language === selectedLanguage
      const matchesClimate = selectedClimate === "all" || destination.climate === selectedClimate
      const matchesCost = destination.cost_of_living >= costRange[0] && destination.cost_of_living <= costRange[1]
      const matchesWorkPermit = !workPermitOnly || destination.work_permit_available
      const matchesScholarship = !scholarshipOnly || destination.scholarship_opportunities

      return (
        matchesSearch && matchesLanguage && matchesClimate && matchesCost && matchesWorkPermit && matchesScholarship
      )
    })

    // Sort destinations
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "costLow":
        filtered.sort((a, b) => a.cost_of_living - b.cost_of_living)
        break
      case "costHigh":
        filtered.sort((a, b) => b.cost_of_living - a.cost_of_living)
        break
      case "safety":
        filtered.sort((a, b) => b.safety_rating - a.safety_rating)
        break
      case "education":
        filtered.sort((a, b) => b.education_quality - a.education_quality)
        break
      default:
        // Keep original order for popularity
        break
    }

    return filtered
  }, [
    destinations,
    debouncedSearchTerm,
    selectedLanguage,
    selectedClimate,
    costRange,
    workPermitOnly,
    scholarshipOnly,
    sortBy,
  ])

  // Pagination
  const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE)
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  // Active filters count
  const activeFiltersCount = [
    selectedLanguage !== "all",
    selectedClimate !== "all",
    costRange[0] > 0 || costRange[1] < 5000,
    workPermitOnly,
    scholarshipOnly,
  ].filter(Boolean).length

  const clearAllFilters = () => {
    setSelectedLanguage("all")
    setSelectedClimate("all")
    setCostRange([0, 5000])
    setWorkPermitOnly(false)
    setScholarshipOnly(false)
    setCurrentPage(1)
  }

  const handleDestinationClick = (destinationId: string) => {
    navigate(`/guest/destinations/${destinationId}`)
  }

  const handleSignUp = () => {
    navigate("/register")
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, selectedLanguage, selectedClimate, costRange, workPermitOnly, scholarshipOnly, sortBy])

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">{t("destinations.filters.language")}</h3>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger>
            <SelectValue placeholder={t("destinations.filters.allLanguages")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("destinations.filters.allLanguages")}</SelectItem>
            {filterOptions.languages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">{t("destinations.filters.climate")}</h3>
        <Select value={selectedClimate} onValueChange={setSelectedClimate}>
          <SelectTrigger>
            <SelectValue placeholder={t("destinations.filters.allClimates")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("destinations.filters.allClimates")}</SelectItem>
            {filterOptions.climates.map((climate) => (
              <SelectItem key={climate} value={climate}>
                {climate}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">{t("destinations.filters.costOfLiving")}</h3>
        <div className="px-2">
          <Slider value={costRange} onValueChange={setCostRange} max={5000} min={0} step={100} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${costRange[0]}</span>
            <span>${costRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="workPermit" className="font-semibold">
          {t("destinations.filters.workPermit")}
        </label>
        <Switch id="workPermit" checked={workPermitOnly} onCheckedChange={setWorkPermitOnly} />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="scholarship" className="font-semibold">
          {t("destinations.filters.scholarships")}
        </label>
        <Switch id="scholarship" checked={scholarshipOnly} onCheckedChange={setScholarshipOnly} />
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full bg-transparent">
          {t("destinations.filters.clear")}
        </Button>
      )}
    </div>
  )

  const DestinationCard = ({ destination }: { destination: Destination }) => (
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
        onClick={() => handleDestinationClick(destination.id)}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="h-48 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 relative">
            {destination.image_url && (
              <img
                src={destination.image_url || "/placeholder.svg"}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute top-4 right-4 flex gap-2">
              {destination.work_permit_available && (
                <Badge className="bg-blue-500 hover:bg-blue-600">
                  <Users className="w-3 h-3 mr-1" />
                  Work Permit
                </Badge>
              )}
              {destination.scholarship_opportunities && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <Star className="w-3 h-3 mr-1" />
                  Scholarships
                </Badge>
              )}
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-1 text-white">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{destination.safety_rating}/5</span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{destination.name}</h3>
              <p className="text-muted-foreground font-medium">{destination.country}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {destination.language}
              </div>
              <div className="flex items-center gap-1">
                <Plane className="w-4 h-4" />
                {destination.climate}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="font-bold text-blue-600">{destination.universities_count}</div>
                <div className="text-muted-foreground">Universities</div>
              </div>
              <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="font-bold text-green-600">${destination.cost_of_living}</div>
                <div className="text-muted-foreground">Monthly Cost</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Education Quality</span>
                <span className="font-semibold">{destination.education_quality}/5</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(destination.education_quality / 5) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{destination.description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (error) {
    return (
      <GuestModeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">{t("destinations.error.title")}</h2>
              <p className="text-muted-foreground">{t("destinations.error.message")}</p>
            </div>
          </div>
        </div>
      </GuestModeWrapper>
    )
  }

  return (
    <GuestModeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-blue-600/10 to-purple-600/10" />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                {t("destinations.hero.badge")}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("destinations.hero.title")}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("destinations.hero.subtitle")}</p>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-green-600 mb-2">{destinations?.length || 0}+</div>
                  <div className="text-muted-foreground">{t("destinations.hero.stats.destinations")}</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-blue-600 mb-2">{filterOptions.languages.length}+</div>
                  <div className="text-muted-foreground">{t("destinations.hero.stats.languages")}</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    <Globe className="w-8 h-8 inline-block mr-2" />
                  </div>
                  <div className="text-muted-foreground">{t("destinations.hero.stats.global")}</div>
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
                  placeholder={t("destinations.search.placeholder")}
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
                  <SelectItem value="popularity">{t("destinations.sort.popularity")}</SelectItem>
                  <SelectItem value="name">{t("destinations.sort.name")}</SelectItem>
                  <SelectItem value="costLow">{t("destinations.sort.costLow")}</SelectItem>
                  <SelectItem value="costHigh">{t("destinations.sort.costHigh")}</SelectItem>
                  <SelectItem value="safety">{t("destinations.sort.safety")}</SelectItem>
                  <SelectItem value="education">{t("destinations.sort.education")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden bg-white dark:bg-gray-800">
                    <Filter className="w-4 h-4 mr-2" />
                    {t("destinations.filters.title")}
                    {activeFiltersCount > 0 && <Badge className="ml-2 bg-blue-500">{activeFiltersCount}</Badge>}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>{t("destinations.filters.title")}</SheetTitle>
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
                <span className="text-sm font-medium">{t("destinations.filters.active")}:</span>
                {selectedLanguage !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedLanguage}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLanguage("all")} />
                  </Badge>
                )}
                {selectedClimate !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedClimate}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedClimate("all")} />
                  </Badge>
                )}
                {workPermitOnly && (
                  <Badge variant="secondary" className="gap-1">
                    {t("destinations.filters.workPermit")}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setWorkPermitOnly(false)} />
                  </Badge>
                )}
                {scholarshipOnly && (
                  <Badge variant="secondary" className="gap-1">
                    {t("destinations.filters.scholarships")}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setScholarshipOnly(false)} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  {t("destinations.filters.clear")}
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
                      {t("destinations.filters.title")}
                      {activeFiltersCount > 0 && <Badge className="bg-blue-500">{activeFiltersCount}</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FilterContent />
                  </CardContent>
                </Card>
              </div>

              {/* Destinations Grid */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{t("destinations.results.title")}</h2>
                  <p className="text-muted-foreground">
                    {t("destinations.results.found", {
                      count: filteredDestinations.length,
                      total: destinations?.length || 0,
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
                ) : filteredDestinations.length === 0 ? (
                  <div className="text-center py-16">
                    <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t("destinations.empty.title")}</h3>
                    <p className="text-muted-foreground mb-4">{t("destinations.empty.message")}</p>
                    {activeFiltersCount > 0 && (
                      <Button onClick={clearAllFilters}>{t("destinations.empty.clearFilters")}</Button>
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
                        {paginatedDestinations.map((destination) => (
                          <DestinationCard key={destination.id} destination={destination} />
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
                          {t("destinations.pagination.previous")}
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
                          {t("destinations.pagination.next")}
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
        <section className="py-16 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-white"
            >
              <h2 className="text-3xl font-bold mb-4">{t("destinations.cta.title")}</h2>
              <p className="text-xl mb-8 opacity-90">{t("destinations.cta.description")}</p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={handleSignUp}>
                {t("destinations.cta.action")}
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </GuestModeWrapper>
  )
}
