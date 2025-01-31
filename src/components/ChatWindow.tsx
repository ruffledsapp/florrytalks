import { useState } from "react";
import MessageBubble from "./MessageBubble";
import LoadingIndicator from "./LoadingIndicator";

interface Message {
  content: string;
  isAI: boolean;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

const ChatWindow = ({ messages, isLoading = false }: ChatWindowProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-4">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          content={message.content}
          isAI={message.isAI}
        />
      ))}
      {isLoading && <LoadingIndicator />}
    </div>
  );
};

export default ChatWindow;