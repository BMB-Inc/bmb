import { Card, Stack, Tree, Text, Loader, Alert } from "@mantine/core";
import { IconAlertCircle } from '@tabler/icons-react';
import { useClients, usePolicyFolders, useDocuments, usePages, useUrlParams } from "@hooks/index";
import { ClientSearch } from "./client-search";
import { useEffect, useMemo } from "react";
import type { ImagerightClient, ImagerightFolder, ImagerightDocument, ImagerightPage } from "@bmb-inc/types";

interface TreeNodeData {
  value: string;
  label: string;
  children?: TreeNodeData[];
}

export const ImageRightFileBrowser = () => {
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useClients();
  const { setParam, getParam } = useUrlParams();
  
  const selectedClientId = getParam('clientId');
  const selectedFolderId = getParam('folderId');
  const selectedDocumentId = getParam('documentId');
  
  // Fetch data based on URL params
  const { data: folders, isLoading: foldersLoading, error: foldersError } = usePolicyFolders(
    selectedClientId ? { clientId: Number(selectedClientId) } : undefined
  );
  
  // Debug logging
  console.log('Current URL params:', { selectedClientId, selectedFolderId, selectedDocumentId });
  console.log('Folders data:', { folders, foldersLoading, foldersError });
  const { data: documents, isLoading: documentsLoading, error: documentsError } = useDocuments(
    selectedFolderId ? { 
      clientId: Number(selectedClientId), 
      folderId: Number(selectedFolderId) 
    } : undefined
  );
  const { data: pages, isLoading: pagesLoading, error: pagesError } = usePages(
    selectedDocumentId ? { documentId: Number(selectedDocumentId) } : undefined
  );

  useEffect(() => {
    if (clientsError) {
      console.error('Clients error:', clientsError);
    }
    if (foldersError) {
      console.error('Folders error:', foldersError);
    }
    if (documentsError) {
      console.error('Documents error:', documentsError);
    }
    if (pagesError) {
      console.error('Pages error:', pagesError);
    }
  }, [clientsError, foldersError, documentsError, pagesError]);

  // Determine overall loading state
  const isLoading = clientsLoading || 
    (selectedClientId && foldersLoading) || 
    (selectedFolderId && documentsLoading) || 
    (selectedDocumentId && pagesLoading);

  // Collect any errors
  const error = clientsError || foldersError || documentsError || pagesError;

  // Build tree data structure for Mantine Tree
  const treeData = useMemo((): TreeNodeData[] => {
    if (!clients || !Array.isArray(clients) || clients.length === 0) {
      return [];
    }

    return clients.map((client: ImagerightClient) => {
      const clientNode: TreeNodeData = {
        value: `client-${client.id}`,
        label: `${client.description} - ${client.fileNumberPart1} (${client.drawerName})`
      };

      // Add folders if this client is selected
      if (selectedClientId === client.id.toString() && folders && Array.isArray(folders) && folders.length > 0) {
        clientNode.children = folders.map((folder: ImagerightFolder) => {
          const folderNode: TreeNodeData = {
            value: `folder-${folder.id}`,
            label: folder.folderTypeName || folder.folderTypeDescription
          };

          // Add documents if this folder is selected
          if (selectedFolderId === folder.id.toString() && documents && Array.isArray(documents) && documents.length > 0) {
            folderNode.children = documents.map((document: ImagerightDocument) => {
              const documentNode: TreeNodeData = {
                value: `document-${document.id}`,
                label: document.documentName
              };

              // Add pages if this document is selected
              if (selectedDocumentId === document.id.toString() && pages && Array.isArray(pages) && pages.length > 0) {
                documentNode.children = pages.map((page: ImagerightPage) => ({
                  value: `page-${page.id}`,
                  label: `${page.pagenumber}`
                }));
              }

              return documentNode;
            });
          }

          return folderNode;
        });
      }

      return clientNode;
    });
  }, [clients, folders, documents, pages, selectedClientId, selectedFolderId, selectedDocumentId]);

  const handleNodeClick = (nodeValue: string) => {
    const [type, id] = nodeValue.split('-');
    
    console.log('Node clicked:', { type, id, nodeValue });
    
    switch (type) {
      case 'client':
        // Navigate to client's folders
        console.log('Setting clientId to:', id);
        setParam('clientId', id);
        break;
        
      case 'folder':
        // Navigate to folder's contents
        setParam('folderId', id);
        break;
        
      case 'document':
        // Navigate to document's pages
        setParam('documentId', id);
        break;
        
      case 'page':
        // Navigate to page image
        setParam('pageId', id);
        break;
    }
  };

  return (
    <Card withBorder>
      <Stack>
        <ClientSearch
          isLoading={clientsLoading}
          error={clientsError?.message}
        />
        
        {/* Handle error state */}
        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
            {error.message || 'Failed to load data'}
          </Alert>
        )}
        
        {/* Handle loading state */}
        {isLoading && (
          <Stack align="center" gap="sm">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">Loading...</Text>
          </Stack>
        )}
        
        {/* Handle empty state */}
        {!isLoading && !error && treeData.length === 0 && (
          <Text size="sm" c="dimmed">
            Search for clients to browse their files...
          </Text>
        )}
        
        {/* Render tree */}
        {!isLoading && !error && treeData.length > 0 && (
          <Tree 
            data={treeData}
            renderNode={({ node, elementProps }) => (
              <div 
                {...elementProps}
                onClick={() => handleNodeClick(node.value)}
                style={{ cursor: 'pointer', padding: '4px 8px' }}
              >
                {node.label}
              </div>
            )}
          />
        )}
      </Stack>
    </Card>
  );
};