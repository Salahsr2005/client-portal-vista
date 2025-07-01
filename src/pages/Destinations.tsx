
import React, { useState } from 'react';
import { useDestinations } from '@/hooks/useDestinations';
import { useDestinationStats } from '@/hooks/useDestinationStats';
import { useFavorites } from '@/hooks/useFavorites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Heart,
  Search,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  Filter,
  Globe,
  Users,
  BookOpen,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Destination } from '@/hooks/useDestinations';

export default function Destinations() {
  const { data: destinations, isLoading, error } = useDestinations();
  const { data: stats, isLoading: statsLoading } = useDestinationStats();
  const { addToFavorites, removeFromFavorites } = useFavorites();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [showFilters, setShowFilters] = useState(false);

  // Mock favorites for now - replace with actual favorites logic
  const favorites: any[] = [];
  const favoritesLoading = false;

  const toggleFavorite = (destinationId: string, type: string) => {
    const isFavorite = favorites.some(fav => fav.program_id === destinationId);
    if (isFavorite) {
      removeFromFavorites.mutate(destinationId);
    } else {
      addToFavorites.mutate(destinationId);
    }
  };

  // Filter and sort destinations
  const filteredDestinations = destinations?.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || (dest as any).region === selectedRegion;
    return matchesSearch && matchesRegion;
  })
  .sort((a, b) => {
    switch (sortBy) {
      case 'success_rate':
        return (b.admission_success_rate || 0) - (a.admission_success_rate || 0);
      case 'fees':
        return (a.bachelor_tuition_min || 0) - (b.bachelor_tuition_min || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return (b.admission_success_rate || 0) - (a.admission_success_rate || 0);
    }
  }) || [];

  const regions = Array.from(new Set(destinations?.map(d => (d as any).region).filter(Boolean) || []));

  const DestinationCard = ({ destination }: { destination: Destination }) => {
    const isFavorite = favorites.some(fav => fav.program_id === destination.id);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
          <div className="relative">
            <img
              src={destination.cover_image_url || '/placeholder.svg?height=200&width=300&text=' + destination.name}
              alt={destination.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
                onClick={() => toggleFavorite(destination.id, 'destination')}
                disabled={favoritesLoading}
              >
                <Heart 
                  className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
            </div>
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-green-500 text-white">
                {destination.admission_success_rate || 0}% Success Rate
              </Badge>
            </div>
          </div>
          
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{destination.name}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {destination.country}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {destination.procedure_type}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {destination.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                <span>€{destination.bachelor_tuition_min?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-blue-500" />
                <span>{destination.processing_time || 'N/A'}</span>
              </div>
            </div>
            
            <div className="pt-2">
              <Button className="w-full" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white dark:bg-gray-800 rounded-xl h-96 shadow-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Unable to load destinations</h2>
            <p className="text-gray-600 dark:text-gray-400">Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Study Abroad Destinations
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your perfect study destination from our curated selection of top universities worldwide
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{destinations?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Destinations</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1,200+</p>
                  <p className="text-sm text-muted-foreground">Universities</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">5,000+</p>
                  <p className="text-sm text-muted-foreground">Programs</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {destinations?.length > 0 
                      ? Math.round(destinations.reduce((acc, dest) => acc + (dest.admission_success_rate || 0), 0) / destinations.length)
                      : 87}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Success</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="success_rate">Success Rate</SelectItem>
                  <SelectItem value="fees">Fees (Low to High)</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {filteredDestinations.length} Destinations Found
          </h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Sorted by {sortBy.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <DestinationCard destination={destination} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or browse all destinations
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('all');
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
