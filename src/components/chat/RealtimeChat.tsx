
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Loader2,
  User,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types/Chat';
import { Admin } from '@/hooks/useAvailableAdmins';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';

interface RealtimeChatProps {
  selectedAdmin: Admin;
}

export default function RealtimeChat({ selectedAdmin }: RealtimeChatProps) {
  const { messages, isLoading, isSending, sendMessage } = useRealtimeChat(selectedAdmin);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    
    await sendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
          {isOwn ? (
            <AvatarFallback className="bg-blue-500 text-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage src={selectedAdmin.photo_url} alt={selectedAdmin.full_name} />
              <AvatarFallback className="bg-gray-500 text-white">
                {selectedAdmin.first_name[0]}{selectedAdmin.last_name[0]}
              </AvatarFallback>
            </>
          )}
        </Avatar>
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isOwn 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          <div className={`flex items-center justify-end space-x-1 mt-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            <span className="text-xs">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isOwn && message.status && (
              <div className="text-xs">
                {message.status === 'sending' && <Clock className="w-3 h-3" />}
                {message.status === 'sent' && <Check className="w-3 h-3" />}
                {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                {message.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-300" />}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={selectedAdmin.photo_url} alt={selectedAdmin.full_name} />
                  <AvatarFallback className="bg-gray-500 text-white">
                    {selectedAdmin.first_name[0]}{selectedAdmin.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-lg font-medium mb-2">Chat with {selectedAdmin.full_name}</h3>
              <p>Start a conversation with your advisor</p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.sender.type === 'client'}
                />
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <Separator />
        <div className="p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isSending}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim() || isSending}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
