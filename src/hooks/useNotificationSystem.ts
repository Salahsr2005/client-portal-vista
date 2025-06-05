
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

  // Fetch notifications with proper user context
  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    enabled: !!user,
    queryFn: async () => {
      try {
        console.log("Fetching notifications for user:", user?.id);
        
        const { data, error } = await supabase
          .from('user_notifications')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) {
          console.error('Error fetching notifications:', error);
          throw error;
        }
        
        console.log("Fetched notifications:", data);
        return data as Notification[];
      } catch (error) {
        console.error('Error in notification query:', error);
        return [];
      }
    },
  });

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user?.id) return;

    console.log("Setting up notification subscription for user:", user.id);

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
          console.log("New notification received:", payload);
          
          // Show toast notification with enhanced styling
          toast({
            title: payload.new.title,
            description: payload.new.content,
            className: "bg-gradient-to-r from-violet-600 to-purple-700 text-white border-0 shadow-xl",
            duration: 5000,
          });
          
          // Invalidate and refetch notifications
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    setSubscription(channel);

    return () => {
      console.log("Cleaning up notification subscription");
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id, toast, queryClient]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      console.log("Marking notification as read:", notificationId);
      
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id); // Ensure user can only modify their notifications
        
      if (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
      
      // Refetch notifications to update the UI
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
      console.log("Marking all notifications as read for user:", user?.id);
      
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);
        
      if (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
      }
      
      // Show success toast
      toast({
        title: "All notifications marked as read",
        description: "Your notification list has been cleared.",
        className: "bg-gradient-to-r from-green-600 to-emerald-700 text-white border-0",
      });
      
      // Refetch notifications
      refetch();
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  };

  // Create a notification (for testing or manual creation)
  const createNotification = async (title: string, content: string, type: string, metadata?: any) => {
    try {
      console.log("Creating notification:", { title, content, type, metadata });
      
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
        
      if (error) {
        console.error('Error creating notification:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    refetch
  };
};

export default useNotificationSystem;
