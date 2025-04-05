
import React from 'react';
import { InvestorDetails } from '@/types/investor';
import SearchResults from '@/components/SearchResults';
import { Card } from '@/components/ui/card';

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
  return (
    <section>
      <h3 className="text-xl font-semibold text-finance mb-4">
        {hasSearched ? "Search Results" : "All Investors"}
      </h3>
      {results.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <SearchResults 
            results={results} 
            onViewDetails={onViewDetails}
            onEditInvestor={onEditInvestor}
            onDeleteInvestor={onDeleteInvestor}
          />
        </div>
      ) : (
        <Card className="p-8 text-center text-gray-500">
          {hasSearched 
            ? "No investors found matching your search criteria." 
            : "No investors found in the system. Add your first investor to get started."}
        </Card>
      )}
    </section>
  );
};

export default InvestorsList;
