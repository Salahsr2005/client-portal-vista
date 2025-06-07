
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types/Chat';

export default function AIChatBot() {
  const { user } = useAuth();
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [aiMessage, setAiMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  const handleSendAiMessage = async () => {
    if (!aiMessage.trim() || !user) return;

    const userMessage: ChatMessage = {
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
      const response = await fetch('/functions/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          message: userMessage.text,
          history: aiMessages.slice(-10)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process your request at the moment.",
        sender: {
          id: 'ai',
          type: 'admin',
          name: 'AI Assistant'
        },
        timestamp: new Date()
      };

      setAiMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending AI message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: {
          id: 'ai',
          type: 'admin',
          name: 'AI Assistant'
        },
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const MessageBubble = ({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-end space-x-2 max-w-[80%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <Avatar className="w-8 h-8">
          <AvatarFallback className={`text-xs ${
            message.sender.type === 'admin'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : isOwn 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-500 text-white'
          }`}>
            {message.sender.type === 'admin' ? <Bot className="w-4 h-4" /> : 
             <User className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isOwn 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : message.sender.type === 'admin'
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
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
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
  );
}
