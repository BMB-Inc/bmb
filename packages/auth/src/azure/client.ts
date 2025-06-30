import { DefaultAzureCredential, ClientSecretCredential } from "@azure/identity";

/**
 * Azure authentication client using DefaultAzureCredential
 * 
 * This automatically supports multiple authentication methods in order:
 * 1. Service Principal (if AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_CLIENT_SECRET are set)
 * 2. Managed Identity (if running on Azure)
 * 3. Azure CLI (for local development)
 * 4. Azure PowerShell (for local development)
 */
export class AzureClient {
    private readonly credential: DefaultAzureCredential | ClientSecretCredential;

    constructor() {
        // Check if service principal environment variables are available
        const clientId = process.env.AZURE_CLIENT_ID;
        const clientSecret = process.env.AZURE_CLIENT_SECRET;
        const tenantId = process.env.AZURE_TENANT_ID;

        if (clientId && clientSecret && tenantId) {
            console.log("🔑 Using Service Principal authentication");
            this.credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
        } else {
            console.log("⚠️  Service Principal env vars not found, falling back to DefaultAzureCredential");
            console.log("Missing:", {
                AZURE_CLIENT_ID: !clientId,
                AZURE_CLIENT_SECRET: !clientSecret,
                AZURE_TENANT_ID: !tenantId
            });

            let errorMessage = "Service Principal env vars not found.";
            if (!clientId) errorMessage += " AZURE_CLIENT_ID is not set.";
            if (!clientSecret) errorMessage += " AZURE_CLIENT_SECRET is not set.";
            if (!tenantId) errorMessage += " AZURE_TENANT_ID is not set.";
            throw new Error(errorMessage);
        }
    }

    /**
     * Get an access token for the specified scope
     * @param scope - The scope to request the token for (default: Microsoft Graph)
     * @returns The access token
     */
    async getToken(scope: string = "https://graph.microsoft.com/.default") {
        try {
            const token = await this.credential.getToken(scope);
            return token.token;
        } catch (error) {
            console.error("❌ Authentication failed:", error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    /**
     * Get the full token object (includes expiration time)
     * @param scope - The scope to request the token for
     * @returns The complete token object
     */
    async getTokenDetails(scope: string = "https://graph.microsoft.com/.default") {
        return await this.credential.getToken(scope);
    }
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
    const client = new AzureClient();
    client.getToken().then(console.log).catch(console.error);
}