import { supabase } from "@/integrations/supabase/client"
import type { ProgramsQueryParams } from "@/hooks/usePrograms"

export class ProgramFilterService {
  static buildQuery(params: ProgramsQueryParams) {
    const {
      search = "",
      country = "",
      field = "",
      level = "",
      language = "",
      maxBudget = 0,
      withScholarship = false,
    } = params

    let query = supabase.from("programs").select("*", { count: "exact" })

    // Apply filters if they are provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,university.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (country) {
      query = query.eq("country", country)
    }

    if (field) {
      // Fix: Use separate filters instead of OR with special characters
      // This avoids PostgreSQL parsing issues with commas and spaces in field names
      query = query.or(
        `field.ilike.%${field.replace(/[,'"]/g, "")}%,field_keywords.cs.{"${field.replace(/"/g, '\\"')}"}`,
      )
    }

    if (level) {
      query = query.eq("study_level", level)
    }

    if (language) {
      query = query.or(`program_language.ilike.%${language}%,secondary_language.ilike.%${language}%`)
    }

    if (maxBudget > 0) {
      query = query.lte("tuition_min", maxBudget)
    }

    if (withScholarship) {
      query = query.eq("scholarship_available", true)
    }

    return query
  }

  static applyPagination(query: any, page: number, limit: number) {
    const from = (page - 1) * limit
    const to = from + limit - 1

    return query.range(from, to).order("ranking", { ascending: true }).order("name", { ascending: true })
  }

  // Alternative method for field filtering that handles special characters better
  static buildQueryWithSafeFieldFilter(params: ProgramsQueryParams) {
    const {
      search = "",
      country = "",
      field = "",
      level = "",
      language = "",
      maxBudget = 0,
      withScholarship = false,
    } = params

    let query = supabase.from("programs").select("*", { count: "exact" })

    // Apply filters if they are provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,university.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (country) {
      query = query.eq("country", country)
    }

    if (field) {
      // Use a safer approach: apply field filter using textSearch or separate conditions
      const sanitizedField = field.replace(/[^\w\s]/g, "") // Remove special characters except spaces
      query = query.textSearch("field", sanitizedField, {
        type: "websearch",
        config: "english",
      })
    }

    if (level) {
      query = query.eq("study_level", level)
    }

    if (language) {
      query = query.or(`program_language.ilike.%${language}%,secondary_language.ilike.%${language}%`)
    }

    if (maxBudget > 0) {
      query = query.lte("tuition_min", maxBudget)
    }

    if (withScholarship) {
      query = query.eq("scholarship_available", true)
    }

    return query
  }
}

