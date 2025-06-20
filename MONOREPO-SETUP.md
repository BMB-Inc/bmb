# BMB Monorepo Setup Guide

This document explains how to add new packages to the BMB monorepo.

## Current Structure

```
bmb/
├── src/                     # @bmb/types source code
├── dist/                    # @bmb/types build output
├── packages/                # Future packages directory
│   └── README.md           # Package structure guide
├── package.json            # @bmb/types package configuration
└── MONOREPO-SETUP.md      # This file
```

## Adding New Packages

When you're ready to add additional packages (like `@bmb/services/soap`), follow these steps:

### 1. Update Root package.json

Add workspace configuration back to the root `package.json`:

```json
{
  "workspaces": {
    "packages": [
      "packages/*"
    ]  
  },
  "scripts": {
    "build:all": "yarn workspaces foreach run build",
    "clean:all": "yarn workspaces foreach run clean"
  }
}
```

### 2. Create Package Structure

```bash
mkdir -p packages/services/soap
```

### 3. Create Package Configuration

Create `packages/services/soap/package.json`:

```json
{
  "name": "@bmb/services/soap",
  "version": "0.0.1",
  "description": "SOAP service integrations for BMB",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf dist"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "@bmb-inc:registry": "https://npm.pkg.github.com"
  },
  "dependencies": {
    "@bmb/types": "workspace:*"
  }
}
```

### 4. Package Naming Conventions

- **Types**: `@bmb/types`
- **Services**: `@bmb/services/[service-name]`  
- **Utilities**: `@bmb/[utility-name]`
- **Configuration**: `@bmb/config`

## Benefits of This Structure

1. **Shared Dependencies**: Common dependencies managed at root level
2. **Cross-Package References**: Easy to reference `@bmb/types` from other packages
3. **Coordinated Publishing**: Publish all packages together or individually
4. **Consistent Tooling**: Shared TypeScript, linting, and build configurations 