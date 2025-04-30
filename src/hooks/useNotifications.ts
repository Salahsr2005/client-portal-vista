
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface UserNotification {
  id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
  metadata: Record<string, any>;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      try {
        // Using rpc function instead of direct table access
        const { data, error } = await supabase
          .rpc('get_user_notifications', { p_user_id: user.id });
        
        if (error) {
          console.error("Error fetching notifications:", error);
          throw error;
        }
        
        return data as UserNotification[];
      } catch (error) {
        console.error("Error in notification query:", error);
        return [];
      }
    },
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        // Using rpc function instead of direct table access
        const { error } = await supabase
          .rpc('mark_notification_as_read', { 
            p_notification_id: notificationId,
            p_user_id: user?.id
          });
        
        if (error) throw error;
        return notificationId;
      } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
      }
    },
    onSuccess: (notificationId) => {
      queryClient.setQueryData(
        ["notifications", user?.id],
        (old: UserNotification[] | undefined) =>
          old?.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Could not mark notification as read",
        variant: "destructive",
      });
    }
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      try {
        // Using rpc function instead of direct table access
        const { error } = await supabase
          .rpc('mark_all_notifications_as_read', { p_user_id: user.id });
        
        if (error) throw error;
      } catch (error) {
        console.error("Error marking all as read:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ["notifications", user?.id],
        (old: UserNotification[] | undefined) =>
          old?.map(n => ({ ...n, is_read: true }))
      );
    },
    onError: (error) => {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Could not mark all notifications as read",
        variant: "destructive",
      });
    }
  });

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:user_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Handle new notification
          const newNotification = payload.new as UserNotification;
          
          // Update cache
          queryClient.setQueryData(
            ["notifications", user.id],
            (old: UserNotification[] | undefined) => 
              [newNotification, ...(old || [])]
          );
          
          // Show toast notification
          toast({
            title: newNotification.title,
            description: newNotification.content,
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead: (id: string) => markAsRead.mutate(id),
    markAllAsRead: () => markAllAsRead.mutate()
  };
};
