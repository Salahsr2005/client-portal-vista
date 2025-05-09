
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
  is_read: boolean;
  metadata?: any;
}

export const useNotificationSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [subscription, setSubscription] = useState<any>(null);

  // Fetch notifications
  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    enabled: !!user,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_notifications')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data as Notification[];
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
    },
  });

  // Set up real-time subscription to listen for new notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user_notifications_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}` 
        }, 
        (payload) => {
          // Show a toast notification
          toast({
            title: payload.new.title,
            description: payload.new.content,
            variant: "default",
            className: "bg-gradient-to-r from-violet-600 to-purple-700 text-white border-0",
          });
          
          // Refetch notifications
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
        }
      )
      .subscribe();

    setSubscription(channel);

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, toast, queryClient]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      
      // Refetch notifications
      refetch();
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);
        
      if (error) throw error;
      
      // Refetch notifications
      refetch();
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  };

  // Create a notification (usually called from the backend, but can be used for testing)
  const createNotification = async (title: string, content: string, type: string, metadata?: any) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .insert({
          user_id: user?.id,
          title,
          content,
          type,
          metadata,
          is_read: false
        });
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  };

  return {
    notifications,
    isLoading,
    unreadCount: notifications.filter(n => !n.is_read).length,
    markAsRead,
    markAllAsRead,
    createNotification,
    refetch
  };
};

export default useNotificationSystem;
