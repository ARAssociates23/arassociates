
import React from 'react';
import { InvestorDetails } from '@/types/investor';
import InvestorDetailsSection from '@/components/dashboard/InvestorDetailsSection';
import InvestorListWrapper from '@/components/dashboard/InvestorListWrapper';
import InvestmentDashboard from '@/components/dashboard/InvestmentDashboard';

interface MainContentProps {
  showDashboard: boolean;
  loading: boolean;
  selectedInvestor: InvestorDetails | null;
  searchResults: InvestorDetails[];
  hasSearched: boolean;
  onViewDetails: (pan: string) => void;
  onEditInvestor: (pan: string) => void;
  onDeleteInvestor: (pan: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  showDashboard,
  loading,
  selectedInvestor,
  searchResults,
  hasSearched,
  onViewDetails,
  onEditInvestor,
  onDeleteInvestor
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12 transition-all duration-300 ease-out">
        <div className="animate-pulse">
          <p className="text-blue-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Dashboard or Investor List view
  return (
    <div className="space-y-8 animate-fade-in transition-all duration-500 ease-out">
      {showDashboard ? (
        <div className="transform transition-all duration-500 ease-out">
          <InvestmentDashboard />
        </div>
      ) : (
        <div className="transform transition-all duration-500 ease-out">
          {/* Selected investor details */}
          <InvestorDetailsSection 
            investor={selectedInvestor} 
            onEditInvestor={onEditInvestor}
          />

          {/* List of investors */}
          <InvestorListWrapper 
            loading={loading}
            searchResults={searchResults}
            hasSearched={hasSearched}
            onViewDetails={onViewDetails}
            onEditInvestor={onEditInvestor}
            onDeleteInvestor={onDeleteInvestor}
          />
        </div>
      )}
    </div>
  );
};

export default MainContent;
