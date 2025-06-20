# BMB Packages

This directory will contain individual packages for the BMB monorepo.

## Package Structure

Each package should follow this structure:

```
packages/
├── services/
│   ├── soap/
│   │   ├── package.json
│   │   ├── src/
│   │   └── dist/
│   └── rest/
│       ├── package.json  
│       ├── src/
│       └── dist/
└── utils/
    ├── package.json
    ├── src/
    └── dist/
```

## Naming Convention

- Package names should use the `@bmb-inc/` scope
- Service packages: `@bmb-inc/services/[service-name]`
- Utility packages: `@bmb-inc/[package-name]`

## Examples of Future Packages

- `@bmb-inc/services/soap` - SOAP service integrations
- `@bmb-inc/services/rest` - REST API services  
- `@bmb-inc/utils` - Common utilities
- `@bmb-inc/config` - Configuration management
- `@bmb-inc/logger` - Logging utilities

## Development

Each package should have its own:
- `package.json` with proper `@bmb-inc/` scoped naming
- TypeScript configuration
- Build scripts
- Tests 