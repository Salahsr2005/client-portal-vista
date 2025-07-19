
// This file has been replaced by the modern chat system
// All functionality is now handled by ChatProvider in src/components/chat/modern/
export const useClientAdminChat = () => {
  console.warn('useClientAdminChat is deprecated. Use the modern chat system instead.');
  return {
    chatRooms: [],
    activeChat: null,
    setActiveChat: () => {},
    messages: [],
    isLoading: false,
    isTyping: false,
    onlineUsers: new Set(),
    sendMessage: async () => {},
    createChatWithAdmin: async () => null,
    markAsRead: async () => {},
    loadChatRooms: async () => {}
  };
};
