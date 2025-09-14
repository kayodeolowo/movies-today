"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  currentQuery?: string;
  placeholder?: string;
}

export default function SearchBar({ onSearch, onClear, currentQuery = "", placeholder = "Search movies..." }: SearchBarProps) {
  const [query, setQuery] = useState(currentQuery);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      onSearch(debouncedQuery);
    } else if (debouncedQuery.length === 0 && currentQuery && currentQuery.length > 0) {
      onClear();
    }
  }, [debouncedQuery, onSearch, onClear, currentQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && query.length >= 3) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-12 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

      </div>
      
      {/* Search suggestions or recent searches could go here */}
      {query.length > 0 && query.length < 3 && (
        <div className="absolute top-full left-0 right-0 mt-1 text-sm text-gray-500 dark:text-gray-400 text-center">
          Type at least 3 characters to search
        </div>
      )}
    </form>
  );
}