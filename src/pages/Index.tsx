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
  const [lastQuery, setLastQuery] = useState<string>("");

  const handleSearch = async (query: string) => {
    if (query.trim() === lastQuery.trim()) {
      toast.info("You've already searched for this query");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setLastQuery(query.trim());
    
    try {
      console.log('Initiating search with query:', query);
      
      const { data: response, error: functionError } = await supabase.functions.invoke('search', {
        body: { query }
      });

      if (functionError) {
        console.error('Search function error:', functionError);
        throw new Error(functionError.message);
      }

      if (!response?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from search function');
      }

      // Parse and format the results with validation
      const formattedResults = response.choices[0].message.content
        .split('\n')
        .filter(line => line.includes(':'))
        .map((result: string) => {
          const colonIndex = result.indexOf(':');
          const title = result.substring(0, colonIndex).trim();
          const content = result.substring(colonIndex + 1).trim();
          
          // Additional validation
          if (!title || !content || title.length < 2 || content.length < 5) {
            console.warn('Skipping invalid result:', { title, content });
            return null;
          }
          
          return { title, content };
        })
        .filter((result): result is SearchResult => result !== null);

      console.log('Formatted search results:', formattedResults);

      // Log the search in our database
      const { error: insertError } = await supabase
        .from('search_logs')
        .insert({
          query,
          perplexity_results: response,
        });

      if (insertError) {
        console.error('Search log insertion error:', insertError);
        toast.error('Failed to save search history');
      }

      setResults(formattedResults);
      
      if (formattedResults.length === 0) {
        toast.warning('No results found. Try rephrasing your search query.');
      } else {
        toast.success(`Found ${formattedResults.length} relevant results`);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message || 'Failed to complete search. Please try again.');
      toast.error('Search failed. Please try again.');
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