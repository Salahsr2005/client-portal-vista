import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  MessageSquare,
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  online: boolean;
}

// Sample data - in a real app this would come from the database
const sampleConversations: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    lastMessage: 'When will the application deadline be extended?',
    timestamp: '10:30 AM',
    unread: 3,
    avatar: '/placeholder.svg',
    online: true,
  },
  {
    id: '2',
    name: 'Mohammed Ali',
    lastMessage: 'Thanks for the information about the program.',
    timestamp: 'Yesterday',
    unread: 0,
    avatar: '/placeholder.svg',
    online: false,
  },
  {
    id: '3',
    name: 'Fatima Zahra',
    lastMessage: 'I submitted my documents last week.',
    timestamp: 'Monday',
    unread: 0,
    avatar: '/placeholder.svg',
    online: true,
  },
  {
    id: '4',
    name: 'Youssef Benzahra',
    lastMessage: 'Can you help me with my application?',
    timestamp: '3 days ago',
    unread: 1,
    avatar: '/placeholder.svg',
    online: false,
  },
  {
    id: '5',
    name: 'Amina Berrada',
    lastMessage: 'What are the requirements for the scholarship program?',
    timestamp: 'Last week',
    unread: 0,
    avatar: '/placeholder.svg',
    online: true,
  },
];

const sampleMessages: Message[] = [
  {
    id: '1',
    sender: 'Sarah Johnson',
    content: 'Hello! I have a question regarding the Study Abroad program.',
    timestamp: new Date(new Date().getTime() - 25 * 60000),
    isMe: false,
  },
  {
    id: '2',
    sender: 'Me',
    content: 'Hi Sarah, I\'d be happy to help. What would you like to know?',
    timestamp: new Date(new Date().getTime() - 20 * 60000),
    isMe: true,
  },
  {
    id: '3',
    sender: 'Sarah Johnson',
    content: 'I saw that the application deadline is this Friday, but I need more time to gather all my documents. Is there any possibility of an extension?',
    timestamp: new Date(new Date().getTime() - 15 * 60000),
    isMe: false,
  },
  {
    id: '4',
    sender: 'Me',
    content: 'I understand your concern. We can provide a one-week extension for your specific case. Would that be sufficient?',
    timestamp: new Date(new Date().getTime() - 10 * 60000),
    isMe: true,
  },
  {
    id: '5',
    sender: 'Sarah Johnson',
    content: 'Yes, that would be perfect! Thank you so much for your understanding.',
    timestamp: new Date(new Date().getTime() - 5 * 60000),
    isMe: false,
  },
  {
    id: '6',
    sender: 'Sarah Johnson',
    content: 'When will the application deadline be extended? I need to know the exact date to plan accordingly.',
    timestamp: new Date(),
    isMe: false,
  },
];

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState(sampleConversations[0]);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate real-time messaging
  useEffect(() => {
    const channel = supabase
      .channel('chat-updates')
      .on('broadcast', { event: 'new-message' }, (payload) => {
        if (payload.payload.conversationId === selectedConversation.id) {
          const newMsg = payload.payload.message;
          setMessages(prev => [...prev, newMsg]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation.id]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'Me',
      content: newMessage,
      timestamp: new Date(),
      isMe: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulating a reply after 1s
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: selectedConversation.name,
        content: "Thanks for your message! Our advisor will get back to you shortly.",
        timestamp: new Date(),
        isMe: false
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Sign in to view your messages</h3>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to access your messages
          </p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Left sidebar - Conversation list */}
        <div className="col-span-1 border rounded-lg overflow-hidden flex flex-col h-full bg-card dark:bg-card">
          <div className="p-3 border-b">
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-8" />
            </div>
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                  <Badge className="ml-1 bg-primary text-primary-foreground" variant="secondary">
                    4
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <ScrollArea className="flex-grow">
            {sampleConversations.map(conversation => (
              <div key={conversation.id} className="p-3 border-b last:border-b-0 cursor-pointer hover:bg-accent">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{conversation.name}</div>
                    <div className="text-sm text-muted-foreground">{conversation.lastMessage}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{conversation.timestamp}</div>
                    {conversation.unread > 0 && (
                      <Badge className="ml-1 bg-primary text-primary-foreground" variant="secondary">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        
        {/* Right side - Messages */}
        <div className="col-span-1 md:col-span-2 border rounded-lg flex flex-col h-full bg-card">
          {/* Chat header */}
          <div className="p-3 border-b flex justify-between items-center bg-muted/20">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                <AvatarFallback>{selectedConversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedConversation.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedConversation.online ? 
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span> Online
                    </span> : 
                    'Offline'
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Messages area with proper Tabs setup */}
          <Tabs defaultValue="chat" className="flex-grow flex flex-col">
            <div className="p-3 border-b flex justify-end bg-muted/10">
              <TabsList className="w-32">
                <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                <TabsTrigger value="faq" className="flex-1">FAQ</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea ref={scrollRef} className="flex-grow p-4">
              <div className="space-y-4">
                <TabsContent value="chat" className="m-0 h-full space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[80%] group">
                        {!message.isMe && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                            <AvatarFallback>{selectedConversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg p-3 ${
                            message.isMe
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-muted rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-xs opacity-70">
                              {formatMessageTime(message.timestamp)}
                            </span>
                            {message.isMe && (
                              <Check className="h-3.5 w-3.5 text-primary-foreground opacity-70" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="faq" className="m-0 h-full space-y-4">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Frequently Asked Questions</h3>
                    <ul className="space-y-3 list-disc pl-4">
                      <li>How long does the application process usually take?</li>
                      <li>What documents do I need for a student visa?</li>
                      <li>Can I work part-time while studying abroad?</li>
                      <li>How can I find affordable housing?</li>
                      <li>Are there scholarships available for international students?</li>
                    </ul>
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
          
          {/* Input area */}
          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" className="rounded-full">
                <Smile className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full"
                onClick={handleSendMessage}
                disabled={newMessage.trim() === ''}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
