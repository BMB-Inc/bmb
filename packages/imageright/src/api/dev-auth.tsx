// Development authentication bypass
const DEV_MODE = import.meta.env.DEV;

// Paste a token from Postman here for development testing
const DEV_TOKEN = "paste-your-postman-token-here";
const DEV_TOKEN_EXPIRY = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now

export class DevAuthManager {
  async getAuthHeaders(): Promise<Record<string, string>> {
    if (DEV_MODE && DEV_TOKEN && DEV_TOKEN !== "paste-your-postman-token-here") {
      console.log('🔧 Using development token');
      return {
        'Authorization': `Access Token ${DEV_TOKEN}`,
        'Tenant-Id': import.meta.env.VITE_TENANT_ID,
      };
    }
    
    throw new Error('No development token configured');
  }
}

export const devAuthManager = new DevAuthManager();

