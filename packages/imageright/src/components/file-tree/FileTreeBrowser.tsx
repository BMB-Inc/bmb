import { useMemo, useState, useEffect } from 'react';
import { Card, Stack, Center, Text, Group, Loader, ScrollArea, useComputedColorScheme } from '@mantine/core';
import { IconSearch, IconFolder, IconFolderOpen, IconChevronRight, IconChevronDown, IconFileText } from '@tabler/icons-react';
import { ClientSearch } from '../client-search/ClientSearch';
import BreadcrumbNav from '../file-browser/BreadcrumbNav';
import PreviewPane from '../file-browser/PreviewPane';
import { NameFilter } from '../file-browser/NameFilter';
import { TreeLoadingSkeleton } from './TreeLoadingSkeleton';
import { FolderTreeNode } from './FolderTreeNode';
import { DocumentNode } from './DocumentNode';
import { FolderItemCount } from './FolderItemCount';
import { useClients, useFilteredDocumentsByExtension, useDocumentsByName, useDocumentSearchParam } from '@hooks/index';
import { useFolders, usePolicyFolders } from '@hooks/useFolders';
import { useDocuments } from '@hooks/useDocuments';
import { useTreeNavigation } from '@hooks/useTreeNavigation';
import { FolderTypes, DocumentTypes, type ImagerightClient } from '@bmb-inc/types';
import { treeStyles } from './styles';
import classes from '../../modules/file-tree.module.css';
import { sortFolders } from '../file-browser/utils/folderSorting';
import { useAutoSelectSingleClient } from '../file-browser/hooks/useAutoSelectSingleClient';

type FileTreeBrowserProps = {
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  /** File extensions to filter pages by (e.g., ['pdf', 'jpg']) */
  allowedExtensions?: string[];
  /** Default zoom level for PDF previews (clamped inside PdfPreview) */
  pdfDefaultZoom?: number;
  /** Document IDs that have already been imported (will be displayed greyed out) */
  importedDocumentIds?: string[];
};

export function FileTreeBrowser({ folderTypes, documentTypes, allowedExtensions, pdfDefaultZoom, importedDocumentIds }: FileTreeBrowserProps) {
  const { data: clients = [], isLoading: clientsLoading, error: clientsError } = useClients();
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-gray-0)';
  const panelBg = 'transparent';
  const panelBorder = isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-2)';
  type ActivePage = {
    documentId: number;
    pageId: number;
    imageId: number | null;
    extension: string | null;
  };

  const [activePage, setActivePage] = useState<ActivePage | null>(null);
  
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
    expandFolder,
  } = useTreeNavigation();

  const { value: documentSearchInput, onChange: setDocumentSearchInput, searchParam: documentSearchParam } =
    useDocumentSearchParam(500);

  // Clear document selection on initial mount (page reload)
  // The document won't be visible since sub-folder expansions aren't persisted
  useEffect(() => {
    if (selectedDocumentId) {
      selectDocument(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const hasClients = Array.isArray(clients) && clients.length > 0;

  // Auto-select the client when exactly one search result is found
  useAutoSelectSingleClient({
    clients,
    clientsLoading,
    expandedClientId: selectedClientId,
    navigateToClient: (id) => navigateToClient(Number(id)),
  });

  // Get the selected client info
  const selectedClient = clients.find((c: ImagerightClient) => c.id === selectedClientId);
  const selectedDrawerId = selectedClient?.drawerId ?? null;

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

  const searchActive = !!selectedClientId && (documentSearchParam ?? '').trim().length > 0;
  const { data: searchedDocFolders = [], isLoading: searchLoading } = useDocumentsByName(
    searchActive
      ? {
          description: documentSearchParam ?? '',
          limit: 200,
          drawerId: selectedDrawerId ?? undefined,
          fileId: selectedClientId ?? undefined,
          parentId: selectedFolderId ?? undefined,
        }
      : undefined
  );
  const searchResults = useMemo(() => {
    if (!searchActive || !selectedClientId) return [];
    const toDateStr = (iso?: string | null) => {
      if (!iso) return '';
      const dt = new Date(iso);
      return isNaN(dt.getTime()) ? '' : dt.toLocaleDateString();
    };
    return (searchedDocFolders || [])
      .filter((doc: any) => {
        const fileId = doc?.file?.id ?? doc?.fileId ?? doc?.fileid;
        return typeof fileId === 'number' ? fileId === selectedClientId : true;
      })
      .map((doc: any) => {
        const folder = Array.isArray(doc?.folder) ? doc.folder[0] : undefined;
        const folderId = folder?.id ?? folder?.folderId ?? doc?.parentid ?? doc?.parentId ?? null;
        return {
          id: doc?.docfolderid ?? doc?.id,
          name: doc?.description ?? doc?.documentName ?? 'Document',
          modified: toDateStr(doc?.lastmodified || doc?.dateLastModified || doc?.created || doc?.dateCreated),
          folderId: folderId != null ? Number(folderId) : null,
          folderName: folder?.description ?? folder?.folderTypeDescription ?? folder?.folderTypeName ?? null,
        };
      })
      .filter((item: any) => typeof item.id === 'number');
  }, [searchActive, searchedDocFolders, selectedClientId]);

  // Handlers
  const handleClientSelect = (clientId: number) => {
    navigateToClient(clientId);
  };

  const handleBackToClients = () => {
    setActivePage(null);
    navigateToClients();
  };

  const handleDocumentSelect = (docId: number, parentFolderId: number) => {
    // Clear activePageId when selecting a different document
    if (selectedDocumentId !== docId) {
      setActivePage(null);
    }
    // IMPORTANT: selecting a document for preview should not "toggle off" on repeated clicks.
    // Toggling causes races where the document gets deselected while its pages are loading,
    // making page clicks appear non-functional.
    selectDocument(docId, parentFolderId);
  };


  // Client label for breadcrumb
  const clientLabel = selectedClient
    ? `${selectedClient.description} - ${selectedClient.fileNumberPart1} ${selectedClient.drawerName ? `(${selectedClient.drawerName})` : ''}`
    : undefined;

  return (
    <Card withBorder style={{ backgroundColor: cardBg }}>
      <Stack>
        <ClientSearch isLoading={clientsLoading} error={clientsError?.message} />

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
              setActivePage(null);
            }}
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
            <Stack gap="xs" style={{ minHeight: 0, height: '100%' }}>
              <NameFilter
                value={documentSearchInput}
                onChange={setDocumentSearchInput}
                delay={0}
                width={360}
                placeholder="Search documents by name"
              />
              <ScrollArea
                style={{ height: '100%', backgroundColor: panelBg, border: `1px solid ${panelBorder}`, borderRadius: 'var(--mantine-radius-sm)' }}
              >
                <Stack gap={2} p="xs">
                  {searchActive && (
                    <Stack gap={2}>
                      {searchLoading && (
                        <Group gap="xs" py={4} px={6}>
                          <Loader size="xs" />
                          <Text size="sm" c="dimmed">
                            Searching...
                          </Text>
                        </Group>
                      )}
                      {!searchLoading && searchResults.length === 0 && (
                        <Text size="sm" c="dimmed" py={4} px={6}>
                          No documents found
                        </Text>
                      )}
                      {!searchLoading && searchResults.map((doc: any) => (
                        <Group
                          key={`search-doc-${doc.id}`}
                          gap="xs"
                          py={4}
                          px={6}
                          className={classes.documentItem}
                          onClick={() => {
                            if (doc.folderId != null) {
                              expandFolder(doc.folderId);
                            }
                            handleDocumentSelect(doc.id, doc.folderId ?? null);
                          }}
                        >
                          <IconFileText size={14} color="var(--mantine-color-blue-7)" />
                          <Text truncate style={{ minWidth: 0, flex: 1 }}>
                            {doc.name}
                          </Text>
                          {doc.folderName && (
                            <Text size="xs" c="dimmed" truncate style={{ maxWidth: 140 }}>
                              {doc.folderName}
                            </Text>
                          )}
                          {doc.modified && (
                            <Text size="xs" c="dimmed">
                              {doc.modified}
                            </Text>
                          )}
                        </Group>
                      ))}
                    </Stack>
                  )}

                  {rootFoldersLoading && <TreeLoadingSkeleton />}

                  {!rootFoldersLoading && (
                    <Stack gap={2}>
                      {rootFolders.map((folder: any) => {
                        const isExpanded = expandedRootFolders.has(folder.id);
                        const folderName = folder.folderTypeName
                        const folderDisplayName = folder.folderTypeName && folder.folderTypeDescription !== folderName
                          ? `${folder.folderTypeDescription} (${folder.folderTypeDescription})`
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
                                selectedDocumentId={selectedDocumentId}
                                onDocumentSelect={handleDocumentSelect}
                                onPageClick={setActivePage}
                                activePage={activePage}
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
                </Stack>
              </ScrollArea>
            </Stack>

            {/* Preview pane */}
            <PreviewPane 
              expandedDocumentId={selectedDocumentId?.toString() ?? null} 
              folderId={selectedFolderId} 
              allowedExtensions={allowedExtensions}
              pdfDefaultZoom={pdfDefaultZoom}
              activePage={activePage}
            />
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
  selectedDocumentId: number | null;
  onDocumentSelect: (documentId: number, folderId: number) => void;
  onPageClick: (page: { documentId: number; pageId: number; imageId: number | null; extension: string | null } | null) => void;
  activePage: { documentId: number; pageId: number; imageId: number | null; extension: string | null } | null;
  importedDocumentIds?: string[];
  allowedExtensions?: string[];
}) {
  const { data: rawChildFolders = [], isLoading: foldersLoading } = useFolders({
    clientId,
    folderId,
    folderTypes: folderTypes ?? null,
  });

  const { data: rawDocuments = [], isLoading: documentsLoading } = useDocuments(
    { clientId, folderId },
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

  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  const isLoading = foldersLoading || documentsLoading || isFiltering;

  // Get list of visible document IDs for shift-select range
  const visibleDocumentIds = useMemo(() => documents.map((d: any) => d.id), [documents]);

  const toggleFolder = (id: number) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      const isCurrentlyExpanded = next.has(id);
      if (!isCurrentlyExpanded) {
        void childFolders.find((f: any) => f.id === id);
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const orderedDocuments = useMemo(() => {
    return [...documents].sort((a: any, b: any) => {
      return b.lastModified - a.lastModified;
    });
  }, [documents]);

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
              selectedDocumentId={selectedDocumentId}
              onDocumentSelect={onDocumentSelect}
              onPageClick={onPageClick}
              activePage={activePage}
              importedDocumentIds={importedDocumentIds}
              allowedExtensions={allowedExtensions}
            />
          )})}

          {/* Documents */}
          {orderedDocuments.map((doc: any) => (
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

export default FileTreeBrowser;

