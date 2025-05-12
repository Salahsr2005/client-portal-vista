
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePrograms } from '@/hooks/usePrograms';
import { Program } from '@/hooks/usePrograms';
import { FormData } from '../types';
import { ResultsHeader } from './ResultsHeader';
import { ActiveFilters } from './ActiveFilters';
import { ProgramList } from './ProgramList';
import { EmptyState } from './EmptyState';

interface ResultsProps {
  formData: FormData;
}

const Results: React.FC<ResultsProps> = ({ formData }) => {
  const { user } = useAuth();
  const [activeFilters, setActiveFilters] = useState<{
    level: string;
    destination: string;
    budget: string | number;
    language: string;
  }>({
    level: formData.level || '',
    destination: formData.destination || formData.location || '',
    budget: formData.budget || 0,
    language: formData.language || '',
  });
  
  // Set up state for program view and search functionality
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<string[]>([]);
  const [showMatchDetails, setShowMatchDetails] = useState<{[key: string]: boolean}>({});
  const [showBudgetBreakdown, setShowBudgetBreakdown] = useState<{[key: string]: boolean}>({});

  // Map form data to query params
  const queryParams = {
    level: activeFilters.level as any,
    country: activeFilters.destination,
    maxBudget: Number(activeFilters.budget) || 0,
    language: activeFilters.language,
    withScholarship: formData.scholarshipRequired || formData.specialRequirements?.scholarshipRequired || false,
    preferences: formData, // Pass all form data as preferences for matching
    calculateMatchScores: true, // Enable match score calculation
    limit: 12 // Show more results
  };

  const { data, isLoading, isError } = usePrograms(queryParams);
  const programs = data?.programs || [];

  const handleFilterChange = (filter: string, value: string | number) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  const clearFilter = (filter: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: ''
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      level: '',
      destination: '',
      budget: '',
      language: '',
    });
  };

  // Animation variants for program list
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

  // Program card interactions
  const handleProgramSelect = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const toggleFavorite = (programId: string) => {
    setFavoritePrograms(prev => 
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const toggleMatchDetails = (programId: string) => {
    setShowMatchDetails(prev => ({
      ...prev,
      [programId]: !prev[programId]
    }));
  };

  const toggleBudgetBreakdown = (programId: string) => {
    setShowBudgetBreakdown(prev => ({
      ...prev,
      [programId]: !prev[programId]
    }));
  };

  useEffect(() => {
    console.log("Form data in Results:", formData);
    console.log("Programs with match scores:", programs);
  }, [formData, programs]);

  return (
    <div className="p-6">
      <ResultsHeader 
        programCount={programs.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isGridView={isGridView}
        setIsGridView={setIsGridView}
        toggleFilter={handleFilterChange}
      />
      
      <div className="mt-6">
        <ActiveFilters 
          activeFilters={{
            level: !!activeFilters.level,
            destination: !!activeFilters.destination,
            budget: !!activeFilters.budget,
            language: !!activeFilters.language
          }}
          toggleFilter={clearFilter}
          clearAllFilters={clearAllFilters}
        />
      </div>
      
      {isLoading ? (
        <div className="my-8 flex justify-center">
          <div className="w-full max-w-md">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-40 bg-slate-200 rounded"></div>
              <div className="h-40 bg-slate-200 rounded"></div>
              <div className="h-40 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      ) : isError ? (
        <div className="my-8 text-center text-red-500">
          <p>Error loading program recommendations. Please try again.</p>
        </div>
      ) : programs.length > 0 ? (
        <ProgramList 
          programs={programs}
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
      ) : (
        <EmptyState 
          type="default" 
          handlePrevious={clearAllFilters} 
        />
      )}
    </div>
  );
};

export default Results;
