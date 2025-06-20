# BMB Monorepo Setup Guide

This document explains how to add new packages to the BMB monorepo.

## Current Structure

```
bmb/
├── src/                     # @bmb-inc/types source code
├── dist/                    # @bmb-inc/types build output
├── packages/                # Future packages directory
│   └── README.md           # Package structure guide
├── package.json            # @bmb-inc/types package configuration
└── MONOREPO-SETUP.md      # This file
```

## Adding New Packages

When you're ready to add additional packages (like `@bmb-inc/services/soap`), follow these steps:

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
  "name": "@bmb-inc/services/soap",
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
    "@bmb-inc/types": "workspace:*"
  }
}
```

### 4. TypeScript Configuration

#### Create TypeScript Config

Create `packages/services/soap/tsconfig.json`:

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "dist",
    "node_modules"
  ]
}
```

#### Root TypeScript Config

Update root `tsconfig.json` to support workspace packages:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@bmb-inc/types": ["./src"],
      "@bmb-inc/types/*": ["./src/*"],
      "@bmb-inc/services/*": ["./packages/services/*/src"],
      "@bmb-inc/utils/*": ["./packages/utils/*/src"]
    }
  }
}
```

#### Package Source Structure

Create the source directory structure:

```bash
mkdir -p packages/services/soap/src
touch packages/services/soap/src/index.ts
```

#### TypeScript Build Scripts

Add these scripts to your package's `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  }
}
```

### 5. Package Naming Conventions

- **Types**: `@bmb-inc/types`
- **Services**: `@bmb-inc/services/[service-name]`  
- **Utilities**: `@bmb-inc/utils/[utility-name]`
- **Configuration**: `@bmb-inc/config`

## Benefits of This Structure

1. **Shared Dependencies**: Common dependencies managed at root level
2. **Cross-Package References**: Easy to reference `@bmb-inc/types` from other packages
3. **Coordinated Publishing**: Publish all packages together or individually
4. **Consistent Tooling**: Shared TypeScript, linting, and build configurations 