
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Heart, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';

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
  [key: string]: any;
}

interface ProgramCardProps {
  program: Program;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onFavorite: () => void;
}

const ProgramCard = ({ program, isSelected, isFavorite, onSelect, onFavorite }: ProgramCardProps) => {
  const backgroundImage = program.image_url || '/placeholder.svg';
  
  return (
    <Card className={`overflow-hidden transition-all ${isSelected ? 'border-primary' : ''}`}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div 
            className="h-40 md:h-auto md:w-1/3 md:min-w-40 bg-cover bg-center" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            {!program.image_url && (
              <div className="flex items-center justify-center h-full bg-muted">
                <span className="text-2xl font-bold text-muted-foreground">{program.name.substring(0, 2).toUpperCase()}</span>
              </div>
            )}
          </div>
          
          <div className="p-4 md:p-6 flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {program.matchScore && (
                    <Badge className="bg-green-500 hover:bg-green-600">{program.matchScore}% Match</Badge>
                  )}
                  <h3 className="font-semibold text-lg">{program.name}</h3>
                </div>
                <p className="text-muted-foreground">{program.university}</p>
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
                  className="h-8 w-8" 
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
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline">{program.type}</Badge>
              <Badge variant="secondary">{program.location}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{program.duration}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Deadline: {new Date(program.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{program.location}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{program.tuition}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <p className="text-sm line-clamp-2">{program.description}</p>
              <Button variant="link" className="p-0 h-auto">
                <a href={`/programs/${program.id}`}>View Details</a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
