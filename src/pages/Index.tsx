import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import ChatWindow from "@/components/ChatWindow";
import AuthenticationLayer from "@/components/auth/AuthenticationLayer";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/components/AuthProvider";
import type { SearchResult } from "@/types/search";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LoadingIndicator from "@/components/LoadingIndicator";
import { processSearchResults, validateQuery } from "@/utils/searchUtils";
import { Icons } from "@/assets/icons";

const Index = () => {
  const { session, isLoading: authLoading } = useAuth();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>("");

  const handleSearch = async (query: string) => {
    if (!session?.user) {
      toast.error("Please sign in to search");
      return;
    }

    const validationError = validateQuery(query, lastQuery);
    if (validationError) {
      toast.info(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setLastQuery(query.trim());
    
    try {
      console.log('Initiating search with query:', query);
      
      const { data: response, error: functionError } = await supabase.functions.invoke('search', {
        body: { 
          query,
          user_id: session.user.id
        }
      });

      if (functionError) {
        console.error('Search function error:', functionError);
        throw new Error(functionError.message);
      }

      const processedResults = processSearchResults(response);
      console.log('Processed results:', processedResults);

      const { error: insertError } = await supabase
        .from('search_logs')
        .insert({
          query,
          perplexity_results: response,
          user_id: session.user.id
        });

      if (insertError) {
        console.error('Search log insertion error:', insertError);
        toast.error('Failed to save search history');
      }

      setResults(processedResults);
      
      if (processedResults.length === 0) {
        toast.warning('No results found. Try rephrasing your search query.');
      } else {
        toast.success(`Found ${processedResults.length} relevant results`);
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (!session) {
    return <AuthenticationLayer />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-handwritten font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            FlurryTalks
          </h1>
          <p className="text-lg text-gray-600 font-handwritten">
            Explore and discover with AI-powered insights
          </p>
        </motion.div>

        <AuthenticationLayer />

        {session && (
          <>
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
            <ChatWindow selectedResult={selectedResult} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;