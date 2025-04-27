
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Send, User, Bot, Clock, HelpCircle, BarChart, 
  FileQuestion, GraduationCap, Briefcase, Plane, 
  LucideIcon, Calendar, MessageSquare
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Topic {
  icon: LucideIcon;
  name: string;
  description: string;
  questions: string[];
}

// Predefined topics and questions
const topics: Topic[] = [
  {
    icon: GraduationCap,
    name: "Education",
    description: "Study programs, universities, and academic requirements",
    questions: [
      "What educational programs do you offer?",
      "How can I choose the right university?",
      "What are the entry requirements for European universities?",
      "Do I need language certifications?",
      "What scholarships are available?"
    ]
  },
  {
    icon: Plane,
    name: "Visas",
    description: "Student visa applications, documents, and processing",
    questions: [
      "What documents do I need for a student visa?",
      "How long does the visa process take?",
      "Can my family visit me on a student visa?",
      "What are common visa rejection reasons?",
      "Can I work on a student visa?"
    ]
  },
  {
    icon: Briefcase,
    name: "Career",
    description: "Work opportunities, internships, and post-study options",
    questions: [
      "Can I work while studying in Europe?",
      "What internship opportunities are available?",
      "How can I stay after graduating?",
      "What's the job market like for international graduates?",
      "Do you help with job placement?"
    ]
  },
  {
    icon: Calendar,
    name: "Appointments",
    description: "Schedule consultations and meetings with advisors",
    questions: [
      "How can I schedule a personal consultation?",
      "What should I prepare for my appointment?",
      "Can I meet with a specific advisor?",
      "How long do consultations typically last?",
      "Is there a fee for appointments?"
    ]
  },
  {
    icon: BarChart,
    name: "Services",
    description: "Our services, fees, and application assistance",
    questions: [
      "What services does Euro Visa offer?",
      "What are your service fees?",
      "Do you help with accommodation?",
      "Can you help me throughout the entire application process?",
      "What's included in your standard package?"
    ]
  }
];

interface Message {
  id: string;
  content: string;
  sender: "user" | "system" | "agent";
  timestamp: Date;
}

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

  const handleTopicSelect = (topic: Topic) => {
    setActiveChat(topic.name);
    // Add system message about the selected topic
    const newMessages = [
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

  const handleQuestionSelect = async (question: string) => {
    // Add user question
    const updatedMessages: Message[] = [
      ...messages,
      {
        id: Date.now().toString() + "-q",
        content: question,
        sender: "user",
        timestamp: new Date()
      }
    ];
    
    setMessages(updatedMessages);
    setIsTyping(true);
    
    // If no chat has been created yet, create one
    if (!chatId && user) {
      try {
        // Find an available admin
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("admin_id")
          .eq("status", "Active")
          .limit(1)
          .single();
          
        if (adminData) {
          // Use stored procedure to create chat
          const { data: newChatData, error: chatError } = await supabase
            .rpc('create_client_admin_chat', {
              p_client_id: user.id,
              p_admin_id: adminData.admin_id,
              p_title: 'Support Chat'
            });
            
          if (chatError) throw chatError;
          setChatId(newChatData);
          
          // Save the message
          if (newChatData) {
            await supabase.from("chat_messages").insert({
              chat_id: newChatData,
              sender_id: user.id,
              sender_type: "Client",
              message_text: question
            });
          }
        }
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    } else if (chatId && user) {
      // If chat exists, just save the new message
      try {
        await supabase.from("chat_messages").insert({
          chat_id: chatId,
          sender_id: user.id,
          sender_type: "Client",
          message_text: question
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    }
    
    // Simulate response after a delay
    setTimeout(() => {
      setIsTyping(false);
      
      let response = "";
      
      // Match questions with canned responses
      if (question.includes("programs") || question.includes("university")) {
        response = "We offer assistance with undergraduate, graduate, PhD programs and professional certifications across Europe. Our advisors can help you find programs that match your academic background, budget, and career goals.";
      } else if (question.includes("documents") || question.includes("visa")) {
        response = "For student visas, you typically need: a valid passport, proof of acceptance from a university, proof of financial means, health insurance, and accommodation arrangements. Requirements vary by country, and our advisors can provide country-specific guidance.";
      } else if (question.includes("work")) {
        response = "Most European countries allow international students to work part-time during their studies. The specific hours vary by country - typically 20 hours per week during term and full-time during holidays. We can provide detailed information about work regulations for your specific destination.";
      } else if (question.includes("schedule") || question.includes("appointment")) {
        response = "You can schedule a personal consultation through our appointments page. We offer both online and in-person meetings with our education advisors who can provide personalized guidance for your situation.";
      } else if (question.includes("fees") || question.includes("services")) {
        response = "Our services include program selection, application assistance, visa guidance, accommodation support, and pre-departure orientation. Service fees depend on the package you choose. We offer basic, standard, and premium packages to match different needs and budgets.";
      } else {
        response = "Thank you for your question. One of our advisors will respond to you shortly. If you'd like immediate assistance, you can schedule a consultation through our appointments page.";
      }
      
      // Add system response
      const agentMessage: Message = {
        id: Date.now().toString() + "-a",
        content: response,
        sender: "agent",
        timestamp: new Date()
      };

      setMessages([...updatedMessages, agentMessage]);
      
      // If we have a chat ID, save the response
      if (chatId) {
        try {
          supabase.auth.getSession().then(({ data }) => {
            const adminId = data.session?.user?.id;
            
            if (adminId) {
              supabase.from("chat_messages").insert({
                chat_id: chatId,
                sender_id: "system", // Use a system ID for automated responses
                sender_type: "System",
                message_text: response
              });
            }
          });
        } catch (error) {
          console.error("Error saving response:", error);
        }
      }
    }, 1500);
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
    
    // Handle message saving to database
    if (!chatId && user) {
      try {
        // Create logic similar to question selection
        // This would create a chat and save the message
      } catch (error) {
        console.error("Error handling message:", error);
      }
    }
    
    // Simulate response
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

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Support Chat</h1>
        <p className="text-muted-foreground">
          Get quick answers or connect with our advisors
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Topics Section - Visible on larger screens */}
        <Card className="p-6 hidden md:block">
          <h2 className="font-semibold text-xl mb-4">Select a Topic</h2>
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
        </Card>
        
        {/* Mobile Topic Selection - Visible on small screens */}
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
                      document.body.click(); // Close sheet by simulating a click outside
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
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Chat Section */}
        <div className="md:col-span-2">
          <Card className="flex flex-col h-[600px]">
            {/* Chat header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="text-primary mr-2 h-5 w-5" />
                <h2 className="font-semibold">
                  {activeChat ? `${activeChat} Support` : "Euro Visa Support"}
                </h2>
              </div>
              <Tabs defaultValue="chat" className="w-32">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Chat content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <TabsContent value="chat" className="m-0 h-full space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : msg.sender === "system"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender === "user" ? (
                          <User className="h-4 w-4" />
                        ) : msg.sender === "system" ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="text-xs font-medium">
                          {msg.sender === "user" ? "You" : msg.sender === "system" ? "System" : "Advisor"}
                        </span>
                        <span className="text-xs opacity-70">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="faq" className="m-0 h-full space-y-6">
                {activeChat ? (
                  <>
                    {topics
                      .find((t) => t.name === activeChat)
                      ?.questions.map((question, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-2 px-3"
                          onClick={() => handleQuestionSelect(question)}
                        >
                          <FileQuestion className="mr-2 h-4 w-4 shrink-0 text-primary" />
                          <span>{question}</span>
                        </Button>
                      ))}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Topic</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a topic from the left to see frequently asked questions.
                    </p>
                  </div>
                )}
              </TabsContent>
            </div>
            
            {/* Chat input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
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
