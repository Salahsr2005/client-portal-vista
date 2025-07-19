
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Smile,
  Paperclip,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  User,
  Bot,
  CheckCheck,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatContext } from './ChatProvider';
import { cn } from '@/lib/utils';

export const ChatWindow: React.FC = () => {
  const { messages, activeChat, chatRooms, sendMessage, isSending } = useChatContext();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeRoom = chatRooms.find(room => room.id === activeChat);

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

  const formatMessageTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MessageBubble = ({ message, isOwn }: { message: any; isOwn: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex items-end space-x-2 mb-6",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && (
        <Avatar className="w-8 h-8 border-2 border-background shadow-sm">
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-xs">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn(
        "max-w-[70%] group",
        isOwn ? "order-first" : ""
      )}>
        <div className={cn(
          "px-4 py-3 rounded-2xl shadow-sm relative",
          isOwn 
            ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-br-md" 
            : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 text-foreground rounded-bl-md border border-border/50"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
          
          <div className={cn(
            "flex items-center justify-end space-x-1 mt-2 opacity-70",
            isOwn ? "text-white/80" : "text-muted-foreground"
          )}>
            <span className="text-xs">
              {formatMessageTime(message.sent_at)}
            </span>
            {isOwn && (
              <CheckCheck className="w-3 h-3" />
            )}
          </div>
        </div>
      </div>

      {isOwn && (
        <Avatar className="w-8 h-8 border-2 border-background shadow-sm">
          <AvatarFallback className="bg-gradient-to-br from-violet-400 to-purple-500 text-white text-xs">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );

  if (!activeChat) {
    return (
      <Card className="h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
            <Send className="w-12 h-12 text-violet-500" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Select a conversation</h3>
          <p className="text-muted-foreground max-w-md">
            Choose a conversation from the sidebar to start messaging with our support team
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col shadow-lg border-border/50">
      {/* Header */}
      <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-background to-muted/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{activeRoom?.title}</h3>
              <p className="text-xs text-muted-foreground flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Support Team</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hover:bg-muted/50">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted/50">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted/50">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-4">
                <Send className="w-10 h-10 text-violet-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Start the conversation</h3>
              <p className="text-muted-foreground">
                Send a message to begin chatting with our support team
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender_type === 'Client'}
                />
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <Separator />

        {/* Message Input */}
        <div className="p-6 bg-gradient-to-r from-background to-muted/5">
          <div className="flex items-end space-x-3">
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                <Smile className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="pr-12 py-3 bg-muted/30 border-muted-foreground/20 focus:border-violet-400 rounded-xl"
                disabled={isSending}
              />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-md px-6 py-3 rounded-xl"
            >
              {isSending ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
