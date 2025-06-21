
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface InvestorCountCardProps {
  totalInvestors: number;
  loading?: boolean;
}

const InvestorCountCard: React.FC<InvestorCountCardProps> = ({ totalInvestors, loading }) => {
  return (
    <Card className="glass-card bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-800/30 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-blue-500/20 rounded-full">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-blue-200/80 uppercase tracking-wide">
              Total Investors
            </p>
            {loading ? (
              <div className="h-6 sm:h-8 w-12 sm:w-16 bg-blue-400/20 rounded animate-pulse mt-1"></div>
            ) : (
              <p className="text-xl sm:text-2xl font-bold text-blue-300 mt-1">
                {totalInvestors.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorCountCard;
