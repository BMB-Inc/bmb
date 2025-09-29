import { Stack } from '@mantine/core';
import { ClientCard } from './ClientCard';
import type { ImagerightClient } from '@bmb-inc/types';

type ClientListProps = {
  clients: ImagerightClient[];
  onSelect: (clientId: string, label: string) => void;
};

export function ClientList({ clients, onSelect }: ClientListProps) {
  return (
    <Stack>
      {clients.map((client) => {
        const label = `${client.description} - ${client.fileNumberPart1} ${client.drawerName ? `(${client.drawerName})` : ''}`;
        return (
          <div key={`client-${client.id}`}>
            <ClientCard
              label={label}
              expanded={false}
              onSelect={() => onSelect(client.id.toString(), label)}
            />
          </div>
        );
      })}
    </Stack>
  );
}

export default ClientList;


