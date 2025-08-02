"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  HeartHandshake,
  Users,
  ShieldCheck,
  Globe,
  Handshake,
  MessageSquare,
  MapPin,
  Clock,
  Pill,
  User,
  Star,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Coins,
  Repeat,
  Hourglass,
  UserPlus,
  Send,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

// Mock Data for Community Posts and Members
const mockCommunityPosts = [
  {
    id: "1",
    type: "request",
    medication: "Insulin (Novolog FlexPen)",
    quantity: "1 pen",
    urgency: "High",
    location: "Riyadh, KSA",
    postedBy: "Aisha M.",
    description:
      "My father ran out of his insulin and we can't get a refill until next week. Any help would be greatly appreciated!",
    sharingType: "Free",
    postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: "2",
    type: "offer",
    medication: "Paracetamol (500mg)",
    quantity: "2 strips (20 tablets)",
    urgency: "Low",
    location: "Jeddah, KSA",
    postedBy: "Khalid S.",
    description: "Have extra paracetamol from a recent cold, expires in 6 months. Happy to share.",
    sharingType: "Free",
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "3",
    type: "request",
    medication: "Ventolin Inhaler",
    quantity: "1 inhaler",
    urgency: "Medium",
    location: "Dammam, KSA",
    postedBy: "Fatima H.",
    description:
      "Need a Ventolin inhaler for my son, his prescription is delayed. Can exchange for other common meds or pay.",
    sharingType: "Exchange/Cost",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "4",
    type: "offer",
    medication: "Amoxicillin (500mg)",
    quantity: "1 full box (14 capsules)",
    urgency: "Low",
    location: "Riyadh, KSA",
    postedBy: "Noura A.",
    description: "Finished my course, have a new unopened box. Expires next year.",
    sharingType: "Free",
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: "5",
    type: "request",
    medication: "Blood Pressure Monitor",
    quantity: "1 device",
    urgency: "High",
    location: "Mecca, KSA",
    postedBy: "Ahmed Z.",
    description: "My old monitor broke, need one urgently to track my readings. Can pay for it.",
    sharingType: "Cost",
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
]

const mockCommunityMembers = [
  { id: "m1", name: "Sara Al-Hamad", specialty: "Pharmacist", trustScore: 4.9, online: true, location: "Riyadh" },
  {
    id: "m2",
    name: "Omar Fahad",
    specialty: "Community Volunteer",
    trustScore: 4.7,
    online: false,
    location: "Jeddah",
  },
  { id: "m3", name: "Layla Nasser", specialty: "Nurse", trustScore: 4.8, online: true, location: "Dammam" },
  { id: "m4", name: "Yousef Ali", specialty: "Medical Student", trustScore: 4.5, online: true, location: "Riyadh" },
  { id: "m5", name: "Hana Abdullah", specialty: "Retired Doctor", trustScore: 5.0, online: false, location: "Mecca" },
]

const Countdown: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const formatTime = (num: number) => String(num).padStart(2, "0")

  const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => (
    <motion.span
      key={value}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="inline-block min-w-[30px] text-center"
    >
      {formatTime(value)}
    </motion.span>
  )

  return (
    <div className="flex justify-center items-center gap-4 text-white font-mono text-4xl md:text-6xl font-extrabold drop-shadow-lg">
      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <AnimatedNumber value={timeLeft.days} />
        </AnimatePresence>
        <span className="text-sm md:text-lg font-semibold text-blue-200">Days</span>
      </div>
      <span className="text-blue-300">:</span>
      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <AnimatedNumber value={timeLeft.hours} />
        </AnimatePresence>
        <span className="text-sm md:text-lg font-semibold text-blue-200">Hours</span>
      </div>
      <span className="text-blue-300">:</span>
      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <AnimatedNumber value={timeLeft.minutes} />
        </AnimatePresence>
        <span className="text-sm md:text-lg font-semibold text-blue-200">Minutes</span>
      </div>
      <span className="text-blue-300">:</span>
      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <AnimatedNumber value={timeLeft.seconds} />
        </AnimatePresence>
        <span className="text-sm md:text-lg font-semibold text-blue-200">Seconds</span>
      </div>
    </div>
  )
}

const DawiniPage: React.FC = () => {
  const isMobile = useIsMobile()
  const targetDate = useMemo(() => new Date("2025-09-01T00:00:00"), [])
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [joinForm, setJoinForm] = useState({ name: "", email: "", location: "", role: "" })
  const [expandedPost, setExpandedPost] = useState<string | null>(null)

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Join Form Submitted:", joinForm)
    // Here you would typically send data to a backend
    setShowJoinDialog(false)
    alert("Thank you for your interest! We'll be in touch.")
  }

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " years ago"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " months ago"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutes ago"
    return Math.floor(seconds) + " seconds ago"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="relative z-10 py-12 md:py-20 px-4 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm mb-4 shadow-lg">
            <Sparkles className="h-4 w-4 mr-2" /> Dawini Community
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Share & Receive Medications, Together.
          </h1>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Dawini connects individuals to facilitate the safe and responsible sharing of unused medications within the
            community.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
            onClick={() => setShowJoinDialog(true)}
          >
            Join the Community <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.section>

        {/* Countdown Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-16 md:mb-24 bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url("/placeholder.svg?height=200&width=200")' }}
          />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Launching Soon: September 1st, 2025!</h2>
            <Countdown targetDate={targetDate} />
            <p className="text-blue-200 mt-6 text-lg">
              Get ready to be part of a compassionate and supportive network.
            </p>
          </div>
        </motion.section>

        {/* Community Values Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-slate-200 mb-12">
            Our Core Community Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 rounded-2xl shadow-xl text-white text-center space-y-4 transform hover:scale-105 transition-transform duration-300"
            >
              <HeartHandshake className="h-16 w-16 mx-auto mb-4 text-blue-200" />
              <h3 className="text-2xl font-bold">Peer-to-Peer Sharing</h3>
              <p className="text-blue-100">
                Connect directly with individuals in your local community to share and receive medications.
              </p>
              <ul className="text-sm text-blue-50 list-disc list-inside text-left">
                <li>Direct connections</li>
                <li>Local focus</li>
                <li>Community support</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-gradient-to-br from-purple-500 to-purple-700 p-8 rounded-2xl shadow-xl text-white text-center space-y-4 transform hover:scale-105 transition-transform duration-300"
            >
              <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-purple-200" />
              <h3 className="text-2xl font-bold">Trust & Safety</h3>
              <p className="text-purple-100">
                Our platform is built on trust, with verified users and clear guidelines for safe exchanges.
              </p>
              <ul className="text-sm text-purple-50 list-disc list-inside text-left">
                <li>User verification</li>
                <li>Secure communication</li>
                <li>Community guidelines</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-gradient-to-br from-green-500 to-green-700 p-8 rounded-2xl shadow-xl text-white text-center space-y-4 transform hover:scale-105 transition-transform duration-300"
            >
              <Globe className="h-16 w-16 mx-auto mb-4 text-green-200" />
              <h3 className="text-2xl font-bold">Global Impact</h3>
              <p className="text-green-100">
                Join a growing network making a difference in medication accessibility worldwide.
              </p>
              <ul className="text-sm text-green-50 list-disc list-inside text-left">
                <li>Reduce waste</li>
                <li>Increase access</li>
                <li>Empower communities</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* How Dawini Works Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-slate-200 mb-12">
            How Dawini Works: Simple Steps to Share
          </h2>
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Connector Lines for Desktop */}
            {!isMobile && (
              <>
                <div className="absolute top-1/2 left-[25%] w-[50%] h-1 bg-blue-200 dark:bg-blue-800 transform -translate-x-1/2 -translate-y-1/2 z-0" />
                <div className="absolute top-1/2 left-[50%] w-[50%] h-1 bg-purple-200 dark:bg-purple-800 transform -translate-x-1/2 -translate-y-1/2 z-0" />
                <div className="absolute top-1/2 left-[75%] w-[50%] h-1 bg-green-200 dark:bg-green-800 transform -translate-x-1/2 -translate-y-1/2 z-0" />
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="relative z-10 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center space-y-4 border border-slate-200 dark:border-slate-700 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full inline-flex items-center justify-center mx-auto mb-4">
                <Pill className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">1. List Your Medication</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Easily post medications you wish to share or request specific ones you need.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative z-10 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center space-y-4 border border-slate-200 dark:border-slate-700 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full inline-flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">2. Find a Match</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Our smart matching system connects you with relevant offers or requests nearby.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="relative z-10 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center space-y-4 border border-slate-200 dark:border-slate-700 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full inline-flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">3. Communicate Securely</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Chat directly and privately with other users to arrange the exchange.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="relative z-10 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center space-y-4 border border-slate-200 dark:border-slate-700 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full inline-flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">4. Exchange Safely</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Complete your exchange, knowing you've helped someone in need.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Community in Action Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-slate-200 mb-12">
            Dawini Community in Action
          </h2>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-4 md:p-6">
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <TabsTrigger
                    value="posts"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-slate-900 data-[state=active]:dark:text-blue-400 transition-all duration-200 py-2"
                  >
                    <Pill className="h-4 w-4 mr-2" /> Community Posts
                  </TabsTrigger>
                  <TabsTrigger
                    value="members"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-slate-900 data-[state=active]:dark:text-blue-400 transition-all duration-200 py-2"
                  >
                    <Users className="h-4 w-4 mr-2" /> Active Members
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="mt-6">
                  <ScrollArea className="h-[400px] md:h-[500px] pr-4">
                    <div className="grid grid-cols-1 gap-6">
                      {mockCommunityPosts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                              <Badge
                                className={cn(
                                  "text-sm font-semibold",
                                  post.type === "request"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                                )}
                              >
                                {post.type === "request" ? "Medication Request" : "Medication Offer"}
                              </Badge>
                              <Badge
                                className={cn(
                                  "text-xs font-medium",
                                  post.urgency === "High" &&
                                    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
                                  post.urgency === "Medium" &&
                                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                                  post.urgency === "Low" &&
                                    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                                )}
                              >
                                <Hourglass className="h-3 w-3 mr-1" /> Urgency: {post.urgency}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                              <Pill className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              {post.medication}
                            </h3>
                            <p className="text-slate-700 dark:text-slate-300 mb-2">
                              <span className="font-semibold">Quantity:</span> {post.quantity}
                            </p>
                            <p className="text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-slate-500" />
                              <span className="font-semibold">Location:</span> {post.location}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                              {expandedPost === post.id ? post.description : `${post.description.substring(0, 100)}...`}
                              {post.description.length > 100 && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                                  className="p-0 h-auto ml-1 text-blue-600 dark:text-blue-400"
                                >
                                  {expandedPost === post.id ? "Show Less" : "Read More"}
                                </Button>
                              )}
                            </p>
                            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" /> Posted by: {post.postedBy}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {timeAgo(post.postedAt)}
                              </span>
                            </div>
                            <Separator className="my-4 bg-slate-200 dark:bg-slate-700" />
                            <div className="flex justify-between items-center">
                              <Badge
                                className={cn(
                                  "text-sm font-semibold",
                                  post.sharingType === "Free" && "bg-blue-500 text-white",
                                  post.sharingType === "Cost" && "bg-amber-500 text-white",
                                  post.sharingType === "Exchange/Cost" && "bg-purple-500 text-white",
                                )}
                              >
                                {post.sharingType === "Free" && <CheckCircle className="h-3 w-3 mr-1" />}
                                {post.sharingType === "Cost" && <Coins className="h-3 w-3 mr-1" />}
                                {post.sharingType === "Exchange/Cost" && <Repeat className="h-3 w-3 mr-1" />}
                                {post.sharingType}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                              >
                                <MessageSquare className="h-4 w-4" /> Contact
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="members" className="mt-6">
                  <ScrollArea className="h-[400px] md:h-[500px] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockCommunityMembers.map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-4 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative z-10 flex items-center gap-4">
                            <div className="relative">
                              <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-slate-300">
                                {member.name.charAt(0)}
                              </div>
                              {member.online && (
                                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{member.name}</h3>
                              <p className="text-slate-700 dark:text-slate-300 text-sm">{member.specialty}</p>
                              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mt-1">
                                <Star className="h-4 w-4 text-amber-500 mr-1" /> {member.trustScore.toFixed(1)} Trust
                                Score
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" /> {member.location}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center bg-gradient-to-r from-blue-500 to-purple-500 p-10 rounded-3xl shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the Dawini community today and contribute to a healthier, more connected world.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-slate-100 font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
            onClick={() => setShowJoinDialog(true)}
          >
            <UserPlus className="h-5 w-5 mr-2" /> Sign Up for Dawini
          </Button>
        </motion.section>
      </div>

      {/* Join Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="sm:max-w-[425px] p-6 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Join the Dawini Community
            </DialogTitle>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in your details to become a part of our sharing network.
            </p>
          </DialogHeader>
          <form onSubmit={handleJoinSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-slate-700 dark:text-slate-300">
                Name
              </Label>
              <Input
                id="name"
                value={joinForm.name}
                onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
                className="col-span-3 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-slate-700 dark:text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={joinForm.email}
                onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                className="col-span-3 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right text-slate-700 dark:text-slate-300">
                Location
              </Label>
              <Input
                id="location"
                value={joinForm.location}
                onChange={(e) => setJoinForm({ ...joinForm, location: e.target.value })}
                className="col-span-3 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                placeholder="e.g., Riyadh, KSA"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right text-slate-700 dark:text-slate-300">
                I want to...
              </Label>
              <div className="col-span-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Please select your role.</p>
              </div>
            </div>
            <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowJoinDialog(false)}
                className="w-full sm:w-auto bg-white dark:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white gap-2"
              >
                <Send className="h-4 w-4" /> Join Now
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DawiniPage
