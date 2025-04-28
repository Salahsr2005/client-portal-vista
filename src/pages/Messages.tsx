
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";

const MessagesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Query to get or create chat with admin
  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: ["chat", user?.id],
    queryFn: async () => {
      if (!user) return null;

      // First try to find existing chat
      const { data: existingChat } = await supabase
        .from("chats")
        .select("*")
        .eq("is_group_chat", false)
        .eq("is_active", true)
        .single();

      if (existingChat) {
        setChatId(existingChat.chat_id);
        return existingChat;
      }

      // If no chat exists, create one with first available admin
      const { data: adminData } = await supabase
        .from("admin_users")
        .select("admin_id")
        .eq("status", "Active")
        .limit(1)
        .single();

      if (adminData) {
        const { data: newChat, error } = await supabase.rpc(
          "create_client_admin_chat",
          {
            p_client_id: user.id,
            p_admin_id: adminData.admin_id,
            p_title: "Support Chat"
          }
        );

        if (error) throw error;
        setChatId(newChat);
        return newChat;
      }

      return null;
    },
    enabled: !!user
  });

  // Query to get messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      if (!chatId) return [];

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("sent_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!chatId
  });

  // Subscribe to new messages
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          console.log("New message:", payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !chatId || !user) return;

    try {
      await supabase.from("chat_messages").insert({
        chat_id: chatId,
        sender_id: user.id,
        sender_type: "Client",
        message_text: message
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="container max-w-6xl py-8">
        <Card className="p-8 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in to access messages</h2>
          <p className="text-muted-foreground mb-4">
            You need to be signed in to view and send messages
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <Card className="flex flex-col h-[600px]">
        <div className="p-4 border-b flex items-center gap-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="Advisor" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">Your Advisor</h3>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>

        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.message_id}
                className={`flex ${
                  msg.sender_type === "Client" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[80%] ${
                    msg.sender_type === "Client" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg"
                      alt={msg.sender_type === "Client" ? "You" : "Advisor"}
                    />
                    <AvatarFallback>
                      {msg.sender_type === "Client" ? "YO" : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      msg.sender_type === "Client"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {msg.message_text}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.sent_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MessagesPage;
