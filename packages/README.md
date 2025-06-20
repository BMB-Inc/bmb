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

- Package names should use the `@bmb/` scope
- Service packages: `@bmb/services/[service-name]`
- Utility packages: `@bmb/[package-name]`

## Examples of Future Packages

- `@bmb/services/soap` - SOAP service integrations
- `@bmb/services/rest` - REST API services  
- `@bmb/utils` - Common utilities
- `@bmb/config` - Configuration management
- `@bmb/logger` - Logging utilities

## Development

Each package should have its own:
- `package.json` with proper `@bmb/` scoped naming
- TypeScript configuration
- Build scripts
- Tests 