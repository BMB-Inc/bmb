# BMB Monorepo

This monorepo contains shared packages for BMB Inc projects and services, providing comprehensive tooling for insurance data management and Sagitta system integration.

## 📦 Packages

- **[@bmb-inc/types](./packages/types)** - TypeScript schemas and type definitions for insurance data structures
- **[@bmb-inc/constants](./packages/constants)** - Insurance coverage codes and standardized constants
- **[@bmb-inc/encryption](./packages/encryption)** - Secure cryptographic utilities with NIST and NYDFS compliance
- **[@bmb-inc/sagitta-soap](./packages/sagitta-soap)** - SOAP client library for Sagitta insurance system integration
- **[@bmb-inc/utils](./packages/utils)** - Common utility functions for date manipulation and data processing

## 🏗️ Project Structure

```
bmb/
├── packages/
│   ├── types/              # @bmb-inc/types - Zod schemas and TypeScript types
│   │   ├── src/
│   │   │   ├── sagitta/
│   │   │   │   ├── sql/    # SQL database schemas
│   │   │   │   └── soap/   # SOAP service schemas
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── dist/
│   ├── constants/          # @bmb-inc/constants - coverage codes and constants
│   │   ├── src/
│   │   │   ├── coverage-codes.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── dist/
│   ├── encryption/         # @bmb-inc/encryption - cryptographic utilities
│   │   ├── src/
│   │   │   ├── aes.ts      # AES encryption utilities
│   │   │   ├── password.ts # Password hashing (Argon2/bcrypt)
│   │   │   ├── rsa.ts      # RSA encryption utilities
│   │   │   ├── factory.ts  # Encryption factory pattern
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── dist/
│   ├── sagitta-soap/       # @bmb-inc/sagitta-soap - SOAP client library
│   │   ├── src/
│   │   │   ├── soap/
│   │   │   │   ├── soapClient.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── output/         # WSDL structure analysis
│   │   ├── package.json
│   │   └── dist/
│   └── utils/              # @bmb-inc/utils - utility functions
│       ├── src/
│       │   ├── dates/
│       │   │   ├── oaDates.ts
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── package.json
│       └── dist/
├── package.json            # Workspace coordinator
└── README.md              # This file
```

## 🚀 Development

### Install Dependencies
```bash
yarn install
```

### Build All Packages
```bash
yarn build:all
```

### Build Specific Package
```bash
yarn build:types          # Build @bmb-inc/types
yarn build:constants      # Build @bmb-inc/constants
yarn build:encryption     # Build @bmb-inc/encryption
yarn build:sagitta-soap   # Build @bmb-inc/sagitta-soap
yarn build:utils          # Build @bmb-inc/utils
```

### Development Mode
```bash
yarn dev:sagitta-soap     # Run sagitta-soap in development mode
```

### Publish Packages
```bash
yarn publish:all          # Publish all packages
yarn publish:types        # Publish @bmb-inc/types
yarn publish:constants    # Publish @bmb-inc/constants
yarn publish:encryption   # Publish @bmb-inc/encryption
yarn publish:sagitta-soap # Publish @bmb-inc/sagitta-soap
yarn publish:utils        # Publish @bmb-inc/utils
```

## 📋 Adding New Packages

When adding new packages:

1. Create the package directory: `packages/[package-name]/`
2. Add `package.json` with proper `@bmb-inc/` scoped naming
3. Reference other packages using `"@bmb-inc/[package-name]": "workspace:*"`
4. Update root `package.json` workspace scripts
5. Add TypeScript configuration (`tsconfig.json`)
6. Create appropriate README documentation

See [MONOREPO-SETUP.md](./MONOREPO-SETUP.md) for detailed instructions.

## 🔒 Privacy

All packages are **private to BMB organization**:
- Published to GitHub Packages (not public npm)
- Requires GitHub authentication to install
- Only organization members have access

## 📖 Package Documentation

- [@bmb-inc/types Documentation](./packages/types/README.md) - Insurance data schemas and types
- [@bmb-inc/constants Documentation](./packages/constants/README.md) - Coverage codes and constants
- [@bmb-inc/encryption Documentation](./packages/encryption/README.md) - Secure cryptographic utilities
- [@bmb-inc/sagitta-soap Documentation](./packages/sagitta-soap/README.md) - SOAP client library
- [@bmb-inc/utils Documentation](./packages/utils/README.md) - Utility functions

## 🎯 Use Cases

This monorepo supports:
- **Insurance Data Management**: Comprehensive schemas for policies, coverages, clients, and more
- **Security & Encryption**: NIST and NYDFS compliant cryptographic operations and password hashing
- **Sagitta Integration**: Complete SOAP client for interacting with Sagitta insurance systems
- **Data Validation**: Zod-based schemas for runtime validation and type safety
- **Cross-Platform Utilities**: Date conversion, data transformation, and common operations

---

*This monorepo structure ensures clean separation of concerns and makes it easy to scale with new services and utilities for insurance industry applications.*
