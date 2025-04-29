
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
    <Card className={`overflow-hidden transition-all ${isSelected ? 'border-primary border-2' : ''}`}>
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          {/* Header with background image */}
          <div 
            className="h-40 w-full bg-cover bg-center relative" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 flex flex-col justify-end p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {program.matchScore && (
                      <Badge className="bg-green-500 hover:bg-green-600">{program.matchScore}% Match</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-white">{program.name}</h3>
                  <p className="text-white/90">{program.university}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={isSelected} 
                    onCheckedChange={onSelect}
                    className="h-5 w-5 bg-white/80"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white" 
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
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-white/20 text-white border-white/40">{program.type}</Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/40">{program.location}</Badge>
              </div>
            </div>
          </div>
          
          <div className="p-4 flex-1">
            <div className="grid grid-cols-2 gap-4">
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
