
import { AmfiNavData, RedemptionDetail } from '@/types/investor';
import { fetchAllNavDataFromApi, searchSchemesFromApi } from './amfiApiService';

// Cache for NAV data to reduce API calls
const navCache: Record<string, { nav: number; lastUpdated: string }> = {};

/**
 * Fetches all NAV data from AMFI
 * Note: This is a large file (10MB+), so we cache it
 */
export const fetchAllNavData = async (): Promise<AmfiNavData[]> => {
  try {
    // First try the API service for faster results
    try {
      return await fetchAllNavDataFromApi();
    } catch (apiError) {
      console.error('API fetch failed, falling back to direct AMFI fetch', apiError);
    }

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
    // Try API first, fall back to direct AMFI data if needed
    return await searchSchemesFromApi(searchTerm, amc);
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
        console.log(`Using cached NAV for ${schemeName}: ${cachedData.nav}`);
        return cachedData.nav;
      }
    }
    
    console.log(`Fetching current NAV for ${schemeName} (${amc})`);
    
    // Try to find a matching scheme
    const match = await findBestSchemeMatch(schemeName, amc);
    
    if (match && match.nav) {
      const navValue = parseFloat(match.nav);
      
      if (!isNaN(navValue)) {
        console.log(`Found NAV for ${schemeName}: ${navValue}`);
        
        // Update cache
        navCache[cacheKey] = {
          nav: navValue,
          lastUpdated: new Date().toISOString()
        };
        
        return navValue;
      }
    }
    
    console.log(`No NAV found for ${schemeName}`);
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
  if (!nav || nav <= 0) return 0;
  return amountInvested / nav;
};

/**
 * Calculate current value based on units and current NAV
 */
export const calculateCurrentValue = (units: number, nav: number): number => {
  if (!units || !nav) return 0;
  return units * nav;
};

/**
 * Calculate SIP total amount based on start date and current date
 * Ensures that only completed SIPs are counted (no future dates)
 */
export const calculateSipAmountToDate = (monthlyAmount: number, startDateStr: string): number => {
  if (!monthlyAmount || !startDateStr) return 0;
  
  try {
    const startDate = new Date(startDateStr);
    const currentDate = new Date();
    
    // Check if start date is valid and in the past
    if (isNaN(startDate.getTime()) || startDate > currentDate) return 0;
    
    // Extract day of month from start date (for SIP date)
    const sipDayOfMonth = startDate.getDate();
    const currentDayOfMonth = currentDate.getDate();
    
    // Calculate whole months difference
    let monthsDiff = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (currentDate.getMonth() - startDate.getMonth());
    
    // Adjust if the SIP day hasn't occurred yet in the current month
    if (currentDayOfMonth < sipDayOfMonth) {
      monthsDiff--;
    }
    
    // Add 1 for the initial month if the SIP has already started
    const totalMonths = Math.max(0, monthsDiff + 1);
    
    return monthlyAmount * totalMonths;
  } catch (error) {
    console.error('Error calculating SIP amount:', error);
    return 0;
  }
};

/**
 * Format date to dd-MM-yyyy
 */
export const formatDateString = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (error) {
    return dateString;
  }
};

/**
 * Calculate net investment after redemptions
 */
export const calculateNetInvestment = (
  totalInvestment: number,
  redemptions: RedemptionDetail[] = []
): number => {
  if (!redemptions || redemptions.length === 0) return totalInvestment;
  
  const totalRedeemed = redemptions.reduce((total, redemption) => {
    if (redemption.amount) {
      return total + redemption.amount;
    } else if (redemption.units && redemption.nav) {
      return total + (redemption.units * redemption.nav);
    }
    return total;
  }, 0);
  
  return Math.max(0, totalInvestment - totalRedeemed);
};

/**
 * Calculate remaining units after redemptions
 */
export const calculateRemainingUnits = (
  totalUnits: number,
  redemptions: RedemptionDetail[] = []
): number => {
  if (!redemptions || redemptions.length === 0) return totalUnits;
  
  const redeemedUnits = redemptions.reduce((total, redemption) => 
    total + (redemption.units || 0), 0);
  
  return Math.max(0, totalUnits - redeemedUnits);
};

