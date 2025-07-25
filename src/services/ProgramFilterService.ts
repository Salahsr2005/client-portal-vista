
import { supabase } from "@/integrations/supabase/client";
import { ProgramsQueryParams } from '@/hooks/usePrograms';

export class ProgramFilterService {
  static buildQuery(params: ProgramsQueryParams) {
    const {
      search = '',
      country = '',
      field = '',
      level = '',
      language = '',
      maxBudget = 0,
      withScholarship = false
    } = params;

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

    return query;
  }

  static applyPagination(query: any, page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    return query
      .range(from, to)
      .order('ranking', { ascending: true })
      .order('name', { ascending: true });
  }
}
