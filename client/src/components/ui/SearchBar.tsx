import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceTime?: number;
}

const SearchBar = React.memo(
  ({
    onSearch,
    placeholder = "Search notes...",
    debounceTime = 300,
  }: SearchBarProps) => {
    const [query, setQuery] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        onSearch(query);
        setIsTyping(false);
      }, debounceTime);

      return () => clearTimeout(timer);
    }, [query, debounceTime, onSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      if (value.trim() !== "") {
        setIsTyping(true);
      } else {
        setIsTyping(false);
        onSearch("");
      }
    };

    return (
      <div className="relative w-full max-w-2xl mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark"
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            aria-label="Search notes"
          />
          {isTyping && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-pulse text-gray-400 text-xs">
                Searching...
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.debounceTime === nextProps.debounceTime &&
    prevProps.onSearch === nextProps.onSearch
);

export default SearchBar;
