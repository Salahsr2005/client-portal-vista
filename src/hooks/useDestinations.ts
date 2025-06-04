
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDestinations = () => {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      console.log("Fetching destinations from Supabase...");
      
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("country", { ascending: true });
      
      if (error) {
        console.error("Error fetching destinations:", error);
        throw new Error(error.message);
      }
      
      console.log("Fetched destinations:", data);
      
      return data.map(destination => ({
        id: destination.destination_id,
        name: destination.name || destination.country,
        country: destination.country,
        region: destination.region || "Global",
        description: destination.description || "Explore educational opportunities in this destination.",
        image: destination.image_url || `/images/flags/${destination.country?.toLowerCase().replace(/\s+/g, '-')}.svg`,
        visaRequirements: destination.visa_requirements || "Visa requirements vary by nationality.",
        processingTime: destination.processing_time || "Processing time varies",
        fees: destination.fees || 0,
        successRate: destination.success_rate || 85,
        status: destination.status || "Active",
        isActive: destination.status === "Active",
        popularPrograms: [], // This would need a separate query to programs table
      }));
    },
  });
};
