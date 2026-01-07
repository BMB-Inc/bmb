# @bmb-inc/imageright

A React component library for browsing and managing ImageRight documents, folders, and files.

## Features

- 🌲 **Tree View** - Hierarchical folder and document browsing
- 📊 **Table View** - Flat list view of documents with sorting and filtering
- 🔄 **View Toggle** - Switch between tree and table views
- 🔍 **Search & Filter** - Filter by folder types, document types, and file extensions
- 🔐 **Authentication** - Automatic cookie-based authentication support
- 🌐 **Multi-Server** - Configure different API base URLs for different environments
- 📄 **Page Selection** - Select and manage individual document pages
- 📋 **Tasks & Workflows** - View and manage ImageRight tasks and workflows
- ⚡ **Performance** - Built-in request caching and optimizations

## Installation

```bash
yarn add @bmb-inc/imageright
```

## Quick Start

```tsx
import { ImageRightBrowser } from '@bmb-inc/imageright';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';

function App() {
  return (
    <ImageRightBrowser
      folderTypes={[FolderTypes.policy, FolderTypes.binding]}
      documentTypes={[DocumentTypes.policy]}
      defaultViewMode="tree"
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
| `defaultViewMode` | `'tree' \| 'table'` | `'tree'` | Initial view mode |
| `showViewToggle` | `boolean` | `true` | Show/hide the view mode toggle |
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

Main component with toggle between tree and table views.

```tsx
<ImageRightBrowser
  folderTypes={[FolderTypes.policy]}
  documentTypes={[DocumentTypes.policy]}
  defaultViewMode="tree"
/>
```

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

## Architecture

The package follows a clean architecture:

```
ImageRightBrowser (UI Component)
    ↓
ImageRightProvider (Context with baseUrl)
    ↓
Hooks (useImageRightConfig for baseUrl)
    ↓
API Functions (with baseUrl parameter)
    ↓
Fetcher (constructs URLs, adds credentials)
    ↓
ImageRight API
```

## License

Proprietary - BMB Inc.

## Additional Documentation

- [AUTH-AND-BASEURL.md](./AUTH-AND-BASEURL.md) - Detailed authentication and base URL configuration guide
- [DEV-CONFIG.md](./DEV-CONFIG.md) - Development environment setup
