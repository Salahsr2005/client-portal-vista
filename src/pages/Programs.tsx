import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrograms } from '@/hooks/usePrograms';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProgramCard from '@/components/consultation/ProgramCard';
import ComparePrograms from '@/components/programs/ComparePrograms';
import { Program } from '@/components/consultation/types';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, Grid, Search, Heart, LayoutPanelLeft, AlertTriangle } from 'lucide-react';
import { createFavoriteProgramsTable } from '@/utils/databaseHelpers';

const Programs = () => {
  const { data: programs = [], isLoading } = usePrograms();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<string[]>([]);
  const [comparePrograms, setComparePrograms] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(true);

  // Initialize favorites and storage buckets
  useEffect(() => {
    createFavoriteProgramsTable();
    
    if (user) {
      fetchFavoritePrograms();
    }
  }, [user]);
  
  const fetchFavoritePrograms = async () => {
    if (!user) return;
    
    try {
      // Fetch user's favorite programs
      const { data, error } = await supabase
        .from('favorite_programs')
        .select('program_id')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching favorite programs:', error);
        return;
      }
      
      if (data) {
        const favoriteIds = data.map(item => item.program_id);
        setFavoritePrograms(favoriteIds);
      }
    } catch (err) {
      console.error('Error in fetchFavoritePrograms:', err);
    }
  };
  
  const toggleFavorite = async (programId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorite programs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (favoritePrograms.includes(programId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorite_programs')
          .delete()
          .eq('user_id', user.id)
          .eq('program_id', programId);
          
        if (error) throw error;
        
        setFavoritePrograms(prev => prev.filter(id => id !== programId));
        toast({
          title: "Removed from favorites",
          description: "Program removed from your favorites",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorite_programs')
          .insert({
            user_id: user.id,
            program_id: programId
          });
          
        if (error) throw error;
        
        setFavoritePrograms(prev => [...prev, programId]);
        toast({
          title: "Added to favorites",
          description: "Program added to your favorites",
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Filter programs based on search query
  const filteredPrograms = searchQuery 
    ? programs.filter(program => 
        program.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.university?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.country?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : programs;

  const handleProgramSelect = (programId: string) => {
    setSelectedPrograms(prev => {
      if (prev.includes(programId)) {
        return prev.filter(id => id !== programId);
      } else {
        return [...prev, programId];
      }
    });
  };

  const handleCompareSelect = (programId: string) => {
    setComparePrograms(prev => {
      if (prev.includes(programId)) {
        return prev.filter(id => id !== programId);
      } else {
        // Limit the number of programs that can be compared
        if (prev.length >= 3) {
          toast({
            title: "Maximum programs reached",
            description: "You can compare up to 3 programs at once",
            variant: "destructive",
          });
          return prev;
        }
        return [...prev, programId];
      }
    });
  };

  const handleCompareRemove = (programId: string) => {
    setComparePrograms(prev => prev.filter(id => id !== programId));
  };
  
  const programsToCompare = programs.filter(p => comparePrograms.includes(p.id)) as Program[];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container py-8 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Educational Programs</h1>
            <p className="text-muted-foreground">
              Explore our selection of educational programs across top institutions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search programs..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant={isGridView ? "default" : "outline"}
                size="icon"
                onClick={() => setIsGridView(true)}
                className={`h-9 w-9 rounded-r-none ${isGridView ? '' : 'border-r-0'}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={!isGridView ? "default" : "outline"}
                size="icon"
                onClick={() => setIsGridView(false)}
                className={`h-9 w-9 rounded-l-none ${!isGridView ? '' : 'border-l-0'}`}
              >
                <ListFilter className="h-4 w-4" />
              </Button>
            </div>

            {comparePrograms.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompare(true)}
                className="flex items-center gap-1"
              >
                <LayoutPanelLeft className="h-4 w-4 mr-1" />
                Compare ({comparePrograms.length})
              </Button>
            )}
          </div>
        </div>

        {showCompare && programsToCompare.length > 0 && (
          <ComparePrograms 
            programs={programsToCompare}
            onClose={() => setShowCompare(false)} 
            onRemoveProgram={handleCompareRemove}
          />
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" className="relative">
              All Programs
              <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {filteredPrograms.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="relative">
              Favorites
              {favoritePrograms.length > 0 && (
                <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {favoritePrograms.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="compare" className="relative">
              Compare
              {comparePrograms.length > 0 && (
                <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {comparePrograms.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6 mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">Loading programs...</p>
                </div>
              </div>
            ) : filteredPrograms.length === 0 ? (
              <div className="text-center py-12 px-4 bg-muted/30 rounded-lg">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">No programs found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Try adjusting your search query to find what you're looking for.
                </p>
              </div>
            ) : (
              <motion.div 
                className={isGridView 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
                }
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredPrograms.map((program) => (
                  <motion.div
                    key={program.id}
                    variants={itemVariants}
                  >
                    <ProgramCard 
                      program={program}
                      isSelected={selectedPrograms.includes(program.id)}
                      isFavorite={favoritePrograms.includes(program.id)}
                      isCompare={comparePrograms.includes(program.id)}
                      onSelect={() => handleProgramSelect(program.id)}
                      onFavorite={() => toggleFavorite(program.id)}
                      onCompare={() => handleCompareSelect(program.id)}
                      isGridView={isGridView}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-4 mt-4">
            {favoritePrograms.length === 0 ? (
              <div className="text-center py-12 px-4 bg-muted/30 rounded-lg">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">No favorite programs yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Click the heart icon on any program card to add it to your favorites.
                </p>
              </div>
            ) : (
              <motion.div 
                className={isGridView 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
                }
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredPrograms
                  .filter(program => favoritePrograms.includes(program.id))
                  .map((program) => (
                    <motion.div
                      key={program.id}
                      variants={itemVariants}
                    >
                      <ProgramCard 
                        program={program}
                        isSelected={selectedPrograms.includes(program.id)}
                        isFavorite={true}
                        isCompare={comparePrograms.includes(program.id)}
                        onSelect={() => handleProgramSelect(program.id)}
                        onFavorite={() => toggleFavorite(program.id)}
                        onCompare={() => handleCompareSelect(program.id)}
                        isGridView={isGridView}
                      />
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="compare" className="space-y-4 mt-4">
            {comparePrograms.length === 0 ? (
              <div className="text-center py-12 px-4 bg-muted/30 rounded-lg">
                <LayoutPanelLeft className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">No programs selected for comparison</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Click the compare button on program cards to add them for comparison.
                </p>
              </div>
            ) : (
              <>
                {comparePrograms.length < 2 && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-3 rounded-md mb-4">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <p className="text-sm text-amber-800">
                      Select at least 2 programs for a meaningful comparison.
                    </p>
                  </div>
                )}
                <motion.div 
                  className={isGridView 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                  }
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {filteredPrograms
                    .filter(program => comparePrograms.includes(program.id))
                    .map((program) => (
                      <motion.div
                        key={program.id}
                        variants={itemVariants}
                      >
                        <ProgramCard 
                          program={program}
                          isSelected={selectedPrograms.includes(program.id)}
                          isFavorite={favoritePrograms.includes(program.id)}
                          isCompare={true}
                          onSelect={() => handleProgramSelect(program.id)}
                          onFavorite={() => toggleFavorite(program.id)}
                          onCompare={() => handleCompareSelect(program.id)}
                          isGridView={isGridView}
                        />
                      </motion.div>
                    ))}
                </motion.div>
                
                {comparePrograms.length >= 2 && (
                  <div className="flex justify-center mt-4">
                    <Button onClick={() => setShowCompare(true)}>
                      <LayoutPanelLeft className="h-4 w-4 mr-2" />
                      Compare Programs
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Programs;
