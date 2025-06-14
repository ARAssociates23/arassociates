
import React, { useState, useEffect } from 'react';
import { Home, RefreshCw, BarChart, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileBottomNavProps {
  onRefresh: () => void;
  onAddInvestor: () => void;
  onGoHome: () => void;
  loading: boolean;
  showDashboard?: boolean;
  onToggleDashboard?: () => void;
}

const MobileBottomNav = ({ 
  onRefresh, 
  onAddInvestor, 
  onGoHome, 
  loading,
  showDashboard = false,
  onToggleDashboard 
}: MobileBottomNavProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-all duration-300 ease-in-out",
      isScrolled 
        ? "bottom-4 left-4 right-4" 
        : "bottom-0 left-0 right-0"
    )}>
      <div className={cn(
        "glass-card backdrop-blur-xl bg-slate-900/80 border-slate-700/50 transition-all duration-300",
        isScrolled 
          ? "rounded-2xl mx-0 shadow-2xl border" 
          : "rounded-t-2xl border-t border-l-0 border-r-0 border-b-0"
      )}>
        <div className="flex items-center justify-around p-3">
          {/* Home Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onGoHome}
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-slate-300 hover:text-white hover:bg-slate-800/50"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Button>

          {/* Refresh Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-slate-300 hover:text-white hover:bg-slate-800/50"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs font-medium">Refresh</span>
          </Button>

          {/* Dashboard Toggle Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleDashboard}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-slate-800/50",
              showDashboard 
                ? "text-blue-400 bg-blue-900/30" 
                : "text-slate-300 hover:text-white"
            )}
          >
            <BarChart className="h-5 w-5" />
            <span className="text-xs font-medium">Stats</span>
          </Button>

          {/* Add Investor Button */}
          <Button 
            size="sm"
            onClick={onAddInvestor}
            className="flex flex-col items-center gap-1 h-auto py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="text-xs font-medium">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
