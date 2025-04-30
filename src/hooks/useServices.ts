
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  estimated_completion: string;
  status: string;
}

export interface ServiceApplication {
  id: string;
  service_id: string;
  user_id: string;
  status: string;
  created_at: string;
  notes?: string;
  payment_status: string;
  payment_id?: string;
}

export const useServices = () => {
  const { toast } = useToast();
  
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
        id: service.service_id || service.id,
        name: service.name,
        description: service.description || "",
        category: service.category || "General",
        duration: service.duration,
        price: service.price,
        estimated_completion: service.estimated_completion || `${service.duration} min`,
        status: service.status || "Active"
      })) as Service[];
    },
  });
};

export const useServiceApplications = (userId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["service-applications", userId || user?.id],
    enabled: !!userId || !!user,
    queryFn: async () => {
      const id = userId || user?.id;
      if (!id) return [];
      
      const { data, error } = await supabase
        .from("service_applications")
        .select(`
          *,
          services (*)
        `)
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching service applications:", error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useApplyForService = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      serviceId, 
      notes 
    }: { 
      serviceId: string, 
      notes?: string 
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("service_applications")
        .insert({
          service_id: serviceId,
          user_id: user.id,
          status: "Pending",
          notes,
          payment_status: "Pending"
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error submitting service application:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service-applications", user?.id],
      });
      
      toast({
        title: "Application Submitted",
        description: "Your service application has been submitted successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit service application. Please try again.",
        variant: "destructive",
      });
    }
  });
};
