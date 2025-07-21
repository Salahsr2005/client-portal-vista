
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

      // Get user's chats first
      const { data: chatsData, error: chatsError } = await supabase.rpc('get_user_chats', {
        p_user_id: user.id,
        p_user_type: 'Client'
      });
      
      if (chatsError) {
        console.error("Error fetching chats:", chatsError);
        throw new Error(chatsError.message);
      }

      // If no chats, return empty array
      if (!chatsData || chatsData.length === 0) {
        return [];
      }

      // Get messages from all chats
      const allMessages = [];
      for (const chat of chatsData) {
        const { data: messagesData, error: messagesError } = await supabase.rpc('get_chat_messages', {
          p_chat_id: chat.chat_id,
          p_limit: 50
        });

        if (messagesError) {
          console.error("Error fetching messages for chat:", chat.chat_id, messagesError);
          continue;
        }

        if (messagesData && messagesData.length > 0) {
          const formattedMessages = messagesData.map(message => ({
            id: message.message_id,
            subject: `Chat: ${chat.title || 'Support Chat'}`,
            content: message.message_text || "",
            sentAt: new Date(message.sent_at).toLocaleString(),
            isRead: true, // We'll mark all as read for now
            isIncoming: message.sender_id !== user.id,
            senderType: message.sender_type === 'Admin' ? 'Admin' : 'Client',
            senderId: message.sender_id,
            recipientType: "Client",
            recipientId: user.id,
            chatId: chat.chat_id
          }));
          
          allMessages.push(...formattedMessages);
        }
      }
      
      // Sort by date, newest first
      return allMessages.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    },
  });
};
