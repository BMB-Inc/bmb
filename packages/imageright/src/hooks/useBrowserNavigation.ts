import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type BrowserNavState = {
  clientId: string | null;
  folderId: string | null;
  documentId: string | null;
  pageId: string | null;
};

export function useBrowserNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<BrowserNavState>({ clientId: null, folderId: null, documentId: null, pageId: null });

  // derive state from URL
  useEffect(() => {
    const clientId = searchParams.get('clientId');
    const folderId = searchParams.get('folderId');
    const documentId = searchParams.get('documentId');
    const pageId = searchParams.get('pageId');
    setState({ clientId: clientId ?? null, folderId: folderId ?? null, documentId: documentId ?? null, pageId: pageId ?? null });
  }, [searchParams]);

  const currentFolderId = useMemo(() => state.folderId, [state.folderId]);

  const navigateToClients = useCallback(() => {
    setState({ clientId: null, folderId: null, documentId: null, pageId: null });
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.delete('clientId');
      params.delete('folderId');
      params.delete('documentId');
      params.delete('pageId');
      return params;
    }, { replace: false });
  }, [setSearchParams]);

  const navigateToClient = useCallback((clientId: string) => {
    setState({ clientId, folderId: null, documentId: null, pageId: null });
    const params = new URLSearchParams(searchParams);
    // Preserve existing search keys (e.g., clientCode/clientName), update clientId
    params.set('clientId', clientId);
    params.delete('folderId');
    params.delete('documentId');
    params.delete('pageId');
    setSearchParams(params, { replace: false });
  }, [searchParams, setSearchParams]);

  const navigateToClientRoot = useCallback(() => {
    if (!state.clientId) return;
    setState(prev => ({ ...prev, folderId: null, documentId: null, pageId: null }));
    const params = new URLSearchParams(searchParams);
    params.set('clientId', state.clientId);
    params.delete('folderId');
    params.delete('documentId');
    params.delete('pageId');
    setSearchParams(params, { replace: false });
  }, [state.clientId, searchParams, setSearchParams]);

  const navigateIntoFolder = useCallback((folderId: string) => {
    setState(prev => ({ ...prev, folderId, documentId: null, pageId: null }));
    const params = new URLSearchParams(searchParams);
    if (state.clientId) params.set('clientId', state.clientId);
    params.set('folderId', folderId);
    params.delete('documentId');
    params.delete('pageId');
    setSearchParams(params, { replace: false });
  }, [searchParams, setSearchParams, state.clientId]);

  const navigateToDocument = useCallback((documentId: string) => {
    setState(prev => ({ ...prev, documentId, pageId: null }));
    const params = new URLSearchParams(searchParams);
    if (state.clientId) params.set('clientId', state.clientId);
    if (state.folderId) params.set('folderId', state.folderId);
    params.set('documentId', documentId);
    params.delete('pageId');
    setSearchParams(params, { replace: false });
  }, [searchParams, setSearchParams, state.clientId, state.folderId]);

  const clearNavigation = useCallback(() => {
    setState(prev => ({ ...prev, clientId: null, folderId: null, documentId: null, pageId: null }));
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.delete('clientId');
      params.delete('folderId');
      params.delete('documentId');
      params.delete('pageId');
      return params;
    }, { replace: false });
  }, [setSearchParams]);

  const navigateToPage = useCallback((pageId: string) => {
    setState(prev => ({ ...prev, pageId }));
    const params = new URLSearchParams(searchParams);
    if (state.clientId) params.set('clientId', state.clientId);
    if (state.folderId) params.set('folderId', state.folderId);
    if (state.documentId) params.set('documentId', state.documentId);
    params.set('pageId', pageId);
    setSearchParams(params, { replace: false });
  }, [searchParams, setSearchParams, state.clientId, state.folderId, state.documentId]);

  return {
    clientId: state.clientId,
    folderId: state.folderId,
    documentId: state.documentId,
    pageId: state.pageId,
    currentFolderId,
    navigateToClients,
    navigateToClient,
    navigateToClientRoot,
    navigateIntoFolder,
    navigateToDocument,
    clearNavigation,
    navigateToPage,
  } as const;
}

export default useBrowserNavigation;


