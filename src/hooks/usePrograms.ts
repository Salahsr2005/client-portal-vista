"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { Program } from "@/types/Program"

export const usePrograms = (filters?: any) => {
  const [data, setData] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true)
        setError(null)

        let query = supabase.from("programs").select("*").eq("status", "Active")

        // Apply filters if provided
        if (filters) {
          if (filters.study_level) {
            query = query.eq("study_level", filters.study_level)
          }
          if (filters.country) {
            query = query.eq("country", filters.country)
          }
          if (filters.field) {
            query = query.eq("field", filters.field)
          }
          if (filters.program_language) {
            query = query.eq("program_language", filters.program_language)
          }
        }

        const { data: programs, error: fetchError } = await query.order("created_at", { ascending: false })

        if (fetchError) {
          console.error("Error fetching programs:", fetchError)
          throw fetchError
        }

        console.log("✅ Programs fetched successfully:", programs?.length || 0)
        setData(programs || [])
      } catch (err) {
        console.error("❌ Error in usePrograms:", err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrograms()
  }, [filters])

  return { data, isLoading, error }
}

export const useProgram = (id: string) => {
  const [data, setData] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        console.log("🔍 Fetching program with ID:", id)

        const { data: program, error: fetchError } = await supabase.from("programs").select("*").eq("id", id).single()

        if (fetchError) {
          console.error("❌ Error fetching program:", fetchError)
          throw fetchError
        }

        if (!program) {
          console.warn("⚠️ No program found with ID:", id)
          setData(null)
        } else {
          console.log("✅ Program fetched successfully:", program.name)
          setData(program)
        }
      } catch (err) {
        console.error("❌ Error in useProgram:", err)
        setError(err as Error)
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgram()
  }, [id])

  return { data, isLoading, error }
}

export const useProgramsByDestination = (destinationId: string) => {
  const [data, setData] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!destinationId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const { data: programs, error: fetchError } = await supabase
          .from("programs")
          .select("*")
          .eq("destination_id", destinationId)
          .eq("status", "Active")
          .order("created_at", { ascending: false })

        if (fetchError) {
          console.error("Error fetching programs by destination:", fetchError)
          throw fetchError
        }

        setData(programs || [])
      } catch (err) {
        console.error("Error in useProgramsByDestination:", err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrograms()
  }, [destinationId])

  return { data, isLoading, error }
}



