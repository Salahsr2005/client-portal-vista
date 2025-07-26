"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { GuestModeWrapper } from "@/components/layout/GuestModeWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  MapPin,
  Clock,
  Euro,
  Languages,
  Calendar,
  Award,
  Building2,
  Users,
  CheckCircle,
  Star,
  Heart,
  Share2,
  ExternalLink,
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Info,
  TrendingUp,
  Target,
  Zap,
  Shield,
  Camera,
  FileText,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Mock program data - replace with actual API call
const mockProgram = {
  id: "1",
  name: "Master of Science in Computer Science",
  university: "Technical University of Munich",
  location: "Munich",
  country: "Germany",
  study_level: "Master",
  field: "Computer Science",
  duration: "2 years",
  tuition_min: 15000,
  tuition_max: 20000,
  program_language: "English",
  application_deadline: "2024-07-15",
  scholarship_available: true,
  religious_facilities: true,
  halal_food_availability: true,
  ranking: 45,
  description:
    "This comprehensive Master's program in Computer Science offers cutting-edge curriculum covering artificial intelligence, machine learning, software engineering, and cybersecurity. Students will work on real-world projects and have access to state-of-the-art research facilities.",
  requirements:
    "Bachelor's degree in Computer Science or related field, GPA 3.0+, IELTS 6.5 or TOEFL 90+, Statement of Purpose, Letters of Recommendation",
  career_prospects: "Software Engineer, Data Scientist, AI Researcher, Cybersecurity Specialist, Product Manager",
  accreditation: "ABET Accredited, European Quality Assurance",
  campus_facilities: ["Modern Labs", "Library", "Sports Center", "Student Housing", "Career Services"],
  student_life: {
    total_students: 45000,
    international_students: 12000,
    student_organizations: 200,
    housing_available: true,
  },
  admission_stats: {
    acceptance_rate: 35,
    average_gpa: 3.6,
    application_fee: 75,
  },
  costs: {
    tuition: { min: 15000, max: 20000 },
    living: { min: 800, max: 1200 },
    books: 500,
    insurance: 300,
  },
  gallery: [
    "/placeholder.svg?height=400&width=600&text=Campus+View",
    "/placeholder.svg?height=400&width=600&text=Laboratory",
    "/placeholder.svg?height=400&width=600&text=Library",
    "/placeholder.svg?height=400&width=600&text=Student+Life",
  ],
  videos: [
    { title: "Campus Tour", thumbnail: "/placeholder.svg?height=200&width=300&text=Campus+Tour", duration: "5:30" },
    {
      title: "Student Experience",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Student+Life",
      duration: "3:45",
    },
  ],
  similar_programs: [
    { id: "2", name: "MS in Data Science", university: "University of Berlin", match: 85 },
    { id: "3", name: "MS in AI", university: "ETH Zurich", match: 78 },
    { id: "4", name: "MS in Software Engineering", university: "TU Delft", match: 72 },
  ],
}

export default function GuestProgramView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [program, setProgram] = useState(mockProgram)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedImage, setSelectedImage] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview"])

  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [id])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleApply = () => {
    toast({
      title: "Registration Required",
      description: "Please register to apply for this program.",
      action: (
        <Button size="sm" onClick={() => window.open("/register", "_blank")}>
          Register Now
        </Button>
      ),
    })
  }

  const handleSave = () => {
    toast({
      title: "Registration Required",
      description: "Please register to save programs.",
      action: (
        <Button size="sm" onClick={() => window.open("/register", "_blank")}>
          Register Now
        </Button>
      ),
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Program link has been copied to clipboard.",
    })
  }

  if (isLoading) {
    return (
      <GuestModeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

          <div className="relative z-10 container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </GuestModeWrapper>
    )
  }

  return (
    <GuestModeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2 hover:bg-white/80 dark:hover:bg-slate-800/80"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Programs
            </Button>
          </motion.div>

          {/* Hero Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm overflow-hidden">
              <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=300&width=800&text=University+Campus')] bg-cover bg-center opacity-30" />

                <div className="absolute inset-0 flex items-end">
                  <div className="p-8 text-white w-full">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {program.study_level}
                          </Badge>
                          {program.ranking && (
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                              <Star className="w-3 h-3 mr-1" />#{program.ranking} Ranked
                            </Badge>
                          )}
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2 leading-tight">{program.name}</h1>
                        <div className="flex items-center gap-4 text-blue-100">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span>{program.university}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {program.location}, {program.country}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleSave}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleShare}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button onClick={handleApply} className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: Clock, label: "Duration", value: program.duration },
              {
                icon: Euro,
                label: "Tuition",
                value: `€${program.tuition_min?.toLocaleString()} - €${program.tuition_max?.toLocaleString()}`,
              },
              { icon: Languages, label: "Language", value: program.program_language },
              { icon: Calendar, label: "Deadline", value: new Date(program.application_deadline).toLocaleDateString() },
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold text-sm">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="admission">Admission</TabsTrigger>
                  <TabsTrigger value="costs">Costs</TabsTrigger>
                  <TabsTrigger value="campus">Campus</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Program Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{program.description}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Career Prospects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Graduates from this program typically pursue careers in:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {program.career_prospects.split(", ").map((career, index) => (
                          <Badge key={index} variant="outline">
                            {career}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Accreditation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{program.accreditation}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="admission" className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{program.requirements}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Admission Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {program.admission_stats.acceptance_rate}%
                          </div>
                          <div className="text-sm text-muted-foreground">Acceptance Rate</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {program.admission_stats.average_gpa}
                          </div>
                          <div className="text-sm text-muted-foreground">Average GPA</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            €{program.admission_stats.application_fee}
                          </div>
                          <div className="text-sm text-muted-foreground">Application Fee</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="costs" className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Euro className="w-5 h-5" />
                        Cost Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        {
                          label: "Tuition Fee",
                          min: program.costs.tuition.min,
                          max: program.costs.tuition.max,
                          color: "blue",
                        },
                        {
                          label: "Living Expenses",
                          min: program.costs.living.min,
                          max: program.costs.living.max,
                          color: "green",
                        },
                        { label: "Books & Materials", amount: program.costs.books, color: "purple" },
                        { label: "Health Insurance", amount: program.costs.insurance, color: "red" },
                      ].map((cost, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg"
                        >
                          <span className="font-medium">{cost.label}</span>
                          <span className="font-semibold">
                            {cost.min && cost.max
                              ? `€${cost.min.toLocaleString()} - €${cost.max.toLocaleString()}`
                              : `€${cost.amount?.toLocaleString()}`}
                          </span>
                        </div>
                      ))}

                      {program.scholarship_available && (
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                            <Award className="w-5 h-5" />
                            <span className="font-medium">Scholarships Available</span>
                          </div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            This program offers various scholarship opportunities for qualified students.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="campus" className="space-y-6">
                  {/* Image Gallery */}
                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Campus Gallery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {program.gallery.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => {
                              setSelectedImage(index)
                              setShowImageModal(true)
                            }}
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Campus view ${index + 1}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Campus Facilities */}
                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Campus Facilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {program.campus_facilities.map((facility, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{facility}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Student Life */}
                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Student Life
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {program.student_life.total_students.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Students</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {program.student_life.international_students.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">International</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {program.student_life.student_organizations}+
                          </div>
                          <div className="text-sm text-muted-foreground">Organizations</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {program.student_life.housing_available ? "Yes" : "No"}
                          </div>
                          <div className="text-sm text-muted-foreground">Housing</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Apply Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm sticky top-4">
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
                    <Button variant="outline" onClick={handleSave} className="w-full bg-transparent">
                      <Heart className="w-4 h-4 mr-2" />
                      Save Program
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open("/guest/consultation", "_blank")}
                      className="w-full"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Get Recommendations
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Application Deadline:</span>
                      <span className="font-medium">{new Date(program.application_deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Application Fee:</span>
                      <span className="font-medium">€{program.admission_stats.application_fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Time:</span>
                      <span className="font-medium">4-6 weeks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
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

              {/* Similar Programs */}
              <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Similar Programs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {program.similar_programs.map((similar, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm line-clamp-1">{similar.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {similar.match}% match
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{similar.university}</p>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => window.open("/guest/programs", "_blank")}
                  >
                    View All Programs
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative">
              <img
                src={program.gallery[selectedImage] || "/placeholder.svg"}
                alt={`Campus view ${selectedImage + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {program.gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      index === selectedImage ? "bg-white" : "bg-white/50",
                    )}
                  />
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </GuestModeWrapper>
  )
}

