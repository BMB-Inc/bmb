import { Group, Text } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useFolders } from '@hooks/useFolders';
import { useDocuments } from '@hooks/useDocuments';
import { useFilteredDocumentsByExtension } from '@hooks/useFilteredDocumentsByExtension';
import { sortFolders } from '../file-browser/utils/folderSorting';
import { FolderTreeNode } from '../file-tree/FolderTreeNode';
import { DocumentNode } from '../file-tree/DocumentNode';
import type { DocumentTypes, FolderTypes } from '@bmb-inc/types';
import type { ActivePage } from './types';

export function RootFolderChildren({
  clientId,
  folderId,
  folderTypes,
  documentTypes,
  documentSearch,
  selectedDocumentId,
  onDocumentSelect,
  onPageClick,
  activePage,
  importedDocumentIds,
  allowedExtensions,
}: {
  clientId: number;
  folderId: number;
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  documentSearch?: string;
  selectedDocumentId: number | null;
  onDocumentSelect: (documentId: number, folderId: number) => void;
  onPageClick: (page: ActivePage | null) => void;
  activePage: ActivePage | null;
  importedDocumentIds?: string[];
  allowedExtensions?: string[];
}) {
  const { data: rawChildFolders = [], isLoading: foldersLoading } = useFolders({
    clientId,
    folderId,
    folderTypes: folderTypes ?? null,
  });

  const { data: rawDocuments = [], isLoading: documentsLoading } = useDocuments(
    { clientId, folderId, description: documentSearch || undefined },
    documentTypes,
  );

  const childFolders = useMemo(() => sortFolders(rawChildFolders || []), [rawChildFolders]);

  // newest first
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

  const isLoading = foldersLoading || documentsLoading || isFiltering;

  return (
    <div style={{ marginLeft: 22 }}>
      {isLoading && (
        <Group gap="xs" py={4} px={6}>
          <Text size="sm" c="dimmed">
            Loading...
          </Text>
        </Group>
      )}

      {!isLoading && (
        <>
          {childFolders.map((folder: any) => {
            const childFolderName = folder.description ?? folder.folderTypeName ?? 'Folder';
            const childFolderDisplayName =
              folder.folderTypeDescription && folder.folderTypeDescription !== childFolderName
                ? `${childFolderName} (${folder.folderTypeDescription})`
                : childFolderName;
            return (
              <ExpandableFolderNode
                key={folder.id}
                clientId={clientId}
                folderId={folder.id}
                folderName={childFolderDisplayName}
                folderType={folder.folderTypeName || folder.folderTypeDescription || 'Folder'}
                depth={0}
                folderTypes={folderTypes}
                documentTypes={documentTypes}
                documentSearch={documentSearch}
                selectedDocumentId={selectedDocumentId}
                onDocumentSelect={onDocumentSelect}
                onPageClick={onPageClick}
                activePage={activePage}
                importedDocumentIds={importedDocumentIds}
                allowedExtensions={allowedExtensions}
              />
            );
          })}

          {documents.map((doc: any) => (
            <DocumentNode
              key={doc.id}
              doc={doc}
              clientId={clientId}
              folderId={folderId}
              selectedDocumentId={selectedDocumentId}
              visibleDocumentIds={visibleDocumentIds}
              onDocumentSelect={onDocumentSelect}
              onPageClick={onPageClick}
              activePage={activePage}
              importedDocumentIds={importedDocumentIds}
              allowedExtensions={allowedExtensions}
            />
          ))}

          {childFolders.length === 0 && documents.length === 0 && (
            <Text size="sm" c="dimmed" py={4} px={6}>
              No items
            </Text>
          )}
        </>
      )}
    </div>
  );
}

export default RootFolderChildren;

function ExpandableFolderNode({
  clientId,
  folderId,
  folderName,
  folderType,
  depth,
  folderTypes,
  documentTypes,
  documentSearch,
  selectedDocumentId,
  onDocumentSelect,
  onPageClick,
  activePage,
  importedDocumentIds,
  allowedExtensions,
}: {
  clientId: number;
  folderId: number;
  folderName: string;
  folderType: string;
  depth: number;
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  documentSearch?: string;
  selectedDocumentId: number | null;
  onDocumentSelect: (documentId: number, folderId: number) => void;
  onPageClick: (page: ActivePage | null) => void;
  activePage: ActivePage | null;
  importedDocumentIds?: string[];
  allowedExtensions?: string[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <FolderTreeNode
      clientId={clientId}
      folderId={folderId}
      folderName={folderName}
      folderType={folderType}
      depth={depth}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded((p) => !p)}
      folderTypes={folderTypes}
      documentTypes={documentTypes}
      documentSearch={documentSearch}
      selectedDocumentId={selectedDocumentId}
      onDocumentSelect={onDocumentSelect}
      onPageClick={onPageClick}
      activePage={activePage}
      importedDocumentIds={importedDocumentIds}
      allowedExtensions={allowedExtensions}
    />
  );
}


