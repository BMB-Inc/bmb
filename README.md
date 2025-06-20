# BMB Monorepo

This monorepo contains shared packages for BMB Inc projects and services.

## 📦 Packages

- **[@bmb-inc/types](./packages/types)** - Common TypeScript types and schema definitions
- **[@bmb-inc/utils](./packages/utils)** - Common utils for BMB Inc related projects.

### 🚧 Future Packages
- `@bmb-inc/services` - SOAP and REST service integrations  
- `@bmb-inc/utils` - Common utilities
- `@bmb-inc/config` - Configuration management
- And more...

## 🏗️ Project Structure

```
bmb/
├── packages/
│   ├── types/              # @bmb-inc/types - schemas and types
│   │   ├── src/
│   │   ├── package.json
│   │   └── dist/
│   └── services/           # @bmb-inc/services - future services
│       └── soap/           # SOAP integrations (example)
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
yarn build  # Builds @bmb-inc/types
```

### Publish Packages
```bash
yarn publish:types  # Publish @bmb-inc/types
```

## 📋 Adding New Packages

When adding new packages like `@bmb-inc/services`:

1. Create the package directory: `packages/services/`
2. Add `package.json` with proper `@bmb-inc/` scoped naming
3. Reference other packages using `"@bmb-inc/types": "workspace:*"`
4. Update root `package.json` workspace scripts

See [MONOREPO-SETUP.md](./MONOREPO-SETUP.md) for detailed instructions.

## 🔒 Privacy

All packages are **private to BMB organization**:
- Published to GitHub Packages (not public npm)
- Requires GitHub authentication to install
- Only organization members have access

## 📖 Package Documentation

- [@bmb-inc/types Documentation](./packages/types/README.md)

---

*This monorepo structure ensures clean separation of concerns and makes it easy to scale with new services and utilities.*
