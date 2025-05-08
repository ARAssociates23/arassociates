// pages/api/mutualfund.js

import fetch from 'node-fetch';

const API_BASE = 'https://www.mfapi.in/mf';

// In-memory caches
const schemeCache = { data: null, timestamp: 0 };
const isinCache = {}; // maps ISIN to schemeCode
const navCache = {};  // maps schemeCode to { data, timestamp }

const CACHE_DURATION_SCHEMES = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_DURATION_NAV = 60 * 60 * 1000;          // 1 hour

async function fetchAllSchemes() {
  if (schemeCache.data && Date.now() - schemeCache.timestamp < CACHE_DURATION_SCHEMES) {
    return schemeCache.data;
  }
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error(`Failed fetching schemes: ${res.status}`);
  const data = await res.json();
  schemeCache.data = data;
  schemeCache.timestamp = Date.now();
  // Build ISIN index
  data.forEach(s => {
    if (s.isin) isinCache[s.isin] = s.schemeCode;
  });
  return data;
}

async function fetchSchemeNAV(schemeCode) {
  if (navCache[schemeCode] && Date.now() - navCache[schemeCode].timestamp < CACHE_DURATION_NAV) {
    return navCache[schemeCode].data;
  }
  const res = await fetch(`${API_BASE}/${schemeCode}`);
  if (!res.ok) throw new Error(`Failed fetching NAV: ${res.status}`);
  const data = await res.json();
  navCache[schemeCode] = { data, timestamp: Date.now() };
  return data;
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { schemeCode, isin, name } = req.query;

    if (schemeCode) {
      const data = await fetchSchemeNAV(schemeCode);
      const latest = data?.data?.[0];
      return res.status(200).json({
        schemeCode: data.meta.scheme_code,
        schemeName: data.meta.scheme_name,
        nav: latest?.nav,
        date: latest?.date
      });
    }

    if (isin) {
      await fetchAllSchemes();
      const code = isinCache[isin];
      if (!code) return res.status(404).json({ error: `ISIN ${isin} not found` });
      const data = await fetchSchemeNAV(code);
      const latest = data?.data?.[0];
      return res.status(200).json({
        isin,
        schemeCode: data.meta.scheme_code,
        schemeName: data.meta.scheme_name,
        nav: latest?.nav,
        date: latest?.date
      });
    }

    if (name) {
      const schemes = await fetchAllSchemes();
      const matches = schemes.filter(s => s.schemeName.toLowerCase().includes(name.toLowerCase()));
      return res.status(200).json(matches);
    }

    return res.status(400).json({ error: 'Provide schemeCode, isin, or name query param' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
