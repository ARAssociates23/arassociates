
import { AmfiNavData } from '@/types/investor';

// Cache for NAV data to reduce API calls
const navCache: Record<string, { nav: number; lastUpdated: string }> = {};

/**
 * Fetches all NAV data from AMFI
 * Note: This is a large file (10MB+), so we cache it
 */
export const fetchAllNavData = async (): Promise<AmfiNavData[]> => {
  try {
    // Check if we have cached data from today
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `amfi_all_nav_${today}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Fetch from AMFI
    const response = await fetch('https://www.amfiindia.com/spages/NAVAll.txt');
    if (!response.ok) {
      throw new Error('Failed to fetch NAV data');
    }
    
    const text = await response.text();
    
    // Parse the text data into structured format
    // AMFI format: Scheme Code;ISIN Div Payout/ISIN Growth;ISIN Div Reinvestment;Scheme Name;Net Asset Value;Date
    const lines = text.split('\n').filter(line => line.trim() !== '' && !line.startsWith(';'));
    
    const navData: AmfiNavData[] = [];
    
    for (const line of lines) {
      // Skip headers or empty lines
      if (line.includes('Scheme Code;') || line.includes('Open Ended Schemes') || 
          line.includes('Close Ended Schemes') || !line.includes(';')) {
        continue;
      }
      
      const parts = line.split(';');
      if (parts.length >= 5) {
        const schemeCode = parts[0].trim();
        const schemeName = parts[3].trim();
        const nav = parts[4].trim();
        const date = parts[5] ? parts[5].trim() : '';
        
        if (schemeCode && schemeName && nav) {
          navData.push({
            schemeCode,
            schemeName,
            nav,
            date
          });
        }
      }
    }
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify(navData));
    
    return navData;
  } catch (error) {
    console.error('Error fetching NAV data:', error);
    return [];
  }
};

/**
 * Searches for schemes by name and AMC
 */
export const searchSchemes = async (searchTerm: string, amc?: string): Promise<AmfiNavData[]> => {
  try {
    const allData = await fetchAllNavData();
    
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
    return [];
  }
};

/**
 * Finds the most likely match for a scheme based on name and AMC
 */
export const findBestSchemeMatch = async (schemeName: string, amc: string): Promise<AmfiNavData | null> => {
  try {
    // First try searching with AMC and scheme name
    let results = await searchSchemes(schemeName, amc);
    
    // If no results, try with just the scheme name
    if (results.length === 0) {
      results = await searchSchemes(schemeName);
    }
    
    // Sort by relevance (simple string similarity)
    results.sort((a, b) => {
      const scoreA = calculateSimilarity(a.schemeName, schemeName, amc);
      const scoreB = calculateSimilarity(b.schemeName, schemeName, amc);
      return scoreB - scoreA;
    });
    
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error finding scheme match:', error);
    return null;
  }
};

/**
 * Very simple string similarity measure
 */
const calculateSimilarity = (schemeName: string, targetName: string, amc: string): number => {
  const normalizedSchemeName = schemeName.toLowerCase();
  const normalizedTargetName = targetName.toLowerCase();
  const normalizedAmc = amc.toLowerCase();
  
  // Count how many words from the target are in the scheme name
  const targetWords = normalizedTargetName.split(/\s+/);
  let matchCount = 0;
  
  for (const word of targetWords) {
    if (word.length > 2 && normalizedSchemeName.includes(word)) {
      matchCount++;
    }
  }
  
  // Bonus if AMC is in the name
  const amcBonus = normalizedSchemeName.includes(normalizedAmc) ? 2 : 0;
  
  return matchCount + amcBonus;
};

/**
 * Gets the current NAV for a specific scheme
 */
export const getCurrentNav = async (schemeName: string, amc: string): Promise<number | null> => {
  try {
    // Create a cache key from the combination of scheme name and AMC
    const cacheKey = `${schemeName}_${amc}`.toLowerCase().replace(/\s+/g, '_');
    
    // Check cache first
    if (navCache[cacheKey]) {
      const cachedData = navCache[cacheKey];
      
      // If we fetched it today, use the cached value
      const today = new Date().toISOString().split('T')[0];
      const cachedDate = new Date(cachedData.lastUpdated).toISOString().split('T')[0];
      
      if (cachedDate === today) {
        return cachedData.nav;
      }
    }
    
    // Try to find a matching scheme
    const match = await findBestSchemeMatch(schemeName, amc);
    
    if (match && match.nav) {
      const navValue = parseFloat(match.nav);
      
      if (!isNaN(navValue)) {
        // Update cache
        navCache[cacheKey] = {
          nav: navValue,
          lastUpdated: new Date().toISOString()
        };
        
        return navValue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current NAV:', error);
    return null;
  }
};

/**
 * Calculate units based on the invested amount and NAV
 */
export const calculateUnits = (amountInvested: number, nav: number): number => {
  return amountInvested / nav;
};
