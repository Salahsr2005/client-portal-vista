
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, User, Bot, Clock, HelpCircle, 
  Calendar, MessageSquare, Check, Info, UserCircle2, 
  Settings, AlertTriangle, Lock, CreditCard, FileText
} from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMessageAccess } from "@/hooks/useMessageAccess";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  content: string;
  sender: "user" | "system" | "agent";
  timestamp: Date;
}

interface Topic {
  icon: React.ElementType;
  name: string;
  description: string;
}

const topics: Topic[] = [
  {
    icon: MessageSquare,
    name: "Education",
    description: "Questions about study programs, universities, and requirements"
  },
  {
    icon: MessageSquare,
    name: "Visas",
    description: "Help with student visas, documents, and applications"
  },
  {
    icon: MessageSquare,
    name: "Career",
    description: "Work opportunities, internships, and post-study options"
  },
  {
    icon: MessageSquare,
    name: "Appointments",
    description: "Schedule meetings or talk with our advisors"
  },
  {
    icon: MessageSquare,
    name: "Services",
    description: "Information about our services, fees, and assistance"
  }
];

export default function ChatSupport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Welcome to Euro Visa Support! How can I assist you today?",
      sender: "system",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageAccess = useMessageAccess();
  const [activeAdvisor, setActiveAdvisor] = useState({
    name: "Sarah Johnson",
    role: "Education Advisor",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    status: "online"
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!user || !chatId) return;
    
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${chatId}` },
        payload => {
          if (payload.new && payload.new.sender_id !== user.id) {
            const newMsg: Message = {
              id: payload.new.message_id,
              content: payload.new.message_text,
              sender: payload.new.sender_type.toLowerCase() === 'admin' ? 'agent' : 
                     payload.new.sender_type.toLowerCase() === 'system' ? 'system' : 'user',
              timestamp: new Date(payload.new.sent_at)
            };
            setMessages(prev => [...prev, newMsg]);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, user]);

  const handleTopicSelect = (topic: Topic) => {
    setActiveChat(topic.name);
    
    const newMessages: Message[] = [
      ...messages,
      {
        id: Date.now().toString(),
        content: `You've selected ${topic.name}. ${topic.description}. How can I help you with this topic?`,
        sender: "system",
        timestamp: new Date()
      }
    ];
    
    setMessages(newMessages);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setMessage("");
    setIsTyping(true);
    
    if (!chatId && user) {
      try {
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("admin_id")
          .eq("status", "Active")
          .limit(1)
          .single();
          
        if (adminData) {
          const { data: newChatData, error: chatError } = await supabase
            .rpc('create_client_admin_chat', {
              p_client_id: user.id,
              p_admin_id: adminData.admin_id,
              p_title: 'Support Chat'
            });
            
          if (chatError) throw chatError;
          setChatId(newChatData);
          
          if (newChatData) {
            await supabase.from("chat_messages").insert({
              chat_id: newChatData,
              sender_id: user.id,
              sender_type: "Client",
              message_text: message
            });
          }
        }
      } catch (error) {
        console.error("Error creating chat:", error);
        toast({
          title: "Error starting chat",
          description: "We couldn't connect you to an advisor. Please try again.",
          variant: "destructive"
        });
      }
    } else if (chatId && user) {
      try {
        await supabase.from("chat_messages").insert({
          chat_id: chatId,
          sender_id: user.id,
          sender_type: "Client",
          message_text: message
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    }
    
    setTimeout(() => {
      setIsTyping(false);
      const agentMessage: Message = {
        id: Date.now().toString(),
        content: "Thank you for your message. An advisor will respond to you shortly. For immediate assistance, please consider scheduling a consultation.",
        sender: "agent",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 2000);
  };

  const renderMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // If no user is logged in
  if (!user) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Support Chat</h1>
          <p className="text-muted-foreground">
            Get quick answers or connect with our advisors
          </p>
        </div>

        <div className="h-[600px] flex items-center justify-center">
          <Card className="w-full max-w-md border-none shadow-lg">
            <CardHeader className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Sign in to Access Chat</CardTitle>
              <CardDescription>
                You need to be logged in to chat with our advisors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-gradient-to-r from-violet-600 to-purple-700">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/register">Create an Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If payment or application status is loading
  if (messageAccess.isLoading) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Support Chat</h1>
          <p className="text-muted-foreground">
            Get quick answers or connect with our advisors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // If user doesn't have approved application
  if (messageAccess.status === 'noApplication') {
    return (
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Support Chat</h1>
          <p className="text-muted-foreground">
            Get quick answers or connect with our advisors
          </p>
        </div>

        <div className="h-[600px] flex items-center justify-center">
          <Card className="w-full max-w-md border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 mx-auto text-violet-500 mb-2" />
              <CardTitle>Application Required</CardTitle>
              <CardDescription>
                You need to submit an application to access our chat support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
                <h3 className="font-medium text-violet-900 dark:text-violet-300 flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Application Status
                </h3>
                <p className="text-sm text-violet-700 dark:text-violet-400">
                  You haven't submitted any applications yet. Please submit an application to gain access to our support chat.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                  <FileText className="h-6 w-6 text-slate-500 mb-2" />
                  <h4 className="font-medium">Apply</h4>
                  <Badge variant="outline" className="mt-2 bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                    Required
                  </Badge>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                  <Clock className="h-6 w-6 text-slate-500 mb-2" />
                  <h4 className="font-medium">Review</h4>
                  <Badge variant="outline" className="mt-2">Pending</Badge>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                  <MessageSquare className="h-6 w-6 text-slate-500 mb-2" />
                  <h4 className="font-medium">Chat</h4>
                  <Badge variant="outline" className="mt-2">Locked</Badge>
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
      </div>
    );
  }

  // If user hasn't paid or payment isn't approved
  if (!messageAccess.canAccessMessages) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Support Chat</h1>
          <p className="text-muted-foreground">
            Get quick answers or connect with our advisors
          </p>
        </div>

        <div className="h-[600px] flex items-center justify-center">
          <Card className="w-full max-w-md border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <CardHeader className="text-center">
              <Lock className="h-12 w-12 mx-auto text-amber-500 mb-2" />
              <CardTitle>Chat Access Restricted</CardTitle>
              <CardDescription>
                Complete your payment to unlock chat support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="font-medium text-amber-900 dark:text-amber-300 flex items-center mb-2">
                  <CreditCard className="h-5 w-5 mr-2 text-amber-500" />
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
      </div>
    );
  }

  // Regular chat interface for paid users with approved applications
  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Support Chat</h1>
        <p className="text-muted-foreground">
          Get quick answers or connect with our advisors
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 hidden md:block border rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="font-semibold text-xl mb-4 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              Topics
            </h2>
            <div className="text-sm text-muted-foreground">
              Select a topic to get started with your questions
            </div>
          </div>

          <div className="space-y-3">
            {topics.map((topic) => (
              <Button
                key={topic.name}
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={() => handleTopicSelect(topic)}
              >
                <topic.icon className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">{topic.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {topic.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Your Advisor</h3>
              <Badge variant="outline" className="text-green-500 bg-green-50 dark:bg-green-900/20">
                Online
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={activeAdvisor.avatar} alt={activeAdvisor.name} />
                <AvatarFallback>{activeAdvisor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{activeAdvisor.name}</div>
                <div className="text-xs text-muted-foreground">{activeAdvisor.role}</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Call
            </Button>
          </div>
        </div>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full mb-4">
                <HelpCircle className="mr-2 h-4 w-4" />
                Select a Topic
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Choose a Topic</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-3">
                {topics.map((topic) => (
                  <Button
                    key={topic.name}
                    variant="outline"
                    className="w-full justify-start h-auto py-3"
                    onClick={() => {
                      handleTopicSelect(topic);
                      document.body.click(); // Close the sheet
                    }}
                  >
                    <topic.icon className="mr-3 h-5 w-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">{topic.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {topic.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Your Advisor</h3>
                  <Badge variant="outline" className="text-green-500 bg-green-50 dark:bg-green-900/20">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={activeAdvisor.avatar} alt="Advisor" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{activeAdvisor.name}</div>
                    <div className="text-xs text-muted-foreground">{activeAdvisor.role}</div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="md:col-span-2">
          <Card className="flex flex-col h-[600px] shadow-lg">
            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
              <div className="flex items-center">
                <MessageSquare className="text-primary mr-2 h-5 w-5" />
                <h2 className="font-semibold">
                  {activeChat ? `${activeChat} Support` : "Euro Visa Support"}
                </h2>
              </div>
              <Badge variant="outline" className="text-green-500 bg-green-50 dark:bg-green-900/20">
                Available
              </Badge>
            </div>
            
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[80%]",
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : msg.sender === "system"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted border border-border"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender === "user" ? (
                          <UserCircle2 className="h-4 w-4" />
                        ) : msg.sender === "system" ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={activeAdvisor.avatar} alt="Advisor" />
                            <AvatarFallback>{activeAdvisor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-xs font-medium">
                          {msg.sender === "user" ? "You" : msg.sender === "system" ? "System" : activeAdvisor.name}
                        </span>
                        <span className="text-xs opacity-70">
                          {renderMessageTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.sender === "agent" && (
                        <div className="flex justify-end mt-1">
                          <Check className="h-3.5 w-3.5 text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activeAdvisor.avatar} alt="Advisor" />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-10 resize-none"
                />
                <Button onClick={handleSendMessage} size="icon" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Typical response time: Under 24 hours</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
