import { useState, useCallback, useEffect } from 'react';
import { Card, Stack, Skeleton } from '@mantine/core';
import { useClients } from '@hooks/index';
import { useGetChildren } from '@hooks/useGetChildren';
import { ClientSearch } from '../client-search/ClientSearch';
import { type ImagerightClient } from '@bmb-inc/types';
import { useSearchParams } from 'react-router-dom';
import treeClasses from '@modules/file-tree.module.css';
import { ClientCard } from './ClientCard';
import { FolderRow } from './FolderRow';
import { DocumentRow } from './DocumentRow';

export const ImageRightFileBrowser = () => {
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useClients();
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  
  // Fetch client-level children (folders only; documents gated by folderId)
  const { children: clientChildren, isLoading: clientChildrenLoading } = useGetChildren(
    expandedClientId ? { clientId: Number(expandedClientId) } : undefined,
  );

  // Fetch folder-level children (subfolders + documents)
  const { children: folderChildren, isLoading: folderChildrenLoading } = useGetChildren(
    expandedClientId && expandedFolderId
      ? { clientId: Number(expandedClientId), folderId: Number(expandedFolderId) }
      : undefined,
  );

  useEffect(() => {
    console.log('clientChildren', clientChildren);
    console.log('folderChildren', folderChildren);
  }, [clientChildren, folderChildren]);

  // Initialize expanded client from URL param if present
  useEffect(() => {
    const id = searchParams.get('clientId');
    if (id && id !== expandedClientId) {
      setExpandedClientId(id);
    }
  }, [searchParams]);

  // No external tree expand handler needed with text-based renderer

  const toggleClient = useCallback((clientId: string) => {
    setExpandedClientId(prev => (prev === clientId ? null : clientId));
    setExpandedFolderId(null);
  }, []);
  
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolderId(prev => (prev === folderId ? null : folderId));
  }, []);

  return (
    <Card withBorder>
      <Stack>
        <ClientSearch
          isLoading={clientsLoading}
          error={clientsError?.message}
        />

        {/* Card-based tree rendering using reusable components */}
        <Stack>
          {(!clients || !Array.isArray(clients)) ? null : clients.map((client: ImagerightClient) => {
            const isClientExpanded = expandedClientId === client.id.toString();
            return (
              <div key={`client-${client.id}`}>
                <ClientCard
                  label={`${client.description} - ${client.fileNumberPart1} ${client.drawerName ? `(${client.drawerName})` : ''}`}
                  expanded={isClientExpanded}
                  onToggle={() => toggleClient(client.id.toString())}
                />

                {isClientExpanded && (
                  <Stack className={treeClasses.children}>
                    {clientChildrenLoading && (
                      Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={`client-${client.id}-skeleton-${i}`} height={12} width="60%" radius="sm" />
                      ))
                    )}
                    {!clientChildrenLoading && clientChildren && clientChildren.map(child => {
                      const isFolder = String(child.value).startsWith('folder-');
                      const folderId = isFolder ? String(child.value).replace('folder-', '') : null;
                      const isThisFolderExpanded = isFolder && expandedFolderId === folderId;
                      const label = child.label as React.ReactNode;
                      return (
                        <div key={child.value}>
                          <FolderRow
                            label={label}
                            expanded={!!isThisFolderExpanded}
                            hasChildren={isFolder}
                            onToggle={() => folderId && toggleFolder(folderId)}
                          />
                          {isThisFolderExpanded && (
                            <Stack className={treeClasses.children}>
                              {folderChildrenLoading && (
                                <Skeleton height={12} width="40%" radius="sm" />
                              )}
                              {!folderChildrenLoading && folderChildren && folderChildren.map(sub => {
                                const isSubFolder = String(sub.value).startsWith('folder-');
                                return (
                                  <DocumentRow
                                    key={sub.value}
                                    label={sub.label as React.ReactNode}
                                    expanded={false}
                                    hasChildren={!isSubFolder}
                                    onToggle={() => {}}
                                  />
                                );
                              })}
                            </Stack>
                          )}
                        </div>
                      );
                    })}
                  </Stack>
                )}
              </div>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
};
