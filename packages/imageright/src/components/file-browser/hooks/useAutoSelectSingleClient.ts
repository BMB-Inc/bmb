import { useEffect } from 'react';

type UseAutoSelectSingleClientParams = {
  clients: any[] | undefined;
  clientsLoading: boolean;
  expandedClientId?: string | null;
  navigateToClient: (id: string) => void;
};

export function useAutoSelectSingleClient({
  clients,
  clientsLoading,
  expandedClientId,
  navigateToClient,
}: UseAutoSelectSingleClientParams) {
  useEffect(() => {
    if (!clientsLoading && !expandedClientId && Array.isArray(clients) && clients.length === 1) {
      const only = clients[0] as any;
      if (only?.id != null) {
        navigateToClient(String(only.id));
      }
    }
  }, [clients, clientsLoading, expandedClientId, navigateToClient]);
}
