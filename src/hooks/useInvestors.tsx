
import { useEffect } from 'react';
import { useAuthCheck } from './useAuthCheck';
import { useInvestorData } from './useInvestorData';
import { useInvestorActions } from './useInvestorActions';

export const useInvestors = () => {
  const { isAuthenticated, isAuthChecking } = useAuthCheck();
  
  const {
    searchResults,
    selectedInvestor,
    hasSearched,
    loading: dataLoading,
    setSelectedInvestor,
    loadAllInvestors,
    handleSearch,
    handleViewDetails
  } = useInvestorData(isAuthenticated);

  const {
    loading: actionsLoading,
    handleSaveInvestor,
    handleDeleteInvestor
  } = useInvestorActions(
    setSearchResults,
    selectedInvestor,
    setSelectedInvestor,
    hasSearched
  );

  // Load all investors on hook initialization
  useEffect(() => {
    if (isAuthenticated && !isAuthChecking) {
      loadAllInvestors();
    }
  }, [isAuthenticated, isAuthChecking]);

  // Combine loading states
  const loading = dataLoading || actionsLoading;

  return {
    searchResults,
    selectedInvestor,
    hasSearched,
    loading,
    isAuthenticated,
    isAuthChecking,
    setSelectedInvestor,
    loadAllInvestors,
    handleSearch,
    handleViewDetails,
    handleSaveInvestor,
    handleDeleteInvestor
  };
};

export default useInvestors;
