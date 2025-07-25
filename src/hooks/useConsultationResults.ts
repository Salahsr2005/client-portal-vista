import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { calculateMatchScore } from "@/services/ProgramMatchingService"

export interface ConsultationPreferences {
  type: "programs" | "destinations"
  level?: string
  field?: string
  language?: string
  budget?: number
  specialRequirements?: {
    religiousFacilities?: boolean
    halalFood?: boolean
    scholarshipRequired?: boolean
  }
  destination?: string
  subjects?: string[]
}

export const useConsultationResults = (preferences: ConsultationPreferences | null) => {
  return useQuery({
    queryKey: ["consultation-results", preferences],
    queryFn: async () => {
      if (!preferences) return []

      if (preferences.type === "programs") {
        // Build programs query
        let query = supabase.from("programs").select("*").eq("status", "Active")

        // Apply filters based on preferences
        if (preferences.level) {
          query = query.eq("study_level", preferences.level)
        }

        if (preferences.field) {
          // Search in both field and field_keywords
          query = query.or(`field.ilike.%${preferences.field}%,field_keywords.cs.{${preferences.field}}`)
        }

        if (preferences.language) {
          query = query.or(
            `program_language.ilike.%${preferences.language}%,secondary_language.ilike.%${preferences.language}%`,
          )
        }

        if (preferences.budget && preferences.budget > 0) {
          query = query.lte("tuition_min", preferences.budget)
        }

        if (preferences.specialRequirements?.scholarshipRequired) {
          query = query.eq("scholarship_available", true)
        }

        if (preferences.specialRequirements?.religiousFacilities) {
          query = query.eq("religious_facilities", true)
        }

        if (preferences.specialRequirements?.halalFood) {
          query = query.eq("halal_food_availability", true)
        }

        const { data: programs, error } = await query.limit(50)

        if (error) {
          console.error("Error fetching programs:", error)
          throw new Error(error.message)
        }

        // Calculate match scores and sort by relevance
        const programsWithScores = (programs || []).map((program) => ({
          ...program,
          matchScore: calculateMatchScore(program, preferences),
          type: "program" as const,
        }))

        return programsWithScores
          .filter((program) => program.matchScore > 30) // Only show programs with decent match
          .sort((a, b) => b.matchScore - a.matchScore)
      } else if (preferences.type === "destinations") {
        // Build destinations query
        let query = supabase.from("destinations").select("*").eq("status", "Active")

        // Apply level-specific budget filtering
        if (preferences.budget && preferences.budget > 0 && preferences.level) {
          const levelField = `${preferences.level.toLowerCase()}_tuition_max`
          query = query.lte(levelField, preferences.budget)
        }

        if (preferences.language) {
          query = query.contains("languages", [preferences.language])
        }

        if (preferences.specialRequirements?.religiousFacilities) {
          query = query.eq("religious_facilities", true)
        }

        if (preferences.specialRequirements?.halalFood) {
          query = query.eq("halal_food_availability", true)
        }

        const { data: destinations, error } = await query.limit(50)

        if (error) {
          console.error("Error fetching destinations:", error)
          throw new Error(error.message)
        }

        return (destinations || []).map((destination) => ({
          ...destination,
          type: "destination" as const,
          matchScore: 85, // Default match score for destinations
        }))
      }

      return []
    },
    enabled: !!preferences,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

