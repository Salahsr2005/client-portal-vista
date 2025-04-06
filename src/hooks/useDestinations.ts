
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDestinations = () => {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("country", { ascending: true });
      
      if (error) {
        console.error("Error fetching destinations:", error);
        throw new Error(error.message);
      }
      
      return data.map(destination => ({
        id: destination.destination_id,
        name: destination.country || destination.name,
        description: destination.description || "",
        image: destination.image_url || `/images/destination-${Math.floor(Math.random() * 6) + 1}.jpg`,
        requirements: destination.visa_requirements || "",
        isActive: destination.status === "Active",
        popularPrograms: [],
      }));
    },
  });
};
