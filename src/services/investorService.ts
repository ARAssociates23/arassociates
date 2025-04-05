
import { supabase } from "@/integrations/supabase/client";
import { InvestorDetails, SchemeDetail } from '../types/investor';
import { Database } from "@/integrations/supabase/types";

// Define a more complete type for the database row based on the error message
type InvestorRow = Database['public']['Tables']['investors']['Row'] & {
  schemes?: SchemeDetail[] | null;
  nominee_details?: Record<string, any> | null;
  residential_status?: string | null;
  nationality?: string | null;
  annual_income?: string | null;
  mothers_name?: string | null;
  occupation?: string | null;
  bank_branch?: string | null;
  account_type?: string | null;
};

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
    return (investors || []).map(investor => mapDbInvestorToAppInvestor(investor as InvestorRow));
  } catch (error) {
    console.error('Error in getAllInvestors:', error);
    return [];
  }
};

// Helper function to map database investor to application investor format
const mapDbInvestorToAppInvestor = (investor: InvestorRow): InvestorDetails => {
  // Parse JSON fields if they exist
  let schemes: SchemeDetail[] = [];
  try {
    if (investor.schemes) {
      schemes = JSON.parse(JSON.stringify(investor.schemes)) as SchemeDetail[];
    }
  } catch (e) {
    console.error('Error parsing schemes:', e);
  }

  let nomineeDetails = {} as Record<string, any>;
  try {
    if (investor.nominee_details) {
      nomineeDetails = JSON.parse(JSON.stringify(investor.nominee_details)) || {};
    }
  } catch (e) {
    console.error('Error parsing nominee details:', e);
  }

  return {
    pan: investor.pan,
    name: investor.name,
    address: investor.address || '',
    mobile: investor.mobile || '',
    email: investor.email || '',
    residentialStatus: investor.residential_status || '',
    nationality: investor.nationality || 'INDIAN',
    annualIncome: investor.annual_income || '',
    mothersName: investor.mothers_name || '',
    occupation: investor.occupation || '',
    
    // Nominee details
    nomineeName: nomineeDetails?.nomineeName || '',
    nomineeDob: nomineeDetails?.nomineeDob || '',
    nomineeRelationship: nomineeDetails?.nomineeRelationship || '',
    nomineeAadhar: nomineeDetails?.nomineeAadhar || '',
    nomineeIsNri: nomineeDetails?.nomineeIsNri || false,
    nomineePassport: nomineeDetails?.nomineePassport || '',
    nomineeExpiryDate: nomineeDetails?.nomineeExpiryDate || '',
    nomineeAddress: nomineeDetails?.nomineeAddress || '',
    
    // Bank details
    bankName: investor.bank_name || '',
    bankBranch: investor.bank_branch || '',
    accountNumber: investor.account_number || '',
    ifsc: investor.ifsc || '',
    accountType: investor.account_type || '',
    
    // Scheme details - use parsed schemes or default to a basic scheme
    schemes: schemes.length > 0 ? schemes : [{
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
    return (investors || []).map(investor => mapDbInvestorToAppInvestor(investor as InvestorRow));
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
    
    return mapDbInvestorToAppInvestor(investor as InvestorRow);
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

    // Prepare nominee details as JSON
    const nomineeDetails = {
      nomineeName: investor.nomineeName,
      nomineeDob: investor.nomineeDob,
      nomineeRelationship: investor.nomineeRelationship,
      nomineeAadhar: investor.nomineeAadhar,
      nomineeIsNri: investor.nomineeIsNri,
      nomineePassport: investor.nomineePassport,
      nomineeExpiryDate: investor.nomineeExpiryDate,
      nomineeAddress: investor.nomineeAddress
    };

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
    // Prepare nominee details as JSON
    const nomineeDetails = {
      nomineeName: updatedInvestor.nomineeName,
      nomineeDob: updatedInvestor.nomineeDob,
      nomineeRelationship: updatedInvestor.nomineeRelationship,
      nomineeAadhar: updatedInvestor.nomineeAadhar,
      nomineeIsNri: updatedInvestor.nomineeIsNri,
      nomineePassport: updatedInvestor.nomineePassport,
      nomineeExpiryDate: updatedInvestor.nomineeExpiryDate,
      nomineeAddress: updatedInvestor.nomineeAddress
    };

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

