
/**
 * Service to fetch NAV data from external API using provided API key
 */

import { AmfiNavData } from '@/types/investor';

// API configuration
const API_KEY = '585d1e0ecemsh4555aa6cebd5791p18dcbfjsnd61bba4a965f';
const API_HOST = 'latest-mutual-fund-nav.p.rapidapi.com';
const BASE_URL = 'https://latest-mutual-fund-nav.p.rapidapi.com';

// Cache for NAV data to reduce API calls
const navApiCache: Record<string, { data: AmfiNavData[]; timestamp: number }> = {};

/**
 * Fetch all NAV data from the API
 */
export const fetchAllNavDataFromApi = async (): Promise<AmfiNavData[]> => {
  try {
    // Check if we have cached data from today
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `api_all_nav_${today}`;
    
    // Use cached data if it's less than 6 hours old
    const cachedData = navApiCache[cacheKey];
    const SIX_HOURS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    
    if (cachedData && (Date.now() - cachedData.timestamp < SIX_HOURS)) {
      console.log('Using cached NAV data');
      return cachedData.data;
    }
    
    // Fetch from API
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    };

    console.log('Fetching NAV data from API...');
    const response = await fetch(`${BASE_URL}/latest`, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch NAV data: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API response to match our AmfiNavData structure
    const navData: AmfiNavData[] = data.map((item: any) => ({
      schemeCode: item.scheme_code || '',
      schemeName: item.scheme_name || '',
      nav: item.nav || '0',
      date: item.date || ''
    }));
    
    // Cache the result
    navApiCache[cacheKey] = {
      data: navData,
      timestamp: Date.now()
    };
    
    return navData;
  } catch (error) {
    console.error('Error fetching NAV data from API:', error);
    // Fallback to direct AMFI data if API fails
    console.log('Falling back to direct AMFI data fetch...');
    const { fetchAllNavData } = await import('./navService');
    return fetchAllNavData();
  }
};

/**
 * Search for schemes by name and AMC
 */
export const searchSchemesFromApi = async (searchTerm: string, amc?: string): Promise<AmfiNavData[]> => {
  try {
    const allData = await fetchAllNavDataFromApi();
    
    const normalizedSearchTerm = searchTerm.toLowerCase();
    const normalizedAmc = amc?.toLowerCase() || '';
    
    return allData.filter(scheme => {
      const schemeName = scheme.schemeName.toLowerCase();
      const matchesSearchTerm = schemeName.includes(normalizedSearchTerm);
      const matchesAmc = !normalizedAmc || schemeName.includes(normalizedAmc);
      return matchesSearchTerm && matchesAmc;
    });
  } catch (error) {
    console.error('Error searching schemes from API:', error);
    return [];
  }
};

/**
 * Get scheme details by scheme code
 */
export const getSchemeDetailsByCode = async (schemeCode: string): Promise<AmfiNavData | null> => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    };

    const response = await fetch(`${BASE_URL}/get_scheme_details?scheme_code=${schemeCode}`, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch scheme details: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      schemeCode: data.scheme_code || '',
      schemeName: data.scheme_name || '',
      nav: data.nav || '0',
      date: data.date || ''
    };
  } catch (error) {
    console.error('Error fetching scheme details:', error);
    return null;
  }
};
