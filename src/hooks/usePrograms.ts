"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface UsePrograms {
  limit?: number
  calculateMatchScores?: boolean
  searchQuery?: string
  filters?: {
    studyLevel?: string
    country?: string
    field?: string
    language?: string
    budgetMin?: number
    budgetMax?: number
  }
}

interface Program {
  id: string
  name: string
  university: string
  country: string
  city: string
  study_level: string
  field: string
  program_language: string
  secondary_language?: string
  duration_months: number
  tuition_min: number
  tuition_max: number
  living_cost_min: number
  living_cost_max: number
  application_fee: number
  visa_fee?: number
  description: string
  image_url?: string
  field_keywords?: string[]
  scholarship_available: boolean
  scholarship_amount?: number
  scholarship_deadline?: string
  scholarship_requirements?: string
  scholarship_details?: string
  admission_requirements: string
  academic_requirements?: string
  language_requirement: string
  language_test?: string
  language_test_score?: string
  language_test_exemptions?: string
  gpa_requirement?: number
  application_deadline: string
  application_process?: string
  religious_facilities: boolean
  halal_food_availability: boolean
  housing_availability?: string
  housing_cost_min?: number
  housing_cost_max?: number
  north_african_community_size?: string
  internship_opportunities: boolean
  exchange_opportunities: boolean
  employment_rate?: number
  ranking?: number
  success_rate?: number
  total_places?: number
  available_places?: number
  website_url?: string
  virtual_tour_url?: string
  video_url?: string
  advantages?: string
  status: string
}

export function usePrograms(options: UsePrograms = {}) {
  const [data, setData] = useState<{ programs: Program[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPrograms()
  }, [options.limit, options.searchQuery, JSON.stringify(options.filters)])

  const fetchPrograms = async () => {
    try {
      setIsLoading(true)
      setError(null)

      let query = supabase
        .from("programs")
        .select("*")
        .eq("status", "Active")
        .order("ranking", { ascending: true, nullsLast: true })

      // Apply filters
      if (options.filters) {
        if (options.filters.studyLevel) {
          query = query.eq("study_level", options.filters.studyLevel)
        }
        if (options.filters.country) {
          query = query.eq("country", options.filters.country)
        }
        if (options.filters.field) {
          query = query.ilike("field", `%${options.filters.field}%`)
        }
        if (options.filters.language) {
          query = query.ilike("program_language", `%${options.filters.language}%`)
        }
        if (options.filters.budgetMin !== undefined) {
          query = query.gte("tuition_min", options.filters.budgetMin)
        }
        if (options.filters.budgetMax !== undefined) {
          query = query.lte("tuition_max", options.filters.budgetMax)
        }
      }

      // Apply search query
      if (options.searchQuery && options.searchQuery.trim()) {
        const searchTerm = options.searchQuery.trim()
        query = query.or(
          `name.ilike.%${searchTerm}%,university.ilike.%${searchTerm}%,field.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,field_keywords.cs.{${searchTerm}}`,
        )
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data: programs, error } = await query

      if (error) {
        throw error
      }

      setData({ programs: programs || [] })
    } catch (err) {
      console.error("Error fetching programs:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch programs")
      toast({
        title: "Error",
        description: "Failed to load programs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { data, isLoading, error, refetch: fetchPrograms }
}

// Hook for fetching a single program
export function useProgram(id: string) {
  const [data, setData] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }

    fetchProgram()
  }, [id])

  const fetchProgram = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: program, error } = await supabase.from("programs").select("*").eq("id", id).single()

      if (error) {
        throw error
      }

      setData(program)
    } catch (err) {
      console.error("Error fetching program:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch program")
      toast({
        title: "Error",
        description: "Failed to load program details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { data, isLoading, error, refetch: fetchProgram }
}

