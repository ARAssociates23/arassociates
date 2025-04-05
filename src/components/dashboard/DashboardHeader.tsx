
import React from 'react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import { RefreshCw, UserPlus, Home } from 'lucide-react';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onRefresh: () => void;
  onAddInvestor: () => void;
  onGoHome: () => void;
  loading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onSearch, 
  onRefresh, 
  onAddInvestor, 
  onGoHome,
  loading 
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8">
      <div className="flex items-center">
        <Button 
          variant="outline"
          onClick={onGoHome}
          className="mr-4"
        >
          <Home className="h-4 w-4 mr-2" /> Home
        </Button>
        <h2 className="text-2xl font-bold text-finance">Client Management</h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
        <div className="flex-1">
          <SearchBar onSearch={onSearch} />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={onRefresh}
            className="whitespace-nowrap"
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" /> All Investors
          </Button>
          <Button 
            className="bg-finance hover:bg-finance-dark whitespace-nowrap" 
            onClick={onAddInvestor}
            disabled={loading}
          >
            <UserPlus className="h-4 w-4 mr-2" /> Add Investor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
