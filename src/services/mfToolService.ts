
/**
 * Service to fetch NAV data using the AMFI API with fallbacks
 */
import { AmfiNavData } from '@/types/investor';
import { toast } from "sonner";

// Cache for NAV data to reduce API calls
const navCache: Record<string, { data: AmfiNavData[]; timestamp: number }> = {};

// API configuration - fallback to direct AMFI data
const API_AVAILABLE = false; // Set to true when your Python API is live

/**
 * Fetch all NAV data using direct AMFI source
 */
export const fetchAllNavDataFromMfTool = async (): Promise<AmfiNavData[]> => {
  try {
    // Check if we have cached data from today
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `mftool_all_nav_${today}`;
    
    // Use cached data if it's less than 3 hours old
    const cachedData = navCache[cacheKey];
    const THREE_HOURS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    
    if (cachedData && (Date.now() - cachedData.timestamp < THREE_HOURS)) {
      console.log('Using cached NAV data');
      return cachedData.data;
    }
    
    // Fall back to direct AMFI fetch
    console.log('Fetching NAV data directly from AMFI...');
    const { fetchAllNavData } = await import('./navService');
    const navData = await fetchAllNavData();
    
    // Cache the result
    navCache[cacheKey] = {
      data: navData,
      timestamp: Date.now()
    };
    
    console.log(`Fetched ${navData.length} NAV entries from AMFI`);
    return navData;
  } catch (error) {
    console.error('Error fetching NAV data:', error);
    
    // Final fallback to direct AMFI fetch
    const { fetchAllNavData } = await import('./navService');
    return fetchAllNavData();
  }
};

/**
 * Search for schemes by name and AMC
 */
export const searchSchemesFromMfTool = async (searchTerm: string, amc?: string): Promise<AmfiNavData[]> => {
  try {
    const allData = await fetchAllNavDataFromMfTool();
    
    const normalizedSearchTerm = searchTerm.toLowerCase();
    const normalizedAmc = amc?.toLowerCase() || '';
    
    return allData.filter(scheme => {
      const schemeName = scheme.schemeName.toLowerCase();
      const matchesSearchTerm = schemeName.includes(normalizedSearchTerm);
      const matchesAmc = !normalizedAmc || schemeName.includes(normalizedAmc);
      return matchesSearchTerm && matchesAmc;
    });
  } catch (error) {
    console.error('Error searching schemes:', error);
    
    // Fallback to direct AMFI data
    const { searchSchemes } = await import('./navService');
    return searchSchemes(searchTerm, amc);
  }
};

/**
 * Get scheme details by scheme code
 */
export const getSchemeDetailsByCodeFromMfTool = async (schemeCode: string): Promise<AmfiNavData | null> => {
  try {
    // First check if we can get it from the cached data
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `mftool_all_nav_${today}`;
    const cachedData = navCache[cacheKey];
    
    if (cachedData) {
      const cachedScheme = cachedData.data.find(scheme => scheme.schemeCode === schemeCode);
      if (cachedScheme) {
        return cachedScheme;
      }
    }
    
    // Fallback to direct AMFI fetch
    console.log('Fetching scheme details directly from AMFI...');
    const { getSchemeDetailsByCode } = await import('./amfiApiService');
    return getSchemeDetailsByCode(schemeCode);
  } catch (error) {
    console.error('Error fetching scheme details:', error);
    
    // Fallback to direct AMFI fetch
    const { getSchemeDetailsByCode } = await import('./amfiApiService');
    return getSchemeDetailsByCode(schemeCode);
  }
};

/**
 * Implementation for the NAV_Data function
 * Gets NAV data for a specific date range
 */
export const getNAVData = async (startDate: string, endDate: string): Promise<AmfiNavData[]> => {
  try {
    // For now, use the fallback to fetch all data
    console.log(`NAV data requested for period: ${startDate} to ${endDate}`);
    
    // Just use the basic fetch for now
    return fetchAllNavDataFromMfTool();
  } catch (error) {
    console.error('Error fetching NAV history data:', error);
    
    // Fallback to direct AMFI fetch
    return fetchAllNavDataFromMfTool();
  }
};

/**
 * Setup function that handles the MFTool integration
 * This is a simpler implementation that doesn't depend on an external API
 */
export const setupMfToolIntegration = () => {
  console.log("MFTool integration initialized in fallback mode.");
  
  // Preload NAV data to improve first-time performance
  fetchAllNavDataFromMfTool()
    .then(data => {
      console.log(`Preloaded ${data.length} NAV entries`);
      toast({
        title: "NAV Data Loaded",
        description: `Successfully loaded ${data.length} mutual fund schemes`,
      });
    })
    .catch(error => {
      console.error("Failed to preload NAV data:", error);
      toast({
        title: "Warning",
        description: "NAV data will be fetched on demand",
      });
    });
};

/**
 * Export a method to be called on app initialization
 */
export const initMfToolService = () => {
  setupMfToolIntegration();
};
