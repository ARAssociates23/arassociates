
import { useState, useCallback } from 'react';
import { InvestorDetails } from '@/types/investor';
import { 
  searchInvestors, 
  getInvestorByPan, 
  getAllInvestors
} from '@/services/investorService';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

export const useInvestorData = (isAuthenticated: boolean) => {
  const [searchResults, setSearchResults] = useState<InvestorDetails[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetails | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast: uiToast } = useToast();

  const loadAllInvestors = useCallback(async () => {
    if (!isAuthenticated) {
      console.log("Not authenticated, skipping investor load");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching all investors...");
      const allInvestors = await getAllInvestors();
      console.log("Fetched investors:", allInvestors.length);
      setSearchResults(allInvestors);
      setHasSearched(false);
    } catch (error) {
      console.error("Error loading investors:", error);
      toast.error("Failed to load investors. Please check your connection and try again.");
      uiToast({
        title: "Error",
        description: "Failed to load investors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, uiToast]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadAllInvestors();
      return;
    }

    setLoading(true);
    try {
      const results = await searchInvestors(query);
      setSearchResults(results);
      setSelectedInvestor(null);
      setHasSearched(true);

      if (results.length === 0) {
        uiToast({
          title: "No results found",
          description: "No investors match your search criteria.",
          variant: "destructive",
        });
      } else {
        uiToast({
          title: "Search results",
          description: `Found ${results.length} investor${results.length > 1 ? 's' : ''}.`,
        });
      }
    } catch (error) {
      console.error("Error searching investors:", error);
      uiToast({
        title: "Error",
        description: "Failed to search investors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (pan: string) => {
    setLoading(true);
    try {
      const investor = await getInvestorByPan(pan);
      if (investor) {
        setSelectedInvestor(investor);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        uiToast({
          title: "Error",
          description: "Could not find investor details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching investor details:", error);
      uiToast({
        title: "Error",
        description: "Failed to load investor details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    searchResults,
    selectedInvestor,
    hasSearched, 
    loading,
    setSelectedInvestor,
    loadAllInvestors,
    handleSearch,
    handleViewDetails
  };
};
