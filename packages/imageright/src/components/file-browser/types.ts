export type BrowserItem = {
  kind: 'client' | 'folder' | 'document';
  id: number;
  name: string;
  type: string;
  modified: string;
  folderTypeId?: number;
  documentTypeId?: number;
};


