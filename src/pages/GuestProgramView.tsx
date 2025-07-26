"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock program data - in real app, this would come from API
const mockProgram = {
  id: "1",
  name: "Master in International Business Management",
  university: "ESCP Business School",
  city: "Paris",
  country: "France",
  image_url: "/placeholder.svg?height=400&width=800&text=ESCP+Business+School",
  description:
    "A comprehensive 2-year Master's program designed to prepare students for leadership roles in international business. The program combines theoretical knowledge with practical experience through internships and real-world projects.",
  study_level: "Master",
  field: "Business & Management",
  program_language: "English",
  secondary_language: "French",
  duration_months: 24,
  tuition_min: 18000,
  tuition_max: 22000,
  living_cost_min: 800,
  living_cost_max: 1200,
  application_fee: 150,
  visa_fee: 99,
  application_deadline: "2025-03-15",
  admission_requirements:
    "Bachelor's degree with minimum 3.0 GPA, GMAT/GRE scores, English proficiency test, motivation letter, CV, and two recommendation letters.",
  academic_requirements:
    "Completed undergraduate degree in business, economics, or related field. Strong analytical and quantitative skills required.",
  language_requirement: "B2",
  language_test: "IELTS/TOEFL",
  language_test_score: "IELTS 6.5 or TOEFL 90",
  language_test_exemptions: "Native English speakers or students who completed previous education in English",
  gpa_requirement: 3.0,
  scholarship_available: true,
  scholarship_amount: 5000,
  scholarship_deadline: "2025-02-01",
  scholarship_requirements: "Academic excellence, financial need, and leadership potential",
  scholarship_details:
    "Merit-based scholarships covering up to 25% of tuition fees. Additional need-based grants available.",
  religious_facilities: true,
  halal_food_availability: true,
  housing_availability: "On-campus and off-campus options available",
  housing_cost_min: 400,
  housing_cost_max: 800,
  north_african_community_size: "Large",
  internship_opportunities: true,
  exchange_opportunities: true,
  employment_rate: 95,
  ranking: 15,
  success_rate: 88,
  total_places: 120,
  available_places: 45,
  website_url: "https://www.escp.eu",
  virtual_tour_url: "https://www.escp.eu/virtual-tour",
  video_url: "https://www.youtube.com/watch?v=example",
  advantages: "Strong industry connections, international exposure, excellent career services, modern facilities",
  application_process:
    "Online application through university portal, document submission, interview (if selected), final admission decision",
  status: "Active",
}

const mockGalleryImages = [
  "/placeholder.svg?height=300&width=400&text=Campus+Main+Building",
  "/placeholder.svg?height=300&width=400&text=Library",
  "/placeholder.svg?height=300&width=400&text=Student+Lounge",
  "/placeholder.svg?height=300&width=400&text=Lecture+Hall",
  "/placeholder.svg?height=300&width=400&text=Computer+Lab",
  "/placeholder.svg?height=300&width=400&text=Cafeteria",
]

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

export default function GuestProgramView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [program] = useState(mockProgram) // In real app, fetch by id
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
        title: program.name,
        text: `Check out this ${program.study_level} program at ${program.university}`,
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
                      src={program.image_url || "/placeholder.svg"}
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
                        {program.employment_rate}%
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
                      {/* Admission Tab */}
                      {/* Costs Tab */}
                      {/* Campus Tab */}
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
                          {new Date(program.application_deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application Fee:</span>
                        <span className="font-medium">{formatCurrency(program.application_fee)}</span>
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
                  <CardContent className="space-y-3">
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
                  </CardContent>
                </Card>
              </motion.div>

              {/* Similar Programs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                  <CardContent className="space-y-3">
                    {mockSimilarPrograms.map((similar) => (
                      <div
                        key={similar.id}
                        className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm line-clamp-1">{similar.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {similar.match_score}% match
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{similar.university}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Programs
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
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


