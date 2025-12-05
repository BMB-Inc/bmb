
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
import { useDocuments } from '@hooks/useDocuments';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';
import LoadingSkeletons from './LoadingSkeletons';
import ClientContentArea from './ClientContentArea';
import { useAutoSelectSingleClient } from './hooks/useAutoSelectSingleClient';
import { useCurrentItems } from './hooks/useCurrentItems';
import { useFolderLabelFromDocs, useFolderLabelMap } from './hooks/useFolderLabels';
 
export const ImageRightFileBrowser = ({ folderTypes, documentTypes }: { folderTypes?: FolderTypes[], documentTypes?: DocumentTypes[] }) => {
  // Real data hooks
  const { data: clients = [], isLoading: clientsLoading } = useClients();
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
    clearDocumentSelection,
  } = useBrowserNavigation();

  // Current-level folders and documents
  const atRoot = !!(expandedClientId && !currentFolderId);
  const showPolicyAtRoot = Array.isArray(folderTypes) && folderTypes.includes(FolderTypes.policies);
  const shouldUseRootFolders = atRoot && !showPolicyAtRoot && Array.isArray(folderTypes) && folderTypes.length > 0;
  // Policy-level folders at client root ONLY when explicitly requested
  const { data: policyFolders = [], isLoading: policyFoldersLoading } = usePolicyFolders(
    atRoot && showPolicyAtRoot
      ? { clientId: Number(expandedClientId) }
      : undefined,
  );
  // Root-level non-policy folders if configured; and child folders when inside a selected folder
  const { data: regularFolders = [], isLoading: regularFoldersLoading } = useFolders(
    expandedClientId
      ? (currentFolderId
          ? { clientId: Number(expandedClientId), folderId: Number(currentFolderId), folderTypes }
          : (shouldUseRootFolders ? { clientId: Number(expandedClientId), folderTypes } : undefined)
        )
      : undefined,
  );
  const folders = currentFolderId
    ? regularFolders
    : (showPolicyAtRoot ? policyFolders : (shouldUseRootFolders ? regularFolders : []));
  const foldersLoading = currentFolderId
    ? regularFoldersLoading
    : (showPolicyAtRoot ? policyFoldersLoading : (shouldUseRootFolders ? regularFoldersLoading : false));
  const { data: documents = [], isLoading: documentsLoading } = useDocuments(
    expandedClientId && currentFolderId
      ? { clientId: Number(expandedClientId), folderId: Number(currentFolderId) }
      : undefined,
    documentTypes
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
          error={undefined}
        />

        {(expandedClientId || hasClients) && breadcrumbItems}

        {/* Single-pane content area */}
        {!expandedClientId && (
          hasClients ? (
            <DetailsTable
              items={currentItems}
              onFolderOpen={() => {}}
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
                navigateIntoFolder={(id) => navigateIntoFolder(id.toString())}
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
