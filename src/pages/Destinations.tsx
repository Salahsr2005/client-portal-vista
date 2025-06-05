
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  MapPin, 
  TrendingUp,
  Users,
  Star,
  BookOpen,
  ArrowRight,
  Sparkles,
  Target,
  Award,
  DollarSign,
  BarChart3,
  Flame,
  Crown,
  Eye,
  Heart,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDestinationStats, DestinationStats } from "@/hooks/useDestinationStats";

// Flag mapping for countries
const countryFlags: Record<string, string> = {
  "France": "🇫🇷",
  "Germany": "🇩🇪", 
  "Spain": "🇪🇸",
  "Italy": "🇮🇹",
  "Netherlands": "🇳🇱",
  "Poland": "🇵🇱",
  "Belgium": "🇧🇪",
  "Switzerland": "🇨🇭",
  "United Kingdom": "🇬🇧",
  "Canada": "🇨🇦",
  "Australia": "🇦🇺",
  "United States": "🇺🇸",
};

const countryImages: Record<string, string> = {
  "France": "https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&w=800&q=80",
  "Germany": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
  "Spain": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80",
  "Italy": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=800&q=80",
  "Netherlands": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80",
  "Poland": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
  "Belgium": "https://images.unsplash.com/photo-1559564484-0b8b027d5dd8?auto=format&fit=crop&w=800&q=80",
  "Switzerland": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
};

export default function Destinations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<DestinationStats | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const { data: destinations = [], isLoading, error } = useDestinationStats();
  
  // Process destinations data
  const processedDestinations = useMemo(() => {
    return destinations.map((dest, index) => ({
      ...dest,
      id: dest.country,
      name: dest.country,
      flag: countryFlags[dest.country] || "🌍",
      image: countryImages[dest.country] || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80`,
      rank: index + 1,
      isPopular: dest.popularity_score > 5,
      isTrending: dest.trending_score >= 2,
      isNew: dest.total_applications === 0,
    }));
  }, [destinations]);

  // Filter destinations
  const filteredDestinations = useMemo(() => {
    return processedDestinations.filter(dest =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processedDestinations, searchTerm]);

  // Categorize destinations
  const popularDestinations = filteredDestinations.filter(d => d.isPopular);
  const trendingDestinations = filteredDestinations.filter(d => d.isTrending);
  const favoriteDestinations = filteredDestinations.filter(d => favorites.includes(d.id));

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Study Destinations</h1>
        </div>
        
        <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-background to-primary/5">
          <CardContent className="flex justify-center items-center h-[500px]">
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full"
              />
              <div className="text-center">
                <p className="text-lg font-semibold text-violet-900">Discovering Amazing Destinations</p>
                <p className="text-muted-foreground">Loading educational opportunities worldwide...</p>
              </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Study Destinations</h1>
        </div>
        
        <Card className="border-red-200 shadow-xl">
          <CardContent className="flex justify-center items-center h-[400px]">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <Globe className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 text-lg">Failed to load destinations</h3>
                <p className="text-red-600 mt-2">Please try again later or contact support.</p>
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
      className="space-y-8"
    >
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Discover Your Dream Destination</span>
              </motion.div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Study Destinations
              </h1>
              <p className="text-xl opacity-90 max-w-2xl">
                Explore world-class educational opportunities across {destinations.length} amazing destinations with real-time statistics and insights.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl font-bold">{destinations.length}</div>
                <div className="text-sm opacity-80">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl font-bold">{destinations.reduce((sum, d) => sum + d.total_programs, 0)}</div>
                <div className="text-sm opacity-80">Programs</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-background to-muted/30">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search destinations..."
                  className="pl-10 border-0 bg-background/80 focus:bg-background transition-colors shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 shadow-sm">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>By Popularity</DropdownMenuItem>
                  <DropdownMenuItem>By Cost</DropdownMenuItem>
                  <DropdownMenuItem>By Success Rate</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              All ({filteredDestinations.length})
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <Flame className="h-4 w-4 mr-1" />
              Trending ({trendingDestinations.length})
            </TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <Crown className="h-4 w-4 mr-1" />
              Popular ({popularDestinations.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <Heart className="h-4 w-4 mr-1" />
              Favorites ({favoriteDestinations.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-8">
            <DestinationGrid 
              destinations={filteredDestinations}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectDestination={setSelectedDestination}
            />
          </TabsContent>
          
          <TabsContent value="trending" className="mt-8">
            <DestinationGrid 
              destinations={trendingDestinations}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectDestination={setSelectedDestination}
            />
          </TabsContent>
          
          <TabsContent value="popular" className="mt-8">
            <DestinationGrid 
              destinations={popularDestinations}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectDestination={setSelectedDestination}
            />
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-8">
            <DestinationGrid 
              destinations={favoriteDestinations}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectDestination={setSelectedDestination}
            />
          </TabsContent>
        </Tabs>
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
        className="flex flex-col items-center justify-center h-[400px] text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-6">
          <Globe className="h-10 w-10 text-violet-600" />
        </div>
        <h3 className="font-semibold text-xl mb-2">No destinations found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your search criteria or explore our trending destinations
        </p>
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
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Card className="overflow-hidden h-full bg-gradient-to-br from-background to-muted/20 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 relative">
        {/* Rank Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 shadow-lg">
            #{destination.rank}
          </Badge>
        </div>

        {/* Status Badges */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {destination.isTrending && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
              <Flame className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
          {destination.isPopular && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
              <Crown className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>

        {/* Image Header */}
        <div className="relative h-48 overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ 
              backgroundImage: `url(${destination.image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Flag and Actions */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <div className="text-3xl filter drop-shadow-lg">
              {destination.flag}
            </div>
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-8 h-8 bg-white/90 hover:bg-white border-0 shadow-lg backdrop-blur-sm"
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
        </div>
        
        {/* Content */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl leading-tight group-hover:text-violet-600 transition-colors flex items-center gap-2">
                {destination.name}
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {destination.total_programs} programs available
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 pb-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-xs text-muted-foreground">Avg. Tuition</div>
                <div className="font-semibold text-sm">€{destination.avg_tuition?.toLocaleString() || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
                <div className="font-semibold text-sm">{destination.avg_success_rate}%</div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{destination.total_applications} applications</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>Score: {destination.popularity_score}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 group-hover:border-violet-300 transition-colors"
              onClick={() => onSelect(destination)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
              <BookOpen className="mr-2 h-4 w-4" />
              Explore Programs
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface DestinationDetailDialogProps {
  destination: DestinationStats | null;
  onClose: () => void;
}

function DestinationDetailDialog({ destination, onClose }: DestinationDetailDialogProps) {
  if (!destination) return null;

  return (
    <Dialog open={!!destination} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {countryFlags[destination.country] || "🌍"}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">{destination.country}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Discover educational opportunities and detailed statistics
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Hero Image */}
          <div className="w-full h-64 rounded-xl overflow-hidden bg-gradient-to-r from-violet-100 to-purple-100">
            <img 
              src={countryImages[destination.country] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"}
              alt={destination.country}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="font-bold text-2xl">{destination.total_programs}</div>
              <div className="text-sm text-muted-foreground">Total Programs</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="font-bold text-2xl">{destination.avg_success_rate}%</div>
              <div className="text-sm text-muted-foreground">Avg. Success Rate</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl text-center">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="font-bold text-2xl">€{destination.avg_tuition?.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Avg. Tuition</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl text-center">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <div className="font-bold text-2xl">{destination.total_applications}</div>
              <div className="text-sm text-muted-foreground">Applications</div>
            </div>
          </div>
          
          {/* Popularity and Trending Indicators */}
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-violet-600" />
                <span className="font-semibold">Popularity Score</span>
              </div>
              <div className="text-2xl font-bold text-violet-600">{destination.popularity_score}</div>
              <div className="text-sm text-muted-foreground">Based on application volume</div>
            </div>
            <div className="flex-1 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-600" />
                <span className="font-semibold">Trending Level</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{destination.trending_score}/3</div>
              <div className="text-sm text-muted-foreground">Current trend status</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Programs
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
              <ArrowRight className="mr-2 h-4 w-4" />
              Start Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
