
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("service_name", { ascending: true });
      
      if (error) {
        console.error("Error fetching services:", error);
        throw new Error(error.message);
      }
      
      return data.map(service => ({
        id: service.service_id,
        name: service.service_name,
        description: service.description || "",
        duration: service.estimated_duration || "Varies",
        fee: service.fee ? `$${service.fee}` : "Contact for details",
        isActive: service.is_active
      }));
    },
  });
};
