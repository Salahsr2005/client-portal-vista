
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  GraduationCap, 
  Clock, 
  DollarSign,
  Heart,
  Share2,
  ChevronRight,
  Star
} from "lucide-react";

interface MobileProgramCardProps {
  program: any;
  isFavorite: boolean;
  isCompare: boolean;
  onFavorite: (id: string) => void;
  onCompare: (id: string) => void;
  onShare: (id: string) => void;
}

export default function MobileProgramCard({
  program,
  isFavorite,
  isCompare,
  onFavorite,
  onCompare,
  onShare
}: MobileProgramCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base line-clamp-2 mb-1">
              {program.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {program.university}
            </p>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFavorite(program.id)}
              className="h-8 w-8 p-0"
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(program.id)}
              className="h-8 w-8 p-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{program.city}, {program.country}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{program.study_level}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{program.duration_months} months</span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">€{program.tuition_min?.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {program.program_language}
          </Badge>
          {program.scholarship_available && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
              Scholarship
            </Badge>
          )}
          {program.ranking && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Star className="h-3 w-3" />
              #{program.ranking}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            onClick={() => onCompare(program.id)}
            className="flex-1 text-xs"
            disabled={isCompare}
          >
            {isCompare ? 'Added' : 'Compare'}
          </Button>
          <Link to={`/programs/${program.id}`} className="flex-1">
            <Button className="w-full text-xs">
              View Details
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
