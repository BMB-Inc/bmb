import { useState, useCallback, useEffect } from 'react';
import { Card, Stack, Skeleton, Box, Text } from '@mantine/core';
import { useClients } from '@hooks/index';
import { useGetChildren } from '@hooks/useGetChildren';
import { ClientSearch } from './client-search';
import { type ImagerightClient } from '@bmb-inc/types';
import { useSearchParams } from 'react-router-dom';
import classes from '../modules/hover-card.module.css';

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
        
        {/* Simple text-based tree rendering */}
        <Stack>
          {(!clients || !Array.isArray(clients)) ? null : clients.map((client: ImagerightClient) => {
            const isClientExpanded = expandedClientId === client.id.toString();
            return (
              <Card withBorder key={`client-${client.id}`} className={classes.hoverCard}>
                <Box
                  style={{ cursor: 'pointer', padding: 8, fontWeight: 600 }}
                  onClick={() => toggleClient(client.id.toString())}
                  aria-expanded={isClientExpanded}
                >
                  <Text fw={600}>
                    ▸ {client.description} - {client.fileNumberPart1} ({client.drawerName})
                  </Text>
                </Box>
                {isClientExpanded && (
                  <Stack style={{ paddingLeft: 16 }}>
                    {clientChildrenLoading && (
                      Array.from({ length: 10 }).map((_, i) => (
                        <Box key={`client-${client.id}-skeleton-${i}`} style={{ opacity: 0.6 }}>
                          <Skeleton height={12} width="60%" radius="sm" />
                        </Box>
                      ))
                    )}
                    {!clientChildrenLoading && clientChildren && clientChildren.map(child => {
                      const isFolder = String(child.value).startsWith('folder-');
                      const folderId = isFolder ? String(child.value).replace('folder-', '') : null;
                      const isThisFolderExpanded = isFolder && expandedFolderId === folderId;
                      return (
                        <Card withBorder key={child.value} className={classes.hoverCard} onClick={() => isFolder && folderId && toggleFolder(folderId)}>
                            <Text fw={isFolder ? 500 : 400}>
                              {isFolder ? '▸' : '•'} {child.label}
                            </Text>
                          {isThisFolderExpanded && (
                            <Stack style={{ paddingLeft: 16 }}>
                              {folderChildrenLoading && (
                                <Text fs="italic" style={{ opacity: 0.7 }}>Loading...</Text>
                              )}
                              {!folderChildrenLoading && folderChildren && folderChildren.map(sub => (
                                <Box key={sub.value}>
                                  <Text fw={String(sub.value).startsWith('folder-') ? 500 : 400}>
                                    {String(sub.value).startsWith('folder-') ? '▸' : '•'} {sub.label}
                                  </Text>
                                </Box>
                              ))}
                            </Stack>
                          )}
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
};
