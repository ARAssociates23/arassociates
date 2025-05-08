// mfApiService.ts

import { AmfiNavData } from '@/types/investor';
import { toast } from "sonner";

// === CONFIG ===
const API_BASE = 'https://www.mfapi.in/mf';

// You can inject a custom proxy URL if needed
const DEFAULT_CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  // 'https://your-own-proxy.example.com/?url=' // optional
];

const fundDataCache: Record<string, { data: any; timestamp: number }> = {};
const schemeCodeCache: Record<string, string> = {};
const isinToSchemeCodeCache: Record<string, string> = {};

/**
 * Try fetching with fallback proxies
 */
const fetchWithProxies = async (url: string, proxies = DEFAULT_CORS_PROXIES): Promise<Response> => {
  const proxyUrls = proxies.map(proxy => proxy + url);
  let lastError: any;

  for (const proxyUrl of proxyUrls) {
    try {
      console.log(`Trying proxy: ${proxyUrl}`);
      const res = await fetch(proxyUrl);
      if (res.ok) return res;
      console.warn(`Proxy failed with status ${res.status}: ${proxyUrl}`);
    } catch (err) {
      console.warn(`Proxy error: ${proxyUrl}`, err);
      lastError = err;
    }
  }

  // If running in Node.js → direct fetch works (no CORS)
  if (typeof window === 'undefined') {
    try {
      console.log('Trying direct fetch (server-side)');
      const res = await fetch(url);
      if (res.ok) return res;
      console.warn(`Direct fetch failed with status ${res.status}`);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All proxy fetch attempts failed');
};

/**
 * Fetch all schemes
 */
export const fetchAllSchemes = async (): Promise<any[]> => {
  const CACHE_KEY = 'all_schemes';
  const CACHE_DURATION = 24 * 60 * 60 * 1000;

  if (fundDataCache[CACHE_KEY] && (Date.now() - fundDataCache[CACHE_KEY].timestamp < CACHE_DURATION)) {
    return fundDataCache[CACHE_KEY].data;
  }

  try {
    const response = await fetchWithProxies(API_BASE);
    const data = await response.json();

    if (Array.isArray(data)) {
      data.forEach((scheme) => {
        if (scheme.isin) isinToSchemeCodeCache[scheme.isin] = scheme.schemeCode;
      });
    }

    fundDataCache[CACHE_KEY] = { data, timestamp: Date.now() };
    console.log(`Fetched ${data.length} schemes`);
    return data;
  } catch (err) {
    console.error('fetchAllSchemes error:', err);
    toast.error('Failed to fetch schemes from API', {
      description: 'Check network / proxy or try again later.',
    });
    return [];
  }
};

/**
 * Fetch NAV for scheme code
 */
export const fetchSchemeNAV = async (schemeCode: string): Promise<any> => {
  const CACHE_KEY = `nav_${schemeCode}`;
  const CACHE_DURATION = 60 * 60 * 1000;

  if (fundDataCache[CACHE_KEY] && (Date.now() - fundDataCache[CACHE_KEY].timestamp < CACHE_DURATION)) {
    return fundDataCache[CACHE_KEY].data;
  }

  try {
    const response = await fetchWithProxies(`${API_BASE}/${schemeCode}`);
    const data = await response.json();
    fundDataCache[CACHE_KEY] = { data, timestamp: Date.now() };
    return data;
  } catch (err) {
    console.error(`fetchSchemeNAV error for ${schemeCode}:`, err);
    toast.error(`Failed to fetch NAV for scheme ${schemeCode}`);
    return null;
  }
};

/**
 * Get scheme code from ISIN
 */
export const getSchemeCodeByISIN = async (isin: string): Promise<string | null> => {
  if (isinToSchemeCodeCache[isin]) return isinToSchemeCodeCache[isin];
  const schemes = await fetchAllSchemes();
  const match = schemes.find(s => s.isin === isin);
  if (match) {
    isinToSchemeCodeCache[isin] = match.schemeCode;
    return match.schemeCode;
  }
  return null;
};

/**
 * Get NAV by ISIN
 */
export const getNAVByISIN = async (isin: string): Promise<AmfiNavData | null> => {
  const schemeCode = await getSchemeCodeByISIN(isin);
  if (!schemeCode) {
    toast.error(`No scheme found for ISIN ${isin}`);
    return null;
  }
  const schemeData = await fetchSchemeNAV(schemeCode);
  if (!schemeData || !schemeData.data?.length) return null;
  return {
    schemeCode,
    schemeName: schemeData.meta?.scheme_name,
    nav: schemeData.data[0].nav,
    date: schemeData.data[0].date,
  };
};

/**
 * Initialize service (test API)
 */
export const initMfApiService = async () => {
  try {
    const schemes = await fetchAllSchemes();
    if (schemes.length > 0) {
      console.log('MF API connected successfully');
      toast.success('MF API ready', { description: `${schemes.length} schemes loaded` });
    } else {
      throw new Error('No schemes returned');
    }
  } catch (err) {
    console.error('initMfApiService failed:', err);
    toast.error('MF API connection failed', { description: 'Check network/proxy settings' });
  }
};
