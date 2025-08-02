"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GoldenCard } from "@/components/ui/golden-card"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pill,
  Search,
  MapPin,
  Clock,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Users,
  Shield,
  Zap,
  Star,
  MessageCircle,
  Calendar,
  DollarSign,
  FileText,
  User,
  Plus,
  Target,
  Activity,
} from "lucide-react"

interface MedicationRequest {
  id: string
  patientName: string
  medicationName: string
  dosage: string
  urgency: "low" | "medium" | "high" | "critical"
  location: string
  contactPhone: string
  contactEmail: string
  description: string
  prescriptionRequired: boolean
  maxPrice: number
  dateNeeded: string
  responses: number
  status: "active" | "fulfilled" | "expired"
  createdAt: string
  category: string
}

interface Provider {
  id: string
  name: string
  location: string
  rating: number
  verified: boolean
  specialties: string[]
  responseTime: string
  successRate: number
}

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
    description: "Urgent need for insulin. My regular pharmacy is out of stock and I'm running low.",
    prescriptionRequired: true,
    maxPrice: 150,
    dateNeeded: "2024-01-15",
    responses: 3,
    status: "active",
    createdAt: "2024-01-14",
    category: "Diabetes",
  },
  {
    id: "2",
    patientName: "John D.",
    medicationName: "Albuterol Inhaler",
    dosage: "90 mcg",
    urgency: "high",
    location: "Los Angeles, CA",
    contactPhone: "+1-555-0456",
    contactEmail: "john.d@email.com",
    description: "Need asthma inhaler for emergency backup. Traveling and forgot mine.",
    prescriptionRequired: true,
    maxPrice: 75,
    dateNeeded: "2024-01-16",
    responses: 1,
    status: "active",
    createdAt: "2024-01-14",
    category: "Respiratory",
  },
  {
    id: "3",
    patientName: "Maria L.",
    medicationName: "Metformin",
    dosage: "500mg",
    urgency: "medium",
    location: "Chicago, IL",
    contactPhone: "+1-555-0789",
    contactEmail: "maria.l@email.com",
    description: "Regular medication for diabetes management. Looking for cost-effective option.",
    prescriptionRequired: true,
    maxPrice: 30,
    dateNeeded: "2024-01-20",
    responses: 0,
    status: "active",
    createdAt: "2024-01-13",
    category: "Diabetes",
  },
]

const mockProviders: Provider[] = [
  {
    id: "1",
    name: "MediCare Pharmacy",
    location: "Manhattan, NY",
    rating: 4.8,
    verified: true,
    specialties: ["Diabetes", "Cardiology", "General"],
    responseTime: "< 2 hours",
    successRate: 95,
  },
  {
    id: "2",
    name: "HealthFirst Supplies",
    location: "Brooklyn, NY",
    rating: 4.6,
    verified: true,
    specialties: ["Respiratory", "Emergency", "Pediatric"],
    responseTime: "< 1 hour",
    successRate: 92,
  },
]

export default function Dawini() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("requests")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedUrgency, setSelectedUrgency] = useState("all")
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MedicationRequest | null>(null)

  // Form states
  const [requestForm, setRequestForm] = useState({
    medicationName: "",
    dosage: "",
    urgency: "medium",
    location: "",
    contactPhone: "",
    contactEmail: "",
    description: "",
    prescriptionRequired: true,
    maxPrice: "",
    dateNeeded: "",
    category: "",
  })

  const categories = ["all", "Diabetes", "Respiratory", "Cardiology", "Neurology", "Oncology", "Pediatric", "Emergency"]
  const urgencyLevels = ["all", "low", "medium", "high", "critical"]

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || request.category === selectedCategory
    const matchesUrgency = selectedUrgency === "all" || request.urgency === selectedUrgency

    return matchesSearch && matchesCategory && matchesUrgency
  })

  const handleSubmitRequest = () => {
    // Validate form
    if (!requestForm.medicationName || !requestForm.contactPhone || !requestForm.contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Request Submitted Successfully",
      description: "Your medication request has been posted. Providers will contact you directly.",
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
      prescriptionRequired: true,
      maxPrice: "",
      dateNeeded: "",
      category: "",
    })
  }

  const handleContactProvider = (request: MedicationRequest) => {
    setSelectedRequest(request)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fillOpacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        <div className="relative container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="p-4 bg-white/10 rounded-full backdrop-blur-sm"
              >
                <Pill className="h-16 w-16 text-amber-300" />
              </motion.div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Dawini
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connecting patients with medication providers when you need it most
            </p>
            <p className="text-lg mb-12 text-blue-200 max-w-2xl mx-auto">
              A community-driven platform that helps people find essential medications through verified providers and pharmacies
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-amber-900 font-semibold px-8 py-4 text-lg"
                onClick={() => setIsRequestDialogOpen(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Request Medication
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
                onClick={() => setIsProviderDialogOpen(true)}
              >
                <Shield className="mr-2 h-5 w-5" />
                Become a Provider
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How Dawini Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and fast medication access through our verified network
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "Post Your Request",
                description: "Submit your medication needs with prescription details and urgency level",
                icon: <FileText className="h-8 w-8" />,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "2",
                title: "Get Connected",
                description: "Verified providers in your area will contact you directly with availability",
                icon: <Users className="h-8 w-8" />,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "3",
                title: "Secure Transaction",
                description: "Complete your purchase safely with our verified provider network",
                icon: <Shield className="h-8 w-8" />,
                color: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-lg`}>
                  {item.icon}
                </div>
                <div className="mb-4">
                  <span className="inline-block w-8 h-8 bg-gray-100 rounded-full text-gray-600 font-bold text-sm flex items-center justify-center mb-2">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <TabsList className="grid w-full lg:w-auto grid-cols-2 bg-white shadow-md">
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Active Requests
              </TabsTrigger>
              <TabsTrigger value="providers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Providers
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search medications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level === "all" ? "All Levels" : level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="requests" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredRequests.map((request, index) => {
                  const RequestCard = request.urgency === "critical" ? GoldenCard : Card
                  
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <RequestCard
                        isUrgent={request.urgency === "critical"}
                        className="h-full hover:shadow-lg transition-all duration-300"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={`${getUrgencyColor(request.urgency)} text-white flex items-center gap-1`}>
                              {getUrgencyIcon(request.urgency)}
                              {request.urgency.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {request.category}
                            </Badge>
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
                              <Pill className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Dosage:</span> {request.dosage}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-green-500" />
                              <span className="font-medium">Location:</span> {request.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-purple-500" />
                              <span className="font-medium">Needed by:</span> {request.dateNeeded}
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-amber-500" />
                              <span className="font-medium">Max Price:</span> ${request.maxPrice}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {request.responses} responses
                            </span>
                            <span>{request.createdAt}</span>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="pt-3">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                <Phone className="mr-2 h-4 w-4" />
                                Contact Patient
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Contact Information</AlertDialogTitle>
                                <AlertDialogDescription>
                                  You can contact {request.patientName} directly using the information below:
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="space-y-3 py-4">
                                <div className="flex items-center gap-3">
                                  <Phone className="h-5 w-5 text-green-500" />
                                  <span className="font-mono">{request.contactPhone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Mail className="h-5 w-5 text-blue-500" />
                                  <span className="font-mono">{request.contactEmail}</span>
                                </div>
                                <Separator />
                                <div className="text-sm text-gray-600">
                                  <p><strong>Medication:</strong> {request.medicationName} ({request.dosage})</p>
                                  <p><strong>Urgency:</strong> {request.urgency}</p>
                                  <p><strong>Prescription Required:</strong> {request.prescriptionRequired ? "Yes" : "No"}</p>
                                </div>
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                                <AlertDialogAction>Mark as Contacted</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardFooter>
                      </RequestCard>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="providers" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProviders.map((provider, index) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        {provider.verified && (
                          <Badge className="bg-green-500 text-white flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {provider.location}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(provider.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{provider.rating}</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>Response time: {provider.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-500" />
                          <span>Success rate: {provider.successRate}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {provider.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button className="w-full bg-transparent" variant="outline">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Contact Provider
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Medication Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-blue-500" />
              Request Medication
            </DialogTitle>
            <DialogDescription>
              Fill out the form below to post your medication request. Verified providers will contact you directly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicationName">Medication Name *</Label>
                <Input
                  id="medicationName"
                  placeholder="e.g., Insulin Glargine"
                  value={requestForm.medicationName}
                  onChange={(e) => setRequestForm({...requestForm, medicationName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 100 units/mL"
                  value={requestForm.dosage}
                  onChange={(e) => setRequestForm({...requestForm, dosage: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={requestForm.category} onValueChange={(value) => setRequestForm({...requestForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat !== "all").map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={requestForm.urgency} onValueChange={(value) => setRequestForm({...requestForm, urgency: value})}>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={requestForm.location}
                  onChange={(e) => setRequestForm({...requestForm, location: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateNeeded">Date Needed</Label>
                <Input
                  id="dateNeeded"
                  type="date"
                  value={requestForm.dateNeeded}
                  onChange={(e) => setRequestForm({...requestForm, dateNeeded: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number *</Label>
                <Input
                  id="contactPhone"
                  placeholder="+1-555-0123"
                  value={requestForm.contactPhone}
                  onChange={(e) => setRequestForm({...requestForm, contactPhone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={requestForm.contactEmail}
                  onChange={(e) => setRequestForm({...requestForm, contactEmail: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Maximum Price ($)</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="150"
                value={requestForm.maxPrice}
                onChange={(e) => setRequestForm({...requestForm, maxPrice: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Additional Details</Label>
              <Textarea
                id="description"
                placeholder="Describe your situation, any specific requirements, or additional information..."
                value={requestForm.description}
                onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="prescriptionRequired"
                checked={requestForm.prescriptionRequired}
                onChange={(e) => setRequestForm({...requestForm, prescriptionRequired: e.target.checked})}
                className="rounded border-gray-300"
              />
              <Label htmlFor="prescriptionRequired" className="text-sm">
                Prescription required for this medication
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Plus className="mr-2 h-4 w-4" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Provider Registration Dialog */}
      <Dialog open={isProviderDialogOpen} onOpenChange={setIsProviderDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Become a Provider
            </DialogTitle>
            <DialogDescription>
              Join our network of verified medication providers and help people in need.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Provider Registration</h3>
              <p className="text-sm text-gray-600 mb-4">
                We're currently setting up our provider verification system. 
                Leave your information and we'll contact you soon.
              </p>
              <Button className="bg-green-500 hover:bg-green-600">
                <Mail className="mr-2 h-4 w-4" />
                Get Notified
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProviderDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
