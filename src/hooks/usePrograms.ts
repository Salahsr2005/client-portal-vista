
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { getCountryFlagUrl } from '../services/ProgramMatchingService';
import { ProgramFilterService } from '../services/ProgramFilterService';
import { ProgramDataProcessor } from '../services/ProgramDataProcessor';

// Define Program type
export interface Program {
  id: string;
  name: string;
  university: string;
  country: string;
  city: string;
  study_level: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma";
  field: string;
  field_keywords: string[];
  duration_months: number;
  program_language: string;
  secondary_language: string;
  tuition_min: number;
  tuition_max: number;
  living_cost_min: number;
  living_cost_max: number;
  description: string;
  image_url: string;
  status: "Active" | "Inactive" | "Full" | "Coming Soon";
  ranking: number;
  application_deadline: string;
  scholarship_available: boolean;
  location?: string; // Added for compatibility with ProgramCard component
  duration?: string; // Added for compatibility with ProgramCard component
  matchScore?: number; // Added for compatibility with ProgramCard component
  isFavorite?: boolean;
  religious_facilities?: boolean;
  halal_food_availability?: boolean;
  bgColorClass?: string; // Added for status-based background color
  deadlinePassed?: boolean;
  hasScholarship?: boolean;
  hasReligiousFacilities?: boolean;
  hasHalalFood?: boolean;
}

export interface ProgramsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  field?: string;
  level?: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma";
  language?: string;
  maxBudget?: number;
  withScholarship?: boolean;
  preferences?: any; // User preferences for matching
  calculateMatchScores?: boolean; // Whether to calculate match scores
}

export interface ProgramsData {
  programs: Program[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// For compatibility with other components
export interface ProgramFilter {
  studyLevel?: string;
  location?: string;
  subjects?: string[];
  budget?: string;
  language?: string;
}

export const usePrograms = (params: ProgramsQueryParams = {}) => {
  const { user } = useAuth();
  const {
    page = 1,
    limit = 10,
    preferences = null,
    calculateMatchScores = false
  } = params;
  
  return useQuery({
    queryKey: ['programs', page, limit, params.search, params.country, params.field, params.level, params.language, params.maxBudget, params.withScholarship, preferences ? 'with-preferences' : 'no-preferences'],
    queryFn: async (): Promise<ProgramsData> => {
      // Build and execute query using the filter service
      let query = ProgramFilterService.buildQuery(params);
      query = ProgramFilterService.applyPagination(query, page, limit);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching programs:', error);
        throw new Error(error.message);
      }
      
      // Calculate total pages
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      
      // Get user favorites if logged in
      let favorites: string[] = [];
      if (user) {
        favorites = await ProgramDataProcessor.getFavorites(user.id);
      }
      
      // Process programs with additional information
      const processedPrograms = (data || []).map((program) => 
        ProgramDataProcessor.processProgram(program, favorites, preferences, calculateMatchScores)
      );
      
      // Sort programs if needed
      const sortedPrograms = ProgramDataProcessor.sortPrograms(
        processedPrograms, 
        calculateMatchScores, 
        preferences
      );
      
      return {
        programs: sortedPrograms as Program[],
        totalCount,
        currentPage: page,
        totalPages
      };
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

// Hook to get a single program by ID
export const useProgram = (id: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['program', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Check if user has favorited this program
      let isFavorite = false;
      if (user) {
        const { data: favoriteData } = await supabase
          .from('favorite_programs')
          .select('program_id')
          .eq('user_id', user.id)
          .eq('program_id', id)
          .single();
        
        isFavorite = !!favoriteData;
      }
      
      // Process single program using the data processor
      const favorites = isFavorite ? [id] : [];
      const processedProgram = ProgramDataProcessor.processProgram(data, favorites);
      
      return { ...processedProgram, isFavorite } as Program & { isFavorite: boolean };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};
