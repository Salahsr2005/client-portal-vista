
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, GraduationCap, Languages, Heart, HeartOff, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Program } from '@/hooks/usePrograms';

interface ProgramCardProps {
  program: Program;
  onFavoriteToggle?: (programId: string, isFavorite: boolean) => void;
  showFavoriteButton?: boolean;
}

const ProgramCard = ({ 
  program, 
  onFavoriteToggle,
  showFavoriteButton = true 
}: ProgramCardProps) => {
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(program.id, !program.isFavorite);
    }
  };
  
  // Format tuition range
  const formatTuition = () => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });
    
    return `${formatter.format(program.tuition_min)} - ${formatter.format(program.tuition_max)}`;
  };
  
  // Get status badge color
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  return (
    <Card className={cn(
      "h-full overflow-hidden flex flex-col transition-all cursor-pointer hover:shadow-md",
      program.bgColorClass || ""
    )}>
      <Link to={`/programs/${program.id}`} className="flex flex-col h-full">
        <div 
          className="h-36 bg-center bg-cover" 
          style={{ 
            backgroundImage: program.image_url ? 
              `url(${program.image_url})` : 
              'url(/placeholder.svg?height=144&width=384)' 
          }}
        >
          <div className="flex justify-between p-2">
            <Badge className={getStatusBadgeStyle(program.status)}>
              {program.status}
            </Badge>
            
            {program.scholarship_available && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Scholarship
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="p-3 pb-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2">{program.name}</h3>
              <p className="text-sm text-muted-foreground">{program.university}</p>
            </div>
            
            {program.ranking && (
              <Badge variant="outline" className="flex items-center gap-1 ml-2 shrink-0">
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                <span>{program.ranking}</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-3 pt-1 flex-grow">
          <div className="grid gap-1.5">
            <div className="flex items-center text-sm">
              <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{program.location}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <GraduationCap className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{program.study_level}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Languages className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{program.program_language}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{program.duration}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-3 pt-2 flex justify-between items-center border-t">
          <div className="font-medium">{formatTuition()}</div>
          
          {showFavoriteButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={handleFavoriteClick}
              aria-label={program.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {program.isFavorite ? (
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              ) : (
                <HeartOff className="h-4 w-4" />
              )}
            </Button>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProgramCard;
