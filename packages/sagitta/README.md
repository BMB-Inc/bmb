# @bmb-inc/sagitta

A unified package for Sagitta-based search functionality, including both client search and staff search components.

## Installation

```bash
yarn add @bmb-inc/sagitta
```

## Features

This package combines the functionality of the previous `@bmb-inc/client-search` and `@bmb-inc/staff-search` packages into a single, unified package.

### Client Search
- `ClientSearch` - Standalone client search component
- `ClientSearchForm` - Form-integrated client search component
- `FormExample` - Example implementation
- Hooks: `useGetClients`, `useGetClientById`
- API functions: `getClients`, `getClientById`

### Staff Search
- `StaffSearch` - Main staff search component
- `SearchFieldSelector` - Field selector for staff search
- Hooks: `useGetStaff`, `useStaffSearch`, `useStaffDataTransform`, `useStaffUrlParams`
- API functions: `getStaff`
- Types and schemas for search fields

## Usage

### Client Search

```tsx
import { ClientSearch, ClientSearchForm } from '@bmb-inc/sagitta';

// Standalone component
<ClientSearch 
  placeholder="Search clients..." 
  withTooltip 
  baseUrl="https://your-api.com/api/sagitta"
/>

// Form integration
<ClientSearchForm
  form={form}
  name="clientId"
  label="Select Client"
  placeholder="Search for a client..."
  withTooltip
/>
```

### Staff Search

```tsx
import { StaffSearch } from '@bmb-inc/sagitta';

<StaffSearch 
  label="Select Staff Member"
  placeholder="Search staff..."
  showParamsSelection={true}
  baseUrl="https://your-api.com/api/sagitta"
  onChange={(staffCode) => console.log('Selected:', staffCode)}
/>
```

## Dependencies

This package requires the following peer dependencies:
- `@mantine/core` ^8.2.5
- `@mantine/form` ^8.2.5
- `@mantine/hooks` ^8.2.5
- `@tanstack/react-query` ^5.85.3
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `react-router-dom` ^7.8.2

## Migration from Previous Packages

If you were using `@bmb-inc/client-search` or `@bmb-inc/staff-search`, you can now import everything from `@bmb-inc/sagitta`:

```tsx
// Before
import { ClientSearch } from '@bmb-inc/client-search';
import { StaffSearch } from '@bmb-inc/staff-search';

// After
import { ClientSearch, StaffSearch } from '@bmb-inc/sagitta';
```

All exports remain the same, so your existing code should work without changes.
