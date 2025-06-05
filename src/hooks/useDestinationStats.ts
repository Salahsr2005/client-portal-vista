
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DestinationStats {
  country: string;
  total_programs: number;
  avg_tuition: number;
  avg_success_rate: number;
  popularity_score: number;
  trending_score: number;
  total_applications: number;
}

export const useDestinationStats = () => {
  return useQuery({
    queryKey: ["destination-stats"],
    queryFn: async () => {
      console.log("Fetching destination statistics...");
      
      const { data, error } = await supabase.rpc('get_destination_statistics');
      
      if (error) {
        console.error("Error fetching destination statistics:", error);
        throw new Error(error.message);
      }
      
      console.log("Fetched destination statistics:", data);
      return data as DestinationStats[];
    },
  });
};
