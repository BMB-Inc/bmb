# BMB Packages

This directory contains individual packages for the BMB monorepo, each serving specific roles in insurance data management and system integration.

## Active Packages

### Core Packages

- **[@bmb-inc/types](./types/)** - TypeScript schemas and type definitions
- **[@bmb-inc/constants](./constants/)** - Insurance coverage codes and constants  
- **[@bmb-inc/sagitta-soap](./sagitta-soap/)** - SOAP client for Sagitta integration
- **[@bmb-inc/utils](./utils/)** - Common utility functions

## Package Structure

Each package follows this standardized structure:

```
packages/[package-name]/
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── README.md            # Package documentation
├── src/                 # Source code
│   ├── index.ts         # Main export file
│   └── [modules]/       # Feature modules
└── dist/                # Compiled output (generated)
```

## Naming Convention

- Package names use the `@bmb-inc/` scope
- Package directories use kebab-case naming
- Main packages: `@bmb-inc/[package-name]`
- Specialized packages: `@bmb-inc/[domain-package]`

## Package Details

### @bmb-inc/types
- **Purpose**: Zod schemas and TypeScript types for insurance data
- **Coverage**: SQL schemas, SOAP schemas, comprehensive insurance entities
- **Dependencies**: `zod` for runtime validation

### @bmb-inc/constants  
- **Purpose**: Standardized constants and enums for insurance business logic
- **Coverage**: Coverage codes, insurance type mappings, standardized values
- **Dependencies**: `@bmb-inc/types` for type safety

### @bmb-inc/sagitta-soap
- **Purpose**: SOAP client library for Sagitta insurance management system
- **Coverage**: Authentication, request handling, data transformation
- **Dependencies**: `soap`, `fast-xml-parser`, all other BMB packages

### @bmb-inc/utils
- **Purpose**: Common utility functions for data processing
- **Coverage**: Date manipulation (OLE Automation dates), data transformations
- **Dependencies**: None (lightweight utilities)

## Development Guidelines

Each package should have:
- **package.json** with proper `@bmb-inc/` scoped naming
- **TypeScript configuration** extending root config
- **Build scripts** (`build`, `clean`)
- **Proper exports** in index.ts
- **README documentation** with usage examples
- **Workspace dependencies** using `"workspace:*"` syntax

## Inter-Package Dependencies

Dependencies flow as follows:
```
utils (no dependencies)
  ↑
constants → types
  ↑         ↑
sagitta-soap (depends on all)
```

This ensures clean dependency management and prevents circular dependencies.

## Future Package Ideas

Potential future packages:
- `@bmb-inc/database` - Database connection and query utilities
- `@bmb-inc/rest-client` - REST API client libraries
- `@bmb-inc/validation` - Extended validation utilities
- `@bmb-inc/logger` - Logging utilities
- `@bmb-inc/config` - Configuration management 