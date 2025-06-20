# BMB Monorepo

This monorepo contains shared packages for BMB Inc projects and services.

## 📦 Packages

- **[@bmb/types](./packages/types)** - Common TypeScript types and schema definitions

### 🚧 Future Packages
- `@bmb/services` - SOAP and REST service integrations  
- `@bmb/utils` - Common utilities
- `@bmb/config` - Configuration management
- And more...

## 🏗️ Project Structure

```
bmb/
├── packages/
│   ├── types/              # @bmb/types - schemas and types
│   │   ├── src/
│   │   ├── package.json
│   │   └── dist/
│   └── services/           # @bmb/services - future services
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
yarn build  # Builds @bmb/types
```

### Publish Packages
```bash
yarn publish:types  # Publish @bmb/types
```

## 📋 Adding New Packages

When adding new packages like `@bmb/services`:

1. Create the package directory: `packages/services/`
2. Add `package.json` with proper `@bmb/` scoped naming
3. Reference other packages using `"@bmb/types": "workspace:*"`
4. Update root `package.json` workspace scripts

See [MONOREPO-SETUP.md](./MONOREPO-SETUP.md) for detailed instructions.

## 🔒 Privacy

All packages are **private to BMB organization**:
- Published to GitHub Packages (not public npm)
- Requires GitHub authentication to install
- Only organization members have access

## 📖 Package Documentation

- [@bmb/types Documentation](./packages/types/README.md)

---

*This monorepo structure ensures clean separation of concerns and makes it easy to scale with new services and utilities.*
