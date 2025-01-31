import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything..."
          className="w-full px-6 py-4 text-lg rounded-full border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Search className="w-6 h-6 text-gray-500" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;