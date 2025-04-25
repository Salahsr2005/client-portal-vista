
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateApplicationData {
  programId: string;
  priority: "Low" | "Medium" | "High";
  notes?: string;
}

export const useCreateApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateApplicationData) => {
      if (!user) throw new Error("User not authenticated");

      const { data: application, error } = await supabase
        .from("applications")
        .insert({
          client_id: user.id,
          program_id: data.programId,
          priority: data.priority,
          notes: data.notes,
          status: "Draft"
        })
        .select()
        .single();

      if (error) throw error;
      return application;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
