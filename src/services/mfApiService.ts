
/**
 * Service to fetch mutual fund data from mfapi.in
 */
import { AmfiNavData } from '@/types/investor';
import { toast } from "sonner";

// MF API configuration with multiple CORS proxy options for fallback
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url='
];

// Use the first proxy by default
const CORS_PROXY = CORS_PROXIES[0];
const API_BASE = 'https://www.mfapi.in/mf';
const API_URL = `${CORS_PROXY}${API_BASE}`;

// Cache for mutual fund data to reduce API calls
const fundDataCache: Record<string, { data: any; timestamp: number }> = {};
const schemeCodeCache: Record<string, string> = {};
const isinToSchemeCodeCache: Record<string, string> = {};

/**
 * Attempt to fetch data with fallback to alternative proxies if needed
 */
const fetchWithProxyFallback = async (url: string, attempt: number = 0): Promise<Response> => {
  if (attempt >= CORS_PROXIES.length) {
    throw new Error("All CORS proxies failed");
  }
  
  try {
    const proxyUrl = url.replace(CORS_PROXIES[0], CORS_PROXIES[attempt]);
    console.log(`Fetching using proxy ${attempt + 1}: ${CORS_PROXIES[attempt]}`);
    
    const response = await fetch(proxyUrl);
    if (response.ok) {
      return response;
    }
    
    throw new Error(`Proxy ${attempt + 1} failed with status: ${response.status}`);
  } catch (error) {
    console.error(`Proxy ${attempt + 1} failed:`, error);
    return fetchWithProxyFallback(url, attempt + 1);
  }
};

/**
 * Fetch all schemes from mfapi.in
 */
export const fetchAllSchemes = async (): Promise<any[]> => {
  try {
    console.log('Fetching all schemes from mfapi.in via CORS proxy');
    
    // Check cache first (valid for 24 hours)
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    const cacheKey = 'all_schemes';
    
    if (fundDataCache[cacheKey] && (Date.now() - fundDataCache[cacheKey].timestamp < CACHE_DURATION)) {
      console.log('Using cached schemes data');
      return fundDataCache[cacheKey].data;
    }
    
    const response = await fetchWithProxyFallback(API_URL);
    
    if (!response.ok) {
      throw new Error(`MF API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the data to build ISIN to scheme code mapping
    if (data && Array.isArray(data)) {
      data.forEach(scheme => {
        if (scheme.isin) {
          isinToSchemeCodeCache[scheme.isin] = scheme.schemeCode;
        }
      });
    }
    
    // Cache the result
    fundDataCache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    console.log(`Successfully fetched ${data.length} schemes`);
    return data;
    
  } catch (error) {
    console.error('Error fetching all schemes:', error);
    toast.error(`Failed to fetch schemes. Please try again later.`, {
      description: "API request to mfapi.in failed. Network error or CORS issue."
    });
    return [];
  }
};

/**
 * Fetch NAV data for a specific scheme
 * @param schemeCode The mutual fund scheme code
 */
export const fetchSchemeNAV = async (schemeCode: string): Promise<any> => {
  try {
    console.log(`Fetching NAV data for scheme code ${schemeCode}`);
    
    // Check cache first (valid for 1 hour)
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
    const cacheKey = `nav_${schemeCode}`;
    
    if (fundDataCache[cacheKey] && (Date.now() - fundDataCache[cacheKey].timestamp < CACHE_DURATION)) {
      console.log(`Using cached NAV data for scheme ${schemeCode}`);
      return fundDataCache[cacheKey].data;
    }
    
    const response = await fetchWithProxyFallback(`${API_URL}/${schemeCode}`);
    
    if (!response.ok) {
      throw new Error(`MF API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    fundDataCache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    console.log(`Successfully fetched NAV data for scheme ${schemeCode}:`, data.meta?.scheme_name);
    return data;
    
  } catch (error) {
    console.error('Error fetching scheme NAV data:', error);
    toast.error(`Failed to fetch NAV data for scheme ${schemeCode}`, {
      description: "Please check the scheme code and try again later."
    });
    return null;
  }
};

/**
 * Get latest NAV for a scheme
 * @param schemeCode The scheme code
 */
export const getLatestNAV = async (schemeCode: string): Promise<{
  scheme_name: string;
  date: string;
  nav: string;
} | null> => {
  try {
    const data = await fetchSchemeNAV(schemeCode);
    
    if (!data || !data.data || !data.data.length) {
      return null;
    }
    
    return {
      scheme_name: data.meta.scheme_name,
      date: data.data[0].date,
      nav: data.data[0].nav
    };
  } catch (error) {
    console.error('Error getting latest NAV:', error);
    return null;
  }
};

/**
 * Convert mfapi.in data to our AmfiNavData format
 */
export const convertToAmfiFormat = (schemeData: any): AmfiNavData | null => {
  if (!schemeData || !schemeData.meta || !schemeData.data || !schemeData.data[0]) return null;
  
  try {
    return {
      schemeCode: schemeData.meta.scheme_code,
      schemeName: schemeData.meta.scheme_name,
      nav: schemeData.data[0].nav,
      date: schemeData.data[0].date
    };
  } catch (error) {
    console.error('Error converting scheme data to AMFI format:', error);
    return null;
  }
};

/**
 * Search for schemes by name
 */
export const searchSchemesByName = async (schemeName: string, amc?: string): Promise<AmfiNavData[]> => {
  try {
    const schemes = await fetchAllSchemes();
    if (!schemes || !schemes.length) return [];
    
    const normalizedSearch = schemeName.toLowerCase();
    const normalizedAmc = amc ? amc.toLowerCase() : '';
    
    // Filter schemes by name and AMC
    const matchingSchemes = schemes.filter(scheme => {
      const schemeNameLower = scheme.schemeName.toLowerCase();
      const matchName = schemeNameLower.includes(normalizedSearch);
      const matchAmc = !normalizedAmc || schemeNameLower.includes(normalizedAmc);
      return matchName && matchAmc;
    });
    
    console.log(`Found ${matchingSchemes.length} matches for "${schemeName}"`);
    
    // Convert to AMFI format and fetch latest NAVs
    const results = await Promise.all(matchingSchemes.slice(0, 10).map(async (scheme) => {
      const navData = await getLatestNAV(scheme.schemeCode);
      if (!navData) return null;
      
      return {
        schemeCode: scheme.schemeCode,
        schemeName: navData.scheme_name,
        nav: navData.nav,
        date: navData.date
      };
    }));
    
    return results.filter(Boolean) as AmfiNavData[];
  } catch (error) {
    console.error('Error searching schemes by name:', error);
    return [];
  }
};

/**
 * Get scheme code by ISIN
 * @param isin The ISIN code of the mutual fund
 */
export const getSchemeCodeByISIN = async (isin: string): Promise<string | null> => {
  try {
    // Check if we have the mapping in cache
    if (isinToSchemeCodeCache[isin]) {
      console.log(`Found scheme code for ISIN ${isin} in cache: ${isinToSchemeCodeCache[isin]}`);
      return isinToSchemeCodeCache[isin];
    }
    
    // We need to fetch all schemes to find the mapping
    console.log(`Looking up scheme code for ISIN: ${isin}`);
    const schemes = await fetchAllSchemes();
    
    const scheme = schemes.find(s => s.isin === isin);
    if (scheme && scheme.schemeCode) {
      // Cache the mapping
      isinToSchemeCodeCache[isin] = scheme.schemeCode;
      return scheme.schemeCode;
    }
    
    console.log(`No scheme found with ISIN: ${isin}`);
    return null;
  } catch (error) {
    console.error('Error getting scheme code by ISIN:', error);
    return null;
  }
};

/**
 * Get NAV data using ISIN
 * @param isin The ISIN code of the mutual fund
 */
export const getNAVByISIN = async (isin: string): Promise<AmfiNavData | null> => {
  try {
    const schemeCode = await getSchemeCodeByISIN(isin);
    if (!schemeCode) {
      console.log(`Could not find scheme code for ISIN: ${isin}`);
      return null;
    }
    
    const data = await fetchSchemeNAV(schemeCode);
    return convertToAmfiFormat(data);
  } catch (error) {
    console.error('Error getting NAV by ISIN:', error);
    return null;
  }
};

/**
 * Find scheme code by name and AMC
 * @param schemeName The scheme name
 * @param amc The AMC name
 */
export const findSchemeCode = async (schemeName: string, amc: string): Promise<string | null> => {
  try {
    // Create a cache key
    const cacheKey = `${schemeName}_${amc}`.toLowerCase().replace(/\s+/g, '_');
    
    // Check cache first
    if (schemeCodeCache[cacheKey]) {
      return schemeCodeCache[cacheKey];
    }
    
    // Get all schemes
    const schemes = await fetchAllSchemes();
    if (!schemes || !schemes.length) return null;
    
    const normalizedSearch = schemeName.toLowerCase();
    const normalizedAmc = amc.toLowerCase();
    
    // Find best match
    let bestMatch = null;
    let bestScore = 0;
    
    for (const scheme of schemes) {
      const schemeNameLower = scheme.schemeName.toLowerCase();
      let score = 0;
      
      // Exact match gets highest score
      if (schemeNameLower === normalizedSearch) {
        score += 100;
      }
      else if (schemeNameLower.includes(normalizedSearch)) {
        score += 50;
      }
      
      // AMC match adds to score
      if (schemeNameLower.includes(normalizedAmc)) {
        score += 30;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = scheme;
      }
    }
    
    if (bestMatch && bestScore > 30) {
      // Cache the result
      schemeCodeCache[cacheKey] = bestMatch.schemeCode;
      return bestMatch.schemeCode;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding scheme code:', error);
    return null;
  }
};

/**
 * Get current NAV using scheme name and AMC
 */
export const getCurrentNav = async (schemeName: string, amc: string): Promise<number | null> => {
  try {
    console.log(`Using scheme name and AMC to fetch NAV: ${schemeName}, ${amc}`);
    
    // Find scheme code
    const schemeCode = await findSchemeCode(schemeName, amc);
    if (!schemeCode) return null;
    
    // Get latest NAV
    const latestNav = await getLatestNAV(schemeCode);
    if (!latestNav) return null;
    
    return parseFloat(latestNav.nav);
  } catch (error) {
    console.error('Error getting current NAV:', error);
    return null;
  }
};

/**
 * Get current NAV using ISIN
 */
export const getCurrentNavByISIN = async (isin: string): Promise<number | null> => {
  try {
    console.log(`Using ISIN to fetch NAV: ${isin}`);
    
    const navData = await getNAVByISIN(isin);
    if (!navData) return null;
    
    return parseFloat(navData.nav);
  } catch (error) {
    console.error('Error getting current NAV by ISIN:', error);
    return null;
  }
};

/**
 * Initialize the MF API service
 */
export const initMfApiService = () => {
  console.log("MF API service initialized with multiple CORS proxy fallbacks");
  
  // Test the API with a sample fetch
  fetchAllSchemes()
    .then(data => {
      if (data && data.length > 0) {
        console.log(`MF API integration working correctly, found ${data.length} schemes`);
        toast.success("MF API integration ready", {
          description: "Successfully connected to mfapi.in via CORS proxy"
        });
      } else {
        console.error("MF API integration test failed");
        toast.error("MF API integration setup incomplete", {
          description: "Please check network connection"
        });
      }
    })
    .catch(error => {
      console.error("Failed to test MF API integration:", error);
      toast.error("Failed to connect to MF API", {
        description: "Check network connection or try again later"
      });
    });
};
