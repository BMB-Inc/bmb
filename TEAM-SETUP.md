# BMB Package Setup Guide for Team Members

This guide helps team members set up access to BMB's private packages published on GitHub Packages.

## 🔐 One-Time Setup

### Step 1: Create GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → [Personal access tokens (classic)](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Fill out the form:
   - **Note**: `BMB Package Access` (or similar)
   - **Expiration**: Choose appropriate timeframe (90 days recommended)
   - **Scopes**: Check ✅ `read:packages`
4. Click **"Generate token"**
5. **IMPORTANT**: Copy the token immediately (you won't see it again!)

### Step 2: Configure Your Project

In your project root directory, create a `.npmrc` file:

```bash
# Create .npmrc file
touch .npmrc
```

Add this content to `.npmrc`:

```
@bmb-inc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN_HERE
```

**Replace `YOUR_GITHUB_TOKEN_HERE` with the token you copied in Step 1.**

### Step 3: Add .npmrc to .gitignore

**CRITICAL**: Never commit your token to git!

Add to your `.gitignore`:
```
.npmrc
npm-debug.log*
yarn-error.log*
```

## 📦 Installing BMB Packages

Once setup is complete, you can install BMB packages:

```bash
# Install the types package
npm install @bmb-inc/types
# or
yarn add @bmb-inc/types

# Install services package (when available)
npm install @bmb-inc/services
# or  
yarn add @bmb-inc/services
```

## 💻 Using BMB Packages

### TypeScript/JavaScript

```typescript
// Import schemas and types
import { 
  ClientsSchema, 
  PoliciesSchema,
  DriversSchema 
} from '@bmb-inc/types';

// Use the schemas for validation
const client = ClientsSchema.parse(clientData);
const policy = PoliciesSchema.parse(policyData);
```

### Future Services Package

```typescript
// When @bmb-inc/services is available
import { SoapClient } from '@bmb-inc/services';

const soapClient = new SoapClient('https://api.example.com');
const client = await soapClient.getClient('12345');
```

## 🔄 Updating Packages

To get the latest versions:

```bash
npm update @bmb-inc/types
# or
yarn upgrade @bmb-inc/types
```

## 🆘 Troubleshooting

### Error: "Package not found"
- Check that you're added to the BMB GitHub organization
- Verify your personal access token has `read:packages` scope
- Ensure `.npmrc` is configured correctly

### Error: "Failed to replace env in config: ${NPM_TOKEN}"
- Your `.npmrc` file has a placeholder instead of your actual token
- Replace `${NPM_TOKEN}` with your actual GitHub token

### Error: "401 Unauthorized"
- Your token may have expired - create a new one
- Check that your token has the correct scopes

## 🎯 Quick Test

To verify everything is working:

```bash
# This should show BMB packages if setup is correct
npm search @bmb-inc --registry=https://npm.pkg.github.com
```

## 📞 Getting Help

If you're having issues:
1. Double-check your GitHub organization membership
2. Verify your token permissions
3. Ask the dev team for help!

---

**Security Reminder**: Keep your GitHub tokens secure and never share them or commit them to version control! 