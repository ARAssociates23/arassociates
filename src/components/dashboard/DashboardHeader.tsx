
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Home, BarChart3 } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import InvestorCountCard from './InvestorCountCard';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onRefresh: () => void;
  onAddInvestor: () => void;
  onGoHome: () => void;
  loading: boolean;
  showDashboard: boolean;
  onToggleDashboard: () => void;
  totalInvestors?: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onSearch,
  onRefresh,
  onAddInvestor,
  onGoHome,
  loading,
  showDashboard,
  onToggleDashboard,
  totalInvestors = 0
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleRefresh = () => {
    setSearchQuery('');
    onRefresh();
  };

  const handleGoHome = () => {
    setSearchQuery('');
    onGoHome();
  };

  return (
    <div className="space-y-4">
      {/* Top row with search and main actions */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-center lg:justify-between">
        {/* Search Bar - Full width on mobile, flex-1 on desktop */}
        <div className="flex-1 max-w-md lg:max-w-lg">
          <SearchBar onSearch={handleSearch} value={searchQuery} />
        </div>

        {/* Action Buttons - Mobile: 2 columns, Desktop: inline */}
        <div className="grid grid-cols-2 gap-2 lg:flex lg:gap-3 lg:items-center">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            size="sm"
            className="text-blue-400 border-blue-800/30 hover:bg-blue-900/20 hover:text-blue-300 transition-all duration-300 hover:shadow-sm glass"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Sync</span>
          </Button>

          <Button
            onClick={onAddInvestor}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Investor</span>
            <span className="sm:hidden">Add</span>
          </Button>

          <Button
            onClick={handleGoHome}
            variant="outline"
            size="sm"
            className="text-emerald-400 border-emerald-800/30 hover:bg-emerald-900/20 hover:text-emerald-300 transition-all duration-300 hover:shadow-sm glass"
          >
            <Home className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Home</span>
            <span className="sm:hidden">Home</span>
          </Button>

          <Button
            onClick={onToggleDashboard}
            variant="outline"
            size="sm"
            className="text-purple-400 border-purple-800/30 hover:bg-purple-900/20 hover:text-purple-300 transition-all duration-300 hover:shadow-sm glass"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">
              {showDashboard ? 'View List' : 'Dashboard'}
            </span>
            <span className="sm:hidden">
              {showDashboard ? 'List' : 'Chart'}
            </span>
          </Button>
        </div>
      </div>

      {/* Investor Count Card */}
      <div className="lg:hidden">
        <InvestorCountCard totalInvestors={totalInvestors} loading={loading} />
      </div>
      
      {/* Desktop: Show count in a horizontal layout */}
      <div className="hidden lg:block">
        <InvestorCountCard totalInvestors={totalInvestors} loading={loading} />
      </div>
    </div>
  );
};

export default DashboardHeader;
