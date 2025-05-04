
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export interface UserNotification {
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
        // Use a generic approach with type casting since the table might not be in the type definitions yet
        const { data, error } = await supabase
          .from("user_notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching notifications:", error);
          throw error;
        }
        
        return (data || []) as UserNotification[];
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
        const { error } = await supabase
          .from("user_notifications")
          .update({ is_read: true })
          .eq("id", notificationId)
          .eq("user_id", user?.id);
        
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
        const { error } = await supabase
          .from("user_notifications")
          .update({ is_read: true })
          .eq("user_id", user.id)
          .eq("is_read", false);
        
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

  const deleteNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from("user_notifications")
          .delete()
          .eq("id", notificationId)
          .eq("user_id", user.id);
        
        if (error) throw error;
        return notificationId;
      } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
    },
    onSuccess: (notificationId) => {
      queryClient.setQueryData(
        ["notifications", user?.id],
        (old: UserNotification[] | undefined) =>
          old?.filter(n => n.id !== notificationId)
      );
      
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Could not delete notification",
        variant: "destructive",
      });
    }
  });

  const deleteAllNotifications = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from("user_notifications")
          .delete()
          .eq("user_id", user.id);
        
        if (error) throw error;
      } catch (error) {
        console.error("Error deleting all notifications:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ["notifications", user?.id],
        []
      );
      
      toast({
        title: "Success",
        description: "All notifications deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting all notifications:", error);
      toast({
        title: "Error",
        description: "Could not delete notifications",
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
    markAllAsRead: () => markAllAsRead.mutate(),
    deleteNotification: (id: string) => deleteNotification.mutate(id),
    deleteAllNotifications: () => deleteAllNotifications.mutate(),
  };
};
