"use client"

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

// Define Program type
export interface Program {
  id: string
  name: string
  university: string
  country: string
  city: string
  study_level: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma"
  field: string
  field_keywords: string[]
  duration_months: number
  program_language: string
  secondary_language: string
  tuition_min: number
  tuition_max: number
  living_cost_min: number
  living_cost_max: number
  description: string
  image_url: string
  status: "Active" | "Inactive" | "Full" | "Coming Soon"
  ranking: number
  application_deadline: string
  scholarship_available: boolean
  scholarship_amount?: number
  scholarship_deadline?: string
  scholarship_requirements?: string
  scholarship_details?: string
  admission_requirements?: string
  academic_requirements?: string
  language_requirement?: string
  language_test?: string
  language_test_score?: string
  language_test_exemptions?: string
  gpa_requirement?: number
  application_fee?: number
  visa_fee?: number
  housing_availability?: string
  housing_cost_min?: number
  housing_cost_max?: number
  north_african_community_size?: string
  internship_opportunities?: boolean
  exchange_opportunities?: boolean
  employment_rate?: number
  success_rate?: number
  total_places?: number
  available_places?: number
  website_url?: string
  virtual_tour_url?: string
  video_url?: string
  advantages?: string
  application_process?: string
  location?: string // Added for compatibility with ProgramCard component
  duration?: string // Added for compatibility with ProgramCard component
  matchScore?: number // Added for compatibility with ProgramCard component
  isFavorite?: boolean
  religious_facilities?: boolean
  halal_food_availability?: boolean
  bgColorClass?: string // Added for status-based background color
  deadlinePassed?: boolean
  hasScholarship?: boolean
  hasReligiousFacilities?: boolean
  hasHalalFood?: boolean
}

export interface ProgramsQueryParams {
  page?: number
  limit?: number
  search?: string
  country?: string
  field?: string
  level?: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma"
  language?: string
  maxBudget?: number
  withScholarship?: boolean
  preferences?: any // User preferences for matching
  calculateMatchScores?: boolean // Whether to calculate match scores
}

export interface ProgramsData {
  programs: Program[]
  totalCount: number
  currentPage: number
  totalPages: number
}

// For compatibility with other components
export interface ProgramFilter {
  studyLevel?: string
  location?: string
  subjects?: string[]
  budget?: string
  language?: string
}

export const usePrograms = (params: ProgramsQueryParams = {}) => {
  const { user } = useAuth()
  const { page = 1, limit = 12, preferences = null, calculateMatchScores = false } = params

  return useQuery({
    queryKey: [
      "programs",
      page,
      limit,
      params.search,
      params.country,
      params.field,
      params.level,
      params.language,
      params.maxBudget,
      params.withScholarship,
      preferences ? "with-preferences" : "no-preferences",
    ],
    queryFn: async (): Promise<ProgramsData> => {
      // Build base query
      let query = supabase.from("programs").select("*", { count: "exact" }).eq("status", "Active")

      // Apply filters
      if (params.search && params.search.trim()) {
        const searchTerm = params.search.trim()
        query = query.or(
          `name.ilike.%${searchTerm}%,university.ilike.%${searchTerm}%,field.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`,
        )
      }

      if (params.country) {
        query = query.eq("country", params.country)
      }

      if (params.field) {
        query = query.ilike("field", `%${params.field}%`)
      }

      if (params.level) {
        query = query.eq("study_level", params.level)
      }

      if (params.language) {
        query = query.ilike("program_language", `%${params.language}%`)
      }

      if (params.maxBudget) {
        query = query.lte("tuition_max", params.maxBudget)
      }

      if (params.withScholarship) {
        query = query.eq("scholarship_available", true)
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      // Order by ranking and name
      query = query.order("ranking", { ascending: true, nullsLast: true }).order("name", { ascending: true })

      const { data, error, count } = await query

      if (error) {
        console.error("Error fetching programs:", error)
        throw new Error(error.message)
      }

      // Calculate total pages
      const totalCount = count || 0
      const totalPages = Math.ceil(totalCount / limit)

      // Get user favorites if logged in
      let favorites: string[] = []
      if (user) {
        const { data: favData } = await supabase.from("favorite_programs").select("program_id").eq("user_id", user.id)

        favorites = favData?.map((f) => f.program_id) || []
      }

      // Process programs with additional information
      const processedPrograms = (data || []).map((program) => ({
        ...program,
        isFavorite: favorites.includes(program.id),
        location: `${program.city}, ${program.country}`,
        duration: `${program.duration_months} months`,
        hasScholarship: program.scholarship_available,
        hasReligiousFacilities: program.religious_facilities,
        hasHalalFood: program.halal_food_availability,
        deadlinePassed: program.application_deadline ? new Date(program.application_deadline) < new Date() : false,
        bgColorClass: program.status === "Active" ? "bg-green-50" : "bg-red-50",
      }))

      return {
        programs: processedPrograms as Program[],
        totalCount,
        currentPage: page,
        totalPages,
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook to get a single program by ID
export const useProgram = (id: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ["program", id],
    queryFn: async () => {
      if (!id) throw new Error("Program ID is required")

      const { data, error } = await supabase.from("programs").select("*").eq("id", id).single()

      if (error) {
        throw new Error(error.message)
      }

      // Check if user has favorited this program
      let isFavorite = false
      if (user) {
        const { data: favoriteData } = await supabase
          .from("favorite_programs")
          .select("program_id")
          .eq("user_id", user.id)
          .eq("program_id", id)
          .single()

        isFavorite = !!favoriteData
      }

      // Process single program
      const processedProgram = {
        ...data,
        isFavorite,
        location: `${data.city}, ${data.country}`,
        duration: `${data.duration_months} months`,
        hasScholarship: data.scholarship_available,
        hasReligiousFacilities: data.religious_facilities,
        hasHalalFood: data.halal_food_availability,
        deadlinePassed: data.application_deadline ? new Date(data.application_deadline) < new Date() : false,
        bgColorClass: data.status === "Active" ? "bg-green-50" : "bg-red-50",
      }

      return processedProgram as Program & { isFavorite: boolean }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}


