
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/Chat';
import { Admin } from '@/hooks/useAvailableAdmins';

export const useRealtimeChat = (selectedAdmin: Admin | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const channelRef = useRef<any>(null);

  // Create or get existing chat with selected admin
  const createChat = useCallback(async (admin: Admin) => {
    if (!user) return null;

    try {
      setIsLoading(true);
      const { data: chatId, error } = await supabase.rpc('create_client_admin_chat', {
        p_client_id: user.id,
        p_admin_id: admin.admin_id,
        p_title: `Chat with ${admin.full_name}`
      });

      if (error) throw error;
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
  }, [user, toast]);

  // Load chat messages
  const loadMessages = useCallback(async (chatId: string) => {
    try {
      const { data: chatMessages, error } = await supabase
        .rpc('get_chat_messages', {
          p_chat_id: chatId,
          p_limit: 50
        });

      if (error) throw error;

      const formattedMessages: ChatMessage[] = chatMessages?.reverse().map((msg: any) => ({
        id: msg.message_id,
        text: msg.message_text,
        sender: {
          id: msg.sender_id,
          type: msg.sender_type.toLowerCase() as 'client' | 'admin',
          name: msg.sender_type === 'Admin' ? selectedAdmin?.full_name || 'Support Team' : 'You'
        },
        timestamp: new Date(msg.sent_at),
        status: 'delivered' as const,
        chat_id: chatId
      })) || [];

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [selectedAdmin]);

  // Send message
  const sendMessage = useCallback(async (text: string) => {
    if (!user || !chatId || !text.trim()) return;

    const tempMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: {
        id: user.id,
        type: 'client',
        name: 'You'
      },
      timestamp: new Date(),
      status: 'sending',
      chat_id: chatId
    };

    // Optimistically add message
    setMessages(prev => [...prev, tempMessage]);
    setIsSending(true);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          sender_type: 'Client',
          message_text: text
        });

      if (error) throw error;

      // Update message status
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id 
          ? { ...msg, status: 'sent' as const }
          : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  }, [user, chatId, toast]);

  // Initialize chat when admin is selected
  useEffect(() => {
    if (selectedAdmin && user) {
      const initChat = async () => {
        const newChatId = await createChat(selectedAdmin);
        if (newChatId) {
          setChatId(newChatId);
          await loadMessages(newChatId);
        }
      };
      initChat();
    } else {
      setChatId(null);
      setMessages([]);
    }
  }, [selectedAdmin, user, createChat, loadMessages]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!chatId || !user) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

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
          
          // Only add if not from current user (to avoid duplicates)
          if (newMessage.sender_id !== user.id) {
            const message: ChatMessage = {
              id: newMessage.message_id,
              text: newMessage.message_text,
              sender: {
                id: newMessage.sender_id,
                type: newMessage.sender_type.toLowerCase() as 'client' | 'admin',
                name: newMessage.sender_type === 'Admin' ? selectedAdmin?.full_name || 'Support Team' : 'Client'
              },
              timestamp: new Date(newMessage.sent_at),
              status: 'delivered',
              chat_id: newMessage.chat_id
            };

            setMessages(prev => [...prev, message]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const updatedMessage = payload.new as any;
          setMessages(prev => prev.map(msg => 
            msg.id === updatedMessage.message_id 
              ? { ...msg, status: updatedMessage.status.toLowerCase() as any }
              : msg
          ));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [chatId, user, selectedAdmin]);

  return {
    messages,
    isLoading,
    isSending,
    isTyping,
    sendMessage,
    chatId
  };
};
