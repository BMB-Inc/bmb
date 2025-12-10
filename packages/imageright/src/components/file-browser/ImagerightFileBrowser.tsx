
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
import { useDocuments, useAllDocumentTypes } from '@hooks/useDocuments';
import LoadingSkeletons from './LoadingSkeletons';
import ClientContentArea from './ClientContentArea';
import { useAutoSelectSingleClient } from './hooks/useAutoSelectSingleClient';
import { useCurrentItems } from './hooks/useCurrentItems';
import { useFolderLabelFromDocs, useFolderLabelMap } from './hooks/useFolderLabels';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';
 
export const ImageRightFileBrowser = ({ folderTypes, documentTypes }: { folderTypes?: FolderTypes[], documentTypes?: DocumentTypes[] }) => {
  // Real data hooks
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const {
    clientId: expandedClientId,
    folderId: expandedFolderId,
    folderName: expandedFolderName,
    documentId: expandedDocumentId,
    currentFolderId,
    navigateToClients: clearToClients,
    navigateToClient,
    navigateToClientRoot: goToClientRoot,
    navigateIntoFolder,
    navigateToDocument,
    clearDocumentSelection,
  } = useBrowserNavigation();

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
  const currentLoading = foldersLoading || documentsLoading;

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

  const hasClients = Array.isArray(clients) && clients.length > 0;

  // Auto-select the client when exactly one search result is found
  useAutoSelectSingleClient({
    clients,
    clientsLoading,
    expandedClientId,
    navigateToClient,
  });

  const folderLabelMap = useFolderLabelMap(folders);

  const breadcrumbItems = (
    <BreadcrumbNav
      expandedClientId={expandedClientId}
      clientLabel={(() => {
          const found = (clients || []).find((c: ImagerightClient) => c.id.toString() === expandedClientId);
          return found
            ? `${found.description} - ${found.fileNumberPart1} ${found.drawerName ? `(${found.drawerName})` : ''}`
            : undefined;
        })()}
      folderId={expandedFolderId}
      folderLabel={expandedFolderId ? (folderLabelFromDocs ?? folderLabelMap[expandedFolderId] ?? expandedFolderName) : undefined}
      onClientsClick={clearToClients}
      onClientRootClick={goToClientRoot}
    />
  );

  return (
    <Card withBorder>
      <Stack>
        <ClientSearch
          isLoading={clientsLoading}
          error={undefined}
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
                currentItems={currentItems}
                expandedDocumentId={expandedDocumentId}
                navigateIntoFolder={(id, name) => navigateIntoFolder(id.toString(), name)}
                navigateToDocument={(id) => navigateToDocument(id.toString())}
                clearDocumentSelection={clearDocumentSelection}
              />
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};
