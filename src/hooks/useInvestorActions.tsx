
import { useState } from 'react';
import { InvestorDetails } from '@/types/investor';
import { addInvestor, editInvestor, deleteInvestor } from '@/services/investorService';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

export const useInvestorActions = (
  loadAllInvestors: () => Promise<void>,
  selectedInvestor: InvestorDetails | null,
  setSelectedInvestor: React.Dispatch<React.SetStateAction<InvestorDetails | null>>
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
          
          // Refresh the list to show updated data
          await loadAllInvestors();
          
          uiToast({
            title: "Investor updated",
            description: `${investor.name} has been updated successfully.`,
          });
          toast.success(`Investor ${investor.name} updated successfully`);
        } else {
          uiToast({
            title: "Error",
            description: "Failed to update investor.",
            variant: "destructive",
          });
          toast.error("Failed to update investor");
        }
      } else {
        const success = await addInvestor(investor);
        if (success) {
          // Refresh the list to show updated data
          await loadAllInvestors();
          
          uiToast({
            title: "Success",
            description: `Investor ${investor.name} has been added successfully.`,
          });
          toast.success(`Investor ${investor.name} added successfully`);
        } else {
          uiToast({
            title: "Error",
            description: "Failed to add investor.",
            variant: "destructive",
          });
          toast.error("Failed to add investor");
        }
      }
    } catch (error) {
      console.error("Error saving investor:", error);
      uiToast({
        title: "Error",
        description: "An error occurred while saving the investor",
        variant: "destructive",
      });
      toast.error("An error occurred while saving the investor");
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
        
        // Refresh the list to show updated data
        await loadAllInvestors();
        
        uiToast({
          title: "Investor deleted",
          description: "Investor has been deleted successfully.",
        });
        toast.success("Investor deleted successfully");
      } else {
        uiToast({
          title: "Error",
          description: "Failed to delete investor.",
          variant: "destructive",
        });
        toast.error("Failed to delete investor");
      }
    } catch (error) {
      console.error("Error deleting investor:", error);
      uiToast({
        title: "Error",
        description: "An error occurred while deleting the investor",
        variant: "destructive",
      });
      toast.error("An error occurred while deleting the investor");
    }
    setLoading(false);
  };

  return {
    loading,
    handleSaveInvestor,
    handleDeleteInvestor
  };
};
