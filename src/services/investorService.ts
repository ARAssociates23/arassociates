import { supabase } from "@/integrations/supabase/client";
import { InvestorDetails } from '../types/investor';
import { mapDbInvestorToAppInvestor, mapInvestorToNomineeDetails } from './mappers/investorMapper';
import { InvestorRow } from './types/investorTypes';
import { getInvestorByPan } from './searchService';
import { toast } from 'sonner';

// Re-export getInvestorByPan to maintain API compatibility
export { getInvestorByPan } from './searchService';
export { searchInvestors } from './searchService';

// Get all investors for the current user
export const getAllInvestors = async (): Promise<InvestorDetails[]> => {
  try {
    // Get current session first to ensure we're authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error('Authentication error:', sessionError || 'No active session');
      toast.error("Authentication error. Please log in again.");
      return [];
    }
    
    const userId = sessionData.session.user.id;
    console.log("Fetching investors for user ID:", userId);
    
    const { data: investors, error } = await supabase
      .from('investors')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching investors:', error);
      toast.error("Failed to fetch investors");
      return [];
    }
    
    console.log(`Retrieved ${investors?.length || 0} investors`);
    
    // Convert database format to application format
    return (investors || []).map(investor => mapDbInvestorToAppInvestor(investor as InvestorRow));
  } catch (error) {
    console.error('Error in getAllInvestors:', error);
    toast.error("Failed to load investors data");
    return [];
  }
};

// Add new investor 
export const addInvestor = async (investor: InvestorDetails): Promise<boolean> => {
  try {
    // Get the current user's ID
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user.id;

    if (!userId) {
      console.error("No user ID found. User must be authenticated");
      toast.error("Authentication required");
      return false;
    }

    // Prepare nominee details as JSON
    const nomineeDetails = mapInvestorToNomineeDetails(investor);

    const { error } = await supabase
      .from('investors')
      .insert({
        pan: investor.pan,
        name: investor.name,
        address: investor.address,
        mobile: investor.mobile,
        email: investor.email,
        residential_status: investor.residentialStatus,
        nationality: investor.nationality,
        annual_income: investor.annualIncome,
        mothers_name: investor.mothersName,
        occupation: investor.occupation,
        nominee_details: nomineeDetails,
        bank_name: investor.bankName,
        bank_branch: investor.bankBranch,
        account_number: investor.accountNumber,
        ifsc: investor.ifsc,
        account_type: investor.accountType,
        arn: investor.schemes[0]?.arnCode || '',
        folio_number: investor.schemes[0]?.folioNo || '',
        schemes: investor.schemes,
        user_id: userId
      });
    
    if (error) {
      console.error('Error adding investor:', error);
      toast.error(`Failed to add investor: ${error.message}`);
      return false;
    }
    
    toast.success(`Investor ${investor.name} added successfully`);
    return true;
  } catch (error) {
    console.error('Error in addInvestor:', error);
    toast.error("Failed to add investor");
    return false;
  }
};

// Edit existing investor
export const editInvestor = async (updatedInvestor: InvestorDetails): Promise<boolean> => {
  try {
    // Prepare nominee details as JSON
    const nomineeDetails = mapInvestorToNomineeDetails(updatedInvestor);

    const { error } = await supabase
      .from('investors')
      .update({
        name: updatedInvestor.name,
        address: updatedInvestor.address,
        mobile: updatedInvestor.mobile,
        email: updatedInvestor.email,
        residential_status: updatedInvestor.residentialStatus,
        nationality: updatedInvestor.nationality,
        annual_income: updatedInvestor.annualIncome,
        mothers_name: updatedInvestor.mothersName,
        occupation: updatedInvestor.occupation,
        nominee_details: nomineeDetails,
        bank_name: updatedInvestor.bankName,
        bank_branch: updatedInvestor.bankBranch,
        account_number: updatedInvestor.accountNumber,
        ifsc: updatedInvestor.ifsc,
        account_type: updatedInvestor.accountType,
        arn: updatedInvestor.schemes[0]?.arnCode || '',
        folio_number: updatedInvestor.schemes[0]?.folioNo || '',
        schemes: updatedInvestor.schemes
      })
      .eq('pan', updatedInvestor.pan);
    
    if (error) {
      console.error('Error updating investor:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in editInvestor:', error);
    return false;
  }
};

// Delete investor
export const deleteInvestor = async (pan: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('investors')
      .delete()
      .eq('pan', pan);
    
    if (error) {
      console.error('Error deleting investor:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteInvestor:', error);
    return false;
  }
};
