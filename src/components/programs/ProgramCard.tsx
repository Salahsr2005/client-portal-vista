
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartIcon, Clock, GraduationCap, MapPin, CalendarIcon, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/databaseHelpers';
import { Program } from '@/hooks/usePrograms';

interface ProgramCardProps {
  program: Program;
  onFavoriteToggle?: (programId: string) => void;
  isFavorite?: boolean;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onFavoriteToggle, isFavorite = false }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(program.id);
    }
  };

  // Set background color based on program status
  const getBackgroundStyle = () => {
    if (program.status === 'Closed') {
      return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30';
    }
    if (program.status === 'Active') {
      return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30';
    }
    return '';
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${getBackgroundStyle()}`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={program.image_url || '/placeholder.svg?height=200&width=400&text=Program'} 
          alt={program.name}
          className="w-full h-full object-cover"
        />
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-gray-900/80 hover:dark:bg-gray-900 rounded-full"
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <BookmarkCheck className="h-5 w-5 text-primary" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </Button>
        
        {program.status === 'Closed' && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white py-1 px-2 text-center font-medium text-xs">
            CLOSED
          </div>
        )}
        
        {program.status === 'Coming Soon' && (
          <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white py-1 px-2 text-center font-medium text-xs">
            COMING SOON
          </div>
        )}
      </div>
      
      <CardContent className="pt-4 pb-2">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{program.name}</h3>
          {program.ranking && (
            <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
              <HeartIcon className="h-3 w-3" /> Rank #{program.ranking}
            </Badge>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground mb-3">{program.university}</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">{program.city}, {program.country}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <GraduationCap className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">{program.study_level}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">{program.duration_months} months</span>
          </div>
          
          {program.application_deadline && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-sm truncate">Deadline: {program.application_deadline}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-baseline justify-between mt-2">
          <div>
            <div className="text-xs text-muted-foreground">Tuition fee</div>
            <div className="font-medium">
              {formatCurrency(program.tuition_min)}
              {program.tuition_min !== program.tuition_max && '+'} 
            </div>
          </div>
          
          {program.scholarship_available && (
            <Badge variant="secondary" className="ml-auto">Scholarship</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        <Link 
          to={`/programs/${program.id}`} 
          className="w-full"
        >
          <Button variant="default" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
