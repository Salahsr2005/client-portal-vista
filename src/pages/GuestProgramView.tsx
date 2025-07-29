"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useProgram } from "@/hooks/usePrograms"
import { useIsMobile } from "@/hooks/use-mobile"
import { getMockProgramById } from "@/utils/mockData"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Euro,
  GraduationCap,
  Languages,
  Building2,
  BookOpen,
  Share2,
  Download,
  TrendingUp,
  Play,
  Heart,
  Zap,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  Calendar,
  Users,
  Award,
  Globe,
  CheckCircle,
  AlertCircle,
  Star,
  Home,
  Utensils,
  Briefcase,
  ChevronLeft,
  FileText,
  Info,
  UserCheck,
  CreditCard,
  FileCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function GuestProgramView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Try to fetch program data from database first, then fallback to mock data
  const { data: dbProgram, isLoading: programLoading, error } = useProgram(id || "")

  // Use mock data as fallback if database fetch fails or returns null
  const program = dbProgram || getMockProgramById(id || "")

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleApply = () => {
    toast({
      title: "Service Coming Soon",
      description: "Applications will be available starting September 1st, 2025. Continue exploring in guest mode!",
      action: (
        <Button variant="outline" size="sm" onClick={() => navigate("/guest")}>
          Explore More
        </Button>
      ),
    })
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: program?.name,
          text: `Check out this ${program?.study_level} program at ${program?.university}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied",
          description: "Program link copied to clipboard!",
        })
      }
    } catch (error) {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied",
          description: "Program link copied to clipboard!",
        })
      } catch (err) {
        toast({
          title: "Share Failed",
          description: "Unable to share this program.",
          variant: "destructive",
        })
      }
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockGalleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockGalleryImages.length) % mockGalleryImages.length)
  }

  if (programLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading program details...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Program Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The program you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/guest/programs")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Programs
            </Button>
            <Button variant="outline" onClick={() => navigate("/guest")}>
              Go Home
            </Button>
          </div>
        </div>
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

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-20">
          <div className={cn("max-w-7xl mx-auto py-4", isMobile ? "px-4" : "px-6")}>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate("/guest/programs")}
                className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                {!isMobile && "Back to Programs"}
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  {!isMobile && "Share"}
                </Button>
                <Button variant="outline" size={isMobile ? "sm" : "default"}>
                  <Download className="h-4 w-4 mr-2" />
                  {!isMobile && "Save PDF"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className={cn("max-w-7xl mx-auto py-8", isMobile ? "px-4" : "px-6")}>
          <div className={cn("grid gap-8", isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3")}>
            {/* Main Content */}
            <div className={cn(isMobile ? "space-y-6" : "lg:col-span-2 space-y-8")}>
              {/* Hero Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white/90 to-blue-50/50 dark:from-slate-800/90 dark:to-blue-950/20 backdrop-blur-sm">
                  <div className={cn("relative", isMobile ? "h-48" : "h-64 md:h-80")}>
                    <img
                      src={program.image_url || "/placeholder.svg?height=400&width=800&text=Program+Image"}
                      alt={program.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={cn(
                          "text-white border-0",
                          program.status === "Active" ? "bg-green-500" : "bg-red-500",
                        )}
                      >
                        {program.status}
                      </Badge>
                    </div>

                    {/* Video Play Button */}
                    {program.video_url && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size={isMobile ? "default" : "lg"}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                        >
                          <Play className={cn(isMobile ? "h-4 w-4 mr-2" : "h-6 w-6 mr-2")} />
                          Watch Video
                        </Button>
                      </div>
                    )}

                    {/* Program Info Overlay */}
                    <div className={cn("absolute bottom-0 left-0 right-0 text-white", isMobile ? "p-4" : "p-6")}>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                          {program.study_level}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                          {program.field}
                        </Badge>
                        {program.scholarship_available && (
                          <Badge variant="secondary" className="bg-yellow-500/80 text-white border-0">
                            <Award className="h-3 w-3 mr-1" />
                            Scholarship
                          </Badge>
                        )}
                      </div>
                      <h1 className={cn("font-bold mb-2", isMobile ? "text-xl" : "text-2xl md:text-3xl")}>
                        {program.name}
                      </h1>
                      <div className={cn("flex items-center gap-4 text-sm", isMobile && "flex-wrap gap-2")}>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span className={cn(isMobile && "text-xs")}>{program.university}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className={cn(isMobile && "text-xs")}>
                            {program.city}, {program.country}
                          </span>
                        </div>
                        {program.ranking && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span className={cn(isMobile && "text-xs")}>Rank #{program.ranking}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Key Stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className={cn("grid gap-4", isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4")}>
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className={cn("text-center", isMobile ? "p-3" : "p-4")}>
                      <div
                        className={cn(
                          "flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-2",
                          isMobile ? "w-10 h-10" : "w-12 h-12",
                        )}
                      >
                        <Clock className={cn("text-blue-600 dark:text-blue-400", isMobile ? "h-5 w-5" : "h-6 w-6")} />
                      </div>
                      <div
                        className={cn("font-bold text-slate-900 dark:text-white", isMobile ? "text-lg" : "text-2xl")}
                      >
                        {program.duration_months}
                      </div>
                      <div className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-xs" : "text-sm")}>
                        Months
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className={cn("text-center", isMobile ? "p-3" : "p-4")}>
                      <div
                        className={cn(
                          "flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-2",
                          isMobile ? "w-10 h-10" : "w-12 h-12",
                        )}
                      >
                        <Euro className={cn("text-green-600 dark:text-green-400", isMobile ? "h-5 w-5" : "h-6 w-6")} />
                      </div>
                      <div
                        className={cn("font-bold text-slate-900 dark:text-white", isMobile ? "text-sm" : "text-2xl")}
                      >
                        {formatCurrency(program.tuition_min)}
                      </div>
                      <div className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-xs" : "text-sm")}>
                        From
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className={cn("text-center", isMobile ? "p-3" : "p-4")}>
                      <div
                        className={cn(
                          "flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full mx-auto mb-2",
                          isMobile ? "w-10 h-10" : "w-12 h-12",
                        )}
                      >
                        <Languages
                          className={cn("text-purple-600 dark:text-purple-400", isMobile ? "h-5 w-5" : "h-6 w-6")}
                        />
                      </div>
                      <div
                        className={cn("font-bold text-slate-900 dark:text-white", isMobile ? "text-sm" : "text-2xl")}
                      >
                        {program.program_language}
                      </div>
                      <div className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-xs" : "text-sm")}>
                        Language
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className={cn("text-center", isMobile ? "p-3" : "p-4")}>
                      <div
                        className={cn(
                          "flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 rounded-full mx-auto mb-2",
                          isMobile ? "w-10 h-10" : "w-12 h-12",
                        )}
                      >
                        <TrendingUp
                          className={cn("text-orange-600 dark:text-orange-400", isMobile ? "h-5 w-5" : "h-6 w-6")}
                        />
                      </div>
                      <div
                        className={cn("font-bold text-slate-900 dark:text-white", isMobile ? "text-lg" : "text-2xl")}
                      >
                        {program.employment_rate || 85}%
                      </div>
                      <div className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-xs" : "text-sm")}>
                        Employment
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Main Content Tabs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="border-b border-slate-200 dark:border-slate-700">
                      <TabsList
                        className={cn(
                          "grid w-full bg-transparent h-auto p-0",
                          isMobile ? "grid-cols-2" : "grid-cols-4",
                        )}
                      >
                        <TabsTrigger
                          value="overview"
                          className={cn(
                            "data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500",
                            isMobile ? "py-3 text-xs" : "py-4",
                          )}
                        >
                          <BookOpen className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="admission"
                          className={cn(
                            "data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500",
                            isMobile ? "py-3 text-xs" : "py-4",
                          )}
                        >
                          <GraduationCap className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                          Admission
                        </TabsTrigger>
                        {!isMobile && (
                          <>
                            <TabsTrigger
                              value="costs"
                              className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 py-4"
                            >
                              <Euro className="h-4 w-4 mr-2" />
                              Costs
                            </TabsTrigger>
                            <TabsTrigger
                              value="campus"
                              className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 py-4"
                            >
                              <Building2 className="h-4 w-4 mr-2" />
                              Campus
                            </TabsTrigger>
                          </>
                        )}
                        {isMobile && (
                          <TabsTrigger
                            value="more"
                            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 py-3 text-xs"
                          >
                            <Info className="h-3 w-3 mr-2" />
                            More
                          </TabsTrigger>
                        )}
                      </TabsList>
                    </div>

                    <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
                      {/* Overview Tab */}
                      <TabsContent value="overview" className="space-y-6 mt-0">
                        <div>
                          <h3
                            className={cn(
                              "font-semibold mb-3 text-slate-900 dark:text-white",
                              isMobile ? "text-lg" : "text-xl",
                            )}
                          >
                            Program Description
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{program.description}</p>
                        </div>

                        {program.advantages && (
                          <div>
                            <h3
                              className={cn(
                                "font-semibold mb-3 text-slate-900 dark:text-white",
                                isMobile ? "text-lg" : "text-xl",
                              )}
                            >
                              Key Advantages
                            </h3>
                            <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
                              {program.advantages.split(",").map((advantage, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">{advantage.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {program.field_keywords && program.field_keywords.length > 0 && (
                          <div>
                            <h3
                              className={cn(
                                "font-semibold mb-3 text-slate-900 dark:text-white",
                                isMobile ? "text-lg" : "text-xl",
                              )}
                            >
                              Study Areas
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {program.field_keywords.map((keyword, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
                          <div>
                            <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Program Features</h4>
                            <div className="space-y-2">
                              {program.internship_opportunities && (
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Internship Opportunities
                                  </span>
                                </div>
                              )}
                              {program.exchange_opportunities && (
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  <span className="text-sm text-slate-600 dark:text-slate-400">Exchange Programs</span>
                                </div>
                              )}
                              {program.religious_facilities && (
                                <div className="flex items-center gap-2">
                                  <Home className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Religious Facilities
                                  </span>
                                </div>
                              )}
                              {program.halal_food_availability && (
                                <div className="flex items-center gap-2">
                                  <Utensils className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Halal Food Available
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Community</h4>
                            <div className="space-y-2">
                              {program.north_african_community_size && (
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    North African Community: {program.north_african_community_size}
                                  </span>
                                </div>
                              )}
                              {program.total_places && (
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Total Places: {program.total_places}
                                  </span>
                                </div>
                              )}
                              {program.available_places && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Available Places: {program.available_places}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Admission Tab */}
                      <TabsContent value="admission" className="space-y-6 mt-0">
                        <div>
                          <h3
                            className={cn(
                              "font-semibold mb-3 text-slate-900 dark:text-white",
                              isMobile ? "text-lg" : "text-xl",
                            )}
                          >
                            Admission Requirements
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            {program.admission_requirements ||
                              "Standard admission requirements apply for this program."}
                          </p>

                          {program.academic_requirements && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                              <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                                Academic Requirements
                              </h4>
                              <p className="text-blue-800 dark:text-blue-200 text-sm">
                                {program.academic_requirements}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
                          <div>
                            <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">Language Requirements</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <span className="text-sm font-medium">Required Level:</span>
                                <Badge variant="outline">{program.language_requirement || "B2/C1"}</Badge>
                              </div>
                              {program.language_test && (
                                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                  <span className="text-sm font-medium">Accepted Tests:</span>
                                  <span className="text-sm">{program.language_test}</span>
                                </div>
                              )}
                              {program.language_test_score && (
                                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                  <span className="text-sm font-medium">Minimum Score:</span>
                                  <span className="text-sm">{program.language_test_score}</span>
                                </div>
                              )}
                            </div>

                            {program.language_test_exemptions && (
                              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                <h5 className="font-medium text-green-900 dark:text-green-100 mb-1">Exemptions</h5>
                                <p className="text-green-800 dark:text-green-200 text-sm">
                                  {program.language_test_exemptions}
                                </p>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">Important Dates</h4>
                            <div className="space-y-3">
                              {program.application_deadline && (
                                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                                  <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
                                  <div>
                                    <div className="font-medium text-red-900 dark:text-red-100">
                                      Application Deadline
                                    </div>
                                    <div className="text-sm text-red-700 dark:text-red-300">
                                      {new Date(program.application_deadline).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {program.scholarship_deadline && (
                                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                                  <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                  <div>
                                    <div className="font-medium text-yellow-900 dark:text-yellow-100">
                                      Scholarship Deadline
                                    </div>
                                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
                                      {new Date(program.scholarship_deadline).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {program.gpa_requirement && (
                              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-blue-900 dark:text-blue-100">Minimum GPA</span>
                                  <Badge className="bg-blue-600 text-white">{program.gpa_requirement}</Badge>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {program.application_process && (
                          <div>
                            <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">Application Process</h4>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <p className="text-slate-600 dark:text-slate-400">{program.application_process}</p>
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">Required Documents</h4>
                          <div className="grid gap-3">
                            {[
                              { icon: FileText, text: "Academic transcripts and certificates" },
                              { icon: Languages, text: "Language proficiency test results" },
                              { icon: FileCheck, text: "Passport copy (valid for 6+ months)" },
                              { icon: BookOpen, text: "Motivation letter / Statement of purpose" },
                              { icon: UserCheck, text: "2-3 recommendation letters" },
                              { icon: FileText, text: "Curriculum Vitae / Resume" },
                              { icon: CreditCard, text: "Proof of financial resources" },
                            ].map((doc, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                              >
                                <doc.icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">{doc.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Costs Tab - Desktop only or Mobile "More" tab */}
                      <TabsContent value={isMobile ? "more" : "costs"} className="space-y-6 mt-0">
                        {isMobile && (
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <Button
                              variant={activeTab === "costs" ? "default" : "outline"}
                              onClick={() => setActiveTab("costs")}
                              className="w-full"
                            >
                              <Euro className="h-4 w-4 mr-2" />
                              Costs
                            </Button>
                            <Button
                              variant={activeTab === "campus" ? "default" : "outline"}
                              onClick={() => setActiveTab("campus")}
                              className="w-full"
                            >
                              <Building2 className="h-4 w-4 mr-2" />
                              Campus
                            </Button>
                          </div>
                        )}

                        {(activeTab === "costs" || !isMobile) && (
                          <>
                            <div>
                              <h3
                                className={cn(
                                  "font-semibold mb-4 text-slate-900 dark:text-white",
                                  isMobile ? "text-lg" : "text-xl",
                                )}
                              >
                                Tuition & Fees
                              </h3>
                              <div
                                className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}
                              >
                                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                                  <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="p-2 bg-blue-600 rounded-lg">
                                        <Euro className="h-6 w-6 text-white" />
                                      </div>
                                      <div>
                                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                                          Annual Tuition
                                        </h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">Per academic year</p>
                                      </div>
                                    </div>
                                    <div
                                      className={cn(
                                        "font-bold text-blue-900 dark:text-blue-100",
                                        isMobile ? "text-xl" : "text-2xl",
                                      )}
                                    >
                                      {formatCurrency(program.tuition_min)} - {formatCurrency(program.tuition_max)}
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
                                  <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="p-2 bg-green-600 rounded-lg">
                                        <Home className="h-6 w-6 text-white" />
                                      </div>
                                      <div>
                                        <h4 className="font-semibold text-green-900 dark:text-green-100">
                                          Living Costs
                                        </h4>
                                        <p className="text-sm text-green-700 dark:text-green-300">Per month</p>
                                      </div>
                                    </div>
                                    <div
                                      className={cn(
                                        "font-bold text-green-900 dark:text-green-100",
                                        isMobile ? "text-xl" : "text-2xl",
                                      )}
                                    >
                                      {formatCurrency(program.living_cost_min)} -{" "}
                                      {formatCurrency(program.living_cost_max)}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">Additional Costs</h4>
                              <div className="space-y-3">
                                {program.application_fee && (
                                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <span className="font-medium">Application Fee</span>
                                    <span className="text-lg font-semibold">
                                      {formatCurrency(program.application_fee)}
                                    </span>
                                  </div>
                                )}

                                {program.visa_fee && (
                                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <span className="font-medium">Visa Processing Fee</span>
                                    <span className="text-lg font-semibold">{formatCurrency(program.visa_fee)}</span>
                                  </div>
                                )}

                                {program.housing_cost_min && program.housing_cost_max && (
                                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <span className="font-medium">Housing (Monthly)</span>
                                    <span className="text-lg font-semibold">
                                      {formatCurrency(program.housing_cost_min)} -{" "}
                                      {formatCurrency(program.housing_cost_max)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {program.scholarship_available && (
                              <div>
                                <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">
                                  Scholarship Information
                                </h4>
                                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                                  <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                      <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                      <h5 className="font-semibold text-yellow-900 dark:text-yellow-100">
                                        Scholarships Available
                                      </h5>
                                    </div>

                                    {program.scholarship_amount && (
                                      <div className="mb-3">
                                        <span className="text-sm text-yellow-700 dark:text-yellow-300">Amount: </span>
                                        <span className="font-semibold text-yellow-900 dark:text-yellow-100">
                                          Up to {formatCurrency(program.scholarship_amount)}
                                        </span>
                                      </div>
                                    )}

                                    {program.scholarship_details && (
                                      <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-3">
                                        {program.scholarship_details}
                                      </p>
                                    )}

                                    {program.scholarship_requirements && (
                                      <div>
                                        <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                                          Requirements:{" "}
                                        </span>
                                        <span className="text-sm text-yellow-700 dark:text-yellow-300">
                                          {program.scholarship_requirements}
                                        </span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </>
                        )}
                      </TabsContent>

                      {/* Campus Tab */}
                      <TabsContent value="campus" className="space-y-6 mt-0">
                        <div>
                          <h3
                            className={cn(
                              "font-semibold mb-4 text-slate-900 dark:text-white",
                              isMobile ? "text-lg" : "text-xl",
                            )}
                          >
                            Campus Gallery
                          </h3>
                          <div className="relative">
                            <div
                              className={cn(
                                "aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700",
                                isMobile && "aspect-[4/3]",
                              )}
                            >
                              <img
                                src={mockGalleryImages[currentImageIndex] || "/placeholder.svg"}
                                alt={`Campus view ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={prevImage}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-slate-800/80"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-slate-800/80"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>

                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                              {mockGalleryImages.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentImageIndex(index)}
                                  className={cn(
                                    "w-2 h-2 rounded-full transition-colors",
                                    index === currentImageIndex ? "bg-white" : "bg-white/50",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">Campus Facilities</h4>
                          <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <h5 className="font-medium mb-2">Academic Facilities</h5>
                              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Modern lecture halls with AV equipment</li>
                                <li>• State-of-the-art research laboratories</li>
                                <li>• Digital library with 24/7 access</li>
                                <li>• Computer labs with latest software</li>
                                <li>• Study rooms and group work spaces</li>
                              </ul>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <h5 className="font-medium mb-2">Student Services</h5>
                              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• On-campus student accommodation</li>
                                <li>• Multiple dining facilities and cafeterias</li>
                                <li>• Modern sports and fitness center</li>
                                <li>• Career counseling and job placement</li>
                                <li>• International student support office</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {program.housing_availability && (
                          <div>
                            <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">Housing Information</h4>
                            <Card className="bg-slate-50 dark:bg-slate-800">
                              <CardContent className="p-4">
                                <p className="text-slate-600 dark:text-slate-400">{program.housing_availability}</p>
                                {program.housing_cost_min && program.housing_cost_max && (
                                  <div className="mt-3 flex justify-between items-center">
                                    <span className="font-medium">Monthly Housing Cost:</span>
                                    <span className="font-semibold">
                                      {formatCurrency(program.housing_cost_min)} -{" "}
                                      {formatCurrency(program.housing_cost_max)}
                                    </span>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {program.virtual_tour_url && (
                          <div>
                            <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">Virtual Tour</h4>
                            <Button
                              onClick={() => window.open(program.virtual_tour_url, "_blank")}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Take Virtual Tour
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar Content */}
            <div className={cn("space-y-6", isMobile && "mt-6")}>
              {/* Quick Apply Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm sticky top-24">
                  <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
                    <div className="text-center mb-4">
                      <h3 className={cn("font-semibold mb-2", isMobile ? "text-base" : "text-lg")}>Coming Soon!</h3>
                      <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                        Applications open September 1st, 2025
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleApply}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        size={isMobile ? "sm" : "default"}
                        disabled
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Apply (Coming Soon)
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" size={isMobile ? "sm" : "default"}>
                        <Heart className="w-4 h-4 mr-2" />
                        Save Program
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        size={isMobile ? "sm" : "default"}
                        onClick={() => navigate("/guest/consultation")}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Get Consultation
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <div className={cn("space-y-2", isMobile ? "text-xs" : "text-sm")}>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application Opens:</span>
                        <span className="font-medium">Sept 1, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application Fee:</span>
                        <span className="font-medium">{formatCurrency(program.application_fee || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Time:</span>
                        <span className="font-medium">4-6 weeks</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                  <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
                    <h3
                      className={cn(
                        "font-semibold mb-4 text-slate-900 dark:text-white",
                        isMobile ? "text-base" : "text-lg",
                      )}
                    >
                      Need Help?
                    </h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        size={isMobile ? "sm" : "default"}
                        disabled
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Admissions (Coming Soon)
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        size={isMobile ? "sm" : "default"}
                        disabled
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support (Coming Soon)
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        size={isMobile ? "sm" : "default"}
                        onClick={() => navigate("/guest")}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Explore More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Similar Programs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                  <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
                    <h3
                      className={cn(
                        "font-semibold mb-4 text-slate-900 dark:text-white",
                        isMobile ? "text-base" : "text-lg",
                      )}
                    >
                      Similar Programs
                    </h3>
                    <div className="space-y-3">
                      {mockSimilarPrograms.map((similar) => (
                        <div
                          key={similar.id}
                          className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/guest/programs/${similar.id}`)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={cn("font-medium line-clamp-1", isMobile ? "text-xs" : "text-sm")}>
                              {similar.name}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {similar.match_score}% match
                            </Badge>
                          </div>
                          <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                            {similar.university}
                          </p>
                          <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                            {similar.country}
                          </p>
                          <div className={cn("font-medium mt-1", isMobile ? "text-xs" : "text-sm")}>
                            {formatCurrency(similar.tuition_min)} - {formatCurrency(similar.tuition_max)}
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => navigate("/guest/programs")}
                        size={isMobile ? "sm" : "default"}
                      >
                        View All Programs
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                  <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
                    <h3
                      className={cn(
                        "font-semibold mb-4 text-slate-900 dark:text-white",
                        isMobile ? "text-base" : "text-lg",
                      )}
                    >
                      Quick Facts
                    </h3>
                    <div className="space-y-3">
                      {program.success_rate && (
                        <div className="flex justify-between items-center">
                          <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                            Success Rate:
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                          >
                            {program.success_rate}%
                          </Badge>
                        </div>
                      )}

                      {program.ranking && (
                        <div className="flex justify-between items-center">
                          <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                            University Ranking:
                          </span>
                          <Badge variant="outline">#{program.ranking}</Badge>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                          Program Language:
                        </span>
                        <Badge variant="outline">{program.program_language}</Badge>
                      </div>

                      {program.secondary_language && (
                        <div className="flex justify-between items-center">
                          <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                            Secondary Language:
                          </span>
                          <Badge variant="outline">{program.secondary_language}</Badge>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Duration:</span>
                        <Badge variant="outline">{program.duration_months} months</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





