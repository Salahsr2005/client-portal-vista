
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Clock,
  DollarSign,
  TrendingUp,
  Eye,
  Star,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDestinations } from "@/hooks/useDestinations";

// Flag mapping for countries
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

export default function Destinations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  
  // Fetch real data from Supabase
  const { data: destinations = [], isLoading, error } = useDestinations();
  
  // Get unique regions from destinations
  const regions = [...new Set(destinations.map(d => d.region).filter(Boolean))];
  
  // Filter destinations based on search and filters
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = 
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = selectedRegions.length === 0 || 
                         selectedRegions.includes(destination.region);
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && destination.isActive) ||
                         (statusFilter === "inactive" && !destination.isActive);
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const toggleRegionFilter = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Destinations</h1>
        </div>
        
        <Card>
          <CardContent className="flex justify-center items-center h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading destinations...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Destinations</h1>
        </div>
        
        <Card className="border-red-200">
          <CardContent className="flex justify-center items-center h-[400px]">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Globe className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Failed to load destinations</h3>
                <p className="text-red-600 text-sm mt-1">Please try again later or contact support.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Study Destinations
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover amazing educational opportunities around the world
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
          <Globe className="mr-2 h-4 w-4" />
          Explore All Destinations
        </Button>
      </motion.div>
      
      {/* Main Content Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background via-background to-primary/5">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Educational Destinations
            </CardTitle>
            <CardDescription>
              Explore universities and educational institutions around the world with our comprehensive destination guide
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Search and Filter Bar */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-card/50 rounded-xl border"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search destinations, countries, or regions..."
                  className="pl-10 border-0 bg-background/80 focus:bg-background transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                {/* Region Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Regions
                      {selectedRegions.length > 0 && (
                        <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                          {selectedRegions.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[220px]">
                    <DropdownMenuLabel>Filter by Region</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {regions.map(region => (
                      <DropdownMenuItem 
                        key={region} 
                        onClick={() => toggleRegionFilter(region)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span>{region}</span>
                        {selectedRegions.includes(region) && (
                          <span className="text-primary">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                    {selectedRegions.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setSelectedRegions([])}
                          className="text-muted-foreground"
                        >
                          Clear filters
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All Destinations
                      {statusFilter === "all" && <span className="ml-auto text-primary">✓</span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                      Active Programs
                      {statusFilter === "active" && <span className="ml-auto text-primary">✓</span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                      Coming Soon
                      {statusFilter === "inactive" && <span className="ml-auto text-primary">✓</span>}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
            
            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-background">
                  All ({filteredDestinations.length})
                </TabsTrigger>
                <TabsTrigger value="popular" className="data-[state=active]:bg-background">
                  Popular
                </TabsTrigger>
                <TabsTrigger value="favorites" className="data-[state=active]:bg-background">
                  Favorites ({favorites.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-background">
                  Active
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <DestinationGrid 
                  destinations={filteredDestinations}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onSelectDestination={setSelectedDestination}
                />
              </TabsContent>
              
              <TabsContent value="popular" className="mt-6">
                <DestinationGrid 
                  destinations={filteredDestinations.filter(d => d.successRate >= 90)}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onSelectDestination={setSelectedDestination}
                />
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-6">
                <DestinationGrid 
                  destinations={filteredDestinations.filter(d => favorites.includes(d.id))}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onSelectDestination={setSelectedDestination}
                />
              </TabsContent>
              
              <TabsContent value="active" className="mt-6">
                <DestinationGrid 
                  destinations={filteredDestinations.filter(d => d.isActive)}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onSelectDestination={setSelectedDestination}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {filteredDestinations.length} of {destinations.length} destinations
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                <TrendingUp className="h-3 w-3 mr-1" />
                High Success Rate
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                <Clock className="h-3 w-3 mr-1" />
                Fast Processing
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Destination Detail Dialog */}
      <DestinationDetailDialog 
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />
    </motion.div>
  );
}

interface DestinationGridProps {
  destinations: any[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectDestination: (destination: any) => void;
}

function DestinationGrid({ destinations, favorites, onToggleFavorite, onSelectDestination }: DestinationGridProps) {
  if (destinations.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-[300px] text-center"
      >
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Globe className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No destinations found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence>
        {destinations.map((destination, index) => (
          <DestinationCard 
            key={destination.id}
            destination={destination}
            isFavorite={favorites.includes(destination.id)}
            onToggleFavorite={onToggleFavorite}
            onSelect={onSelectDestination}
            index={index}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

interface DestinationCardProps {
  destination: any;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (destination: any) => void;
  index: number;
}

function DestinationCard({ destination, isFavorite, onToggleFavorite, onSelect, index }: DestinationCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="overflow-hidden h-full bg-gradient-to-br from-background to-primary/5 border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ 
              backgroundImage: `url(${destination.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-8 h-8 bg-background/90 hover:bg-background border-0 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(destination.id);
              }}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )} 
              />
            </Button>
          </div>

          {/* Status Badge */}
          {destination.isActive && (
            <Badge className="absolute top-3 left-3 bg-green-500/90 hover:bg-green-500 text-white border-0">
              Active Programs
            </Badge>
          )}
          
          {/* Country Flag */}
          <div className="absolute bottom-3 right-3">
            <div className="w-8 h-6 rounded-sm overflow-hidden border border-white/20 shadow-sm">
              <img 
                src={countryFlags[destination.country] || destination.image} 
                alt={destination.country} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {destination.name}
              </CardTitle>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {destination.country}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 pb-4">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {destination.description}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
                <div className="font-semibold text-sm">{destination.successRate}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-xs text-muted-foreground">Processing Fee</div>
                <div className="font-semibold text-sm">${destination.fees}</div>
              </div>
            </div>
          </div>
          
          {/* Processing Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{destination.processingTime}</span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 group-hover:border-primary transition-colors"
            onClick={() => onSelect(destination)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
            <GraduationCap className="mr-2 h-4 w-4" />
            Explore Programs
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

interface DestinationDetailDialogProps {
  destination: any;
  onClose: () => void;
}

function DestinationDetailDialog({ destination, onClose }: DestinationDetailDialogProps) {
  if (!destination) return null;

  return (
    <Dialog open={!!destination} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-6 rounded overflow-hidden">
              <img 
                src={countryFlags[destination.country] || destination.image} 
                alt={destination.country} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <DialogTitle className="text-xl">{destination.name}</DialogTitle>
              <DialogDescription className="text-base">
                {destination.country} • {destination.region}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Hero Image */}
          <div className="w-full h-48 rounded-lg overflow-hidden">
            <img 
              src={destination.image} 
              alt={destination.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About this Destination</h3>
            <p className="text-muted-foreground">{destination.description}</p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="font-semibold">{destination.successRate}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">${destination.fees}</div>
              <div className="text-xs text-muted-foreground">Processing Fee</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="font-semibold">{destination.processingTime}</div>
              <div className="text-xs text-muted-foreground">Processing Time</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <div className="font-semibold">4.8/5</div>
              <div className="text-xs text-muted-foreground">Student Rating</div>
            </div>
          </div>
          
          {/* Visa Requirements */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Visa Requirements
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">{destination.visaRequirements}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              Download Brochure
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-primary to-blue-600">
              Start Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
