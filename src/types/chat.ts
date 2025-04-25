
export type SenderType = "user" | "system" | "agent";

export interface Message {
  id: string;
  content: string;
  sender: SenderType;
  timestamp: Date;
}

export interface ChatOption {
  id: string;
  label: string;
  action: string;
}

export interface ChatTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
}
