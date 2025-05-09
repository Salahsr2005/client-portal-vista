
import React from 'react';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  GraduationCap, Heart, Star, MapPin, Building, Clock, Calendar, 
  CircleDollarSign, LayoutPanelLeft, Share2, ArrowRight, Trophy, Sparkles
} from 'lucide-react';
import { Program } from './types';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, CurrencyCode } from '@/utils/currencyConverter';

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
  currency?: CurrencyCode;
  onShare?: (id: string) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  program, 
  isSelected = false,
  isFavorite = false,
  isCompare = false,
  onSelect,
  onFavorite,
  onCompare,
  onShare,
  isGridView = true,
  showScore = false,
  currency = 'EUR'
}) => {
  const navigate = useNavigate();
  
  const handleApplyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/applications/new?program=${program.id}`);
  };
  
  // Default image if not available
  const backgroundImage = program.image_url || '/placeholder.svg';
  
  // Check deadline
  const deadlinePassed = program.deadlinePassed || false;
  
  return isGridView ? (
    <Card className={`h-full overflow-hidden transition-all duration-300 hover:shadow-xl border border-slate-200/60 dark:border-slate-800/60 ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''} group hover:-translate-y-1`}>
      <div className="relative">
        {/* Program image as background */}
        <div 
          className="absolute inset-0 h-40 bg-cover bg-center" 
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80"></div>
        </div>
        
        <CardHeader className="relative p-4 pb-2 pt-28 z-10">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium line-clamp-2 text-white drop-shadow-md">{program.name}</CardTitle>
            <div className="flex gap-1">
              {onShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full"
                  onClick={() => onShare(program.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
              
              {onCompare && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full ${isCompare ? 'text-indigo-300 hover:text-indigo-200' : 'text-white'}`}
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
                  className={`h-7 w-7 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full ${isFavorite ? 'text-rose-300 hover:text-rose-200' : 'text-white'}`}
                  onClick={() => onFavorite(program.id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${isFavorite ? 'fill-rose-100' : ''}`} 
                  />
                </Button>
              )}
              
              {onSelect && (
                <Checkbox 
                  id={`program-${program.id}`} 
                  checked={isSelected}
                  onCheckedChange={() => onSelect(program.id)}
                  className="mt-0.5 bg-white/20"
                />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-white/80 mt-1">
            <Building className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{program.university}</span>
          </div>
        </CardHeader>
      </div>
      
      <CardContent className="p-4 pt-3 pb-2">
        {program.featured && (
          <div className="mb-3">
            <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-700 border-amber-200 flex items-center gap-1 px-2 py-0.5">
              <Sparkles className="h-3 w-3" />
              <span>Featured Program</span>
            </Badge>
          </div>
        )}
        
        {program.matchScore !== undefined && showScore && (
          <div className="flex items-center mt-1 mb-3">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-violet-500 to-purple-700 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${program.matchScore}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-xs font-medium bg-gradient-to-r from-violet-500 to-purple-700 text-transparent bg-clip-text">
                {Math.round(program.matchScore)}%
              </span>
              <Trophy className="h-3 w-3 text-amber-500" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />
            <span>{program.study_level || 'Not specified'}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />
            <span className="truncate">{program.location || 'Not specified'}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />
            <span>{program.duration || 'Not specified'}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <CircleDollarSign className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />
            <span>
              {program.tuition_min 
                ? formatCurrency(program.tuition_min, 'EUR', currency)
                : 'Not specified'
              }
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
          
          {deadlinePassed && (
            <Badge variant="outline" className="bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200">
              Closed
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t p-3 flex justify-between">
        <Button variant="outline" size="sm" asChild className="text-xs">
          <a href={`/programs/${program.id}`}>View Details</a>
        </Button>
        
        <Button 
          variant={deadlinePassed ? "outline" : "default"}
          size="sm" 
          className={`text-xs flex ${!deadlinePassed ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white" : "text-muted-foreground"}`}
          onClick={deadlinePassed ? undefined : handleApplyNow}
          disabled={deadlinePassed}
        >
          <span className="whitespace-nowrap">{deadlinePassed ? 'Application Closed' : 'Apply Now'}</span>
          {!deadlinePassed && <ArrowRight className="ml-1 h-3 w-3" />}
        </Button>
      </CardFooter>
    </Card>
  ) : (
    <Card className={`w-full overflow-hidden transition-all duration-300 hover:shadow-lg ${isSelected ? 'border-primary' : ''} group`}>
      <div className="flex">
        <div 
          className="hidden md:block w-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        </div>
        
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-medium">{program.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Building className="h-3.5 w-3.5 flex-shrink-0 text-violet-500" />
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
                  className={`h-7 w-7 ${isFavorite ? 'text-rose-500 hover:text-rose-600' : ''}`}
                  onClick={() => onFavorite(program.id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${isFavorite ? 'fill-rose-100' : ''}`} 
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
              <GraduationCap className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />
              <span>{program.study_level || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />
              <span>{program.location || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />
              <span>{program.duration || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <CircleDollarSign className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />
              <span>
                {program.tuition_min ? `€${program.tuition_min.toLocaleString()}` : 'Not specified'}
              </span>
            </div>
          </div>
          
          {program.matchScore !== undefined && showScore && (
            <div className="flex items-center mt-3">
              <Star className="h-4 w-4 mr-1.5 text-violet-500" />
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 flex-grow">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-purple-700 h-2 rounded-full" 
                  style={{ width: `${program.matchScore}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium ml-2.5">
                {Math.round(program.matchScore)}% Match
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
            
            {deadlinePassed && (
              <Badge variant="outline" className="bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200">
                Application Closed
              </Badge>
            )}
          </div>
        </div>
        
        <div className="border-l bg-slate-50 dark:bg-slate-900 p-4 flex flex-col justify-between">
          <Button variant="outline" size="sm" asChild className="text-xs whitespace-nowrap">
            <a href={`/programs/${program.id}`}>View Details</a>
          </Button>
          
          <Button 
            variant={deadlinePassed ? "outline" : "default"} 
            size="sm" 
            className="text-xs whitespace-nowrap mt-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800"
            onClick={handleApplyNow}
            disabled={deadlinePassed}
          >
            {deadlinePassed ? 'Closed' : 'Apply Now'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProgramCard;
