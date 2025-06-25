# @bmb-inc/constants

Constants and enums for BMB Inc projects and tools, providing standardized values for insurance coverage codes and other business logic.

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
npm install @bmb-inc/constants
# or
yarn add @bmb-inc/constants
```

## Usage

```typescript
import { coverageCodes, getCoverageCodeById } from '@bmb-inc/constants';

// Access coverage codes by ID
const autoCode = coverageCodes['3'];
console.log(autoCode); // { coverageCode: 'AUT', coverageDesc: 'Auto-Personal' }

// Get coverage code info by ID  
const coverage = getCoverageCodeById('3');
console.log(coverage); // { coverageCode: 'AUT', coverageDesc: 'Auto-Personal' }

// Handle undefined/null IDs safely
const safeCoverage = getCoverageCodeById(null);
console.log(safeCoverage); // Returns appropriate default or throws error
```

## Available Constants

This package includes standardized constants for comprehensive insurance coverage types:

### Major Coverage Categories

- **Auto Insurance**
  - `AUT` - Auto-Personal
  - `CAU` - Auto-Commercial
  - `FAP` - Farm Auto Personal

- **Property Insurance**
  - `CPP` - Property-Commercial
  - `HOW` - Homeowners
  - `CON` - Condominium
  - `FAR` - Farmowners-Personal

- **Liability Insurance**
  - `GLL` - General Liability
  - `EPL` - Employment Practices Liability
  - `D_O` - Directors & Officers
  - `PRO` - Professional Liability

- **Workers Compensation**
  - `WOR` - Workers Compensation
  - `USL` - USL&H Workers Comp

- **Specialty Coverages**
  - `CYB` - Cyber Liability
  - `EQF` - Equipment Floater
  - `BLR` - Boiler and Machinery
  - `CRM` - Crime
  - `FID` - Fidelity Coverage

- **Bonds and Surety**
  - `BCO` - Bonds-Contract
  - `BMI` - Bonds-Miscellaneous
  - `BNO` - Bonds-Notary
  - `ERI` - ERISA Bond

### Total Coverage Types

The package includes **180+ coverage codes** covering:
- Personal and commercial lines
- Property, casualty, and specialty insurance
- Professional liability and errors & omissions
- Bonds, surety, and financial products
- Health, dental, and employee benefits
- International and specialty markets

## API Reference

### `coverageCodes`

An object mapping coverage IDs to coverage information:

```typescript
const coverageCodes: Record<string, { 
  coverageCode: CoverageCode; 
  coverageDesc: string 
}>
```

### `getCoverageCodeById(id)`

Retrieves coverage code information by ID with safe handling:

```typescript
function getCoverageCodeById(
  coverageId: string | number | null | undefined
): { coverageCode: CoverageCode; coverageDesc: string }
```

**Parameters:**
- `coverageId` - The coverage ID to look up (string, number, null, or undefined)

**Returns:**
- Object with `coverageCode` and `coverageDesc` properties

**Error Handling:**
- Safely handles null/undefined input
- Provides appropriate error messages for invalid IDs

## Type Safety

This package uses TypeScript enums from `@bmb-inc/types` for type safety:

```typescript
import { CoverageCode } from '@bmb-inc/types';

// All coverage codes are properly typed
const coverage: { coverageCode: CoverageCode; coverageDesc: string } = 
  getCoverageCodeById('3');
```

## Development

### Building

```bash
npm run build
```

### Dependencies

- `@bmb-inc/types` - For `CoverageCode` enum and type definitions

## Version

Current version: **0.0.21**

## License

MIT 