# @bmb-inc/utils

Utility functions and helpers for BMB Inc projects and tools, providing common functionality for date manipulation and data processing operations.

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
npm install @bmb-inc/utils
# or
yarn add @bmb-inc/utils
```

## Usage

```typescript
import { oaDateToJsDate, jsDateToOaDate } from '@bmb-inc/utils';
// or import from specific module
import { oaDateToJsDate, jsDateToOaDate } from '@bmb-inc/utils/dates';

// Convert OLE Automation date to JavaScript Date
const jsDate = oaDateToJsDate(44927); // Converts OA date number to JS Date
console.log(jsDate); // 2023-01-01T00:00:00.000Z

// Convert JavaScript Date to OLE Automation date
const oaDate = jsDateToOaDate(new Date('2023-01-01')); 
console.log(oaDate); // 44927

// Handle edge cases safely
const invalidDate = oaDateToJsDate(0); // Handles invalid dates appropriately
```

## Available Utilities

### Date Utilities (`@bmb-inc/utils/dates`)

Essential date conversion functions for working with legacy systems and databases:

#### `oaDateToJsDate(oaDate: number): Date`

Converts OLE Automation date numbers to JavaScript Date objects.

**Parameters:**
- `oaDate` - OLE Automation date number (days since December 31, 1967)

**Returns:**
- JavaScript `Date` object

**Usage:**
```typescript
// Common insurance system dates
const effectiveDate = oaDateToJsDate(44927); // 2023-01-01
const expirationDate = oaDateToJsDate(45292); // 2023-12-31
```

#### `jsDateToOaDate(jsDate: Date): number`

Converts JavaScript Date objects to OLE Automation date numbers.

**Parameters:**
- `jsDate` - JavaScript `Date` object

**Returns:**
- OLE Automation date number

**Usage:**
```typescript
// Convert policy dates for database storage
const policyStart = jsDateToOaDate(new Date('2023-01-01')); // 44927
const policyEnd = jsDateToOaDate(new Date('2023-12-31')); // 45292
```

## Why OLE Automation Dates?

OLE Automation dates are commonly used in:
- **Legacy insurance systems** (including Sagitta)
- **Microsoft Office applications** (Excel, Access)
- **Windows-based databases** and applications
- **Insurance industry data formats**

This utility provides seamless conversion between modern JavaScript dates and these legacy date formats.

## Module Exports

The package provides flexible import options:

```typescript
// Import all utilities
import * as utils from '@bmb-inc/utils';

// Import specific functions
import { oaDateToJsDate, jsDateToOaDate } from '@bmb-inc/utils';

// Import from specific modules
import { oaDateToJsDate } from '@bmb-inc/utils/dates';
```

## Integration with BMB Packages

This package integrates with other BMB packages:

- **[@bmb-inc/sagitta-soap](../sagitta-soap/)**: Automatic date conversion in SOAP responses
- **[@bmb-inc/types](../types/)**: Compatible with date fields in schemas
- **[@bmb-inc/constants](../constants/)**: No direct integration (constants package is dependency-free)

## Common Use Cases

### Insurance Policy Dates
```typescript
import { oaDateToJsDate, jsDateToOaDate } from '@bmb-inc/utils';

// Converting dates from Sagitta system
const policyData = {
  effectiveDate: oaDateToJsDate(44927),
  expirationDate: oaDateToJsDate(45292),
  bindDate: oaDateToJsDate(44900)
};

// Converting dates for database storage
const storageData = {
  effectiveDate: jsDateToOaDate(new Date('2023-01-01')),
  expirationDate: jsDateToOaDate(new Date('2023-12-31'))
};
```

### Batch Data Processing
```typescript
import { oaDateToJsDate } from '@bmb-inc/utils';

// Process batch of policy records
const policies = rawPolicyData.map(policy => ({
  ...policy,
  effectiveDate: oaDateToJsDate(policy.effectiveDateOA),
  expirationDate: oaDateToJsDate(policy.expirationDateOA),
  bindDate: oaDateToJsDate(policy.bindDateOA)
}));
```

### Date Validation
```typescript
import { oaDateToJsDate, jsDateToOaDate } from '@bmb-inc/utils';

function validatePolicyDates(effectiveOA: number, expirationOA: number): boolean {
  const effective = oaDateToJsDate(effectiveOA);
  const expiration = oaDateToJsDate(expirationOA);
  
  return effective < expiration; // Policy dates are valid
}
```

## Error Handling

The utility functions handle edge cases gracefully:

```typescript
// Handle invalid or edge case dates
try {
  const date = oaDateToJsDate(invalidOADate);
} catch (error) {
  console.error('Invalid OA date:', error.message);
}

// Safe conversion with validation
function safeOADateConversion(oaDate: number): Date | null {
  try {
    return oaDateToJsDate(oaDate);
  } catch {
    return null;
  }
}
```

## Development

### Building

```bash
npm run build
```

### Adding New Utilities

When adding new utility functions:

1. Create the utility file in the appropriate domain directory (`src/[domain]/`)
2. Export functions from the domain's `index.ts`
3. Add to the main `src/index.ts` export
4. Include comprehensive JSDoc comments
5. Add usage examples in the README
6. Consider dependencies (keep this package lightweight)

### Testing

```typescript
// Example test pattern
import { describe, it, expect } from 'vitest';
import { oaDateToJsDate, jsDateToOaDate } from '../dates';

describe('Date utilities', () => {
  it('should convert OA date to JS date correctly', () => {
    const jsDate = oaDateToJsDate(44927);
    expect(jsDate.getFullYear()).toBe(2023);
    expect(jsDate.getMonth()).toBe(0); // January
    expect(jsDate.getDate()).toBe(1);
  });
});
```

## Performance

- **Lightweight**: No external dependencies
- **Fast**: Simple mathematical operations
- **Memory efficient**: No object caching or heavy computations
- **Tree-shakeable**: Import only what you need

## Dependencies

- **Runtime**: None (zero dependencies)
- **Development**: `typescript` for compilation

## Version

Current version: **0.0.21**

## License

MIT 
