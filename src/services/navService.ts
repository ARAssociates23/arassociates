
import { AmfiNavData, RedemptionDetail } from '@/types/investor';
import { fetchAllNavDataFromApi, searchSchemesFromApi } from './amfiApiService';

// Cache for NAV data to reduce API calls
const navCache: Record<string, { nav: number; lastUpdated: string }> = {};
const schemeNameCache: Record<string, { schemeCode: string; schemeName: string }> = {};

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
    console.log('Fetching NAV data from AMFI directly');
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
          
          // Also update the scheme name cache
          schemeNameCache[schemeName.toLowerCase()] = { schemeCode, schemeName };
        }
      }
    }
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify(navData));
    console.log(`Cached ${navData.length} NAV entries from AMFI`);
    
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
    // Try direct AMFI data first
    const allData = await fetchAllNavData();
    
    const normalizedSearchTerm = searchTerm.toLowerCase();
    const normalizedAmc = amc ? amc.toLowerCase() : '';
    
    // Filter schemes by search term and AMC
    const results = allData.filter(scheme => {
      const schemeName = scheme.schemeName.toLowerCase();
      const matchesSearchTerm = schemeName.includes(normalizedSearchTerm);
      const matchesAmc = !normalizedAmc || schemeName.includes(normalizedAmc);
      return matchesSearchTerm && matchesAmc;
    });
    
    console.log(`Found ${results.length} results for "${searchTerm}" (${amc || 'no AMC'})`);
    return results;
  } catch (error) {
    console.error('Error searching schemes:', error);
    return [];
  }
};

/**
 * Improved algorithm to find the best matching scheme based on name and AMC
 */
export const findBestSchemeMatch = async (schemeName: string, amc: string): Promise<AmfiNavData | null> => {
  try {
    console.log(`Finding best match for "${schemeName}" (${amc})`);
    
    // Clean up scheme name to increase match likelihood
    const cleanSchemeName = cleanUpSchemeName(schemeName);
    const cleanAmc = amc.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // First check cache for this exact combination
    const cacheKey = `${cleanSchemeName}_${cleanAmc}`.toLowerCase().replace(/\s+/g, '_');
    if (navCache[cacheKey]) {
      console.log(`Using cached NAV for ${cleanSchemeName}`);
      return {
        schemeCode: '',
        schemeName: cleanSchemeName,
        nav: navCache[cacheKey].nav.toString(),
        date: navCache[cacheKey].lastUpdated
      };
    }
    
    // Try exact match first with known scheme codes
    const allData = await fetchAllNavData();
    
    // AMFI website mapping for common AMCs
    const amcMappings: Record<string, string[]> = {
      'icici': ['icici prudential', 'icici pru'],
      'hdfc': ['hdfc'],
      'sbi': ['sbi', 'state bank of india'],
      'axis': ['axis'],
      'uti': ['uti'],
      'kotak': ['kotak'],
      'aditya birla': ['aditya birla', 'absl', 'aditya birla sun life'],
      'dsp': ['dsp'],
      'franklin': ['franklin', 'franklin templeton'],
      'tata': ['tata']
    };
    
    // Function to calculate match score
    const calculateMatchScore = (navData: AmfiNavData): number => {
      const navSchemeName = navData.schemeName.toLowerCase();
      let score = 0;
      
      // Exact match is highest priority
      if (navSchemeName === cleanSchemeName.toLowerCase()) {
        score += 100;
      }
      
      // Check for AMC match using mappings
      let amcMatched = false;
      for (const [amcKey, variants] of Object.entries(amcMappings)) {
        if (cleanAmc.includes(amcKey)) {
          for (const variant of variants) {
            if (navSchemeName.includes(variant)) {
              score += 30;
              amcMatched = true;
              break;
            }
          }
        }
        if (amcMatched) break;
      }
      
      // Check for key words match
      const words = cleanSchemeName.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (word.length > 3 && navSchemeName.includes(word)) {
          score += 5;
        }
      }
      
      // Check for plan type match (Growth, Dividend, etc.)
      const planTypes = ['growth', 'idcw', 'dividend', 'regular', 'direct'];
      for (const planType of planTypes) {
        if (cleanSchemeName.toLowerCase().includes(planType) && navSchemeName.includes(planType)) {
          score += 10;
        }
      }
      
      return score;
    };
    
    // Score all NAV data and find best match
    const scoredResults = allData
      .map(navData => ({
        navData,
        score: calculateMatchScore(navData)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    // Debug logging
    if (scoredResults.length > 0) {
      console.log(`Top matches for ${cleanSchemeName} (${cleanAmc}):`);
      scoredResults.slice(0, 3).forEach((result, i) => {
        console.log(`${i+1}. ${result.navData.schemeName} (Score: ${result.score}, NAV: ${result.navData.nav})`);
      });
    } else {
      console.log(`No matches found for ${cleanSchemeName} (${cleanAmc})`);
    }
    
    const bestMatch = scoredResults.length > 0 ? scoredResults[0].navData : null;
    
    if (bestMatch && bestMatch.nav) {
      // Update cache
      navCache[cacheKey] = {
        nav: parseFloat(bestMatch.nav),
        lastUpdated: new Date().toISOString()
      };
      
      console.log(`Best match for ${cleanSchemeName}: ${bestMatch.schemeName} with NAV ${bestMatch.nav}`);
    }
    
    return bestMatch;
  } catch (error) {
    console.error('Error finding scheme match:', error);
    return null;
  }
};

/**
 * Clean up scheme name to improve matching
 */
const cleanUpSchemeName = (name: string): string => {
  // Normalize common variations
  return name
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\bG\b/gi, 'Growth')
    .replace(/\bD\b/gi, 'Dividend')
    .replace(/\bReg\b/gi, 'Regular')
    .replace(/\bDir\b/gi, 'Direct')
    .trim();
};

/**
 * Gets the current NAV for a specific scheme
 */
export const getCurrentNav = async (schemeName: string, amc: string): Promise<number | null> => {
  try {
    console.log(`Getting NAV for ${schemeName} (${amc})`);
    
    // Create a cache key
    const cacheKey = `${schemeName}_${amc}`.toLowerCase().replace(/\s+/g, '_');
    
    // Check cache first
    if (navCache[cacheKey]) {
      const cachedData = navCache[cacheKey];
      
      // Check if cache is from today
      const today = new Date().toISOString().split('T')[0];
      const cachedDate = new Date(cachedData.lastUpdated).toISOString().split('T')[0];
      
      if (cachedDate === today) {
        console.log(`Using cached NAV for ${schemeName}: ${cachedData.nav}`);
        return cachedData.nav;
      }
    }
    
    // Find the best matching scheme
    const match = await findBestSchemeMatch(schemeName, amc);
    
    if (match && match.nav) {
      const navValue = parseFloat(match.nav);
      
      if (!isNaN(navValue)) {
        // Update cache
        navCache[cacheKey] = {
          nav: navValue,
          lastUpdated: new Date().toISOString()
        };
        
        console.log(`Found NAV for ${schemeName}: ${navValue}`);
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

