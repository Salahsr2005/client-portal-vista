
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Send,
  Bot,
  User,
  MessageSquare,
  Clock,
  Check,
  CheckCheck,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    type: 'client' | 'admin' | 'ai';
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  isTyping?: boolean;
}

interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isGroup: boolean;
  participants: Array<{
    id: string;
    name: string;
    type: 'client' | 'admin';
    avatar?: string;
  }>;
}

export default function ModernChatInterface() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('admin');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [aiMessages, setAiMessages] = useState<Message[]>([]);
  const [aiMessage, setAiMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  useEffect(() => {
    scrollToBottom(aiMessagesEndRef);
  }, [aiMessages]);

  // Load chats and set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      try {
        const { data: userChats, error } = await supabase
          .rpc('get_user_chats', {
            p_user_id: user.id,
            p_user_type: 'Client'
          });

        if (error) throw error;

        setChats(userChats?.map((chat: any) => ({
          id: chat.chat_id,
          title: chat.title,
          lastMessage: chat.last_message_text,
          lastMessageTime: chat.last_message_time ? new Date(chat.last_message_time) : undefined,
          unreadCount: chat.unread_count || 0,
          isGroup: chat.is_group_chat,
          participants: chat.participants || []
        })) || []);
      } catch (error) {
        console.error('Error loading chats:', error);
        toast({
          title: 'Error',
          description: 'Failed to load chats',
          variant: 'destructive'
        });
      }
    };

    loadChats();

    // Set up realtime subscription for new messages
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as any;
            if (selectedChat === newMessage.chat_id) {
              setMessages(prev => [...prev, {
                id: newMessage.message_id,
                text: newMessage.message_text,
                sender: {
                  id: newMessage.sender_id,
                  type: newMessage.sender_type.toLowerCase(),
                  name: newMessage.sender_type === 'Admin' ? 'Support Team' : 'You'
                },
                timestamp: new Date(newMessage.sent_at),
                status: 'delivered'
              }]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedChat, toast]);

  // Load messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const loadMessages = async () => {
      try {
        const { data: chatMessages, error } = await supabase
          .rpc('get_chat_messages', {
            p_chat_id: selectedChat,
            p_limit: 50
          });

        if (error) throw error;

        const formattedMessages = chatMessages?.reverse().map((msg: any) => ({
          id: msg.message_id,
          text: msg.message_text,
          sender: {
            id: msg.sender_id,
            type: msg.sender_type.toLowerCase(),
            name: msg.sender_type === 'Admin' ? 'Support Team' : 'You'
          },
          timestamp: new Date(msg.sent_at),
          status: 'delivered'
        })) || [];

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: {
        id: user.id,
        type: 'client',
        name: 'You'
      },
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: selectedChat,
          sender_id: user.id,
          sender_type: 'Client',
          message_text: message
        });

      if (error) throw error;

      // Update message status
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: 'sent' }
          : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const handleSendAiMessage = async () => {
    if (!aiMessage.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: aiMessage,
      sender: {
        id: user.id,
        type: 'client',
        name: 'You'
      },
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiMessage('');
    setIsAiLoading(true);

    try {
      // Use the correct Supabase edge function URL
      const response = await fetch('https://nzdmouebmzugmadypibz.supabase.co/functions/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({
          message: aiMessage,
          history: aiMessages.slice(-10)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process your request at the moment.",
        sender: {
          id: 'ai',
          type: 'ai',
          name: 'AI Assistant'
        },
        timestamp: new Date()
      };

      setAiMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending AI message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: {
          id: 'ai',
          type: 'ai',
          name: 'AI Assistant'
        },
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const createNewChat = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      // In a real app, you'd select an admin to chat with
      // For now, we'll create a placeholder
      toast({
        title: 'Feature Coming Soon',
        description: 'Direct admin chat will be available soon',
      });
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageBubble = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-end space-x-2 max-w-[80%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <Avatar className="w-8 h-8">
          <AvatarFallback className={`text-xs ${
            message.sender.type === 'ai' 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : isOwn 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-500 text-white'
          }`}>
            {message.sender.type === 'ai' ? <Bot className="w-4 h-4" /> : 
             message.sender.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isOwn 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : message.sender.type === 'ai'
              ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-gray-800 dark:text-gray-200 rounded-bl-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          <div className={`flex items-center justify-end space-x-1 mt-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            <span className="text-xs">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isOwn && message.status && (
              <div className="text-xs">
                {message.status === 'sending' && <Clock className="w-3 h-3" />}
                {message.status === 'sent' && <Check className="w-3 h-3" />}
                {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                {message.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-300" />}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-[calc(100vh-12rem)] bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="admin" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Admin Chat</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Assistant</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="h-[calc(100%-4rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Chat List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Button size="sm" onClick={createNewChat} disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  {chats.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No conversations yet</p>
                      <p className="text-sm">Start a chat with our support team</p>
                    </div>
                  ) : (
                    chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                          selectedChat === chat.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>ST</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{chat.title}</p>
                              {chat.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {chat.unreadCount}
                                </Badge>
                              )}
                            </div>
                            {chat.lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                {chat.lastMessage}
                              </p>
                            )}
                            {chat.lastMessageTime && (
                              <p className="text-xs text-muted-foreground">
                                {chat.lastMessageTime.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="lg:col-span-2 flex flex-col">
              {selectedChat ? (
                <>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Support Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-4">
                      <AnimatePresence>
                        {messages.map((msg) => (
                          <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwn={msg.sender.type === 'client'}
                          />
                        ))}
                      </AnimatePresence>
                      {isTyping && (
                        <div className="flex justify-start mb-4">
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </ScrollArea>
                    <Separator />
                    <div className="p-4">
                      <div className="flex space-x-2">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} disabled={!message.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p>Choose a chat from the sidebar to start messaging</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="h-[calc(100%-4rem)]">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Study Abroad Assistant</CardTitle>
                  <p className="text-sm text-muted-foreground">Get instant help with your study abroad questions</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                {aiMessages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Welcome to AI Assistant</h3>
                    <p>Ask me anything about studying abroad, visas, programs, or applications!</p>
                  </div>
                )}
                <AnimatePresence>
                  {aiMessages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isOwn={msg.sender.type === 'client'}
                    />
                  ))}
                </AnimatePresence>
                {isAiLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={aiMessagesEndRef} />
              </ScrollArea>
              <Separator />
              <div className="p-4">
                <div className="flex space-x-2">
                  <Input
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    placeholder="Ask me about studying abroad..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendAiMessage()}
                    className="flex-1"
                    disabled={isAiLoading}
                  />
                  <Button 
                    onClick={handleSendAiMessage} 
                    disabled={!aiMessage.trim() || isAiLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
