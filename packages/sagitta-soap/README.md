# @bmb-inc/sagitta-soap

SOAP service client library for integrating with Sagitta insurance management system. Provides a comprehensive interface for making SOAP requests, handling authentication, and transforming data between formats.

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
const result = await client.callPassThroughReq(
  'SELECT * FROM POLICIES WHERE POLICY.NUMBER = "POL123456"'
);

// Get available methods
const methods = client.getAvailableMethods();
console.log('Available SOAP methods:', methods);

// Describe WSDL structure
const structure = client.describe();
console.log('WSDL structure:', structure);
```

### Advanced Usage

```typescript
// Transform SOAP responses to standardized format
const transformedPolicies = client.transformSoapPoliciesToSQLPolicies(soapResponse);

// Export WSDL structure for analysis
await client.writeWsdlToFile('./output/wsdl-structure.json');

// Handle authentication manually
const authResult = await client.authenticate();
console.log('Authentication successful:', authResult);
```

## Features

This package provides comprehensive Sagitta integration capabilities:

### Core Features
- **SOAP Client**: Full-featured SOAP client for Sagitta web services
- **Authentication**: Built-in authentication handling for Sagitta systems
- **Policy Queries**: High-level methods for retrieving policy information
- **Data Transformation**: Convert between SOAP response formats and standardized schemas
- **WSDL Introspection**: Tools for exploring and understanding the SOAP service structure
- **Error Handling**: Comprehensive error handling and logging
- **TypeScript Support**: Full TypeScript definitions and type safety

### Data Integration
- **Coverage Code Resolution**: Automatic lookup of coverage codes using `@bmb-inc/constants`
- **Date Conversion**: Automatic handling of OLE Automation dates using `@bmb-inc/utils`
- **Schema Validation**: Runtime validation using schemas from `@bmb-inc/types`
- **XML Processing**: Fast XML parsing and transformation

## API Reference

### `SagittaSoapClient`

#### Static Methods

- `SagittaSoapClient.create(wsdlUrl?, authCredentials?)`: Factory method to create and initialize client

#### Instance Methods

- `getPolicies(criteria)`: Retrieve policies with filtering criteria
- `callPassThroughReq(statement)`: Execute raw SQL-like statements
- `describe()`: Get WSDL structure description
- `writeWsdlToFile(filePath)`: Export WSDL structure to JSON file
- `getAvailableMethods()`: List all available SOAP methods
- `transformSoapPoliciesToSQLPolicies(soapData)`: Convert SOAP responses to standard format
- `authenticate()`: Manually trigger authentication

#### Policy Query Criteria

```typescript
interface PolicyCriteria {
  policyNumber?: string;
  clientCd?: string;
  coverageCd?: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  // ... additional criteria
}
```

## Integration with BMB Packages

This package leverages other BMB packages for enhanced functionality:

- **[@bmb-inc/types](../types/)**: Type definitions and schema validation
- **[@bmb-inc/constants](../constants/)**: Coverage code constants and mappings
- **[@bmb-inc/utils](../utils/)**: Date conversion utilities (OLE Automation dates)

## Error Handling

The client provides comprehensive error handling:

```typescript
try {
  const policies = await client.getPolicies({ policyNumber: 'POL123' });
} catch (error) {
  if (error instanceof SagittaAuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof SagittaSoapError) {
    console.error('SOAP request failed:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

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

## Configuration

### Required Environment Variables

All environment variables are required for proper operation:

- `SAGITTA_SOAP_WSDL_URL`: The WSDL endpoint URL
- `SAGITTA_ACCOUNT`: Account identifier
- `SAGITTA_USERNAME`: Username for authentication
- `SAGITTA_PASSWORD`: Password for authentication  
- `SAGITTA_ACCESSCODE`: Access code for the system
- `SAGITTA_SERVERPOOL`: Server pool identifier
- `SAGITTA_ONLINECODE`: Online access code

## Dependencies

- `soap`: SOAP client library for Node.js
- `fast-xml-parser`: High-performance XML parsing utilities
- `@bmb-inc/types`: Type definitions and schemas
- `@bmb-inc/constants`: Coverage code constants
- `@bmb-inc/utils`: Utility functions for data processing

## Version

Current version: **0.0.28**

## License

MIT 
