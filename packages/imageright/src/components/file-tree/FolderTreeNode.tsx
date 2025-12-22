import { useState, useMemo } from 'react';
import { Group, Text, Loader, Checkbox } from '@mantine/core';
import { IconFolder, IconFolderOpen, IconChevronRight, IconChevronDown, IconFileText } from '@tabler/icons-react';
import { useFolders } from '@hooks/useFolders';
import { useDocuments } from '@hooks/useDocuments';
import { useFilteredDocumentsByExtension } from '@hooks/useFilteredDocumentsByExtension';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';
import { useSelectedDocuments } from '@hooks/useSelectedDocuments';
import { useSelectAllPagesForDocument } from '@hooks/useSelectAllPagesForDocument';
import { useSelectedPages } from '@hooks/useSelectedPages';
import { FolderItemCount } from './FolderItemCount';
import { treeStyles } from './styles';
import classes from '../../modules/file-tree.module.css';

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
  onDocumentSelect?: (documentId: number) => void;
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
  const sortedDocuments = useMemo(() => {
    if (!rawDocuments || rawDocuments.length === 0) return [];
    return [...rawDocuments].sort((a: any, b: any) => {
      const aDate = a.dateLastModified || a.dateCreated ? new Date(a.dateLastModified || a.dateCreated).getTime() : 0;
      const bDate = b.dateLastModified || b.dateCreated ? new Date(b.dateLastModified || b.dateCreated).getTime() : 0;
      return bDate - aDate;
    });
  }, [rawDocuments]);

  // Filter documents by allowed extensions (only show docs with pages matching extensions)
  const { filteredDocuments: documents, isFiltering } = useFilteredDocumentsByExtension(
    sortedDocuments,
    allowedExtensions
  );

  // Get list of visible document IDs for shift-select range
  const visibleDocumentIds = useMemo(() => documents.map((d: any) => d.id), [documents]);

  const { 
    isSelected: isDocumentSelected, 
    toggleSelected: toggleDocumentSelected,
    handleSelectWithModifiers,
    setLastSelectedId,
  } = useSelectedDocuments();
  const { selectAllPagesForDocument } = useSelectAllPagesForDocument(allowedExtensions);
  const { deselectPagesForDocument } = useSelectedPages();

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
        <FolderItemCount
          clientId={clientId}
          folderId={folderId}
          folderTypes={folderTypes}
          documentTypes={documentTypes}
          allowedExtensions={allowedExtensions}
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
                  importedDocumentIds={importedDocumentIds}
                  allowedExtensions={allowedExtensions}
                />
              )})}

              {/* Documents */}
              {documents.map((doc: any) => {
                const docName = doc.description || doc.documentTypeDescription || 'Document';
                const docDisplayName = doc.documentTypeDescription && doc.documentTypeDescription !== docName
                  ? `${docName} (${doc.documentTypeDescription})`
                  : docName;
                const isImported = importedDocumentIds?.includes(String(doc.id)) ?? false;
                const isSelected = selectedDocumentId === doc.id;
                
                // Determine the appropriate style based on imported and selected state
                const getDocumentStyle = () => {
                  if (isImported) {
                    return isSelected ? treeStyles.documentItemImportedSelected : treeStyles.documentItemImported;
                  }
                  return isSelected ? treeStyles.documentItemSelected : treeStyles.documentItem;
                };
                
                return (
                <Group
                  key={doc.id}
                  gap="xs"
                  py={3}
                  px={6}
                  style={{
                    ...getDocumentStyle(),
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
                    // Double-click - toggle document selection and select/deselect all pages
                    const willBeSelected = !isDocumentSelected(doc.id);
                    toggleDocumentSelected(doc.id, willBeSelected);
                    if (willBeSelected) {
                      selectAllPagesForDocument(doc.id);
                    } else {
                      deselectPagesForDocument(doc.id);
                    }
                  }}
                >
                  <Checkbox
                    size="xs"
                    checked={isDocumentSelected(doc.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      const isChecked = e.currentTarget.checked;
                      toggleDocumentSelected(doc.id, isChecked);
                      setLastSelectedId(doc.id);
                      if (isChecked) {
                        selectAllPagesForDocument(doc.id);
                        // Also open the document to view its pages
                        onDocumentSelect?.(doc.id);
                      } else {
                        deselectPagesForDocument(doc.id);
                      }
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
                  {isImported && (
                    <Text c="dimmed" size="xs" fs="italic" style={{ flexShrink: 0 }}>
                      Imported Already
                    </Text>
                  )}
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
      onToggle={() => setIsExpanded((prev) => !prev)}
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

