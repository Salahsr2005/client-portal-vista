
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleSupabaseError } from "@/utils/databaseHelpers";

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addToFavorites = useMutation({
    mutationFn: async (programId: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('favorite_programs')
        .insert({
          user_id: user.id,
          program_id: programId
        })
        .select();
        
      if (error) {
        handleSupabaseError(error, toast);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-programs"] });
      toast({
        title: "Added to favorites",
        description: "Program added to your favorites",
      });
    },
    onError: (error) => {
      console.error("Error adding to favorites:", error);
      toast({
        title: "Error",
        description: "Failed to add to favorites. Please try again.",
        variant: "destructive",
      });
    }
  });

  const removeFromFavorites = useMutation({
    mutationFn: async (programId: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('favorite_programs')
        .delete()
        .eq('user_id', user.id)
        .eq('program_id', programId);
        
      if (error) {
        handleSupabaseError(error, toast);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-programs"] });
      toast({
        title: "Removed from favorites",
        description: "Program removed from your favorites",
      });
    },
    onError: (error) => {
      console.error("Error removing from favorites:", error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    addToFavorites,
    removeFromFavorites,
  };
};
