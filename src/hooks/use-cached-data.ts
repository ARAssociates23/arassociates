
import { useState, useEffect } from 'react';

interface UseCachedDataOptions<T> {
  key: string;
  fetchFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number; // in milliseconds
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheEntry<any>> = {};

export function useCachedData<T>({
  key,
  fetchFn,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes default
  onSuccess,
  onError
}: UseCachedDataOptions<T>) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async (skipCache = false) => {
    // Check cache first
    const cachedData = cache[key];
    const now = Date.now();
    
    if (!skipCache && cachedData && (now - cachedData.timestamp < staleTime)) {
      setData(cachedData.data);
      setLastUpdated(new Date(cachedData.timestamp));
      onSuccess?.(cachedData.data);
      return;
    }
    
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      const result = await fetchFn();
      
      // Update cache
      cache[key] = {
        data: result,
        timestamp: now
      };
      
      setData(result);
      setLastUpdated(new Date(now));
      onSuccess?.(result);
    } catch (err) {
      setIsError(true);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: () => fetchData(true),
    lastUpdated
  };
}
