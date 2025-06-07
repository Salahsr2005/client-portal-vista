
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, ChatRoom } from '@/types/Chat';

export const useClientAdminChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Load chat rooms for the current user
  const loadChatRooms = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data: userChats, error } = await supabase
        .rpc('get_user_chats', {
          p_user_id: user.id,
          p_user_type: 'Client'
        });

      if (error) throw error;

      const formattedChats: ChatRoom[] = userChats?.map((chat: any) => ({
        id: chat.chat_id,
        title: chat.title || 'Support Chat',
        client_id: user.id,
        admin_id: chat.participants?.find((p: any) => p.participant_type === 'Admin')?.participant_id || '',
        last_message: chat.last_message_text,
        last_message_time: chat.last_message_time ? new Date(chat.last_message_time) : undefined,
        unread_count: chat.unread_count || 0,
        is_active: true,
        client_name: user.user_metadata?.first_name || 'Client',
        admin_name: chat.participants?.find((p: any) => p.participant_type === 'Admin')?.display_name || 'Support Team',
        created_at: new Date()
      })) || [];

      setChatRooms(formattedChats);
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

  // Load messages for a specific chat
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
          name: msg.sender_type === 'Admin' ? 'Support Team' : 'You'
        },
        timestamp: new Date(msg.sent_at),
        status: 'delivered' as const,
        chat_id: chatId
      })) || [];

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  // Create a new chat with an admin
  const createChatWithAdmin = useCallback(async () => {
    if (!user) return null;

    try {
      setIsLoading(true);
      
      // Get available admin (in a real app, you'd have logic to assign the right admin)
      const { data: admins, error: adminError } = await supabase
        .from('admin_users')
        .select('admin_id, first_name, last_name')
        .eq('status', 'Active')
        .limit(1);

      if (adminError) throw adminError;
      if (!admins || admins.length === 0) {
        toast({
          title: 'No Available Admins',
          description: 'Please try again later',
          variant: 'destructive'
        });
        return null;
      }

      const admin = admins[0];
      
      // Create new chat using the existing function
      const { data: chatId, error: chatError } = await supabase
        .rpc('create_client_admin_chat', {
          p_client_id: user.id,
          p_admin_id: admin.admin_id,
          p_title: `Chat with ${user.user_metadata?.first_name || 'Client'}`
        });

      if (chatError) throw chatError;

      // Reload chat rooms to include the new one
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

  // Send a message
  const sendMessage = useCallback(async (text: string, chatId: string) => {
    if (!user || !text.trim()) return;

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
    }
  }, [user, toast]);

  // Mark messages as read
  const markAsRead = useCallback(async (chatId: string) => {
    if (!user) return;

    try {
      await supabase.rpc('mark_messages_as_read', {
        p_chat_id: chatId,
        p_participant_id: user.id,
        p_participant_type: 'Client'
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [user]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMessage = payload.new as any;
          
          // Only add if it's for the active chat and not from current user
          if (activeChat === newMessage.chat_id && newMessage.sender_id !== user.id) {
            const message: ChatMessage = {
              id: newMessage.message_id,
              text: newMessage.message_text,
              sender: {
                id: newMessage.sender_id,
                type: newMessage.sender_type.toLowerCase() as 'client' | 'admin',
                name: newMessage.sender_type === 'Admin' ? 'Support Team' : 'Client'
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
          table: 'chats',
        },
        () => {
          // Reload chat rooms when any chat is updated
          loadChatRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeChat, loadChatRooms]);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadChatRooms();
    }
  }, [user, loadChatRooms]);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat);
      markAsRead(activeChat);
    }
  }, [activeChat, loadMessages, markAsRead]);

  return {
    chatRooms,
    activeChat,
    setActiveChat,
    messages,
    isLoading,
    isTyping,
    onlineUsers,
    sendMessage,
    createChatWithAdmin,
    markAsRead,
    loadChatRooms
  };
};
