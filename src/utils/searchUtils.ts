import { SearchResult } from "@/types/search";

export const processSearchResults = (rawResults: any): SearchResult[] => {
  console.log('Processing raw search results:', rawResults);
  
  if (!rawResults?.choices?.[0]?.message?.content) {
    console.warn('Invalid result format received:', rawResults);
    return [];
  }

  try {
    const results = rawResults.choices[0].message.content;
    console.log('Formatted results:', results);
    return results;
  } catch (error) {
    console.error('Error processing search results:', error);
    return [];
  }
};

export const validateQuery = (query: string, lastQuery: string): string | null => {
  if (!query.trim()) {
    return "Search query cannot be empty";
  }
  if (query.trim() === lastQuery.trim()) {
    return "This query was just searched";
  }
  return null;
};