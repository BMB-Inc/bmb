export type BrowserItem = {
  kind: 'client' | 'folder' | 'document';
  id: number;
  name: string;
  type: string;
  modified: string;
  folderTypeId?: number;
  documentTypeId?: number;
  imagerightUrl?: string | null;
  /** Optional context for cross-folder document navigation */
  folderId?: number | null;
  clientId?: number | null;
};


