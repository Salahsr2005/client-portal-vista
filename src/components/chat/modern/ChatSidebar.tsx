
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Search, MessageSquarePlus, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatContext } from './ChatProvider';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  onCreateChat: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onCreateChat }) => {
  const { chatRooms, activeChat, setActiveChat, isLoading } = useChatContext();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredRooms = chatRooms.filter(room =>
    room.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className="h-full flex flex-col border-r border-border/50 rounded-none shadow-lg bg-gradient-to-b from-background to-muted/10">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Messages</h2>
              <p className="text-xs text-muted-foreground">Support Chat</p>
            </div>
          </div>
          <Button
            onClick={onCreateChat}
            size="sm"
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-md"
          >
            <MessageSquarePlus className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-violet-400"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 animate-pulse">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquarePlus className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start a conversation with our support team
              </p>
              <Button
                onClick={onCreateChat}
                className="bg-gradient-to-r from-violet-500 to-purple-600"
              >
                Start New Chat
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              {filteredRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-muted/50 group",
                    activeChat === room.id && "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200/50 dark:border-violet-800/50"
                  )}
                  onClick={() => setActiveChat(room.id)}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-violet-400 to-purple-500 text-white font-medium">
                        <Users className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    {room.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {room.unread_count > 9 ? '9+' : room.unread_count}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        "font-medium truncate text-sm",
                        room.unread_count > 0 ? "text-foreground" : "text-foreground/80"
                      )}>
                        {room.title}
                      </h3>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(room.last_message_time)}</span>
                      </div>
                    </div>
                    
                    {room.last_message_text && (
                      <p className={cn(
                        "text-xs truncate mt-1",
                        room.unread_count > 0 ? "text-muted-foreground font-medium" : "text-muted-foreground/70"
                      )}>
                        {room.last_message_text}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        {room.participants.map((participant, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs px-2 py-0 bg-muted/50"
                          >
                            {participant.participant_type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
