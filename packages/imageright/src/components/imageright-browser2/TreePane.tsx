import { Stack } from '@mantine/core';
import { ClientSearch } from '../client-search/ClientSearch';
import BreadcrumbNav from '../file-browser/BreadcrumbNav';
import { useClients } from '@hooks/index';
import type { DocumentTypes, FolderTypes, ImagerightClient } from '@bmb-inc/types';

import type { ActivePage } from './types';
import { ClientList } from './ClientList';
import { RootFolderList } from './RootFolderList';
import { useAutoSelectSingleClient } from '../file-browser/hooks/useAutoSelectSingleClient';

type TreePaneProps = {
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  allowedExtensions?: string[];
  importedDocumentIds?: string[];

  // state (minimal)
  activePage: ActivePage | null;
  setActivePage: (p: ActivePage | null) => void;

  // navigation
  selectedClientId: number | null;
  selectedFolderId: number | null;
  selectedDocumentId: number | null;
  expandedRootFolders: Set<number>;
  toggleRootFolder: (folderId: number) => void;
  expandFolder: (folderId: number) => void;
  collapseAll: () => void;
  navigateToClients: () => void;
  navigateToClient: (clientId: number | string) => void;
  selectDocument: (documentId: number | null, folderId?: number) => void;
  onDocumentSelect: (docId: number, parentFolderId: number) => void;
};

export function TreePane({
  folderTypes,
  documentTypes,
  allowedExtensions,
  importedDocumentIds,
  activePage,
  setActivePage,
  selectedClientId,
  selectedFolderId,
  selectedDocumentId,
  expandedRootFolders,
  toggleRootFolder,
  expandFolder,
  collapseAll,
  navigateToClients,
  navigateToClient,
  selectDocument,
  onDocumentSelect,
}: TreePaneProps) {
  const { data: clients = [], isLoading: clientsLoading, error: clientsError } = useClients();

  // Auto-select the client when exactly one search result is found
  useAutoSelectSingleClient({
    clients,
    clientsLoading,
    expandedClientId: selectedClientId,
    navigateToClient,
  });

  const selectedClient = clients.find((c: ImagerightClient) => c.id === selectedClientId);
  const selectedDrawerId = selectedClient?.drawerId ?? null;

  const clientLabel = selectedClient
    ? `${selectedClient.description} - ${selectedClient.fileNumberPart1} ${selectedClient.drawerName ? `(${selectedClient.drawerName})` : ''}`
    : undefined;

  return (
    <Stack style={{ height: '100%', minHeight: 0 }}>
      <ClientSearch isLoading={clientsLoading} error={clientsError?.message} />

      {selectedClientId && (
        <BreadcrumbNav
          expandedClientId={selectedClientId.toString()}
          clientLabel={clientLabel}
          folderId={undefined}
          folderLabel={undefined}
          onClientsClick={navigateToClients}
          onClientRootClick={() => {
            collapseAll();
            selectDocument(null);
            setActivePage(null);
          }}
        />
      )}

      {!selectedClientId && (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ClientList clients={clients} isLoading={clientsLoading} error={clientsError?.message} onClientClick={navigateToClient} />
        </div>
      )}

      {selectedClientId && (
        <div style={{ flex: 1, minHeight: 0 }}>
          <RootFolderList
            clientId={selectedClientId}
            drawerId={selectedDrawerId}
            selectedFolderId={selectedFolderId}
            expandedRootFolders={expandedRootFolders}
            toggleRootFolder={toggleRootFolder}
            expandFolder={expandFolder}
            folderTypes={folderTypes}
            documentTypes={documentTypes}
            selectedDocumentId={selectedDocumentId}
            onDocumentSelect={onDocumentSelect}
            onPageClick={setActivePage}
            activePage={activePage}
            importedDocumentIds={importedDocumentIds}
            allowedExtensions={allowedExtensions}
          />
        </div>
      )}
    </Stack>
  );
}

export default TreePane;
