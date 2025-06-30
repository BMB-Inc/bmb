import WebAuthService from "../service/webAuthService";

export async function webRedirectFlow() {
    const webAuthService = new WebAuthService({
        clientId: process.env.AZURE_CLIENT_ID!,
        clientSecret: process.env.AZURE_CLIENT_SECRET!,
        tenantId: process.env.AZURE_TENANT_ID!,
        redirectUri: process.env.AZURE_REDIRECT_URI || "https://apps.bmbinc.com/expenses",
    });

    console.log("🔧 Configuration:");
    console.log("- Redirect URI:", process.env.AZURE_REDIRECT_URI || "https://apps.bmbinc.com/expenses");

    // For custom redirect URIs, use the authorization code flow instead
    // The Interactive Browser flow always uses localhost

    console.log("\n🌐 Using Authorization Code Flow (for custom redirect URI):");

    // Generate PKCE for security
    const pkce = await webAuthService.generatePKCE();

    // Generate a state parameter for security
    const state = Math.random().toString(36).substring(2, 15);

    // Get the authorization URL
    const authUrl = webAuthService.getAuthorizationUrl(state, pkce.codeChallenge);

    console.log("\n" + "=".repeat(80));
    console.log("🔗 AUTHORIZATION CODE FLOW - CUSTOM REDIRECT");
    console.log("=".repeat(80));
    console.log("1. Open this URL in your browser:");
    console.log(authUrl);
    console.log("\n2. After login, you'll be redirected to your configured URI:");
    console.log(`   ${process.env.AZURE_REDIRECT_URI || "https://apps.bmbinc.com/expenses"}`);
    console.log("\n3. Extract the 'code' parameter from the redirect URL");
    console.log("4. Use webAuthService.exchangeCodeForToken(code, codeVerifier) to get tokens");
    console.log("=".repeat(80));

    // Store the code verifier for the exchange (in real app, store securely)
    console.log(`\n🔑 Code Verifier (save this): ${pkce.codeVerifier}`);
    console.log(`🔑 State (verify this): ${state}`);

    return {
        authUrl,
        codeVerifier: pkce.codeVerifier,
        state
    };
}

export async function completeAuthCodeFlow(authorizationCode: string, codeVerifier: string, state: string) {
    const webAuthService = new WebAuthService({
        clientId: process.env.AZURE_CLIENT_ID!,
        clientSecret: process.env.AZURE_CLIENT_SECRET!,
        tenantId: process.env.AZURE_TENANT_ID!,
        redirectUri: process.env.AZURE_REDIRECT_URI || "https://apps.bmbinc.com/expenses",
    });

    console.log("🔄 Exchanging authorization code for tokens...");

    const result = await webAuthService.exchangeCodeForToken(authorizationCode, codeVerifier, state);

    if (result.success) {
        console.log("✅ Token exchange successful!");
        console.log("- Access Token:", result.accessToken?.substring(0, 50) + "...");
        console.log("- Expires:", result.expiresOn);

        // Get user profile
        if (result.accessToken) {
            const profile = await webAuthService.getUserProfile(result.accessToken);
            console.log("- User:", profile.user?.displayName);
        }
    } else {
        console.error("❌ Token exchange failed:", result.error);
    }

    return result;
}
