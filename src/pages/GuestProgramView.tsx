"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePrograms } from "@/hooks/usePrograms"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  MapPin,
  Clock,
  GraduationCap,
  BookOpen,
  Share2,
  Heart,
  Calendar,
  Award,
  Globe,
  CheckCircle,
  AlertCircle,
  Info,
  Euro,
  Building2,
  FileText,
  ExternalLink,
  Download,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Phone,
  Mail,
  MapPinIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgramData {
  id: string
  name: string
  university: string
  country: string
  city?: string
  location?: string
  description?: string
  study_level?: string
  level?: string
  field?: string
  tuition_min?: number
  tuition_max?: number
  tuition_fee?: number
  living_cost_min?: number
  living_cost_max?: number
  duration?: string
  duration_months?: number
  program_language?: string
  language?: string
  scholarship_available?: boolean
  religious_facilities?: boolean
  halal_food_availability?: boolean
  application_deadline?: string
  requirements?: string[] | string
  intake_periods?: string[] | string
  ranking?: number
  image_url?: string
  status?: string
  application_fee?: number
  advantages?: string
  admission_requirements?: string
  gpa_requirement?: number
  language_test?: string
  language_test_score?: string
  created_at?: string
  updated_at?: string
}

export default function GuestProgramView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { fetchProgramById, loading, error } = usePrograms()
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const [program, setProgram] = useState<ProgramData | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isSharing, setIsSharing] = useState(false)

  // Mock gallery images - in real app, these would come from the program data
  const mockGalleryImages = [
    "/placeholder.svg?height=400&width=600&text=Campus+Main+Building",
    "/placeholder.svg?height=400&width=600&text=Modern+Library",
    "/placeholder.svg?height=400&width=600&text=Student+Lounge",
    "/placeholder.svg?height=400&width=600&text=Lecture+Hall",
    "/placeholder.svg?height=400&width=600&text=Computer+Lab",
    "/placeholder.svg?height=400&width=600&text=Cafeteria",
  ]

  // Mock similar programs
  const mockSimilarPrograms = [
    {
      id: "2",
      name: "MBA in Global Management",
      university: "HEC Paris",
      country: "France",
      tuition_min: 25000,
      tuition_max: 30000,
      match_score: 92,
    },
    {
      id: "3",
      name: "Master in Computer Science",
      university: "Technical University of Munich",
      country: "Germany",
      tuition_min: 0,
      tuition_max: 500,
      match_score: 88,
    },
  ]

  useEffect(() => {
    if (id) {
      loadProgram(id)
    }
  }, [id])

  const loadProgram = async (programId: string) => {
    try {
      const programData = await fetchProgramById(programId)
      setProgram(programData)
    } catch (err) {
      console.error("Error loading program:", err)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const parseJsonField = (field: any, fallback: any = []): any => {
    if (!field) return fallback
    if (typeof field === "string") {
      try {
        return JSON.parse(field)
      } catch {
        return field
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean)
      }
    }
    return Array.isArray(field) ? field : fallback
  }

  const handleBack = () => {
    navigate("/guest/programs")
  }

  const handleApply = () => {
    navigate("/register", {
      state: {
        returnTo: `/programs/${id}`,
        message: "Please create an account to apply for programs",
      },
    })
  }

  const toggleFavorite = () => {
    navigate("/register", {
      state: {
        returnTo: `/programs/${id}`,
        message: "Please create an account to save favorites",
      },
    })
  }

  const handleShare = async () => {
    if (!program) return

    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: program.name,
          text: `Check out this ${program.study_level || program.level} program in ${program.field} at ${program.university}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied",
          description: "Program link has been copied to clipboard",
        })
      }
    } catch (err) {
      console.error("Share failed:", err)
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied",
          description: "Program link has been copied to clipboard",
        })
      } catch (clipboardErr) {
        toast({
          title: "Share Failed",
          description: "Unable to share or copy link",
          variant: "destructive",
        })
      }
    } finally {
      setIsSharing(false)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockGalleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockGalleryImages.length) % mockGalleryImages.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-64 sm:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" onClick={handleBack} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Programs
            </Button>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || "Program not found"}</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  const requirements = parseJsonField(program.requirements, [])
  const intakePeriods = parseJsonField(program.intake_periods, [])
  const tuitionFee = program.tuition_fee || program.tuition_min || 0
  const tuitionMax = program.tuition_max || tuitionFee
  const programLevel = program.study_level || program.level || "Not specified"
  const programLanguage = program.program_language || program.language || "Not specified"
  const programLocation = program.location || `${program.city || "Unknown"}, ${program.country}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Header */}
      <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2 self-start">
              <ArrowLeft className="h-4 w-4" />
              Back to Programs
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFavorite}
                className={cn(
                  "flex items-center gap-2 flex-1 sm:flex-none",
                  isFavorited && "bg-red-50 border-red-200 text-red-600",
                )}
              >
                <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
                {isMobile ? "Save" : "Save Program"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                disabled={isSharing}
                className="flex items-center gap-2 flex-1 sm:flex-none bg-transparent"
              >
                {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                {isMobile ? "Share" : "Share Program"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Hero Section */}
          <Card className="overflow-hidden border-0 shadow-xl">
            {/* Image Gallery */}
            <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
              {program.image_url ? (
                <img
                  src={program.image_url || "/placeholder.svg"}
                  alt={program.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <GraduationCap className="w-16 h-16 sm:w-20 sm:h-20 text-white/60" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm border-0">
                    <MapPin className="w-3 h-3 mr-1" />
                    {program.country}
                  </Badge>
                  {program.ranking && (
                    <Badge className="bg-yellow-500/90 text-white backdrop-blur-sm border-0">
                      <Star className="w-3 h-3 mr-1 fill-current" />#{program.ranking}
                    </Badge>
                  )}
                </div>
                {program.scholarship_available && (
                  <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-0">
                    <Award className="w-3 h-3 mr-1" />
                    Scholarship
                  </Badge>
                )}
              </div>

              {/* Program Title */}
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {program.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm sm:text-base">{program.university}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span className="text-sm sm:text-base">{programLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info Bar */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-bold text-green-600">
                      {tuitionMax > tuitionFee
                        ? `${formatCurrency(tuitionFee)} - ${formatCurrency(tuitionMax)}`
                        : formatCurrency(tuitionFee)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Annual Tuition</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-bold text-blue-600">{programLevel}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Study Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-bold text-purple-600">
                      {program.duration || `${program.duration_months || "N/A"} months`}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-bold text-orange-600">{programLanguage}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Language</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-auto p-1">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="requirements" className="text-xs sm:text-sm py-2">
                    Requirements
                  </TabsTrigger>
                  <TabsTrigger value="application" className="text-xs sm:text-sm py-2">
                    Application
                  </TabsTrigger>
                  <TabsTrigger value="details" className="text-xs sm:text-sm py-2">
                    Details
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="overview" className="space-y-6">
                    {/* Program Description */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          Program Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none dark:prose-invert">
                          <p className="text-muted-foreground leading-relaxed">
                            {program.description ||
                              "Detailed program description will be available soon. Contact the university for more information about this program."}
                          </p>
                        </div>

                        {program.advantages && (
                          <div className="mt-6">
                            <h4 className="font-semibold mb-3">Program Advantages</h4>
                            <div className="prose max-w-none dark:prose-invert">
                              <p className="text-muted-foreground">{program.advantages}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Key Features */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-600" />
                          Key Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <Globe className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">Language</div>
                              <div className="text-sm text-muted-foreground">{programLanguage}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <Clock className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium">Duration</div>
                              <div className="text-sm text-muted-foreground">
                                {program.duration || `${program.duration_months || "N/A"} months`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-purple-600" />
                            <div>
                              <div className="font-medium">Study Level</div>
                              <div className="text-sm text-muted-foreground">{programLevel}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                            <BookOpen className="h-5 w-5 text-orange-600" />
                            <div>
                              <div className="font-medium">Field</div>
                              <div className="text-sm text-muted-foreground">{program.field || "Not specified"}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="requirements" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Admission Requirements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {requirements.length > 0 ? (
                          <ul className="space-y-3">
                            {requirements.map((req: string, index: number) => (
                              <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm sm:text-base">{req}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                              Specific requirements are not listed. Please contact the university directly for detailed
                              admission requirements.
                            </p>
                          </div>
                        )}

                        {program.gpa_requirement && (
                          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <h4 className="font-semibold mb-2">GPA Requirement</h4>
                            <p className="text-sm text-muted-foreground">Minimum GPA: {program.gpa_requirement}</p>
                          </div>
                        )}

                        {program.language_test && (
                          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                            <h4 className="font-semibold mb-2">Language Test Requirement</h4>
                            <p className="text-sm text-muted-foreground">
                              {program.language_test}
                              {program.language_test_score && ` - Minimum Score: ${program.language_test_score}`}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="application" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          Application Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Application Deadline</h4>
                            <p className="font-semibold text-lg">
                              {program.application_deadline
                                ? new Date(program.application_deadline).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "Contact university"}
                            </p>
                          </div>

                          {program.application_fee && (
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-2">Application Fee</h4>
                              <p className="font-semibold text-lg text-green-600">
                                {formatCurrency(program.application_fee)}
                              </p>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-3">Intake Periods</h4>
                          {intakePeriods.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {intakePeriods.map((period: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-sm">
                                  {period}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Contact university for intake information</p>
                          )}
                        </div>

                        <Separator />

                        {/* Guest Application Prompt */}
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border-2 border-dashed border-primary/20">
                          <div className="text-center">
                            <Info className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Ready to Apply?</h3>
                            <p className="text-muted-foreground mb-4">
                              Create an account to start your application process and track your progress.
                            </p>
                            <Button onClick={handleApply} size="lg" className="w-full sm:w-auto">
                              Create Account & Apply
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-gray-600" />
                          University Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">{program.university}</h4>
                          <p className="text-muted-foreground text-sm">Located in {programLocation}</p>
                        </div>

                        {program.ranking && (
                          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                            <Star className="h-5 w-5 text-yellow-600 fill-current" />
                            <div>
                              <div className="font-medium">University Ranking</div>
                              <div className="text-sm text-muted-foreground">#{program.ranking} globally</div>
                            </div>
                          </div>
                        )}

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="font-medium">Campus Facilities</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              {program.religious_facilities ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">Religious Facilities</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {program.halal_food_availability ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">Halal Food Available</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Cost Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Euro className="h-5 w-5 text-green-600" />
                          Cost Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Annual Tuition</span>
                            <span className="font-bold text-green-600">
                              {tuitionMax > tuitionFee
                                ? `${formatCurrency(tuitionFee)} - ${formatCurrency(tuitionMax)}`
                                : formatCurrency(tuitionFee)}
                            </span>
                          </div>

                          {program.living_cost_min && program.living_cost_max && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Monthly Living Costs</span>
                              <span className="font-medium text-blue-600">
                                {formatCurrency(program.living_cost_min)} - {formatCurrency(program.living_cost_max)}
                              </span>
                            </div>
                          )}

                          {program.application_fee && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Application Fee</span>
                              <span className="font-medium text-orange-600">
                                {formatCurrency(program.application_fee)}
                              </span>
                            </div>
                          )}
                        </div>

                        {program.scholarship_available && (
                          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-800 dark:text-green-200">
                                Scholarship Available
                              </span>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              Financial aid opportunities are available for qualified students. Contact the university
                              for more details about scholarship requirements and amounts.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleApply} className="w-full" size="lg">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={toggleFavorite}>
                    <Heart className={cn("h-4 w-4 mr-2", isFavorited && "fill-current text-red-500")} />
                    Save Program
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download Brochure
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    University Website
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Email</div>
                        <div className="text-sm text-muted-foreground">admissions@university.edu</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Phone</div>
                        <div className="text-sm text-muted-foreground">+33 1 23 45 67 89</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Address</div>
                        <div className="text-sm text-muted-foreground">{programLocation}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Programs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Programs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSimilarPrograms.map((similarProgram) => (
                      <div
                        key={similarProgram.id}
                        className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        onClick={() => navigate(`/guest/programs/${similarProgram.id}`)}
                      >
                        <h4 className="font-medium text-sm mb-1">{similarProgram.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{similarProgram.university}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-green-600 font-medium">
                            {formatCurrency(similarProgram.tuition_min)}
                            {similarProgram.tuition_max > similarProgram.tuition_min &&
                              ` - ${formatCurrency(similarProgram.tuition_max)}`}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {similarProgram.match_score}% match
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={mockGalleryImages[currentImageIndex] || "/placeholder.svg"}
                alt={`Campus image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain rounded-lg"
              />

              {/* Navigation */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setShowImageModal(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {mockGalleryImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}







