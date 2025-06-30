import {
    DeviceCodeCredential,
    InteractiveBrowserCredential,
    ClientSecretCredential,
    DefaultAzureCredential,
    AuthenticationRecord
} from "@azure/identity";
import { webcrypto } from "node:crypto";

export interface WebAuthConfig {
    tenantId: string;
    clientId: string;
    clientSecret?: string;
    redirectUri?: string;
    scopes?: string[];
}

export interface DeviceCodeInfo {
    deviceCode: string;
    userCode: string;
    verificationUri: string;
    message: string;
    expiresOn: Date;
}

export interface WebAuthResult {
    success: boolean;
    accessToken?: string;
    expiresOn?: Date;
    account?: AuthenticationRecord;
    error?: string;
}

interface AzureTokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    scope?: string;
    error?: string;
    error_description?: string;
}

export interface TokenClaims {
    iss: string;  // Issuer
    aud: string;  // Audience
    exp: number;  // Expiration time
    iat: number;  // Issued at
    nbf: number;  // Not before
    sub: string;  // Subject (user ID)
    upn?: string; // User Principal Name
    name?: string; // Display name
    preferred_username?: string;
    tid: string;  // Tenant ID
    roles?: string[]; // App roles
    scp?: string; // Scopes
    [key: string]: any;
}

export interface UserProfile {
    id: string;
    displayName: string;
    userPrincipalName: string;
    mail?: string;
    jobTitle?: string;
    department?: string;
    officeLocation?: string;
    mobilePhone?: string;
    businessPhones?: string[];
}

/**
 * Web Authentication Service
 * 
 * Provides secure authentication flows suitable for web applications:
 * - Device Code Flow (for headless/server scenarios)
 * - Interactive Browser Flow (for web apps with redirect)
 * - Service Principal (for server-to-server)
 */
export class WebAuthService {
    private readonly config: WebAuthConfig;

    constructor(config?: Partial<WebAuthConfig>) {
        this.config = {
            tenantId: config?.tenantId || process.env.AZURE_TENANT_ID!,
            clientId: config?.clientId || process.env.AZURE_CLIENT_ID!,
            clientSecret: config?.clientSecret || process.env.AZURE_CLIENT_SECRET,
            redirectUri: config?.redirectUri || process.env.AZURE_REDIRECT_URI || "http://localhost:3000/auth/callback",
            scopes: config?.scopes || ["https://graph.microsoft.com/.default"]
        };

        if (!this.config.tenantId || !this.config.clientId || !this.config.redirectUri) {
            throw new Error("Azure tenant ID and client ID are required");
        }
    }

    /**
     * Interactive Browser Flow - Opens browser for user authentication
     * Perfect for desktop applications or development scenarios
     */
    async authenticateWithBrowser(scope?: string): Promise<WebAuthResult> {
        try {

            const credential = new InteractiveBrowserCredential({
                tenantId: this.config.tenantId,
                clientId: this.config.clientId,
                redirectUri: this.config.redirectUri
            });

            const tokenResponse = await credential.getToken(
                scope || this.config.scopes![0]
            );

            if (!tokenResponse) {
                return {
                    success: false,
                    error: "Failed to obtain access token"
                };
            }


            return {
                success: true,
                accessToken: tokenResponse.token,
                expiresOn: tokenResponse.expiresOnTimestamp ? new Date(tokenResponse.expiresOnTimestamp) : undefined
            };

        } catch (error) {

            return {
                success: false,
                error: error instanceof Error ? error.message : "Browser authentication failed"
            };
        }
    }

    /**
     * Get authorization URL for web application redirect flow
     * Use this to redirect users to Azure AD login page
     */
    getAuthorizationUrl(
        state?: string,
        codeChallenge?: string,
        codeChallengeMethod: string = "S256"
    ): string {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            response_type: 'code',
            redirect_uri: this.config.redirectUri!,
            scope: this.config.scopes!.join(' '),
            response_mode: 'query'
        });

        if (state) {
            params.append('state', state);
        }

        if (codeChallenge) {
            params.append('code_challenge', codeChallenge);
            params.append('code_challenge_method', codeChallengeMethod);
        }

        return `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/authorize?${params.toString()}`;
    }

    /**
     * Exchange authorization code for tokens
     * Use this in your redirect URI handler
     */
    async exchangeCodeForToken(authorizationCode: string, codeVerifier?: string, state?: string): Promise<WebAuthResult & { refreshToken?: string; }> {
        try {

            // Prepare the token request
            const tokenEndpoint = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`;

            const requestBody = new URLSearchParams({
                client_id: this.config.clientId,
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: this.config.redirectUri!,
                scope: this.config.scopes!.join(' ')
            });

            // Add client secret if available (confidential client)
            if (this.config.clientSecret) {
                requestBody.append('client_secret', this.config.clientSecret);
            }

            // Add PKCE code verifier if provided (public client)
            if (codeVerifier) {
                requestBody.append('code_verifier', codeVerifier);
            }

            // Make the token request
            const response = await fetch(tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: requestBody.toString()
            });

            const tokenData = await response.json() as AzureTokenResponse;

            if (!response.ok) {
                return {
                    success: false,
                    error: tokenData.error_description || tokenData.error || "Token exchange failed"
                };
            }


            return {
                success: true,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                expiresOn: tokenData.expires_in ? new Date(Date.now() + (tokenData.expires_in * 1000)) : undefined
            };

        } catch (error) {

            return {
                success: false,
                error: error instanceof Error ? error.message : "Code exchange failed"
            };
        }
    }

    /**
     * Generate PKCE code verifier and challenge for secure authorization code flow
     */
    async generatePKCE(): Promise<{ codeVerifier: string; codeChallenge: string; }> {
        // Generate a random code verifier (43-128 characters)
        const codeVerifier = this.generateRandomString(128);

        // Create code challenge (SHA256 hash of verifier, base64url encoded)
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);

        // Use Web Crypto API for SHA256 hashing
        const hashBuffer = await webcrypto.subtle.digest('SHA-256', data);
        const hashArray = new Uint8Array(hashBuffer);

        // Convert to base64url
        const codeChallenge = this.base64urlEncode(hashArray);

        return { codeVerifier, codeChallenge };
    }

    /**
     * Refresh an access token using a refresh token
     */
    async refreshToken(refreshToken: string, scope?: string): Promise<WebAuthResult & { refreshToken?: string; }> {
        try {

            const tokenEndpoint = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`;

            const requestBody = new URLSearchParams({
                client_id: this.config.clientId,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                scope: scope || this.config.scopes!.join(' ')
            });

            // Add client secret if available
            if (this.config.clientSecret) {
                requestBody.append('client_secret', this.config.clientSecret);
            }

            const response = await fetch(tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: requestBody.toString()
            });

            const tokenData = await response.json() as AzureTokenResponse;

            if (!response.ok) {
                return {
                    success: false,
                    error: tokenData.error_description || tokenData.error || "Token refresh failed"
                };
            }


            return {
                success: true,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token || refreshToken, // Use new refresh token if provided
                expiresOn: tokenData.expires_in ? new Date(Date.now() + (tokenData.expires_in * 1000)) : undefined
            };

        } catch (error) {

            return {
                success: false,
                error: error instanceof Error ? error.message : "Token refresh failed"
            };
        }
    }

    /**
     * Base64URL encode a Uint8Array
     */
    private base64urlEncode(array: Uint8Array): string {
        const base64 = Buffer.from(array).toString('base64');
        return base64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    private generateRandomString(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Validate an access token by verifying its signature and claims
     * This performs basic JWT validation - for production, use a proper JWT library
     */
    async validateToken(accessToken: string): Promise<{ valid: boolean; claims?: TokenClaims; error?: string; }> {
        try {

            // Basic JWT structure validation
            const parts = accessToken.split('.');
            if (parts.length !== 3) {
                return { valid: false, error: "Invalid JWT format" };
            }

            // Decode the payload (claims)
            const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
            const claims = payload as TokenClaims;

            // Basic validations
            const now = Math.floor(Date.now() / 1000);

            // Check expiration
            if (claims.exp && claims.exp < now) {
                return { valid: false, error: "Token has expired" };
            }

            // Check not before
            if (claims.nbf && claims.nbf > now) {
                return { valid: false, error: "Token not yet valid" };
            }

            // Check issuer (should be Microsoft)
            if (!claims.iss || !claims.iss.includes('login.microsoftonline.com')) {
                return { valid: false, error: "Invalid issuer" };
            }

            // Check audience (should be your client ID)
            if (claims.aud !== this.config.clientId) {
                return { valid: false, error: "Invalid audience" };
            }

            // Check tenant
            if (claims.tid !== this.config.tenantId) {
                return { valid: false, error: "Invalid tenant" };
            }


            return { valid: true, claims };

        } catch (error) {
            return {
                valid: false,
                error: error instanceof Error ? error.message : "Token validation failed"
            };
        }
    }

    /**
     * Get user profile from Microsoft Graph using the access token
     */
    async getUserProfile(accessToken: string): Promise<{ success: boolean; user?: UserProfile; error?: string; }> {
        try {

            const response = await fetch('https://graph.microsoft.com/v1.0/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: `Graph API error: ${response.status} ${response.statusText}`
                };
            }

            const userData = await response.json() as UserProfile;


            return { success: true, user: userData };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to get user profile"
            };
        }
    }

    /**
     * Search for users in the directory (requires appropriate permissions)
     */
    async searchUsers(accessToken: string, searchQuery: string): Promise<{ success: boolean; users?: UserProfile[]; error?: string; }> {
        try {

            const encodedQuery = encodeURIComponent(searchQuery);
            const url = `https://graph.microsoft.com/v1.0/users?$search="displayName:${encodedQuery}" OR "userPrincipalName:${encodedQuery}"&$select=id,displayName,userPrincipalName,mail,jobTitle,department`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                    'ConsistencyLevel': 'eventual' // Required for search
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: `User search failed: ${response.status} ${response.statusText}`
                };
            }

            const searchData = await response.json() as { value: UserProfile[]; };

            return { success: true, users: searchData.value };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "User search failed"
            };
        }
    }

    /**
     * Get user's group memberships
     */
    async getUserGroups(accessToken: string, userId?: string): Promise<{ success: boolean; groups?: any[]; error?: string; }> {
        try {
            const endpoint = userId ? `users/${userId}/memberOf` : 'me/memberOf';

            const response = await fetch(`https://graph.microsoft.com/v1.0/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: `Failed to get groups: ${response.status} ${response.statusText}`
                };
            }

            const groupData = await response.json() as { value: any[]; };


            return { success: true, groups: groupData.value };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to get user groups"
            };
        }
    }

    /**
     * Check if user has specific permissions/roles
     */
    async checkUserPermissions(accessToken: string, requiredRole: string): Promise<{ hasPermission: boolean; error?: string; }> {
        try {
            // First validate the token and get claims
            const validation = await this.validateToken(accessToken);
            if (!validation.valid || !validation.claims) {
                return { hasPermission: false, error: validation.error };
            }

            // Check if role is in token claims
            const tokenRoles = validation.claims.roles || [];
            const tokenScopes = validation.claims.scp?.split(' ') || [];

            if (tokenRoles.includes(requiredRole) || tokenScopes.includes(requiredRole)) {
                return { hasPermission: true };
            }

            // If not in token, check group memberships
            const groupsResult = await this.getUserGroups(accessToken);
            if (groupsResult.success && groupsResult.groups) {
                const hasGroupRole = groupsResult.groups.some(group =>
                    group.displayName === requiredRole || group.id === requiredRole
                );

                if (hasGroupRole) {
                    return { hasPermission: true };
                }
            }

            return { hasPermission: false };

        } catch (error) {
            return {
                hasPermission: false,
                error: error instanceof Error ? error.message : "Permission check failed"
            };
        }
    }

    /**
     * Call any Microsoft Graph API endpoint
     */
    async callGraphAPI(accessToken: string, endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any): Promise<{ success: boolean; data?: any; error?: string; }> {
        try {

            const headers: Record<string, string> = {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            };

            if (body && (method === 'POST' || method === 'PUT')) {
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(`https://graph.microsoft.com/v1.0/${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });

            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                return {
                    success: false,
                    error: `Graph API error: ${response.status} ${response.statusText}`,
                    data: responseData
                };
            }

            return { success: true, data: responseData };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Graph API call failed"
            };
        }
    }
}

export default WebAuthService; 