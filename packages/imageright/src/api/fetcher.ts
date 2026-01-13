import { getBaseUrl } from './constants';

// Simple request cache to prevent duplicate API calls
type CacheEntry = {
  data: any;
  timestamp: number;
  promise?: Promise<any>;
};

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5000; // 5 seconds cache TTL

/**
 * Generate a cache key from request parameters
 */
function getCacheKey(url: string, baseUrl?: string, options?: RequestInit): string {
  // For GET requests, use URL + baseUrl as cache key
  // For POST/PUT/DELETE, don't cache (or include body hash if needed)
  const method = options?.method || 'GET';
  if (method !== 'GET') {
    return ''; // Don't cache non-GET requests
  }
  return `${baseUrl || ''}${url}`;
}

/**
 * Clear expired cache entries
 */
function cleanExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}

export const fetcher = async (url: string, baseUrl?: string, options?: RequestInit) => {
  const apiUrl = getBaseUrl(baseUrl);
  const cacheKey = getCacheKey(url, baseUrl, options);
  
  // Clean expired entries periodically
  if (Math.random() < 0.1) { // 10% chance to clean cache
    cleanExpiredCache();
  }

  // Check cache for GET requests
  if (cacheKey) {
    const cached = cache.get(cacheKey);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < CACHE_TTL) {
        // If there's an in-flight request, wait for it
        if (cached.promise) {
          return cached.promise;
        }
        // Return cached data if still valid and resolved
        if (cached.data !== null && cached.data !== undefined) {
          return cached.data;
        }
      } else {
        // Cache expired, remove it
        cache.delete(cacheKey);
      }
    }
  }

  // Create the fetch promise
  const fetchPromise = (async () => {
    try {
      // In dev mode, use token from env if available
      // NOTE: `import.meta.env` is Vite-specific; other bundlers (e.g. Next/Turbopack)
      // may define `import.meta` but not `import.meta.env`. Keep this optional.
      const devToken = (import.meta as any).env?.VITE_DEV_AUTH_TOKEN;
      
      // Merge default options with provided options, ensuring credentials are included
      const fetchOptions: RequestInit = {
        ...options,
        credentials: 'include', // Always include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
          ...(devToken ? { 'Authorization': `Bearer ${devToken}` } : {}),
          ...(options?.headers || {}),
        },
      };
      
      const response = await fetch(`${apiUrl}${url}`, fetchOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Cache successful GET responses (update existing entry or create new one)
      if (cacheKey) {
        const existing = cache.get(cacheKey);
        cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          // Keep promise reference if it exists (for in-flight requests)
          promise: existing?.promise,
        });
      }

      return data;
    } catch (error) {
      // Remove failed requests from cache
      if (cacheKey) {
        cache.delete(cacheKey);
      }
      console.error("Error fetching data:", error);
      throw error;
    }
  })();

  // Store promise in cache for in-flight requests
  if (cacheKey) {
    cache.set(cacheKey, {
      data: null as any, // Will be updated when promise resolves
      timestamp: Date.now(),
      promise: fetchPromise,
    });
  }

  return fetchPromise;
}

/**
 * Clear the request cache (useful for testing or manual cache invalidation)
 */
export const clearCache = () => {
  cache.clear();
};
