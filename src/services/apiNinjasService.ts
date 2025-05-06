
/**
 * Service to fetch mutual fund data from API Ninjas
 */
import { AmfiNavData } from '@/types/investor';
import { toast } from "sonner";

// API Ninjas configuration
const API_KEY = 'RgWGqgs6e6y8S6q2fKDSpg==uSrzwYWGe9YJJvTt';
const API_URL = 'https://api.api-ninjas.com/v1/mutualfund';

// Cache for mutual fund data to reduce API calls
const fundDataCache: Record<string, { data: any; timestamp: number }> = {};

/**
 * Fetch mutual fund data from API Ninjas
 * @param ticker The mutual fund ticker symbol (e.g., VFIAX)
 */
export const fetchMutualFundData = async (ticker: string): Promise<any> => {
  try {
    console.log(`Fetching mutual fund data for ${ticker}`);
    
    // Check cache first (valid for 30 minutes)
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
    const cacheKey = `ninjas_${ticker}`;
    
    if (fundDataCache[cacheKey] && (Date.now() - fundDataCache[cacheKey].timestamp < CACHE_DURATION)) {
      console.log(`Using cached data for ${ticker}`);
      return fundDataCache[cacheKey].data;
    }
    
    const response = await fetch(`${API_URL}?ticker=${encodeURIComponent(ticker)}`, {
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Ninjas request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    fundDataCache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    console.log(`Successfully fetched data for ${ticker}:`, data);
    return data;
    
  } catch (error) {
    console.error('Error fetching mutual fund data:', error);
    toast(`Failed to fetch data for ${ticker}. Please try again later.`);
    return null;
  }
};

/**
 * Convert API Ninjas data to our AmfiNavData format
 * @param tickerData The data from API Ninjas
 */
export const convertToAmfiFormat = (ticker: string, tickerData: any): AmfiNavData | null => {
  if (!tickerData) return null;
  
  try {
    return {
      schemeCode: ticker,
      schemeName: tickerData.name || ticker,
      nav: tickerData.price ? tickerData.price.toString() : '0',
      date: new Date().toISOString().split('T')[0] // Current date as YYYY-MM-DD
    };
  } catch (error) {
    console.error('Error converting ticker data to AMFI format:', error);
    return null;
  }
};

/**
 * Search for schemes by ticker symbol
 */
export const searchSchemesByTicker = async (ticker: string): Promise<AmfiNavData[]> => {
  try {
    const data = await fetchMutualFundData(ticker);
    if (!data) return [];
    
    const amfiData = convertToAmfiFormat(ticker, data);
    return amfiData ? [amfiData] : [];
  } catch (error) {
    console.error('Error searching schemes by ticker:', error);
    return [];
  }
};

/**
 * Get current NAV for a scheme using its ticker symbol
 */
export const getCurrentNavByTicker = async (ticker: string): Promise<number | null> => {
  try {
    const data = await fetchMutualFundData(ticker);
    if (!data || !data.price) return null;
    
    return parseFloat(data.price);
  } catch (error) {
    console.error('Error getting NAV by ticker:', error);
    return null;
  }
};

/**
 * Map scheme name to ticker symbol (simplified mapping)
 * In a real-world scenario, this would be a more comprehensive mapping service
 */
export const mapSchemeNameToTicker = (schemeName: string, amc: string): string | null => {
  // This is a simplified mapping for demonstration purposes
  // In a production environment, you'd use a proper database or API for mapping
  
  const normalizedName = schemeName.toLowerCase();
  const normalizedAmc = amc.toLowerCase();
  
  // Sample mappings (would be much more extensive in production)
  const mappings: Record<string, string> = {
    'vanguard 500 index': 'VFIAX',
    'vanguard total stock market': 'VTSAX',
    'fidelity 500 index': 'FXAIX',
    'fidelity contrafund': 'FCNTX',
    'american funds growth fund of america': 'AGTHX',
    'icici prudential bluechip': 'BLUECHIP',
    'hdfc midcap opportunities': 'HDFCMID',
    'aditya birla sun life frontline equity': 'ABFRONTL',
    'sbi bluechip': 'SBIBLUEC',
    'axis bluechip': 'AXISBLUE',
    // Add more mappings as needed
  };
  
  // Try to find exact match first
  for (const [key, ticker] of Object.entries(mappings)) {
    if (normalizedName.includes(key) || (normalizedAmc && key.includes(normalizedAmc))) {
      return ticker;
    }
  }
  
  // If no match found, try to construct a ticker from the scheme name (very basic approach)
  // This would be replaced with a proper lookup service
  if (normalizedName.length > 3) {
    // Use first 5 characters as a fallback ticker (not ideal, just for demonstration)
    return normalizedName.replace(/\s+/g, '').substring(0, 5).toUpperCase();
  }
  
  return null;
};

/**
 * Initialize the API Ninjas service
 */
export const initApiNinjasService = () => {
  console.log("API Ninjas service initialized");
  
  // Test the API with a sample ticker
  fetchMutualFundData('VFIAX')
    .then(data => {
      if (data) {
        console.log("API Ninjas integration working correctly");
        toast("API Ninjas integration ready");
      } else {
        console.error("API Ninjas integration test failed");
        toast("API Ninjas integration setup incomplete", {
          description: "Please check API key and network connection"
        });
      }
    })
    .catch(error => {
      console.error("Failed to test API Ninjas integration:", error);
    });
};
