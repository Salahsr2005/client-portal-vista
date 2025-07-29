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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
  ArrowLeft,
  MapPin,
  Clock,
  BookOpen,
  Share2,
  Heart,
  Award,
  Globe,
  CheckCircle,
  AlertCircle,
  Building2,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Users,
  CircleDollarSign,
  Languages,
  Check,
  FileCheck,
  CalendarDays,
  Sparkles,
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
  success_rate?: number
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
  academic_requirements?: string
  language_test_exemptions?: string
  housing_availability?: string
  housing_cost_min?: number
  housing_cost_max?: number
  north_african_community_size?: string
  visa_fee?: number
  scholarship_details?: string
  scholarship_amount?: number
  scholarship_deadline?: string
  application_process?: string
  available_places?: number
  total_places?: number
  internship_opportunities?: boolean
  exchange_opportunities?: boolean
}

export default function GuestProgramView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const [program, setProgram] = useState<ProgramData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogContent, setDialogContent] = useState("requirements")
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
      fetchProgramDetails()
    }
  }, [id])

  const fetchProgramDetails = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase.from("programs").select("*").eq("id", id).single()

      if (fetchError) {
        throw fetchError
      }

      if (data) {
        setProgram(data)
      }
    } catch (err) {
      console.error("Error fetching program details:", err)
      setError("Failed to load program details. Please try again.")
    } finally {
      setLoading(false)
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

  const openDialog = (content: string) => {
    setDialogContent(content)
    setShowDialog(true)
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
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-64 sm:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          <div className="max-w-6xl mx-auto">
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
  const programImage = program.image_url || "/placeholder.svg?height=400&width=800&text=University+Campus"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
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

          {/* Hero Image */}
          <div className="relative h-48 sm:h-64 lg:h-80 w-full rounded-lg overflow-hidden mb-6">
            <img src={programImage || "/placeholder.svg"} alt={program.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 sm:p-6">
              <div className="text-white w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="bg-primary text-primary-foreground">{programLevel}</Badge>
                  {program.ranking && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-3 h-3 mr-1 fill-current" />#{program.ranking}
                    </Badge>
                  )}
                  {program.scholarship_available && (
                    <Badge className="bg-green-500 text-white">
                      <Award className="w-3 h-3 mr-1" />
                      Scholarship
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{program.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span className="text-sm sm:text-base">{program.university}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm sm:text-base">{programLocation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader className="border-b">
                <div className="flex flex-wrap justify-between gap-2 items-start">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">{program.name}</CardTitle>
                    <div className="flex items-center mt-1 text-muted-foreground">
                      <Building2 className="h-4 w-4 mr-1" />
                      {program.university}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-sm">{programLocation}</span>
                  </div>
                  <div className="flex items-center">
                    <Languages className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-sm">{programLanguage}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-sm">{program.duration || `${program.duration_months || "N/A"} months`}</span>
                  </div>
                  <div className="flex items-center">
                    <CircleDollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-sm">
                      {tuitionMax > tuitionFee
                        ? `${formatCurrency(tuitionFee)} - ${formatCurrency(tuitionMax)}`
                        : formatCurrency(tuitionFee)}
                    </span>
                  </div>
                </div>

                {/* Program description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Program Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {program.description ||
                      "Detailed program description will be available soon. Contact the university for more information about this program."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {program.scholarship_available && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                      <Award className="h-3.5 w-3.5 mr-1" /> Scholarship Available
                    </Badge>
                  )}
                  {program.internship_opportunities && (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400"
                    >
                      <BookOpen className="h-3.5 w-3.5 mr-1" /> Internship Opportunities
                    </Badge>
                  )}
                  {program.exchange_opportunities && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                    >
                      <Globe className="h-3.5 w-3.5 mr-1" /> Exchange Opportunities
                    </Badge>
                  )}
                  {program.religious_facilities && (
                    <Badge variant="outline">
                      <Heart className="h-3.5 w-3.5 mr-1" /> Religious Facilities
                    </Badge>
                  )}
                  {program.halal_food_availability && (
                    <Badge variant="outline">
                      <Check className="h-3.5 w-3.5 mr-1" /> Halal Food Options
                    </Badge>
                  )}
                </div>

                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="details" className="text-xs sm:text-sm">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="requirements" className="text-xs sm:text-sm">
                      Requirements
                    </TabsTrigger>
                    <TabsTrigger value="costs" className="text-xs sm:text-sm">
                      Costs
                    </TabsTrigger>
                    <TabsTrigger value="housing" className="text-xs sm:text-sm">
                      Housing
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Field of Study</h4>
                        <p className="text-sm text-muted-foreground">{program.field || "Not specified"}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Program Advantages</h4>
                        <p className="text-sm text-muted-foreground">{program.advantages || "Details not provided."}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Application Process</h4>
                        <p className="text-sm text-muted-foreground">
                          {program.application_process ||
                            "Contact an advisor for detailed application process information."}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="requirements" className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Academic Requirements</h4>
                        <p className="text-sm text-muted-foreground">
                          {program.academic_requirements ||
                            program.admission_requirements ||
                            "Standard academic requirements apply."}
                        </p>
                        {program.gpa_requirement && (
                          <div className="mt-2 flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Minimum GPA: {program.gpa_requirement}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Language Requirements</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {program.language_test &&
                              `${program.language_test}: ${program.language_test_score || "Score requirements vary"}`}
                          </p>
                          {program.language_test_exemptions && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Exemptions:</span> {program.language_test_exemptions}
                            </p>
                          )}
                        </div>
                      </div>

                      {requirements.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Additional Requirements</h4>
                          <ul className="space-y-1">
                            {requirements.map((req: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="costs" className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Tuition Fees</h4>
                        <p className="text-sm text-muted-foreground">
                          {tuitionMax > tuitionFee
                            ? `${formatCurrency(tuitionFee)} - ${formatCurrency(tuitionMax)} per year`
                            : `${formatCurrency(tuitionFee)} per year`}
                        </p>
                      </div>

                      {program.living_cost_min && program.living_cost_max && (
                        <div>
                          <h4 className="font-medium mb-2">Living Costs</h4>
                          <p className="text-sm text-muted-foreground">
                            Estimated monthly living expenses: {formatCurrency(program.living_cost_min)} -{" "}
                            {formatCurrency(program.living_cost_max)}
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium mb-2">Additional Fees</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Application Fee:</span>{" "}
                            {program.application_fee ? formatCurrency(program.application_fee) : "N/A"}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Visa Fee:</span>{" "}
                            {program.visa_fee ? formatCurrency(program.visa_fee) : "Varies by nationality"}
                          </p>
                        </div>
                      </div>

                      {program.scholarship_available && (
                        <div>
                          <h4 className="font-medium mb-2">Scholarship Information</h4>
                          <p className="text-sm text-muted-foreground">
                            {program.scholarship_details ||
                              "Scholarships available based on academic merit and financial need."}
                          </p>
                          {program.scholarship_amount && (
                            <p className="text-sm font-medium mt-1">
                              Up to {formatCurrency(program.scholarship_amount)} available
                            </p>
                          )}
                          {program.scholarship_deadline && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Deadline: {program.scholarship_deadline}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="housing" className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Housing Options</h4>
                        <p className="text-sm text-muted-foreground">
                          {program.housing_availability || "Contact the university for housing information."}
                        </p>
                      </div>

                      {program.housing_cost_min && program.housing_cost_max && (
                        <div>
                          <h4 className="font-medium mb-2">Housing Costs</h4>
                          <p className="text-sm text-muted-foreground">
                            Estimated monthly housing costs: {formatCurrency(program.housing_cost_min)} -{" "}
                            {formatCurrency(program.housing_cost_max)}
                          </p>
                        </div>
                      )}

                      {program.north_african_community_size && (
                        <div>
                          <h4 className="font-medium mb-2">Community</h4>
                          <p className="text-sm text-muted-foreground">
                            North African community size: {program.north_african_community_size}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-2">
                        {program.religious_facilities && (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400"
                          >
                            Religious Facilities Available
                          </Badge>
                        )}
                        {program.halal_food_availability && (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                          >
                            Halal Food Options
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Application</CardTitle>
                <div className="text-sm text-muted-foreground">Key information about applying</div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Deadline</h3>
                    <div className="flex items-center text-base">
                      <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        {program.application_deadline
                          ? new Date(program.application_deadline).toLocaleDateString()
                          : "Contact for details"}
                      </span>
                    </div>
                  </div>

                  {program.available_places !== null && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Available Places</h3>
                      <div className="flex items-center text-base">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        <span>
                          {program.available_places} / {program.total_places || "∞"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Application Fee</h3>
                    <div className="flex items-center text-base">
                      <CircleDollarSign className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        {program.application_fee ? formatCurrency(program.application_fee) : "Contact for details"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">Required Documents</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                        <span className="text-sm">Academic transcripts</span>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                        <span className="text-sm">Language proficiency test results</span>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                        <span className="text-sm">Passport copy</span>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                        <span className="text-sm">Motivation letter</span>
                      </li>
                    </ul>

                    <Button
                      variant="outline"
                      className="w-full mt-4 bg-transparent"
                      onClick={() => openDialog("requirements")}
                    >
                      View All Requirements
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium mb-1">Our Services</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                        <span>Application preparation</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                        <span>Document verification</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                        <span>Visa guidance</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                        <span>Pre-departure orientation</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => navigate("/guest/services")}
                    >
                      View Our Services
                    </Button>
                  </div>
                </div>
              </CardContent>
              <div className="p-6 pt-0 flex flex-col gap-2">
                <Button className="w-full" onClick={handleApply}>
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => navigate("/guest/consultation")}
                >
                  Get Consultation
                </Button>
                <Button variant={isFavorited ? "secondary" : "outline"} className="w-full" onClick={toggleFavorite}>
                  <Heart className={`mr-2 h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                  {isFavorited ? "Saved to Favorites" : "Save to Favorites"}
                </Button>

                <Button variant="outline" className="w-full bg-transparent" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Program
                </Button>
              </div>
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

            {/* Guest Application Prompt */}
            <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
              <CardContent className="p-6 text-center">
                <div className="max-w-md mx-auto">
                  <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Apply?</h3>
                  <p className="text-muted-foreground mb-4">
                    Create an account to start your application process and track your progress.
                  </p>
                  <Button onClick={handleApply} size="lg" className="w-full">
                    Create Account & Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog for detailed content */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dialogContent === "requirements" ? "Application Requirements" : "University Details"}
              </DialogTitle>
              <div className="text-sm text-muted-foreground">
                {program.name} at {program.university}
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {dialogContent === "requirements" && (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Academic Requirements</h3>
                    <p className="text-sm text-muted-foreground">
                      {program.academic_requirements ||
                        program.admission_requirements ||
                        "Standard academic requirements apply."}
                    </p>

                    {program.gpa_requirement && (
                      <div className="mt-2">
                        <h4 className="font-medium">Minimum GPA</h4>
                        <p>{program.gpa_requirement}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Language Requirements</h3>
                    <p>Required test: {program.language_test || "Not specified"}</p>
                    {program.language_test_score && <p>Minimum score: {program.language_test_score}</p>}

                    {program.language_test_exemptions && (
                      <div className="mt-2">
                        <h4 className="font-medium">Exemptions</h4>
                        <p>{program.language_test_exemptions}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Required Documents</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                        <div>
                          <span className="font-medium">Academic transcripts</span>
                          <p className="text-sm text-muted-foreground">
                            Official transcripts from all previously attended institutions
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                        <div>
                          <span className="font-medium">Language proficiency proof</span>
                          <p className="text-sm text-muted-foreground">IELTS, TOEFL, or equivalent as specified</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                        <div>
                          <span className="font-medium">Passport copy</span>
                          <p className="text-sm text-muted-foreground">
                            Valid for at least 6 months beyond program end date
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                        <div>
                          <span className="font-medium">Motivation letter</span>
                          <p className="text-sm text-muted-foreground">
                            Statement explaining your interest in the program
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                        <div>
                          <span className="font-medium">Recommendation letters</span>
                          <p className="text-sm text-muted-foreground">
                            2-3 letters from academic or professional references
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                        <div>
                          <span className="font-medium">Curriculum Vitae/Resume</span>
                          <p className="text-sm text-muted-foreground">Detailed academic and professional history</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                        <div>
                          <span className="font-medium">Financial documents</span>
                          <p className="text-sm text-muted-foreground">Proof of ability to fund your studies</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Application Process</h3>
                    <p>
                      {program.application_process ||
                        "Detailed application process information will be provided during consultation."}
                    </p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
    </div>
  )
}








