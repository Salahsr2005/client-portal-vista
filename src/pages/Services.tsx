"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, CalendarIcon, ArrowRight, Sparkles, Star, Zap, Shield, Heart } from "lucide-react"
import { useServices } from "@/hooks/useServices"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useApplyForService } from "@/hooks/useServices"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"

export default function Services() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: services = [], isLoading, error } = useServices()
  const applyForService = useApplyForService()
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [applicationNotes, setApplicationNotes] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(services.map((s) => s.category.toLowerCase())))]

  // Filter services based on search term and active category
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeCategory === "all") return matchesSearch
    return matchesSearch && service.category.toLowerCase() === activeCategory
  })

  const handleBookService = (serviceId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book services",
        variant: "default",
      })
      navigate("/login")
      return
    }

    setSelectedService(serviceId)
    setDialogOpen(true)
  }

  const handleApplySubmit = async () => {
    if (!selectedService) return

    try {
      await applyForService.mutateAsync({
        serviceId: selectedService,
        notes: applicationNotes,
      })

      setDialogOpen(false)
      setApplicationNotes("")
      setSelectedService(null)
    } catch (error) {
      console.error("Error applying for service:", error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.03,
      y: -8,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const floatingElements = [
    { icon: <Star className="h-4 w-4" />, delay: 0, color: "text-yellow-400" },
    { icon: <Zap className="h-3 w-3" />, delay: 2, color: "text-blue-400" },
    { icon: <Shield className="h-4 w-4" />, delay: 4, color: "text-green-400" },
    { icon: <Heart className="h-3 w-3" />, delay: 1, color: "text-pink-400" },
    { icon: <Sparkles className="h-4 w-4" />, delay: 3, color: "text-purple-400" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />
        
        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="container max-w-7xl mx-auto">
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-40" />
              </div>

              <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-50/80 to-indigo-50/80 dark:from-slate-800/50 dark:to-slate-900/50 p-6 md:p-8">
                  <Skeleton className="h-8 w-64 mb-3" />
                  <Skeleton className="h-5 w-96" />
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row justify-between mb-8 gap-6">
                    <Skeleton className="h-12 w-full lg:w-[400px]" />
                    <Skeleton className="h-12 w-full lg:w-80" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="h-[280px] flex flex-col rounded-2xl">
                        <CardHeader className="pb-4">
                          <Skeleton className="h-6 w-20 mb-3" />
                          <Skeleton className="h-7 w-40 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent className="flex-1">
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                        <CardFooter>
                          <div className="flex justify-between w-full">
                            <Skeleton className="h-10 w-28" />
                            <Skeleton className="h-10 w-28" />
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 flex justify-center items-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-0 shadow-xl backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 rounded-3xl">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Error Loading Services</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">There was a problem loading the services. Please try again later.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Animated Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-2000" />

      {/* Floating Icons */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.color} opacity-20`}
          style={{
            top: `${15 + index * 18}%`,
            left: `${5 + index * 22}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            x: [-8, 8, -8],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + index,
            repeat: Number.POSITIVE_INFINITY,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="container max-w-7xl mx-auto">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header Section */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-indigo-700 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-indigo-300 dark:to-purple-400 leading-tight">
                  Our Services
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mt-2">
                  Professional services to support your journey
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 px-6 py-3 rounded-2xl text-base font-semibold group">
                  <CalendarIcon className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Book a Service
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Main Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-50/80 to-indigo-50/80 dark:from-slate-800/50 dark:to-slate-900/50 p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                        Available Services
                      </CardTitle>
                      <CardDescription className="text-base lg:text-lg text-slate-600 dark:text-slate-300">
                        Browse and book services to assist with your international journey
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                  <Tabs defaultValue="all" className="w-full">
                    {/* Enhanced Search and Filter Section */}
                    <div className="flex flex-col lg:flex-row justify-between mb-8 gap-6">
                      {/* Modern Tab List */}
                      <div className="flex-1">
                        <TabsList className="h-auto p-2 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 flex flex-wrap gap-1">
                          {categories.map((category) => (
                            <TabsTrigger
                              key={category}
                              value={category}
                              onClick={() => setActiveCategory(category)}
                              className="capitalize text-sm font-medium px-4 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 data-[state=active]:dark:text-white transition-all duration-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
                            >
                              {category}
                              <span className="ml-2 text-xs opacity-60">
                                ({category === "all" ? services.length : services.filter(s => s.category.toLowerCase() === category).length})
                              </span>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>

                      {/* Enhanced Search and Filter */}
                      <div className="flex gap-3 w-full lg:w-auto lg:min-w-[350px]">
                        <div className="relative flex-1">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            type="search"
                            placeholder="Search services..."
                            className="pl-11 pr-4 py-3 rounded-2xl border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="px-4 py-3 rounded-2xl border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                            <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                            <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                            <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                            <DropdownMenuItem>Available Only</DropdownMenuItem>
                            <DropdownMenuItem>All Services</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Services Grid */}
                    <TabsContent value="all" className="m-0">
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {filteredServices.length === 0 ? (
                          <motion.div 
                            className="col-span-full"
                            variants={itemVariants}
                          >
                            <Card className="h-64 flex items-center justify-center rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                  <Search className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No services found</p>
                                <p className="text-slate-400 dark:text-slate-500 text-sm">Try adjusting your search criteria</p>
                              </div>
                            </Card>
                          </motion.div>
                        ) : (
                          filteredServices.map((service, index) => (
                            <motion.div
                              key={service.id}
                              variants={itemVariants}
                              whileHover="hover"
                              whileTap={{ scale: 0.98 }}
                              initial="rest"
                              custom={index}
                            >
                              <motion.div variants={cardHoverVariants}>
                                <Card className="group h-full flex flex-col overflow-hidden border border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 hover:border-indigo-400/60 dark:hover:border-indigo-500/60 hover:shadow-2xl relative rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                  {/* Hover Gradient Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/30 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                                  
                                  {/* Animated Border */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/50 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{ padding: '1px' }}>
                                    <div className="w-full h-full bg-white dark:bg-slate-800 rounded-2xl" />
                                  </div>

                                  <CardHeader className="pb-4 bg-transparent relative z-10 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                      <Badge
                                        variant="outline"
                                        className="capitalize font-medium px-3 py-1.5 rounded-xl border-indigo-200/50 bg-indigo-50/80 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/50 backdrop-blur-sm"
                                      >
                                        {service.category}
                                      </Badge>
                                      {service.status === "Active" ? (
                                        <Badge className="bg-emerald-500/90 text-white rounded-xl px-3 py-1.5 shadow-lg">
                                          Available
                                        </Badge>
                                      ) : (
                                        <Badge variant="secondary" className="rounded-xl px-3 py-1.5">
                                          Unavailable
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <CardTitle className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                                      {service.name}
                                    </CardTitle>
                                    
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-3">
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm font-semibold dark:bg-indigo-900/50 dark:text-indigo-300">
                                          {service.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <CardDescription className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                        Professional Service
                                      </CardDescription>
                                    </div>
                                  </CardHeader>

                                  <CardContent className="pb-6 flex-grow relative z-10 px-6">
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                                      {service.description}
                                    </p>
                                  </CardContent>

                                  <CardFooter className="pt-0 flex justify-between relative z-10 px-6 pb-6">
                                    <Button 
                                      variant="outline" 
                                      className="rounded-xl px-6 py-2.5 border-slate-200/50 dark:border-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 backdrop-blur-sm"
                                    >
                                      Learn More
                                    </Button>
                                    <Button
                                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl group/btn"
                                      onClick={() => handleBookService(service.id)}
                                      disabled={service.status !== "Active" || applyForService.isPending}
                                    >
                                      Book Now
                                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                  </CardFooter>

                                  {/* Enhanced Arrow Icon */}
                                  <motion.div
                                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    initial={{ x: -10, opacity: 0 }}
                                    whileHover={{ x: 0, opacity: 1 }}
                                  >
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center">
                                      <ArrowRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                  </motion.div>
                                </Card>
                              </motion.div>
                            </motion.div>
                          ))
                        )}
                      </motion.div>
                    </TabsContent>

                    {/* Category-specific tabs */}
                    {categories
                      .filter((cat) => cat !== "all")
                      .map((category) => (
                        <TabsContent key={category} value={category} className="m-0">
                          <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {filteredServices.filter((service) => service.category.toLowerCase() === category).length === 0 ? (
                              <motion.div 
                                className="col-span-full"
                                variants={itemVariants}
                              >
                                <Card className="h-64 flex items-center justify-center rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                                  <div className="text-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                      <Filter className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No {category} services found</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-sm">Try searching for something else</p>
                                  </div>
                                </Card>
                              </motion.div>
                            ) : (
                              filteredServices
                                .filter((service) => service.category.toLowerCase() === category)
                                .map((service, index) => (
                                  <motion.div
                                    key={service.id}
                                    variants={itemVariants}
                                    whileHover="hover"
                                    whileTap={{ scale: 0.98 }}
                                    initial="rest"
                                    custom={index}
                                  >
                                    <motion.div variants={cardHoverVariants}>
                                      <Card className="group h-full flex flex-col overflow-hidden border border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 hover:border-indigo-400/60 dark:hover:border-indigo-500/60 hover:shadow-2xl relative rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                        {/* Hover Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/30 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                                        <CardHeader className="pb-4 bg-transparent relative z-10 p-6">
                                          <div className="flex justify-between items-start mb-4">
                                            <Badge
                                              variant="outline"
                                              className="capitalize font-medium px-3 py-1.5 rounded-xl border-indigo-200/50 bg-indigo-50/80 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/50 backdrop-blur-sm"
                                            >
                                              {service.category}
                                            </Badge>
                                            {service.status === "Active" ? (
                                              <Badge className="bg-emerald-500/90 text-white rounded-xl px-3 py-1.5 shadow-lg">
                                                Available
                                              </Badge>
                                            ) : (
                                              <Badge variant="secondary" className="rounded-xl px-3 py-1.5">
                                                Unavailable
                                              </Badge>
                                            )}
                                          </div>
                                          
                                          <CardTitle className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                                            {service.name}
                                          </CardTitle>
                                          
                                          <div className="flex items-center">
                                            <Avatar className="h-8 w-8 mr-3">
                                              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm font-semibold dark:bg-indigo-900/50 dark:text-indigo-300">
                                                {service.name.charAt(0)}
                                              </AvatarFallback>
                                            </Avatar>
                                            <CardDescription className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                              Professional Service
                                            </CardDescription>
                                          </div>
                                        </CardHeader>

                                        <CardContent className="pb-6 flex-grow relative z-10 px-6">
                                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                                            {service.description}
                                          </p>
                                        </CardContent>

                                        <CardFooter className="pt-0 flex justify-between relative z-10 px-6 pb-6">
                                          <Button 
                                            variant="outline" 
                                            className="rounded-xl px-6 py-2.5 border-slate-200/50 dark:border-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 backdrop-blur-sm"
                                          >
                                            Learn More
                                          </Button>
                                          <Button
                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl group/btn"
                                            onClick={() => handleBookService(service.id)}
                                            disabled={service.status !== "Active" || applyForService.isPending}
                                          >
                                            Book Now
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                          </Button>
                                        </CardFooter>

                                        {/* Enhanced Arrow Icon */}
                                        <motion.div
                                          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                          initial={{ x: -10, opacity: 0 }}
                                          whileHover={{ x: 0, opacity: 1 }}
                                        >
                                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center">
                                            <ArrowRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                          </div>
                                        </motion.div>
                                      </Card>
                                    </motion.div>
                                  </motion.div>
                                ))
                            )}
                          </motion.div>
                        </TabsContent>
                      ))}
                  </Tabs>
                </CardContent>

                {/* Enhanced Footer */}
                <CardFooter className="flex justify-between bg-gradient-to-r from-violet-50/60 to-indigo-50/60 dark:from-slate-800/40 dark:to-slate-900/40 py-6 px-6 md:px-8 rounded-b-3xl backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Showing {filteredServices.length} of {services.length} services
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>Live updates</span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <DialogHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Book Service</DialogTitle>
            <DialogDescription className="text-base text-slate-600 dark:text-slate-300">
              Complete your service booking. Add any specific requirements or questions you have.
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <>
              <div className="space-y-6 py-6">
                <Card className="border border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <h4 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Service Details</h4>
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {services.find((s) => s.id === selectedService)?.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {services.find((s) => s.id === selectedService)?.description}
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <div className="space-y-3">
                  <label htmlFor="notes" className="text-sm font-semibold text-slate-900 dark:text-white">
                    Additional Notes
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Add any specific requirements, questions, or special requests..."
                    value={applicationNotes}
                    onChange={(e) => setApplicationNotes(e.target.value)}
                    className="min-h-[100px] rounded-2xl border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    setSelectedService(null)
                    setApplicationNotes("")
                  }}
                  className="w-full sm:w-auto rounded-2xl px-6 py-3 border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplySubmit}
                  disabled={applyForService.isPending}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 w-full sm:w-auto rounded-2xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {applyForService.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
