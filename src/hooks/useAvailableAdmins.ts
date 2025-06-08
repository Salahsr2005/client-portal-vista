
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Admin {
  admin_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  photo_url: string;
  status: string;
  last_active: string | null;
  isOnline?: boolean;
}

export const useAvailableAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase.rpc('get_available_admins');
      
      if (error) throw error;

      const adminsWithOnlineStatus = data?.map((admin: any) => ({
        ...admin,
        isOnline: admin.last_active && 
          new Date(admin.last_active) > new Date(Date.now() - 5 * 60 * 1000) // 5 minutes
      })) || [];

      setAdmins(adminsWithOnlineStatus);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: 'Error',
        description: 'Failed to load available advisors',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    
    // Refresh admin list every minute
    const interval = setInterval(fetchAdmins, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { admins, isLoading, refetch: fetchAdmins };
};
