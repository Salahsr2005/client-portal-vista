import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { Tables } from "@/integrations/supabase/types"

export interface ProgramsQueryParams {
  page?: number
  limit?: number
  search?: string
  country?: string
  level?: Tables<"programs">["study_level"]
  field?: Tables<"programs">["field"]
  language?: string
  maxBudget?: number
  withScholarship?: boolean
}

export interface ProgramsResponse {
  programs: Tables<"programs">[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export const usePrograms = (params: ProgramsQueryParams = {}) => {
  return useQuery({
    queryKey: ["programs", params],
    queryFn: async (): Promise<ProgramsResponse> => {
      let query = supabase.from("programs").select("*", { count: "exact" }).eq("status", "Active")

      // Apply filters
      if (params.search) {
        query = query.or(
          `name.ilike.%${params.search}%,university.ilike.%${params.search}%,description.ilike.%${params.search}%`,
        )
      }

      if (params.country) {
        query = query.eq("country", params.country)
      }

      if (params.level) {
        query = query.eq("study_level", params.level)
      }

      if (params.field) {
        query = query.eq("field", params.field)
      }

      if (params.language) {
        query = query.eq("program_language", params.language)
      }

      if (params.maxBudget) {
        query = query.lte("tuition_max", params.maxBudget)
      }

      if (params.withScholarship) {
        query = query.eq("scholarship_available", true)
      }

      // Pagination
      const page = params.page || 1
      const limit = params.limit || 12
      const from = (page - 1) * limit
      const to = from + limit - 1

      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        console.error("Error fetching programs:", error)
        throw error
      }

      const totalCount = count || 0
      const totalPages = Math.ceil(totalCount / limit)

      return {
        programs: data || [],
        totalCount,
        totalPages,
        currentPage: page,
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useProgram = (id: string) => {
  return useQuery({
    queryKey: ["program", id],
    queryFn: async () => {
      if (!id) return null

      const { data, error } = await supabase.from("programs").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching program:", error)
        throw error
      }

      return data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })
}





