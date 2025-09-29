import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type BrowserNavState = {
  clientId: string | null;
  folderId: string | null;
};

export function useBrowserNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<BrowserNavState>({ clientId: null, folderId: null });

  // derive state from URL
  useEffect(() => {
    const clientId = searchParams.get('clientId');
    const folderId = searchParams.get('folderId');
    setState({ clientId: clientId ?? null, folderId: folderId ?? null });
  }, [searchParams]);

  const currentFolderId = useMemo(() => state.folderId, [state.folderId]);

  const navigateToClients = useCallback(() => {
    setState({ clientId: null, folderId: null });
    setSearchParams({}, { replace: false });
  }, [setSearchParams]);

  const navigateToClient = useCallback((clientId: string) => {
    setState({ clientId, folderId: null });
    setSearchParams({ clientId }, { replace: false });
  }, [setSearchParams]);

  const navigateToClientRoot = useCallback(() => {
    if (!state.clientId) return;
    setState(prev => ({ ...prev, folderId: null }));
    const params = new URLSearchParams(searchParams);
    params.set('clientId', state.clientId);
    params.delete('folderId');
    setSearchParams(params, { replace: false });
  }, [state.clientId, searchParams, setSearchParams]);

  const navigateIntoFolder = useCallback((folderId: string) => {
    setState(prev => ({ ...prev, folderId }));
    const params = new URLSearchParams(searchParams);
    if (state.clientId) params.set('clientId', state.clientId);
    params.set('folderId', folderId);
    setSearchParams(params, { replace: false });
  }, [searchParams, setSearchParams, state.clientId]);

  return {
    clientId: state.clientId,
    folderId: state.folderId,
    currentFolderId,
    navigateToClients,
    navigateToClient,
    navigateToClientRoot,
    navigateIntoFolder,
  } as const;
}

export default useBrowserNavigation;


