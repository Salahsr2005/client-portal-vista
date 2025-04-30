import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { 
  Send,
  CircleUser,
  Phone,
  Video,
  Info,
  ChevronLeft,
  MoreHorizontal,
  ImageIcon,
  Paperclip,
  SmileIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-mobile.tsx"; // Fixed import
import { supabase } from "@/integrations/supabase/client";

// Component to display a single message
const Message = ({ message, isCurrentUser }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarFallback className="bg-primary/20">
            {message.sender_name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[75%] ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'} rounded-lg p-3 break-words`}>
        <div className="text-sm">{message.message_text}</div>
        <div className={`text-[10px] mt-1 ${isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {formatTime(message.sent_at)}
        </div>
      </div>
      {isCurrentUser && (
        <Avatar className="h-8 w-8 ml-2">
          <AvatarImage src={message.sender_avatar || ""} alt="User" />
          <AvatarFallback className="bg-primary/20">
            {message.sender_name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

// Component to display a conversation preview
const ConversationPreview = ({ conversation, isActive, onClick }) => {
  const getLastMessageTime = () => {
    if (!conversation.last_message_time) return "";
    
    const date = new Date(conversation.last_message_time);
    const now = new Date();
    
    // Compare dates properly by comparing day values
    if (date.toDateString() === now.toDateString()) {
      // Today, show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.getFullYear() === now.getFullYear()) {
      // This year, show month and day
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      // Different year
      return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };
  
  // Find the other participant (not current user)
  const otherParticipant = conversation.participants?.find(p => 
    p.participant_type !== 'Client' || p.participant_id !== conversation.currentUserId);
    
  return (
    <div 
      className={`flex items-center p-3 cursor-pointer rounded-md transition-colors hover:bg-accent/50 ${isActive ? 'bg-accent' : ''}`}
      onClick={() => onClick(conversation.chat_id)}
    >
      <Avatar className="h-10 w-10 mr-3">
        <AvatarFallback className="bg-primary/20">
          {otherParticipant?.display_name?.charAt(0) || "C"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium truncate">
            {otherParticipant?.display_name || "Chat"}
          </h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {getLastMessageTime()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground truncate">
            {conversation.last_message_text || "No messages yet"}
          </p>
          {conversation.unread_count > 0 && (
            <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
              {conversation.unread_count}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState("all");
  
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Fetch conversations when component mounts
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .rpc('get_user_chats', { 
            p_user_id: user.id, 
            p_user_type: 'Client' 
          });
        
        if (error) throw error;
        
        // Add current user ID to each conversation object for easier access
        const conversationsWithUserId = data.map(conv => ({
          ...conv,
          currentUserId: user.id
        }));
        
        setConversations(conversationsWithUserId);
        
        // If there are conversations and none selected, select the first one
        if (conversationsWithUserId.length > 0 && !currentChat) {
          setCurrentChat(conversationsWithUserId[0]);
          fetchMessages(conversationsWithUserId[0].chat_id);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
    
    // Set up a real-time subscription for new messages
    const channel = supabase
      .channel('chat_updates')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages' 
        },
        (payload) => {
          // Handle new message
          const newMsg = payload.new;
          
          // Update messages if part of current chat
          if (currentChat && newMsg.chat_id === currentChat.chat_id) {
            setMessages(prev => [...prev, {
              ...newMsg,
              sender_name: currentChat.participants.find(p => 
                p.participant_id === newMsg.sender_id && 
                p.participant_type === newMsg.sender_type
              )?.display_name || "Unknown"
            }]);
            
            // Mark message as read if not from current user
            if (newMsg.sender_id !== user.id || newMsg.sender_type !== 'Client') {
              markMessagesAsRead(currentChat.chat_id);
            }
          }
          
          // Update conversation list
          setConversations(prev => 
            prev.map(conv => 
              conv.chat_id === newMsg.chat_id 
              ? { 
                ...conv, 
                last_message_text: newMsg.message_text,
                last_message_time: newMsg.sent_at,
                unread_count: newMsg.sender_id !== user.id ? conv.unread_count + 1 : conv.unread_count
              } 
              : conv
            ).sort((a, b) => 
              new Date(b.last_message_time) - new Date(a.last_message_time)
            )
          );
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate, toast, currentChat]);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Fetch messages for a specific chat
  const fetchMessages = async (chatId) => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_chat_messages', { 
          p_chat_id: chatId,
          p_limit: 50,
          p_offset: 0
        });
      
      if (error) throw error;
      
      // Add sender name from participants
      const chat = conversations.find(c => c.chat_id === chatId);
      const messagesWithNames = data.map(msg => ({
        ...msg,
        sender_name: chat.participants.find(p => 
          p.participant_id === msg.sender_id && 
          p.participant_type === msg.sender_type
        )?.display_name || "Unknown"
      }));
      
      setMessages(messagesWithNames.reverse());
      
      // Mark messages as read
      markMessagesAsRead(chatId);
      
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setMessagesLoading(false);
    }
  };
  
  // Mark messages as read
  const markMessagesAsRead = async (chatId) => {
    try {
      await supabase.rpc('mark_messages_as_read', { 
        p_chat_id: chatId,
        p_participant_id: user.id,
        p_participant_type: 'Client'
      });
      
      // Update unread count in conversations
      setConversations(prev => 
        prev.map(conv => 
          conv.chat_id === chatId 
            ? { ...conv, unread_count: 0 } 
            : conv
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };
  
  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: currentChat.chat_id,
          sender_id: user.id,
          sender_type: 'Client',
          message_text: newMessage.trim(),
          message_type: 'Text'
        });
      
      if (error) throw error;
      
      // Clear input
      setNewMessage("");
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };
  
  // Handle chat selection
  const handleSelectChat = (chatId) => {
    const selectedChat = conversations.find(c => c.chat_id === chatId);
    setCurrentChat(selectedChat);
    fetchMessages(chatId);
    setMobileChatOpen(true);
  };
  
  // Get current chat title or participant name
  const getChatTitle = () => {
    if (!currentChat) return "No conversation selected";
    
    if (currentChat.title) return currentChat.title;
    
    const otherParticipant = currentChat.participants.find(p => 
      p.participant_id !== user.id || p.participant_type !== 'Client'
    );
    
    return otherParticipant?.display_name || "Chat";
  };
  
  // Get other participant's type (Admin, Support, etc.)
  const getParticipantType = () => {
    if (!currentChat) return "";
    
    const otherParticipant = currentChat.participants.find(p => 
      p.participant_id !== user.id || p.participant_type !== 'Client'
    );
    
    return otherParticipant?.participant_type || "";
  };
  
  // Get total unread count
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
  
  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          {totalUnreadCount > 0 && (
            <Badge>{totalUnreadCount} unread</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-grow">
          {/* Conversations List - Hidden on mobile when a chat is open */}
          <Card className={`col-span-1 border-0 shadow-md overflow-hidden ${isMobile && mobileChatOpen ? 'hidden' : 'block'}`}>
            <CardHeader className="py-3 px-4 border-b bg-gradient-to-r from-violet-50/50 to-slate-50/50 dark:from-gray-900/40 dark:to-gray-800/40">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Tabs defaultValue="all" className="w-[120px]" value={activeTabMode} onValueChange={setActiveTabMode}>
                  <TabsList className="h-8 bg-muted/50 p-1">
                    <TabsTrigger value="all" className="text-xs h-6">All</TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs h-6">Unread</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <CircleUser className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No conversations yet</p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(80vh-130px)]">
                  <div className="p-2">
                    {conversations.map((conversation) => (
                      <ConversationPreview
                        key={conversation.chat_id}
                        conversation={conversation}
                        isActive={currentChat?.chat_id === conversation.chat_id}
                        onClick={handleSelectChat}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
          
          {/* Chat Area - Full screen on mobile when a chat is open */}
          <Card className={`col-span-1 md:col-span-2 lg:col-span-3 border-0 shadow-md overflow-hidden ${isMobile && !mobileChatOpen ? 'hidden' : 'block'}`}>
            {!currentChat ? (
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-primary/10 p-6 mb-4">
                    <Send className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">No conversation selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Select a conversation from the sidebar to start chatting
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="border-b bg-gradient-to-r from-violet-50/50 to-slate-50/50 dark:from-gray-900/40 dark:to-gray-800/40 py-3 px-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {isMobile && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="mr-2"
                          onClick={() => setMobileChatOpen(false)}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                      )}
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarFallback className="bg-primary/20">
                          {getChatTitle().charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-medium text-base">{getChatTitle()}</h2>
                        <p className="text-xs text-muted-foreground">
                          {getParticipantType()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-5 w-5" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-sm">
                          <SheetHeader>
                            <SheetTitle>Chat Information</SheetTitle>
                          </SheetHeader>
                          <div className="mt-6">
                            <div className="flex flex-col items-center">
                              <Avatar className="h-20 w-20 mb-4">
                                <AvatarFallback className="text-xl">
                                  {getChatTitle().charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="text-xl font-semibold">{getChatTitle()}</h3>
                              <p className="text-sm text-muted-foreground">
                                {getParticipantType()}
                              </p>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium">Participants</h4>
                              {currentChat.participants?.map((p, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>
                                        {p.display_name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{p.display_name}</p>
                                      <p className="text-xs text-muted-foreground">{p.participant_type}</p>
                                    </div>
                                  </div>
                                  {p.is_admin && (
                                    <Badge variant="outline">Admin</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Search Messages</DropdownMenuItem>
                          <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete Chat</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                
                {/* Messages Area */}
                <ScrollArea className="h-[calc(80vh-215px)] px-4 py-4">
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full mr-2" />}
                          <Skeleton className={`h-16 ${i % 2 === 0 ? 'w-2/3 ml-auto' : 'w-2/3'} rounded-lg`} />
                          {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full ml-2" />}
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Send className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No messages yet</p>
                      <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <Message 
                          key={message.message_id} 
                          message={message} 
                          isCurrentUser={message.sender_id === user.id && message.sender_type === 'Client'} 
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
                
                {/* Input Area */}
                <div className="border-t p-4 bg-background">
                  <form onSubmit={sendMessage} className="flex items-center gap-2">
                    <Button type="button" size="icon" variant="ghost">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Button type="button" size="icon" variant="ghost">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="button" size="icon" variant="ghost">
                      <SmileIcon className="h-5 w-5" />
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </form>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
