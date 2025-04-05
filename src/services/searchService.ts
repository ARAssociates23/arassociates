
import { supabase } from "@/integrations/supabase/client";
import { InvestorDetails } from '@/types/investor';
import { mapDbInvestorToAppInvestor } from './mappers/investorMapper';
import { InvestorRow } from './types/investorTypes';
import { getAllInvestors } from './investorService';

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
