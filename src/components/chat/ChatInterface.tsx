
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPaymentStatus } from "@/hooks/useUserPaymentStatus";
import useMessageAccess from "@/hooks/useMessageAccess";
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
  AlertTriangle,
  CreditCard,
  Lock,
  FileText,
  Clock,
  User
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
  const [selectedConversation, setSelectedConversation] = useState(sampleConversations[0]);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: paymentStatus, isLoading: paymentLoading } = useUserPaymentStatus();
  const messageAccess = useMessageAccess();

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

  // Check if user can access chat based on payment status and application approval
  const canAccessChat = messageAccess.canAccessMessages;

  // If no user is logged in
  if (!user) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <CardTitle>Sign in to access messages</CardTitle>
            <CardDescription>
              You need to be logged in to view and send messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/register">Create an Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If payment or application status is loading
  if (paymentLoading || messageAccess.isLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-12 mx-auto rounded-full mb-4" />
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto mb-4" />
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  // If user doesn't have approved application
  if (messageAccess.status === 'noApplication') {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Card className="w-full max-w-md border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 mx-auto text-violet-500 mb-2" />
            <CardTitle>Application Required</CardTitle>
            <CardDescription>
              You need to submit an application to access the messaging system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
              <h3 className="font-medium text-violet-900 dark:text-violet-300 flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Application Status
              </h3>
              <p className="text-sm text-violet-700 dark:text-violet-400">
                You haven't submitted any applications yet. Please submit an application to gain access to our messaging system.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                <FileText className="h-6 w-6 text-slate-500 mb-2" />
                <h4 className="font-medium">Apply</h4>
                <Badge variant="outline" className="mt-2">Step 1</Badge>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                <Clock className="h-6 w-6 text-slate-500 mb-2" />
                <h4 className="font-medium">Review</h4>
                <Badge variant="outline" className="mt-2">Step 2</Badge>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                <MessageSquare className="h-6 w-6 text-slate-500 mb-2" />
                <h4 className="font-medium">Message</h4>
                <Badge variant="outline" className="mt-2">Step 3</Badge>
              </div>
            </div>
            
            <Button asChild className="w-full bg-gradient-to-r from-violet-600 to-purple-600">
              <Link to="/applications/new">
                <FileText className="mr-2 h-4 w-4" />
                Submit an Application
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user hasn't paid or payment isn't approved
  if (!canAccessChat) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Card className="w-full max-w-md border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto text-amber-500 mb-2" />
            <CardTitle>Chat Access Restricted</CardTitle>
            <CardDescription>
              Complete your payment to unlock messaging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <h3 className="font-medium text-amber-900 dark:text-amber-300 flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Payment Required
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {messageAccess.reason}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                <CreditCard className="h-6 w-6 text-slate-500 mb-2" />
                <h4 className="font-medium">Payment</h4>
                <Badge variant="outline" className="mt-2 bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                  Required
                </Badge>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                <Clock className="h-6 w-6 text-slate-500 mb-2" />
                <h4 className="font-medium">Processing</h4>
                <Badge variant="outline" className="mt-2">Pending</Badge>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                <MessageSquare className="h-6 w-6 text-slate-500 mb-2" />
                <h4 className="font-medium">Access</h4>
                <Badge variant="outline" className="mt-2">Locked</Badge>
              </div>
            </div>
            
            {messageAccess.requiresPayment && (
              <Button asChild className="w-full bg-gradient-to-r from-violet-600 to-purple-600">
                <Link to="/payments">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Make a Payment
                </Link>
              </Button>
            )}
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/applications">
                View My Applications
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Regular chat interface for paid users with approved applications
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
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Conversations</h2>
              <Badge className="ml-1 bg-primary text-primary-foreground" variant="secondary">
                4
              </Badge>
            </div>
          </div>
          
          <ScrollArea className="flex-grow">
            {sampleConversations.map(conversation => (
              <div 
                key={conversation.id} 
                className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-accent transition-colors ${
                  selectedConversation.id === conversation.id ? 'bg-accent/50' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.name}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge className="rounded-full h-5 min-w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                      {conversation.unread}
                    </Badge>
                  )}
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
          
          {/* Messages area */}
          <ScrollArea ref={scrollRef} className="flex-grow p-4">
            <div className="space-y-4">
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
                    {message.isMe && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Me" />
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
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
