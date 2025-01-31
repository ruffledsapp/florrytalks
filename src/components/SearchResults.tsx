import { motion } from "framer-motion";

interface SearchResult {
  title: string;
  content: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

const SearchResults = ({ results, isLoading }: SearchResultsProps) => {
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
      {results.map((result, index) => (
        <motion.div
          key={index}
          className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
          <p className="text-gray-600">{result.content}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SearchResults;