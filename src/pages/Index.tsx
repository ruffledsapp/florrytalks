import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import ChatWindow from "@/components/ChatWindow";
import { supabase } from "@/integrations/supabase/client";
import LoadingIndicator from "@/components/LoadingIndicator";

interface SearchResult {
  title: string;
  content: string;
}

const Index = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Initiating search with query:', query);
      
      const { data, error: functionError } = await supabase.functions.invoke('search', {
        body: { query }
      });

      if (functionError) {
        console.error('Search function error:', functionError);
        throw functionError;
      }

      // Log the search in our database
      const { error: insertError } = await supabase
        .from('search_logs')
        .insert({
          query,
          perplexity_results: data,
        });

      if (insertError) {
        console.error('Search log insertion error:', insertError);
        // Don't throw here, just log the error as it's not critical for the user
        toast.error('Failed to save search history');
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
      setError('Failed to complete search. Please try again.');
      toast.error('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    setSelectedResult(result);
    console.log('Selected result:', result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <LoadingIndicator />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center text-red-500"
            >
              {error}
            </motion.div>
          ) : (
            <SearchResults 
              results={results} 
              isLoading={isLoading} 
              onResultSelect={handleResultSelect}
            />
          )}
        </AnimatePresence>
      </div>
      <ChatWindow selectedResult={selectedResult} />
    </div>
  );
};

export default Index;