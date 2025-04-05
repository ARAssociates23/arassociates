
import { useState, useEffect } from 'react';
import { InvestorDetails } from '@/types/investor';
import { 
  searchInvestors, 
  getInvestorByPan, 
  getAllInvestors, 
  addInvestor, 
  editInvestor, 
  deleteInvestor 
} from '@/services/investorService';
import { useToast } from '@/hooks/use-toast';

export const useInvestors = () => {
  const [searchResults, setSearchResults] = useState<InvestorDetails[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetails | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load all investors on hook initialization
  useEffect(() => {
    loadAllInvestors();
  }, []);

  const loadAllInvestors = async () => {
    setLoading(true);
    try {
      const allInvestors = await getAllInvestors();
      setSearchResults(allInvestors);
      setHasSearched(false);
      setLoading(false);
    } catch (error) {
      console.error("Error loading investors:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load investors",
        variant: "destructive",
      });
    }
  };

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
      setLoading(false);

      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "No investors match your search criteria.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Search results",
          description: `Found ${results.length} investor${results.length > 1 ? 's' : ''}.`,
        });
      }
    } catch (error) {
      console.error("Error searching investors:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to search investors",
        variant: "destructive",
      });
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
        toast({
          title: "Error",
          description: "Could not find investor details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching investor details:", error);
      toast({
        title: "Error",
        description: "Failed to load investor details",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSaveInvestor = async (investor: InvestorDetails, isEditing: boolean) => {
    setLoading(true);
    try {
      if (isEditing) {
        const success = await editInvestor(investor);
        if (success) {
          // Update the selected investor if it's the one being edited
          if (selectedInvestor && selectedInvestor.pan === investor.pan) {
            setSelectedInvestor(investor);
          }
          
          // Update search results if the edited investor is in the list
          setSearchResults(prevResults => 
            prevResults.map(i => i.pan === investor.pan ? investor : i)
          );
          
          toast({
            title: "Investor updated",
            description: `${investor.name} has been updated successfully.`,
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update investor.",
            variant: "destructive",
          });
        }
      } else {
        const success = await addInvestor(investor);
        if (success) {
          // Add the new investor to the search results if we're showing all investors
          if (!hasSearched) {
            setSearchResults(prevResults => [...prevResults, investor]);
          }
          toast({
            title: "Success",
            description: `Investor ${investor.name} has been added successfully.`,
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add investor.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error saving investor:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the investor",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteInvestor = async (pan: string) => {
    setLoading(true);
    try {
      const success = await deleteInvestor(pan);
      if (success) {
        // If the deleted investor was the selected one, clear it
        if (selectedInvestor && selectedInvestor.pan === pan) {
          setSelectedInvestor(null);
        }
        
        // Update search results if the deleted investor was in the list
        setSearchResults(prevResults => 
          prevResults.filter(investor => investor.pan !== pan)
        );
        
        toast({
          title: "Investor deleted",
          description: "Investor has been deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete investor.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting investor:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the investor",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return {
    searchResults,
    selectedInvestor,
    hasSearched,
    loading,
    setSelectedInvestor,
    loadAllInvestors,
    handleSearch,
    handleViewDetails,
    handleSaveInvestor,
    handleDeleteInvestor
  };
};
