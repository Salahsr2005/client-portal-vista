
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMessages } from "@/hooks/useMessages";
import { useUserPaymentStatus } from "@/hooks/useUserPaymentStatus";
import { useApplications } from "@/hooks/useApplications";
import { MessageCircle, Send, Search, User, MessagesSquare, AlertTriangle, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";

// Type definition for formatted messages
interface FormattedMessage {
  id: string;
  subject: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  isIncoming: boolean;
  senderType: "Admin" | "Client" | "System";
  senderId: string;
  recipientType: string;
  recipientId: string;
  // Added properties for UI display
  displayName: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  avatar?: string;
  messages?: any[];
  isOnline?: boolean;
}

export default function Messages() {
  const { data: messages = [], isLoading } = useMessages();
  const { data: paymentStatus } = useUserPaymentStatus();
  const { data: applications = [] } = useApplications();
  
  // Group messages into conversations
  const [conversations, setConversations] = useState<FormattedMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<FormattedMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  
  const hasApprovedApplication = applications?.some(app => 
    app.status.toLowerCase() === 'approved' || app.status.toLowerCase() === 'under review'
  );
  
  const canAccessMessages = paymentStatus?.isPaid && hasApprovedApplication;
  
  useEffect(() => {
    // Transform raw messages into conversation format
    if (messages.length > 0) {
      const groupedConversations: Record<string, FormattedMessage> = {};
      
      messages.forEach(msg => {
        const conversationId = `${msg.senderId}-${msg.recipientId}`;
        const senderName = msg.senderType === 'Admin' ? 'Support Team' : 
                         msg.senderType === 'System' ? 'System' : 'You';
        
        if (!groupedConversations[conversationId]) {
          groupedConversations[conversationId] = {
            ...msg,
            displayName: senderName,
            lastMessage: msg.content,
            lastMessageTime: msg.sentAt,
            unread: msg.isRead ? 0 : 1,
            messages: [{
              id: msg.id,
              text: msg.content,
              time: msg.sentAt,
              isMe: !msg.isIncoming
            }],
            isOnline: false
          };
        } else {
          groupedConversations[conversationId].messages?.push({
            id: msg.id,
            text: msg.content,
            time: msg.sentAt,
            isMe: !msg.isIncoming
          });
          
          // Update last message data
          groupedConversations[conversationId].lastMessage = msg.content;
          groupedConversations[conversationId].lastMessageTime = msg.sentAt;
          
          // Update unread count
          if (!msg.isRead && msg.isIncoming) {
            groupedConversations[conversationId].unread += 1;
          }
        }
      });
      
      // Convert to array and sort by last message time
      const conversationsArray = Object.values(groupedConversations).sort((a, b) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
      
      setConversations(conversationsArray);
      
      // Select first conversation by default if none selected
      if (conversationsArray.length > 0 && !selectedConversation) {
        setSelectedConversation(conversationsArray[0]);
      }
    }
  }, [messages]);
  
  // Select the first conversation by default
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation && canAccessMessages) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation, canAccessMessages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Implement send message logic here
    console.log("Sending message:", newMessage);
    
    // Clear the input after sending
    setNewMessage("");
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    conv.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // FAQ data for users who can't access messages
  const faqs = [
    {
      question: "Why can't I access messages?",
      answer: "Messages are only available for users with approved applications and completed payments. This ensures our staff can focus on providing support to active clients."
    },
    {
      question: "How do I get access to messages?",
      answer: "To access messages, you need to: 1) Complete your payment (visit the Payments page), and 2) Submit an application that gets approved or is under review."
    },
    {
      question: "How can I contact support without messages?",
      answer: "You can reach our support team via email at support@eurovisadz.com or by phone at +213 XXXXXXXX during business hours."
    },
    {
      question: "When will my application be approved?",
      answer: "Application review typically takes 2-5 business days after submission and payment confirmation. You'll receive an email notification when your status changes."
    },
    {
      question: "What if my payment is still pending?",
      answer: "Payments are typically verified within 24-48 hours. If your payment has been pending for longer, please contact our finance team at finance@eurovisadz.com."
    }
  ];

  // If user doesn't have access to messages, show the FAQ section
  if (!canAccessMessages) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle>Message Access Restricted</CardTitle>
            </div>
            <CardDescription>
              Message access is available only to users with approved applications and completed payments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentStatus?.isPaid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    1
                  </div>
                  <span className="text-sm mt-2">Payment</span>
                </div>
                <div className="h-0.5 w-12 bg-gray-200"></div>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasApprovedApplication ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    2
                  </div>
                  <span className="text-sm mt-2">Application</span>
                </div>
                <div className="h-0.5 w-12 bg-gray-200"></div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                    3
                  </div>
                  <span className="text-sm mt-2">Messages</span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                  To access messages, you need to complete your payment and have an approved application. Once your payment is verified and your application is reviewed, you'll be able to communicate with our team here.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              {!paymentStatus?.isPaid && (
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => window.location.href = '/payments'}>
                  Complete Payment
                </Button>
              )}
              {!hasApprovedApplication && (
                <Button variant="outline" onClick={() => window.location.href = '/applications'}>
                  View Applications
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Chat with our support team and track your conversations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-250px)]">
        {/* Conversations Sidebar */}
        <Card className="col-span-1 md:col-span-4">
          <CardHeader className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          
          <Separator />
          
          <ScrollArea className="h-[calc(100vh-350px)]">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-start p-4 cursor-pointer hover:bg-accent transition-colors ${
                    selectedConversation?.id === conversation.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {conversation.avatar ? (
                      <img
                        src={conversation.avatar}
                        alt={conversation.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-medium truncate">{conversation.displayName}</h3>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(conversation.lastMessageTime), "HH:mm")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge className="ml-2 bg-primary">{conversation.unread}</Badge>
                  )}
                </div>
              ))
            )}
          </ScrollArea>
        </Card>

        {/* Chat Window */}
        <Card className="col-span-1 md:col-span-8 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="p-4 border-b flex-shrink-0">
                <div className="flex items-center">
                  {selectedConversation.avatar ? (
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.displayName}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{selectedConversation.displayName}</CardTitle>
                    <CardDescription>
                      {selectedConversation.isOnline ? "Online" : "Last seen recently"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages?.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.isMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <span className="text-xs opacity-70 block text-right mt-1">
                          {format(new Date(message.time), "HH:mm")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t mt-auto">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="flex-1 min-h-[60px] max-h-[120px]"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button 
                    size="icon" 
                    className="h-[60px] w-[60px]" 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessagesSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Select a Conversation</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
