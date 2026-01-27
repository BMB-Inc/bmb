import { useMemo, useEffect, useState } from 'react';
import { Card, Stack, Skeleton, Center, Text, useComputedColorScheme } from '@mantine/core';
import { ClientSearch } from '../client-search/ClientSearch';
import { type ImagerightClient } from '@bmb-inc/types';
import { DocumentTypes, FolderTypes } from '@bmb-inc/types';
import BreadcrumbNav from '../file-browser/BreadcrumbNav';
import DetailsTable from '../file-browser/DetailsTable';
import { IconSearch } from '@tabler/icons-react';
import { useBrowserNavigation } from '../../hooks/useBrowserNavigation';
import { useClients } from '@hooks/index';
import { usePolicyFolders, useFolders } from '@hooks/useFolders';
import { useDocuments } from '@hooks/useDocuments';

export const SubmissionsDocuments = () => {
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-gray-0)';
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
    clearDocumentSelection,
  } = useBrowserNavigation();

  // Track the first-level selected folder under a client (policy folder level)
  const [policyLevelFolderId, setPolicyLevelFolderId] = useState<string | null>(null);
  // Reset on client change or when leaving folder context
  useEffect(() => {
    setPolicyLevelFolderId(null);
  }, [expandedClientId]);
  useEffect(() => {
    if (!expandedClientId || !currentFolderId) {
      setPolicyLevelFolderId(null);
      return;
    }
    if (policyLevelFolderId == null) {
      setPolicyLevelFolderId(currentFolderId);
    }
  }, [expandedClientId, currentFolderId, policyLevelFolderId]);

  const atClientRoot = !!expandedClientId && !currentFolderId;
  const atPolicyFolderLevel = !!expandedClientId && !!currentFolderId && policyLevelFolderId === currentFolderId;
  const atInnerFolderLevel = !!expandedClientId && !!currentFolderId && policyLevelFolderId !== null && policyLevelFolderId !== currentFolderId;

  // Folders: policy at client root, regular inside a policy folder
  const { data: policyFolders = [], isLoading: policyFoldersLoading } = usePolicyFolders(
    atClientRoot
      ? { clientId: Number(expandedClientId) }
      : undefined,
  );
  const { data: regularFolders = [], isLoading: regularFoldersLoading } = useFolders(
    (atPolicyFolderLevel || atInnerFolderLevel)
      ? { clientId: Number(expandedClientId), folderId: Number(currentFolderId), folderTypes: [FolderTypes.submissions, FolderTypes.applications] }
      : undefined,
  );
  const folders = atClientRoot ? policyFolders : (atPolicyFolderLevel || atInnerFolderLevel) ? regularFolders : [];
  const foldersLoading = atClientRoot ? policyFoldersLoading : (atPolicyFolderLevel || atInnerFolderLevel) ? regularFoldersLoading : false;

  // Documents: only when inside a policy folder, filtered to applications
  const { data: documents = [], isLoading: documentsLoading } = useDocuments(
    atInnerFolderLevel
      ? { clientId: Number(expandedClientId), folderId: Number(currentFolderId) }
      : undefined,
    DocumentTypes.applications,
  );
  const currentLoading = foldersLoading || documentsLoading;

  const folderLabelFromDocs = useMemo(() => {
    if (Array.isArray(documents) && documents.length > 0) {
      const firstDoc: any = documents[0];
      const firstFolder = firstDoc?.folder;
      if (firstFolder?.description) return String(firstFolder.description);
    }
    return undefined;
  }, [documents]);

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

  const currentItems = useMemo(() => {
    if (!expandedClientId) {
      return (clients || []).map((c: any) => ({
        kind: 'client' as const,
        id: c.id,
        name: `${c.description} - ${c.fileNumberPart1} ${c.drawerName ? `(${c.drawerName})` : ''}`,
        type: c.fileTypeName || 'Client',
        modified: c.lastModified ? toDateStr(c.lastModified) : '',
      })) as import('../file-browser/types').BrowserItem[];
    }

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
    if (!currentFolderId || atPolicyFolderLevel) {
      return folderItems as import('../file-browser/types').BrowserItem[];
    }

    const documentItems = (documents || [])
      .slice()
      .sort((a: any, b: any) => toTs(b?.dateLastModified || b?.dateCreated) - toTs(a?.dateLastModified || a?.dateCreated))
      .map((d: any) => ({
        kind: 'document' as const,
        id: d.id,
        name: d.documentName || d.description || `Document ${d.id}`,
        type: d.documentTypeDescription || 'Document',
        modified: toDateStr(d.dateLastModified || d.dateCreated),
        imagerightUrl: d?.imagerightUrl ?? null,
      }));
    return [...folderItems, ...documentItems] as import('../file-browser/types').BrowserItem[];
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
    <Card withBorder style={{ backgroundColor: cardBg }}>
      <Stack>
        <ClientSearch
          isLoading={clientsLoading}
          error={clientsError?.message}
        />

        {(expandedClientId || hasClients) && breadcrumbItems}

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
          </Stack>
        )}
      </Stack>
    </Card>
  );
};