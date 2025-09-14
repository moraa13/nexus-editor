import React, { useState, useMemo } from 'react';
import { useDebouncedSearch } from '../../hooks/useDebounce';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { cn } from '../../lib/utils';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'dialogue' | 'character' | 'quest' | 'skill';
  relevance: number;
}

interface OptimizedSearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
  className?: string;
  minLength?: number;
  maxResults?: number;
}

export default function OptimizedSearch({
  onSearch,
  placeholder = "Search dialogues, characters, quests...",
  className,
  minLength = 2,
  maxResults = 50
}: OptimizedSearchProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounced search
  const {
    searchValue,
    setSearchValue,
    debouncedSearchValue,
    isSearching: isDebouncing
  } = useDebouncedSearch('', 300);

  // Intersection observer for results list
  const { ref: resultsRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1
  });

  // Perform search when debounced value changes
  React.useEffect(() => {
    if (debouncedSearchValue.length >= minLength) {
      setIsSearching(true);
      setError(null);
      
      onSearch(debouncedSearchValue)
        .then((searchResults) => {
          setResults(searchResults.slice(0, maxResults));
          setShowResults(true);
          setIsSearching(false);
        })
        .catch((err) => {
          setError(err.message);
          setResults([]);
          setIsSearching(false);
        });
    } else {
      setResults([]);
      setShowResults(false);
      setIsSearching(false);
    }
  }, [debouncedSearchValue, onSearch, minLength, maxResults]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSelectedIndex(-1);
  };

  // Handle clear
  const handleClear = () => {
    setSearchValue('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    console.log('Selected result:', result);
    setShowResults(false);
    setSelectedIndex(-1);
    // Handle result selection here
  };

  // Memoized result items
  const resultItems = useMemo(() => {
    return results.map((result, index) => (
      <SearchResultItem
        key={result.id}
        result={result}
        isSelected={index === selectedIndex}
        onClick={() => handleResultClick(result)}
        onMouseEnter={() => setSelectedIndex(index)}
      />
    ));
  }, [results, selectedIndex]);

  // Get type icon
  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'dialogue': return '💬';
      case 'character': return '👤';
      case 'quest': return '🎯';
      case 'skill': return '⚡';
      default: return '📄';
    }
  };

  // Get type color
  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'dialogue': return 'text-blue-400';
      case 'character': return 'text-green-400';
      case 'quest': return 'text-yellow-400';
      case 'skill': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={cn("relative w-full max-w-lg", className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching || isDebouncing ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => {
            // Delay hiding to allow clicks on results
            setTimeout(() => setShowResults(false), 150);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (results.length > 0 || isSearching || error) && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
        >
          {error && (
            <div className="p-3 text-red-400 text-sm border-b border-gray-700">
              ❌ {error}
            </div>
          )}
          
          {isSearching && (
            <div className="p-3 text-gray-400 text-sm border-b border-gray-700 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          )}
          
          {results.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-700">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
              {resultItems}
            </div>
          )}
          
          {!isSearching && !error && results.length === 0 && debouncedSearchValue.length >= minLength && (
            <div className="p-3 text-gray-400 text-sm text-center">
              No results found for "{debouncedSearchValue}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Search result item component
interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

function SearchResultItem({ result, isSelected, onClick, onMouseEnter }: SearchResultItemProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "px-3 py-2 cursor-pointer transition-colors",
        isSelected ? "bg-blue-600" : "hover:bg-gray-700"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">{getTypeIcon(result.type)}</span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-white truncate">
              {result.title}
            </h4>
            <span className={cn("text-xs px-2 py-0.5 rounded", getTypeColor(result.type))}>
              {result.type}
            </span>
          </div>
          
          {result.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {result.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-gray-700 rounded-full h-1">
              <div 
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${result.relevance * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {Math.round(result.relevance * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getTypeIcon(type: SearchResult['type']): string {
  switch (type) {
    case 'dialogue': return '💬';
    case 'character': return '👤';
    case 'quest': return '🎯';
    case 'skill': return '⚡';
    default: return '📄';
  }
}

function getTypeColor(type: SearchResult['type']): string {
  switch (type) {
    case 'dialogue': return 'text-blue-400';
    case 'character': return 'text-green-400';
    case 'quest': return 'text-yellow-400';
    case 'skill': return 'text-purple-400';
    default: return 'text-gray-400';
  }
}


