import { useMemo, useState } from 'react';
import { Card, Stack, Center, Text, Group, Loader, ScrollArea, Checkbox } from '@mantine/core';
import { IconSearch, IconFolder, IconFolderOpen, IconChevronRight, IconChevronDown, IconFileText } from '@tabler/icons-react';
import { ClientSearch } from '../client-search/ClientSearch';
import BreadcrumbNav from '../file-browser/BreadcrumbNav';
import PreviewPane from '../file-browser/PreviewPane';
import { TreeLoadingSkeleton } from './TreeLoadingSkeleton';
import { FolderTreeNode } from './FolderTreeNode';
import { useClients } from '@hooks/index';
import { useFolders, usePolicyFolders } from '@hooks/useFolders';
import { useDocuments } from '@hooks/useDocuments';
import { useSelectedDocuments } from '@hooks/useSelectedDocuments';
import { useTreeNavigation } from '@hooks/useTreeNavigation';
import { FolderTypes, DocumentTypes, type ImagerightClient } from '@bmb-inc/types';
import classes from '../../modules/file-tree.module.css';

type FileTreeBrowserProps = {
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
};

export function FileTreeBrowser({ folderTypes, documentTypes }: FileTreeBrowserProps) {
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  
  // URL-persisted navigation state
  const {
    clientId: selectedClientId,
    documentId: selectedDocumentId,
    expandedFolders: expandedRootFolders,
    navigateToClients,
    navigateToClient,
    selectDocument,
    toggleFolder: toggleRootFolder,
    collapseAll,
  } = useTreeNavigation();

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

  // Sort root folders by date modified (newest first)
  const rootFolders = useMemo(() => {
    const folders = wantsOnlyPoliciesAtRoot ? policyFolders : genericFolders;
    if (!folders || folders.length === 0) return [];
    
    return [...folders].sort((a: any, b: any) => {
      const aDate = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const bDate = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      return bDate - aDate; // Newest first
    });
  }, [wantsOnlyPoliciesAtRoot, policyFolders, genericFolders]);

  // Handlers
  const handleClientSelect = (clientId: number) => {
    navigateToClient(clientId);
  };

  const handleBackToClients = () => {
    navigateToClients();
  };

  const handleDocumentSelect = (docId: number) => {
    selectDocument(selectedDocumentId === docId ? null : docId);
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
                      cursor: 'pointer',
                      borderRadius: 'var(--mantine-radius-sm)',
                      border: '1px solid var(--mantine-color-gray-3)',
                    }}
                    className={classes.root}
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
              height: '67vh',
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
                    const folderType = folder.folderTypeName || folder.folderTypeDescription || 'Folder';

                    return (
                      <div key={folder.id}>
                        {/* Root folder row */}
                        <Group
                          gap="xs"
                          py={6}
                          px={8}
                          style={{
                            cursor: 'pointer',
                            borderRadius: 'var(--mantine-radius-sm)',
                          }}
                          className={isExpanded ? classes.rootExpanded : classes.root}
                          onClick={() => toggleRootFolder(folder.id)}
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

                        {/* Expanded children */}
                        {isExpanded && (
                          <RootFolderChildren
                            clientId={selectedClientId}
                            folderId={folder.id}
                            folderTypes={normalizedFolderTypes}
                            documentTypes={normalizedDocumentTypes}
                            selectedDocumentId={selectedDocumentId}
                            onDocumentSelect={handleDocumentSelect}
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
            <PreviewPane expandedDocumentId={selectedDocumentId?.toString() ?? null} />
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
}: {
  clientId: number;
  folderId: number;
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  selectedDocumentId: number | null;
  onDocumentSelect: (documentId: number) => void;
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

  const { 
    isSelected: isDocumentSelected, 
    toggleSelected: toggleDocumentSelected,
    handleSelectWithModifiers,
    setLastSelectedId,
  } = useSelectedDocuments();
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  const isLoading = foldersLoading || documentsLoading;

  // Get list of visible document IDs for shift-select range
  const visibleDocumentIds = useMemo(() => documents.map((d: any) => d.id), [documents]);

  const toggleFolder = (id: number) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={classes.children}>
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
          {childFolders.map((folder: any) => (
            <FolderTreeNode
              key={folder.id}
              clientId={clientId}
              folderId={folder.id}
              folderName={folder.description ?? folder.folderTypeName ?? 'Folder'}
              folderType={folder.folderTypeName || folder.folderTypeDescription || 'Folder'}
              depth={0}
              isExpanded={expandedFolders.has(folder.id)}
              onToggle={() => toggleFolder(folder.id)}
              folderTypes={folderTypes}
              documentTypes={documentTypes}
              selectedDocumentId={selectedDocumentId}
              onDocumentSelect={onDocumentSelect}
            />
          ))}

          {/* Documents */}
          {documents.map((doc: any) => (
            <Group
              key={doc.id}
              gap="xs"
              py={3}
              px={6}
              style={{
                cursor: 'pointer',
                borderRadius: 'var(--mantine-radius-xs)',
                userSelect: 'none',
              }}
              className={
                selectedDocumentId === doc.id
                  ? classes.documentItemExpanded
                  : classes.documentItem
              }
              onClick={(e) => {
                // Handle shift/ctrl+click for multi-select
                if (e.shiftKey || e.ctrlKey || e.metaKey) {
                  handleSelectWithModifiers(doc.id, visibleDocumentIds, {
                    shiftKey: e.shiftKey,
                    ctrlKey: e.ctrlKey,
                    metaKey: e.metaKey,
                  });
                } else {
                  // Regular click - toggle checkbox and set as anchor
                  toggleDocumentSelected(doc.id, !isDocumentSelected(doc.id));
                  setLastSelectedId(doc.id);
                }
                onDocumentSelect(doc.id);
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
                {doc.description || doc.documentTypeDescription || 'Document'}
              </Text>
            </Group>
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

