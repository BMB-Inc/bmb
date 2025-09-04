# Sagitta Components Development

This package contains React components for client search and staff search functionality, along with a local development environment for testing.

## Development Setup

The package includes a Vite-powered React app for local testing of the components.

### Running the Development App

```bash
# Navigate to the sagitta package
cd packages/sagitta

# Install dependencies (if not already done)
yarn install

# Start the development server
yarn dev:app
```

This will start a local development server at `http://localhost:3000` with a tabbed interface for testing both components:

- **Client Search Tab**: Test the client search functionality
- **Staff Search Tab**: Test the staff search functionality

### Available Scripts

- `yarn dev:app` - Start the development server for component testing
- `yarn build:app` - Build the development app for production
- `yarn preview` - Preview the built development app
- `yarn build` - Build the library for distribution
- `yarn lint` - Run ESLint

### Components Structure

The components are organized in their respective folders:

- `src/client-search/` - Client search components, hooks, and API
- `src/staff-search/` - Staff search components, hooks, and API

All components are exported from `src/index.ts` for library usage.

### Dependencies

The development app includes all necessary providers:
- Mantine UI components and theming
- React Query for data fetching
- React Router for routing
- Auth Context for authentication

## Building for Distribution

To build the library for distribution:

```bash
yarn build
```

This creates the distributable files in the `dist/` directory.
