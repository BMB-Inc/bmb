import { useState, useMemo } from 'react';
import { Group, Text, Loader, Checkbox } from '@mantine/core';
import { IconFolder, IconFolderOpen, IconChevronRight, IconChevronDown, IconFileText } from '@tabler/icons-react';
import { useFolders } from '@hooks/useFolders';
import { useDocuments } from '@hooks/useDocuments';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';
import { useSelectedDocuments } from '@hooks/useSelectedDocuments';
import { treeStyles } from './styles';

type FolderTreeNodeProps = {
  clientId: number;
  folderId: number;
  folderName: string;
  folderType: string;
  depth: number;
  isExpanded: boolean;
  onToggle: () => void;
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  selectedDocumentId?: number | null;
  onDocumentSelect?: (documentId: number) => void;
};

export function FolderTreeNode({
  clientId,
  folderId,
  folderName,
  folderType,
  depth,
  isExpanded,
  onToggle,
  folderTypes,
  documentTypes,
  selectedDocumentId,
  onDocumentSelect,
}: FolderTreeNodeProps) {
  // Only fetch children when expanded
  const { data: rawChildFolders = [], isLoading: foldersLoading } = useFolders(
    isExpanded
      ? { clientId, folderId, folderTypes: folderTypes ?? null }
      : undefined
  );

  const { data: rawDocuments = [], isLoading: documentsLoading } = useDocuments(
    isExpanded ? { clientId, folderId } : undefined,
    documentTypes
  );

  // Sort folders by date modified (newest first)
  const childFolders = useMemo(() => {
    if (!rawChildFolders || rawChildFolders.length === 0) return [];
    return [...rawChildFolders].sort((a: any, b: any) => {
      const aDate = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const bDate = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      return bDate - aDate;
    });
  }, [rawChildFolders]);

  // Sort documents by date modified (newest first)
  const documents = useMemo(() => {
    if (!rawDocuments || rawDocuments.length === 0) return [];
    return [...rawDocuments].sort((a: any, b: any) => {
      const aDate = a.dateLastModified || a.dateCreated ? new Date(a.dateLastModified || a.dateCreated).getTime() : 0;
      const bDate = b.dateLastModified || b.dateCreated ? new Date(b.dateLastModified || b.dateCreated).getTime() : 0;
      return bDate - aDate;
    });
  }, [rawDocuments]);

  // Get list of visible document IDs for shift-select range
  const visibleDocumentIds = useMemo(() => documents.map((d: any) => d.id), [documents]);

  const { 
    isSelected: isDocumentSelected, 
    toggleSelected: toggleDocumentSelected,
    handleSelectWithModifiers,
    setLastSelectedId,
  } = useSelectedDocuments();

  const isLoading = foldersLoading || documentsLoading;

  return (
    <div>
      {/* Folder row */}
      <Group
        gap="xs"
        py={4}
        px={6}
        style={{
          ...(isExpanded ? treeStyles.childItemExpanded : treeStyles.childItem),
          paddingLeft: depth * 20 + 6,
        }}
        onClick={onToggle}
      >
        {isExpanded ? (
          <IconChevronDown size={16} style={{ flexShrink: 0 }} />
        ) : (
          <IconChevronRight size={16} style={{ flexShrink: 0 }} />
        )}
        {isExpanded ? (
          <IconFolderOpen size={16} color="var(--mantine-color-yellow-6)" style={{ flexShrink: 0 }} />
        ) : (
          <IconFolder size={16} color="var(--mantine-color-yellow-7)" style={{ flexShrink: 0 }} />
        )}
        <Text truncate style={{ minWidth: 0, flex: 1 }}>
          {folderName}
        </Text>
      </Group>

      {/* Children (folders + documents) */}
      {isExpanded && (
        <div style={{ ...treeStyles.children, marginLeft: depth * 20 + 6 }}>
          {isLoading && (
            <Group gap="xs" py={4} px={6}>
              <Loader size="xs" />
              <Text size="sm" c="dimmed">
                Loading...
              </Text>
            </Group>
          )}

          {!isLoading && (
            <>
              {/* Child folders - render recursively */}
              {childFolders.map((folder: any) => {
                const childFolderName = folder.description ?? folder.folderTypeName ?? 'Folder';
                const childFolderDisplayName = folder.folderTypeDescription && folder.folderTypeDescription !== childFolderName
                  ? `${childFolderName} (${folder.folderTypeDescription})`
                  : childFolderName;
                return (
                <RecursiveFolderNode
                  key={folder.id}
                  clientId={clientId}
                  folderId={folder.id}
                  folderName={childFolderDisplayName}
                  folderType={folder.folderTypeName || folder.folderTypeDescription || 'Folder'}
                  depth={0}
                  folderTypes={folderTypes}
                  documentTypes={documentTypes}
                  selectedDocumentId={selectedDocumentId}
                  onDocumentSelect={onDocumentSelect}
                />
              )})}

              {/* Documents */}
              {documents.map((doc: any) => {
                const docName = doc.description || doc.documentTypeDescription || 'Document';
                const docDisplayName = doc.documentTypeDescription && doc.documentTypeDescription !== docName
                  ? `${docName} (${doc.documentTypeDescription})`
                  : docName;
                return (
                <Group
                  key={doc.id}
                  gap="xs"
                  py={3}
                  px={6}
                  style={{
                    ...(selectedDocumentId === doc.id
                      ? treeStyles.documentItemSelected
                      : treeStyles.documentItem),
                    userSelect: 'none',
                  }}
                  onClick={(e) => {
                    // Handle shift/ctrl+click for multi-select checkboxes
                    if (e.shiftKey || e.ctrlKey || e.metaKey) {
                      handleSelectWithModifiers(doc.id, visibleDocumentIds, {
                        shiftKey: e.shiftKey,
                        ctrlKey: e.ctrlKey,
                        metaKey: e.metaKey,
                      });
                      setLastSelectedId(doc.id);
                    } else {
                      // Single click - open preview and highlight
                      onDocumentSelect?.(doc.id);
                      setLastSelectedId(doc.id);
                    }
                  }}
                  onDoubleClick={() => {
                    // Double-click - toggle checkbox for multi-select
                    toggleDocumentSelected(doc.id, !isDocumentSelected(doc.id));
                  }}
                >
                  <Checkbox
                    size="xs"
                    checked={isDocumentSelected(doc.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleDocumentSelected(doc.id, e.currentTarget.checked);
                      setLastSelectedId(doc.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <IconFileText
                    size={16}
                    color={
                      selectedDocumentId === doc.id
                        ? 'var(--mantine-color-blue-9)'
                        : 'var(--mantine-color-blue-7)'
                    }
                    style={{ flexShrink: 0 }}
                  />
                  <Text truncate style={{ minWidth: 0, flex: 1 }}>
                    {docDisplayName}
                  </Text>
                </Group>
              )})}

              {/* Empty state */}
              {childFolders.length === 0 && documents.length === 0 && (
                <Text size="sm" c="dimmed" py={4} px={6}>
                  No items
                </Text>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Recursive wrapper that manages its own expanded state
function RecursiveFolderNode({
  clientId,
  folderId,
  folderName,
  folderType,
  depth,
  folderTypes,
  documentTypes,
  selectedDocumentId,
  onDocumentSelect,
}: Omit<FolderTreeNodeProps, 'isExpanded' | 'onToggle'>) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <FolderTreeNode
      clientId={clientId}
      folderId={folderId}
      folderName={folderName}
      folderType={folderType}
      depth={depth}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded((prev) => !prev)}
      folderTypes={folderTypes}
      documentTypes={documentTypes}
      selectedDocumentId={selectedDocumentId}
      onDocumentSelect={onDocumentSelect}
    />
  );
}

export default FolderTreeNode;

