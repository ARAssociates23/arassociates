
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
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

  return (
    <div className="flex w-full gap-2">
      <Input
        type="text"
        placeholder={isMobile ? "Search investors..." : "Search by name, mobile number, folio number, or ARN code..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
        disabled={!isAuthenticated}
      />
      <Button 
        onClick={handleSearch}
        className="bg-finance hover:bg-finance-dark"
        disabled={!isAuthenticated}
        size={isMobile ? "icon" : "default"}
      >
        <Search className="h-4 w-4" />
        {!isMobile && <span className="ml-2">Search</span>}
      </Button>
    </div>
  );
};

export default SearchBar;
