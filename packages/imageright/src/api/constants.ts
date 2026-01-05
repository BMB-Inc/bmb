export const DEFAULT_BASE_URL = 'https://staging.bmbinc.com/api/Imageright';

// In development, use relative URL to leverage Vite proxy and avoid CORS
const DEV_BASE_URL = '/api/Imageright';

/**
 * Get the effective API base URL, checking context value, env var, and fallback.
 * In development, uses relative path to proxy through Vite dev server.
 */
export const getBaseUrl = (baseUrl?: string): string => {
  // If explicitly provided, use that
  if (baseUrl) return baseUrl;
  
  // Check environment variable
  const envUrl = (import.meta as any).env?.VITE_IMAGERIGHT_API_URL;
  if (envUrl) return envUrl;
  
  // Use dev proxy URL in development, staging URL in production
  return (import.meta as any).env?.DEV ? DEV_BASE_URL : DEFAULT_BASE_URL;
};

