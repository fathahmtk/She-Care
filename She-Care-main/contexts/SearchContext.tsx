import React, { createContext, useState, useContext, ReactNode } from 'react';

/**
 * Defines the shape of the search context, including the search query
 * and a function to update it.
 */
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Create the context with an undefined default value.
const SearchContext = createContext<SearchContextType | undefined>(undefined);

/**
 * The SearchProvider component wraps parts of the application and provides
 * search state and functionality to its children.
 */
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * A custom hook to easily access the search context.
 * This abstracts away the `useContext` hook and provides error handling.
 * @returns {SearchContextType} The search context.
 */
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    // This error is thrown if useSearch is used outside of a SearchProvider.
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
