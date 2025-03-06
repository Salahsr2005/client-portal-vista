
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, MapPin, Plane, Train, Ship, Info } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: "Paris, France",
    description: "Study at some of the world's most prestigious universities in the heart of European culture.",
    image: "/placeholder.svg",
    programs: 18,
    popular: true,
    type: "international"
  },
  {
    id: 2,
    name: "Barcelona, Spain",
    description: "Experience Mediterranean culture and world-class education in vibrant Barcelona.",
    image: "/placeholder.svg",
    programs: 12,
    popular: true,
    type: "international"
  },
  {
    id: 3,
    name: "Oran, Algeria",
    description: "Explore educational opportunities in Algeria's second largest city with rich cultural heritage.",
    image: "/placeholder.svg",
    programs: 15,
    popular: false,
    type: "domestic"
  },
  {
    id: 4,
    name: "Constantine, Algeria",
    description: "Study in the city of bridges with spectacular views and strong academic traditions.",
    image: "/placeholder.svg",
    programs: 10,
    popular: true,
    type: "domestic"
  },
  {
    id: 5,
    name: "Cairo, Egypt",
    description: "Join programs at historic universities in one of the world's oldest civilization centers.",
    image: "/placeholder.svg",
    programs: 8,
    popular: false,
    type: "international"
  },
  {
    id: 6,
    name: "Istanbul, Turkey",
    description: "Experience education spanning two continents in this cultural and historical metropolis.",
    image: "/placeholder.svg",
    programs: 14,
    popular: true,
    type: "international"
  },
  {
    id: 7,
    name: "Annaba, Algeria",
    description: "Coastal city offering quality education with Mediterranean charm and rich history.",
    image: "/placeholder.svg",
    programs: 7,
    popular: false,
    type: "domestic"
  },
  {
    id: 8,
    name: "Montreal, Canada",
    description: "Study in a bilingual environment with top-ranked universities and vibrant city life.",
    image: "/placeholder.svg",
    programs: 9,
    popular: true,
    type: "international"
  }
];

const DestinationsPage = () => {
  const [filter, setFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const filteredDestinations = destinations.filter(dest => {
    const matchesFilter = filter === "all" || 
                          (filter === "popular" && dest.popular) || 
                          (filter === "domestic" && dest.type === "domestic") ||
                          (filter === "international" && dest.type === "international");
    
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Study Destinations</h1>
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search destinations..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-8" onValueChange={setFilter}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Destinations</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="domestic">Domestic</TabsTrigger>
          <TabsTrigger value="international">International</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <p className="text-muted-foreground mb-4">
            Showing all available study destinations. Browse through our partner locations worldwide.
          </p>
        </TabsContent>
        <TabsContent value="popular" className="mt-0">
          <p className="text-muted-foreground mb-4">
            Our most sought-after study destinations with high student satisfaction rates.
          </p>
        </TabsContent>
        <TabsContent value="domestic" className="mt-0">
          <p className="text-muted-foreground mb-4">
            Study opportunities across Algeria at prestigious local universities and institutions.
          </p>
        </TabsContent>
        <TabsContent value="international" className="mt-0">
          <p className="text-muted-foreground mb-4">
            International study destinations with partner universities around the world.
          </p>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDestinations.map((destination) => (
          <Card key={destination.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={destination.image} 
                alt={destination.name} 
                className="object-cover w-full h-full"
              />
              {destination.popular && (
                <Badge className="absolute top-2 right-2 bg-yellow-500">
                  Popular
                </Badge>
              )}
              <Badge className="absolute bottom-2 left-2" variant={destination.type === "domestic" ? "outline" : "default"}>
                {destination.type === "domestic" ? "Domestic" : "International"}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {destination.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-2">{destination.description}</CardDescription>
              <div className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-1" />
                <span>{destination.programs} programs available</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-2" />
                Details
              </Button>
              <Button size="sm">
                Browse Programs
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredDestinations.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">No destinations found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}
      
      <div className="mt-12 bg-muted/50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Travel Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Air Travel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Information about flights, airports, and airline partnerships for students.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train className="h-5 w-5" />
                Rail Travel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Train connections, rail passes, and discounts for educational travel.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5" />
                Visa Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Assistance with visa applications and immigration requirements.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage;
