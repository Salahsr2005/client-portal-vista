
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Program } from '@/components/consultation/types';
import { Heart, BookOpenCheck, GraduationCap, Globe, Clock, Building, CircleDollarSign, Users, Bookmark, Share2 } from "lucide-react";
import { cn } from '@/lib/utils';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ProgramCardProps {
  program: Program;
  showMatchScore?: boolean;
  isGridView?: boolean;
  isFavorite?: boolean;
  isCompare?: boolean;
  onFavorite?: (programId: string) => void;
  onCompare?: (programId: string) => void;
  onShare?: (programId: string) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  program, 
  showMatchScore = false,
  isGridView = true,
  isFavorite = false,
  isCompare = false,
  onFavorite,
  onCompare,
  onShare
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Handle favorite toggle if custom handler is not provided
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onFavorite) {
      onFavorite(program.id);
      return;
    }
    
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
  
  // Handle compare toggle
  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompare) onCompare(program.id);
  };

  // Handle share
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) onShare(program.id);
  };
  
  if (!isGridView) {
    // List view
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/4">
              <img 
                src={program.image_url || "/placeholder.svg"} 
                alt={program.name} 
                className="w-full h-48 md:h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="bg-white/90 text-rose-500 hover:bg-white hover:text-rose-600 rounded-full shadow-sm" 
                  onClick={handleFavoriteToggle}
                  disabled={isLoading}
                >
                  <Heart className={cn("h-4 w-4", isFavorite ? "fill-rose-500" : "fill-transparent")} />
                </Button>
                
                {onCompare && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-white/90 text-indigo-500 hover:bg-white hover:text-indigo-600 rounded-full shadow-sm" 
                    onClick={handleCompareToggle}
                  >
                    <Bookmark className={cn("h-4 w-4", isCompare ? "fill-indigo-500" : "fill-transparent")} />
                  </Button>
                )}
                
                {onShare && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-white/90 text-slate-500 hover:bg-white hover:text-slate-700 rounded-full shadow-sm" 
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {program.featured && (
                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-orange-500 font-semibold px-2 py-0.5 rounded-full shadow-sm">
                  Featured
                </Badge>
              )}
              
              {(program.matchScore !== undefined && showMatchScore) && (
                <div className="absolute bottom-2 left-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full px-3 py-1 text-xs font-medium shadow-md">
                  {Math.round(program.matchScore)}% Match
                </div>
              )}
            </div>
            
            <div className="flex flex-col p-4 flex-1">
              <div className="mb-2 flex flex-wrap gap-2">
                {program.hasScholarship && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                    <CircleDollarSign className="h-3 w-3" />
                    Scholarship
                  </Badge>
                )}
                
                {program.deadlinePassed && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Deadline Passed
                  </Badge>
                )}
                
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {program.type}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg">{program.name}</h3>
              <div className="text-muted-foreground text-sm flex items-center mt-1">
                <Building className="h-4 w-4 mr-1 inline text-indigo-500" />
                {program.university}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 mr-1.5 text-indigo-500" />
                  <span>{program.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1.5 text-indigo-500" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CircleDollarSign className="h-4 w-4 mr-1.5 text-indigo-500" />
                  <span>€{program.tuition.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <BookOpenCheck className="h-4 w-4 mr-1.5 text-indigo-500" />
                  <span>{program.field}</span>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex justify-end">
                <Button asChild className={cn(
                  "shadow-md bg-gradient-to-r hover:shadow-lg transition-all",
                  program.deadlinePassed 
                    ? "from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800" 
                    : "from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                )} disabled={program.deadlinePassed}>
                  <Link to={`/programs/${program.id}`}>
                    {program.deadlinePassed ? 'View Details' : 'Apply Now'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-0 shadow-md overflow-hidden">
        <div className="relative">
          <img 
            src={program.image_url || "/placeholder.svg"} 
            alt={program.name} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-white/90 text-rose-500 hover:bg-white hover:text-rose-600 rounded-full shadow-sm" 
              onClick={handleFavoriteToggle}
              disabled={isLoading}
            >
              <Heart className={cn("h-4 w-4", isFavorite ? "fill-rose-500" : "fill-transparent")} />
            </Button>
            
            {onCompare && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/90 text-indigo-500 hover:bg-white hover:text-indigo-600 rounded-full shadow-sm" 
                onClick={handleCompareToggle}
              >
                <Bookmark className={cn("h-4 w-4", isCompare ? "fill-indigo-500" : "fill-transparent")} />
              </Button>
            )}
            
            {onShare && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/90 text-slate-500 hover:bg-white hover:text-slate-700 rounded-full shadow-sm" 
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {program.featured && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-orange-500 font-semibold px-2 py-0.5 rounded-full shadow-sm">
              Featured
            </Badge>
          )}
          
          {program.deadlinePassed && (
            <Badge variant="destructive" className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full shadow-md">
              Application Closed
            </Badge>
          )}
          
          {(program.matchScore !== undefined && showMatchScore) && (
            <div className="absolute bottom-2 left-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full px-3 py-1 text-xs font-medium shadow-md">
              {Math.round(program.matchScore)}% Match
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2 space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-2">{program.name}</h3>
          </div>
          <div className="text-muted-foreground text-sm flex items-center">
            <Building className="h-4 w-4 mr-1 inline text-indigo-500" />
            {program.university}
          </div>
          <div className="text-muted-foreground text-sm flex items-center">
            <Globe className="h-4 w-4 mr-1 inline text-indigo-500" />
            {program.location}
          </div>
        </CardHeader>
        
        <CardContent className="grid grid-cols-2 gap-2 py-2">
          <div className="flex items-center text-sm">
            <GraduationCap className="h-4 w-4 mr-1 text-indigo-500" />
            <span className="truncate">{program.type}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-indigo-500" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center text-sm">
            <CircleDollarSign className="h-4 w-4 mr-1 text-indigo-500" />
            <span>€{program.tuition.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <BookOpenCheck className="h-4 w-4 mr-1 text-indigo-500" />
            <span className="truncate">{program.field}</span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 mt-auto">
          <Button asChild className={cn(
            "w-full shadow-md hover:shadow-lg transition-all bg-gradient-to-r",
            program.deadlinePassed 
              ? "from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800" 
              : "from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
          )} disabled={program.deadlinePassed}>
            <Link to={`/programs/${program.id}`}>
              {program.deadlinePassed ? 'View Details' : 'Apply Now'}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProgramCard;
