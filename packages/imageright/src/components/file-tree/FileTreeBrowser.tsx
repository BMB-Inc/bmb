import { useMemo, useState, useCallback, useEffect } from 'react';
import { Card, Stack, Center, Text, Group, Loader, ScrollArea, Checkbox } from '@mantine/core';
import { IconSearch, IconFolder, IconFolderOpen, IconChevronRight, IconChevronDown, IconFileText } from '@tabler/icons-react';
import { ClientSearch } from '../client-search/ClientSearch';
import { DocumentSearch } from '../document-search/DocumentSearch';
import BreadcrumbNav from '../file-browser/BreadcrumbNav';
import PreviewPane from '../file-browser/PreviewPane';
import { TreeLoadingSkeleton } from './TreeLoadingSkeleton';
import { FolderTreeNode } from './FolderTreeNode';
import { FolderItemCount } from './FolderItemCount';
import { useClients, useSelectedPages, useFilteredDocumentsByExtension } from '@hooks/index';
import { useFolders, usePolicyFolders } from '@hooks/useFolders';
import { useDocuments } from '@hooks/useDocuments';
import { useSelectedDocuments } from '@hooks/useSelectedDocuments';
import { useSelectAllPagesForDocument } from '@hooks/useSelectAllPagesForDocument';
import { useTreeNavigation } from '@hooks/useTreeNavigation';
import { FolderTypes, DocumentTypes, type ImagerightClient } from '@bmb-inc/types';
import { treeStyles } from './styles';
import classes from '../../modules/file-tree.module.css';
import { sortFolders } from '../file-browser/utils/folderSorting';

type FileTreeBrowserProps = {
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  /** File extensions to filter pages by (e.g., ['pdf', 'jpg']) */
  allowedExtensions?: string[];
  /** Document IDs that have already been imported (will be displayed greyed out) */
  importedDocumentIds?: string[];
};

export function FileTreeBrowser({ folderTypes, documentTypes, allowedExtensions, importedDocumentIds }: FileTreeBrowserProps) {
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const [documentSearch, setDocumentSearch] = useState('');
  
  // URL-persisted navigation state
  const {
    clientId: selectedClientId,
    documentId: selectedDocumentId,
    folderId: selectedFolderId,
    expandedFolders: expandedRootFolders,
    navigateToClients,
    navigateToClient,
    selectDocument,
    toggleFolder: toggleRootFolder,
    collapseAll,
  } = useTreeNavigation();

  // Memoize the search change handler
  const handleDocumentSearchChange = useCallback((value: string) => {
    setDocumentSearch(value);
  }, []);

  // Clear document selection on initial mount (page reload)
  // The document won't be visible since sub-folder expansions aren't persisted
  useEffect(() => {
    if (selectedDocumentId) {
      selectDocument(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const hasClients = Array.isArray(clients) && clients.length > 0;

  // Get the selected client info
  const selectedClient = clients.find((c: ImagerightClient) => c.id === selectedClientId);

  // Determine if we should use policy folders endpoint
  const normalizedFolderTypes = Array.isArray(folderTypes) && folderTypes.length > 0 ? folderTypes : undefined;
  const normalizedDocumentTypes = Array.isArray(documentTypes) && documentTypes.length > 0 ? documentTypes : undefined;
  
  const wantsOnlyPoliciesAtRoot =
    selectedClientId &&
    Array.isArray(normalizedFolderTypes) &&
    normalizedFolderTypes.length === 1 &&
    normalizedFolderTypes[0] === FolderTypes.policies;

  // Fetch root folders when client is selected
  const { data: policyFolders = [], isLoading: policyFoldersLoading } = usePolicyFolders(
    wantsOnlyPoliciesAtRoot && selectedClientId ? { clientId: selectedClientId } : undefined
  );

  const { data: genericFolders = [], isLoading: genericFoldersLoading } = useFolders(
    wantsOnlyPoliciesAtRoot
      ? undefined
      : selectedClientId
        ? { clientId: selectedClientId, folderId: null, folderTypes: normalizedFolderTypes }
        : undefined
  );

  const rootFoldersLoading = wantsOnlyPoliciesAtRoot ? policyFoldersLoading : genericFoldersLoading;

  // Sort root folders: New Mail first, then policy terms by year, then others by date
  const rootFolders = useMemo(() => {
    const folders = wantsOnlyPoliciesAtRoot ? policyFolders : genericFolders;
    if (!folders || folders.length === 0) return [];
    
    return sortFolders(folders);
  }, [wantsOnlyPoliciesAtRoot, policyFolders, genericFolders]);

  // Handlers
  const handleClientSelect = (clientId: number) => {
    navigateToClient(clientId);
  };

  const handleBackToClients = () => {
    navigateToClients();
  };

  const handleDocumentSelect = (docId: number, parentFolderId: number) => {
    selectDocument(selectedDocumentId === docId ? null : docId, parentFolderId);
  };

  // Client label for breadcrumb
  const clientLabel = selectedClient
    ? `${selectedClient.description} - ${selectedClient.fileNumberPart1} ${selectedClient.drawerName ? `(${selectedClient.drawerName})` : ''}`
    : undefined;

  return (
    <Card withBorder>
      <Stack>
        <ClientSearch isLoading={clientsLoading} error={undefined} />

        {/* Breadcrumb navigation */}
        {selectedClientId && (
          <BreadcrumbNav
            expandedClientId={selectedClientId.toString()}
            clientLabel={clientLabel}
            folderId={undefined}
            folderLabel={undefined}
            onClientsClick={handleBackToClients}
            onClientRootClick={() => {
              collapseAll();
              selectDocument(null);
            }}
          />
        )}

        {/* Document search - below breadcrumb, above folders */}
        {selectedClientId && (
          <DocumentSearch 
            value={documentSearch} 
            onChange={handleDocumentSearchChange}
            placeholder="Search documents..."
          />
        )}

        {/* Client list (when no client selected) */}
        {!selectedClientId && (
          hasClients ? (
            <ScrollArea h={400}>
              <Stack gap="xs">
                {clients.map((client: ImagerightClient) => (
                  <Group
                    key={client.id}
                    gap="xs"
                    py={6}
                    px={8}
                    style={{
                      ...treeStyles.root,
                      borderRadius: 'var(--mantine-radius-sm)',
                      border: '1px solid var(--mantine-color-gray-3)',
                    }}
                    onClick={() => handleClientSelect(client.id)}
                  >
                    <IconFolder size={16} color="var(--mantine-color-blue-5)" />
                    <Text truncate style={{ flex: 1 }}>
                      {client.description} - {client.fileNumberPart1}
                      {client.drawerName ? ` (${client.drawerName})` : ''}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </ScrollArea>
          ) : (
            <Center mih={160} style={{ border: '1px dashed var(--mantine-color-gray-4)', borderRadius: 6 }}>
              <Stack gap={6} align="center">
                <IconSearch size={20} color="var(--mantine-color-gray-6)" />
                <Text c="dimmed" size="sm">
                  Search for a client by code or name to get started
                </Text>
              </Stack>
            </Center>
          )
        )}

        {/* Tree view + Preview (when client is selected) */}
        {selectedClientId && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(360px, 1fr) minmax(280px, 0.6fr)',
              gap: 'var(--mantine-spacing-md)',
              alignItems: 'start',
              height: '63vh',
              minHeight: 0,
            }}
          >
            {/* Tree pane */}
            <ScrollArea style={{ height: '100%' }}>
              {rootFoldersLoading && <TreeLoadingSkeleton />}

              {!rootFoldersLoading && (
                <Stack gap={2}>
                  {rootFolders.map((folder: any) => {
                    const isExpanded = expandedRootFolders.has(folder.id);
                    const folderName = folder.description ?? folder.folderTypeName ?? 'Folder';
                    const folderDisplayName = folder.folderTypeDescription && folder.folderTypeDescription !== folderName
                      ? `${folderName} (${folder.folderTypeDescription})`
                      : folderName;

                    return (
                      <div key={folder.id}>
                        {/* Root folder row */}
                        <Group
                          gap="xs"
                          py={6}
                          px={8}
                          className={classes.folderRow}
                          onClick={() => {
                            const isCurrentlyExpanded = expandedRootFolders.has(folder.id);
                            if (!isCurrentlyExpanded) {
                              console.log('Opening folder:', folder);
                            }
                            toggleRootFolder(folder.id);
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
                            {folderDisplayName}
                          </Text>
                          <FolderItemCount
                            clientId={selectedClientId}
                            folderId={folder.id}
                            folderTypes={normalizedFolderTypes}
                            documentTypes={normalizedDocumentTypes}
                            allowedExtensions={allowedExtensions}
                          />
                        </Group>

                        {/* Expanded children */}
                        {isExpanded && (
                          <RootFolderChildren
                            clientId={selectedClientId}
                            folderId={folder.id}
                            folderTypes={normalizedFolderTypes}
                            documentTypes={normalizedDocumentTypes}
                            documentSearch={documentSearch}
                            selectedDocumentId={selectedDocumentId}
                            onDocumentSelect={handleDocumentSelect}
                            importedDocumentIds={importedDocumentIds}
                            allowedExtensions={allowedExtensions}
                          />
                        )}
                      </div>
                    );
                  })}

                  {rootFolders.length === 0 && (
                    <Center mih={100}>
                      <Text c="dimmed" size="sm">
                        No folders found
                      </Text>
                    </Center>
                  )}
                </Stack>
              )}
            </ScrollArea>

            {/* Preview pane */}
            <PreviewPane expandedDocumentId={selectedDocumentId?.toString() ?? null} folderId={selectedFolderId} allowedExtensions={allowedExtensions} />
          </div>
        )}
      </Stack>
    </Card>
  );
}

// Component to load and display children of a root folder
function RootFolderChildren({
  clientId,
  folderId,
  folderTypes,
  documentTypes,
  documentSearch,
  selectedDocumentId,
  onDocumentSelect,
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
  const { filteredDocuments: documents, isFiltering } = useFilteredDocumentsByExtension(
    sortedDocuments,
    allowedExtensions
  );

  const { 
    isSelected: isDocumentSelected, 
    toggleSelected: toggleDocumentSelected,
    handleSelectWithModifiers,
    setLastSelectedId,
  } = useSelectedDocuments();
  const { selectAllPagesForDocument } = useSelectAllPagesForDocument(allowedExtensions);
  const { deselectPagesForDocument } = useSelectedPages();
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  const isLoading = foldersLoading || documentsLoading || isFiltering;

  // Get list of visible document IDs for shift-select range
  const visibleDocumentIds = useMemo(() => documents.map((d: any) => d.id), [documents]);

  const toggleFolder = (id: number) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      const isCurrentlyExpanded = next.has(id);
      if (!isCurrentlyExpanded) {
        const folder = childFolders.find((f: any) => f.id === id);
        if (folder) {
          console.log('Opening folder:', folder);
        }
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  return (
    <div style={treeStyles.children}>
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
          {/* Child folders */}
          {childFolders.map((folder: any) => {
            const childFolderName = folder.description ?? folder.folderTypeName ?? 'Folder';
            const childFolderDisplayName = folder.folderTypeDescription && folder.folderTypeDescription !== childFolderName
              ? `${childFolderName} (${folder.folderTypeDescription})`
              : childFolderName;
            return (
            <FolderTreeNode
              key={folder.id}
              clientId={clientId}
              folderId={folder.id}
              folderName={childFolderDisplayName}
              folderType={folder.folderTypeName || folder.folderTypeDescription || 'Folder'}
              depth={0}
              isExpanded={expandedFolders.has(folder.id)}
              onToggle={() => toggleFolder(folder.id)}
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
            // Use CSS class for base styling (includes hover) and inline styles for selected/imported states
            const getDocumentStyle = () => {
              const style: React.CSSProperties = { userSelect: 'none' };
              if (isImported) {
                style.opacity = 0.5;
                if (isSelected) {
                  style.backgroundColor = 'var(--mantine-color-blue-light)';
                } else {
                  style.backgroundColor = 'var(--mantine-color-gray-1)';
                }
              } else if (isSelected) {
                style.backgroundColor = 'var(--mantine-color-blue-light)';
              }
              return style;
            };
            
            return (
            <Group
              key={doc.id}
              gap="xs"
              py={3}
              px={6}
              className={classes.documentItem}
              style={getDocumentStyle()}
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
                  onDocumentSelect(doc.id, folderId);
                  setLastSelectedId(doc.id);
                }
              }}
                  onDoubleClick={() => {
                    // Double-click - toggle document selection and select/deselect all pages
                    const willBeSelected = !isDocumentSelected(doc.id);
                    toggleDocumentSelected(doc.id, willBeSelected);
                    if (willBeSelected) {
                      selectAllPagesForDocument(doc.id, folderId);
                    } else {
                      deselectPagesForDocument(doc.id);
                    }
                    // Also show the document's pages in preview
                    onDocumentSelect(doc.id, folderId);
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
                            selectAllPagesForDocument(doc.id, folderId);
                            // Also open the document to view its pages
                            onDocumentSelect(doc.id, folderId);
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

export default FileTreeBrowser;

