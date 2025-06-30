// Azure Identity Client
export { AzureClient } from './azure/client.js';

// Authentication Service (username/password - may be disabled by admin)
export {
    AuthService,
    type AuthConfig,
    type UserCredentials,
    type AuthResult
} from './service/authService.js';

// Web Authentication Service (OAuth flows for web apps)
export {
    WebAuthService,
    type WebAuthConfig,
    type WebAuthResult,
    type DeviceCodeInfo,
    type TokenClaims,
    type UserProfile
} from './service/webAuthService.js';

// Re-export commonly used types from Azure Identity
export type { AccessToken } from '@azure/identity'; 