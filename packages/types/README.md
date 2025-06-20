# @bmb/types

Common TypeScript types and schema definitions for BMB Inc projects and tools.

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
npm install @bmb/types
# or
yarn add @bmb/types
```

## Usage

```typescript
import { 
  // Auto schemas
  BACoveragesSchema,
  DriversSchema,
  VehiclesSchema,
  
  // Client schemas
  ClientsSchema,
  
  // Policy schemas
  PoliciesSchema,
  
  // And many more...
} from '@bmb/types';

// Use the schemas for validation
const client = ClientsSchema.parse(rawClientData);
```

## Available Schemas

This package includes TypeScript schemas and types for:

- **Auto Insurance**: Coverages, drivers, vehicles, underwriting
- **Builders Risk**: Coverages, underwriting, additional info
- **Commercial Property**: Coverages, blankets, building descriptions
- **General Liability**: Coverages, exposures, underwriting
- **Equipment**: Scheduled and unscheduled coverages
- **Umbrella**: Coverages, exposures, underwriting
- **Workers Compensation**: Coverages, exposures, owners/officers
- **Common**: Clients, contacts, locations, policies, insurors
- **SOAP Services**: Staff and client integrations

## Development

### Building

```bash
npm run build
```

## License

MIT 