import { useEffect, useMemo } from 'react';
import { Card, Stack, Center, Text } from '@mantine/core';
import { ClientSearch } from '../client-search/ClientSearch';
import { type ImagerightClient } from '@bmb-inc/types';
// ClientCard used inside ClientList
import BreadcrumbNav from './BreadcrumbNav';
import DetailsTable from './DetailsTable';
import { IconSearch } from '@tabler/icons-react';
import { useBrowserNavigation } from '../../hooks/useBrowserNavigation';
import { useClients } from '@hooks/index';
import { usePolicyFolders } from '@hooks/useFolders';
import { useFolders } from '../../hooks/useFolders';
import { useDocuments, useAllDocumentTypes, useDocumentsByName } from '@hooks/useDocuments';
import { useDocumentSearchParam } from '@hooks/useDocumentSearchParam';
import LoadingSkeletons from './LoadingSkeletons';
import ClientContentArea from './ClientContentArea';
import { useAutoSelectSingleClient } from './hooks/useAutoSelectSingleClient';
import { useCurrentItems } from './hooks/useCurrentItems';
import { useFolderLabelFromDocs, useFolderLabelMap } from './hooks/useFolderLabels';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';
 
export const FolderFileBrowser = ({
  folderTypes,
  documentTypes,
  allowedExtensions,
  pdfDefaultZoom,
  importedDocumentIds,
}: {
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  allowedExtensions?: string[];
  /** Default zoom level for PDF previews (clamped inside PdfPreview) */
  pdfDefaultZoom?: number;
  importedDocumentIds?: string[];
}) => {
  // Real data hooks
  const { data: clients = [], isLoading: clientsLoading, error: clientsError } = useClients();

  const {
    clientId: expandedClientId,
    folderId: expandedFolderId,
    documentId: expandedDocumentId,
    currentFolderId,
    navigateToClients: clearToClients,
    navigateToClient,
    navigateToClientRoot: goToClientRoot,
    navigateIntoFolder,
    navigateToDocument,
    navigateToDocumentInFolder,
    clearDocumentSelection,
  } = useBrowserNavigation();

  const { value: documentSearchInput, onChange: setDocumentSearchInput, searchParam: documentSearchParam } =
    useDocumentSearchParam(500);

  // Debug: Log all unique document types for the selected client
  useAllDocumentTypes(expandedClientId ? Number(expandedClientId) : undefined);

  // Current-level folders and documents
  const normalizedFolderTypes = Array.isArray(folderTypes) && folderTypes.length > 0 ? folderTypes : undefined;
  const normalizedDocumentTypes = Array.isArray(documentTypes) && documentTypes.length > 0 ? documentTypes : undefined;
  // Prefer server's policy-root endpoint when only policies are requested at root
  const atRoot = !!(expandedClientId && !currentFolderId);
  const wantsOnlyPoliciesAtRoot =
    atRoot &&
    Array.isArray(normalizedFolderTypes) &&
    normalizedFolderTypes.length === 1 &&
    normalizedFolderTypes[0] === FolderTypes.policies;

  const { data: policyFolders = [], isLoading: policyFoldersLoading } = usePolicyFolders(
    wantsOnlyPoliciesAtRoot && expandedClientId ? { clientId: Number(expandedClientId) } : undefined,
  );
  const { data: genericFolders = [], isLoading: genericFoldersLoading } = useFolders(
    wantsOnlyPoliciesAtRoot
      ? undefined
      : expandedClientId
        ? {
            clientId: Number(expandedClientId),
            folderId: currentFolderId ? Number(currentFolderId) : null,
            folderTypes: normalizedFolderTypes,
          }
        : undefined,
  );
  const folders = wantsOnlyPoliciesAtRoot ? (policyFolders || []) : (genericFolders || []);
  const foldersLoading = wantsOnlyPoliciesAtRoot ? policyFoldersLoading : genericFoldersLoading;
  const { data: documents = [], isLoading: documentsLoading } = useDocuments(
    expandedClientId && currentFolderId
      ? { clientId: Number(expandedClientId), folderId: Number(currentFolderId) }
      : undefined,
    normalizedDocumentTypes
  );
  const selectedClient = (clients || []).find((c: ImagerightClient) => c.id.toString() === expandedClientId);
  const selectedDrawerId = selectedClient?.drawerId ?? null;
  const searchActive = !!expandedClientId && (documentSearchParam ?? '').trim().length > 0;
  const { data: searchedDocFolders = [], isLoading: searchLoading } = useDocumentsByName(
    searchActive
      ? {
          description: documentSearchParam ?? '',
          limit: 200,
          drawerId: selectedDrawerId ?? undefined,
          fileId: expandedClientId ? Number(expandedClientId) : undefined,
          parentId: currentFolderId ? Number(currentFolderId) : undefined,
        }
      : undefined
  );
  const currentLoading = foldersLoading || documentsLoading || (searchActive && searchLoading);

  // Prefer folder name from the first document's folder info when available
  const folderLabelFromDocs = useFolderLabelFromDocs(documents);

  // Build current level items (clients, folders, documents) for details view
  const currentItems = useCurrentItems({
    clients,
    expandedClientId,
    folders,
    documents,
    currentFolderId,
  });

  const searchItems = useMemo(() => {
    if (!searchActive || !expandedClientId) return [];
    const toDateStr = (iso?: string | null) => {
      if (!iso) return '';
      const dt = new Date(iso);
      return isNaN(dt.getTime()) ? '' : dt.toLocaleDateString();
    };
    const targetClientId = Number(expandedClientId);
    return (searchedDocFolders || [])
      .filter((doc: any) => {
        const fileId = doc?.file?.id ?? doc?.fileId ?? doc?.fileid;
        return typeof fileId === 'number' ? fileId === targetClientId : true;
      })
      .map((doc: any) => {
        const folder = Array.isArray(doc?.folder) ? doc.folder[0] : undefined;
        const folderId = folder?.id ?? folder?.folderId ?? doc?.parentid ?? doc?.parentId ?? null;
        const fileId = doc?.file?.id ?? doc?.fileId ?? doc?.fileid ?? targetClientId;
        return {
          kind: 'document' as const,
          id: doc?.docfolderid ?? doc?.id,
          name: doc?.description ?? doc?.documentName ?? 'Document',
          type: doc?.documentTypeDescription ?? 'Document',
          modified: toDateStr(doc?.lastmodified || doc?.dateLastModified || doc?.created || doc?.dateCreated),
          documentTypeId: doc?.documentTypeId,
          imagerightUrl: doc?.imagerightUrl ?? null,
          folderId: folderId != null ? Number(folderId) : null,
          clientId: fileId != null ? Number(fileId) : null,
        };
      })
      .filter((item: any) => typeof item.id === 'number');
  }, [searchActive, searchedDocFolders, expandedClientId]);

  const hasClients = Array.isArray(clients) && clients.length > 0;

  // Auto-select the client when exactly one search result is found
  useAutoSelectSingleClient({
    clients,
    clientsLoading,
    expandedClientId,
    navigateToClient: (id) => {
      void navigateToClient(id.toString());
    },
  });

  const folderLabelMap = useFolderLabelMap(folders);

  // Clear document selection if no folder is selected (document wouldn't be visible)
  useEffect(() => {
    if (expandedDocumentId && !currentFolderId) {
      clearDocumentSelection();
    }
  }, [expandedDocumentId, currentFolderId, clearDocumentSelection]);

  const clientLabel = selectedClient
    ? `${selectedClient.description} - ${selectedClient.fileNumberPart1} ${selectedClient.drawerName ? `(${selectedClient.drawerName})` : ''}`
    : undefined;

  const breadcrumbItems = (
    <BreadcrumbNav
      expandedClientId={expandedClientId}
      clientLabel={clientLabel}
      folderId={expandedFolderId}
      folderLabel={expandedFolderId ? (folderLabelFromDocs ?? folderLabelMap[expandedFolderId]) : undefined}
      onClientsClick={clearToClients}
      onClientRootClick={goToClientRoot}
    />
  );

  return (
    <Card withBorder>
      <Stack>
        <ClientSearch
          isLoading={clientsLoading}
          error={clientsError?.message}
        />

        {(expandedClientId || hasClients) && breadcrumbItems}

        {/* Single-pane content area */}
        {!expandedClientId && (
          hasClients ? (
            <DetailsTable
              items={currentItems}
              onFolderOpen={() => { /* no-op at client list level */ }}
              onClientOpen={(id) => navigateToClient(id.toString())}
            />
          ) : (
            <Center mih={160} style={{ border: '1px dashed var(--mantine-color-gray-4)', borderRadius: 6 }}>
              <Stack gap={6} align="center">
                <IconSearch size={20} color="var(--mantine-color-gray-6)" />
                <Text c="dimmed" size="sm">Search for a client by code or name to get started</Text>
              </Stack>
            </Center>
          )
        )}

        {expandedClientId && (
          <Stack>
            {currentLoading && <LoadingSkeletons />}
            {!currentLoading && (
              <ClientContentArea
                currentItems={searchActive ? searchItems : currentItems}
                expandedDocumentId={expandedDocumentId}
                folderId={expandedFolderId ? Number(expandedFolderId) : null}
                navigateIntoFolder={(id, name) => {
                  navigateIntoFolder(id.toString(), name);
                }}
                navigateToDocument={(id, nextFolderId, nextClientId) => {
                  const resolvedClientId = nextClientId ?? (expandedClientId ? Number(expandedClientId) : null);
                  if (resolvedClientId && nextFolderId) {
                    navigateToDocumentInFolder(resolvedClientId.toString(), nextFolderId.toString(), id.toString());
                    return;
                  }
                  navigateToDocument(id.toString());
                }}
                clearDocumentSelection={clearDocumentSelection}
                allowedExtensions={allowedExtensions}
                pdfDefaultZoom={pdfDefaultZoom}
                importedDocumentIds={importedDocumentIds}
                searchQuery={documentSearchInput}
                onSearchQueryChange={setDocumentSearchInput}
              />
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

// Backwards compatibility alias
export const ImageRightFileBrowser = FolderFileBrowser;
