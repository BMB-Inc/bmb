import { Card, Text, Stack, List } from "@mantine/core";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useClients } from "@hooks/index";
import { ClientSearch } from "./client-search";

export const ImageRightFileBrowser = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);
  const { data: clients, isLoading, error } = useClients(
    debouncedSearchQuery ? { clientCode: debouncedSearchQuery, clientName: debouncedSearchQuery } : undefined
  );

  return (
    <Card withBorder>
      <Stack>
        <ClientSearch 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          isLoading={isLoading}
          error={error?.message}
        />
        
        {clients && clients.length > 0 && (
          <Stack>
            <Text fw={500}>Found {clients.length} client(s):</Text>
            <List>
              {clients.map((client) => (
                <List.Item key={client.id}>
                  <Text size="sm">{client.description}</Text>
                  <Text size="xs" c="dimmed">ID: {client.id} | Drawer: {client.drawerName}</Text>
                </List.Item>
              ))}
            </List>
          </Stack>
        )}
        
        {(!clients || clients.length === 0) && !isLoading && (
          <Text size="sm" c="dimmed">Search for clients to browse their files...</Text>
        )}
      </Stack>
    </Card>
  );
};
