"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import {
  ArrowLeft,
  FileText,
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
  BarChart3,
  TrendingUp,
  UserCheck,
  DollarSign,
} from "lucide-react"

// Simple Progress component inline
const Progress = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-800 ${className}`}>
    <div
      className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
)

export default function ProgramView() {
  const { programId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [program, setProgram] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogContent, setDialogContent] = useState("requirements")
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!programId) return

      try {
        const { data, error } = await supabase.from("programs").select("*").eq("id", programId).single()

        if (error) {
          throw error
        }

        if (data) {
          setProgram(data)
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

    // Check if program is in favorites
    if (user) {
      checkFavoriteStatus()
    }
  }, [programId, toast, user])

  // Check if program is in favorites
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

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!user || !programId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorite programs",
        variant: "destructive",
      })
      return
    }

    try {
      if (isFavorite) {
        // Remove from favorites
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
        // Add to favorites
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
    }
  }

  // Share program function
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
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "Program link copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      // Fallback in case sharing fails
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

  const openDialog = (content: string) => {
    setDialogContent(content)
    setShowDialog(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-900 border-slate-800 max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Info className="h-12 w-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-white">Program Not Found</h2>
            <p className="text-slate-400 mb-4 text-center">
              The program you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/programs")} className="bg-blue-600 hover:bg-blue-700">
              View All Programs
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate mock stats (you can replace with real data)
  const successRate = 80
  const employmentRate = 75
  const currentCapacity = program.available_places || 25
  const totalCapacity = program.total_places || 50
  const capacityPercentage = Math.min((currentCapacity / totalCapacity) * 100, 100)

  // Program image
  const programImage = program.image_url || "/placeholder.svg?height=400&width=800&text=Program+Image"

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/programs")}
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{program.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge className="bg-green-600 hover:bg-green-700 text-white">Active</Badge>
                  <span className="text-slate-400 text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {program.city}, {program.country}
                  </span>
                  <span className="text-slate-400 text-sm flex items-center">
                    <Building className="h-3 w-3 mr-1" />
                    {program.university}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
              >
                <FileText className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export Brochure</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFavorite}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Program Overview - Left Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Program Image */}
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <img src={programImage || "/placeholder.svg"} alt={program.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <School className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white">Program Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm">Program ID</label>
                      <p className="text-white font-mono text-sm mt-1 break-all">{programId}</p>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm">University</label>
                      <div className="flex items-center mt-1">
                        <Building className="h-4 w-4 text-blue-400 mr-2" />
                        <p className="text-white">{program.university}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm">Location</label>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-green-400 mr-2" />
                        <p className="text-white">
                          {program.city}, {program.country}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm">Study Level</label>
                      <div className="flex items-center mt-1">
                        <GraduationCap className="h-4 w-4 text-purple-400 mr-2" />
                        <p className="text-white">{program.study_level}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm">Field of Study</label>
                      <div className="flex items-center mt-1">
                        <BookOpen className="h-4 w-4 text-orange-400 mr-2" />
                        <p className="text-white">{program.field}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm">Status</label>
                      <div className="mt-1">
                        <Badge className="bg-green-600 text-white">Active</Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm">Duration</label>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-red-400 mr-2" />
                        <p className="text-white">{program.duration_months} months</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm">Program Language</label>
                      <div className="flex items-center mt-1">
                        <Languages className="h-4 w-4 text-blue-400 mr-2" />
                        <p className="text-white">{program.program_language}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm">Language Requirement</label>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="border-pink-500 text-pink-400">
                          {program.language_test_score || "B2"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm">Application Deadline</label>
                      <div className="flex items-center mt-1">
                        <CalendarDays className="h-4 w-4 text-orange-400 mr-2" />
                        <p className="text-white">{program.application_deadline || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white">Description</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-300 leading-relaxed">{program.description}</p>
              </CardContent>
            </Card>

            {/* Program Features */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
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
                  <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                    <TabsTrigger value="details" className="data-[state=active]:bg-slate-700">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="requirements" className="data-[state=active]:bg-slate-700">
                      Requirements
                    </TabsTrigger>
                    <TabsTrigger value="costs" className="data-[state=active]:bg-slate-700">
                      Costs
                    </TabsTrigger>
                    <TabsTrigger value="housing" className="data-[state=active]:bg-slate-700">
                      Housing
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-white">Field of Study</h4>
                      <p className="text-slate-300">{program.field}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-white">Program Advantages</h4>
                      <p className="text-slate-300">{program.advantages || "Details not provided."}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-white">Application Process</h4>
                      <p className="text-slate-300">
                        {program.application_process ||
                          "Contact an advisor for detailed application process information."}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="requirements" className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-white">Academic Requirements</h4>
                      <p className="text-slate-300">
                        {program.academic_requirements || "Standard academic requirements apply."}
                      </p>
                      {program.gpa_requirement && (
                        <div className="mt-2 flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-slate-300">Minimum GPA: {program.gpa_requirement}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-white">Language Requirements</h4>
                      <div className="space-y-2">
                        <p className="text-slate-300">
                          {program.language_test &&
                            `${program.language_test}: ${program.language_test_score || "Score requirements vary"}`}
                        </p>
                        {program.language_test_exemptions && (
                          <p className="text-slate-300">
                            <span className="font-medium">Exemptions:</span> {program.language_test_exemptions}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-white">Admission Requirements</h4>
                      <p className="text-slate-300">{program.admission_requirements}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="costs" className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-white">Tuition Fees</h4>
                      <p className="text-slate-300">
                        ${program.tuition_min?.toLocaleString()} - ${program.tuition_max?.toLocaleString()} per year
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-white">Living Costs</h4>
                      <p className="text-slate-300">
                        Estimated monthly living expenses: ${program.living_cost_min?.toLocaleString()} - $
                        {program.living_cost_max?.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-white">Additional Fees</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-slate-400">Application Fee:</span> $
                          {program.application_fee?.toLocaleString() || "N/A"}
                        </p>
                        <p>
                          <span className="text-slate-400">Visa Fee:</span> $
                          {program.visa_fee?.toLocaleString() || "Varies by nationality"}
                        </p>
                      </div>
                    </div>

                    {program.scholarship_available && (
                      <div>
                        <h4 className="font-medium mb-2 text-white">Scholarship Information</h4>
                        <p className="text-slate-300">
                          {program.scholarship_details ||
                            "Scholarships available based on academic merit and financial need."}
                        </p>
                        {program.scholarship_amount && (
                          <p className="text-sm font-medium mt-1 text-white">
                            Up to ${program.scholarship_amount?.toLocaleString()} available
                          </p>
                        )}
                        {program.scholarship_deadline && (
                          <p className="text-sm text-slate-400 mt-1">Deadline: {program.scholarship_deadline}</p>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="housing" className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-white">Housing Options</h4>
                      <p className="text-slate-300">
                        {program.housing_availability || "Contact the university for housing information."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-white">Housing Costs</h4>
                      <p className="text-slate-300">
                        Estimated monthly housing costs: ${program.housing_cost_min?.toLocaleString()} - $
                        {program.housing_cost_max?.toLocaleString()}
                      </p>
                    </div>

                    {program.north_african_community_size && (
                      <div>
                        <h4 className="font-medium mb-2 text-white">Community</h4>
                        <p className="text-slate-300">
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Program Stats - Right Column */}
          <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white">Program Stats</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Success Rate</span>
                    </div>
                    <span className="text-white font-semibold">{successRate}%</span>
                  </div>
                  <Progress value={successRate} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300">Employment Rate</span>
                    </div>
                    <span className="text-white font-semibold">{employmentRate}%</span>
                  </div>
                  <Progress value={employmentRate} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-slate-300">Capacity</span>
                    </div>
                    <span className="text-white font-semibold">
                      {currentCapacity}/{totalCapacity}
                    </span>
                  </div>
                  <Progress value={capacityPercentage} />
                </div>
              </CardContent>
            </Card>

            {/* Financial Info */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-white font-medium">Tuition Range</span>
                  </div>
                  <p className="text-slate-300">
                    ${program.tuition_min?.toLocaleString()} - ${program.tuition_max?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="h-4 w-4 text-blue-400" />
                    <span className="text-white font-medium">Living Costs</span>
                  </div>
                  <p className="text-slate-300">
                    ${program.living_cost_min?.toLocaleString()} - ${program.living_cost_max?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileCheck className="h-4 w-4 text-purple-400" />
                    <span className="text-white font-medium">Application Fee</span>
                  </div>
                  <p className="text-slate-300">${program.application_fee?.toLocaleString() || "400"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Application Info */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-white">Application</CardTitle>
                <CardDescription className="text-slate-400">Key information about applying</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-1">Deadline</h3>
                    <div className="flex items-center text-base">
                      <CalendarDays className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="text-white">{program.application_deadline || "Contact for details"}</span>
                    </div>
                  </div>

                  {program.available_places !== null && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-1">Available Places</h3>
                      <div className="flex items-center text-base">
                        <Users className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="text-white">
                          {program.available_places} / {program.total_places || "∞"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-1">Application Fee</h3>
                    <div className="flex items-center text-base">
                      <CircleDollarSign className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="text-white">
                        ${program.application_fee?.toLocaleString() || "Contact for details"}
                      </span>
                    </div>
                  </div>

                  <Separator className="bg-slate-800" />

                  <div>
                    <h3 className="font-medium mb-3 text-white">Required Documents</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-blue-400 mt-1" />
                        <span className="text-sm text-slate-300">Academic transcripts</span>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-blue-400 mt-1" />
                        <span className="text-sm text-slate-300">Language proficiency test results</span>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-blue-400 mt-1" />
                        <span className="text-sm text-slate-300">Passport copy</span>
                      </li>
                      <li className="flex items-start">
                        <FileCheck className="h-4 w-4 mr-2 text-blue-400 mt-1" />
                        <span className="text-sm text-slate-300">Motivation letter</span>
                      </li>
                    </ul>

                    <Button
                      variant="outline"
                      className="w-full mt-4 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
                      onClick={() => openDialog("requirements")}
                    >
                      View All Requirements
                    </Button>
                  </div>

                  <Separator className="bg-slate-800" />

                  <div className="space-y-4">
                    <h3 className="font-medium mb-1 text-white">Our Services</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-blue-400 mt-0.5" />
                        <span className="text-slate-300">Application preparation</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-blue-400 mt-0.5" />
                        <span className="text-slate-300">Document verification</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-blue-400 mt-0.5" />
                        <span className="text-slate-300">Visa guidance</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-blue-400 mt-0.5" />
                        <span className="text-slate-300">Pre-departure orientation</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
                      onClick={() => navigate("/services")}
                    >
                      View Our Services
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleApplyClick}>
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
                  onClick={() => navigate("/consultation")}
                >
                  Get Consultation
                </Button>
                <Button
                  variant={isFavorite ? "secondary" : "outline"}
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
                  onClick={toggleFavorite}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
                </Button>

                {/* Share button */}
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Program
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog for detailed content */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {dialogContent === "requirements" ? "Application Requirements" : "University Details"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {program.name} at {program.university}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto">
            {dialogContent === "requirements" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-white">Academic Requirements</h3>
                  <p className="text-slate-300">
                    {program.academic_requirements || "Standard academic requirements apply."}
                  </p>

                  {program.gpa_requirement && (
                    <div className="mt-2">
                      <h4 className="font-medium text-white">Minimum GPA</h4>
                      <p className="text-slate-300">{program.gpa_requirement}</p>
                    </div>
                  )}
                </div>

                <Separator className="bg-slate-800" />

                <div>
                  <h3 className="font-semibold mb-2 text-white">Language Requirements</h3>
                  <p className="text-slate-300">Required test: {program.language_test || "Not specified"}</p>
                  {program.language_test_score && (
                    <p className="text-slate-300">Minimum score: {program.language_test_score}</p>
                  )}

                  {program.language_test_exemptions && (
                    <div className="mt-2">
                      <h4 className="font-medium text-white">Exemptions</h4>
                      <p className="text-slate-300">{program.language_test_exemptions}</p>
                    </div>
                  )}
                </div>

                <Separator className="bg-slate-800" />

                <div>
                  <h3 className="font-semibold mb-2 text-white">Required Documents</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-blue-400 mt-1" />
                      <div>
                        <span className="font-medium text-white">Academic transcripts</span>
                        <p className="text-sm text-slate-400">
                          Official transcripts from all previously attended institutions
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-blue-400 mt-1" />
                      <div>
                        <span className="font-medium text-white">Language proficiency proof</span>
                        <p className="text-sm text-slate-400">IELTS, TOEFL, or equivalent as specified</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-blue-400 mt-1" />
                      <div>
                        <span className="font-medium text-white">Passport copy</span>
                        <p className="text-sm text-slate-400">Valid for at least 6 months beyond program end date</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-blue-400 mt-1" />
                      <div>
                        <span className="font-medium text-white">Motivation letter</span>
                        <p className="text-sm text-slate-400">Statement explaining your interest in the program</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-blue-400 mt-1" />
                      <div>
                        <span className="font-medium text-white">Recommendation letters</span>
                        <p className="text-sm text-slate-400">2-3 letters from academic or professional references</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-blue-400 mt-1" />
                      <div>
                        <span className="font-medium text-white">Curriculum Vitae/Resume</span>
                        <p className="text-sm text-slate-400">Detailed academic and professional history</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-blue-400 mt-1" />
                      <div>
                        <span className="font-medium text-white">Financial documents</span>
                        <p className="text-sm text-slate-400">Proof of ability to fund your studies</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <Separator className="bg-slate-800" />

                <div>
                  <h3 className="font-semibold mb-2 text-white">Application Process</h3>
                  <p className="text-slate-300">
                    {program.application_process ||
                      "Detailed application process information will be provided during consultation."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowDialog(false)} className="bg-slate-800 hover:bg-slate-700">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

