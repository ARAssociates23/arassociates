
import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, BarChart, PlusCircle } from 'lucide-react';
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
      "fixed lg:hidden transition-all duration-700 ease-in-out",
      "z-[100]", // Increased z-index to ensure it's above everything
      isScrolled 
        ? "bottom-4 left-4 right-4" 
        : "bottom-0 left-0 right-0"
    )}>
      <div className={cn(
        "backdrop-blur-3xl bg-slate-900/20 border-slate-700/20 transition-all duration-700 ease-out",
        isScrolled 
          ? "rounded-[2rem] mx-0 shadow-2xl border transform translate-y-0" 
          : "rounded-t-[2rem] border-t border-l-0 border-r-0 border-b-0 transform translate-y-0"
      )}>
        <div className="flex items-center justify-around p-3">
          {/* Investor List Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleDashboard}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-slate-800/30 rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 active:scale-95",
              !showDashboard 
                ? "text-blue-400 bg-blue-900/20 shadow-lg shadow-blue-500/10" 
                : "text-slate-300 hover:text-white"
            )}
          >
            <Users className="h-5 w-5 transition-transform duration-300 ease-out" />
            <span className="text-xs font-medium">Investors</span>
          </Button>

          {/* Refresh Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-slate-300 hover:text-white hover:bg-slate-800/30 rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 active:scale-95"
          >
            <RefreshCw className={`h-5 w-5 transition-all duration-500 ease-out ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs font-medium">Refresh</span>
          </Button>

          {/* Dashboard Toggle Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onGoHome}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-slate-800/30 rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 active:scale-95",
              showDashboard 
                ? "text-blue-400 bg-blue-900/20 shadow-lg shadow-blue-500/10" 
                : "text-slate-300 hover:text-white"
            )}
          >
            <BarChart className="h-5 w-5 transition-transform duration-300 ease-out" />
            <span className="text-xs font-medium">Stats</span>
          </Button>

          {/* Add Investor Button */}
          <Button 
            size="sm"
            onClick={onAddInvestor}
            className="flex flex-col items-center gap-1 h-auto py-2 px-4 bg-blue-600/80 hover:bg-blue-700/90 text-white border-0 rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl shadow-blue-500/15"
          >
            <PlusCircle className="h-5 w-5 transition-transform duration-300 ease-out" />
            <span className="text-xs font-medium">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
