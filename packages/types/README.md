# @bmb-inc/types

Comprehensive TypeScript types and Zod schema definitions for BMB Inc projects and tools, providing complete coverage of insurance industry data structures.

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
npm install @bmb-inc/types
# or
yarn add @bmb-inc/types
```

## Usage

```typescript
import { 
  // SQL Database Schemas
  PoliciesSchema,
  ClientsSchema,
  BACoveragesSchema,
  DriversSchema,
  VehiclesSchema,
  
  // SOAP Service Schemas
  SoapClientsSchema,
  SoapPoliciesSchema,
  StaffSchema,
  
  // Coverage-specific schemas
  GLCoveragesSchema,
  WCCoveragesSchema,
  CPCoveragesSchema,
  
  // Type definitions
  type PolicyRecord,
  type ClientRecord,
  type CoverageCode
} from '@bmb-inc/types';

// Runtime validation
const validatedPolicy = PoliciesSchema.parse(rawPolicyData);

// Type-safe usage
const client: ClientRecord = {
  clientCd: 'CLI001',
  clientName: 'Test Client',
  // ... other properties
};
```

## Schema Organization

This package provides comprehensive coverage of insurance industry data structures, organized by domain:

### SQL Database Schemas (`sagitta/sql/`)

Complete coverage of insurance database entities:

#### Core Entities
- **Policies** (`policies/`) - Policy master records and related data
- **Clients** (`clients/`) - Client information and supplemental names
- **Contacts** (`contacts/`) - Contact information and relationships
- **Locations** (`locations/`) - Property locations and building details
- **Insurors** (`insurors/`) - Insurance company information

#### Coverage Types
- **Auto** (`auto/`) - Personal and commercial auto insurance
  - Coverages, drivers, vehicles, underwriting
- **General Liability** (`general-liability/`) - GL coverages and exposures
- **Workers Compensation** (`workers-comp/`) - WC coverages, exposures, owners/officers
- **Commercial Property** (`commercial/`) - CP coverages, blankets, building descriptions
- **Equipment** (`equipment/`) - Scheduled and unscheduled equipment coverage
- **Builders Risk** (`builders-risk/`) - Construction and builders risk coverage
- **Umbrella** (`umbrella/`) - Umbrella coverages, exposures, underwriting
- **Miscellaneous Coverages** (`misc-coverages/`) - Specialty and miscellaneous lines

#### Supporting Data
- **Coverages** (`coverages/`) - General coverage information
- **Underwriting** - Underwriting details across all lines

### SOAP Service Schemas (`sagitta/soap/`)

Schemas for SOAP web service integration:

#### Service Interfaces
- **Clients** (`clients/`) - SOAP client service schemas
- **Policies** (`policies/`) - SOAP policy service schemas  
- **Staff** (`staff/`) - Staff and user management schemas

## Key Features

### Runtime Validation
All schemas are built with Zod for runtime validation:

```typescript
import { PoliciesSchema } from '@bmb-inc/types';

// Parse and validate data
const policy = PoliciesSchema.parse(inputData);

// Safe parsing with error handling
const result = PoliciesSchema.safeParse(inputData);
if (result.success) {
  const policy = result.data;
} else {
  console.error('Validation errors:', result.error.issues);
}
```

### Type Inference
TypeScript types are automatically inferred from Zod schemas:

```typescript
import { type z } from 'zod';
import { ClientsSchema } from '@bmb-inc/types';

// Type is automatically inferred
type ClientRecord = z.infer<typeof ClientsSchema>;

const client: ClientRecord = {
  clientCd: 'CLI001',
  clientName: 'Example Client',
  // TypeScript will enforce the correct structure
};
```

### Coverage Code Enums
Comprehensive enum definitions for insurance industry codes:

```typescript
export enum CoverageCode {
  AUT = 'AUT',    // Auto-Personal
  CAU = 'CAU',    // Auto-Commercial
  CPP = 'CPP',    // Property-Commercial
  GLL = 'GLL',    // General Liability
  WOR = 'WOR',    // Workers Compensation
  CYB = 'CYB',    // Cyber Liability
  D_O = 'D_O',    // Directors & Officers
  // ... 180+ coverage codes
}
```

## Schema Examples

### Policy Schema
```typescript
const policy = PoliciesSchema.parse({
  policyCd: 'POL123456',
  policyNumber: 'POL-2023-001',
  clientCd: 'CLI001',
  coverageCd: 'AUT',
  effectiveDate: new Date('2023-01-01'),
  expirationDate: new Date('2023-12-31'),
  // ... additional fields
});
```

### Client Schema
```typescript
const client = ClientsSchema.parse({
  clientCd: 'CLI001',
  clientName: 'John Doe',
  addressLine1: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zipCode: '12345',
  // ... additional fields
});
```

### Coverage Schema
```typescript
const coverage = BACoveragesSchema.parse({
  policyCd: 'POL123456',
  coverageSequence: 1,
  limitAmount: 1000000,
  deductibleAmount: 1000,
  // ... coverage-specific fields
});
```

## Integration Points

This package integrates seamlessly with other BMB packages:

- **[@bmb-inc/constants](../constants/)**: Uses coverage code constants for validation
- **[@bmb-inc/sagitta-soap](../sagitta-soap/)**: Provides schemas for SOAP response validation
- **[@bmb-inc/utils](../utils/)**: Compatible with utility functions for data transformation

## Development

### Building

```bash
npm run build
```

### Schema Development

When adding new schemas:

1. Create the schema file in the appropriate domain directory
2. Export from the domain's `index.ts`
3. Add to the main `index.ts` export
4. Include comprehensive JSDoc comments
5. Add runtime validation examples

### Testing Schemas

```typescript
// Example test pattern
import { describe, it, expect } from 'vitest';
import { PoliciesSchema } from '../policies.schema';

describe('PoliciesSchema', () => {
  it('should validate valid policy data', () => {
    const validPolicy = {
      policyCd: 'POL123',
      policyNumber: 'POL-2023-001',
      // ... other required fields
    };
    
    expect(() => PoliciesSchema.parse(validPolicy)).not.toThrow();
  });
});
```

## Schema Coverage

The package includes **150+ schemas** covering:

- **15 major insurance lines** (Auto, GL, WC, Property, etc.)
- **Core business entities** (Policies, Clients, Contacts, Locations)
- **Coverage-specific data** (Limits, deductibles, endorsements)
- **Underwriting information** (Risk details, rating factors)
- **Service interfaces** (SOAP request/response schemas)

## Dependencies

- `zod`: Runtime validation and type inference
- Development dependencies: `typescript`

## Version

Current version: **0.0.34**

## License

MIT 