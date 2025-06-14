
import React, { useState } from 'react';
import { Search, RefreshCw, PlusCircle, Users, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import SearchBar from '@/components/SearchBar';

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
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0 transition-all duration-300 ease-out">Investor Management</h1>
        
        {/* Desktop Action Buttons - Hidden on mobile */}
        <div className="hidden lg:flex flex-wrap gap-2 justify-center sm:justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={onToggleDashboard}
                  className={cn(
                    "transition-all duration-300 ease-out transform hover:scale-110 active:scale-95",
                    !showDashboard
                      ? "bg-blue-800/50 text-white border-blue-700/50 shadow-lg shadow-blue-500/20"
                      : "bg-slate-800/70 text-white border-slate-700 hover:bg-slate-700/70"
                  )}
                >
                  <Users className="h-4 w-4 transition-transform duration-200 ease-out" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Investor List</p>
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
                  className="bg-slate-800/70 text-white border-slate-700 transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 hover:bg-slate-700/70"
                >
                  <RefreshCw className={`h-4 w-4 transition-all duration-300 ease-out ${loading ? 'animate-spin' : ''}`} />
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
                  onClick={onGoHome}
                  className={cn(
                    "transition-all duration-300 ease-out transform hover:scale-110 active:scale-95",
                    showDashboard 
                      ? "bg-blue-800/50 text-white border-blue-700/50 shadow-lg shadow-blue-500/20" 
                      : "bg-slate-800/70 text-white border-slate-700 hover:bg-slate-700/70"
                  )}
                >
                  <BarChart className="h-4 w-4 transition-transform duration-200 ease-out" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showDashboard ? "Hide Dashboard" : "Show Dashboard"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button 
            onClick={onAddInvestor}
            className="bg-blue-700 hover:bg-blue-600 text-white transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl shadow-blue-500/25"
          >
            <PlusCircle className="h-4 w-4 mr-2 transition-transform duration-200 ease-out" />
            Add Investor
          </Button>
        </div>
      </div>

      {/* Search bar with dark theme */}
      <div className="bg-slate-800/70 backdrop-blur-md p-4 rounded-lg shadow-sm border border-slate-700/50 transition-all duration-300 ease-out hover:bg-slate-800/80">
        <SearchBar 
          onSearch={handleSearchSubmit} 
          onChange={handleSearchChange}
          value={queryStr}
          placeholder="Search by name, PAN, or scheme..."
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
