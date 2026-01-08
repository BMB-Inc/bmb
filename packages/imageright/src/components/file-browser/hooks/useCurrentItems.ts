import { useMemo } from 'react';
import { sortFolders } from '../utils/folderSorting';

type UseCurrentItemsParams = {
  clients: any[] | undefined;
  expandedClientId?: string | null;
  folders: any[] | undefined;
  documents: any[] | undefined;
  currentFolderId?: string | null;
};

export function useCurrentItems({
  clients,
  expandedClientId,
  folders,
  documents,
  currentFolderId,
}: UseCurrentItemsParams) {
  return useMemo(() => {
    const toDateStr = (iso?: string | null) => {
      if (!iso) return '';
      const dt = new Date(iso);
      return isNaN(dt.getTime()) ? '' : dt.toLocaleDateString();
    };
    const toTs = (iso?: string | null) => {
      if (!iso) return 0;
      const dt = new Date(iso);
      return isNaN(dt.getTime()) ? 0 : dt.getTime();
    };

    if (!expandedClientId) {
      return (clients || []).map((c: any) => ({
        kind: 'client' as const,
        id: c.id,
        name: `${c.description} - ${c.fileNumberPart1} ${c.drawerName ? `(${c.drawerName})` : ''}`,
        type: c.fileTypeName || 'Client',
        modified: c.lastModified ? toDateStr(c.lastModified) : '',
      })) as import('../types').BrowserItem[];
    }

    const folderItems = sortFolders(folders || [])
      .map((f: any) => ({
        kind: 'folder' as const,
        id: f.id,
        name: f.description ?? f.folderTypeName,
        type: f.folderTypeName || f.folderTypeDescription || 'Folder',
        modified: toDateStr((f as any).lastModified),
        folderTypeId: (f as any).folderTypeId,
      }));
    if (!currentFolderId) {
      return folderItems as import('../types').BrowserItem[];
    }

    console.log('documents:', documents);
    const documentItems = (documents || [])
      .slice()
      .sort((a: any, b: any) => toTs(a?.dateLastModified || a?.dateCreated) < toTs(b?.dateLastModified || b?.dateCreated) ? 1 : -1)
      .map((d: any) => ({
        kind: 'document' as const,
        id: d.id,
        name: d.description || d.documentTypeDescription,
        type: d.documentTypeDescription || 'Document',
        modified: toDateStr(d.dateLastModified || d.dateCreated),
        documentTypeId: (d as any).documentTypeId,
      }));
    return [...folderItems, ...documentItems] as import('../types').BrowserItem[];
  }, [clients, expandedClientId, folders, documents, currentFolderId]);
}
