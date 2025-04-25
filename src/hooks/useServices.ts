
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) {
        console.error("Error fetching services:", error);
        throw new Error(error.message);
      }
      
      return data.map(service => ({
        id: service.service_id,
        name: service.name,
        description: service.description || "",
        duration: service.estimated_completion || `${service.duration} min`,
        fee: service.price ? `$${service.price}` : "Contact for details",
        isActive: service.status === "Active"
      }));
    },
  });
};
