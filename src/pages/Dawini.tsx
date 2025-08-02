"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Pill,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Heart,
  Zap,
  Star,
  MessageCircle,
  Calendar,
  User,
  Sparkles,
  Globe,
  HandHeart,
  Share2,
  Shield,
  Rocket,
  GroupIcon as Community,
  UserCheck,
  Gift,
  HelpCircle,
  Send,
  Lightbulb,
} from "lucide-react"

interface MedicationRequest {
  id: string
  patientName: string
  medicationName: string
  dosage: string
  urgency: "critical" | "high" | "medium" | "low"
  location: string
  contactPhone: string
  contactEmail: string
  description: string
  maxPrice?: number
  dateNeeded: string
  responses: number
  status: "active" | "fulfilled" | "expired"
  createdAt: string
  category: string
  isSharing: boolean // true if offering to share, false if requesting
  sharingType: "free" | "cost" | "exchange"
}

interface CommunityMember {
  id: string
  name: string
  location: string
  rating: number
  verified: boolean
  helpedCount: number
  joinedDate: string
  specialties: string[]
  responseTime: string
  trustScore: number
  avatar: string
}

export default function Dawini() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("community")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedUrgency, setSelectedUrgency] = useState("all")
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MedicationRequest | null>(null)

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Launch countdown effect
  useEffect(() => {
    const targetDate = new Date("2025-09-01T00:00:00").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Form states
  const [requestForm, setRequestForm] = useState({
    medicationName: "",
    dosage: "",
    urgency: "medium",
    location: "",
    contactPhone: "",
    contactEmail: "",
    description: "",
    maxPrice: "",
    dateNeeded: "",
    category: "",
    isSharing: false,
    sharingType: "free",
  })

  const mockRequests: MedicationRequest[] = [
    {
      id: "1",
      patientName: "Sarah M.",
      medicationName: "Insulin Glargine",
      dosage: "100 units/mL",
      urgency: "critical",
      location: "New York, NY",
      contactPhone: "+1-555-0123",
      contactEmail: "sarah.m@email.com",
      description:
        "I have extra insulin that I can share with someone in need. My prescription changed and I have unopened vials.",
      dateNeeded: "2024-01-15",
      responses: 8,
      status: "active",
      createdAt: "2024-01-14",
      category: "Diabetes",
      isSharing: true,
      sharingType: "free",
    },
    {
      id: "2",
      patientName: "Michael R.",
      medicationName: "Albuterol Inhaler",
      dosage: "90 mcg",
      urgency: "high",
      location: "Los Angeles, CA",
      contactPhone: "+1-555-0456",
      contactEmail: "michael.r@email.com",
      description:
        "Looking for someone who might have an extra inhaler. Willing to pay or exchange with other medications I have.",
      dateNeeded: "2024-01-16",
      responses: 3,
      status: "active",
      createdAt: "2024-01-14",
      category: "Respiratory",
      isSharing: false,
      sharingType: "cost",
    },
    {
      id: "3",
      patientName: "Emma L.",
      medicationName: "Metformin",
      dosage: "500mg",
      urgency: "medium",
      location: "Chicago, IL",
      contactPhone: "+1-555-0789",
      contactEmail: "emma.l@email.com",
      description:
        "I have extra Metformin tablets from my previous prescription. Happy to share with someone who needs them.",
      dateNeeded: "2024-01-20",
      responses: 5,
      status: "active",
      createdAt: "2024-01-13",
      category: "Diabetes",
      isSharing: true,
      sharingType: "free",
    },
  ]

  const mockCommunityMembers: CommunityMember[] = [
    {
      id: "1",
      name: "Dr. Jennifer K.",
      location: "Manhattan, NY",
      rating: 4.9,
      verified: true,
      helpedCount: 47,
      joinedDate: "2024-01-01",
      specialties: ["Diabetes Care", "Emergency Medications", "Pediatric"],
      responseTime: "< 30 minutes",
      trustScore: 98,
      avatar: "/placeholder.svg?height=40&width=40&text=JK",
    },
    {
      id: "2",
      name: "Maria S.",
      location: "Brooklyn, NY",
      rating: 4.8,
      verified: true,
      helpedCount: 32,
      joinedDate: "2024-01-05",
      specialties: ["Respiratory Care", "Chronic Conditions"],
      responseTime: "< 1 hour",
      trustScore: 95,
      avatar: "/placeholder.svg?height=40&width=40&text=MS",
    },
    {
      id: "3",
      name: "Ahmed H.",
      location: "Queens, NY",
      rating: 4.7,
      verified: true,
      helpedCount: 28,
      joinedDate: "2024-01-10",
      specialties: ["General Medicine", "Emergency Support"],
      responseTime: "< 2 hours",
      trustScore: 92,
      avatar: "/placeholder.svg?height=40&width=40&text=AH",
    },
  ]

  const categories = ["all", "Diabetes", "Respiratory", "Cardiology", "Neurology", "Oncology", "Pediatric", "Emergency"]
  const urgencyLevels = ["all", "critical", "high", "medium", "low"]

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || request.category === selectedCategory
    const matchesUrgency = selectedUrgency === "all" || request.urgency === selectedUrgency

    return matchesSearch && matchesCategory && matchesUrgency
  })

  const handleSubmitRequest = () => {
    if (!requestForm.medicationName || !requestForm.contactPhone || !requestForm.contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Request Posted Successfully",
      description: requestForm.isSharing
        ? "Your sharing offer has been posted to the community!"
        : "Your request has been posted. Community members will reach out to help!",
    })

    setIsRequestDialogOpen(false)
    setRequestForm({
      medicationName: "",
      dosage: "",
      urgency: "medium",
      location: "",
      contactPhone: "",
      contactEmail: "",
      description: "",
      maxPrice: "",
      dateNeeded: "",
      category: "",
      isSharing: false,
      sharingType: "free",
    })
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      case "high":
        return <Zap className="h-4 w-4" />
      case "medium":
        return <Clock className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const CountdownCard = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
        <div className="text-center">
          <motion.div
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white mb-2"
          >
            {value.toString().padStart(2, "0")}
          </motion.div>
          <div className="text-blue-100 text-sm uppercase tracking-wider font-medium">{label}</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-2xl blur-xl -z-10" />
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      {/* Hero Section with Countdown */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px] animate-pulse" />
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"
          />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Logo Animation */}
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.5 }}
                className="relative"
              >
                <div className="p-6 bg-gradient-to-br from-white/20 to-white/5 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <HandHeart className="h-20 w-20 text-amber-300" />
                  </motion.div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-pink-400/20 rounded-full blur-2xl -z-10" />
              </motion.div>
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
            >
              Dawini
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl md:text-3xl mb-4 text-blue-100 font-light"
            >
              Community Medication Sharing
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-lg md:text-xl mb-12 text-blue-200 max-w-3xl mx-auto leading-relaxed"
            >
              A revolutionary community platform where people help each other by sharing medications, offering support,
              and building connections. Together, we make healthcare more accessible for everyone.
            </motion.p>

            {/* Launch Countdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mb-12"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Rocket className="h-6 w-6 text-amber-300" />
                <span className="text-xl font-semibold text-amber-100">Launching Soon</span>
              </div>

              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                <CountdownCard value={timeLeft.days} label="Days" />
                <CountdownCard value={timeLeft.hours} label="Hours" />
                <CountdownCard value={timeLeft.minutes} label="Minutes" />
                <CountdownCard value={timeLeft.seconds} label="Seconds" />
              </div>

              <div className="text-center">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 text-lg font-semibold">
                  <Calendar className="h-4 w-4 mr-2" />
                  September 1st, 2025
                </Badge>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-4 text-lg shadow-2xl hover:shadow-amber-500/25 transition-all duration-300"
                onClick={() => setIsJoinDialogOpen(true)}
              >
                <Heart className="mr-2 h-5 w-5" />
                Join the Community
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent backdrop-blur-sm"
                onClick={() => setIsRequestDialogOpen(true)}
              >
                <Share2 className="mr-2 h-5 w-5" />
                Preview Platform
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Community Values Section */}
      <div className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Built on Community Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Dawini is more than a platform—it's a movement of people helping people, creating a world where no one
              goes without essential medications.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <HandHeart className="h-12 w-12" />,
                title: "Peer-to-Peer Sharing",
                description:
                  "Community members directly help each other by sharing extra medications, creating genuine human connections.",
                color: "from-pink-500 to-rose-500",
                bgColor: "from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20",
              },
              {
                icon: <Shield className="h-12 w-12" />,
                title: "Trust & Safety",
                description:
                  "Built-in verification system and community ratings ensure safe, reliable medication sharing experiences.",
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
              },
              {
                icon: <Globe className="h-12 w-12" />,
                title: "Global Impact",
                description:
                  "Creating a worldwide network of compassionate individuals making healthcare accessible to all.",
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${item.bgColor} border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-lg`}
                >
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">{item.description}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">How Dawini Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple steps to connect, share, and help your community access essential medications
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Join Community",
                  description: "Sign up and become part of our trusted medication sharing network",
                  icon: <UserCheck className="h-8 w-8" />,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  step: "2",
                  title: "Share or Request",
                  description: "Post what you can share or what you need from community members",
                  icon: <Share2 className="h-8 w-8" />,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  step: "3",
                  title: "Connect Directly",
                  description: "Community members reach out to each other directly to coordinate",
                  icon: <MessageCircle className="h-8 w-8" />,
                  color: "from-green-500 to-emerald-500",
                },
                {
                  step: "4",
                  title: "Help & Be Helped",
                  description: "Complete the exchange and build lasting community connections",
                  icon: <Heart className="h-8 w-8" />,
                  color: "from-orange-500 to-red-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative text-center group"
                >
                  {/* Connection Line */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 z-0" />
                  )}

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                    >
                      {item.icon}
                    </motion.div>

                    <div className="mb-4">
                      <span className="inline-block w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full text-gray-700 dark:text-gray-300 font-bold text-lg flex items-center justify-center mb-3 shadow-lg">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Platform Preview
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get a glimpse of how our community will connect and share medications
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
              <TabsTrigger value="community" className="flex items-center gap-2 rounded-xl">
                <Users className="h-4 w-4" />
                Community Posts
              </TabsTrigger>
              <TabsTrigger value="sharing" className="flex items-center gap-2 rounded-xl">
                <Gift className="h-4 w-4" />
                Sharing Offers
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2 rounded-xl">
                <Community className="h-4 w-4" />
                Members
              </TabsTrigger>
            </TabsList>

            <TabsContent value="community" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <Card
                        className={`h-full transition-all duration-300 hover:shadow-xl ${
                          request.isSharing
                            ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800"
                            : "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={`${getUrgencyColor(request.urgency)} text-white flex items-center gap-1`}>
                              {getUrgencyIcon(request.urgency)}
                              {request.urgency.toUpperCase()}
                            </Badge>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs">
                                {request.category}
                              </Badge>
                              <Badge className={request.isSharing ? "bg-green-500" : "bg-blue-500"}>
                                {request.isSharing ? (
                                  <>
                                    <Gift className="h-3 w-3 mr-1" />
                                    Sharing
                                  </>
                                ) : (
                                  <>
                                    <HelpCircle className="h-3 w-3 mr-1" />
                                    Requesting
                                  </>
                                )}
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-lg">{request.medicationName}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {request.patientName}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          <div className="text-sm space-y-2">
                            <div className="flex items-center gap-2">
                              <Pill className="h-4 w-4 text-purple-500" />
                              <span className="font-medium">Dosage:</span> {request.dosage}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-green-500" />
                              <span className="font-medium">Location:</span> {request.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Date:</span> {request.dateNeeded}
                            </div>
                            {request.sharingType && (
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-amber-500" />
                                <span className="font-medium">Type:</span>
                                <Badge variant="secondary" className="text-xs">
                                  {request.sharingType === "free"
                                    ? "Free"
                                    : request.sharingType === "cost"
                                      ? "Cost Sharing"
                                      : "Exchange"}
                                </Badge>
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{request.description}</p>

                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {request.responses} responses
                            </span>
                            <span>{request.createdAt}</span>
                          </div>

                          <Button className="w-full mt-4" variant={request.isSharing ? "default" : "outline"}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            {request.isSharing ? "Request This" : "Offer Help"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="sharing" className="space-y-6">
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Gift className="h-12 w-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sharing Economy</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Community members can offer medications they have extra of, creating a sustainable sharing ecosystem
                  where everyone benefits from collective resources.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockCommunityMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {member.verified && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{member.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {member.location}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(member.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm font-medium ml-1">{member.rating}</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Trust: {member.trustScore}%
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span>Helped {member.helpedCount} people</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>Response: {member.responseTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-500" />
                            <span>Joined {member.joinedDate}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Specialties:</p>
                          <div className="flex flex-wrap gap-1">
                            {member.specialties.map((specialty, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full bg-transparent" variant="outline">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Connect
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Join Community Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Join the Dawini Community
            </DialogTitle>
            <DialogDescription>
              Be part of the movement to make medications accessible through community sharing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Early Access Registration</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Register now to get early access when we launch and be among the first to join our community.
              </p>
              <div className="space-y-3">
                <Input placeholder="Your email address" type="email" />
                <Input placeholder="Your location (city, country)" />
                <Textarea placeholder="Tell us why you want to join Dawini..." rows={3} />
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Send className="mr-2 h-4 w-4" />
                Register for Early Access
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-500" />
              Platform Preview - Post Request
            </DialogTitle>
            <DialogDescription>
              This is a preview of how community members will post sharing offers and requests.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                <strong>Preview Mode:</strong> This is a demonstration of the platform features. Actual functionality
                will be available at launch.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <input
                type="checkbox"
                id="isSharing"
                checked={requestForm.isSharing}
                onChange={(e) => setRequestForm({ ...requestForm, isSharing: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <Label htmlFor="isSharing" className="text-sm font-medium">
                I'm offering to share medication (check this if you have extra medication to share)
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicationName">Medication Name *</Label>
                <Input
                  id="medicationName"
                  placeholder="e.g., Insulin Glargine"
                  value={requestForm.medicationName}
                  onChange={(e) => setRequestForm({ ...requestForm, medicationName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 100 units/mL"
                  value={requestForm.dosage}
                  onChange={(e) => setRequestForm({ ...requestForm, dosage: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={requestForm.category}
                  onValueChange={(value) => setRequestForm({ ...requestForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat !== "all")
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select
                  value={requestForm.urgency}
                  onValueChange={(value) => setRequestForm({ ...requestForm, urgency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {requestForm.isSharing && (
              <div className="space-y-2">
                <Label htmlFor="sharingType">Sharing Type</Label>
                <Select
                  value={requestForm.sharingType}
                  onValueChange={(value) => setRequestForm({ ...requestForm, sharingType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free - No cost</SelectItem>
                    <SelectItem value="cost">Cost Sharing - Split the cost</SelectItem>
                    <SelectItem value="exchange">Exchange - Trade for other medication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State/Country"
                value={requestForm.location}
                onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{requestForm.isSharing ? "Sharing Details" : "Request Details"}</Label>
              <Textarea
                id="description"
                placeholder={
                  requestForm.isSharing
                    ? "Describe what you're sharing, expiration dates, storage conditions, etc..."
                    : "Describe your situation, any specific requirements, or additional information..."
                }
                value={requestForm.description}
                onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number *</Label>
                <Input
                  id="contactPhone"
                  placeholder="+1-555-0123"
                  value={requestForm.contactPhone}
                  onChange={(e) => setRequestForm({ ...requestForm, contactPhone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={requestForm.contactEmail}
                  onChange={(e) => setRequestForm({ ...requestForm, contactEmail: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
              Close Preview
            </Button>
            <Button
              onClick={handleSubmitRequest}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Send className="mr-2 h-4 w-4" />
              Preview Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

