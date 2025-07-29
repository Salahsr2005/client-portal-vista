"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

export interface Program {
  id: string
  name: string
  university: string
  country: string
  city?: string
  location?: string
  level?: string
  study_level?: string
  field?: string
  language?: string
  program_language?: string
  tuition_fee?: number
  tuition_min?: number
  tuition_max?: number
  living_cost_min?: number
  living_cost_max?: number
  duration?: string
  duration_months?: number
  description?: string
  requirements?: string[] | string
  application_deadline?: string
  intake_periods?: string[] | string
  scholarship_available?: boolean
  religious_facilities?: boolean
  halal_food_availability?: boolean
  ranking?: number
  success_rate?: number
  image_url?: string
  status?: string
  application_fee?: number
  advantages?: string
  created_at?: string
  updated_at?: string
  isFavorite?: boolean
  deadlinePassed?: boolean
  hasScholarship?: boolean
  hasReligiousFacilities?: boolean
  hasHalalFood?: boolean
  matchScore?: number
  bgColorClass?: string
}

export interface ProgramsQueryParams {
  page?: number
  limit?: number
  search?: string
  country?: string
  level?: string
  field?: string
  language?: string
  minTuition?: number
  maxTuition?: number
  maxBudget?: number
  withScholarship?: boolean
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface ProgramsResponse {
  programs: Program[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasMore: boolean
}

export function usePrograms(params?: ProgramsQueryParams) {
  const [data, setData] = useState<ProgramsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPrograms = async (queryParams: ProgramsQueryParams = {}): Promise<ProgramsResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        page = 1,
        limit = 12,
        search,
        country,
        level,
        field,
        language,
        maxBudget,
        withScholarship,
        sortBy = "name",
        sortOrder = "asc",
      } = queryParams

      console.log("🔍 Fetching programs with params:", queryParams)

      let query = supabase.from("programs").select("*", { count: "exact" })

      // Apply filters
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,university.ilike.%${search}%,field.ilike.%${search}%,description.ilike.%${search}%`,
        )
      }

      if (country && country !== "all") {
        query = query.eq("country", country)
      }

      if (level && level !== "all") {
        query = query.or(`level.eq.${level},study_level.eq.${level}`)
      }

      if (field && field !== "all") {
        query = query.eq("field", field)
      }

      if (language && language !== "all") {
        query = query.or(`language.ilike.%${language}%,program_language.ilike.%${language}%`)
      }

      if (maxBudget !== undefined && maxBudget > 0) {
        query = query.or(`tuition_fee.lte.${maxBudget},tuition_min.lte.${maxBudget}`)
      }

      if (withScholarship) {
        query = query.eq("scholarship_available", true)
      }

      // Apply sorting
      const sortColumn = sortBy === "tuition_min" ? "tuition_fee" : sortBy
      query = query.order(sortColumn, { ascending: sortOrder === "asc" })

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data: programsData, error: fetchError, count } = await query

      if (fetchError) {
        console.error("❌ Error fetching programs:", fetchError)
        throw fetchError
      }

      const processedPrograms = (programsData || []).map((program) => ({
        ...program,
        location: program.location || `${program.city || "Unknown"}, ${program.country}`,
        duration: program.duration || (program.duration_months ? `${program.duration_months} months` : "Not specified"),
        requirements: parseJsonField(program.requirements, []),
        intake_periods: parseJsonField(program.intake_periods, []),
        hasScholarship: program.scholarship_available,
        hasReligiousFacilities: program.religious_facilities,
        hasHalalFood: program.halal_food_availability,
        deadlinePassed: program.application_deadline ? new Date(program.application_deadline) < new Date() : false,
        bgColorClass:
          program.status === "Active"
            ? "bg-green-100 dark:bg-green-900/10"
            : program.status === "Inactive" || program.status === "Full"
              ? "bg-red-100 dark:bg-red-900/10"
              : "bg-amber-100 dark:bg-amber-900/10",
      }))

      const totalPages = Math.ceil((count || 0) / limit)
      const hasMore = page < totalPages

      console.log(`✅ Fetched ${processedPrograms.length} programs (total: ${count})`)

      const response: ProgramsResponse = {
        programs: processedPrograms,
        totalCount: count || 0,
        totalPages,
        currentPage: page,
        hasMore,
      }

      setData(response)
      return response
    } catch (err) {
      console.error("❌ Error in fetchPrograms:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch programs"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProgramById = async (id: string): Promise<Program | null> => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("🔍 Fetching program by ID:", id)

      const { data: programData, error: fetchError } = await supabase.from("programs").select("*").eq("id", id).single()

      if (fetchError) {
        console.error("❌ Error fetching program:", fetchError)
        throw fetchError
      }

      if (!programData) {
        console.warn("⚠️ Program not found:", id)
        return null
      }

      const processedProgram = {
        ...programData,
        location: programData.location || `${programData.city || "Unknown"}, ${programData.country}`,
        duration:
          programData.duration ||
          (programData.duration_months ? `${programData.duration_months} months` : "Not specified"),
        requirements: parseJsonField(programData.requirements, []),
        intake_periods: parseJsonField(programData.intake_periods, []),
        hasScholarship: programData.scholarship_available,
        hasReligiousFacilities: programData.religious_facilities,
        hasHalalFood: programData.halal_food_availability,
        deadlinePassed: programData.application_deadline
          ? new Date(programData.application_deadline) < new Date()
          : false,
      }

      console.log("✅ Fetched program:", processedProgram.name)
      return processedProgram
    } catch (err) {
      console.error("❌ Error in fetchProgramById:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch program"
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getUniqueValues = async (column: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase.from("programs").select(column).not(column, "is", null)

      if (error) throw error

      const uniqueValues = [...new Set(data?.map((item) => item[column]).filter(Boolean))]
      return uniqueValues.sort()
    } catch (err) {
      console.error(`❌ Error fetching unique ${column}:`, err)
      return []
    }
  }

  // Helper method to safely parse JSON fields
  const parseJsonField = (field: any, fallback: any = []): any => {
    if (!field) return fallback
    if (typeof field === "string") {
      try {
        return JSON.parse(field)
      } catch {
        // If JSON parsing fails, try to split by comma
        return field
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean)
      }
    }
    return Array.isArray(field) ? field : fallback
  }

  // Auto-fetch when params change
  useEffect(() => {
    if (params) {
      fetchPrograms(params)
    }
  }, [
    params?.page,
    params?.limit,
    params?.search,
    params?.country,
    params?.level,
    params?.field,
    params?.language,
    params?.maxBudget,
    params?.withScholarship,
    params?.sortBy,
    params?.sortOrder,
  ])

  return {
    data,
    isLoading,
    error,
    fetchPrograms,
    fetchProgramById,
    getUniqueValues,
    clearData: () => setData(null),
    clearError: () => setError(null),
  }
}







