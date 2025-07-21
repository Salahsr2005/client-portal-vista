
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { ChatProvider, useChatContext } from './ChatProvider';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { AdminSelector } from './AdminSelector';
import { useMediaQuery } from '@/hooks/use-mobile';

const ChatInterfaceContent: React.FC = () => {
  const [showAdminSelector, setShowAdminSelector] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const { createChat, activeChat } = useChatContext();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const handleCreateChat = () => {
    setShowAdminSelector(true);
  };

  const handleSelectAdmin = async (adminId: string) => {
    const chatId = await createChat(adminId);
    if (chatId) {
      setShowAdminSelector(false);
    }
  };

  // On mobile, hide sidebar when a chat is selected
  React.useEffect(() => {
    if (isMobile && activeChat) {
      setShowSidebar(false);
    }
  }, [isMobile, activeChat]);

  const handleBackToSidebar = () => {
    setShowSidebar(true);
  };

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] bg-gradient-to-br from-background via-muted/5 to-muted/10 rounded-xl overflow-hidden">
      <AnimatePresence mode="wait">
        {showAdminSelector ? (
          <motion.div
            key="admin-selector"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-full flex items-center justify-center p-3 md:p-6"
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
            className="h-full flex"
          >
            {/* Mobile Back Button */}
            {isMobile && !showSidebar && activeChat && (
              <div className="absolute top-4 left-4 z-50">
                <Button
                  onClick={handleBackToSidebar}
                  variant="ghost"
                  size="sm"
                  className="bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-muted/50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Sidebar */}
            <motion.div
              initial={false}
              animate={{
                x: isMobile && !showSidebar ? "-100%" : 0,
                width: isMobile ? "100%" : "33.333333%"
              }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`${isMobile ? "absolute inset-0 z-40" : "relative"} border-r border-border/50`}
            >
              <ChatSidebar onCreateChat={handleCreateChat} />
            </motion.div>

            {/* Chat Window */}
            <motion.div
              initial={false}
              animate={{
                x: isMobile && showSidebar ? "100%" : 0,
                width: isMobile ? "100%" : "66.666667%"
              }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`${isMobile ? "absolute inset-0 z-30" : "relative"}`}
            >
              <ChatWindow />
            </motion.div>
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
