import { useMemo } from 'react';
import type { ImagerightClient } from '@bmb-inc/types';

export function useClientLabel(clients: ImagerightClient[], selectedClientId: number | null) {
  return useMemo(() => {
    if (!selectedClientId) return undefined;
    const selectedClient = clients.find((c) => c.id === selectedClientId);
    if (!selectedClient) return undefined;
    return `${selectedClient.description} - ${selectedClient.fileNumberPart1} ${selectedClient.drawerName ? `(${selectedClient.drawerName})` : ''}`;
  }, [clients, selectedClientId]);
}
