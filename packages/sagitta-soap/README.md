# @bmb-inc/sagitta-soap

SOAP service client library for integrating with Sagitta insurance management system. Provides a comprehensive interface for making SOAP requests and transforming data between formats.

## Installation

This package is published to GitHub Packages. To install it in your project:

### 1. Configure npm to use GitHub Packages

Create or update your `.npmrc` file in your project root:

```
@bmb-inc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

### 2. Install the package

```bash
npm install @bmb-inc/sagitta-soap
# or
yarn add @bmb-inc/sagitta-soap
```

## Usage

### Basic Setup

```typescript
import { SagittaSoapClient } from '@bmb-inc/sagitta-soap';

// Create client instance with environment variables
const client = await SagittaSoapClient.create();

// Or create with custom WSDL and auth
const client = await SagittaSoapClient.create(
  'https://your-sagitta-wsdl-url.com',
  {
    Account: 'your-account',
    Username: 'your-username',
    Password: 'your-password',
    Accesscode: 'your-access-code',
    Serverpool: 'your-server-pool',
    Onlinecode: 'your-online-code'
  }
);
```

### Environment Variables

Set these environment variables for automatic configuration:

```env
SAGITTA_SOAP_WSDL_URL=https://your-sagitta-wsdl-url.com
SAGITTA_ACCOUNT=your-account
SAGITTA_USERNAME=your-username
SAGITTA_PASSWORD=your-password
SAGITTA_ACCESSCODE=your-access-code
SAGITTA_SERVERPOOL=your-server-pool
SAGITTA_ONLINECODE=your-online-code
```

### Making Requests

```typescript
// Get policies with criteria
const policies = await client.getPolicies({
  policyNumber: 'POL123456',
  clientCd: 'CLIENT001',
  coverageCd: 'AUT',
  effectiveDate: new Date('2023-01-01'),
  expirationDate: new Date('2023-12-31')
});

// Make raw PassThroughReq calls
const result = await client.callPassThroughReq('SELECT * FROM policies WHERE policy_number = "POL123456"');

// Get available methods
const methods = client.getAvailableMethods();

// Describe WSDL structure
const structure = client.describe();
```

## Features

This package provides:

- **SOAP Client**: Full-featured SOAP client for Sagitta web services
- **Authentication**: Built-in authentication handling for Sagitta systems
- **Data Transformation**: Convert between SOAP response formats and standardized schemas
- **Policy Queries**: High-level methods for retrieving policy information
- **WSDL Introspection**: Tools for exploring and understanding the SOAP service structure
- **Error Handling**: Comprehensive error handling and logging
- **TypeScript Support**: Full TypeScript definitions and type safety

## Key Methods

- `SagittaSoapClient.create()`: Factory method to create and initialize client
- `getPolicies(criteria)`: Retrieve policies with filtering criteria
- `callPassThroughReq(statement)`: Execute raw SQL-like statements
- `describe()`: Get WSDL structure description
- `writeWsdlToFile()`: Export WSDL structure to JSON file
- `getAvailableMethods()`: List all available SOAP methods
- `transformSoapPoliciesToSQLPolicies()`: Convert SOAP responses to standard format

## Development

### Building

```bash
npm run build
```

### Running in Development

```bash
npm run dev
```

### Running Built Version

```bash
npm run build:run
```

## Dependencies

- `soap`: SOAP client library
- `fast-xml-parser`: XML parsing utilities
- `@bmb-inc/types`: Type definitions
- `@bmb-inc/constants`: Coverage code constants
- `@bmb-inc/utils`: Utility functions

## License

MIT 