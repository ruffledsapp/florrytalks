import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SearchResult {
  title: string;
  content: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  onResultSelect?: (result: SearchResult) => void;
}

const SearchResults = ({ results, isLoading, onResultSelect }: SearchResultsProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-secondary/50 rounded-lg p-6 h-48 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                expandedIndex === index ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setExpandedIndex(expandedIndex === index ? null : index);
                if (onResultSelect) onResultSelect(result);
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                  {result.title}
                </CardTitle>
                <motion.div
                  animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {expandedIndex === index ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </motion.div>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {expandedIndex === index ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-muted-foreground"
                    >
                      {result.content}
                    </motion.div>
                  ) : (
                    <motion.div className="line-clamp-2 text-muted-foreground">
                      {result.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchResults;