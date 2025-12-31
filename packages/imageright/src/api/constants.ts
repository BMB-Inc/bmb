export const DEFAULT_BASE_URL = 'https://staging.bmbinc.com/api/Imageright';

/**
 * Get the effective API base URL, checking context value, env var, and fallback.
 */
export const getBaseUrl = (baseUrl?: string): string => {
  return baseUrl || (import.meta as any).env?.VITE_IMAGERIGHT_API_URL || DEFAULT_BASE_URL;
};

