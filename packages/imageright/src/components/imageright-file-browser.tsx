import { Card, Text, Stack, Group } from "@mantine/core";
import { useClients, useDocuments, useFolders } from "@hooks/index";
import { ClientSearch } from "./client-search";
import classes from "@modules/hover-card.module.css";
import { useUrlParams } from "@hooks/useUrlParams";
import { useEffect } from "react";
import { type ImagerightFolder, type ImagerightClient } from "@bmb-inc/types";

export const ImageRightFileBrowser = () => {
  const { data: clients, isLoading, error } = useClients();
  const { setParam, getParam } = useUrlParams();
  
  const selectedClientId = getParam('clientId');
  const { data: folders, error: errorFolders } = useFolders(
    selectedClientId ? { clientId: Number(selectedClientId) } : undefined
  );

  const selectedFolderId = getParam('folderId');
  const { data: files, error: errorFiles } = useDocuments(
    selectedFolderId ? Number(selectedFolderId) : undefined
  );

  // Console log folders data when it changes
  useEffect(() => {
    if (folders) {
      console.log('Folders data:', folders);
    }
    if (errorFolders) {
      console.error('Folders error:', errorFolders);
    }
    if (files) {
      console.log('Files data:', files);
    }
    if (errorFiles) {
      console.error('Files error:', errorFiles);
    }
  }, [folders, errorFolders]);

  return (
    <Card withBorder>
      <Stack>
        <ClientSearch
          isLoading={isLoading}
          error={error?.message}
        />
        
        {clients && clients.length > 0 && (
          <Stack>
            <Text fw={500}>Found {clients.length} client(s):</Text>
              {clients.map((client: ImagerightClient) => (
                <Card key={client.id} withBorder className={classes.hoverCard} onClick={() => setParam('clientId', client.id)}>
                  <Card.Section inheritPadding>
                    <Group>
                      <Text>{client.description}</Text>
                      <Text>{client.fileNumberPart1}</Text>
                    </Group>
                  </Card.Section>
                  <Text fw={600} fz="xl">{client.drawerDescription ?? client.drawerName}</Text>
                </Card>
              ))}
          </Stack>
        )}

        {folders && folders.length > 0 && (
          <Stack>
            <Text fw={500}>Found {folders.length} folder(s):</Text>
            {folders.map((folder: ImagerightFolder) => (
              <Card key={folder.id} withBorder className={classes.hoverCard} onClick={() => setParam('folderId', folder.id)}>
                <Text>{folder.folderTypeName ?? folder.folderTypeDescription}</Text>
              </Card>
            ))}
          </Stack>
        )}
        
        {(!clients || clients.length === 0) && !isLoading && (
          <Text size="sm" c="dimmed">Search for clients to browse their files...</Text>
        )}
      </Stack>
    </Card>
  );
};
