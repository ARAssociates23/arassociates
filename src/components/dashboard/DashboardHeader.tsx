
import React from 'react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import { RefreshCw, UserPlus, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
          <Button 
            variant="outline"
            onClick={onGoHome}
            className="mr-4"
            size={isMobile ? "sm" : "default"}
          >
            <Home className="h-4 w-4 mr-2" /> Home
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold text-finance">Client Management</h2>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3 w-full">
        <div className="w-full">
          <SearchBar onSearch={onSearch} />
        </div>
        
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline"
            onClick={onRefresh}
            className="flex-1 justify-center"
            disabled={loading}
            size={isMobile ? "sm" : "default"}
          >
            <RefreshCw className="h-4 w-4 mr-2" /> All Investors
          </Button>
          <Button 
            className="bg-finance hover:bg-finance-dark flex-1 justify-center" 
            onClick={onAddInvestor}
            disabled={loading}
            size={isMobile ? "sm" : "default"}
          >
            <UserPlus className="h-4 w-4 mr-2" /> Add Investor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
