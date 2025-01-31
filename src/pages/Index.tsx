import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ChatWindow from "@/components/ChatWindow";
import Footer from "@/components/Footer";

interface Message {
  content: string;
  isAI: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { content: query, isAI: false }]);
    
    // Temporary response for demonstration
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          content: "I understand you're asking about " + query + ". Let me help you with that.",
          isAI: true,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            FlorryCo
          </h1>
          <p className="text-lg text-gray-600">
            Explore and chat with AI-powered insights
          </p>
        </div>
        <SearchBar onSearch={handleSearch} />
        <ChatWindow messages={messages} isLoading={isLoading} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;