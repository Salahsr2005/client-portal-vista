
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { handleSupabaseError } from "@/utils/databaseHelpers";

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from("favorite_programs")
          .select("program_id")
          .eq("user_id", user.id);
          
        if (error) throw error;
        
        return (data || []).map(fav => fav.program_id);
      } catch (error) {
        handleSupabaseError(error, toast, "Failed to load favorites");
        return [];
      }
    },
    enabled: !!user
  });

  const addFavorite = useMutation({
    mutationFn: async (programId: string) => {
      if (!user) throw new Error("User is not authenticated");
      
      const { error } = await supabase
        .from("favorite_programs")
        .insert({
          user_id: user.id,
          program_id: programId
        });
      
      if (error) throw error;
      return programId;
    },
    onSuccess: (programId) => {
      queryClient.setQueryData(
        ["favorites", user?.id],
        (old: string[] | undefined) => [...(old || []), programId]
      );
      toast({
        title: "Added to favorites",
        description: "Program has been added to your favorites",
      });
    },
    onError: (error) => {
      handleSupabaseError(error, toast, "Failed to add to favorites");
    }
  });

  const removeFavorite = useMutation({
    mutationFn: async (programId: string) => {
      if (!user) throw new Error("User is not authenticated");
      
      const { error } = await supabase
        .from("favorite_programs")
        .delete()
        .eq("user_id", user.id)
        .eq("program_id", programId);
      
      if (error) throw error;
      return programId;
    },
    onSuccess: (programId) => {
      queryClient.setQueryData(
        ["favorites", user?.id],
        (old: string[] | undefined) => (old || []).filter(id => id !== programId)
      );
      toast({
        title: "Removed from favorites",
        description: "Program has been removed from your favorites",
      });
    },
    onError: (error) => {
      handleSupabaseError(error, toast, "Failed to remove from favorites");
    }
  });

  const toggleFavorite = (programId: string) => {
    if (isFavorite(programId)) {
      removeFavorite.mutate(programId);
    } else {
      addFavorite.mutate(programId);
    }
  };

  const isFavorite = (programId: string) => {
    return favorites.includes(programId);
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    addFavorite: (id: string) => addFavorite.mutate(id),
    removeFavorite: (id: string) => removeFavorite.mutate(id),
  };
};
