
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useNotifications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        return [];
      }

      const { data: notificationsData, error: notificationsError } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_count", 1) // Just as a filter example, we should update this
        .order("created_at", { ascending: false });
      
      if (notificationsError) {
        console.error("Error fetching notifications:", notificationsError);
        throw new Error(notificationsError.message);
      }
      
      return notificationsData.map(notification => ({
        id: notification.notification_id,
        title: notification.title || "Notification",
        message: notification.content || "",
        type: notification.type || "info",
        isRead: false, // We'll need a recipients table to track read status
        createdAt: new Date(notification.created_at).toLocaleString(),
      }));
    },
  });
};
