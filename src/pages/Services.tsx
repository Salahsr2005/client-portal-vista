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
  MoreVertical, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone,
  Star,
  CreditCard,
  Calendar as CalendarIcon
} from "lucide-react";

// Mock data for services
const services = [
  {
    id: "SRV-001",
    name: "Visa Application Assistance",
    provider: "Global Visa Services",
    providerImg: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    rating: 4.8,
    reviewCount: 124,
    price: 299,
    location: "Online",
    duration: "4-6 weeks",
    category: "visa",
    description: "Professional assistance with visa applications for various countries. Includes document review, application filling, and submission guidance."
  },
  {
    id: "SRV-002",
    name: "Pre-Departure Orientation",
    provider: "International Student Office",
    providerImg: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    rating: 4.5,
    reviewCount: 89,
    price: 149,
    location: "Online / In-person",
    duration: "3 hours",
    category: "orientation",
    description: "Comprehensive orientation session for students preparing to study abroad. Covers cultural adjustment, academics, housing, and practical tips."
  },
  {
    id: "SRV-003",
    name: "Accommodation Placement",
    provider: "HomeStay Connect",
    providerImg: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    rating: 4.2,
    reviewCount: 156,
    price: 349,
    location: "Varies",
    duration: "1-2 weeks",
    category: "accommodation",
    description: "Housing arrangement service for international students. Options include homestays, dormitories, and private apartments near the campus."
  },
  {
    id: "SRV-004",
    name: "Language Proficiency Test Prep",
    provider: "Language Masters",
    providerImg: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    rating: 4.9,
    reviewCount: 215,
    price: 499,
    location: "Online",
    duration: "4 weeks",
    category: "language",
    description: "Intensive preparation course for IELTS, TOEFL, and other language proficiency tests. Includes practice tests and personalized feedback."
  },
  {
    id: "SRV-005",
    name: "Airport Pickup & Transfer",
    provider: "Easy Transfers",
    providerImg: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    rating: 4.6,
    reviewCount: 78,
    price: 89,
    location: "Multiple Airports",
    duration: "As needed",
    category: "transport",
    description: "Safe and reliable transportation service from the airport to your accommodation. Available at major international airports."
  },
];

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Filter services based on search term and active category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === "all") return matchesSearch;
    return matchesSearch && service.category === activeCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Book a Service
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
          <CardDescription>
            Browse and book services to assist with your international journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <TabsList className="mb-4 sm:mb-0">
                <TabsTrigger 
                  value="all" 
                  onClick={() => setActiveCategory("all")}
                >
                  All Services
                </TabsTrigger>
                <TabsTrigger 
                  value="visa" 
                  onClick={() => setActiveCategory("visa")}
                >
                  Visa Services
                </TabsTrigger>
                <TabsTrigger 
                  value="accommodation" 
                  onClick={() => setActiveCategory("accommodation")}
                >
                  Accommodation
                </TabsTrigger>
                <TabsTrigger 
                  value="language" 
                  onClick={() => setActiveCategory("language")}
                >
                  Language
                </TabsTrigger>
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
                    <DropdownMenuItem>Rating (Highest)</DropdownMenuItem>
                    <DropdownMenuSeparator />
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
                    <Card key={service.id} className="h-full flex flex-col overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between">
                          <Badge variant="outline" className="mb-2">
                            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                            <span className="text-sm font-medium">{service.rating}</span>
                            <span className="text-sm text-muted-foreground ml-1">({service.reviewCount})</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={service.providerImg} alt={service.provider} />
                            <AvatarFallback>{service.provider.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <CardDescription className="text-sm">{service.provider}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4 flex-grow">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {service.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{service.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{service.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>Support Included</span>
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>${service.price}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button variant="outline">Learn More</Button>
                        <Button>Book Now</Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="visa" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.filter(service => service.category === "visa").length === 0 ? (
                  <div className="col-span-full h-[200px] flex items-center justify-center text-muted-foreground">
                    No services found matching your criteria.
                  </div>
                ) : (
                  filteredServices.filter(service => service.category === "visa").map((service) => (
                    <Card key={service.id} className="h-full flex flex-col overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between">
                          <Badge variant="outline" className="mb-2">
                            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                            <span className="text-sm font-medium">{service.rating}</span>
                            <span className="text-sm text-muted-foreground ml-1">({service.reviewCount})</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={service.providerImg} alt={service.provider} />
                            <AvatarFallback>{service.provider.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <CardDescription className="text-sm">{service.provider}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4 flex-grow">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {service.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{service.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{service.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>Support Included</span>
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>${service.price}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button variant="outline">Learn More</Button>
                        <Button>Book Now</Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="accommodation" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.filter(service => service.category === "accommodation").length === 0 ? (
                  <div className="col-span-full h-[200px] flex items-center justify-center text-muted-foreground">
                    No services found matching your criteria.
                  </div>
                ) : (
                  filteredServices.filter(service => service.category === "accommodation").map((service) => (
                    <Card key={service.id} className="h-full flex flex-col overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between">
                          <Badge variant="outline" className="mb-2">
                            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                            <span className="text-sm font-medium">{service.rating}</span>
                            <span className="text-sm text-muted-foreground ml-1">({service.reviewCount})</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={service.providerImg} alt={service.provider} />
                            <AvatarFallback>{service.provider.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <CardDescription className="text-sm">{service.provider}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4 flex-grow">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {service.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{service.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{service.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>Support Included</span>
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>${service.price}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button variant="outline">Learn More</Button>
                        <Button>Book Now</Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="language" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.filter(service => service.category === "language").length === 0 ? (
                  <div className="col-span-full h-[200px] flex items-center justify-center text-muted-foreground">
                    No services found matching your criteria.
                  </div>
                ) : (
                  filteredServices.filter(service => service.category === "language").map((service) => (
                    <Card key={service.id} className="h-full flex flex-col overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between">
                          <Badge variant="outline" className="mb-2">
                            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                            <span className="text-sm font-medium">{service.rating}</span>
                            <span className="text-sm text-muted-foreground ml-1">({service.reviewCount})</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={service.providerImg} alt={service.provider} />
                            <AvatarFallback>{service.provider.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <CardDescription className="text-sm">{service.provider}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4 flex-grow">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {service.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{service.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{service.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>Support Included</span>
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>${service.price}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button variant="outline">Learn More</Button>
                        <Button>Book Now</Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredServices.length} of {services.length} services
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
