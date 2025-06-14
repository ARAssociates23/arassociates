
import React, { useState } from 'react';
import { Search, RefreshCw, PlusCircle, Home, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import SearchBar from '@/components/SearchBar';
import MobileBottomNav from './MobileBottomNav';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onRefresh: () => void;
  onAddInvestor: () => void;
  onGoHome: () => void;
  loading: boolean;
  showDashboard?: boolean;
  onToggleDashboard?: () => void;
}

const DashboardHeader = ({ 
  onSearch, 
  onRefresh, 
  onAddInvestor, 
  onGoHome, 
  loading,
  showDashboard = false,
  onToggleDashboard 
}: DashboardHeaderProps) => {
  const [queryStr, setQueryStr] = useState('');

  const handleSearchChange = (value: string) => {
    setQueryStr(value);
  };

  const handleSearchSubmit = () => {
    onSearch(queryStr);
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">Investor Management</h1>
          
          {/* Desktop Action Buttons - Hidden on mobile */}
          <div className="hidden lg:flex flex-wrap gap-2 justify-center sm:justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={onGoHome}
                    className="bg-slate-800/70 text-white border-slate-700"
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={onRefresh}
                    disabled={loading}
                    className="bg-slate-800/70 text-white border-slate-700"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={onToggleDashboard}
                    className={showDashboard 
                      ? "bg-blue-800/50 text-white border-blue-700/50" 
                      : "bg-slate-800/70 text-white border-slate-700"}
                  >
                    <BarChart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showDashboard ? "Hide Dashboard" : "Show Dashboard"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button 
              onClick={onAddInvestor}
              className="bg-blue-700 hover:bg-blue-600 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Investor
            </Button>
          </div>
        </div>

        {/* Search bar with dark theme */}
        <div className="bg-slate-800/70 backdrop-blur-md p-4 rounded-lg shadow-sm border border-slate-700/50">
          <SearchBar 
            onSearch={handleSearchSubmit} 
            onChange={handleSearchChange}
            value={queryStr}
            placeholder="Search by name, PAN, or scheme..."
            loading={loading}
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onRefresh={onRefresh}
        onAddInvestor={onAddInvestor}
        onGoHome={onGoHome}
        loading={loading}
        showDashboard={showDashboard}
        onToggleDashboard={onToggleDashboard}
      />
    </>
  );
};

export default DashboardHeader;
