
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useMessages = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["messages", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        return [];
      }

      // Get messages where user is either the sender or recipient
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
        .order("sent_at", { ascending: false });
      
      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        throw new Error(messagesError.message);
      }
      
      return messagesData.map(message => ({
        id: message.message_id,
        subject: message.subject || "No Subject",
        content: message.content || "",
        sentAt: new Date(message.sent_at).toLocaleString(),
        isRead: message.is_read,
        isIncoming: message.recipient_id === user.id,
        senderType: message.sender_type || "Admin",
        senderId: message.sender_id,
        recipientType: message.recipient_type || "Client",
        recipientId: message.recipient_id,
      }));
    },
  });
};
