
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDestinations } from '@/hooks/useDestinations';
import { useDestinationStats } from '@/hooks/useDestinationStats';
import {
  Search,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  GraduationCap,
  Star,
  Filter,
  Globe,
  Calendar,
  Clock,
  Target,
  Award,
  ArrowRight,
  Heart,
  ChevronRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Destination {
  destination_id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  image_url: string;
  fees: number;
  success_rate: number;
  visa_requirements: string;
  processing_time: string;
  status: string;
}

interface DestinationStats {
  country: string;
  total_programs: number;
  avg_tuition: number;
  avg_success_rate: number;
  popularity_score: number;
  trending_score: number;
  total_applications: number;
}

export default function Destinations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const { data: destinations, isLoading: destinationsLoading } = useDestinations();
  const { data: stats, isLoading: statsLoading } = useDestinationStats();

  const regions = ['all', 'Western Europe', 'Eastern Europe', 'Southern Europe', 'Northern Europe'];

  const filteredDestinations = destinations?.filter((dest: Destination) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || dest.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const sortedDestinations = filteredDestinations?.sort((a: Destination, b: Destination) => {
    const statsA = stats?.find((s: DestinationStats) => s.country === a.country);
    const statsB = stats?.find((s: DestinationStats) => s.country === b.country);
    
    switch (sortBy) {
      case 'popularity':
        return (statsB?.popularity_score || 0) - (statsA?.popularity_score || 0);
      case 'success_rate':
        return (b.success_rate || 0) - (a.success_rate || 0);
      case 'cost':
        return (a.fees || 0) - (b.fees || 0);
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const toggleFavorite = (destinationId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(destinationId)) {
        newFavorites.delete(destinationId);
      } else {
        newFavorites.add(destinationId);
      }
      return newFavorites;
    });
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'France': '🇫🇷',
      'Belgium': '🇧🇪',
      'Poland': '🇵🇱',
      'Spain': '🇪🇸',
      'Portugal': '🇵🇹',
      'Germany': '🇩🇪',
      'Italy': '🇮🇹',
      'Netherlands': '🇳🇱'
    };
    return flags[country] || '🌍';
  };

  const getTrendingLevel = (score: number) => {
    if (score >= 3) return { level: 'High', color: 'bg-green-500', textColor: 'text-green-700 dark:text-green-300' };
    if (score >= 2) return { level: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-700 dark:text-yellow-300' };
    return { level: 'Low', color: 'bg-gray-500', textColor: 'text-gray-700 dark:text-gray-300' };
  };

  if (destinationsLoading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container max-w-7xl py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Discover Your Dream Destination
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Explore top study abroad destinations with comprehensive insights, success rates, and everything you need to make the right choice
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Globe className="w-4 h-4 mr-2" />
                50+ Destinations
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <GraduationCap className="w-4 h-4 mr-2" />
                1000+ Programs
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Star className="w-4 h-4 mr-2" />
                95% Success Rate
              </Badge>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50 dark:from-gray-900 to-transparent"></div>
      </div>

      <div className="container max-w-7xl py-12 relative -mt-16 z-20">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search destinations or countries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 text-lg border-2 focus:border-blue-500"
                    />
                  </div>
                </div>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="h-12 border-2">
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region === 'all' ? 'All Regions' : region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 border-2">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="success_rate">Success Rate</SelectItem>
                    <SelectItem value="cost">Lowest Cost</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        {!statsLoading && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              Popular Destinations Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.slice(0, 4).map((stat: DestinationStats, index: number) => {
                const trending = getTrendingLevel(stat.trending_score);
                return (
                  <motion.div
                    key={stat.country}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl">{getCountryFlag(stat.country)}</span>
                            <div>
                              <h3 className="font-bold text-lg">{stat.country}</h3>
                              <Badge 
                                variant="secondary" 
                                className={`${trending.textColor} bg-opacity-20`}
                              >
                                <div className={`w-2 h-2 rounded-full ${trending.color} mr-2`}></div>
                                {trending.level} Demand
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <GraduationCap className="w-4 h-4 mr-2" />
                              Programs
                            </span>
                            <span className="font-semibold">{stat.total_programs}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Avg Tuition
                            </span>
                            <span className="font-semibold">€{stat.avg_tuition?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <Target className="w-4 h-4 mr-2" />
                              Success Rate
                            </span>
                            <span className="font-semibold text-green-600">{stat.avg_success_rate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              Applications
                            </span>
                            <span className="font-semibold">{stat.total_applications}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Destinations Grid */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Destinations
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-3">
              ({sortedDestinations?.length || 0} destinations)
            </span>
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${searchTerm}-${selectedRegion}-${sortBy}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sortedDestinations?.map((destination: Destination, index: number) => {
              const destinationStats = stats?.find((s: DestinationStats) => s.country === destination.country);
              const isFavorite = favorites.has(destination.destination_id);
              
              return (
                <motion.div
                  key={destination.destination_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 left-4 z-10">
                          <Badge className="bg-white/90 text-gray-800 border-0">
                            <MapPin className="w-3 h-3 mr-1" />
                            {destination.region}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(destination.destination_id)}
                            className="bg-white/90 hover:bg-white text-gray-800 p-2 h-auto"
                          >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                        </div>
                        <div className="absolute bottom-4 left-4 text-white z-10">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-3xl">{getCountryFlag(destination.country)}</span>
                            <div>
                              <h3 className="font-bold text-xl">{destination.name}</h3>
                              <p className="text-blue-100">{destination.country}</p>
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {destination.description}
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Application Fee
                          </span>
                          <span className="font-semibold">€{destination.fees?.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Award className="w-4 h-4 mr-2" />
                            Success Rate
                          </span>
                          <Badge 
                            variant="secondary" 
                            className={`${
                              (destination.success_rate || 0) >= 80 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                                : (destination.success_rate || 0) >= 60 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            }`}
                          >
                            {destination.success_rate}%
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Processing Time
                          </span>
                          <span className="text-sm font-medium">{destination.processing_time}</span>
                        </div>

                        {destinationStats && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Programs Available
                            </span>
                            <span className="font-semibold">{destinationStats.total_programs}</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300"
                        variant="outline"
                      >
                        Explore Programs
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {sortedDestinations?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Globe className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No destinations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or explore all available destinations.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
              }}
              variant="outline"
              className="mx-auto"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
