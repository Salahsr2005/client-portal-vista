
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Admin } from '@/hooks/useAvailableAdmins';

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    type: 'client' | 'admin';
  };
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export const useRealtimeChat = (selectedAdmin?: Admin) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  // Create or get existing chat
  const initializeChat = useCallback(async () => {
    if (!user || !selectedAdmin) return;

    try {
      setIsLoading(true);
      const { data: chatId, error } = await supabase.rpc('create_client_admin_chat', {
        p_client_id: user.id,
        p_admin_id: selectedAdmin.admin_id,
        p_title: `Chat with ${selectedAdmin.full_name}`
      });

      if (error) throw error;
      setChatId(chatId);
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedAdmin]);

  // Load messages
  const loadMessages = useCallback(async () => {
    if (!chatId) return;

    try {
      const { data, error } = await supabase.rpc('get_chat_messages', {
        p_chat_id: chatId,
        p_limit: 100
      });

      if (error) throw error;

      const formattedMessages: ChatMessage[] = (data || []).map((msg: any) => ({
        id: msg.message_id,
        text: msg.message_text,
        timestamp: new Date(msg.sent_at),
        sender: {
          id: msg.sender_id,
          name: msg.sender_type === 'Admin' ? selectedAdmin?.full_name || 'Admin' : 'You',
          type: msg.sender_type === 'Admin' ? 'admin' : 'client'
        }
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [chatId, selectedAdmin]);

  // Send message
  const sendMessage = useCallback(async (text: string) => {
    if (!chatId || !user || !text.trim()) return;

    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      text,
      timestamp: new Date(),
      sender: {
        id: user.id,
        name: 'You',
        type: 'client'
      },
      status: 'sending'
    };

    setMessages(prev => [...prev, tempMessage]);
    setIsSending(true);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          message_text: text
        });

      if (error) throw error;

      // Remove temp message - real message will come through real-time
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    } finally {
      setIsSending(false);
    }
  }, [chatId, user]);

  // Initialize chat when admin is selected
  useEffect(() => {
    if (selectedAdmin) {
      initializeChat();
    }
  }, [selectedAdmin, initializeChat]);

  // Load messages when chat is initialized
  useEffect(() => {
    if (chatId) {
      loadMessages();
    }
  }, [chatId, loadMessages]);

  // Set up real-time subscription
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const newMessage = payload.new as any;
          const message: ChatMessage = {
            id: newMessage.message_id,
            text: newMessage.message_text,
            timestamp: new Date(newMessage.sent_at),
            sender: {
              id: newMessage.sender_id,
              name: newMessage.sender_id === user?.id ? 'You' : selectedAdmin?.full_name || 'Admin',
              type: newMessage.sender_id === user?.id ? 'client' : 'admin'
            }
          };

          setMessages(prev => [...prev, message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, user, selectedAdmin]);

  return {
    messages,
    isLoading,
    isSending,
    sendMessage
  };
};
