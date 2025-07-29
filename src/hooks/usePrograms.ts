"use client"

import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export interface Program {
  id: string
  name: string
  university: string
  country: string
  level: string
  field: string
  language: string
  tuition_fee: number
  duration: string
  description: string
  requirements: string[]
  application_deadline: string
  intake_periods: string[]
  scholarship_available: boolean
  created_at: string
  updated_at: string
}

export interface ProgramFilters {
  search?: string
  country?: string
  level?: string
  field?: string
  language?: string
  minTuition?: number
  maxTuition?: number
  withScholarship?: boolean
}

export interface ProgramsResponse {
  programs: Program[]
  total: number
  hasMore: boolean
}

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchPrograms = async (
    filters: ProgramFilters = {},
    page = 1,
    limit = 12,
    sortBy = "name",
    sortOrder: "asc" | "desc" = "asc",
  ): Promise<ProgramsResponse> => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔍 Fetching programs with filters:", filters)

      let query = supabase.from("programs").select("*", { count: "exact" })

      // Apply filters
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,university.ilike.%${filters.search}%,field.ilike.%${filters.search}%`,
        )
      }

      if (filters.country && filters.country !== "all") {
        query = query.eq("country", filters.country)
      }

      if (filters.level && filters.level !== "all") {
        query = query.eq("level", filters.level)
      }

      if (filters.field && filters.field !== "all") {
        query = query.eq("field", filters.field)
      }

      if (filters.language && filters.language !== "all") {
        query = query.eq("language", filters.language)
      }

      if (filters.minTuition !== undefined) {
        query = query.gte("tuition_fee", filters.minTuition)
      }

      if (filters.maxTuition !== undefined) {
        query = query.lte("tuition_fee", filters.maxTuition)
      }

      if (filters.withScholarship) {
        query = query.eq("scholarship_available", true)
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" })

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error: fetchError, count } = await query

      if (fetchError) {
        console.error("❌ Error fetching programs:", fetchError)
        throw fetchError
      }

      const fetchedPrograms = (data || []).map((program) => ({
        ...program,
        requirements: this.parseJsonField(program.requirements, []),
        intake_periods: this.parseJsonField(program.intake_periods, []),
      }))

      console.log(`✅ Fetched ${fetchedPrograms.length} programs (total: ${count})`)

      setPrograms(page === 1 ? fetchedPrograms : [...programs, ...fetchedPrograms])
      setTotal(count || 0)
      setHasMore(fetchedPrograms.length === limit)

      return {
        programs: fetchedPrograms,
        total: count || 0,
        hasMore: fetchedPrograms.length === limit,
      }
    } catch (err) {
      console.error("❌ Error in fetchPrograms:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch programs"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchProgramById = async (id: string): Promise<Program | null> => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔍 Fetching program by ID:", id)

      const { data, error: fetchError } = await supabase.from("programs").select("*").eq("id", id).single()

      if (fetchError) {
        console.error("❌ Error fetching program:", fetchError)
        throw fetchError
      }

      if (!data) {
        console.warn("⚠️ Program not found:", id)
        return null
      }

      const program = {
        ...data,
        requirements: this.parseJsonField(data.requirements, []),
        intake_periods: this.parseJsonField(data.intake_periods, []),
      }

      console.log("✅ Fetched program:", program.name)
      return program
    } catch (err) {
      console.error("❌ Error in fetchProgramById:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch program"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
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

  return {
    programs,
    loading,
    error,
    total,
    hasMore,
    fetchPrograms,
    fetchProgramById,
    getUniqueValues,
    clearPrograms: () => setPrograms([]),
    clearError: () => setError(null),
  }
}






