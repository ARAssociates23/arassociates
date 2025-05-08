
import React from 'react';
import { InvestorDetails } from '@/types/investor';
import InvestorsList from '@/components/dashboard/InvestorsList';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';

interface InvestorListWrapperProps {
  loading: boolean;
  searchResults: InvestorDetails[];
  hasSearched: boolean;
  onViewDetails: (pan: string) => void;
  onEditInvestor: (pan: string) => void;
  onDeleteInvestor: (pan: string) => void;
}

const InvestorListWrapper: React.FC<InvestorListWrapperProps> = ({ 
  loading,
  searchResults,
  hasSearched,
  onViewDetails,
  onEditInvestor,
  onDeleteInvestor
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-blue-300">Loading investors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search results or all investors */}
      <InvestorsList 
        results={searchResults}
        hasSearched={hasSearched}
        onViewDetails={onViewDetails}
        onEditInvestor={onEditInvestor}
        onDeleteInvestor={onDeleteInvestor}
      />

      {/* Initial state message */}
      <WelcomeMessage show={!hasSearched && searchResults.length === 0} />
    </div>
  );
};

export default InvestorListWrapper;
