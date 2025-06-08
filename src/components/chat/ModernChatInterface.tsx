
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSelection from './AdminSelection';
import RealtimeChat from './RealtimeChat';
import AIChatBot from './AIChatBot';
import { Admin } from '@/hooks/useAvailableAdmins';

export default function ModernChatInterface() {
  const [activeTab, setActiveTab] = useState('admin');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const handleSelectAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
  };

  const handleBackToAdmins = () => {
    setSelectedAdmin(null);
  };

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
          <div className="h-full">
            {selectedAdmin ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center space-x-2 mb-4 p-2 bg-muted/30 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToAdmins}
                    className="shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">Chat with {selectedAdmin.full_name}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <RealtimeChat selectedAdmin={selectedAdmin} />
                </div>
              </div>
            ) : (
              <AdminSelection onSelectAdmin={handleSelectAdmin} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="h-[calc(100%-4rem)]">
          <AIChatBot />
        </TabsContent>
      </Tabs>
    </div>
  );
}
