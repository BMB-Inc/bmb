import { createContext, useContext } from 'react';
import type { DocumentTypes, FolderTypes } from '@bmb-inc/types';
import type { ActivePage } from './types.ts';

type TreeContextValue = {
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  allowedExtensions?: string[];
  importedDocumentIds?: string[];
  selectedDocumentId: number | null;
  activePage: ActivePage | null;
  setActivePage: (page: ActivePage | null) => void;
  onDocumentSelect: (docId: number, parentFolderId: number) => void;
  expandedRootFolders: Set<number>;
  toggleRootFolder: (folderId: number) => void;
};

const TreeContext = createContext<TreeContextValue | null>(null);

export function TreeProvider({
  value,
  children,
}: {
  value: TreeContextValue;
  children: React.ReactNode;
}) {
  return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
}

export function useTreeContext() {
  const ctx = useContext(TreeContext);
  if (!ctx) {
    throw new Error('useTreeContext must be used within TreeProvider');
  }
  return ctx;
}
