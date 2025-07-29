"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePrograms } from "@/hooks/usePrograms"
import { useTranslation } from "@/i18n"
import { useIsMobile } from "@/hooks/use-mobile"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function GuestProgramView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { fetchProgramById, loading, error } = usePrograms()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [program, setProgram] = useState<any>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock gallery images - in real app, these would come from the program data
  const mockGalleryImages = [
    "/placeholder.svg?height=400&width=600&text=Campus+Main+Building",
    "/placeholder.svg?height=400&width=600&text=Modern+Library",
    "/placeholder.svg?height=400&width=600&text=Student+Lounge",
    "/placeholder.svg?height=400&width=600&text=Lecture+Hall",
    "/placeholder.svg?height=400&width=600&text=Computer+Lab",
    "/placeholder.svg?height=400&width=600&text=Cafeteria",
  ]

  // Mock similar programs - in real app, these would be fetched based on the current program
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

  const handleBack = () => {
    navigate("/guest/programs")
  }

  const handleApply = () => {
    // Show sign-up prompt for guests
    navigate("/register", {
      state: {
        returnTo: `/programs/${id}`,
        message: "Please create an account to apply for programs",
      },
    })
  }

  const toggleFavorite = () => {
    // For guests, show sign-up prompt
    navigate("/register", {
      state: {
        returnTo: `/programs/${id}`,
        message: "Please create an account to save favorites",
      },
    })
  }

  const handleShare = async () => {
    if (navigator.share && program) {
      try {
        await navigator.share({
          title: program.name,
          text: `Check out this ${program.level} program in ${program.field} at ${program.university}`,
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href)
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
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
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
              {t.common.back}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-20">
          <div className={cn("max-w-7xl mx-auto py-4", isMobile ? "px-4" : "px-6")}>
            {/* Header */}
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t.common.back}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFavorite}
                      className={cn("flex items-center gap-2", isFavorited && "bg-red-50 border-red-200 text-red-600")}
                    >
                      <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn("max-w-7xl mx-auto py-8", isMobile ? "px-4" : "px-6")}>
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Program Header Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl md:text-3xl font-bold mb-2">{program.name}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-blue-100">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{program.university}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{program.country}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        <span>{program.level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold mb-1">{formatCurrency(program.tuition_fee)}</div>
                    <div className="text-blue-100 text-sm">Annual Tuition</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Key Info Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {program.language}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {program.duration}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {program.field}
                  </Badge>
                  {program.scholarship_available && (
                    <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
                      <Award className="h-3 w-3" />
                      Scholarship Available
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">{program.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {program.requirements && program.requirements.length > 0 ? (
                      program.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{req}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground">Contact university for specific requirements</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Application Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Application Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Application Deadline</h4>
                    <p className="font-medium">
                      {program.application_deadline
                        ? new Date(program.application_deadline).toLocaleDateString()
                        : "Contact university"}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Intake Periods</h4>
                    <div className="flex flex-wrap gap-1">
                      {program.intake_periods && program.intake_periods.length > 0 ? (
                        program.intake_periods.map((period: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {period}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Contact university for intake information</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Guest Application Prompt */}
            <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
              <CardContent className="p-6 text-center">
                <div className="max-w-md mx-auto">
                  <Info className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t.programs.guestApply.title}</h3>
                  <p className="text-muted-foreground mb-4">{t.programs.guestApply.description}</p>
                  <Button onClick={handleApply} size="lg" className="w-full">
                    {t.programs.guestApply.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}






