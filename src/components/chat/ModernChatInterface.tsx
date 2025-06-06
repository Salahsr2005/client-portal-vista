
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import useMessageAccess from "@/hooks/useMessageAccess";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Search,
  MessageSquare,
  Bot,
  Users,
  Circle,
  CheckCheck,
  Clock,
  Mic,
  Image as ImageIcon,
  File,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    type: 'client' | 'admin' | 'ai';
  };
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  replyTo?: string;
}

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  type: 'admin' | 'ai';
  participants?: any[];
}

export default function ModernChatInterface() {
  const { user } = useAuth();
  const { toast } = useToast();
  const messageAccess = useMessageAccess();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chats
  useEffect(() => {
    if (!user || !messageAccess.canAccessMessages) return;

    initializeChats();
  }, [user, messageAccess]);

  const initializeChats = async () => {
    // Sample chats - in real implementation, fetch from Supabase
    const initialChats: Chat[] = [
      {
        id: 'ai-assistant',
        name: 'AI Assistant',
        avatar: '',
        lastMessage: 'How can I help you today?',
        lastMessageTime: new Date(),
        unreadCount: 0,
        isOnline: true,
        type: 'ai'
      }
    ];

    // Fetch admin chats from Supabase
    try {
      const { data: adminUsers } = await supabase
        .from('admin_users')
        .select('admin_id, first_name, last_name, photo_url, status')
        .eq('status', 'Active')
        .limit(5);

      if (adminUsers) {
        const adminChats: Chat[] = adminUsers.map(admin => ({
          id: admin.admin_id,
          name: `${admin.first_name} ${admin.last_name}`,
          avatar: admin.photo_url,
          lastMessage: 'Hello! How can I assist you?',
          lastMessageTime: new Date(Date.now() - Math.random() * 86400000),
          unreadCount: 0,
          isOnline: Math.random() > 0.5,
          type: 'admin' as const
        }));

        setChats([...initialChats, ...adminChats]);
      } else {
        setChats(initialChats);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      setChats(initialChats);
    }
  };

  // Realtime subscription for messages
  useEffect(() => {
    if (!selectedChat || !user) return;

    let channel: any;
    
    if (selectedChat.type === 'admin') {
      // Subscribe to realtime messages for admin chats
      channel = supabase
        .channel(`chat-${selectedChat.id}-${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${selectedChat.id}`
        }, (payload) => {
          const newMsg = payload.new as any;
          if (newMsg.sender_id !== user.id) {
            const message: Message = {
              id: newMsg.message_id,
              text: newMsg.message_text,
              sender: {
                id: newMsg.sender_id,
                name: selectedChat.name,
                avatar: selectedChat.avatar,
                type: 'admin'
              },
              timestamp: new Date(newMsg.sent_at),
              status: 'delivered',
              type: 'text'
            };
            setMessages(prev => [...prev, message]);
          }
        })
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [selectedChat, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    const messageId = `msg-${Date.now()}`;
    const message: Message = {
      id: messageId,
      text: newMessage,
      sender: {
        id: user.id,
        name: 'You',
        type: 'client'
      },
      timestamp: new Date(),
      status: 'sending',
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      if (selectedChat.type === 'ai') {
        // Handle AI chat
        await handleAIMessage(message);
      } else {
        // Handle admin chat
        await handleAdminMessage(message);
      }

      // Update message status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAIMessage = async (userMessage: Message) => {
    // Show typing indicator
    setIsTyping(true);

    try {
      // Call Groq API
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: data.response || "I'm here to help you with your study abroad journey!",
        sender: {
          id: 'ai-assistant',
          name: 'AI Assistant',
          type: 'ai'
        },
        timestamp: new Date(),
        status: 'delivered',
        type: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error with AI chat:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: `ai-${Date.now()}`,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact our support team for assistance.",
        sender: {
          id: 'ai-assistant',
          name: 'AI Assistant',
          type: 'ai'
        },
        timestamp: new Date(),
        status: 'delivered',
        type: 'text'
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAdminMessage = async (message: Message) => {
    if (!user) return;

    try {
      // Get or create chat with admin
      let chatId = selectedChat.id;
      
      // Check if chat exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select('chat_id')
        .eq('chat_id', chatId)
        .single();

      if (!existingChat) {
        // Create new chat
        const { data: newChatData } = await supabase
          .rpc('create_client_admin_chat', {
            p_client_id: user.id,
            p_admin_id: selectedChat.id,
            p_title: `Chat with ${selectedChat.name}`
          });

        chatId = newChatData;
      }

      // Send message
      await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          sender_type: 'Client',
          message_text: message.text,
          message_type: 'Text'
        });

    } catch (error) {
      console.error('Error sending admin message:', error);
      throw error;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const MessageStatus = ({ status }: { status: Message['status'] }) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-600" />;
      default:
        return null;
    }
  };

  if (!messageAccess.canAccessMessages) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Card className="p-8 text-center max-w-md">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Chat Access Required</h3>
          <p className="text-muted-foreground">
            Please complete your payment to access the chat feature.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-background rounded-lg border overflow-hidden">
      {/* Chat List Sidebar */}
      <AnimatePresence mode="wait">
        {(showChatList || !selectedChat) && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            className={cn(
              "w-80 border-r bg-card flex flex-col",
              "md:relative md:translate-x-0",
              !showChatList && selectedChat && "absolute md:relative z-10"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Messages</h2>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredChats.map((chat) => (
                  <motion.button
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setShowChatList(false);
                      // Load messages for this chat
                      setMessages([]);
                    }}
                    className={cn(
                      "w-full p-3 rounded-lg text-left hover:bg-accent transition-colors",
                      selectedChat?.id === chat.id && "bg-accent"
                    )}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback>
                            {chat.type === 'ai' ? (
                              <Bot className="h-5 w-5" />
                            ) : (
                              chat.name.split(' ').map(n => n[0]).join('')
                            )}
                          </AvatarFallback>
                        </Avatar>
                        {chat.isOnline && (
                          <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
                        )}
                        {chat.type === 'ai' && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-purple-500 rounded-full flex items-center justify-center">
                            <Bot className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{chat.name}</h3>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                      
                      {chat.unreadCount > 0 && (
                        <Badge variant="default" className="h-5 min-w-5 text-xs">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setShowChatList(true)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedChat.avatar} />
                      <AvatarFallback>
                        {selectedChat.type === 'ai' ? (
                          <Bot className="h-5 w-5" />
                        ) : (
                          selectedChat.name.split(' ').map(n => n[0]).join('')
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {selectedChat.isOnline && selectedChat.type !== 'ai' && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{selectedChat.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.type === 'ai' ? (
                        'AI Assistant • Always online'
                      ) : selectedChat.isOnline ? (
                        'Online now'
                      ) : (
                        'Last seen recently'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedChat.type === 'admin' && (
                    <>
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={cn(
                        "flex gap-3",
                        message.sender.type === 'client' && "justify-end"
                      )}
                    >
                      {message.sender.type !== 'client' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender.avatar} />
                          <AvatarFallback>
                            {message.sender.type === 'ai' ? (
                              <Bot className="h-4 w-4" />
                            ) : (
                              message.sender.name.split(' ').map(n => n[0]).join('')
                            )}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={cn(
                        "max-w-[70%] space-y-1",
                        message.sender.type === 'client' && "items-end"
                      )}>
                        <div className={cn(
                          "rounded-2xl px-4 py-2",
                          message.sender.type === 'client' 
                            ? "bg-primary text-primary-foreground ml-auto" 
                            : message.sender.type === 'ai'
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100"
                            : "bg-muted"
                        )}>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        </div>
                        
                        <div className={cn(
                          "flex items-center gap-1 text-xs text-muted-foreground",
                          message.sender.type === 'client' && "justify-end"
                        )}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.sender.type === 'client' && (
                            <MessageStatus status={message.status} />
                          )}
                        </div>
                      </div>
                      
                      {message.sender.type === 'client' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${selectedChat.name}...`}
                    className="pr-12 min-h-[44px] resize-none"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="h-[44px] w-[44px] p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose from your existing conversations or start a new one
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
