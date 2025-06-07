
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import ClientAdminChat from './ClientAdminChat';
import AIChatBot from './AIChatBot';

export default function ModernChatInterface() {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <div className="h-[calc(100vh-12rem)] bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="admin" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Admin Chat</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Assistant</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="h-[calc(100%-4rem)]">
          <ClientAdminChat />
        </TabsContent>

        <TabsContent value="ai" className="h-[calc(100%-4rem)]">
          <AIChatBot />
        </TabsContent>
      </Tabs>
    </div>
  );
}
