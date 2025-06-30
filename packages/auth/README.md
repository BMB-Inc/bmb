# @bmb-inc/auth

Azure Active Directory authentication service for BMB applications.

## Features

- **User Authentication**: Authenticate users with AD credentials using Azure Identity
- **Token Management**: Retrieve and manage Azure access tokens
- **Multiple Scopes**: Support for multiple token scopes
- **Service Principal**: Server-to-server authentication
- **Credential Validation**: Validate user credentials without token retrieval

## Installation

This package is part of the BMB monorepo. Install dependencies from the root:

```bash
yarn install
```

## Configuration

Set the following environment variables:

```env
# Required
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id

# Optional (for service principal authentication)
AZURE_CLIENT_SECRET=your-client-secret

# For testing
TEST_USERNAME=test@yourdomain.com
TEST_PASSWORD=test-password
```

## Usage

### Basic User Authentication

```typescript
import { AuthService, UserCredentials } from '@bmb-inc/auth';

const authService = new AuthService();

const credentials: UserCredentials = {
    username: 'user@yourdomain.com',
    password: 'user-password'
};

// Authenticate user and get token
const result = await authService.authenticateUser(credentials);

if (result.success) {
    console.log('Access Token:', result.accessToken);
    console.log('Account:', result.account);
    console.log('Expires:', result.expiresOn);
} else {
    console.error('Authentication failed:', result.error);
}
```

### Custom Configuration

```typescript
import { AuthService, AuthConfig } from '@bmb-inc/auth';

const config: AuthConfig = {
    tenantId: 'your-tenant-id',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret' // optional
};

const authService = new AuthService(config);
```

### Multiple Token Scopes

```typescript
const scopes = [
    'https://graph.microsoft.com/.default',
    'https://vault.azure.net/.default',
    'https://storage.azure.com/.default'
];

const tokens = await authService.getMultipleTokens(credentials, scopes);

for (const [scope, token] of tokens) {
    console.log(`${scope}: ${token}`);
}
```

### Credential Validation

```typescript
// Just validate credentials without retrieving a token
const isValid = await authService.validateCredentials(credentials);

if (isValid) {
    console.log('Valid credentials');
} else {
    console.log('Invalid credentials');
}
```

### Service Principal Authentication

```typescript
// Get service principal token for server-to-server operations
const serviceToken = await authService.getServiceToken();

if (serviceToken) {
    console.log('Service token:', serviceToken);
}
```

### Legacy Azure Client

The package also includes the original Azure client for backwards compatibility:

```typescript
import { AzureClient } from '@bmb-inc/auth';

const client = new AzureClient();
const token = await client.getToken();
```

## Development

### Build

```bash
yarn build
```

### Test the Service

```bash
# Test the auth service
yarn dev:service

# Test the examples
yarn dev
```

### Example Output

```bash
🚀 BMB Authentication Service Examples

📋 Example 1: User Authentication
🔐 Authenticating user: user@yourdomain.com
✅ User user@yourdomain.com authenticated successfully
✅ User authentication successful!
- Username: user@yourdomain.com
- Tenant ID: your-tenant-id
- Token expires: 2024-01-01T12:00:00.000Z
- Token (first 50 chars): eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
```

## API Reference

### AuthService

#### Constructor

```typescript
constructor(config?: Partial<AuthConfig>)
```

#### Methods

- `authenticateUser(credentials: UserCredentials, scope?: string): Promise<AuthResult>`
- `validateCredentials(credentials: UserCredentials): Promise<boolean>`
- `getTokenForUser(credentials: UserCredentials, scope?: string): Promise<string | null>`
- `getMultipleTokens(credentials: UserCredentials, scopes: string[]): Promise<Map<string, string>>`
- `getServiceToken(scope?: string): Promise<string | null>`

### Types

```typescript
interface AuthConfig {
    tenantId: string;
    clientId: string;
    clientSecret?: string;
    authority?: string;
}

interface UserCredentials {
    username: string;
    password: string;
}

interface AuthResult {
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
```

## Security Notes

- Never hardcode credentials in your source code
- Use environment variables for sensitive configuration
- Tokens have expiration times - implement proper token refresh logic
- The service uses Azure's secure authentication flows
- Username/password authentication requires proper Azure AD configuration

## Troubleshooting

### Common Issues

1. **"Authentication failed"**: Check your Azure AD configuration and credentials
2. **"Tenant ID not found"**: Ensure AZURE_TENANT_ID is set correctly
3. **"Client ID not found"**: Ensure AZURE_CLIENT_ID is set correctly
4. **Token scope errors**: Verify the requested scopes are configured in Azure AD

### Debug Mode

Set `DEBUG=1` to enable additional logging:

```bash
DEBUG=1 yarn dev:service
``` 