// api-client/src/fetcher.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import type { ZodSchema } from 'zod';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const TENANT_ID = import.meta.env.VITE_TENANT_ID;
const IMAGERIGHT_API_URL = import.meta.env.VITE_IMAGERIGHT_API_URL;
const IMAGERIGHT_USERNAME = import.meta.env.VITE_IMAGERIGHT_USERNAME;
const VITE_IMAGERIGHT_PASSWORD = import.meta.env.VITE_IMAGERIGHT_PASSWORD;

export interface AuthTokens {
  accessToken: string;
  expiresAt: number; // timestamp in milliseconds
}

export interface AuthConfig {
  tenantId: string;
  baseUrl: string;
  authEndpoint: string;
  tokenExpirationEndpoint: string;
  credentials: {
    UserName: string;
    Password: string;
  };
}

class AuthManager {
  private tokens: AuthTokens | null = null;
  private config: AuthConfig | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Auto-initialize with environment variables
    this.initialize({
      tenantId: TENANT_ID,
      baseUrl: IMAGERIGHT_API_URL,
      authEndpoint: '/authenticate',
      tokenExpirationEndpoint: '/validto',
      credentials: {
        UserName: IMAGERIGHT_USERNAME,
        Password: VITE_IMAGERIGHT_PASSWORD,
      },
    });
  }

  initialize(config: AuthConfig) {
    this.config = config;
  }

  async authenticate(): Promise<void> {
    if (!this.config) {
      throw new Error('AuthManager not initialized');
    }

    try {
      const authUrl = `${this.config.baseUrl}${this.config.authEndpoint}`;
      
      // Use JSON.stringify to properly escape any quotes in the values
      const requestBody = JSON.stringify({
        UserName: this.config.credentials.UserName,
        Password: this.config.credentials.Password
      });
      
      const requestHeaders = {
        'Content-Type': 'application/json',
        'Tenant-Id': this.config.tenantId,
        'Accept': 'application/json',
        'User-Agent': 'ImageRight-Client/1.0',
        'Cache-Control': 'no-cache',
      };

      console.log('Attempting authentication to:', authUrl);
      console.log('Method: POST');
      console.log('Request headers:', requestHeaders);
      console.log('Auth payload:', this.config.credentials);
      console.log('Request body (raw):', requestBody);
      console.log('Request body (parsed):', JSON.parse(requestBody));
      console.log('Tenant ID:', this.config.tenantId);

      // Get the access token
      const authResponse = await fetch(authUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: requestBody,
        credentials: 'omit', // Don't send cookies - they might interfere
      });

      console.log('Auth response status:', authResponse.status);
      console.log('Auth response headers:', Object.fromEntries(authResponse.headers.entries()));

      if (!authResponse.ok) {
        let errorText;
        try {
          errorText = await authResponse.text();
          console.error('Auth response error (text):', errorText);
          
          // Try to parse as JSON if possible
          try {
            const errorJson = JSON.parse(errorText);
            console.error('Auth response error (parsed JSON):', errorJson);
          } catch (e) {
            console.error('Error response is not JSON');
          }
        } catch (e) {
          console.error('Could not read error response body');
          errorText = 'Could not read response';
        }
        
        console.error('Full response details:', {
          status: authResponse.status,
          statusText: authResponse.statusText,
          headers: Object.fromEntries(authResponse.headers.entries()),
          body: errorText
        });
        throw new Error(`Authentication failed: ${authResponse.status} - ${errorText}`);
      }

      // Auth endpoint returns just the token
      const accessToken = await authResponse.text();
      console.log('Received access token:', accessToken ? 'Token received' : 'No token');

      // Get token expiration from separate endpoint
      const expirationResponse = await fetch(`${this.config.baseUrl}${this.config.tokenExpirationEndpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Access Token ${accessToken}`,
          'Tenant-Id': this.config.tenantId,
        },
        credentials: 'omit', // Don't send cookies
      });

      console.log('Expiration response status:', expirationResponse.status);

      if (!expirationResponse.ok) {
        const errorText = await expirationResponse.text();
        console.error('Expiration response error:', errorText);
        throw new Error(`Failed to get token expiration: ${expirationResponse.status} - ${errorText}`);
      }

      // /validto endpoint returns a date string like "2025-09-19T13:00:24.601Z"
      const expirationDateString = await expirationResponse.text();
      const expiresAt = new Date(expirationDateString).getTime();

      console.log('Token expires at:', new Date(expiresAt).toISOString());

      this.tokens = {
        accessToken,
        expiresAt,
      };

      this.scheduleRefresh();
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  private scheduleRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.tokens) return;

    // Refresh 5 minutes (300000ms) before expiration
    const refreshTime = this.tokens.expiresAt - Date.now() - 300000;
    
    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.authenticate().catch(console.error);
      }, refreshTime);
    }
  }

  async getAuthHeaders(): Promise<Record<string, string>> {
    // Development mode - use manual token if available
    const DEV_TOKEN = import.meta.env.VITE_DEV_TOKEN;
    if (import.meta.env.DEV && DEV_TOKEN) {
      console.log('🔧 Using development token from environment');
      return {
        'Authorization': `Access Token ${DEV_TOKEN}`,
        'Tenant-Id': this.config?.tenantId || import.meta.env.VITE_TENANT_ID,
      };
    }

    if (!this.config) {
      throw new Error('AuthManager not initialized');
    }

    // Check if token is expired or will expire soon (within 1 minute)
    if (!this.tokens || this.tokens.expiresAt - Date.now() < 60000) {
      await this.authenticate();
    }

    return {
      'Authorization': `Access Token ${this.tokens!.accessToken}`,
      'Tenant-Id': this.config.tenantId,
    };
  }

  getTenantId(): string {
    if (!this.config) {
      throw new Error('AuthManager not initialized');
    }
    return this.config.tenantId;
  }

  cleanup() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

export const authManager = new AuthManager();

export function createQuery<T>(key: string, endpoint: string, schema: ZodSchema<T>) {
  return () => useQuery({
    queryKey: [key],
    queryFn: async () => {
      try {
        const authHeaders = await authManager.getAuthHeaders();
        const fullUrl = `${IMAGERIGHT_API_URL}${endpoint}`;
        
        const res = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          credentials: 'omit', // Don't send cookies
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return schema.parse(json);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('An unexpected error occurred');
      }
    },
  });
}

export function createMutation<TReq, TRes>(
  key: string,
  endpoint: string,
  schema: ZodSchema<TRes>,
  method: HttpMethod = 'POST'
) {
  return () => useMutation<TRes, Error, TReq>({
    mutationKey: [key],
    mutationFn: async (body) => {
      try {
        const authHeaders = await authManager.getAuthHeaders();
        const fullUrl = `${IMAGERIGHT_API_URL}${endpoint}`;
        
        const res = await fetch(fullUrl, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          body: JSON.stringify(body),
          credentials: 'omit', // Don't send cookies
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return schema.parse(json);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('An unexpected error occurred');
      }
    },
  });
}
