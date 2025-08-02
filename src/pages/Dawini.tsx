"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Sparkles,
  Globe,
  HandHeart,
  Share2,
  Shield,
  Rocket,
  GroupIcon as Community,
  UserCheck,
  Gift,
  Send,
  Lightbulb,
  ArrowRight,
  Waves,
  Compass,
  Phone,
  Mail,
  Plus,
  Minus,
  TrendingUp,
  BookOpen,
  Building,
  ThumbsUp,
  Eye,
  Activity,
  Search,
  DollarSign,
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
  isSharing: boolean
  sharingType: "free" | "cost" | "exchange"
  avatar: string
  trustScore: number
  helpedCount: number
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
  isOnline: boolean
  lastSeen: string
  totalShared: number
  totalReceived: number
}

export default function Dawini() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("community")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedUrgency, setSelectedUrgency] = useState("all")
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MedicationRequest | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

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
        "I have extra insulin that I can share with someone in need. My prescription changed and I have unopened vials that expire in 6 months. Happy to help someone in my community.",
      dateNeeded: "2024-01-15",
      responses: 12,
      status: "active",
      createdAt: "2 hours ago",
      category: "Diabetes",
      isSharing: true,
      sharingType: "free",
      avatar: "/placeholder.svg?height=40&width=40&text=SM",
      trustScore: 98,
      helpedCount: 23,
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
        "Looking for someone who might have an extra inhaler. My son's inhaler is running low and we're between insurance coverage. Willing to pay or exchange with other medications I have.",
      dateNeeded: "2024-01-16",
      responses: 8,
      status: "active",
      createdAt: "4 hours ago",
      category: "Respiratory",
      isSharing: false,
      sharingType: "cost",
      avatar: "/placeholder.svg?height=40&width=40&text=MR",
      trustScore: 95,
      helpedCount: 15,
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
        "I have extra Metformin tablets from my previous prescription. My doctor changed my dosage and I have a full bottle left. Happy to share with someone who needs them.",
      dateNeeded: "2024-01-20",
      responses: 6,
      status: "active",
      createdAt: "1 day ago",
      category: "Diabetes",
      isSharing: true,
      sharingType: "free",
      avatar: "/placeholder.svg?height=40&width=40&text=EL",
      trustScore: 92,
      helpedCount: 18,
    },
    {
      id: "4",
      patientName: "David K.",
      medicationName: "Lisinopril",
      dosage: "10mg",
      urgency: "low",
      location: "Houston, TX",
      contactPhone: "+1-555-0321",
      contactEmail: "david.k@email.com",
      description:
        "Need help finding Lisinopril. My pharmacy is out of stock and won't have it for another week. Can exchange with blood pressure medications I have or cover costs.",
      dateNeeded: "2024-01-25",
      responses: 4,
      status: "active",
      createdAt: "6 hours ago",
      category: "Cardiology",
      isSharing: false,
      sharingType: "exchange",
      avatar: "/placeholder.svg?height=40&width=40&text=DK",
      trustScore: 89,
      helpedCount: 11,
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
      joinedDate: "January 2024",
      specialties: ["Diabetes Care", "Emergency Medications", "Pediatric"],
      responseTime: "< 30 minutes",
      trustScore: 98,
      avatar: "/placeholder.svg?height=40&width=40&text=JK",
      isOnline: true,
      lastSeen: "now",
      totalShared: 52,
      totalReceived: 8,
    },
    {
      id: "2",
      name: "Maria S.",
      location: "Brooklyn, NY",
      rating: 4.8,
      verified: true,
      helpedCount: 32,
      joinedDate: "January 2024",
      specialties: ["Respiratory Care", "Chronic Conditions"],
      responseTime: "< 1 hour",
      trustScore: 95,
      avatar: "/placeholder.svg?height=40&width=40&text=MS",
      isOnline: false,
      lastSeen: "2 hours ago",
      totalShared: 38,
      totalReceived: 12,
    },
    {
      id: "3",
      name: "Ahmed H.",
      location: "Queens, NY",
      rating: 4.7,
      verified: true,
      helpedCount: 28,
      joinedDate: "January 2024",
      specialties: ["General Medicine", "Emergency Support"],
      responseTime: "< 2 hours",
      trustScore: 92,
      avatar: "/placeholder.svg?height=40&width=40&text=AH",
      isOnline: true,
      lastSeen: "now",
      totalShared: 31,
      totalReceived: 15,
    },
  ]

  const categories = ["all", "Diabetes", "Respiratory", "Cardiology", "Neurology", "Oncology", "Pediatric", "Emergency"]
  const urgencyLevels = ["all", "critical", "high", "medium", "low"]

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || request.category === selectedCategory
    const matchesUrgency = selectedUrgency === "all" || request.urgency === selectedUrgency

    return matchesSearch && matchesCategory && matchesUrgency
  })

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId)
    } else {
      newExpanded.add(cardId)
    }
    setExpandedCards(newExpanded)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "from-red-500 to-pink-500"
      case "high":
        return "from-orange-500 to-red-500"
      case "medium":
        return "from-yellow-500 to-orange-500"
      case "low":
        return "from-green-500 to-emerald-500"
      default:
        return "from-gray-500 to-slate-500"
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
      className="relative group"
    >
      <div className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/30 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
        <div className="text-center">
          <motion.div
            key={value}
            initial={{ y: -20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.5 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg"
          >
            {value.toString().padStart(2, "0")}
          </motion.div>
          <div className="text-blue-100 text-sm sm:text-base uppercase tracking-wider font-semibold">{label}</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl -z-10 group-hover:from-blue-400/30 group-hover:to-purple-400/30 transition-all duration-500" />
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden">
      {/* Advanced Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section with Advanced Countdown */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
        {/* Advanced Animated Background Pattern */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:60px_60px]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        </div>

        <div className="relative container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Advanced Logo Animation */}
            <div className="flex justify-center mb-8 sm:mb-12">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, type: "spring", bounce: 0.6 }}
                className="relative"
              >
                <div className="p-6 sm:p-8 bg-gradient-to-br from-white/20 to-white/5 rounded-full backdrop-blur-2xl border border-white/20 shadow-2xl">
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                      scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                    }}
                  >
                    <HandHeart className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-amber-300" />
                  </motion.div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-pink-400/30 rounded-full blur-3xl -z-10" />

                {/* Floating Hearts */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    animate={{
                      y: [-20, -40, -20],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                    }}
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + (i % 2) * 20}%`,
                    }}
                  >
                    <Heart className="h-4 w-4 text-pink-300 fill-current" />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Enhanced Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl sm:text-8xl lg:text-9xl font-bold mb-6 sm:mb-8"
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
                Dawini
              </span>
            </motion.h1>

            {/* Enhanced Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-6 sm:mb-8"
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl mb-4 text-blue-100 font-light">
                Community Medication Sharing
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm"
                >
                  <Users className="h-5 w-5 text-cyan-300" />
                  <span className="text-cyan-100 font-medium">Peer-to-Peer</span>
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm"
                >
                  <Shield className="h-5 w-5 text-green-300" />
                  <span className="text-green-100 font-medium">Trusted</span>
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm"
                >
                  <Globe className="h-5 w-5 text-purple-300" />
                  <span className="text-purple-100 font-medium">Global</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-lg sm:text-xl lg:text-2xl mb-12 sm:mb-16 text-blue-200 max-w-4xl mx-auto leading-relaxed"
            >
              A revolutionary community platform where people help each other by sharing medications, offering support,
              and building connections. Together, we make healthcare more accessible for everyone.
            </motion.p>

            {/* Advanced Launch Countdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mb-12 sm:mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Rocket className="h-8 w-8 text-amber-300" />
                </motion.div>
                <span className="text-2xl sm:text-3xl font-bold text-amber-100">Launching Soon</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Sparkles className="h-8 w-8 text-amber-300" />
                </motion.div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8">
                <CountdownCard value={timeLeft.days} label="Days" />
                <CountdownCard value={timeLeft.hours} label="Hours" />
                <CountdownCard value={timeLeft.minutes} label="Minutes" />
                <CountdownCard value={timeLeft.seconds} label="Seconds" />
              </div>

              <div className="text-center">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(245, 158, 11, 0.5)",
                      "0 0 40px rgba(245, 158, 11, 0.8)",
                      "0 0 20px rgba(245, 158, 11, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 text-xl font-bold border-0 shadow-2xl">
                    <Calendar className="h-5 w-5 mr-3" />
                    September 1st, 2025
                  </Badge>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-4 text-lg shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 border-0"
                  onClick={() => setIsJoinDialogOpen(true)}
                >
                  <Heart className="mr-3 h-6 w-6" />
                  Join the Community
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent backdrop-blur-sm border-2 font-semibold"
                >
                  <Eye className="mr-3 h-6 w-6" />
                  Preview Platform
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Advanced Community Values Section */}
      <div className="py-20 sm:py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20" />

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full"
            >
              <Community className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-800 dark:text-blue-200">Community First</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Built on Community Values
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Dawini is more than a platform—it's a movement of people helping people, creating a world where no one
              goes without essential medications through the power of community sharing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 max-w-7xl mx-auto">
            {[
              {
                icon: <HandHeart className="h-12 w-12 sm:h-16 sm:w-16" />,
                title: "Peer-to-Peer Sharing",
                description:
                  "Community members directly help each other by sharing extra medications, creating genuine human connections and mutual support networks.",
                color: "from-pink-500 to-rose-500",
                bgColor: "from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20",
                features: [
                  "Direct member connections",
                  "No middleman fees",
                  "Personal stories shared",
                  "Trust-based system",
                ],
              },
              {
                icon: <Shield className="h-12 w-12 sm:h-16 sm:w-16" />,
                title: "Trust & Safety",
                description:
                  "Built-in verification system and community ratings ensure safe, reliable medication sharing experiences with full transparency.",
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
                features: ["Identity verification", "Community ratings", "Safe exchange protocols", "Report system"],
              },
              {
                icon: <Globe className="h-12 w-12 sm:h-16 sm:w-16" />,
                title: "Global Impact",
                description:
                  "Creating a worldwide network of compassionate individuals making healthcare accessible to all through community-driven solutions.",
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
                features: ["Worldwide network", "Local communities", "Cultural sensitivity", "Language support"],
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br ${item.bgColor} border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 group`}
              >
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  {item.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6 text-lg">
                  {item.description}
                </p>

                <div className="space-y-3">
                  {item.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + featureIndex * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`} />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced How It Works Section */}
      <div className="py-20 sm:py-32 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              animate={{
                x: [0, 200, 0],
                y: [0, -200, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full"
            >
              <Compass className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-purple-800 dark:text-purple-200">Simple Process</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              How Dawini Works
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Four simple steps to connect, share, and help your community access essential medications through
              peer-to-peer support
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
              {[
                {
                  step: "1",
                  title: "Join Community",
                  description:
                    "Sign up and become part of our trusted medication sharing network with verified members",
                  icon: <UserCheck className="h-8 w-8 sm:h-10 sm:w-10" />,
                  color: "from-blue-500 to-cyan-500",
                  details: ["Quick verification", "Profile setup", "Community guidelines", "Safety training"],
                },
                {
                  step: "2",
                  title: "Share or Request",
                  description: "Post what you can share or what you need from community members in your area",
                  icon: <Share2 className="h-8 w-8 sm:h-10 sm:w-10" />,
                  color: "from-purple-500 to-pink-500",
                  details: ["Easy posting", "Photo uploads", "Location matching", "Category tagging"],
                },
                {
                  step: "3",
                  title: "Connect Directly",
                  description: "Community members reach out to each other directly to coordinate safe exchanges",
                  icon: <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10" />,
                  color: "from-green-500 to-emerald-500",
                  details: ["Direct messaging", "Meet planning", "Safety protocols", "Exchange coordination"],
                },
                {
                  step: "4",
                  title: "Help & Be Helped",
                  description: "Complete the exchange and build lasting community connections while helping others",
                  icon: <Heart className="h-8 w-8 sm:h-10 sm:w-10" />,
                  color: "from-orange-500 to-red-500",
                  details: ["Safe exchanges", "Community feedback", "Trust building", "Ongoing relationships"],
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
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 z-0">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + 0.5, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
                      />
                    </div>
                  )}

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                    >
                      {item.icon}
                    </motion.div>

                    <div className="mb-6">
                      <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + 0.3, type: "spring", bounce: 0.5 }}
                        className="inline-block w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full text-gray-700 dark:text-gray-300 font-bold text-xl flex items-center justify-center mb-4 shadow-lg"
                      >
                        {item.step}
                      </motion.span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-lg">{item.description}</p>

                    <div className="space-y-2">
                      {item.details.map((detail, detailIndex) => (
                        <motion.div
                          key={detailIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15 + detailIndex * 0.1 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color}`} />
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Community Preview Section */}
      <div className="py-20 sm:py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10" />

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full"
            >
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-800 dark:text-green-200">Live Preview</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Community in Action
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              See how our community members connect, share, and support each other through real medication sharing
              experiences
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-7xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8 sm:mb-12 bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl h-16">
              <TabsTrigger
                value="community"
                className="flex items-center gap-2 rounded-xl h-12 text-base font-semibold"
              >
                <Users className="h-5 w-5" />
                <span className="hidden sm:inline">Community Posts</span>
                <span className="sm:hidden">Posts</span>
              </TabsTrigger>
              <TabsTrigger value="sharing" className="flex items-center gap-2 rounded-xl h-12 text-base font-semibold">
                <Gift className="h-5 w-5" />
                <span className="hidden sm:inline">Active Sharing</span>
                <span className="sm:hidden">Sharing</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2 rounded-xl h-12 text-base font-semibold">
                <Community className="h-5 w-5" />
                <span className="hidden sm:inline">Members</span>
                <span className="sm:hidden">Members</span>
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search medications, members, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 h-14 text-lg rounded-xl border-2">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-lg">
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                <SelectTrigger className="w-full sm:w-48 h-14 text-lg rounded-xl border-2">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((urgency) => (
                    <SelectItem key={urgency} value={urgency} className="text-lg">
                      {urgency === "all" ? "All Urgency" : urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <TabsContent value="community" className="space-y-6 sm:space-y-8">
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                        className={`h-full transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                          request.isSharing
                            ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50"
                            : "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/50 dark:border-blue-800/50"
                        }`}
                        onClick={() => toggleCardExpansion(request.id)}
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={request.avatar || "/placeholder.svg"}
                                alt={request.patientName}
                                className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 shadow-md"
                              />
                              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                                {request.patientName}
                              </CardTitle>
                              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {request.location}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${getUrgencyColor(request.urgency)} text-white shadow-md flex items-center gap-1`}
                          >
                            {getUrgencyIcon(request.urgency)}
                            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xl font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                              <Pill className="h-5 w-5" />
                              {request.medicationName}
                            </h4>
                            <Badge
                              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                request.isSharing ? "bg-green-500 text-white" : "bg-purple-500 text-white"
                              }`}
                            >
                              {request.isSharing ? "Sharing" : "Requesting"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            Needed by: {request.dateNeeded}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-500" />
                            Dosage: {request.dosage}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            Category: {request.category}
                          </p>

                          <AnimatePresence>
                            {expandedCards.has(request.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <p className="text-sm text-gray-800 dark:text-gray-200 mt-4 leading-relaxed">
                                  {request.description}
                                </p>
                                <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                  <p className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    Contact: {request.contactPhone}
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    Email: {request.contactEmail}
                                  </p>
                                  {request.maxPrice && (
                                    <p className="flex items-center gap-2">
                                      <DollarSign className="h-4 w-4 text-gray-500" />
                                      Max Price: ${request.maxPrice}
                                    </p>
                                  )}
                                  <p className="flex items-center gap-2">
                                    <HandHeart className="h-4 w-4 text-gray-500" />
                                    Sharing Type:{" "}
                                    {request.sharingType.charAt(0).toUpperCase() + request.sharingType.slice(1)}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <MessageCircle className="h-4 w-4" />
                              {request.responses} Responses
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-transparent"
                            >
                              {expandedCards.has(request.id) ? (
                                <>
                                  <Minus className="h-4 w-4" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4" />
                                  Show More
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="sharing" className="space-y-6 sm:space-y-8">
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {mockRequests
                    .filter((req) => req.isSharing)
                    .map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card className="h-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <img
                                  src={request.avatar || "/placeholder.svg"}
                                  alt={request.patientName}
                                  className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 shadow-md"
                                />
                                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                                  {request.patientName}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {request.location}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge
                              className={`text-xs font-semibold px-3 py-1 rounded-full ${getUrgencyColor(request.urgency)} text-white shadow-md flex items-center gap-1`}
                            >
                              {getUrgencyIcon(request.urgency)}
                              {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-bold text-green-700 dark:text-green-300 flex items-center gap-2">
                                <Gift className="h-5 w-5" />
                                {request.medicationName}
                              </h4>
                              <Badge className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                Sharing
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              Expires: {request.dateNeeded}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-gray-500" />
                              Dosage: {request.dosage}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <HandHeart className="h-4 w-4 text-gray-500" />
                              Type: {request.sharingType.charAt(0).toUpperCase() + request.sharingType.slice(1)}
                            </p>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-4 leading-relaxed">
                              {request.description}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <ThumbsUp className="h-4 w-4" />
                                Trust Score: {request.trustScore}%
                              </div>
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                              >
                                <Send className="h-4 w-4" />
                                Offer Help
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-6 sm:space-y-8">
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {mockCommunityMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <Card className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={member.avatar || "/placeholder.svg"}
                                alt={member.name}
                                className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-800 shadow-md"
                              />
                              <span
                                className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ${
                                  member.isOnline ? "bg-green-500" : "bg-gray-400"
                                } ring-2 ring-white dark:ring-gray-800`}
                              />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                                {member.name}
                              </CardTitle>
                              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {member.location}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              member.verified ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
                            }`}
                          >
                            {member.verified ? "Verified" : "Unverified"}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Star className="h-4 w-4 text-yellow-500" />
                            Rating: {member.rating} ({member.helpedCount} helps)
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Clock className="h-4 w-4 text-gray-500" />
                            Response Time: {member.responseTime}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            Trust Score: {member.trustScore}%
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Gift className="h-4 w-4 text-green-500" />
                            Shared: {member.totalShared} | Received: {member.totalReceived}
                          </div>
                          <div className="mt-4">
                            <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Specialties:</h5>
                            <div className="flex flex-wrap gap-2">
                              {member.specialties.map((spec, i) => (
                                <Badge key={i} variant="outline" className="text-xs px-2 py-1">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Joined: {member.joinedDate}</div>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                            >
                              <MessageCircle className="h-4 w-4" />
                              Message
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 sm:py-32 bg-gradient-to-br from-indigo-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Waves className="w-full h-full text-white" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 drop-shadow-lg">
              Be a Part of the Solution
            </h2>
            <p className="text-xl sm:text-2xl lg:text-3xl mb-10 sm:mb-12 text-indigo-100 leading-relaxed">
              Join the Dawini community today and help us build a world where everyone has access to the medications
              they need.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-indigo-900 font-bold px-10 py-5 text-xl shadow-2xl hover:shadow-amber-400/30 transition-all duration-300 border-0"
                onClick={() => setIsJoinDialogOpen(true)}
              >
                <HandHeart className="mr-4 h-7 w-7" />
                Sign Up Now
                <ArrowRight className="ml-4 h-7 w-7" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Join Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 sm:p-8 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-2xl border-0">
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Join the Dawini Community
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
              Become a part of our mission to make medication accessible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                className="h-12 text-base border-gray-300 dark:border-gray-700 focus:border-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                className="h-12 text-base border-gray-300 dark:border-gray-700 focus:border-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="location" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                Your Location
              </Label>
              <Input
                id="location"
                placeholder="City, Country"
                className="h-12 text-base border-gray-300 dark:border-gray-700 focus:border-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="role" className="text-base font-semibold text-gray-800 dark:text-gray-200">
                How do you want to contribute?
              </Label>
              <Select>
                <SelectTrigger className="h-12 text-base border-gray-300 dark:border-gray-700 focus:border-blue-500">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="share">Share Medications</SelectItem>
                  <SelectItem value="request">Request Medications</SelectItem>
                  <SelectItem value="volunteer">Volunteer Support</SelectItem>
                  <SelectItem value="both">Both Share & Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription className="text-sm">
                By joining, you agree to our community guidelines focused on trust and safety.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                toast({
                  title: "Welcome to Dawini!",
                  description: "Thank you for joining our community. We'll notify you on launch!",
                })
                setIsJoinDialogOpen(false)
              }}
            >
              <HandHeart className="mr-3 h-5 w-5" />
              Join Dawini
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
