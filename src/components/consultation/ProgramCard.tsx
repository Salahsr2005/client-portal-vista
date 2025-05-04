
import React from 'react';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart, GraduationCap, Heart, Star, MapPin, Building, Clock, Calendar, CircleDollarSign, LayoutPanelLeft } from 'lucide-react';
import { Program } from './types';

interface ProgramCardProps {
  program: Program;
  isSelected?: boolean;
  isFavorite?: boolean;
  isCompare?: boolean;
  onSelect?: (id: string) => void;
  onFavorite?: (id: string) => void;
  onCompare?: (id: string) => void;
  isGridView?: boolean;
  showScore?: boolean;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  program, 
  isSelected = false,
  isFavorite = false,
  isCompare = false,
  onSelect,
  onFavorite,
  onCompare,
  isGridView = true,
  showScore = false
}) => {
  return isGridView ? (
    <Card className={`h-full overflow-hidden transition-all duration-200 hover:shadow-md ${isSelected ? 'border-primary' : ''}`}>
      <CardHeader className="relative p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium line-clamp-2">{program.name}</CardTitle>
          <div className="flex gap-1">
            {onCompare && (
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${isCompare ? 'text-indigo-600 hover:text-indigo-700' : ''}`}
                onClick={() => onCompare(program.id)}
              >
                <LayoutPanelLeft 
                  className={`h-4 w-4 ${isCompare ? 'fill-indigo-100' : ''}`} 
                />
              </Button>
            )}
            
            {onFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${isFavorite ? 'text-red-500 hover:text-red-600' : ''}`}
                onClick={() => onFavorite(program.id)}
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorite ? 'fill-red-100' : ''}`} 
                />
              </Button>
            )}
            
            {onSelect && (
              <Checkbox 
                id={`program-${program.id}`} 
                checked={isSelected}
                onCheckedChange={() => onSelect(program.id)}
                className="mt-0.5"
              />
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <Building className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{program.university}</span>
        </div>
        
        {program.matchScore !== undefined && showScore && (
          <div className="flex items-center mt-1">
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${program.matchScore}%` }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              {program.matchScore}%
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-1 pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span>{program.study_level || 'Not specified'}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{program.location || 'Not specified'}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span>{program.duration || 'Not specified'}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span>
              {program.tuition_min ? `€${program.tuition_min.toLocaleString()}` : 'Not specified'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {(program.hasScholarship || program.scholarship_available) && (
            <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
              Scholarship
            </Badge>
          )}
          
          {(program.hasReligiousFacilities || program.religious_facilities) && (
            <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200">
              Religious Facilities
            </Badge>
          )}
          
          {(program.hasHalalFood || program.halal_food_availability) && (
            <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200">
              Halal Food
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t p-3 flex justify-between">
        <Button variant="outline" size="sm" asChild className="text-xs">
          <a href={`/programs/${program.id}`}>View Details</a>
        </Button>
        
        <Button variant="ghost" size="sm" className="text-xs flex">
          <span className="whitespace-nowrap">Apply Now</span>
          <span className="ml-1" aria-hidden="true">→</span>
        </Button>
      </CardFooter>
    </Card>
  ) : (
    <Card className={`w-full overflow-hidden transition-all duration-200 hover:shadow-md ${isSelected ? 'border-primary' : ''}`}>
      <div className="flex">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-medium">{program.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Building className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{program.university}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {onCompare && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 ${isCompare ? 'text-indigo-600 hover:text-indigo-700' : ''}`}
                  onClick={() => onCompare(program.id)}
                >
                  <LayoutPanelLeft 
                    className={`h-4 w-4 ${isCompare ? 'fill-indigo-100' : ''}`} 
                  />
                </Button>
              )}
              
              {onFavorite && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 ${isFavorite ? 'text-red-500 hover:text-red-600' : ''}`}
                  onClick={() => onFavorite(program.id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${isFavorite ? 'fill-red-100' : ''}`} 
                  />
                </Button>
              )}
              
              {onSelect && (
                <Checkbox 
                  id={`program-${program.id}`} 
                  checked={isSelected}
                  onCheckedChange={() => onSelect(program.id)}
                  className="mt-0.5"
                />
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mt-3 text-sm">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span>{program.study_level || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span>{program.location || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span>{program.duration || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span>
                {program.tuition_min ? `€${program.tuition_min.toLocaleString()}` : 'Not specified'}
              </span>
            </div>
          </div>
          
          {program.matchScore !== undefined && showScore && (
            <div className="flex items-center mt-3">
              <BarChart className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <div className="w-full bg-muted rounded-full h-2 flex-grow">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${program.matchScore}%` }}
                ></div>
              </div>
              <span className="text-sm text-muted-foreground ml-2.5">
                {program.matchScore}% Match
              </span>
            </div>
          )}
          
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {(program.hasScholarship || program.scholarship_available) && (
              <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
                Scholarship
              </Badge>
            )}
            
            {(program.hasReligiousFacilities || program.religious_facilities) && (
              <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200">
                Religious Facilities
              </Badge>
            )}
            
            {(program.hasHalalFood || program.halal_food_availability) && (
              <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200">
                Halal Food
              </Badge>
            )}
          </div>
        </div>
        
        <div className="border-l bg-muted/20 p-4 flex flex-col justify-between">
          <Button variant="outline" size="sm" asChild className="text-xs whitespace-nowrap">
            <a href={`/programs/${program.id}`}>View Details</a>
          </Button>
          
          <Button variant="ghost" size="sm" className="text-xs whitespace-nowrap mt-2">
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProgramCard;
