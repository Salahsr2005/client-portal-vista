
import React, { useState, useEffect } from "react";
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Globe, 
  Heart, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Languages, 
  Info,
  Flag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import AOS from "aos";

// Flag SVG mapping
const countryFlags: Record<string, string> = {
  "United Kingdom": "https://flagcdn.com/gb.svg",
  "Japan": "https://flagcdn.com/jp.svg",
  "France": "https://flagcdn.com/fr.svg",
  "Germany": "https://flagcdn.com/de.svg",
  "Australia": "https://flagcdn.com/au.svg",
  "United States": "https://flagcdn.com/us.svg",
  "Canada": "https://flagcdn.com/ca.svg",
  "China": "https://flagcdn.com/cn.svg",
  "Spain": "https://flagcdn.com/es.svg",
  "Italy": "https://flagcdn.com/it.svg",
  "Netherlands": "https://flagcdn.com/nl.svg",
  "Poland": "https://flagcdn.com/pl.svg",
  "Belgium": "https://flagcdn.com/be.svg",
  "Switzerland": "https://flagcdn.com/ch.svg",
};

// Mock data for destinations
const destinations = [
  {
    id: "DST-001",
    name: "University of London",
    country: "United Kingdom",
    city: "London",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    programs: 12,
    partnered: true,
    tuitionRange: "$15,000 - $25,000",
    languages: ["English"],
    popular: true,
    description: "One of the largest, most diverse universities in the UK with over 120,000 students in London, and a further 50,000 studying across 180 countries.",
    admissionRequirements: "High school diploma or equivalent with minimum GPA of 3.0. IELTS score of 6.5 or equivalent. Personal statement and two letters of recommendation.",
    applicationDeadline: "January 15 for fall semester, October 1 for spring semester"
  },
  {
    id: "DST-002",
    name: "University of Tokyo",
    country: "Japan",
    city: "Tokyo",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    programs: 8,
    partnered: true,
    tuitionRange: "$8,000 - $12,000",
    languages: ["Japanese", "English"],
    popular: true,
    description: "Japan's top university and one of Asia's best. Known for research excellence and innovation across disciplines.",
    admissionRequirements: "Bachelor's degree with minimum GPA of 3.3. JLPT N2 for Japanese-taught programs or TOEFL score of 90+ for English programs. Research proposal for graduate studies.",
    applicationDeadline: "December 1 for spring enrollment, May 15 for fall enrollment"
  },
  {
    id: "DST-003",
    name: "Sorbonne University",
    country: "France",
    city: "Paris",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    programs: 15,
    partnered: false,
    tuitionRange: "$2,000 - $10,000",
    languages: ["French", "English"],
    popular: false,
    description: "A world-renowned university located in the heart of Paris, offering programs in arts, sciences, medicine, and engineering.",
    admissionRequirements: "Baccalauréat or equivalent. Minimum French language proficiency at B2 level (DELF/DALF). Entrance examination for some programs. CV and motivation letter.",
    applicationDeadline: "March 31 for fall semester, November 30 for spring semester"
  },
  {
    id: "DST-004",
    name: "Technical University of Munich",
    country: "Germany",
    city: "Munich",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    programs: 10,
    partnered: true,
    tuitionRange: "$0 - $5,000",
    languages: ["German", "English"],
    popular: true,
    description: "One of Europe's top technical universities, offering tuition-free education and known for engineering and natural sciences.",
    admissionRequirements: "Higher education entrance qualification. German language proficiency at B2 level for German-taught programs or English B2 for English programs. Specific subject requirements vary by program.",
    applicationDeadline: "January 15 for summer semester, July 15 for winter semester"
  },
  {
    id: "DST-005",
    name: "University of Melbourne",
    country: "Australia",
    city: "Melbourne",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    programs: 20,
    partnered: false,
    tuitionRange: "$20,000 - $35,000",
    languages: ["English"],
    popular: false,
    description: "Australia's leading university, recognized globally for teaching and research excellence across a range of disciplines.",
    admissionRequirements: "Completion of Australian Year 12 or international equivalent. IELTS score of 6.5 overall (minimum 6.0 in each component). Supporting statement and relevant prerequisites for specific courses.",
    applicationDeadline: "October 31 for Semester 1, April 30 for Semester 2"
  }
];

// Country options for filter
const countries = [...new Set(destinations.map(d => d.country))];

export default function Destinations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [partnerFilter, setPartnerFilter] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: 'mobile'
    });
  }, []);
  
  // Filter destinations based on search and filters
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         destination.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountries.length === 0 || 
                          selectedCountries.includes(destination.country);
    
    const matchesPartner = partnerFilter === "all" || 
                          (partnerFilter === "partnered" && destination.partnered) ||
                          (partnerFilter === "non-partnered" && !destination.partnered);
    
    return matchesSearch && matchesCountry && matchesPartner;
  });

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const toggleCountryFilter = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  return (
    <div className="space-y-6" data-aos="fade-up">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Destinations</h1>
        <Button>
          <Globe className="mr-2 h-4 w-4" />
          Explore All Destinations
        </Button>
      </div>
      
      <Card data-aos="fade-up" data-aos-delay="100">
        <CardHeader>
          <CardTitle>Study Destinations</CardTitle>
          <CardDescription>
            Explore universities and educational institutions around the world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full sm:w-[350px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search destinations, cities, or countries..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px]">
                  <DropdownMenuLabel>Filter By Country</DropdownMenuLabel>
                  {countries.map(country => (
                    <DropdownMenuItem 
                      key={country} 
                      onClick={() => toggleCountryFilter(country)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <img 
                          src={countryFlags[country] || `https://flagcdn.com/16x12/${country.substring(0, 2).toLowerCase()}.png`} 
                          alt={country} 
                          className="w-4 h-3 object-cover"
                        />
                        {country}
                      </div>
                      {selectedCountries.includes(country) && (
                        <span className="ml-auto">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Partnership Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setPartnerFilter("all")}>
                    All
                    {partnerFilter === "all" && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPartnerFilter("partnered")}>
                    Partner Institutions
                    {partnerFilter === "partnered" && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPartnerFilter("non-partnered")}>
                    Non-Partner Institutions
                    {partnerFilter === "non-partnered" && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Destinations</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="partnered">Partner Institutions</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.length === 0 ? (
                  <div className="col-span-full h-[200px] flex items-center justify-center text-muted-foreground">
                    No destinations found matching your criteria.
                  </div>
                ) : (
                  filteredDestinations.map((destination, index) => (
                    <motion.div
                      key={destination.id}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      whileHover={{ 
                        scale: 1.03, 
                        rotateY: 5, 
                        rotateX: -5,
                        z: 50
                      }}
                      className="transform-gpu perspective-1000"
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <DestinationCard 
                        destination={destination} 
                        isFavorite={favorites.includes(destination.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="popular" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.filter(d => d.popular).length === 0 ? (
                  <div className="col-span-full h-[200px] flex items-center justify-center text-muted-foreground">
                    No popular destinations found matching your criteria.
                  </div>
                ) : (
                  filteredDestinations.filter(d => d.popular).map((destination, index) => (
                    <motion.div
                      key={destination.id}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      whileHover={{ 
                        scale: 1.03, 
                        rotateY: 5, 
                        rotateX: -5,
                        z: 50
                      }}
                      className="transform-gpu perspective-1000"
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <DestinationCard 
                        destination={destination} 
                        isFavorite={favorites.includes(destination.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="partnered" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.filter(d => d.partnered).length === 0 ? (
                  <div className="col-span-full h-[200px] flex items-center justify-center text-muted-foreground">
                    No partner institutions found matching your criteria.
                  </div>
                ) : (
                  filteredDestinations.filter(d => d.partnered).map((destination, index) => (
                    <motion.div
                      key={destination.id}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      whileHover={{ 
                        scale: 1.03, 
                        rotateY: 5, 
                        rotateX: -5,
                        z: 50
                      }}
                      className="transform-gpu perspective-1000"
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <DestinationCard 
                        destination={destination} 
                        isFavorite={favorites.includes(destination.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="favorites" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.filter(d => favorites.includes(d.id)).length === 0 ? (
                  <div className="col-span-full h-[200px] flex items-center justify-center text-muted-foreground">
                    No favorites added yet. Click the heart icon to add destinations to your favorites.
                  </div>
                ) : (
                  filteredDestinations.filter(d => favorites.includes(d.id)).map((destination, index) => (
                    <motion.div
                      key={destination.id}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      whileHover={{ 
                        scale: 1.03, 
                        rotateY: 5, 
                        rotateX: -5,
                        z: 50
                      }}
                      className="transform-gpu perspective-1000"
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <DestinationCard 
                        destination={destination}  
                        isFavorite={true}
                        onToggleFavorite={toggleFavorite}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredDestinations.length} of {destinations.length} destinations
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

interface DestinationCardProps {
  destination: typeof destinations[0];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

function DestinationCard({ destination, isFavorite, onToggleFavorite }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col relative group">
      {/* 3D Effect Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <div className="absolute inset-0 shadow-[0_0_15px_rgba(59,130,246,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
      
      <div className="relative h-48">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 rounded-full z-10"
          onClick={() => onToggleFavorite(destination.id)}
        >
          <Heart 
            className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} 
          />
        </Button>
        
        {destination.partnered && (
          <Badge className="absolute top-2 left-2 bg-primary/90 z-10">Partner Institution</Badge>
        )}
        
        {/* Country flag */}
        <div className="absolute bottom-2 right-2 h-8 w-10 overflow-hidden rounded-md shadow-lg border border-white/10 z-10">
          <img 
            src={countryFlags[destination.country] || `https://flagcdn.com/${destination.country.substring(0, 2).toLowerCase()}.svg`} 
            alt={destination.country} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl line-clamp-1">{destination.name}</CardTitle>
            <div className="flex items-center mt-1 text-muted-foreground text-sm">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {destination.city}, {destination.country}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {destination.description}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-start">
            <GraduationCap className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
            <div>
              <div className="font-medium">Programs</div>
              <div className="text-muted-foreground">{destination.programs} available</div>
            </div>
          </div>
          <div className="flex items-start">
            <Calendar className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
            <div>
              <div className="font-medium">Tuition</div>
              <div className="text-muted-foreground">{destination.tuitionRange}</div>
            </div>
          </div>
          <div className="flex items-start col-span-2">
            <Languages className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
            <div>
              <div className="font-medium">Languages</div>
              <div className="text-muted-foreground">{destination.languages.join(", ")}</div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline">
          <Info className="mr-2 h-4 w-4" />
          More Info
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <GraduationCap className="mr-2 h-4 w-4" />
              Admission Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <img 
                  src={countryFlags[destination.country] || `https://flagcdn.com/${destination.country.substring(0, 2).toLowerCase()}.svg`} 
                  alt={destination.country} 
                  className="w-6 h-4"
                />
                {destination.name}
              </DialogTitle>
              <DialogDescription>
                Admission requirements and application information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Admission Requirements
                </h4>
                <p className="text-sm text-muted-foreground">{destination.admissionRequirements}</p>
              </div>
              
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Application Deadlines
                </h4>
                <p className="text-sm text-muted-foreground">{destination.applicationDeadline}</p>
              </div>
              
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Languages className="h-4 w-4 text-primary" />
                  Language Requirements
                </h4>
                <p className="text-sm text-muted-foreground">
                  {destination.languages.includes("English") ? 
                    "IELTS 6.5+ or TOEFL iBT 90+ required for English-taught programs." : ""}
                  {destination.languages.includes("French") ? 
                    " DELF B2 or higher required for French-taught programs." : ""}
                  {destination.languages.includes("German") ? 
                    " TestDaF level 4 or DSH-2 required for German-taught programs." : ""}
                  {destination.languages.includes("Japanese") ? 
                    " JLPT N2 or higher required for Japanese-taught programs." : ""}
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline">Download Brochure</Button>
              <Button>Apply Now</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
      
      {/* Decorative 3D elements */}
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-blue-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <div className="absolute -top-2 -left-2 w-10 h-10 bg-blue-300/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </Card>
  );
}
