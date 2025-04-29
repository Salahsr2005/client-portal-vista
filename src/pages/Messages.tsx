
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Check, 
  User,
  Search,
  Phone,
  Video,
  MoreVertical,
  Clock,
  CheckCheck
} from "lucide-react";
import { handleSupabaseError } from "@/utils/databaseHelpers";
import { format } from "date-fns";

const MessagesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Query to get user's chats
  const { data: chats = [], isLoading: chatsLoading } = useQuery({
    queryKey: ["chats", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase.rpc('get_user_chats', {
          p_user_id: user.id,
          p_user_type: 'Client'
        });
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        handleSupabaseError(error, toast, "Failed to load conversations");
        return [];
      }
    },
    enabled: !!user
  });

  // Query to get messages for active chat
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      if (!chatId) return [];

      try {
        const { data, error } = await supabase.rpc('get_chat_messages', {
          p_chat_id: chatId,
          p_limit: 100, 
          p_offset: 0
        });
        
        if (error) throw error;
        return (data || []).reverse(); // Reverse to show oldest messages first
      } catch (error) {
        handleSupabaseError(error, toast, "Failed to load messages");
        return [];
      }
    },
    enabled: !!chatId
  });

  // Effect to mark messages as read when a chat is opened
  useEffect(() => {
    if (!chatId || !user) return;
    
    supabase.rpc('mark_messages_as_read', {
      p_chat_id: chatId,
      p_participant_id: user.id,
      p_participant_type: 'Client'
    }).then(({ error }) => {
      if (error) console.error("Error marking messages as read:", error);
      
      // Update the unread count in the chat list
      queryClient.setQueryData(
        ["chats", user.id],
        (oldChats: any[] | undefined) => 
          (oldChats || []).map(chat => 
            chat.chat_id === chatId ? { ...chat, unread_count: 0 } : chat
          )
      );
    });
  }, [chatId, user, queryClient]);

  // Select first chat by default if none is selected
  useEffect(() => {
    if (chats.length > 0 && !chatId) {
      setChatId(chats[0].chat_id);
      setActiveChat(chats[0]);
    }
  }, [chats, chatId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user || !chatId) return;

    const channel = supabase
      .channel(`chat-updates-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          // Update messages query cache
          queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
          
          // Mark message as read if it's not from current user
          if (payload.new && payload.new.sender_id !== user.id && payload.new.sender_type !== 'Client') {
            supabase.rpc('mark_messages_as_read', {
              p_chat_id: chatId,
              p_participant_id: user.id,
              p_participant_type: 'Client'
            });
          }
          
          // Update chat list to show latest message
          if (payload.new) {
            queryClient.invalidateQueries({ queryKey: ["chats", user.id] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, user, queryClient]);

  const handleSendMessage = async () => {
    if (!message.trim() || !chatId || !user) return;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        chat_id: chatId,
        sender_id: user.id,
        sender_type: "Client",
        message_text: message,
        message_type: "Text",
        status: "Sent"
      });

      if (error) throw error;

      // Clear input
      setMessage("");
    } catch (error) {
      handleSupabaseError(error, toast, "Error sending message");
    }
  };

  // Select a chat
  const handleSelectChat = (chat: any) => {
    setChatId(chat.chat_id);
    setActiveChat(chat);
  };

  // Format date properly
  const formatMessageTime = (timestamp: string) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return format(date, "h:mm a");
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };
  
  // Get other participants in a chat
  const getOtherParticipants = (chat: any) => {
    if (!chat || !chat.participants) return [];
    
    return chat.participants.filter(
      (p: any) => p.participant_type !== 'Client' || p.participant_id !== user?.id
    );
  };
  
  // Get chat name (for display)
  const getChatName = (chat: any) => {
    if (!chat) return "Chat";
    
    if (chat.title && !chat.is_group_chat) return chat.title;
    
    const others = getOtherParticipants(chat);
    if (others.length === 0) return "Chat";
    
    if (chat.is_group_chat) {
      return chat.title || `Group (${others.length + 1})`;
    }
    
    return others[0]?.display_name || "Advisor";
  };
  
  // Get avatar initials
  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AD';
  };

  // Filter chats by search query
  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    // Check chat title
    if (chat.title?.toLowerCase().includes(query)) return true;
    
    // Check participant names
    if (chat.participants?.some((p: any) => 
      p.display_name?.toLowerCase().includes(query)
    )) return true;
    
    // Check last message
    if (chat.last_message_text?.toLowerCase().includes(query)) return true;
    
    return false;
  });

  if (!user) {
    return (
      <div className="container max-w-6xl py-8">
        <Card className="p-8 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in to access messages</h2>
          <p className="text-muted-foreground mb-4">
            You need to be signed in to view and send messages
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
        {/* Left sidebar - Conversations */}
        <Card className="col-span-1 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-grow">
            {chatsLoading ? (
              // Loading skeletons
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4 border-b flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-3 w-8" />
                </div>
              ))
            ) : filteredChats.length > 0 ? (
              filteredChats.map((chat) => {
                const chatName = getChatName(chat);
                const otherParticipants = getOtherParticipants(chat);
                const isActive = chat.chat_id === chatId;
                
                return (
                  <div
                    key={chat.chat_id}
                    className={`p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors ${
                      isActive ? "bg-muted" : ""
                    }`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" alt={chatName} />
                        <AvatarFallback>{getAvatarInitials(chatName)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium text-sm truncate">{chatName}</h3>
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(chat.last_message_time)}
                          </span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground truncate">
                          {chat.last_message_text || "No messages yet"}
                        </p>
                      </div>
                      
                      {chat.unread_count > 0 && (
                        <Badge className="rounded-full h-5 w-5 p-0 flex items-center justify-center">
                          {chat.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery ? "No conversations match your search" : "No conversations yet"}
              </div>
            )}
          </ScrollArea>
        </Card>
        
        {/* Right side - Messages */}
        <Card className="col-span-1 md:col-span-2 flex flex-col h-full overflow-hidden">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src="/placeholder.svg" 
                      alt={getChatName(activeChat)}
                    />
                    <AvatarFallback>
                      {getAvatarInitials(getChatName(activeChat))}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium">{getChatName(activeChat)}</h3>
                    <p className="text-xs text-muted-foreground">
                      {activeChat.is_group_chat 
                        ? `${activeChat.participants?.length || 0} participants` 
                        : "Advisor"}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Messages area */}
              <ScrollArea 
                ref={scrollRef} 
                className="flex-grow p-4"
              >
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isMe = msg.sender_id === user.id && msg.sender_type === 'Client';
                      
                      return (
                        <div
                          key={msg.message_id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex items-end gap-2 max-w-[80%] group ${
                              isMe ? "flex-row-reverse" : ""
                            }`}
                          >
                            {!isMe && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage 
                                  src="/placeholder.svg" 
                                  alt={msg.sender_type}
                                />
                                <AvatarFallback>
                                  {msg.sender_type === "Admin" ? "AD" : "SY"}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div
                              className={`rounded-lg p-3 ${
                                isMe
                                  ? "bg-primary text-primary-foreground rounded-br-none"
                                  : "bg-muted rounded-bl-none"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">
                                {msg.message_text}
                              </p>
                              
                              <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                                <span className="text-xs">
                                  {format(new Date(msg.sent_at), "h:mm a")}
                                </span>
                                
                                {isMe && (
                                  msg.status === 'Read' 
                                    ? <CheckCheck className="h-3 w-3" /> 
                                    : <Check className="h-3 w-3" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">No messages yet</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-6">
                      Send a message to start the conversation
                    </p>
                  </div>
                )}
              </ScrollArea>
              
              {/* Input area */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-grow"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Typical response time: Under 24 hours</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">
                Select a conversation from the sidebar or start a new one
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
