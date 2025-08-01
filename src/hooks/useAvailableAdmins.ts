
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Admin {
  admin_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  photo_url: string;
  status: string;
  last_active?: string;
  isOnline: boolean;
}

export const useAvailableAdmins = () => {
  const query = useQuery({
    queryKey: ["availableAdmins"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_available_admins');
        
        if (error) {
          console.error('Error fetching available admins:', error);
          throw error;
        }

        const admins: Admin[] = (data || []).map((admin: any) => ({
          admin_id: admin.admin_id,
          first_name: admin.first_name || 'Support',
          last_name: admin.last_name || 'Team',
          full_name: admin.full_name || 'Support Team',
          photo_url: admin.photo_url || '/placeholder.svg',
          status: admin.status,
          last_active: admin.last_active,
          isOnline: admin.last_active ? 
            new Date(admin.last_active) > new Date(Date.now() - 5 * 60 * 1000) : 
            false
        }));

        console.log('Available admins:', admins);
        return admins;
      } catch (error) {
        console.error('Failed to fetch available admins:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds to update online status
    retry: 3,
    retryDelay: 1000,
  });

  return {
    admins: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
};
