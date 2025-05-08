
import { useState } from 'react';
import { InvestorDetails } from '@/types/investor';
import { addInvestor, editInvestor, deleteInvestor } from '@/services/investorService';
import { useToast } from '@/hooks/use-toast';

export const useInvestorActions = (
  setSearchResults: React.Dispatch<React.SetStateAction<InvestorDetails[]>>,
  selectedInvestor: InvestorDetails | null,
  setSelectedInvestor: React.Dispatch<React.SetStateAction<InvestorDetails | null>>,
  hasSearched: boolean
) => {
  const [loading, setLoading] = useState(false);
  const { toast: uiToast } = useToast();

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
          
          uiToast({
            title: "Investor updated",
            description: `${investor.name} has been updated successfully.`,
          });
        } else {
          uiToast({
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
          uiToast({
            title: "Success",
            description: `Investor ${investor.name} has been added successfully.`,
          });
        } else {
          uiToast({
            title: "Error",
            description: "Failed to add investor.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error saving investor:", error);
      uiToast({
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
        
        uiToast({
          title: "Investor deleted",
          description: "Investor has been deleted successfully.",
        });
      } else {
        uiToast({
          title: "Error",
          description: "Failed to delete investor.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting investor:", error);
      uiToast({
        title: "Error",
        description: "An error occurred while deleting the investor",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return {
    loading,
    handleSaveInvestor,
    handleDeleteInvestor
  };
};
