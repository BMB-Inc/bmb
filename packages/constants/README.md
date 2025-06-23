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
```

## Available Constants

This package includes standardized constants for:

- **Coverage Codes**: Comprehensive mapping of insurance coverage types
  - Auto (Personal and Commercial)
  - Property (Homeowners, Dwelling, Commercial Property)
  - Liability (General, Professional, D&O)
  - Workers Compensation
  - Bonds and Surety
  - Specialty coverages (Cyber, EPL, etc.)

## Functions

- `getCoverageCodeById(id)`: Retrieves coverage code information by ID
- `coverageCodes`: Object mapping coverage IDs to their codes and descriptions

## Development

### Building

```bash
npm run build
```

## License

MIT 