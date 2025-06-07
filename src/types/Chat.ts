
export interface ChatMessage {
  id: string;
  text: string;
  sender: {
    id: string;
    type: 'client' | 'admin' | 'system';
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  isTyping?: boolean;
  chat_id?: string;
  reply_to?: string;
}

export interface ChatRoom {
  id: string;
  title: string;
  client_id: string;
  admin_id: string;
  last_message?: string;
  last_message_time?: Date;
  unread_count: number;
  is_active: boolean;
  client_name: string;
  admin_name: string;
  created_at: Date;
}

export interface ChatParticipant {
  id: string;
  name: string;
  type: 'client' | 'admin';
  avatar?: string;
  is_online?: boolean;
  last_seen?: Date;
}
