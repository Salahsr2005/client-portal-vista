import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProgramFilterService, type ProgramFilters } from "@/services/ProgramFilterService"

export interface Program {
  id: string
  name: string
  university: string
  country: string
  city: string
  field: string
  field_keywords?: string[]
  study_level: string
  program_language: string
  secondary_language?: string
  duration_months: number
  tuition_min: number
  tuition_max: number
  living_cost_min: number
  living_cost_max: number
  description: string
  admission_requirements: string
  academic_requirements?: string
  language_requirement: string
  language_test?: string
  language_test_score?: string
  language_test_exemptions?: string
  application_deadline?: string
  application_fee?: number
  visa_fee?: number
  scholarship_available?: boolean
  scholarship_amount?: number
  scholarship_details?: string
  scholarship_requirements?: string
  scholarship_deadline?: string
  religious_facilities?: boolean
  halal_food_availability?: boolean
  housing_availability?: string
  housing_cost_min?: number
  housing_cost_max?: number
  north_african_community_size?: string
  internship_opportunities?: boolean
  exchange_opportunities?: boolean
  employment_rate?: number
  success_rate?: number
  ranking?: number
  advantages?: string
  application_process?: string
  gpa_requirement?: number
  total_places?: number
  available_places?: number
  image_url?: string
  video_url?: string
  virtual_tour_url?: string
  website_url?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export const usePrograms = (filters?: ProgramFilters) => {
  return useQuery({
    queryKey: ["programs", filters],
    queryFn: async () => {
      if (filters && Object.keys(filters).length > 0) {
        return await ProgramFilterService.getFilteredPrograms(filters)
      }

      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("status", "Active")
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching programs:", error)
        throw new Error(error.message)
      }

      return data as Program[]
    },
  })
}

export const useAvailableFields = () => {
  return useQuery({
    queryKey: ["available-fields"],
    queryFn: () => ProgramFilterService.getAvailableFields(),
  })
}

export const useAvailableCountries = () => {
  return useQuery({
    queryKey: ["available-countries"],
    queryFn: () => ProgramFilterService.getAvailableCountries(),
  })
}

export const useAvailableLanguages = () => {
  return useQuery({
    queryKey: ["available-languages"],
    queryFn: () => ProgramFilterService.getAvailableLanguages(),
  })
}


