"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import {
  School,
  MapPin,
  CalendarDays,
  CircleDollarSign,
  GraduationCap,
  BookOpen,
  Clock,
  Globe,
  Home,
  Building,
  Users,
  FileCheck,
  Award,
  Info,
  Languages,
  Heart,
  Check,
  CheckCircle,
  Share2,
  Shield,
  Zap,
  Target,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  MessageCircle,
  Eye,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Library,
  Coffee,
  Music,
  Palette,
  PieChart,
  DollarSign,
  CreditCard,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

interface Program {
  id: string
  name: string
  university: string
  city: string
  country: string
  field: string
  study_level: string
  program_language: string
  duration_months: number
  tuition_min: number
  tuition_max: number
  living_cost_min: number
  living_cost_max: number
  application_fee: number
  visa_fee: number
  description: string
  advantages: string
  academic_requirements: string
  language_test: string
  language_test_score: string
  language_test_exemptions: string
  admission_requirements: string
  application_process: string
  application_deadline: string
  available_places: number
  total_places: number
  scholarship_available: boolean
  scholarship_details: string
  scholarship_amount: number
  scholarship_deadline: string
  internship_opportunities: boolean
  exchange_opportunities: boolean
  religious_facilities: boolean
  halal_food_availability: boolean
  housing_availability: string
  housing_cost_min: number
  housing_cost_max: number
  north_african_community_size: string
  gpa_requirement: number
  image_url: string
  university_ranking: number
  program_rating: number
  employment_rate: number
  created_at: string
  updated_at: string
  ranking: number
  status: string
}

export default function ProgramView() {
  const { programId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()

  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRequirementsDialog, setShowRequirementsDialog] = useState(false)
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [viewCount, setViewCount] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])

  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!programId) return

      try {
        setLoading(true)
        const { data, error } = await supabase.from("programs").select("*").eq("id", programId).single()

        if (error) {
          throw error
        }

        if (data) {
          setProgram(data)

          // Generate gallery images based on program data
          const images = [
            data.image_url || `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(data.university)}`,
            `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(data.name)}`,
            `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(data.university + " Campus")}`,
            `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(data.city + ", " + data.country)}`,
          ]
          setGalleryImages(images)

          // Increment view count
          await incrementViewCount()
        }
      } catch (error) {
        console.error("Error fetching program details:", error)
        toast({
          title: "Error",
          description: "Failed to load program details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProgramDetails()

    if (user) {
      checkFavoriteStatus()
    }
  }, [programId, toast, user])

  const incrementViewCount = async () => {
    if (!programId) return

    try {
      // This would typically update a views table or increment a counter
      // For now, we'll just set a random view count for demo
      setViewCount(Math.floor(Math.random() * 1000) + 100)
    } catch (error) {
      console.error("Error incrementing view count:", error)
    }
  }

  const checkFavoriteStatus = async () => {
    if (!user || !programId) return

    try {
      const { data, error } = await supabase
        .from("favorite_programs")
        .select("id")
        .eq("user_id", user.id)
        .eq("program_id", programId)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking favorite status:", error)
      }

      setIsFavorite(!!data)
    } catch (err) {
      console.error("Error in checkFavoriteStatus:", err)
    }
  }

  const toggleFavorite = async () => {
    if (!user || !programId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorite programs",
        variant: "destructive",
      })
      return
    }

    setFavoriteLoading(true)

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("favorite_programs")
          .delete()
          .eq("user_id", user.id)
          .eq("program_id", programId)

        if (error) throw error

        setIsFavorite(false)
        toast({
          title: "Removed from favorites",
          description: "Program removed from your favorites",
        })
      } else {
        const { error } = await supabase.from("favorite_programs").insert({
          user_id: user.id,
          program_id: programId,
        })

        if (error) throw error

        setIsFavorite(true)
        toast({
          title: "Added to favorites",
          description: "Program added to your favorites",
        })
      }
    } catch (err) {
      console.error("Error toggling favorite:", err)
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    const programTitle = program?.name || "Educational Program"
    const text = `Check out this educational program: ${programTitle}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: programTitle,
          text: text,
          url: url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "Program link copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      try {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "Program link copied to clipboard",
        })
      } catch (err) {
        toast({
          title: "Sharing failed",
          description: "Unable to share this program",
          variant: "destructive",
        })
      }
    }
  }

  const handleApplyClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login or register to apply for programs.",
        variant: "default",
      })
      navigate("/login", { state: { from: `/programs/${programId}` } })
      return
    }

    navigate(`/applications/new?program=${programId}`)
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "Not specified"

    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

        <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
          {/* Hero Section Skeleton */}
          <div className="relative mb-8">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl flex items-end p-8">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-10 w-96" />
                <Skeleton className="h-6 w-64" />
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10"
        >
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Info className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Program Not Found</h2>
              <p className="text-muted-foreground mb-6 text-center">
                The program you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/programs")} className="w-full">
                <ArrowRight className="mr-2 h-4 w-4" />
                View All Programs
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  const programImage = program.image_url || "/placeholder.svg?height=400&width=800&text=University+Campus"
  const completionRate = program.available_places
    ? Math.round(((program.total_places - program.available_places) / program.total_places) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e  dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/programs")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Programs
        </Button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-2xl shadow-2xl"
        >
          <div className="relative h-80 md:h-96">
            <img src={programImage || "/placeholder.svg"} alt={program.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Hero Content */}
            <div className="absolute inset-0 flex items-end p-6 md:p-8">
              <div className="text-white w-full">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-3 py-1">
                    <GraduationCap className="mr-1 h-3 w-3" />
                    {program.study_level}
                  </Badge>

                  {program.ranking && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 px-3 py-1">
                      <Award className="mr-1 h-3 w-3" />
                      Rank #{program.ranking}
                    </Badge>
                  )}

                  <div className="flex items-center gap-1 ml-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                      onClick={toggleFavorite}
                      disabled={favoriteLoading}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                      onClick={handleShare}
                    >
                      <Share2 className="h-5 w-5 text-white" />
                    </Button>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">{program.name}</h1>

                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    <span className="text-lg">{program.university}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {program.city}, {program.country}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{viewCount.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Program Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Quick Stats */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{program.duration_months}</div>
                    <div className="text-sm text-muted-foreground">Months</div>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <CircleDollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(Math.round((program.tuition_min + program.tuition_max) / 2))}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg. Tuition</div>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                    <Languages className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-purple-600">{program.program_language}</div>
                    <div className="text-sm text-muted-foreground">Language</div>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                    <Users className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-amber-600">{program.available_places || "Open"}</div>
                    <div className="text-sm text-muted-foreground">Places Left</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Program Description */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <BookOpen className="mr-3 h-6 w-6 text-primary" />
                  Program Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg mb-6">{program.description}</p>

                {program.advantages && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-3 flex items-center">
                      <Target className="mr-2 h-5 w-5 text-green-600" />
                      Program Advantages
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">{program.advantages}</p>
                  </div>
                )}

                {/* Feature Badges */}
                <div className="flex flex-wrap gap-3">
                  {program.scholarship_available && (
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 px-3 py-1"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Scholarships Available
                    </Badge>
                  )}
                  {program.internship_opportunities && (
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200 px-3 py-1"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Internship Opportunities
                    </Badge>
                  )}
                  {program.exchange_opportunities && (
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200 px-3 py-1"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Exchange Programs
                    </Badge>
                  )}
                  {program.religious_facilities && (
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200 px-3 py-1"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Religious Facilities
                    </Badge>
                  )}
                  {program.halal_food_availability && (
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1"
                    >
                      <Utensils className="h-4 w-4 mr-2" />
                      Halal Food Available
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
                      <TabsTrigger
                        value="overview"
                        className="py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <Info className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Overview</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="requirements"
                        className="py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <FileCheck className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Requirements</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="costs"
                        className="py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Costs</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="housing"
                        className="py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Housing</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6">
                    <TabsContent value="overview" className="mt-0 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg flex items-center">
                            <School className="mr-2 h-5 w-5 text-primary" />
                            Academic Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-muted">
                              <span className="text-muted-foreground">Field of Study</span>
                              <span className="font-medium">{program.field}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-muted">
                              <span className="text-muted-foreground">Study Level</span>
                              <Badge variant="secondary">{program.study_level}</Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-muted">
                              <span className="text-muted-foreground">Duration</span>
                              <span className="font-medium">{program.duration_months} months</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-muted-foreground">Language</span>
                              <span className="font-medium">{program.program_language}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg flex items-center">
                            <MapPin className="mr-2 h-5 w-5 text-primary" />
                            Location & University
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-muted">
                              <span className="text-muted-foreground">University</span>
                              <span className="font-medium text-right">{program.university}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-muted">
                              <span className="text-muted-foreground">City</span>
                              <span className="font-medium">{program.city}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-muted">
                              <span className="text-muted-foreground">Country</span>
                              <span className="font-medium">{program.country}</span>
                            </div>
                            {program.ranking && (
                              <div className="flex justify-between items-center py-2">
                                <span className="text-muted-foreground">University Ranking</span>
                                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
                                  #{program.ranking}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {program.application_process && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-lg mb-3 flex items-center">
                            <Zap className="mr-2 h-5 w-5 text-primary" />
                            Application Process
                          </h4>
                          <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                            {program.application_process}
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="requirements" className="mt-0 space-y-6">
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                          <h4 className="font-semibold text-lg mb-4 flex items-center">
                            <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
                            Academic Requirements
                          </h4>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {program.academic_requirements || program.description}
                          </p>
                          {program.gpa_requirement && (
                            <div className="flex items-center bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                              <span className="font-medium">Minimum GPA: {program.gpa_requirement}</span>
                            </div>
                          )}
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                          <h4 className="font-semibold text-lg mb-4 flex items-center">
                            <Languages className="mr-2 h-5 w-5 text-purple-600" />
                            Language Requirements
                          </h4>
                          <div className="space-y-3">
                            {program.language_test && (
                              <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                <span className="font-medium">Required Test:</span>
                                <Badge variant="outline" className="bg-purple-100 text-purple-700">
                                  {program.language_test}
                                </Badge>
                              </div>
                            )}
                            {program.language_test_score && (
                              <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                <span className="font-medium">Minimum Score:</span>
                                <span className="font-bold text-purple-600">{program.language_test_score}</span>
                              </div>
                            )}
                            {program.language_test_exemptions && (
                              <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                <span className="font-medium text-green-600">Exemptions Available:</span>
                                <p className="text-sm text-muted-foreground mt-1">{program.language_test_exemptions}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                          <h4 className="font-semibold text-lg mb-4 flex items-center">
                            <FileCheck className="mr-2 h-5 w-5 text-green-600" />
                            Required Documents
                          </h4>
                          <div className="space-y-4">
                            {program.admission_requirements && (
                              <div className="text-muted-foreground leading-relaxed">
                                {program.admission_requirements}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="costs" className="mt-0 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl">
                            <h4 className="font-semibold text-lg mb-4 flex items-center">
                              <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                              Tuition Fees
                            </h4>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-blue-600 mb-2">
                                {formatCurrency(program.tuition_min)} - {formatCurrency(program.tuition_max)}
                              </div>
                              <div className="text-sm text-muted-foreground">Per year</div>
                            </div>
                            <div className="mt-4 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                              <div className="flex justify-between text-sm">
                                <span>Average:</span>
                                <span className="font-medium">
                                  {formatCurrency(Math.round((program.tuition_min + program.tuition_max) / 2))}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                            <h4 className="font-semibold text-lg mb-4 flex items-center">
                              <Home className="mr-2 h-5 w-5 text-green-600" />
                              Living Costs
                            </h4>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600 mb-2">
                                {formatCurrency(program.living_cost_min)} - {formatCurrency(program.living_cost_max)}
                              </div>
                              <div className="text-sm text-muted-foreground">Per month</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                            <h4 className="font-semibold text-lg mb-4 flex items-center">
                              <CreditCard className="mr-2 h-5 w-5 text-purple-600" />
                              Additional Fees
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                <span className="text-muted-foreground">Application Fee</span>
                                <span className="font-medium">{formatCurrency(program.application_fee)}</span>
                              </div>
                              <div className="flex justify-between items-center bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                <span className="text-muted-foreground">Visa Fee</span>
                                <span className="font-medium">{formatCurrency(program.visa_fee)}</span>
                              </div>
                            </div>
                          </div>

                          {program.scholarship_available && (
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl">
                              <h4 className="font-semibold text-lg mb-4 flex items-center">
                                <Award className="mr-2 h-5 w-5 text-amber-600" />
                                Scholarships
                              </h4>
                              <div className="space-y-3">
                                {program.scholarship_amount && (
                                  <div className="text-center bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-amber-600">
                                      Up to {formatCurrency(program.scholarship_amount)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Available</div>
                                  </div>
                                )}
                                {program.scholarship_details && (
                                  <p className="text-sm text-muted-foreground">{program.scholarship_details}</p>
                                )}
                                {program.scholarship_deadline && (
                                  <div className="flex items-center text-sm">
                                    <CalendarDays className="h-4 w-4 mr-2 text-amber-600" />
                                    <span>Deadline: {program.scholarship_deadline}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cost Breakdown Chart */}
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 p-6 rounded-xl">
                        <h4 className="font-semibold text-lg mb-4 flex items-center">
                          <PieChart className="mr-2 h-5 w-5 text-gray-600" />
                          Total Cost Breakdown (Annual)
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatCurrency(Math.round((program.tuition_min + program.tuition_max) / 2))}
                            </div>
                            <div className="text-sm text-muted-foreground">Tuition</div>
                          </div>
                          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(
                                Math.round(((program.living_cost_min + program.living_cost_max) / 2) * 12),
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">Living (12 months)</div>
                          </div>
                          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {formatCurrency(
                                Math.round(
                                  (program.tuition_min + program.tuition_max) / 2 +
                                    ((program.living_cost_min + program.living_cost_max) / 2) * 12,
                                ),
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">Total</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="housing" className="mt-0 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                            <h4 className="font-semibold text-lg mb-4 flex items-center">
                              <Home className="mr-2 h-5 w-5 text-blue-600" />
                              Housing Options
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">
                              {program.housing_availability ||
                                "Various housing options are available including dormitories, shared apartments, and private accommodations."}
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                            <h4 className="font-semibold text-lg mb-4 flex items-center">
                              <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                              Housing Costs
                            </h4>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600 mb-2">
                                {formatCurrency(program.housing_cost_min)} - {formatCurrency(program.housing_cost_max)}
                              </div>
                              <div className="text-sm text-muted-foreground">Per month</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {program.north_african_community_size && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                              <h4 className="font-semibold text-lg mb-4 flex items-center">
                                <Users className="mr-2 h-5 w-5 text-purple-600" />
                                Community
                              </h4>
                              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">North African Community</span>
                                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                                    {program.north_african_community_size}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl">
                            <h4 className="font-semibold text-lg mb-4 flex items-center">
                              <Heart className="mr-2 h-5 w-5 text-amber-600" />
                              Cultural Facilities
                            </h4>
                            <div className="space-y-3">
                              {program.religious_facilities && (
                                <div className="flex items-center bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                                  <span>Religious facilities available</span>
                                </div>
                              )}
                              {program.halal_food_availability && (
                                <div className="flex items-center bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                                  <span>Halal food options available</span>
                                </div>
                              )}
                              {!program.religious_facilities && !program.halal_food_availability && (
                                <p className="text-muted-foreground text-sm">
                                  Contact the university for specific cultural and religious facility information.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Campus Amenities */}
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 p-6 rounded-xl">
                        <h4 className="font-semibold text-lg mb-4 flex items-center">
                          <Building className="mr-2 h-5 w-5 text-gray-600" />
                          Campus Amenities
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { icon: Wifi, label: "High-Speed WiFi" },
                            { icon: Library, label: "Library Access" },
                            { icon: Dumbbell, label: "Fitness Center" },
                            { icon: Coffee, label: "Cafeterias" },
                            { icon: Car, label: "Parking" },
                            { icon: Music, label: "Recreation" },
                            { icon: Palette, label: "Art Studios" },
                            { icon: Users, label: "Study Groups" },
                          ].map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg"
                            >
                              <amenity.icon className="h-5 w-5 text-gray-600 mr-2" />
                              <span className="text-sm">{amenity.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Application Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Application Card */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 sticky top-8">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CardTitle className="flex items-center text-xl">
                  <FileCheck className="mr-2 h-5 w-5 text-primary" />
                  Application Details
                </CardTitle>
                <CardDescription>Key information for your application</CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Application Progress */}
                {program.available_places && program.total_places && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Application Progress</span>
                      <span className="font-medium">{completionRate}% filled</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                    <div className="text-xs text-muted-foreground text-center">
                      {program.available_places} of {program.total_places} places remaining
                    </div>
                  </div>
                )}

                {/* Key Information */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium">Deadline</div>
                        <div className="text-sm text-muted-foreground">
                          {program.application_deadline || "Contact for details"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <div className="flex items-center">
                      <CircleDollarSign className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium">Application Fee</div>
                        <div className="text-sm text-muted-foreground">{formatCurrency(program.application_fee)}</div>
                      </div>
                    </div>
                  </div>

                  {program.available_places && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-purple-600 mr-3" />
                        <div>
                          <div className="font-medium">Available Places</div>
                          <div className="text-sm text-muted-foreground">{program.available_places} remaining</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Quick Requirements */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center">
                    <FileCheck className="mr-2 h-4 w-4 text-primary" />
                    Quick Requirements
                  </h4>
                  <div className="space-y-2">
                    {program.admission_requirements && (
                      <div className="text-sm text-muted-foreground line-clamp-3">{program.admission_requirements}</div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-3 bg-transparent"
                    onClick={() => setShowRequirementsDialog(true)}
                  >
                    <FileCheck className="mr-2 h-4 w-4" />
                    View All Requirements
                  </Button>
                </div>

                <Separator />

                {/* Our Services */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-primary" />
                    Our Services
                  </h4>
                  <div className="space-y-2">
                    {[
                      { icon: Check, text: "Application preparation" },
                      { icon: Check, text: "Document verification" },
                      { icon: Check, text: "Visa guidance" },
                      { icon: Check, text: "Pre-departure support" },
                    ].map((service, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <service.icon className="h-4 w-4 text-green-600 mr-2" />
                        <span>{service.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-3 bg-transparent"
                    onClick={() => navigate("/services")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View All Services
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 p-6 pt-0">
                <Button
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg"
                  onClick={handleApplyClick}
                  size="lg"
                >
                  <FileCheck className="mr-2 h-5 w-5" />
                  Apply Now
                </Button>

                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button variant="outline" onClick={() => navigate("/consultation")} className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Consult
                  </Button>

                  <Button
                    variant={isFavorite ? "secondary" : "outline"}
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                    className="flex-1"
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current text-red-500" : ""}`} />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                </div>

                <Button variant="outline" className="w-full bg-transparent" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Program
                </Button>
              </CardFooter>
            </Card>

            {/* Contact Card */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                <CardTitle className="flex items-center text-lg">
                  <Phone className="mr-2 h-5 w-5 text-green-600" />
                  Need Help?
                </CardTitle>
                <CardDescription>Get personalized assistance</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => navigate("/chat-support")}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Live Chat Support
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => navigate("/appointments")}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Book Consultation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => navigate("/contact")}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Requirements Dialog */}
      <Dialog open={showRequirementsDialog} onOpenChange={setShowRequirementsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <FileCheck className="mr-3 h-6 w-6 text-primary" />
              Complete Application Requirements
            </DialogTitle>
            <DialogDescription className="text-lg">
              {program.name} at {program.university}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Academic Requirements */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
              <h3 className="font-semibold text-xl mb-4 flex items-center">
                <GraduationCap className="mr-2 h-6 w-6 text-blue-600" />
                Academic Requirements
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {program.academic_requirements || program.description}
              </p>

              {program.gpa_requirement && (
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium">Minimum GPA Requirement: {program.gpa_requirement}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Language Requirements */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
              <h3 className="font-semibold text-xl mb-4 flex items-center">
                <Languages className="mr-2 h-6 w-6 text-purple-600" />
                Language Requirements
              </h3>
              <div className="space-y-4">
                {program.language_test && (
                  <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Required Test:</span>
                      <Badge className="bg-purple-100 text-purple-700">{program.language_test}</Badge>
                    </div>
                    {program.language_test_score && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Minimum Score:</span>
                        <span className="font-bold text-purple-600">{program.language_test_score}</span>
                      </div>
                    )}
                  </div>
                )}

                {program.language_test_exemptions && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">Exemptions Available</h4>
                    <p className="text-green-700 dark:text-green-300 text-sm">{program.language_test_exemptions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
              <h3 className="font-semibold text-xl mb-4 flex items-center">
                <FileCheck className="mr-2 h-6 w-6 text-green-600" />
                Required Documents
              </h3>
              <div className="space-y-4">
                {program.admission_requirements && (
                  <div className="text-muted-foreground leading-relaxed">{program.admission_requirements}</div>
                )}
              </div>
            </div>

            {/* Application Process */}
            {program.application_process && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-4 flex items-center">
                  <Zap className="mr-2 h-6 w-6 text-amber-600" />
                  Application Process
                </h3>
                <p className="text-muted-foreground leading-relaxed">{program.application_process}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setShowRequirementsDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setShowRequirementsDialog(false)
                handleApplyClick()
              }}
              className="bg-gradient-to-r from-primary to-purple-600"
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Start Application
            </Button>
          </DialogFooter>
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
                src={galleryImages[currentImageIndex] || "/placeholder.svg"}
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
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


