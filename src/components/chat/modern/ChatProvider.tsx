
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  text: string;
  sender_id: string;
  sender_type: 'Client' | 'Admin';
  sent_at: string;
  chat_id: string;
  is_edited?: boolean;
  edited_at?: string;
}

interface ChatRoom {
  id: string;
  title: string;
  last_message_text?: string;
  last_message_time?: string;
  unread_count: number;
  participants: Array<{
    participant_id: string;
    participant_type: string;
    display_name: string;
  }>;
}

interface ChatContextType {
  chatRooms: ChatRoom[];
  messages: ChatMessage[];
  activeChat: string | null;
  isLoading: boolean;
  isSending: boolean;
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (text: string) => Promise<void>;
  createChat: (adminId: string) => Promise<string | null>;
  loadChatRooms: () => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadChatRooms = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('get_user_chats', {
        p_user_id: user.id,
        p_user_type: 'Client'
      });

      if (error) throw error;

      const formattedRooms: ChatRoom[] = (data || []).map((room: any) => ({
        id: room.chat_id,
        title: room.title,
        last_message_text: room.last_message_text,
        last_message_time: room.last_message_time,
        unread_count: room.unread_count || 0,
        participants: room.participants || []
      }));

      setChatRooms(formattedRooms);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat rooms',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const loadMessages = useCallback(async (chatId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_chat_messages', {
        p_chat_id: chatId,
        p_limit: 100
      });

      if (error) throw error;

      const formattedMessages: ChatMessage[] = (data || []).map((msg: any) => ({
        id: msg.message_id,
        text: msg.message_text,
        sender_id: msg.sender_id,
        sender_type: msg.sender_type,
        sent_at: msg.sent_at,
        chat_id: chatId
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!user || !activeChat || !text.trim()) return;

    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      text,
      sender_id: user.id,
      sender_type: 'Client',
      sent_at: new Date().toISOString(),
      chat_id: activeChat
    };

    setMessages(prev => [...prev, tempMessage]);
    setIsSending(true);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: activeChat,
          sender_id: user.id,
          sender_type: 'Client',
          message_text: text
        });

      if (error) throw error;

      // Remove temp message - real message will come through real-time
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  }, [user, activeChat, toast]);

  const createChat = useCallback(async (adminId: string) => {
    if (!user) return null;

    try {
      setIsLoading(true);
      const { data: chatId, error } = await supabase.rpc('create_client_admin_chat', {
        p_client_id: user.id,
        p_admin_id: adminId,
        p_title: 'Support Chat'
      });

      if (error) throw error;

      await loadChatRooms();
      return chatId;
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to create chat',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, loadChatRooms]);

  const markAsRead = useCallback(async (chatId: string) => {
    if (!user) return;

    try {
      await supabase.rpc('mark_messages_as_read', {
        p_chat_id: chatId,
        p_participant_id: user.id,
        p_participant_type: 'Client'
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, [user]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          const newMessage = payload.new as any;
          
          if (activeChat === newMessage.chat_id) {
            const message: ChatMessage = {
              id: newMessage.message_id,
              text: newMessage.message_text,
              sender_id: newMessage.sender_id,
              sender_type: newMessage.sender_type,
              sent_at: newMessage.sent_at,
              chat_id: newMessage.chat_id
            };

            setMessages(prev => [...prev, message]);
          }

          // Refresh chat rooms to update last message
          loadChatRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeChat, loadChatRooms]);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat);
      markAsRead(activeChat);
    } else {
      setMessages([]);
    }
  }, [activeChat, loadMessages, markAsRead]);

  // Load initial chat rooms
  useEffect(() => {
    if (user) {
      loadChatRooms();
    }
  }, [user, loadChatRooms]);

  const value: ChatContextType = {
    chatRooms,
    messages,
    activeChat,
    isLoading,
    isSending,
    setActiveChat,
    sendMessage,
    createChat,
    loadChatRooms,
    markAsRead
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
