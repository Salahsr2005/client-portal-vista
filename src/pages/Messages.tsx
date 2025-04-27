
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import ChatInterface from "@/components/chat/ChatInterface";

const MessagesPage = () => {
  const { user } = useAuth();

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Messaging Center</h1>
      <p className="text-muted-foreground mb-8">
        Connect with our advisors and get answers to your questions
      </p>
      <ChatInterface />
    </div>
  );
};

export default MessagesPage;
