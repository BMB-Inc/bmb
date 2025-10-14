import { useMemo, useEffect, useState } from 'react';
import { Card, Stack, Skeleton, Center, Text } from '@mantine/core';
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
import DocumentPages from './DocumentPages';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';
 
export const ImageRightFileBrowser = ({ folderTypes, documentType }: { folderTypes?: FolderTypes[], documentType?: DocumentTypes }) => {
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
  // No local label state; derive labels from data for simplicity

  // Current-level folders and documents
  // Policy-level folders at client root
  const { data: policyFolders = [], isLoading: policyFoldersLoading } = usePolicyFolders(
    expandedClientId && !currentFolderId
      ? { clientId: Number(expandedClientId) }
      : undefined,
  );
  // Regular folders when inside a selected policy folder
  const { data: regularFolders = [], isLoading: regularFoldersLoading } = useFolders(
    expandedClientId && currentFolderId
      ? { clientId: Number(expandedClientId), folderId: Number(currentFolderId), folderTypes }
      : undefined,
  );
  const folders = currentFolderId ? regularFolders : policyFolders;
  const foldersLoading = currentFolderId ? regularFoldersLoading : policyFoldersLoading;
  const { data: documents = [], isLoading: documentsLoading } = useDocuments(
    expandedClientId && currentFolderId
      ? { clientId: Number(expandedClientId), folderId: Number(currentFolderId) }
      : undefined,
    documentType
  );
  const currentLoading = foldersLoading || documentsLoading;

  // Prefer folder name from the first document's folder info when available
  const folderLabelFromDocs = useMemo(() => {
    if (Array.isArray(documents) && documents.length > 0) {
      const firstDoc: any = documents[0];
      const firstFolder = firstDoc?.folder;
      if (firstFolder?.description) return String(firstFolder.description);
    }
    return undefined;
  }, [documents]);


  // Build current level items (clients, folders, documents) for details view
  const currentItems = useMemo(() => {
    const toDateStr = (iso?: string | null) => {
      if (!iso) return '';
      const dt = new Date(iso);
      return isNaN(dt.getTime()) ? '' : dt.toLocaleDateString();
    };
    const toTs = (iso?: string | null) => {
      if (!iso) return 0;
      const dt = new Date(iso);
      return isNaN(dt.getTime()) ? 0 : dt.getTime();
    };

    if (!expandedClientId) {
      return (clients || []).map((c: any) => ({
        kind: 'client' as const,
        id: c.id,
        name: `${c.description} - ${c.fileNumberPart1} ${c.drawerName ? `(${c.drawerName})` : ''}`,
        type: c.fileTypeName || 'Client',
        modified: c.lastModified ? toDateStr(c.lastModified) : '',
      })) as import('./types').BrowserItem[];
    }

    // Sort folders by lastModified desc before mapping
    const folderItems = (folders || [])
      .slice()
      .sort((a: any, b: any) => toTs(b?.lastModified) - toTs(a?.lastModified))
      .map((f: any) => ({
      kind: 'folder' as const,
      id: f.id,
      name: f.description || `Folder ${f.id}`,
      type: f.folderTypeName || f.folderTypeDescription || 'Folder',
      modified: toDateStr((f as any).lastModified),
    }));
    if (!currentFolderId) {
      return folderItems as import('./types').BrowserItem[];
    }

    // Sort documents by dateLastModified/dateCreated desc before mapping
    const documentItems = (documents || [])
      .slice()
      .sort((a: any, b: any) => toTs(b?.dateLastModified || b?.dateCreated) - toTs(a?.dateLastModified || a?.dateCreated))
      .map((d: any) => ({
      kind: 'document' as const,
      id: d.id,
      name: d.description || `Document ${d.id}`,
      type: d.documentTypeDescription || 'Document',
      modified: toDateStr(d.dateLastModified || d.dateCreated),
    }));
    return [...folderItems, ...documentItems] as import('./types').BrowserItem[];
  }, [clients, expandedClientId, folders, documents, currentFolderId]);

  const hasClients = Array.isArray(clients) && clients.length > 0;

  const [folderLabelMap, setFolderLabelMap] = useState<Record<string, string>>({});
  useEffect(() => {
    if (folders && folders.length) {
      setFolderLabelMap(prev => {
        const next = { ...prev };
        for (const f of folders as any[]) {
          const label = f.description || `Folder ${f.id}`;
          next[String(f.id)] = label;
        }
        return next;
      });
    }
  }, [folders]);

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
            {currentLoading && (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={`skeleton-${i}`} height={12} width={i % 2 === 0 ? '60%' : '40%'} radius="sm" />
              ))
            )}
            {!currentLoading && (
              <DetailsTable
                items={currentItems}
                onFolderOpen={(id) => navigateIntoFolder(id.toString())}
                onDocumentOpen={(id) => navigateToDocument(id.toString())}
                selectedDocumentId={expandedDocumentId ? Number(expandedDocumentId) : null}
                onDocumentClear={clearDocumentSelection}
              />
            )}

            {/* Pages panel for selected document */}
            {expandedDocumentId && (
              <DocumentPages documentId={Number(expandedDocumentId)} />
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};
