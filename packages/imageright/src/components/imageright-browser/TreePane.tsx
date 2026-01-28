import { Stack } from '@mantine/core';
import { ClientSearch } from '../client-search/ClientSearch';
import BreadcrumbNav from '../file-browser/BreadcrumbNav';
import { useClients, useClientLabel } from '@hooks/index';
import type { DocumentTypes, FolderTypes } from '@bmb-inc/types';
import type { ActivePage } from './types';
import { ClientList } from './ClientList';
import { RootFolderList } from './RootFolderList';
import { useAutoSelectSingleClient } from '../file-browser/hooks/useAutoSelectSingleClient';
import { TreeProvider } from './TreeContext';

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
  selectedDocumentId: number | null;
  expandedRootFolders: Set<number>;
  toggleRootFolder: (folderId: number) => void;
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
  selectedDocumentId,
  expandedRootFolders,
  toggleRootFolder,
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

  const clientLabel = useClientLabel(clients, selectedClientId);

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
          <TreeProvider
            value={{
              folderTypes,
              documentTypes,
              allowedExtensions,
              importedDocumentIds,
              selectedDocumentId,
              activePage,
              setActivePage,
              onDocumentSelect,
              expandedRootFolders,
              toggleRootFolder,
            }}
          >
            <RootFolderList clientId={selectedClientId} />
          </TreeProvider>
        </div>
      )}
    </Stack>
  );
}

export default TreePane;



