
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

      // Chat messages are stored in chat_messages table
      const { data: messagesData, error: messagesError } = await supabase
        .from("chat_messages")
        .select("*")
        .or(`chat_id.in.(
          select chat_id from chat_participants
          where participant_id='${user.id}' and participant_type='Client'
        )`)
        .order("sent_at", { ascending: false });
      
      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        throw new Error(messagesError.message);
      }
      
      return (messagesData || []).map(message => ({
        id: message.message_id,
        subject: "Chat Message",
        content: message.message_text || "",
        sentAt: new Date(message.sent_at).toLocaleString(),
        isRead: true,
        isIncoming: message.sender_id !== user.id,
        senderType: "System",
        senderId: message.sender_id,
        recipientType: "Client",
        recipientId: user.id,
      }));
    },
  });
};
