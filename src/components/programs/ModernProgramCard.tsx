
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  GraduationCap, 
  Languages, 
  Heart, 
  HeartOff, 
  Star,
  Euro,
  Calendar,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Program } from '@/hooks/usePrograms';

interface ModernProgramCardProps {
  program: Program;
  onFavoriteToggle?: (programId: string, isFavorite: boolean) => void;
  showFavoriteButton?: boolean;
}

const ModernProgramCard = ({ 
  program, 
  onFavoriteToggle,
  showFavoriteButton = true 
}: ModernProgramCardProps) => {
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(program.id, !program.isFavorite);
    }
  };
  
  const formatTuition = () => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });
    return `${formatter.format(program.tuition_min)} - ${formatter.format(program.tuition_max)}`;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/90 text-white';
      case 'Closed':
        return 'bg-red-500/90 text-white';
      default:
        return 'bg-amber-500/90 text-white';
    }
  };

  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Link to={`/programs/${program.id}`} className="block h-full">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="relative h-48 bg-cover bg-center overflow-hidden"
          style={{ 
            backgroundImage: program.image_url ? 
              `url(${program.image_url})` : 
              `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` 
          }}
        >
          {/* Wave SVG Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
            <svg 
              className="absolute bottom-0 w-full h-16 text-white/10" 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                fill="currentColor"
              />
            </svg>
          </div>
          
          {/* Status and Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex gap-2">
              <Badge className={cn("text-xs font-medium shadow-lg", getStatusColor(program.status))}>
                {program.status}
              </Badge>
              {program.scholarship_available && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium shadow-lg">
                  <Award className="h-3 w-3 mr-1" />
                  Scholarship
                </Badge>
              )}
            </div>
            
            {program.ranking && (
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs font-medium">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                #{program.ranking}
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          {showFavoriteButton && (
            <div className="absolute top-4 right-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                onClick={handleFavoriteClick}
              >
                {program.isFavorite ? (
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                ) : (
                  <HeartOff className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>
          )}
        </div>
        
        {/* Content */}
        <CardContent className="p-6 flex-grow">
          <div className="space-y-4">
            {/* Title and University */}
            <div>
              <h3 className="font-bold text-lg leading-tight line-clamp-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                {program.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
                {program.university}
              </p>
            </div>
            
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="truncate">{program.city}, {program.country}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <GraduationCap className="h-4 w-4 text-purple-500" />
                <span className="truncate">{program.study_level}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="truncate">{program.duration_months} months</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Languages className="h-4 w-4 text-orange-500" />
                <span className="truncate">{program.program_language}</span>
              </div>
            </div>

            {/* Field Badge */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {program.field}
              </Badge>
              {program.application_deadline && (
                <Badge variant="outline" className="text-xs text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                  <Calendar className="h-3 w-3 mr-1" />
                  Deadline: {program.application_deadline}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Footer */}
        <CardFooter className="p-6 pt-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-white">
              <Euro className="h-5 w-5 text-green-500" />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {formatTuition()}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Available</span>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ModernProgramCard;
