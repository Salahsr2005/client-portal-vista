import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultsHeader } from './ResultsHeader';
import { ActiveFilters } from './ActiveFilters';
import { ProgramList } from './ProgramList';
import { EmptyState } from './EmptyState';
import { ArrowLeft, LayoutPanelLeft } from 'lucide-react';

interface StepFourProps {
  filteredPrograms: any[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  activeFilters: { [key: string]: boolean };
  toggleFilter: (filter: string) => void;
  clearAllFilters: () => void;
  isGridView: boolean;
  setIsGridView: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPrograms: string[];
  favoritePrograms: string[];
  showMatchDetails: { [key: string]: boolean };
  showBudgetBreakdown: { [key: string]: boolean };
  handleProgramSelect: (programId: string) => void;
  toggleFavorite: (programId: string) => void;
  toggleMatchDetails: (programId: string) => void;
  toggleBudgetBreakdown: (programId: string) => void;
  handleSubmit: () => void;
  handlePrevious: () => void;
  isLoading: boolean;
  containerVariants: any;
  itemVariants: any;
  searchFilteredPrograms: any[];
}

export const StepFour: React.FC<StepFourProps> = ({
  filteredPrograms,
  searchQuery,
  setSearchQuery,
  activeFilters,
  toggleFilter,
  clearAllFilters,
  isGridView,
  setIsGridView,
  selectedPrograms,
  favoritePrograms,
  showMatchDetails,
  showBudgetBreakdown,
  handleProgramSelect,
  toggleFavorite,
  toggleMatchDetails,
  toggleBudgetBreakdown,
  handleSubmit,
  handlePrevious,
  isLoading,
  containerVariants,
  itemVariants,
  searchFilteredPrograms
}) => {
  return (
    <motion.div 
      key="step4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <ResultsHeader 
        programCount={filteredPrograms.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isGridView={isGridView}
        setIsGridView={setIsGridView}
        toggleFilter={toggleFilter}
      />
      
      <ActiveFilters 
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        clearAllFilters={clearAllFilters}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Finding your perfect programs...</p>
          </div>
        </div>
      ) : searchFilteredPrograms.length === 0 ? (
        <EmptyState handlePrevious={handlePrevious} />
      ) : (
        <div className="space-y-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all" className="relative">
                All Programs
                <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {searchFilteredPrograms.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="selected" className="relative">
                Selected
                {selectedPrograms.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {selectedPrograms.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="favorites" className="relative">
                Favorites
                {favoritePrograms.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {favoritePrograms.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6 mt-4">
              <ProgramList 
                programs={searchFilteredPrograms}
                isGridView={isGridView}
                selectedPrograms={selectedPrograms}
                favoritePrograms={favoritePrograms}
                showMatchDetails={showMatchDetails}
                showBudgetBreakdown={showBudgetBreakdown}
                handleProgramSelect={handleProgramSelect}
                toggleFavorite={toggleFavorite}
                toggleMatchDetails={toggleMatchDetails}
                toggleBudgetBreakdown={toggleBudgetBreakdown}
                containerVariants={containerVariants}
                itemVariants={itemVariants}
              />
            </TabsContent>
            
            <TabsContent value="selected" className="space-y-4 mt-4">
              {selectedPrograms.length === 0 ? (
                <EmptyState 
                  type="selected"
                  message="No programs selected yet"
                  description="Click the checkbox on any program card to select it for your application."
                />
              ) : (
                <ProgramList 
                  programs={searchFilteredPrograms.filter(program => selectedPrograms.includes(program.id))}
                  isGridView={isGridView}
                  selectedPrograms={selectedPrograms}
                  favoritePrograms={favoritePrograms}
                  showMatchDetails={showMatchDetails}
                  showBudgetBreakdown={showBudgetBreakdown}
                  handleProgramSelect={handleProgramSelect}
                  toggleFavorite={toggleFavorite}
                  toggleMatchDetails={toggleMatchDetails}
                  toggleBudgetBreakdown={toggleBudgetBreakdown}
                  containerVariants={containerVariants}
                  itemVariants={itemVariants}
                />
              )}
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-4 mt-4">
              {favoritePrograms.length === 0 ? (
                <EmptyState 
                  type="favorites"
                  message="No favorite programs yet"
                  description="Click the heart icon on any program card to add it to your favorites."
                />
              ) : (
                <ProgramList 
                  programs={searchFilteredPrograms.filter(program => favoritePrograms.includes(program.id))}
                  isGridView={isGridView}
                  selectedPrograms={selectedPrograms}
                  favoritePrograms={favoritePrograms}
                  showMatchDetails={showMatchDetails}
                  showBudgetBreakdown={showBudgetBreakdown}
                  handleProgramSelect={handleProgramSelect}
                  toggleFavorite={toggleFavorite}
                  toggleMatchDetails={toggleMatchDetails}
                  toggleBudgetBreakdown={toggleBudgetBreakdown}
                  containerVariants={containerVariants}
                  itemVariants={itemVariants}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {searchFilteredPrograms.length > 0 && (
        <motion.div 
          className="flex justify-between items-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground">
            {selectedPrograms.length} of {searchFilteredPrograms.length} programs selected
          </p>
          <Button 
            onClick={handleSubmit} 
            disabled={selectedPrograms.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            <LayoutPanelLeft className="h-4 w-4 mr-2" />
            Submit Selection
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
