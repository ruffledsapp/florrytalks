import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import ChatWindow from "@/components/ChatWindow";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface SearchResult {
  title: string;
  content: string;
}

const Index = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      console.log('Initiating search with query:', query);
      
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('search', {
        body: { query }
      });

      if (error) {
        console.error('Search function error:', error);
        throw error;
      }

      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('User fetch error:', userError);
        throw userError;
      }

      // Log the search in our database
      const { error: insertError } = await supabase
        .from('search_logs')
        .insert({
          query,
          perplexity_results: data,
          user_id: userData.user?.id
        });

      if (insertError) {
        console.error('Search log insertion error:', insertError);
        throw insertError;
      }

      console.log('Search results received:', data);

      // Parse and format the results
      const formattedResults = data.choices[0].message.content
        .split('\n')
        .filter(Boolean)
        .map((result: string) => ({
          title: result.substring(0, result.indexOf(':')),
          content: result.substring(result.indexOf(':') + 1).trim()
        }));

      setResults(formattedResults);
      toast.success('Search completed successfully');
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to complete search. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            FlorryCo
          </h1>
          <p className="text-lg text-gray-600">
            Explore and discover with AI-powered insights
          </p>
        </motion.div>
        <SearchBar onSearch={handleSearch} />
        <SearchResults results={results} isLoading={isLoading} />
      </div>
      <ChatWindow />
    </div>
  );
};

export default Index;