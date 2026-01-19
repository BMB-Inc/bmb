# ImageRight Browser Component & Application

A React component library and standalone application for browsing and viewing ImageRight documents.

## Features

- 📁 Folder and document browsing
- 📄 Multi-format document viewer (PDF, Excel, Word, Images, Email)
- 🔐 Integrated authentication via `@bmb-inc/auth-context`
- 🎨 Modern UI with Mantine components
- ⚡ Fast with Vite and React Query

## Development

### Prerequisites

- Node.js 18+
- Yarn

### Local Development

```bash
# Install dependencies
yarn install

# Start dev server (localhost:5174)
yarn dev
```

### Development with Staging Auth

For development with real authentication through nginx:

```bash
# Start dev server
yarn dev

# Access via: https://staging.bmbinc.com/dev
```

See [DEV-NGINX-SETUP.md](./DEV-NGINX-SETUP.md) for detailed setup instructions.

## Production Deployment

### Quick Deploy

Use the deployment script for easy setup:

```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Deploy
./deploy.sh
```

### Manual Deployment

```bash
# 1. Build the application
yarn build:app

# 2. Start with PM2
pm2 start ecosystem.config.cjs

# 3. Save PM2 process list
pm2 save

# 4. Setup PM2 to start on boot (first time only)
pm2 startup
```

See [PRODUCTION-SETUP.md](./PRODUCTION-SETUP.md) for detailed production instructions.

## PM2 Management

```bash
# View status
pm2 status imageright-app

# View logs
pm2 logs imageright-app

# Restart
pm2 restart imageright-app

# Stop
pm2 stop imageright-app

# Remove from PM2
pm2 delete imageright-app
```

## Configuration

### Environment Variables

- Development: `.env` or `.env.local`
- Production: `.env.production` (create from `.env.production.example`)

Key variables:
- `VITE_IMAGERIGHT_API_URL`: API endpoint (default: `/api/Imageright`)
- `VITE_TENANT_ID`: ImageRight tenant ID

### Ports

- **Development**: 5174 (local dev server)
- **Production**: 3333 (PM2/nginx)

## Using as a Library

This package can also be used as a component library in other applications:

```bash
yarn add @bmb-inc/imageright
```

```tsx
import { ImageRightBrowser } from '@bmb-inc/imageright';
import '@bmb-inc/imageright/styles.css';

function App() {
  return (
    <ImageRightBrowser
      baseUrl="/api/Imageright"
      folderTypes={['Policy']}
    />
  );
}
```

## Props

### ImageRightBrowser

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `folderTypes` | `FolderTypes[]` | - | Filter folders by type |
| `documentTypes` | `DocumentTypes[]` | - | Filter documents by type |
| `defaultViewMode` | `'tree' \| 'table'` | `'tree'` | **Legacy (v1)**. Ignored by `ImageRightBrowser` (now backed by v2). |
| `showViewToggle` | `boolean` | `true` | **Legacy (v1)**. Ignored by `ImageRightBrowser` (now backed by v2). |
| `allowedExtensions` | `FileTypes[]` | - | Filter pages by file extension |
| `baseUrl` | `string` | `'https://staging.bmbinc.com/api/Imageright'` | API base URL |
| `importedDocumentIds` | `string[]` | - | IDs of documents to show as greyed-out/imported |

## Configuration

### Base URL Setup

The package is designed to work with same-domain deployments (your app and ImageRight backend on the same domain). Simply point `baseUrl` to your ImageRight API endpoint:

```tsx
<ImageRightBrowser baseUrl="/api/Imageright" />
```

This works across all environments:
- **Staging:** `staging.bmbinc.com` → fetches from `staging.bmbinc.com/api/Imageright`
- **Production:** `apps.bmbinc.com` → fetches from `apps.bmbinc.com/api/Imageright`

Authentication cookies are automatically included since it's the same domain.

### Custom Base URL

You can also configure the base URL dynamically:

```tsx
import { ImageRightBrowser } from '@bmb-inc/imageright';

// Dynamic based on current domain
const getBaseUrl = () => {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/api/Imageright`;
};

function App() {
  return (
    <ImageRightBrowser
      baseUrl={getBaseUrl()}
      folderTypes={[FolderTypes.policy]}
    />
  );
}
```

### Environment Variables

```tsx
// Use environment variable for flexibility
<ImageRightBrowser
  baseUrl={process.env.NEXT_PUBLIC_IMAGERIGHT_BASE_URL || '/api/Imageright'}
  folderTypes={[FolderTypes.policy]}
/>
```

## Authentication

The package automatically includes cookies with all API requests using `credentials: 'include'`.

### Same-Domain Authentication (Recommended)

When your application and ImageRight backend are on the same domain, authentication works automatically:

```
Your App:       staging.bmbinc.com/your-app
ImageRight:     staging.bmbinc.com/api/Imageright
                ↑ Same domain = cookies sent automatically!
```

**How it works:**
1. User logs into your application
2. Server sets authentication cookies for the domain
3. Browser automatically includes these cookies in all same-domain requests
4. ImageRight package makes requests with `credentials: 'include'`
5. Backend validates cookies and authorizes the request

**Benefits:**
- ✅ No CORS configuration needed
- ✅ Cookies shared automatically
- ✅ Single authentication system
- ✅ Works across multiple apps on the same domain

## Components

### ImageRightBrowser

Main component (now backed by `ImageRightBrowser2`).

```tsx
<ImageRightBrowser
  folderTypes={[FolderTypes.policy]}
  documentTypes={[DocumentTypes.policy]}
/>
```

### ImageRightBrowserV1

Legacy browser (v1). Prefer `ImageRightBrowser` unless you have a migration need.

### FolderFileBrowser

Table view only (no toggle).

```tsx
import { FolderFileBrowser } from '@bmb-inc/imageright';

<FolderFileBrowser
  folderTypes={[FolderTypes.policy]}
  documentTypes={[DocumentTypes.policy]}
/>
```

### FileTreeBrowser

Tree view only (no toggle).

```tsx
import { FileTreeBrowser } from '@bmb-inc/imageright';

<FileTreeBrowser
  folderTypes={[FolderTypes.policy]}
  documentTypes={[DocumentTypes.policy]}
/>
```

### TaskWorkflowViewer

View and manage ImageRight tasks and workflows. Task data includes history (active + completed).

```tsx
import { TaskWorkflowViewer } from '@bmb-inc/imageright';

<TaskWorkflowViewer />
```

## Hooks

The package exports several hooks for custom implementations:

```tsx
import {
  useClients,
  useFolders,
  useDocuments,
  usePages,
  useImages,
  useTasks,
  useWorkflows,
  useSelectedPages,
  useSelectedDocuments,
} from '@bmb-inc/imageright';

// Example: Fetch folders for a client
function MyComponent() {
  const { data, isLoading, error } = useFolders({
    clientId: 12345,
    folderTypes: [FolderTypes.policy],
  });
  
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data?.map(folder => (
        <div key={folder.id}>{folder.name}</div>
      ))}
    </div>
  );
}
```

## API Functions

You can also use the API functions directly:

```tsx
import {
  getClients,
  getFolders,
  getDocuments,
  getPages,
  getImages,
  getTasks,
  getWorkflows,
} from '@bmb-inc/imageright';

// Example: Fetch folders
const folders = await getFolders({
  clientId: 12345,
  folderTypes: [FolderTypes.policy],
}, 'https://staging.bmbinc.com/api/Imageright');
```

## Filtering

### Folder Types

Filter folders using `FolderTypes` enum:

```tsx
import { FolderTypes } from '@bmb-inc/types';

<ImageRightBrowser
  folderTypes={[
    FolderTypes.policy,
    FolderTypes.binding,
    FolderTypes.aiPolicyVerification,
    FolderTypes.submissions,
    FolderTypes.accounting,
  ]}
/>
```

### Document Types

Filter documents using `DocumentTypes` enum:

```tsx
import { DocumentTypes } from '@bmb-inc/types';

<ImageRightBrowser
  documentTypes={[
    DocumentTypes.policy,
    DocumentTypes.aiPolicyVerification,
    DocumentTypes.proposal,
    DocumentTypes.quote,
  ]}
/>
```

### File Extensions

Filter pages by file extension:

```tsx
import { FileTypes } from '@bmb-inc/types';

<ImageRightBrowser
  allowedExtensions={[
    FileTypes.PDF,
    FileTypes.JPG,
    FileTypes.PNG,
  ]}
/>
```

## Development

### Setup

```bash
yarn install
```

### Run Dev Server

```bash
yarn dev
```

### Build

```bash
yarn build
```

### Type Check

```bash
yarn type-check
```
=======
## Scripts

- `yarn dev` - Start development server
- `yarn build` - Build component library
- `yarn build:app` - Build standalone application
- `yarn preview` - Preview production build
- `yarn start` - Start production server (used by PM2)
- `yarn lint` - Run ESLint
>>>>>>> f65aa40 (Update dependencies for Rollup and TypeScript; enhance ImageRight component functionality and documentation)

## Architecture

- **Frontend**: React + TypeScript + Vite
- **State Management**: TanStack Query
- **UI Framework**: Mantine
- **Authentication**: @bmb-inc/auth-context
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx

## Documentation

- [Development Setup](./DEV-NGINX-SETUP.md)
- [Production Setup](./PRODUCTION-SETUP.md)
- [Authentication Guide](./DEV-AUTH.md)
- [Configuration Guide](./DEV-CONFIG.md)
- [Auth & Base URL](./AUTH-AND-BASEURL.md)

## Troubleshooting

### Port Issues

```bash
# Check what's using a port
lsof -i:3333
lsof -i:5174

# Kill process on port
kill -9 <PID>
```

### Build Issues

```bash
# Clean build
yarn clean
yarn build:app
```

### PM2 Issues

```bash
# Check logs
pm2 logs imageright-app --lines 100

# Full restart
pm2 delete imageright-app
pm2 start ecosystem.config.cjs
```

## License

MIT
