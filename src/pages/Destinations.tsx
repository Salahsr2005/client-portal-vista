
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
  Info 
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    description: "One of the largest, most diverse universities in the UK with over 120,000 students in London, and a further 50,000 studying across 180 countries."
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
    description: "Japan's top university and one of Asia's best. Known for research excellence and innovation across disciplines."
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
    description: "A world-renowned university located in the heart of Paris, offering programs in arts, sciences, medicine, and engineering."
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
    description: "One of Europe's top technical universities, offering tuition-free education and known for engineering and natural sciences."
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
    description: "Australia's leading university, recognized globally for teaching and research excellence across a range of disciplines."
  }
];

// Country options for filter
const countries = [...new Set(destinations.map(d => d.country))];

export default function Destinations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [partnerFilter, setPartnerFilter] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Destinations</h1>
        <Button>
          <Globe className="mr-2 h-4 w-4" />
          Explore All Destinations
        </Button>
      </div>
      
      <Card>
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
                      {country}
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
                  filteredDestinations.map((destination) => (
                    <DestinationCard 
                      key={destination.id} 
                      destination={destination} 
                      isFavorite={favorites.includes(destination.id)}
                      onToggleFavorite={toggleFavorite}
                    />
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
                  filteredDestinations.filter(d => d.popular).map((destination) => (
                    <DestinationCard 
                      key={destination.id} 
                      destination={destination} 
                      isFavorite={favorites.includes(destination.id)}
                      onToggleFavorite={toggleFavorite}
                    />
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
                  filteredDestinations.filter(d => d.partnered).map((destination) => (
                    <DestinationCard 
                      key={destination.id} 
                      destination={destination} 
                      isFavorite={favorites.includes(destination.id)}
                      onToggleFavorite={toggleFavorite}
                    />
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
                  filteredDestinations.filter(d => favorites.includes(d.id)).map((destination) => (
                    <DestinationCard 
                      key={destination.id} 
                      destination={destination} 
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                    />
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
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 rounded-full"
          onClick={() => onToggleFavorite(destination.id)}
        >
          <Heart 
            className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} 
          />
        </Button>
        {destination.partnered && (
          <Badge className="absolute top-2 left-2 bg-primary/90">Partner Institution</Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{destination.name}</CardTitle>
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
        <Button>
          <GraduationCap className="mr-2 h-4 w-4" />
          View Programs
        </Button>
      </CardFooter>
    </Card>
  );
}
