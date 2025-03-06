
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react';

// Sample data
const conversations = [
  {
    id: '1',
    name: 'Sarah Ahmed',
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

const messages = [
  {
    id: '1',
    sender: 'Sarah Ahmed',
    content: 'Hello! I have a question regarding the Study Abroad program.',
    timestamp: '10:05 AM',
    isMe: false,
  },
  {
    id: '2',
    sender: 'Me',
    content: 'Hi Sarah, I\'d be happy to help. What would you like to know?',
    timestamp: '10:10 AM',
    isMe: true,
  },
  {
    id: '3',
    sender: 'Sarah Ahmed',
    content: 'I saw that the application deadline is this Friday, but I need more time to gather all my documents. Is there any possibility of an extension?',
    timestamp: '10:15 AM',
    isMe: false,
  },
  {
    id: '4',
    sender: 'Me',
    content: 'I understand your concern. We can provide a one-week extension for your specific case. Would that be sufficient?',
    timestamp: '10:20 AM',
    isMe: true,
  },
  {
    id: '5',
    sender: 'Sarah Ahmed',
    content: 'Yes, that would be perfect! Thank you so much for your understanding.',
    timestamp: '10:25 AM',
    isMe: false,
  },
  {
    id: '6',
    sender: 'Sarah Ahmed',
    content: 'When will the application deadline be extended? I need to know the exact date to plan accordingly.',
    timestamp: '10:30 AM',
    isMe: false,
  },
];

const MessagesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    // In a real app, this would send the message to the API
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Left sidebar - Conversation list */}
        <div className="col-span-1 border rounded-lg overflow-hidden flex flex-col h-full">
          <div className="p-3 border-b">
            <div className="relative mb-3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
            {conversations
              .filter(convo => activeTab === 'all' || convo.unread > 0)
              .map(conversation => (
                <div 
                  key={conversation.id}
                  className={`p-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                    selectedConversation.id === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <img src={conversation.avatar} alt={conversation.name} />
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge variant="default" className="rounded-full h-5 w-5 p-0 flex items-center justify-center">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
              ))}
          </ScrollArea>
        </div>
        
        {/* Right side - Messages */}
        <div className="col-span-1 md:col-span-2 border rounded-lg flex flex-col h-full">
          {/* Chat header */}
          <div className="p-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <img src={selectedConversation.avatar} alt={selectedConversation.name} />
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedConversation.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedConversation.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Messages area */}
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[80%]">
                    {!message.isMe && (
                      <Avatar className="h-8 w-8">
                        <img src={selectedConversation.avatar} alt={selectedConversation.name} />
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        message.isMe
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 block text-right mt-1">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Input area */}
          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
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

export default MessagesPage;
