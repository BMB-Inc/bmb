import { UsernamePasswordCredential, ClientSecretCredential, DefaultAzureCredential } from "@azure/identity";

export interface AuthConfig {
    tenantId: string;
    clientId: string;
    clientSecret?: string;
    authority?: string;
}

export interface UserCredentials {
    username: string;
    password: string;
}

export interface AuthResult {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    expiresOn?: Date;
    account?: {
        username: string;
        name?: string;
        tenantId: string;
    };
    error?: string;
}

/**
 * Azure Authentication Service
 * 
 * Provides user authentication against Azure AD using username/password credentials
 * and retrieves access tokens for authenticated users.
 */
export class AuthService {
    private readonly config: AuthConfig;

    constructor(config?: Partial<AuthConfig>) {
        this.config = {
            tenantId: config?.tenantId || process.env.AZURE_TENANT_ID!,
            clientId: config?.clientId || process.env.AZURE_CLIENT_ID!,
            clientSecret: config?.clientSecret || process.env.AZURE_CLIENT_SECRET,
            authority: config?.authority || `https://login.microsoftonline.com/${config?.tenantId || process.env.AZURE_TENANT_ID}`
        };

        if (!this.config.tenantId || !this.config.clientId) {
            throw new Error("Azure tenant ID and client ID are required");
        }
    }

    /**
     * Authenticate a user with username and password
     * @param credentials - User's AD credentials
     * @param scope - Token scope (default: Microsoft Graph)
     * @returns Authentication result with token information
     */
    async authenticateUser(
        credentials: UserCredentials,
        scope: string = "https://graph.microsoft.com/.default"
    ): Promise<AuthResult> {
        try {
            console.log(`🔐 Authenticating user: ${credentials.username}`);

            // Create username/password credential
            const userCredential = new UsernamePasswordCredential(
                this.config.tenantId,
                this.config.clientId,
                credentials.username,
                credentials.password
            );

            // Get access token
            const tokenResponse = await userCredential.getToken(scope);

            if (!tokenResponse) {
                return {
                    success: false,
                    error: "Failed to obtain access token"
                };
            }

            console.log(`✅ User ${credentials.username} authenticated successfully`);

            return {
                success: true,
                accessToken: tokenResponse.token,
                expiresOn: tokenResponse.expiresOnTimestamp ? new Date(tokenResponse.expiresOnTimestamp) : undefined,
                account: {
                    username: credentials.username,
                    tenantId: this.config.tenantId
                }
            };

        } catch (error) {
            console.error(`❌ Authentication failed for ${credentials.username}:`, error instanceof Error ? error.message : String(error));

            return {
                success: false,
                error: error instanceof Error ? error.message : "Authentication failed"
            };
        }
    }

    /**
     * Validate user credentials without retrieving a token
     * @param credentials - User's AD credentials
     * @returns True if credentials are valid
     */
    async validateCredentials(credentials: UserCredentials): Promise<boolean> {
        try {
            const result = await this.authenticateUser(credentials, "https://graph.microsoft.com/.default");
            return result.success;
        } catch {
            return false;
        }
    }

    /**
     * Get a fresh token for an already authenticated user
     * @param credentials - User's AD credentials
     * @param scope - Token scope
     * @returns Access token
     */
    async getTokenForUser(
        credentials: UserCredentials,
        scope: string = "https://graph.microsoft.com/.default"
    ): Promise<string | null> {
        const result = await this.authenticateUser(credentials, scope);
        return result.success ? result.accessToken || null : null;
    }

    /**
     * Get multiple tokens for different scopes
     * @param credentials - User's AD credentials
     * @param scopes - Array of token scopes
     * @returns Map of scope to token
     */
    async getMultipleTokens(
        credentials: UserCredentials,
        scopes: string[]
    ): Promise<Map<string, string>> {
        const tokens = new Map<string, string>();

        for (const scope of scopes) {
            try {
                const token = await this.getTokenForUser(credentials, scope);
                if (token) {
                    tokens.set(scope, token);
                }
            } catch (error) {
                console.error(`Failed to get token for scope ${scope}:`, error);
            }
        }

        return tokens;
    }

    /**
     * Get service principal token (for server-to-server operations)
     * @param scope - Token scope
     * @returns Service principal access token
     */
    async getServiceToken(scope: string = "https://graph.microsoft.com/.default"): Promise<string | null> {
        try {
            let credential;

            if (this.config.clientSecret) {
                credential = new ClientSecretCredential(
                    this.config.tenantId,
                    this.config.clientId,
                    this.config.clientSecret
                );
            } else {
                credential = new DefaultAzureCredential();
            }

            const tokenResponse = await credential.getToken(scope);
            return tokenResponse ? tokenResponse.token : null;

        } catch (error) {
            console.error("Failed to get service token:", error);
            return null;
        }
    }
}

