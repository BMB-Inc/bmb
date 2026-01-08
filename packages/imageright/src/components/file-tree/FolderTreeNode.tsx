import { useState, useMemo } from 'react';
import { Group, Text, Loader } from '@mantine/core';
import { IconFolder, IconFolderOpen, IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { useFolders } from '@hooks/useFolders';
import { useDocuments } from '@hooks/useDocuments';
import { useFilteredDocumentsByExtension } from '@hooks/useFilteredDocumentsByExtension';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';
import { DocumentNode } from './DocumentNode';
import { FolderItemCount } from './FolderItemCount';
import { treeStyles } from './styles';
import classes from '../../modules/file-tree.module.css';
import { sortFolders } from '../file-browser/utils/folderSorting';

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
  documentSearch?: string;
  selectedDocumentId?: number | null;
  onDocumentSelect?: (documentId: number, folderId: number) => void;
  onPageClick?: (pageId: number) => void;
  activePageId?: number | null;
  /** Document IDs that have already been imported (will be displayed greyed out) */
  importedDocumentIds?: string[];
  /** File extensions to filter pages by (e.g., ['pdf', 'jpg']) */
  allowedExtensions?: string[];
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
  documentSearch,
  selectedDocumentId,
  onDocumentSelect,
  onPageClick,
  activePageId,
  importedDocumentIds,
  allowedExtensions,
}: FolderTreeNodeProps) {
  // Only fetch children when expanded
  const { data: rawChildFolders = [], isLoading: foldersLoading } = useFolders(
    isExpanded
      ? { clientId, folderId, folderTypes: folderTypes ?? null }
      : undefined
  );

  const { data: rawDocuments = [], isLoading: documentsLoading } = useDocuments(
    isExpanded ? { clientId, folderId, description: documentSearch || undefined } : undefined,
    documentTypes
  );

  // Sort child folders: New Mail first, then policy terms by year, then others by date
  const childFolders = useMemo(() => {
    if (!rawChildFolders || rawChildFolders.length === 0) return [];
    return sortFolders(rawChildFolders);
  }, [rawChildFolders]);

  // Sort documents by date modified (newest first)
  const sortedDocuments = useMemo(() => {
    if (!rawDocuments || rawDocuments.length === 0) return [];
    return [...rawDocuments].sort((a: any, b: any) => {
      const aDate = a.dateLastModified || a.dateCreated ? new Date(a.dateLastModified || a.dateCreated).getTime() : 0;
      const bDate = b.dateLastModified || b.dateCreated ? new Date(b.dateLastModified || b.dateCreated).getTime() : 0;
      return bDate - aDate;
    });
  }, [rawDocuments]);

  // Filter documents by allowed extensions (only show docs with pages matching extensions)
  const { filteredDocuments: documents, isFiltering, filteredCount } = useFilteredDocumentsByExtension(
    sortedDocuments,
    allowedExtensions
  );

  // Get list of visible document IDs for shift-select range
  const visibleDocumentIds = useMemo(() => documents.map((d: any) => d.id), [documents]);

  const isLoading = foldersLoading || documentsLoading || isFiltering;

  return (
    <div>
      {/* Folder row */}
      <Group
        gap="xs"
        py={4}
        px={6}
        className={classes.folderRow}
        style={{ paddingLeft: depth * 20 + 6 }}
        onClick={() => {
          if (!isExpanded) {
            // Log folder data when opening
            console.log('Opening folder:', { folderId, folderName, folderType, clientId });
          }
          onToggle();
        }}
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
        <FolderItemCount
          clientId={clientId}
          folderId={folderId}
          folderTypes={folderTypes}
          documentTypes={documentTypes}
          allowedExtensions={allowedExtensions}
          folders={isExpanded ? rawChildFolders : undefined}
          documents={isExpanded ? sortedDocuments : undefined}
          filteredDocumentCount={isExpanded && allowedExtensions ? filteredCount : undefined}
        />
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
                  documentSearch={documentSearch}
                  selectedDocumentId={selectedDocumentId}
                  onDocumentSelect={onDocumentSelect}
                  onPageClick={onPageClick}
                  activePageId={activePageId}
                  importedDocumentIds={importedDocumentIds}
                  allowedExtensions={allowedExtensions}
                />
              )})}

              {/* Documents */}
              {documents.map((doc: any) => (
                <DocumentNode
                  key={doc.id}
                  doc={doc}
                  clientId={clientId}
                  folderId={folderId}
                  selectedDocumentId={selectedDocumentId ?? null}
                  visibleDocumentIds={visibleDocumentIds}
                  onDocumentSelect={onDocumentSelect}
                  onPageClick={onPageClick}
                  activePageId={activePageId}
                  importedDocumentIds={importedDocumentIds}
                  allowedExtensions={allowedExtensions}
                />
              ))}

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
  documentSearch,
  selectedDocumentId,
  onDocumentSelect,
  importedDocumentIds,
  allowedExtensions,
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
      onToggle={() => {
        if (!isExpanded) {
          // Log folder data when opening
          console.log('Opening folder:', { folderId, folderName, folderType, clientId });
        }
        setIsExpanded((prev) => !prev);
      }}
      folderTypes={folderTypes}
      documentTypes={documentTypes}
      documentSearch={documentSearch}
      selectedDocumentId={selectedDocumentId}
      onDocumentSelect={onDocumentSelect}
      importedDocumentIds={importedDocumentIds}
      allowedExtensions={allowedExtensions}
    />
  );
}

export default FolderTreeNode;

