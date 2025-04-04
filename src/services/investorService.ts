
import { supabase } from "@/integrations/supabase/client";
import { InvestorDetails } from '../types/investor';
import { Database } from "@/integrations/supabase/types";

type InvestorRow = Database['public']['Tables']['investors']['Row'];

// Get all investors for the current user
export const getAllInvestors = async (): Promise<InvestorDetails[]> => {
  try {
    const { data: investors, error } = await supabase
      .from('investors')
      .select('*');
    
    if (error) {
      console.error('Error fetching investors:', error);
      return [];
    }
    
    // Convert database format to application format
    return (investors || []).map(investor => mapDbInvestorToAppInvestor(investor));
  } catch (error) {
    console.error('Error in getAllInvestors:', error);
    return [];
  }
};

// Helper function to map database investor to application investor format
const mapDbInvestorToAppInvestor = (investor: InvestorRow): InvestorDetails => {
  return {
    pan: investor.pan,
    name: investor.name,
    address: investor.address || '',
    mobile: investor.mobile || '',
    email: investor.email || '',
    residentialStatus: '',
    nationality: 'INDIAN',
    annualIncome: '',
    mothersName: '',
    occupation: '',
    
    // Nominee details - these are simplified in the database, so using defaults here
    nomineeName: '',
    nomineeDob: '',
    nomineeRelationship: '',
    nomineeAadhar: '',
    nomineeIsNri: false,
    nomineePassport: '',
    nomineeExpiryDate: '',
    nomineeAddress: '',
    
    // Bank details
    bankName: investor.bank_name || '',
    bankBranch: '',
    accountNumber: investor.account_number || '',
    ifsc: investor.ifsc || '',
    accountType: '',
    
    // Scheme details - simplified for now
    schemes: [{
      amc: '',
      schemeName: '',
      folioNo: investor.folio_number || '',
      sipLs: 'SIP',
      amountInvested: 0,
      dateStarted: '',
      arnCode: investor.arn || ''
    }]
  };
};

// Search function that takes a query string and returns matching investors
export const searchInvestors = async (query: string): Promise<InvestorDetails[]> => {
  if (!query || query.trim() === '') {
    return getAllInvestors();
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  try {
    // Search across multiple columns
    const { data: investors, error } = await supabase
      .from('investors')
      .select('*')
      .or(`name.ilike.%${normalizedQuery}%,pan.ilike.%${normalizedQuery}%,mobile.ilike.%${normalizedQuery}%,arn.ilike.%${normalizedQuery}%,folio_number.ilike.%${normalizedQuery}%`);
    
    if (error) {
      console.error('Error searching investors:', error);
      return [];
    }

    // Convert to app format
    return (investors || []).map(investor => mapDbInvestorToAppInvestor(investor));
  } catch (error) {
    console.error('Error in searchInvestors:', error);
    return [];
  }
};

// Get investor by PAN
export const getInvestorByPan = async (pan: string): Promise<InvestorDetails | undefined> => {
  try {
    const { data: investor, error } = await supabase
      .from('investors')
      .select('*')
      .eq('pan', pan)
      .maybeSingle();
    
    if (error || !investor) {
      return undefined;
    }
    
    return mapDbInvestorToAppInvestor(investor);
  } catch (error) {
    console.error('Error in getInvestorByPan:', error);
    return undefined;
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
      return false;
    }

    // Get first scheme from the array
    const firstScheme = investor.schemes[0] || { folioNo: '', arnCode: '' };

    const { error } = await supabase
      .from('investors')
      .insert({
        pan: investor.pan,
        name: investor.name,
        address: investor.address,
        mobile: investor.mobile,
        email: investor.email,
        bank_name: investor.bankName,
        account_number: investor.accountNumber,
        ifsc: investor.ifsc,
        arn: firstScheme.arnCode || '',
        folio_number: firstScheme.folioNo || '',
        user_id: userId
      });
    
    if (error) {
      console.error('Error adding investor:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addInvestor:', error);
    return false;
  }
};

// Edit existing investor
export const editInvestor = async (updatedInvestor: InvestorDetails): Promise<boolean> => {
  try {
    // Get first scheme from the array
    const firstScheme = updatedInvestor.schemes[0] || { folioNo: '', arnCode: '' };

    const { error } = await supabase
      .from('investors')
      .update({
        name: updatedInvestor.name,
        address: updatedInvestor.address,
        mobile: updatedInvestor.mobile,
        email: updatedInvestor.email,
        bank_name: updatedInvestor.bankName,
        account_number: updatedInvestor.accountNumber,
        ifsc: updatedInvestor.ifsc,
        arn: firstScheme.arnCode || '',
        folio_number: firstScheme.folioNo || ''
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
