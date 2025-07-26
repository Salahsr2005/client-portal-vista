"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useProgram } from "@/hooks/usePrograms"
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
  ExternalLink,
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
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function GuestProgramView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch program data using the hook
  const { data: program, isLoading: programLoading, error } = useProgram(id || "")

  // Mock gallery images - in real app, these would come from the program data
  const mockGalleryImages = [
    "/placeholder.svg?height=300&width=400&text=Campus+Main+Building",
    "/placeholder.svg?height=300&width=400&text=Library",
    "/placeholder.svg?height=300&width=400&text=Student+Lounge",
    "/placeholder.svg?height=300&width=400&text=Lecture+Hall",
    "/placeholder.svg?height=300&width=400&text=Computer+Lab",
    "/placeholder.svg?height=300&width=400&text=Cafeteria",
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
      name: "Master in European Business",
      university: "INSEAD",
      country: "France",
      tuition_min: 20000,
      tuition_max: 25000,
      match_score: 88,
    },
    {
      id: "4",
      name: "International Management Master",
      university: "IE Business School",
      country: "Spain",
      tuition_min: 22000,
      tuition_max: 27000,
      match_score: 85,
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
      title: "Sign Up Required",
      description: "Please create an account to apply for this program.",
      variant: "destructive",
    })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: program?.name,
        text: `Check out this ${program?.study_level} program at ${program?.university}`,
        url: window.location.href,
      })
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Program link copied to clipboard!",
      })
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

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Program Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            The program you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/guest/programs")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Programs
          </Button>
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
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Programs
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Save PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white/90 to-blue-50/50 dark:from-slate-800/90 dark:to-blue-950/20 backdrop-blur-sm">
                  <div className="relative h-64 md:h-80">
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
                          size="lg"
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                        >
                          <Play className="h-6 w-6 mr-2" />
                          Watch Video
                        </Button>
                      </div>
                    )}

                    {/* Program Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
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
                      <h1 className="text-2xl md:text-3xl font-bold mb-2">{program.name}</h1>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {program.university}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {program.city}, {program.country}
                        </div>
                        {program.ranking && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            Rank #{program.ranking}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Key Stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-2">
                        <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{program.duration_months}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Months</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-2">
                        <Euro className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(program.tuition_min)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">From</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full mx-auto mb-2">
                        <Languages className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {program.program_language}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Language</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full mx-auto mb-2">
                        <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {program.employment_rate || 85}%
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Employment</div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Main Content Tabs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                  <Tabs defaultValue="overview" className="w-full">
                    <div className="border-b border-slate-200 dark:border-slate-700">
                      <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0">
                        <TabsTrigger
                          value="overview"
                          className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 py-4"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="admission"
                          className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 py-4"
                        >
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Admission
                        </TabsTrigger>
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
                      </TabsList>
                    </div>

                    <CardContent className="p-6">
                      {/* Overview Tab */}
                      <TabsContent value="overview" className="space-y-6 mt-0">
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                            Program Description
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{program.description}</p>
                        </div>

                        {program.advantages && (
                          <div>
                            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                              Key Advantages
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Study Areas</h3>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                            Admission Requirements
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            {program.admission_requirements}
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">Language Requirements</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <span className="text-sm font-medium">Required Level:</span>
                                <Badge variant="outline">{program.language_requirement}</Badge>
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
                      </TabsContent>

                      {/* Costs Tab */}
                      <TabsContent value="costs" className="space-y-6 mt-0">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Tuition & Fees</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                              <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2 bg-blue-600 rounded-lg">
                                    <Euro className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Annual Tuition</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">Per academic year</p>
                                  </div>
                                </div>
                                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
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
                                    <h4 className="font-semibold text-green-900 dark:text-green-100">Living Costs</h4>
                                    <p className="text-sm text-green-700 dark:text-green-300">Per month</p>
                                  </div>
                                </div>
                                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                                  {formatCurrency(program.living_cost_min)} - {formatCurrency(program.living_cost_max)}
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
                                <span className="text-lg font-semibold">{formatCurrency(program.application_fee)}</span>
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
                      </TabsContent>

                      {/* Campus Tab */}
                      <TabsContent value="campus" className="space-y-6 mt-0">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Campus Gallery</h3>
                          <div className="relative">
                            <div className="aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <h5 className="font-medium mb-2">Academic Facilities</h5>
                              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Modern lecture halls</li>
                                <li>• Research laboratories</li>
                                <li>• Digital library</li>
                                <li>• Computer labs</li>
                              </ul>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <h5 className="font-medium mb-2">Student Services</h5>
                              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Student accommodation</li>
                                <li>• Dining facilities</li>
                                <li>• Sports center</li>
                                <li>• Career services</li>
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
            <div className="space-y-6">
              {/* Quick Apply Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold mb-2">Ready to Apply?</h3>
                      <p className="text-sm text-muted-foreground">Join thousands of students who chose this program</p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleApply}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Heart className="w-4 h-4 mr-2" />
                        Save Program
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Zap className="w-4 h-4 mr-2" />
                        Get Recommendations
                      </Button>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application Deadline:</span>
                        <span className="font-medium">
                          {program.application_deadline
                            ? new Date(program.application_deadline).toLocaleDateString()
                            : "Rolling"}
                        </span>
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
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Need Help?</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Admissions
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Live Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Similar Programs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Similar Programs</h3>
                    <div className="space-y-3">
                      {mockSimilarPrograms.map((similar) => (
                        <div
                          key={similar.id}
                          className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/guest/programs/${similar.id}`)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm line-clamp-1">{similar.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {similar.match_score}% match
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{similar.university}</p>
                          <p className="text-xs text-muted-foreground">{similar.country}</p>
                          <div className="text-xs font-medium mt-1">
                            {formatCurrency(similar.tuition_min)} - {formatCurrency(similar.tuition_max)}
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full bg-transparent">
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
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Quick Facts</h3>
                    <div className="space-y-3">
                      {program.success_rate && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Success Rate:</span>
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
                          <span className="text-sm text-muted-foreground">University Ranking:</span>
                          <Badge variant="outline">#{program.ranking}</Badge>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Program Language:</span>
                        <Badge variant="outline">{program.program_language}</Badge>
                      </div>

                      {program.secondary_language && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Secondary Language:</span>
                          <Badge variant="outline">{program.secondary_language}</Badge>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Duration:</span>
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



