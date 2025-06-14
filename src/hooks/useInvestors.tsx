
import { useEffect, useState } from 'react';
import { useAuthCheck } from './useAuthCheck';
import { useInvestorData } from './useInvestorData';
import { useInvestorActions } from './useInvestorActions';

export const useInvestors = () => {
  const { isAuthenticated, isAuthChecking } = useAuthCheck();
  const [hasInitialized, setHasInitialized] = useState(false);
  
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
    loadAllInvestors,
    selectedInvestor,
    setSelectedInvestor
  );

  // Load all investors only once when authenticated
  useEffect(() => {
    if (isAuthenticated && !isAuthChecking && !hasInitialized) {
      console.log("Initializing investors load...");
      setHasInitialized(true);
      loadAllInvestors();
    }
  }, [isAuthenticated, isAuthChecking, hasInitialized, loadAllInvestors]);

  // Combine loading states
  const loading = isAuthChecking || dataLoading || actionsLoading;

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
