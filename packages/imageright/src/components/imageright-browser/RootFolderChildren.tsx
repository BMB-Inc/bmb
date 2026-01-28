import { Group, Text } from '@mantine/core';
import { useState } from 'react';
import { useFolderChildren } from '@hooks/useFolderChildren';
import { FolderTreeNode } from '../file-tree/FolderTreeNode';
import { DocumentNode } from '../file-tree/DocumentNode';
import type { DocumentTypes, FolderTypes } from '@bmb-inc/types';
import { useTreeContext } from './TreeContext';

export function RootFolderChildren({
  clientId,
  folderId,
  folderTypes,
  documentTypes,
}: {
  clientId: number;
  folderId: number;
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
}) {
  const {
    selectedDocumentId,
    onDocumentSelect,
    activePage,
    setActivePage,
    importedDocumentIds,
    allowedExtensions,
  } = useTreeContext();
  const { childFolders, documents: filteredDocuments, visibleDocumentIds, isLoading } = useFolderChildren({
    clientId,
    folderId,
    folderTypes,
    documentTypes,
    allowedExtensions,
  });

  return (
    <div
      style={{
        marginLeft: 22,
        paddingLeft: 16,
        borderLeft: '2px solid var(--mantine-color-gray-3)',
      }}
    >
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
              />
            );
          })}

          {filteredDocuments.map((doc: any) => (
            <DocumentNode
              key={doc.id}
              doc={doc}
              clientId={clientId}
              folderId={folderId}
              selectedDocumentId={selectedDocumentId}
              visibleDocumentIds={visibleDocumentIds}
              onDocumentSelect={onDocumentSelect}
              onPageClick={setActivePage}
              activePage={activePage}
              importedDocumentIds={importedDocumentIds}
              allowedExtensions={allowedExtensions}
            />
          ))}

          {childFolders.length === 0 && filteredDocuments.length === 0 && (
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
}: {
  clientId: number;
  folderId: number;
  folderName: string;
  folderType: string;
  depth: number;
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
}) {
  const {
    selectedDocumentId,
    onDocumentSelect,
    activePage,
    setActivePage,
    importedDocumentIds,
    allowedExtensions,
  } = useTreeContext();
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
      selectedDocumentId={selectedDocumentId}
      onDocumentSelect={onDocumentSelect}
      onPageClick={setActivePage}
      activePage={activePage}
      importedDocumentIds={importedDocumentIds}
      allowedExtensions={allowedExtensions}
    />
  );
}



