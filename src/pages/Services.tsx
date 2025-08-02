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
import { Search, Filter, CalendarIcon } from "lucide-react"
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
import { useIsMobile } from "@/hooks/use-mobile" // Import useIsMobile

export default function Services() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: services = [], isLoading, error } = useServices()
  const applyForService = useApplyForService()
  const { toast } = useToast()
  const isMobile = useIsMobile() // Use the hook

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

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800/30 dark:to-gray-900/30 p-4 md:p-6">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <Skeleton className="h-10 w-full sm:w-96" />
              <Skeleton className="h-10 w-full sm:w-64" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-full flex flex-col">
                  <CardHeader>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <div className="flex justify-between w-full">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 p-4 md:p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">Error Loading Services</h3>
          <p className="text-muted-foreground">There was a problem loading the services. Please try again later.</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Book a Service
        </Button>
      </div>

      <Card className="overflow-hidden border-0 shadow-lg rounded-xl">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800/30 dark:to-gray-900/30 p-4 md:p-6">
          <CardTitle className="text-2xl font-bold">Available Services</CardTitle>
          <CardDescription className="text-base">
            Browse and book services to assist with your international journey
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <TabsList className="mb-4 sm:mb-0 h-auto p-1 bg-slate-100 dark:bg-slate-800/40 rounded-lg flex-wrap">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    onClick={() => setActiveCategory(category)}
                    className="capitalize text-sm px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 transition-all duration-200"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuItem>Price (Low to High)</DropdownMenuItem>
                    <DropdownMenuItem>Price (High to Low)</DropdownMenuItem>
                    <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                    <DropdownMenuItem>Online Services</DropdownMenuItem>
                    <DropdownMenuItem>In-person Services</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.length === 0 ? (
                  <div className="col-span-full h-[200px] flex items-center justify-center text-muted-foreground">
                    No services found matching your criteria.
                  </div>
                ) : (
                  filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className="group h-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xl relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 to-indigo-50/20 dark:from-gray-800/10 dark:to-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
                      <CardHeader className="pb-4 bg-transparent relative z-10">
                        <div className="flex justify-between items-center">
                          <Badge
                            variant="outline"
                            className="capitalize font-medium px-2.5 py-0.5 border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
                          >
                            {service.category}
                          </Badge>
                          {service.status === "Active" ? (
                            <Badge className="bg-emerald-500 text-white">Available</Badge>
                          ) : (
                            <Badge variant="secondary">Unavailable</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl mt-3">{service.name}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                              {service.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <CardDescription className="text-sm">Professional Service</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4 flex-grow relative z-10">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{service.description}</p>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between relative z-10">
                        <Button variant="outline" className="hover:bg-indigo-50 dark:hover:bg-gray-800 bg-transparent">
                          Learn More
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 transition-all duration-300"
                          onClick={() => handleBookService(service.id)}
                          disabled={service.status !== "Active" || applyForService.isPending}
                        >
                          Book Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {categories
              .filter((cat) => cat !== "all")
              .map((category) => (
                <TabsContent key={category} value={category} className="m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.filter((service) => service.category.toLowerCase() === category).length === 0 ? (
                      <div className="col-span-full h-[200px] flex items-center justify-center text-muted-foreground">
                        No {category} services found matching your criteria.
                      </div>
                    ) : (
                      filteredServices
                        .filter((service) => service.category.toLowerCase() === category)
                        .map((service) => (
                          <Card
                            key={service.id}
                            className="group h-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xl relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 to-indigo-50/20 dark:from-gray-800/10 dark:to-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
                            <CardHeader className="pb-4 bg-transparent relative z-10">
                              <div className="flex justify-between items-center">
                                <Badge
                                  variant="outline"
                                  className="capitalize font-medium px-2.5 py-0.5 border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
                                >
                                  {service.category}
                                </Badge>
                                {service.status === "Active" ? (
                                  <Badge className="bg-emerald-500 text-white">Available</Badge>
                                ) : (
                                  <Badge variant="secondary">Unavailable</Badge>
                                )}
                              </div>
                              <CardTitle className="text-xl mt-3">{service.name}</CardTitle>
                              <div className="flex items-center mt-2">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                    {service.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <CardDescription className="text-sm">Professional Service</CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-4 flex-grow relative z-10">
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{service.description}</p>
                            </CardContent>
                            <CardFooter className="pt-0 flex justify-between relative z-10">
                              <Button
                                variant="outline"
                                className="hover:bg-indigo-50 dark:hover:bg-gray-800 bg-transparent"
                              >
                                Learn More
                              </Button>
                              <Button
                                className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 transition-all duration-300"
                                onClick={() => handleBookService(service.id)}
                                disabled={service.status !== "Active" || applyForService.isPending}
                              >
                                Book Now
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                    )}
                  </div>
                </TabsContent>
              ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800/30 dark:to-gray-900/30 py-4 px-4 md:px-6 rounded-b-xl">
          <div className="text-sm text-muted-foreground">
            Showing {filteredServices.length} of {services.length} services
          </div>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg">
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>
              {selectedService && "Complete your service booking. Add any specific requirements or questions you have."}
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-lg text-foreground">Service Details</h4>
                  <div className="text-base font-semibold text-primary">
                    {services.find((s) => s.id === selectedService)?.name}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Price:</span>
                    <span className="font-medium text-foreground">
                      ${services.find((s) => s.id === selectedService)?.price}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Duration:</span>
                    <span className="font-medium text-foreground">
                      {services.find((s) => s.id === selectedService)?.duration} min
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium text-foreground">
                    Additional Notes
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Add any specific requirements or questions"
                    value={applicationNotes}
                    onChange={(e) => setApplicationNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    setSelectedService(null)
                    setApplicationNotes("")
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplySubmit}
                  disabled={applyForService.isPending}
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 w-full sm:w-auto"
                >
                  {applyForService.isPending ? "Submitting..." : "Confirm Booking"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

