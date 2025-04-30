
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

      const { data, error } = await supabase
        .from("user_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }) as { data: UserNotification[] | null, error: any };
      
      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      
      return data as UserNotification[];
    },
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("user_notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", user?.id) as { error: any };
      
      if (error) throw error;
      return notificationId;
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
      
      const { error } = await supabase
        .from("user_notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false) as { error: any };
      
      if (error) throw error;
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
