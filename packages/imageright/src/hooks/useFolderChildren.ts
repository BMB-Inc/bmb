import { useMemo } from 'react';
import { useFolders } from '@hooks/useFolders';
import { useDocuments } from '@hooks/useDocuments';
import { useFilteredDocumentsByExtension } from '@hooks/useFilteredDocumentsByExtension';
import { sortFolders } from '@components/file-browser/utils/folderSorting';
import type { DocumentTypes, FolderTypes } from '@bmb-inc/types';

type UseFolderChildrenParams = {
  clientId: number;
  folderId: number;
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  allowedExtensions?: string[];
};

export function useFolderChildren({
  clientId,
  folderId,
  folderTypes,
  documentTypes,
  allowedExtensions,
}: UseFolderChildrenParams) {
  const { data: rawChildFolders = [], isLoading: foldersLoading } = useFolders({
    clientId,
    folderId,
    folderTypes: folderTypes ?? null,
  });

  const { data: rawDocuments = [], isLoading: documentsLoading } = useDocuments(
    { clientId, folderId },
    documentTypes,
  );

  const childFolders = useMemo(() => sortFolders(rawChildFolders || []), [rawChildFolders]);

  const sortedDocuments = useMemo(() => {
    if (!rawDocuments || rawDocuments.length === 0) return [];
    return [...rawDocuments].sort((a: any, b: any) => {
      const aDate = a.dateLastModified || a.dateCreated ? new Date(a.dateLastModified || a.dateCreated).getTime() : 0;
      const bDate = b.dateLastModified || b.dateCreated ? new Date(b.dateLastModified || b.dateCreated).getTime() : 0;
      return bDate - aDate;
    });
  }, [rawDocuments]);

  const { filteredDocuments: documents, isFiltering } = useFilteredDocumentsByExtension(sortedDocuments, allowedExtensions);
  const visibleDocumentIds = useMemo(() => documents.map((d: any) => d.id), [documents]);

  return {
    childFolders,
    documents,
    visibleDocumentIds,
    isLoading: foldersLoading || documentsLoading || isFiltering,
  } as const;
}
