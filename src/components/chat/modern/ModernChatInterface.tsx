
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ChatProvider, useChatContext } from './ChatProvider';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { AdminSelector } from './AdminSelector';

const ChatInterfaceContent: React.FC = () => {
  const [showAdminSelector, setShowAdminSelector] = useState(false);
  const { createChat } = useChatContext();

  const handleCreateChat = () => {
    setShowAdminSelector(true);
  };

  const handleSelectAdmin = async (adminId: string) => {
    const chatId = await createChat(adminId);
    if (chatId) {
      setShowAdminSelector(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] bg-gradient-to-br from-background via-muted/5 to-muted/10 rounded-xl overflow-hidden">
      <AnimatePresence mode="wait">
        {showAdminSelector ? (
          <motion.div
            key="admin-selector"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-full flex items-center justify-center p-6"
          >
            <div className="w-full max-w-2xl">
              <Button
                onClick={() => setShowAdminSelector(false)}
                variant="ghost"
                className="mb-4 hover:bg-muted/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Chat
              </Button>
              <AdminSelector
                onSelectAdmin={handleSelectAdmin}
                onClose={() => setShowAdminSelector(false)}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat-interface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full grid grid-cols-1 lg:grid-cols-3 gap-0"
          >
            <div className="lg:col-span-1 border-r border-border/50">
              <ChatSidebar onCreateChat={handleCreateChat} />
            </div>
            <div className="lg:col-span-2">
              <ChatWindow />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ModernChatInterface: React.FC = () => {
  return (
    <ChatProvider>
      <ChatInterfaceContent />
    </ChatProvider>
  );
};
