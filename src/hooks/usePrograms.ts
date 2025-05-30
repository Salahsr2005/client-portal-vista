
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { calculateMatchScore, getCountryFlagUrl } from '../services/ProgramMatchingService';

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
    search = '',
    country = '',
    field = '',
    level = '',
    language = '',
    maxBudget = 0,
    withScholarship = false,
    preferences = null,
    calculateMatchScores = false
  } = params;
  
  return useQuery({
    queryKey: ['programs', page, limit, search, country, field, level, language, maxBudget, withScholarship, preferences ? 'with-preferences' : 'no-preferences'],
    queryFn: async (): Promise<ProgramsData> => {
      let query = supabase
        .from('programs')
        .select('*', { count: 'exact' });
      
      // Apply filters if they are provided
      if (search) {
        query = query.or(`name.ilike.%${search}%,university.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      if (country) {
        query = query.eq('country', country);
      }
      
      if (field) {
        query = query.or(`field.eq.${field},field_keywords.cs.{${field}}`);
      }
      
      if (level) {
        query = query.eq('study_level', level);
      }
      
      if (language) {
        query = query.or(`program_language.ilike.%${language}%,secondary_language.ilike.%${language}%`);
      }
      
      if (maxBudget > 0) {
        query = query.lte('tuition_min', maxBudget);
      }
      
      if (withScholarship) {
        query = query.eq('scholarship_available', true);
      }
      
      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await query
        .range(from, to)
        .order('ranking', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching programs:', error);
        throw new Error(error.message);
      }
      
      // Calculate total pages
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      
      // For user favorites, we'll query the user's favorites if logged in
      let favorites: string[] = [];
      if (user) {
        const { data: favoritesData } = await supabase
          .from('favorite_programs')
          .select('program_id')
          .eq('user_id', user.id);
        
        if (favoritesData) {
          favorites = favoritesData.map((fav) => fav.program_id);
        }
      }
      
      // Process programs with additional information
      const processedPrograms = (data || []).map((program) => {
        // Check if application deadline has passed
        let deadlinePassed = false;
        if (program.application_deadline) {
          const deadlineDate = new Date(program.application_deadline);
          deadlinePassed = deadlineDate < new Date();
        }
        
        // Calculate match score if preferences are provided
        let matchScore = preferences && calculateMatchScores 
          ? calculateMatchScore(program, preferences) 
          : undefined;
        
        // Get country flag if image is missing
        const imageUrl = program.image_url || getCountryFlagUrl(program.country);
        
        return {
          ...program,
          isFavorite: favorites.includes(program.id),
          location: `${program.city}, ${program.country}`,
          duration: program.duration_months ? `${program.duration_months} months` : 'Not specified',
          deadlinePassed,
          hasScholarship: program.scholarship_available,
          hasReligiousFacilities: program.religious_facilities,
          hasHalalFood: program.halal_food_availability,
          matchScore,
          image_url: imageUrl,
          bgColorClass: program.status === 'Active' ? 'bg-green-100 dark:bg-green-900/10' : 
                     program.status === 'Inactive' || program.status === 'Full' ? 'bg-red-100 dark:bg-red-900/10' : 
                     'bg-amber-100 dark:bg-amber-900/10'
        };
      });
      
      // If we have preferences and calculateMatchScores is true, sort by match score
      const programsWithFavorites = calculateMatchScores && preferences
        ? processedPrograms.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        : processedPrograms;
      
      return {
        programs: programsWithFavorites as Program[],
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
      
      // Check if application deadline has passed
      let deadlinePassed = false;
      if (data.application_deadline) {
        const deadlineDate = new Date(data.application_deadline);
        deadlinePassed = deadlineDate < new Date();
      }
      
      // Get country flag if image is missing
      const imageUrl = data.image_url || getCountryFlagUrl(data.country);
      
      // Add additional fields for compatibility
      const programWithExtras = {
        ...data,
        isFavorite,
        location: `${data.city}, ${data.country}`,
        duration: data.duration_months ? `${data.duration_months} months` : 'Not specified',
        deadlinePassed,
        hasScholarship: data.scholarship_available,
        hasReligiousFacilities: data.religious_facilities,
        hasHalalFood: data.halal_food_availability,
        image_url: imageUrl,
        bgColorClass: data.status === 'Active' ? 'bg-green-100 dark:bg-green-900/10' : 
                     data.status === 'Inactive' || data.status === 'Full' ? 'bg-red-100 dark:bg-red-900/10' : 
                     'bg-amber-100 dark:bg-amber-900/10'
      };
      
      return programWithExtras as Program & { isFavorite: boolean };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};
