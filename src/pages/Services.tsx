"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Search, CalendarIcon, Clock, Sparkles, ArrowRight, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { Pill, DollarSign, Textarea, Separator } from "@/components/ui" // Import missing components

// Mock data for services
const mockServices = [
  {
    id: "1",
    category: "Consultation",
    title: "Academic Consultation",
    description: "Personalized guidance for your study abroad journey, from program selection to application strategy.",
    price: 150,
    duration: "1 hour",
    details: {
      features: [
        "One-on-one session with an expert",
        "Program matching based on your profile",
        "Application roadmap development",
        "Q&A session",
      ],
      availability: "Mon-Fri, 9 AM - 5 PM",
    },
  },
  {
    id: "2",
    category: "Application Support",
    title: "University Application Review",
    description: "Thorough review of your university applications, essays, and supporting documents.",
    price: 250,
    duration: "2 hours",
    details: {
      features: [
        "Detailed feedback on essays and SOPs",
        "Document checklist and verification",
        "Tips for strengthening your application",
        "Unlimited revisions for 7 days",
      ],
      availability: "Mon-Sat, 10 AM - 6 PM",
    },
  },
  {
    id: "3",
    category: "Visa & Immigration",
    title: "Visa Application Assistance",
    description: "Expert help with visa application forms, document preparation, and interview guidance.",
    price: 300,
    duration: "1.5 hours",
    details: {
      features: [
        "Step-by-step visa application guidance",
        "Document checklist and review",
        "Mock interview preparation",
        "Post-visa support",
      ],
      availability: "Mon-Fri, 9 AM - 4 PM",
    },
  },
  {
    id: "4",
    category: "Accommodation",
    title: "Accommodation Search & Booking",
    description: "Assistance in finding and booking suitable student accommodation near your university.",
    price: 100,
    duration: "Ongoing",
    details: {
      features: [
        "Personalized accommodation options",
        "Virtual tours and reviews",
        "Lease agreement review",
        "Pre-arrival support",
      ],
      availability: "Flexible",
    },
  },
  {
    id: "5",
    category: "Pre-Departure",
    title: "Pre-Departure Orientation",
    description: "Comprehensive session covering travel, cultural adaptation, and essential tips before you leave.",
    price: 80,
    duration: "1 hour",
    details: {
      features: [
        "Travel and packing advice",
        "Cultural etiquette and local laws",
        "Banking and mobile services setup",
        "Emergency contacts and support",
      ],
      availability: "Weekends, 11 AM - 3 PM",
    },
  },
  {
    id: "6",
    category: "Post-Arrival",
    title: "Post-Arrival Support Package",
    description: "Assistance with settling in, including registration, local transport, and community integration.",
    price: 120,
    duration: "Ongoing",
    details: {
      features: [
        "Airport pickup arrangement",
        "University registration guidance",
        "Local transport orientation",
        "Social events and networking",
      ],
      availability: "Flexible",
    },
  },
]

const serviceCategories = ["All", ...new Set(mockServices.map((s) => s.category))]

export default function ServicesPage() {
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [selectedService, setSelectedService] = useState<(typeof mockServices)[0] | null>(null)
  const [bookingDetails, setBookingDetails] = useState({
    date: undefined as Date | undefined,
    time: "",
    notes: "",
  })

  const filteredServices = useMemo(() => {
    let services = mockServices

    if (activeCategory !== "All") {
      services = services.filter((service) => service.category === activeCategory)
    }

    if (searchQuery) {
      services = services.filter(
        (service) =>
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    return services
  }, [activeCategory, searchQuery])

  const handleBookService = (service: (typeof mockServices)[0]) => {
    setSelectedService(service)
    setShowBookingDialog(true)
    setBookingDetails({ date: undefined, time: "", notes: "" }) // Reset booking details
  }

  const handleConfirmBooking = () => {
    if (!bookingDetails.date || !bookingDetails.time) {
      toast({
        title: "Booking Error",
        description: "Please select a date and time for your booking.",
        variant: "destructive",
      })
      return
    }

    // Simulate booking API call
    console.log("Booking confirmed:", {
      service: selectedService?.title,
      ...bookingDetails,
    })

    toast({
      title: "Booking Confirmed!",
      description: `Your booking for ${selectedService?.title} on ${format(bookingDetails.date, "PPP")} at ${bookingDetails.time} has been received.`,
      action: (
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          View Bookings
        </Button>
      ),
    })

    setShowBookingDialog(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 relative overflow-hidden p-4 md:p-6 lg:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1
                className={cn(
                  "font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent",
                  isMobile ? "text-2xl" : "text-4xl",
                )}
              >
                Our Services
              </h1>
            </div>
            <p className={cn("text-slate-600 dark:text-slate-400", isMobile ? "text-sm" : "text-lg")}>
              Explore the range of services designed to support your journey.
            </p>
          </div>
        </motion.div>

        {/* Tabs and Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full sm:w-auto">
                  <TabsList className="flex flex-wrap h-auto p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    {serviceCategories.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-slate-900 data-[state=active]:dark:text-blue-400 transition-all duration-200 py-2 px-4"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white dark:bg-slate-700 border-2 focus:border-blue-500 dark:focus:border-blue-400 w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredServices.length === 0 ? (
            <Card className="col-span-full bg-white/80 dark:bg-slate-800/80 text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold mb-2">No services found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Try adjusting your search or filters.</p>
                <Button
                  onClick={() => {
                    setActiveCategory("All")
                    setSearchQuery("")
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">{service.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-slate-700 dark:text-slate-300 mb-4">{service.description}</p>
                  </CardContent>
                  <CardFooter className="relative z-10 flex justify-end">
                    <Button
                      onClick={() => handleBookService(service)}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white gap-2"
                    >
                      Book Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-[425px] p-6 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Book {selectedService?.title}
            </DialogTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Confirm your details for the {selectedService?.category} service.
            </CardDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Pill className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Service:</span>
              <span className="text-slate-700 dark:text-slate-300">{selectedService?.title}</span>
            </div>
            <div className="flex items-center gap-4">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Price:</span>
              <span className="text-slate-700 dark:text-slate-300">${selectedService?.price}</span>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Duration:</span>
              <span className="text-slate-700 dark:text-slate-300">{selectedService?.duration}</span>
            </div>

            <Separator className="my-2 bg-slate-200 dark:bg-slate-700" />

            <div className="grid gap-2">
              <Label htmlFor="date" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> Preferred Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700",
                      !bookingDetails.date && "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDetails.date ? format(bookingDetails.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                  <Calendar
                    mode="single"
                    selected={bookingDetails.date}
                    onSelect={(date) => setBookingDetails({ ...bookingDetails, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Preferred Time
              </Label>
              <Select
                value={bookingDetails.time}
                onValueChange={(value) => setBookingDetails({ ...bookingDetails, time: value })}
              >
                <SelectTrigger className="w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {/* Mock time slots */}
                  {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"].map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes" className="text-slate-700 dark:text-slate-300">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="e.g., specific requirements, questions..."
                value={bookingDetails.notes}
                onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowBookingDialog(false)}
              className="w-full sm:w-auto bg-white dark:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleConfirmBooking}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white gap-2"
            >
              <CheckCircle className="h-4 w-4" /> Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
