
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { handleSupabaseError } from "@/utils/databaseHelpers";

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get favorite programs
  const { data, isLoading, error } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("favorite_programs")
        .select("program_id, programs(*)")
        .eq("user_id", user.id);

      if (error) {
        const formattedError = handleSupabaseError(error);
        throw new Error(formattedError?.message || "Failed to fetch favorites");
      }

      return data;
    },
    enabled: !!user,
  });

  // Add a program to favorites
  const addFavoriteMutation = useMutation({
    mutationFn: async (programId: string) => {
      if (!user) throw new Error("User must be logged in");

      const { data, error } = await supabase
        .from("favorite_programs")
        .insert({
          user_id: user.id,
          program_id: programId,
        })
        .select();

      if (error) {
        const formattedError = handleSupabaseError(error);
        throw new Error(formattedError?.message || "Failed to add favorite");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
      toast({
        title: "Success",
        description: "Program added to favorites",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add favorite",
        variant: "destructive",
      });
    },
  });

  // Remove a program from favorites
  const removeFavoriteMutation = useMutation({
    mutationFn: async (programId: string) => {
      if (!user) throw new Error("User must be logged in");

      const { data, error } = await supabase
        .from("favorite_programs")
        .delete()
        .eq("user_id", user.id)
        .eq("program_id", programId);

      if (error) {
        const formattedError = handleSupabaseError(error);
        throw new Error(formattedError?.message || "Failed to remove favorite");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
      toast({
        title: "Success",
        description: "Program removed from favorites",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove favorite",
        variant: "destructive",
      });
    },
  });

  // Check if a program is favorited
  const isFavorite = (programId: string) => {
    return data?.some((fav) => fav.program_id === programId) || false;
  };

  return {
    favorites: data || [],
    isLoading,
    error,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isFavorite,
  };
};
