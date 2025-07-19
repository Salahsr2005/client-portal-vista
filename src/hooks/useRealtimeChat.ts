
// This file has been replaced by the modern chat system
// All functionality is now handled by ChatProvider in src/components/chat/modern/
export const useRealtimeChat = () => {
  console.warn('useRealtimeChat is deprecated. Use the modern chat system instead.');
  return {
    messages: [],
    isLoading: false,
    isSending: false,
    isTyping: false,
    sendMessage: async () => {},
    chatId: null
  };
};
