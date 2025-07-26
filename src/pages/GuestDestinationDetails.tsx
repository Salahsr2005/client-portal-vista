"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  MapPin,
  Globe,
  Users,
  GraduationCap,
  Shield,
  Thermometer,
  Briefcase,
  Star,
  Share2,
  Heart,
  Download,
  ExternalLink,
  Building,
  Plane,
  CheckCircle,
} from "lucide-react"
import { GuestModeWrapper } from "@/components/layout/GuestModeWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDestinations } from "@/hooks/useDestinations"

interface Destination {
  id: string
  name: string
  country: string
  description: string
  cost_of_living: number
  language: string
  visa_requirements: string
  climate: string
  safety_rating: number
  education_quality: number
  job_opportunities: number
  cultural_diversity: number
  image_url?: string
  popular_programs: string[]
  universities_count: number
  international_students: number
  work_permit_available: boolean
  scholarship_opportunities: boolean
  living_costs: {
    accommodation: number
    food: number
    transport: number
    utilities: number
  }
  top_universities: string[]
  cultural_attractions: string[]
  job_market: {
    unemployment_rate: number
    average_salary: number
    top_industries: string[]
  }
}

export default function GuestDestinationDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { destinations, loading } = useDestinations()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (destinations && id) {
      const foundDestination = destinations.find((d) => d.id === id)
      setDestination(foundDestination || null)
    }
  }, [destinations, id])

  const handleBack = () => {
    navigate("/guest/destinations")
  }

  const handleSignUp = () => {
    navigate("/register")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: destination?.name,
          text: `Check out this study destination: ${destination?.name}, ${destination?.country}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <GuestModeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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

  if (!destination) {
    return (
      <GuestModeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 py-16 text-center">
            <MapPin className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Destination Not Found</h1>
            <p className="text-muted-foreground mb-8">The destination you're looking for doesn't exist.</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Destinations
            </Button>
          </div>
        </div>
      </GuestModeWrapper>
    )
  }

  return (
    <GuestModeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Destinations
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
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-blue-600/10 to-purple-600/10" />
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Destination Image */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-green-500 via-blue-500 to-purple-500">
                    {destination.image_url ? (
                      <img
                        src={destination.image_url || "/placeholder.svg"}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-24 h-24 text-white/80" />
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {destination.work_permit_available && (
                      <Badge className="bg-blue-500 hover:bg-blue-600">
                        <Briefcase className="w-3 h-3 mr-1" />
                        Work Permit
                      </Badge>
                    )}
                    {destination.scholarship_opportunities && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <Star className="w-3 h-3 mr-1" />
                        Scholarships
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-1 text-white">
                      <Shield className="w-4 h-4" />
                      <span className="font-semibold">Safety: {destination.safety_rating}/5</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Destination Info */}
              <div className="lg:col-span-2">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {destination.name}
                    </h1>
                    <div className="flex items-center gap-2 text-xl text-muted-foreground mb-4">
                      <MapPin className="w-5 h-5" />
                      {destination.country}
                    </div>
                    <div className="flex flex-wrap gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {destination.language}
                      </div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-4 h-4" />
                        {destination.climate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {destination.international_students}% International
                      </div>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-green-600 mb-1">${destination.cost_of_living}</div>
                      <div className="text-sm text-muted-foreground">Monthly Cost</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{destination.universities_count}</div>
                      <div className="text-sm text-muted-foreground">Universities</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{destination.safety_rating}/5</div>
                      <div className="text-sm text-muted-foreground">Safety Rating</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-orange-600 mb-1">{destination.education_quality}/5</div>
                      <div className="text-sm text-muted-foreground">Education Quality</div>
                    </Card>
                  </div>

                  {/* Quality Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Education Quality</span>
                          <span>{destination.education_quality}/5</span>
                        </div>
                        <Progress value={(destination.education_quality / 5) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Job Opportunities</span>
                          <span>{destination.job_opportunities}/5</span>
                        </div>
                        <Progress value={(destination.job_opportunities / 5) * 100} className="h-2" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Cultural Diversity</span>
                          <span>{destination.cultural_diversity}/5</span>
                        </div>
                        <Progress value={(destination.cultural_diversity / 5) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Safety Rating</span>
                          <span>{destination.safety_rating}/5</span>
                        </div>
                        <Progress value={(destination.safety_rating / 5) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-4">
                    <Button
                      size="lg"
                      onClick={handleSignUp}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Start Application
                    </Button>
                    <Button variant="outline" size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      Download Guide
                    </Button>
                    <Button variant="outline" size="lg">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Official Website
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
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="living">Living</TabsTrigger>
                <TabsTrigger value="visa">Visa & Work</TabsTrigger>
                <TabsTrigger value="culture">Culture</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>About {destination.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {destination.description ||
                            `${destination.name} is a vibrant destination for international students, offering world-class education, rich cultural experiences, and excellent career opportunities. With its welcoming atmosphere and diverse community, it provides an ideal environment for academic and personal growth.`}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Why Choose {destination.name}?</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>High-quality education system</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>Multicultural environment</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>Strong job market</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>Safe and welcoming</span>
                          </div>
                          {destination.work_permit_available && (
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span>Work permit opportunities</span>
                            </div>
                          )}
                          {destination.scholarship_opportunities && (
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span>Scholarship opportunities</span>
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
                          <span className="text-muted-foreground">Language:</span>
                          <span className="font-medium">{destination.language}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Climate:</span>
                          <span className="font-medium">{destination.climate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Universities:</span>
                          <span className="font-medium">{destination.universities_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">International Students:</span>
                          <span className="font-medium">{destination.international_students}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monthly Cost:</span>
                          <span className="font-medium">${destination.cost_of_living}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Popular Programs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {(
                            destination.popular_programs || ["Business", "Engineering", "Computer Science", "Medicine"]
                          ).map((program, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">{program}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Alert>
                      <MapPin className="h-4 w-4" />
                      <AlertDescription>
                        Sign up to get personalized guidance for studying in {destination.name}.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Universities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(
                          destination.top_universities || [
                            "University of Excellence",
                            "International Institute of Technology",
                            "Metropolitan University",
                            "National Academy of Sciences",
                          ]
                        ).map((university, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <Building className="w-5 h-5 text-blue-500" />
                            <div>
                              <div className="font-medium">{university}</div>
                              <div className="text-sm text-muted-foreground">Ranking: #{index + 1} nationally</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Education System</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Academic Year</h4>
                          <p className="text-sm text-muted-foreground">
                            The academic year typically runs from September to June, divided into two semesters.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Grading System</h4>
                          <p className="text-sm text-muted-foreground">
                            Most institutions use a GPA system or letter grades (A-F) for assessment.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Language Requirements</h4>
                          <p className="text-sm text-muted-foreground">
                            Proficiency in {destination.language} is required, with IELTS/TOEFL scores for English
                            programs.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Application Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        {
                          step: 1,
                          title: "Research Programs",
                          description: "Explore universities and programs that match your interests.",
                        },
                        {
                          step: 2,
                          title: "Prepare Documents",
                          description: "Gather transcripts, test scores, and recommendation letters.",
                        },
                        {
                          step: 3,
                          title: "Submit Applications",
                          description: "Apply to your chosen universities before deadlines.",
                        },
                        {
                          step: 4,
                          title: "Receive Offers",
                          description: "Review admission offers and make your final decision.",
                        },
                      ].map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{item.step}</span>
                          </div>
                          <h4 className="font-semibold mb-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="living" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cost of Living Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            category: "Accommodation",
                            amount: destination.living_costs?.accommodation || 800,
                            icon: Building,
                          },
                          { category: "Food", amount: destination.living_costs?.food || 400, icon: Users },
                          { category: "Transport", amount: destination.living_costs?.transport || 100, icon: Plane },
                          { category: "Utilities", amount: destination.living_costs?.utilities || 150, icon: Globe },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-5 h-5 text-blue-500" />
                              <span className="font-medium">{item.category}</span>
                            </div>
                            <span className="font-bold">${item.amount}/month</span>
                          </div>
                        ))}
                        <div className="border-t pt-3">
                          <div className="flex items-center justify-between font-bold text-lg">
                            <span>Total Monthly Cost</span>
                            <span className="text-green-600">${destination.cost_of_living}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Accommodation Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            type: "University Dormitory",
                            price: "$600-900",
                            description: "On-campus housing with meal plans",
                          },
                          {
                            type: "Shared Apartment",
                            price: "$500-800",
                            description: "Private room in shared accommodation",
                          },
                          { type: "Studio Apartment", price: "$800-1200", description: "Independent living space" },
                          { type: "Homestay", price: "$700-1000", description: "Living with a local family" },
                        ].map((option, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{option.type}</h4>
                              <span className="text-green-600 font-bold">{option.price}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Student Life</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Transportation</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Student discounts on public transport</li>
                          <li>• Bike-friendly cities</li>
                          <li>• Campus shuttle services</li>
                          <li>• Car sharing options</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Healthcare</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Student health insurance</li>
                          <li>• Campus health centers</li>
                          <li>• Mental health support</li>
                          <li>• Emergency services</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Recreation</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Sports facilities</li>
                          <li>• Cultural events</li>
                          <li>• Student clubs</li>
                          <li>• Weekend activities</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visa" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Visa Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          {destination.visa_requirements ||
                            "Student visa requirements vary by nationality. Most international students need to apply for a student visa before arrival."}
                        </p>
                        <div className="space-y-3">
                          <h4 className="font-semibold">Required Documents:</h4>
                          <ul className="space-y-2">
                            {[
                              "Valid passport",
                              "Letter of acceptance from university",
                              "Proof of financial support",
                              "Health insurance",
                              "Academic transcripts",
                              "Language proficiency test results",
                            ].map((doc, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Work Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {destination.work_permit_available ? (
                          <>
                            <div className="flex items-center gap-2 text-green-600 mb-3">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-semibold">Work permit available for students</span>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold mb-2">During Studies</h4>
                                <p className="text-sm text-muted-foreground">
                                  Students can typically work 20 hours per week during term time and full-time during
                                  holidays.
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">After Graduation</h4>
                                <p className="text-sm text-muted-foreground">
                                  Graduates may be eligible for post-study work visas to gain professional experience.
                                </p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">
                              Work permit information not available. Contact us for specific details.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {destination.job_market && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Market Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            {destination.job_market.unemployment_rate}%
                          </div>
                          <div className="text-sm text-muted-foreground">Unemployment Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            ${destination.job_market.average_salary?.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Average Salary</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-2">
                            {destination.job_market.top_industries?.length || 5}+
                          </div>
                          <div className="text-sm text-muted-foreground">Top Industries</div>
                        </div>
                      </div>
                      {destination.job_market.top_industries && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">Top Industries</h4>
                          <div className="flex flex-wrap gap-2">
                            {destination.job_market.top_industries.map((industry, index) => (
                              <Badge key={index} variant="secondary">
                                {industry}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="culture" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cultural Attractions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(
                          destination.cultural_attractions || [
                            "Historic City Center",
                            "National Museum",
                            "Cultural Festival",
                            "Art Galleries",
                            "Music Venues",
                            "Traditional Markets",
                          ]
                        ).map((attraction, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span>{attraction}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Local Culture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Language & Communication</h4>
                          <p className="text-sm text-muted-foreground">
                            {destination.language} is the primary language. English is widely spoken in academic and
                            business settings.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Social Customs</h4>
                          <p className="text-sm text-muted-foreground">
                            The local culture is welcoming to international students with a rich tradition of
                            hospitality and inclusiveness.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Climate & Weather</h4>
                          <p className="text-sm text-muted-foreground">
                            {destination.climate} climate provides comfortable living conditions year-round.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>International Student Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Student Organizations</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• International Student Association</li>
                          <li>• Cultural clubs and societies</li>
                          <li>• Academic and professional groups</li>
                          <li>• Sports and recreation clubs</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Support Services</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Orientation programs</li>
                          <li>• Academic support</li>
                          <li>• Career counseling</li>
                          <li>• Cultural integration activities</li>
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
        <section className="py-16 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-white"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Study in {destination.name}?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of international students who have made {destination.name} their academic home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={handleSignUp}>
                  Start Your Application
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  Download Country Guide
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </GuestModeWrapper>
  )
}
