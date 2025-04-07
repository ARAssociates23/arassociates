
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onChange, 
  value = '', 
  placeholder = "Search...",
  loading = false 
}) => {
  const [query, setQuery] = useState(value);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    };

    checkAuth();
    // Listen for storage events (in case user logs out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Update local state when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSearch = () => {
    if (isAuthenticated) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isAuthenticated) {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex w-full gap-2">
      <Input
        type="text"
        placeholder={placeholder || (isMobile ? "Search investors..." : "Search by name, mobile number, folio number, or ARN code...")}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
        disabled={!isAuthenticated || loading}
      />
      <Button 
        onClick={handleSearch}
        className="bg-finance hover:bg-finance-dark"
        disabled={!isAuthenticated || loading}
        size={isMobile ? "icon" : "default"}
      >
        <Search className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        {!isMobile && <span className="ml-2">Search</span>}
      </Button>
    </div>
  );
};

export default SearchBar;
