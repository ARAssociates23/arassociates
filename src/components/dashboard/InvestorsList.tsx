
import React from 'react';
import { InvestorDetails } from '@/types/investor';
import SearchResults from '@/components/SearchResults';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface InvestorsListProps {
  results: InvestorDetails[];
  hasSearched: boolean;
  onViewDetails: (pan: string) => void;
  onEditInvestor: (pan: string) => void;
  onDeleteInvestor: (pan: string) => void;
}

const InvestorsList: React.FC<InvestorsListProps> = ({ 
  results, 
  hasSearched, 
  onViewDetails, 
  onEditInvestor, 
  onDeleteInvestor 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <section className="animate-fade-in">
      <h3 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-300 mb-4 select-none hover:text-blue-500 dark:hover:text-blue-200 transition-colors">
        {hasSearched ? "Search Results" : "All Investors"}
      </h3>
      {results.length > 0 ? (
        <div className={`bg-white dark:bg-transparent rounded-lg ${isMobile ? '' : 'shadow-md dark:glass-card'}`}>
          <SearchResults 
            results={results} 
            onViewDetails={onViewDetails}
            onEditInvestor={onEditInvestor}
            onDeleteInvestor={onDeleteInvestor}
          />
        </div>
      ) : (
        <Card className="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:glass-card shadow-md">
          {hasSearched 
            ? "No investors found matching your search criteria." 
            : "No investors found in the system. Add your first investor to get started."}
        </Card>
      )}
    </section>
  );
};

export default InvestorsList;
