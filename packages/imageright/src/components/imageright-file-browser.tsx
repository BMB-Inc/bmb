import { useMemo, useState, useCallback } from 'react';
import { Card, Stack, type TreeNodeData } from '@mantine/core';
import { useClients } from '@hooks/index';
import { useGetChildren } from '@hooks/useGetChildren';
import { ClientSearch } from './client-search';
import { FileTree } from './file-tree';
import { type ImagerightClient } from '@bmb-inc/types';

export const ImageRightFileBrowser = () => {
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useClients();
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
  
  // Fetch children for the expanded client
  const { children, isLoading: childrenLoading } = useGetChildren(
    expandedClientId ? { clientId: Number(expandedClientId) } : undefined
  );

  // Handle node expansion
  const handleNodeExpand = useCallback((nodeValue: string) => {
    const [type, id] = nodeValue.split('-');
    console.log('Node expanded:', { type, id, nodeValue });
    
    if (type === 'client') {
      // Toggle expansion - if same client clicked, collapse it
      if (expandedClientId === id) {
        setExpandedClientId(null);
      } else {
        setExpandedClientId(id);
      }
    }
  }, [expandedClientId]);

  // Build tree data structure from clients
  const treeData = useMemo((): TreeNodeData[] => {
    if (!clients || !Array.isArray(clients)) {
      return [];
    }

    return clients.map((client: ImagerightClient) => {
      const clientNode: TreeNodeData = {
        value: `client-${client.id}`,
        label: `${client.description} - ${client.fileNumberPart1} (${client.drawerName})`,
        children: []
      };

      // Add children if this client is expanded and we have data
      if (expandedClientId === client.id.toString()) {
        if (children && Array.isArray(children)) {
          console.log('Adding children to client:', client.id, children);
          clientNode.children = children; // Children are already properly formatted by useGetChildren
        } else if (childrenLoading) {
          // Show loading placeholder
          clientNode.children = [{
            value: `loading-${client.id}`,
            label: 'Loading...'
          }];
        }
      }

      return clientNode;
    });
  }, [clients, expandedClientId, children]);

  return (
    <Card withBorder>
      <Stack>
        <ClientSearch
          isLoading={clientsLoading}
          error={clientsError?.message}
        />
        
        <FileTree 
          data={treeData} 
          onNodeExpand={handleNodeExpand}
          isLoading={clientsLoading || childrenLoading}
        />
      </Stack>
    </Card>
  );
};
