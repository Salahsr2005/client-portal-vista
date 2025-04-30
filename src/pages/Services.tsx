
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Phone,
  Star,
  CreditCard,
  Calendar as CalendarIcon
} from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useApplyForService } from "@/hooks/useServices";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Services() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: services = [], isLoading, error } = useServices();
  const applyForService = useApplyForService();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [applicationNotes, setApplicationNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get unique categories
  const categories = ["all", ...Array.from(new Set(services.map(s => s.category.toLowerCase())))];
  
  // Filter services based on search term and active category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === "all") return matchesSearch;
    return matchesSearch && service.category.toLowerCase() === activeCategory;
  });

  const handleBookService = (serviceId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book services",
        variant: "default",
      });
      navigate("/login");
      return;
    }
    
    setSelectedService(serviceId);
    setDialogOpen(true);
  };
  
  const handleApplySubmit = async () => {
    if (!selectedService) return;
    
    try {
      await applyForService.mutateAsync({
        serviceId: selectedService,
        notes: applicationNotes,
      });
      
      setDialogOpen(false);
      setApplicationNotes("");
      setSelectedService(null);
    } catch (error) {
      console.error("Error applying for service:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <Skeleton className="h-10 w-96" />
              <Skeleton className="h-10 w-64" />
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
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
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
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium">Error Loading Services</h3>
          <p className="text-muted-foreground">
            There was a problem loading the services. Please try again later.
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Book a Service
        </Button>
      </div>
      
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800/30 dark:to-gray-900/30">
          <CardTitle className="text-2xl font-bold">Available Services</CardTitle>
          <CardDescription className="text-base">
            Browse and book services to assist with your international journey
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <TabsList className="mb-4 sm:mb-0 h-auto p-1 bg-slate-100 dark:bg-slate-800/40">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category}
                    value={category} 
                    onClick={() => setActiveCategory(category)}
                    className="capitalize text-sm px-4 py-2"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="pl-8 w-full sm:w-[250px]"
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
                    <Card key={service.id} className="h-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md">
                      <CardHeader className="pb-4 bg-gradient-to-r from-violet-50/50 to-slate-50/50 dark:from-gray-800/30 dark:to-gray-900/30">
                        <div className="flex justify-between">
                          <Badge variant="outline" className="mb-2 capitalize font-medium px-2.5 py-0.5 border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                            {service.category}
                          </Badge>
                          {service.status === "Active" ? (
                            <Badge className="bg-emerald-500">Available</Badge>
                          ) : (
                            <Badge variant="secondary">Unavailable</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                              {service.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <CardDescription className="text-sm">Professional Service</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4 flex-grow">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {service.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-indigo-500 mr-2" />
                            <span>{service.duration} min</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-indigo-500 mr-2" />
                            <span>{service.estimated_completion}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-indigo-500 mr-2" />
                            <span>Support Included</span>
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 text-indigo-500 mr-2" />
                            <span>${service.price}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button variant="outline">Learn More</Button>
                        <Button 
                          className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
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
            
            {categories.filter(cat => cat !== "all").map(category => (
              <TabsContent key={category} value={category} className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.filter(service => service.category.toLowerCase() === category).length === 0 ? (
                    <div className="col-span-full h-[200px] flex items-center justify-center text-muted-foreground">
                      No {category} services found matching your criteria.
                    </div>
                  ) : (
                    filteredServices
                      .filter(service => service.category.toLowerCase() === category)
                      .map((service) => (
                        <Card key={service.id} className="h-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md">
                          <CardHeader className="pb-4 bg-gradient-to-r from-violet-50/50 to-slate-50/50 dark:from-gray-800/30 dark:to-gray-900/30">
                            <div className="flex justify-between">
                              <Badge variant="outline" className="mb-2 capitalize font-medium px-2.5 py-0.5 border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                                {service.category}
                              </Badge>
                              {service.status === "Active" ? (
                                <Badge className="bg-emerald-500">Available</Badge>
                              ) : (
                                <Badge variant="secondary">Unavailable</Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl">{service.name}</CardTitle>
                            <div className="flex items-center mt-2">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                  {service.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <CardDescription className="text-sm">Professional Service</CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-4 flex-grow">
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                              {service.description}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-indigo-500 mr-2" />
                                <span>{service.duration} min</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-indigo-500 mr-2" />
                                <span>{service.estimated_completion}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 text-indigo-500 mr-2" />
                                <span>Support Included</span>
                              </div>
                              <div className="flex items-center">
                                <CreditCard className="h-4 w-4 text-indigo-500 mr-2" />
                                <span>${service.price}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0 flex justify-between">
                            <Button variant="outline">Learn More</Button>
                            <Button 
                              className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
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
        <CardFooter className="flex justify-between bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800/30 dark:to-gray-900/30 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredServices.length} of {services.length} services
          </div>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>
              {selectedService && 
                "Complete your service booking. Add any specific requirements or questions you have."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Service Details</h4>
                  <div className="text-sm">
                    {services.find(s => s.id === selectedService)?.name}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span>${services.find(s => s.id === selectedService)?.price}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Additional Notes
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Add any specific requirements or questions"
                    value={applicationNotes}
                    onChange={(e) => setApplicationNotes(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setDialogOpen(false);
                    setSelectedService(null);
                    setApplicationNotes("");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleApplySubmit}
                  disabled={applyForService.isPending}
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
                >
                  {applyForService.isPending ? "Submitting..." : "Confirm Booking"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
