
import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, Send, ArrowRight, ChevronRight, 
  UserRound, Clock, PanelRight, PanelLeft, Search,
  GraduationCap, Globe, FileQuestion, CreditCard, 
  Calendar, BookOpen, CheckCircle, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Message, SenderType, ChatOption, ChatTopic } from "@/types/chat";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const CHAT_TOPICS: ChatTopic[] = [
  {
    id: "programs",
    title: "Study Programs",
    description: "Questions about available study programs and universities",
    icon: "GraduationCap"
  },
  {
    id: "application",
    title: "Application Process",
    description: "Help with application requirements and submission",
    icon: "FileQuestion"
  },
  {
    id: "visa",
    title: "Visa Information",
    description: "Questions about student visas and requirements",
    icon: "Globe"
  },
  {
    id: "payment",
    title: "Payment & Fees",
    description: "Information about tuition, scholarships and payment options",
    icon: "CreditCard"
  },
  {
    id: "schedule",
    title: "Appointments",
    description: "Schedule or manage your consultation appointments",
    icon: "Calendar"
  }
];

const FREQUENT_QUESTIONS: Record<string, ChatOption[]> = {
  "programs": [
    { id: "p1", label: "What programs do you offer?", action: "list_programs" },
    { id: "p2", label: "How can I find scholarships?", action: "scholarships" },
    { id: "p3", label: "What are the admission requirements?", action: "admission_requirements" },
    { id: "p4", label: "Which universities do you work with?", action: "list_universities" }
  ],
  "application": [
    { id: "a1", label: "What documents do I need?", action: "required_documents" },
    { id: "a2", label: "How long does the process take?", action: "application_timeline" },
    { id: "a3", label: "Can I apply to multiple programs?", action: "multiple_applications" },
    { id: "a4", label: "What's the application deadline?", action: "deadlines" }
  ],
  "visa": [
    { id: "v1", label: "Do I need a visa?", action: "visa_requirements" },
    { id: "v2", label: "What's the visa processing time?", action: "visa_timing" },
    { id: "v3", label: "What documents are needed for visa?", action: "visa_documents" },
    { id: "v4", label: "How much is the visa fee?", action: "visa_cost" }
  ],
  "payment": [
    { id: "f1", label: "What are the tuition fees?", action: "tuition_costs" },
    { id: "f2", label: "How can I pay?", action: "payment_methods" },
    { id: "f3", label: "Are there any installment options?", action: "installments" },
    { id: "f4", label: "What's included in the service fee?", action: "service_inclusions" }
  ],
  "schedule": [
    { id: "s1", label: "How do I schedule a consultation?", action: "book_appointment" },
    { id: "s2", label: "Can I reschedule my appointment?", action: "reschedule" },
    { id: "s3", label: "How long is a consultation?", action: "appointment_duration" },
    { id: "s4", label: "Is there an appointment fee?", action: "appointment_cost" }
  ]
};

export default function ChatSupport() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add initial greeting message
    if (messages.length === 0) {
      const initialMessages: Message[] = [
        {
          id: "welcome-1",
          content: "Hello! I'm your EuroVisa education consultant. How can I help you today?",
          sender: "agent" as SenderType,
          timestamp: new Date()
        },
        {
          id: "welcome-2",
          content: "You can select a topic or ask a question to get started.",
          sender: "system" as SenderType,
          timestamp: new Date()
        }
      ];
      setMessages(initialMessages);
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: "user" as SenderType,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    // Simulate response after a delay
    setTimeout(() => {
      generateResponse(input);
      setLoading(false);
    }, 1000);
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopic(topicId);
    
    // Add system message about the selected topic
    const topicMessage: Message = {
      id: `topic-${Date.now()}`,
      content: `You selected: ${CHAT_TOPICS.find(t => t.id === topicId)?.title}. Here are some common questions about this topic:`,
      sender: "system" as SenderType,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, topicMessage]);
  };

  const handleSelectQuestion = (question: ChatOption) => {
    // Add user question
    const userQuestion: Message = {
      id: `question-${Date.now()}`,
      content: question.label,
      sender: "user" as SenderType,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userQuestion]);
    setLoading(true);
    
    // Simulate response after a delay
    setTimeout(() => {
      generatePredefinedResponse(question);
      setLoading(false);
    }, 800);
  };

  const generatePredefinedResponse = (question: ChatOption) => {
    let response = "";
    
    switch(question.action) {
      case "list_programs":
        response = "We offer a wide range of undergraduate, graduate, and doctoral programs across various disciplines, including Business, Engineering, Medicine, Arts, and more. All our programs are at accredited European universities.";
        break;
      case "scholarships":
        response = "Many European universities offer scholarships for international students. These can be merit-based, need-based, or country-specific scholarships. We can help you identify and apply for scholarships that match your profile.";
        break;
      case "required_documents":
        response = "Typically, you'll need: 1) Passport, 2) Educational certificates, 3) Transcripts, 4) Language proficiency test results, 5) Motivation letter, 6) Recommendation letters, and 7) CV/Resume. Specific requirements may vary by program.";
        break;
      default:
        response = "I'd be happy to help with that! Let's schedule a consultation with one of our advisors who can provide you with personalized guidance.";
    }
    
    const botResponse: Message = {
      id: `bot-${Date.now()}`,
      content: response,
      sender: "agent" as SenderType,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botResponse]);
  };

  const generateResponse = (query: string) => {
    let response = "Thank you for your question. This seems like something I can help with. Let me connect you with one of our education advisors for more personalized assistance.";
    
    if (query.toLowerCase().includes("program") || query.toLowerCase().includes("study")) {
      response = "We have many study programs available across Europe. Would you like to explore our program finder to see which options might be best for you?";
    } else if (query.toLowerCase().includes("visa") || query.toLowerCase().includes("document")) {
      response = "Visa requirements depend on your nationality and the country you're applying to. Generally, you'll need acceptance from a university, proof of finances, health insurance, and a valid passport. Would you like specific information for a particular country?";
    } else if (query.toLowerCase().includes("cost") || query.toLowerCase().includes("fee") || query.toLowerCase().includes("price")) {
      response = "Tuition fees vary by country, university, and program. Many European public universities charge between €0-15,000 per year for international students. Living costs also vary by city. Would you like me to provide more specific estimates for particular destinations?";
    }
    
    const botResponse: Message = {
      id: `bot-${Date.now()}`,
      content: response,
      sender: "agent" as SenderType,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botResponse]);
  };

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case "GraduationCap": return <GraduationCap className="h-5 w-5" />;
      case "FileQuestion": return <FileQuestion className="h-5 w-5" />;
      case "Globe": return <Globe className="h-5 w-5" />;
      case "CreditCard": return <CreditCard className="h-5 w-5" />;
      case "Calendar": return <Calendar className="h-5 w-5" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden animate-fade-in">
      {/* Left sidebar */}
      <motion.div 
        className={`border-r bg-card ${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300`}
        initial={{ width: 320 }}
        animate={{ width: sidebarOpen ? 320 : 0 }}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chat Support</h2>
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="h-8 w-8 p-0">
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9"
            />
          </div>
          
          <Tabs defaultValue="topics" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="topics" className="flex-1 overflow-auto py-2 space-y-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium px-1">Select a Topic</h3>
                {CHAT_TOPICS.map((topic) => (
                  <Card 
                    key={topic.id} 
                    className={`cursor-pointer border transition-all hover:border-primary ${selectedTopic === topic.id ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => handleSelectTopic(topic.id)}
                  >
                    <CardContent className="p-3 flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        {renderIcon(topic.icon)}
                      </div>
                      <div>
                        <h4 className="font-medium">{topic.title}</h4>
                        <p className="text-xs text-muted-foreground">{topic.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="flex-1 overflow-auto">
              <div className="space-y-2 py-2">
                <h3 className="text-sm font-medium px-1">Recent Conversations</h3>
                
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No conversation history yet</p>
                  <p className="text-sm">Your chat history will appear here</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="pt-4 mt-auto">
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Connecting to an advisor",
                  description: "Please wait while we connect you to a live advisor...",
                });
              }}
            >
              Connect with Live Advisor
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full bg-background">
        {/* Chat header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            {!sidebarOpen && (
              <Button variant="ghost" size="sm" onClick={toggleSidebar} className="mr-2 h-8 w-8 p-0">
                <PanelRight className="h-4 w-4" />
              </Button>
            )}
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>EV</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium">EuroVisa Assistant</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>24/7 Support</span>
          </Badge>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : message.sender === 'system'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted'
                }`}
              >
                {message.sender !== 'user' && (
                  <div className="flex items-center mb-1">
                    <Avatar className="h-6 w-6 mr-2">
                      {message.sender === 'agent' ? (
                        <AvatarImage src="/placeholder.svg" />
                      ) : (
                        <CheckCircle className="h-6 w-6" />
                      )}
                      <AvatarFallback>{message.sender === 'agent' ? 'EV' : 'S'}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">
                      {message.sender === 'agent' ? 'EuroVisa Assistant' : 'System'}
                    </span>
                  </div>
                )}
                <p>{message.content}</p>
                <div className="text-xs opacity-70 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {/* Show frequent questions if a topic is selected */}
          {selectedTopic && !loading && messages[messages.length - 1]?.sender !== 'user' && (
            <div className="flex justify-center my-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {FREQUENT_QUESTIONS[selectedTopic].map((question) => (
                  <Button 
                    key={question.id} 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSelectQuestion(question)}
                    className="border-primary/30 hover:border-primary hover:bg-primary/10"
                  >
                    {question.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                <div className="flex space-x-2 items-center">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} disabled={!input.trim() || loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-center mt-3">
            <Button 
              variant="link" 
              size="sm" 
              className="text-xs text-muted-foreground"
              onClick={() => {
                toast({
                  title: "Helpful tip",
                  description: "You can also schedule a video consultation with an advisor for more personalized assistance.",
                });
              }}
            >
              Need more help? Schedule a consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
