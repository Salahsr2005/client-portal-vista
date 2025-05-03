
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, Calendar, Clock, MapPin, Euro, Star, GraduationCap, Building, 
  Globe, BookOpen, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/databaseHelpers';

interface Program {
  id: string;
  name: string;
  university: string;
  location: string;
  type: string;
  duration: string;
  tuition: string;
  deadline: string;
  description: string;
  image_url?: string;
  matchScore?: number;
  country?: string;
  tuition_min?: number;
  [key: string]: any;
}

interface ProgramCardProps {
  program: Program;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onFavorite: () => void;
  isGridView?: boolean;
}

const ProgramCard = ({ program, isSelected, isFavorite, onSelect, onFavorite, isGridView = true }: ProgramCardProps) => {
  const backgroundImage = program.image_url || '/placeholder.svg';
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 half-star" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  // Format tuition if available
  const formattedTuition = program.tuition_min ? 
    formatCurrency(program.tuition_min, 'EUR') :
    program.tuition;
  
  // Grid view card
  if (isGridView) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="h-full"
      >
        <Card 
          className={`overflow-hidden h-full transition-all hover:shadow-xl ${isSelected ? 'ring-2 ring-primary' : ''}`}
        >
          <div 
            className="h-40 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                {program.matchScore && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium">
                    {program.matchScore}% Match
                  </Badge>
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={isSelected} 
                    onCheckedChange={onSelect}
                    className="h-5 w-5 bg-white/80 border-none"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white rounded-full" 
                    onClick={(e) => {
                      e.preventDefault();
                      onFavorite();
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white drop-shadow-md line-clamp-1">{program.name}</h3>
                <p className="text-white/90 text-sm drop-shadow-md line-clamp-1">{program.university}</p>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">{program.type}</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">{program.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">{program.duration}</span>
              </div>
              <div className="flex items-center">
                <Euro className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm font-medium">{formattedTuition}</span>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex justify-between items-center mt-3">
              <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                <a href={`/programs/${program.id}`}>Details</a>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Apply Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // List view card
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ x: 5 }}
    >
      <Card 
        className={`overflow-hidden transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
      >
        <div className="flex flex-col md:flex-row h-full">
          <div 
            className="w-full md:w-1/4 h-40 md:h-auto bg-cover bg-center relative"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 md:bg-gradient-to-r md:from-black/70 md:to-black/20"></div>
            {program.matchScore && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium">
                  {program.matchScore}% Match
                </Badge>
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{program.name}</h3>
                <p className="text-muted-foreground flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {program.university}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="flex gap-1 items-center">
                    <GraduationCap className="h-3 w-3" />
                    {program.type}
                  </Badge>
                  <Badge variant="outline" className="flex gap-1 items-center">
                    <MapPin className="h-3 w-3" />
                    {program.location}
                  </Badge>
                  <Badge variant="outline" className="flex gap-1 items-center">
                    <Clock className="h-3 w-3" />
                    {program.duration}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={isSelected} 
                  onCheckedChange={onSelect}
                  className="h-5 w-5"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full" 
                  onClick={(e) => {
                    e.preventDefault();
                    onFavorite();
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
              </div>
            </div>
            
            <div className="mt-3 flex items-center">
              <Euro className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">{formattedTuition}</span>
              
              <div className="ml-4 flex">
                {program.rating && renderStars(program.rating)}
              </div>
            </div>
            
            <p className="text-sm mt-3 line-clamp-2 text-muted-foreground">{program.description}</p>
            
            <div className="flex justify-between items-center mt-4">
              <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                <a href={`/programs/${program.id}`}>View Details</a>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProgramCard;
