
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full max-w-2xl gap-2">
      <Input
        type="text"
        placeholder="Search by name, mobile number, folio number, or ARN code..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button 
        onClick={handleSearch}
        className="bg-finance hover:bg-finance-dark"
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
