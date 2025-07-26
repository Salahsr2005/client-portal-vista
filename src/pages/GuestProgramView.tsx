"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  BookOpen,
  Award,
  CheckCircle,
  AlertCircle,
  Star,
  Share2,
  Heart,
  Download,
  ExternalLink,
  GraduationCap,
  Building,
  Languages,
} from "lucide-react"
import { GuestModeWrapper } from "@/components/layout/GuestModeWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePrograms } from "@/hooks/usePrograms"

interface Program {
  id: string
  name: string
  university: string
  country: string
  city: string
  level: string
  field: string
  language: string
  tuition_fee: number
  duration: string
  description: string
  requirements: string[]
  scholarship_available: boolean
  application_deadline: string
  ranking: number
  image_url?: string
  university_ranking?: number
  accreditation: string[]
  career_prospects: string[]
  admission_rate: number
  international_students: number
  campus_facilities: string[]
  research_opportunities: boolean
}

export default function GuestProgramView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { programs, loading } = usePrograms()
  const [program, setProgram] = useState<Program | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (programs && id) {
      const foundProgram = programs.find((p) => p.id === id)
      setProgram(foundProgram || null)
    }
  }, [programs, id])

  const handleBack = () => {
    navigate("/guest/programs")
  }

  const handleSignUp = () => {
    navigate("/register")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: program?.name,
          text: `Check out this program: ${program?.name} at ${program?.university}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <GuestModeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </GuestModeWrapper>
    )
  }

  if (!program) {
    return (
      <GuestModeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 py-16 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
            <p className="text-muted-foreground mb-8">The program you're looking for doesn't exist.</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Programs
            </Button>
          </div>
        </div>
      </GuestModeWrapper>
    )
  }

  return (
    <GuestModeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Programs
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Program Image */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                    {program.image_url ? (
                      <img
                        src={program.image_url || "/placeholder.svg"}
                        alt={program.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="w-24 h-24 text-white/80" />
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {program.scholarship_available && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <Award className="w-3 h-3 mr-1" />
                        Scholarship
                      </Badge>
                    )}
                    {program.ranking && program.ranking <= 100 && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        Top {program.ranking}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Program Info */}
              <div className="lg:col-span-2">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {program.name}
                    </h1>
                    <div className="flex items-center gap-2 text-xl text-muted-foreground mb-4">
                      <Building className="w-5 h-5" />
                      {program.university}
                    </div>
                    <div className="flex flex-wrap gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {program.city}, {program.country}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {program.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Languages className="w-4 h-4" />
                        {program.language}
                      </div>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        ${program.tuition_fee.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Annual Tuition</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{program.admission_rate || 75}%</div>
                      <div className="text-sm text-muted-foreground">Admission Rate</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-pink-600 mb-1">
                        {program.international_students || 25}%
                      </div>
                      <div className="text-sm text-muted-foreground">International</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-green-600 mb-1">#{program.university_ranking || 150}</div>
                      <div className="text-sm text-muted-foreground">University Rank</div>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-4">
                    <Button
                      size="lg"
                      onClick={handleSignUp}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Apply Now
                    </Button>
                    <Button variant="outline" size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      Download Brochure
                    </Button>
                    <Button variant="outline" size="lg">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      University Website
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="career">Career</TabsTrigger>
                <TabsTrigger value="campus">Campus</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Program Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {program.description ||
                            "This comprehensive program offers students the opportunity to gain in-depth knowledge and practical skills in their chosen field. With a focus on both theoretical understanding and hands-on experience, graduates will be well-prepared for successful careers in the industry."}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Program Highlights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>Industry-relevant curriculum</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>Expert faculty</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>Modern facilities</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>Career support</span>
                          </div>
                          {program.research_opportunities && (
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span>Research opportunities</span>
                            </div>
                          )}
                          {program.scholarship_available && (
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span>Scholarship available</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Facts</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Level:</span>
                          <Badge variant="secondary">{program.level}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Field:</span>
                          <span className="font-medium">{program.field}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{program.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Language:</span>
                          <span className="font-medium">{program.language}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Application Deadline:</span>
                          <span className="font-medium">{program.application_deadline || "Rolling"}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Accreditation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {(program.accreditation || ["AACSB", "EQUIS"]).map((acc, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{acc}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Sign up to access detailed application requirements and submit your application.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Admission Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(
                        program.requirements || [
                          "Bachelor's degree in relevant field",
                          "Minimum GPA of 3.0",
                          "English proficiency test (IELTS/TOEFL)",
                          "Statement of purpose",
                          "Letters of recommendation",
                          "CV/Resume",
                        ]
                      ).map((req, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Application Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          step: 1,
                          title: "Submit Online Application",
                          description: "Complete the online application form with all required information.",
                        },
                        {
                          step: 2,
                          title: "Upload Documents",
                          description: "Upload all required documents including transcripts and certificates.",
                        },
                        {
                          step: 3,
                          title: "Pay Application Fee",
                          description: "Pay the non-refundable application fee to process your application.",
                        },
                        {
                          step: 4,
                          title: "Interview (if required)",
                          description: "Some programs may require an interview as part of the selection process.",
                        },
                        {
                          step: 5,
                          title: "Admission Decision",
                          description: "Receive your admission decision within 4-6 weeks.",
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{item.step}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Curriculum Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          year: "Year 1",
                          courses: ["Foundation Courses", "Core Subjects", "Research Methods", "Academic Writing"],
                        },
                        {
                          year: "Year 2",
                          courses: [
                            "Advanced Topics",
                            "Specialization Courses",
                            "Practical Projects",
                            "Industry Collaboration",
                          ],
                        },
                        {
                          year: "Final Year",
                          courses: ["Thesis/Dissertation", "Capstone Project", "Internship", "Career Preparation"],
                        },
                      ].map((yearData, index) => (
                        <div key={index}>
                          <h4 className="font-semibold text-lg mb-3">{yearData.year}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {yearData.courses.map((course, courseIndex) => (
                              <div
                                key={courseIndex}
                                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                              >
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                <span className="text-sm">{course}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="career" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Career Prospects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Career Opportunities</h4>
                        <div className="space-y-2">
                          {(
                            program.career_prospects || [
                              "Senior Analyst",
                              "Project Manager",
                              "Consultant",
                              "Research Specialist",
                              "Team Leader",
                            ]
                          ).map((career, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-green-500" />
                              <span className="text-sm">{career}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Employment Statistics</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Employment Rate</span>
                              <span>95%</span>
                            </div>
                            <Progress value={95} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Average Starting Salary</span>
                              <span>$65,000</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="campus" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Campus Facilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(
                        program.campus_facilities || [
                          "Modern Library",
                          "Computer Labs",
                          "Research Centers",
                          "Sports Complex",
                          "Student Housing",
                          "Dining Facilities",
                          "Health Center",
                          "Career Services",
                          "International Office",
                        ]
                      ).map((facility, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Building className="w-5 h-5 text-blue-500" />
                          <span className="text-sm">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Student Life</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Experience a vibrant campus life with numerous opportunities for personal and professional growth.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Student Organizations</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Academic clubs and societies</li>
                          <li>• Cultural and international groups</li>
                          <li>• Sports and recreation clubs</li>
                          <li>• Professional associations</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Support Services</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Academic advising</li>
                          <li>• Career counseling</li>
                          <li>• Mental health support</li>
                          <li>• International student services</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-white"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of students who have started their journey with us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={handleSignUp}>
                  Create Account & Apply
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  Download Program Guide
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </GuestModeWrapper>
  )
}
