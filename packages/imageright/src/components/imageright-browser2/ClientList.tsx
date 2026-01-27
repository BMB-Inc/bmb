import { Center, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { IconFolder, IconSearch } from '@tabler/icons-react';
import type { ImagerightClient } from '@bmb-inc/types';

export function ClientList({
  clients,
  isLoading,
  error,
  onClientClick,
}: {
  clients: ImagerightClient[];
  isLoading: boolean;
  error?: string;
  onClientClick: (clientId: number) => void;
}) {
  const hasClients = Array.isArray(clients) && clients.length > 0;

  if (!hasClients) {
    return (
      <Center mih={160} style={{ border: '1px dashed var(--mantine-color-gray-4)', borderRadius: 6 }}>
        <Stack gap={6} align="center">
          <IconSearch size={20} color="var(--mantine-color-gray-6)" />
          <Text c="dimmed" size="sm">
            {isLoading
              ? 'Loading clients…'
              : error
                ? `Unable to load clients: ${error}`
                : 'Search for a client by code or name to get started'}
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <ScrollArea h="100%" style={{ flex: 1, minHeight: 0 }}>
      <Stack gap="xs">
        {clients.map((client) => (
          <Group
            key={client.id}
            gap="xs"
            py={6}
            px={8}
            style={{
              borderRadius: 'var(--mantine-radius-sm)',
              border: '1px solid var(--mantine-color-gray-3)',
              cursor: 'pointer',
            }}
            onClick={() => onClientClick(client.id)}
          >
            <IconFolder size={16} color="var(--mantine-color-blue-5)" />
            <Text truncate style={{ flex: 1 }}>
              {client.description} - {client.fileNumberPart1}
              {client.drawerName ? ` (${client.drawerName})` : ''}
            </Text>
          </Group>
        ))}
      </Stack>
    </ScrollArea>
  );
}

export default ClientList;



