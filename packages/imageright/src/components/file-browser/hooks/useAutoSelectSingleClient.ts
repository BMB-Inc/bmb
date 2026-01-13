import { useEffect } from 'react';

type UseAutoSelectSingleClientParams = {
  clients: any[] | undefined;
  clientsLoading: boolean;
  /**
   * Currently selected/expanded client id (if any). When falsy, and exactly one
   * client is returned, we auto-select it.
   */
  expandedClientId?: string | number | null;
  /** Navigation/select handler for a client id */
  navigateToClient: (id: string | number) => void;
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
        navigateToClient(only.id);
      }
    }
  }, [clients, clientsLoading, expandedClientId, navigateToClient]);
}
