
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Program } from '@/components/consultation/types';
import { Heart, BookOpenCheck, GraduationCap, Globe, Clock, Building, CircleDollarSign, Users } from "lucide-react";
import { cn } from '@/lib/utils';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";

interface ProgramCardProps {
  program: Program;
  showMatchScore?: boolean;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, showMatchScore = false }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Check if this program is a favorite
  React.useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('favorite_programs')
          .select('*')
          .eq('user_id', user.id)
          .eq('program_id', program.id)
          .maybeSingle();
          
        if (error) throw error;
        setIsFavorite(!!data);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkFavorite();
  }, [user, program.id]);
  
  // Toggle favorite status
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save programs to favorites",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorite_programs')
          .delete()
          .eq('user_id', user.id)
          .eq('program_id', program.id);
          
        if (error) throw error;
        
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Program has been removed from your favorites",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorite_programs')
          .insert({
            user_id: user.id,
            program_id: program.id
          });
          
        if (error) throw error;
        
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Program has been added to your favorites",
        });
      }
      
      // Invalidate favorites query
      queryClient.invalidateQueries({ queryKey: ['favoritePrograms'] });
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img 
          src={program.image_url || "/placeholder.svg"} 
          alt={program.name} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-white/80 text-rose-500 hover:bg-white hover:text-rose-600 rounded-full" 
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          <Heart className={cn("h-5 w-5", isFavorite ? "fill-rose-500" : "fill-transparent")} />
        </Button>
        
        {program.featured && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-amber-500">
            Featured
          </Badge>
        )}
        
        {program.deadlinePassed && (
          <Badge variant="destructive" className="absolute bottom-2 right-2">
            Application Closed
          </Badge>
        )}
        
        {(program.matchScore !== undefined && showMatchScore) && (
          <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground rounded-md px-2 py-1 text-sm font-medium">
            {Math.round(program.matchScore)}% Match
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2 space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-2">{program.name}</h3>
          {program.hasScholarship && (
            <Badge variant="outline" className="ml-2 whitespace-nowrap flex-shrink-0 bg-green-50 text-green-700 border-green-200">
              Scholarship
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground text-sm flex items-center">
          <Building className="h-4 w-4 mr-1 inline" />
          {program.university}
        </div>
        <div className="text-muted-foreground text-sm flex items-center">
          <Globe className="h-4 w-4 mr-1 inline" />
          {program.location}
        </div>
      </CardHeader>
      
      <CardContent className="grid grid-cols-2 gap-2 py-2">
        <div className="flex items-center text-sm">
          <GraduationCap className="h-4 w-4 mr-1 text-primary" />
          <span>{program.type}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-1 text-primary" />
          <span>{program.duration}</span>
        </div>
        <div className="flex items-center text-sm">
          <CircleDollarSign className="h-4 w-4 mr-1 text-primary" />
          <span>€{program.tuition.toLocaleString()}</span>
        </div>
        <div className="flex items-center text-sm">
          <BookOpenCheck className="h-4 w-4 mr-1 text-primary" />
          <span>{program.field}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 mt-auto">
        <Button asChild className="w-full" disabled={program.deadlinePassed}>
          <Link to={`/programs/${program.id}`}>
            {program.deadlinePassed ? 'View Details' : 'Apply Now'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
