# @bmb-inc/utils

Utility functions and helpers for BMB Inc projects and tools, providing common functionality for date manipulation and other shared operations.

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

// Convert JavaScript Date to OLE Automation date
const oaDate = jsDateToOaDate(new Date('2023-01-01')); // Converts JS Date to OA number
```

## Available Utilities

This package includes utility functions for:

- **Date Utilities** (`@bmb-inc/utils/dates`):
  - `oaDateToJsDate(oaDate)`: Convert OLE Automation date numbers to JavaScript Date objects
  - `jsDateToOaDate(jsDate)`: Convert JavaScript Date objects to OLE Automation date numbers

## Module Exports

The package provides both default exports and named module exports:

- Main export: `@bmb-inc/utils` - exports all utilities
- Date utilities: `@bmb-inc/utils/dates` - exports only date-related functions

## Development

### Building

```bash
npm run build
```

## License

MIT 