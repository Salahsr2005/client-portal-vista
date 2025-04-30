
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ConsultationType {
  id: string;
  name: string;
  description?: string;
}

export const useConsultationTypes = () => {
  return useQuery({
    queryKey: ["consultation-types"],
    queryFn: async () => {
      // This could come from a database table in the future
      // For now returning static types
      return [
        { 
          id: "academic", 
          name: "Academic Consultation", 
          description: "Get advice on program selection, academic requirements, and study plans" 
        },
        { 
          id: "visa", 
          name: "Visa & Immigration", 
          description: "Consultation on visa requirements, application process, and documentation" 
        },
        { 
          id: "financial", 
          name: "Financial Planning", 
          description: "Guidance on tuition fees, living expenses, scholarships, and financial aid" 
        },
        { 
          id: "career", 
          name: "Career Guidance", 
          description: "Advice on career paths, job prospects, and professional development" 
        },
        { 
          id: "accommodation", 
          name: "Accommodation", 
          description: "Help with finding suitable housing options and understanding rental agreements" 
        },
        { 
          id: "cultural", 
          name: "Cultural Integration", 
          description: "Tips on adapting to a new culture, language resources, and local customs" 
        }
      ] as ConsultationType[];
    }
  });
};
