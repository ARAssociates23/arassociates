
import { supabase } from "@/integrations/supabase/client";
import { InvestorDetails } from '../types/investor';

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
    return investors.map(investor => ({
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
    }));
  } catch (error) {
    console.error('Error in getAllInvestors:', error);
    return [];
  }
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
    return investors.map(investor => ({
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
      
      nomineeName: '',
      nomineeDob: '',
      nomineeRelationship: '',
      nomineeAadhar: '',
      nomineeIsNri: false,
      nomineePassport: '',
      nomineeExpiryDate: '',
      nomineeAddress: '',
      
      bankName: investor.bank_name || '',
      bankBranch: '',
      accountNumber: investor.account_number || '',
      ifsc: investor.ifsc || '',
      accountType: '',
      
      schemes: [{
        amc: '',
        schemeName: '',
        folioNo: investor.folio_number || '',
        sipLs: 'SIP',
        amountInvested: 0,
        dateStarted: '',
        arnCode: investor.arn || ''
      }]
    }));
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
      .single();
    
    if (error || !investor) {
      return undefined;
    }
    
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
      
      nomineeName: '',
      nomineeDob: '',
      nomineeRelationship: '',
      nomineeAadhar: '',
      nomineeIsNri: false,
      nomineePassport: '',
      nomineeExpiryDate: '',
      nomineeAddress: '',
      
      bankName: investor.bank_name || '',
      bankBranch: '',
      accountNumber: investor.account_number || '',
      ifsc: investor.ifsc || '',
      accountType: '',
      
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
  } catch (error) {
    console.error('Error in getInvestorByPan:', error);
    return undefined;
  }
};

// Add new investor 
export const addInvestor = async (investor: InvestorDetails): Promise<boolean> => {
  try {
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
        arn: investor.schemes[0]?.arnCode || '',
        folio_number: investor.schemes[0]?.folioNo || ''
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
        arn: updatedInvestor.schemes[0]?.arnCode || '',
        folio_number: updatedInvestor.schemes[0]?.folioNo || ''
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
