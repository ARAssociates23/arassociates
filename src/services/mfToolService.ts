
/**
 * Service to fetch NAV data using mftool library via a Python API endpoint
 */
import { AmfiNavData } from '@/types/investor';
import { toast } from "sonner";

// Cache for NAV data to reduce API calls
const navCache: Record<string, { data: AmfiNavData[]; timestamp: number }> = {};

// API URL for the Python backend that uses mftool
const API_URL = 'https://your-python-api-endpoint.com/api'; // Replace with your actual API endpoint

/**
 * Fetch all NAV data using mftool API
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
    
    console.log('Fetching NAV data using MF Tool...');
    
    // Current date in dd-mm-yyyy format
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${
      String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;

    // Previous date for fallback (7 days ago)
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 7);
    const formattedPrevDate = `${String(prevDate.getDate()).padStart(2, '0')}-${
      String(prevDate.getMonth() + 1).padStart(2, '0')}-${prevDate.getFullYear()}`;

    // Simulating a fetch to a Python API that implements the mftool functionality
    // In a real implementation, this would call your Python backend
    // For now, we're using a fallback to the direct AMFI service
    try {
      // This would be your actual API call
      // const response = await fetch(`${API_URL}/nav-data?start_date=${formattedPrevDate}&end_date=${formattedDate}`);
      // if (!response.ok) throw new Error(`API error: ${response.status}`);
      // const data = await response.json();
      
      // For this prototype, we'll use the fallback method
      throw new Error("API not implemented yet, using fallback");
      
    } catch (apiError) {
      console.log('MF Tool API not available, falling back to direct AMFI fetch');
      const { fetchAllNavData } = await import('./navService');
      const navData = await fetchAllNavData();
      
      // Cache the result
      navCache[cacheKey] = {
        data: navData,
        timestamp: Date.now()
      };
      
      return navData;
    }
  } catch (error) {
    console.error('Error fetching NAV data from MF Tool:', error);
    
    // Fallback to direct AMFI fetch
    const { fetchAllNavData } = await import('./navService');
    const navData = await fetchAllNavData();
    return navData;
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
    console.error('Error searching schemes from MF Tool:', error);
    
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
    
    // Try to get the specific scheme from MFTool API
    try {
      // This would be your actual API call
      // const response = await fetch(`${API_URL}/scheme-details?scheme_code=${schemeCode}`);
      // if (!response.ok) throw new Error(`API error: ${response.status}`);
      // const data = await response.json();
      // return {
      //   schemeCode: data.scheme_code,
      //   schemeName: data.scheme_name,
      //   nav: data.nav,
      //   date: data.date
      // };
      
      // For this prototype, use the fallback
      throw new Error("API not implemented yet, using fallback");
      
    } catch (apiError) {
      console.log('MF Tool API not available for scheme details, using fallback');
      const { getSchemeDetailsByCode } = await import('./amfiApiService');
      return getSchemeDetailsByCode(schemeCode);
    }
  } catch (error) {
    console.error('Error fetching scheme details from MF Tool:', error);
    
    // Fallback to direct AMFI fetch
    const { getSchemeDetailsByCode } = await import('./amfiApiService');
    return getSchemeDetailsByCode(schemeCode);
  }
};

/**
 * Implementation for the NAV_Data function as provided
 * In a real application, this would call your Python API
 */
export const getNAVData = async (startDate: string, endDate: string): Promise<AmfiNavData[]> => {
  try {
    // This would be your actual API call to the Python backend
    // const response = await fetch(`${API_URL}/nav-history?start_date=${startDate}&end_date=${endDate}`);
    // if (!response.ok) throw new Error(`API error: ${response.status}`);
    // const data = await response.json();
    // return data.map(item => ({
    //   schemeCode: item.scheme_code,
    //   schemeName: item.scheme_name,
    //   nav: item.nav,
    //   date: item.date
    // }));
    
    // For this prototype, use the fallback to direct AMFI data
    console.log(`Would fetch NAV data from ${startDate} to ${endDate} using MFTool`);
    
    // Fallback to basic NAV fetch
    return fetchAllNavDataFromMfTool();
    
  } catch (error) {
    console.error('Error fetching NAV history data:', error);
    toast("Failed to fetch NAV history data. Using fallback method.");
    
    // Fallback to direct AMFI fetch
    return fetchAllNavDataFromMfTool();
  }
};

/**
 * This function would be the bridge to your Python backend implementing mftool
 * It would need to be connected to an API endpoint that runs the Python code
 */
export const setupMfToolIntegration = () => {
  console.log("MFTool integration initialized. Ready to connect to Python backend.");
  // This function would perform any needed setup for your MFTool integration
  
  // For example, it might check if the API is available
  fetch(API_URL + '/health-check')
    .then(response => {
      if (response.ok) {
        console.log('MFTool Python API is available');
        toast("MFTool API connection established.");
      } else {
        console.log('MFTool Python API is not responding correctly');
        toast("MFTool API is unavailable. Using fallback methods.");
      }
    })
    .catch(error => {
      console.error('Error connecting to MFTool API:', error);
      toast("Could not connect to MFTool API. Using fallback methods.");
    });
};

/**
 * Export a method to be called on app initialization
 */
export const initMfToolService = () => {
  setupMfToolIntegration();
};
