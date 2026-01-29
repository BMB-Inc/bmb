import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';
import { useCallback } from 'react';

/**
 * URL-persisted navigation state for the tree file browser.
 * Simpler than useBrowserNavigation - only stores essential state.
 */
export function useTreeNavigation() {
  const [{ clientId, documentId, folderId, expanded }, setQs] = useQueryStates({
    clientId: parseAsInteger,
    documentId: parseAsInteger,
    folderId: parseAsInteger,
    // Store expanded folder IDs as comma-separated string
    expanded: parseAsString,
  });
  // Parse expanded folders from URL
  const expandedFolders = new Set<number>(
    expanded
      ? expanded.split(',').map(Number).filter(n => !isNaN(n))
      : []
  );

  const setQsIfChanged = useCallback((next: { clientId?: number | null; documentId?: number | null; folderId?: number | null; expanded?: string | null }, options: { history: 'push' | 'replace' }) => {
    let changed = false;
    if ('clientId' in next && next.clientId !== clientId) changed = true;
    if ('documentId' in next && next.documentId !== documentId) changed = true;
    if ('folderId' in next && next.folderId !== folderId) changed = true;
    if ('expanded' in next && next.expanded !== expanded) changed = true;
    if (changed) {
      setQs(next, options);
    }
  }, [clientId, documentId, folderId, expanded, setQs]);

  const navigateToClients = useCallback(() => {
    setQsIfChanged({ clientId: null, documentId: null, expanded: null }, { history: 'push' });
  }, [setQsIfChanged]);

  const navigateToClient = useCallback((id: number) => {
    setQsIfChanged({ clientId: id, documentId: null, expanded: null }, { history: 'push' });
  }, [setQsIfChanged]);

  const selectDocument = useCallback((id: number | null, parentFolderId?: number | null) => {
    setQsIfChanged({ documentId: id, folderId: parentFolderId ?? null }, { history: 'replace' });
  }, [setQsIfChanged]);

  const toggleFolder = useCallback((folderId: number) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    const expandedStr = newExpanded.size > 0 
      ? Array.from(newExpanded).join(',') 
      : null;
    setQsIfChanged({ expanded: expandedStr }, { history: 'replace' });
  }, [expandedFolders, setQsIfChanged]);

  const expandFolder = useCallback((folderId: number) => {
    if (expandedFolders.has(folderId)) return;
    const newExpanded = new Set(expandedFolders);
    newExpanded.add(folderId);
    const expandedStr = Array.from(newExpanded).join(',');
    setQsIfChanged({ expanded: expandedStr }, { history: 'replace' });
  }, [expandedFolders, setQsIfChanged]);

  const collapseAll = useCallback(() => {
    setQsIfChanged({ expanded: null }, { history: 'replace' });
  }, [setQsIfChanged]);

  return {
    clientId,
    documentId,
    folderId,
    expandedFolders,
    navigateToClients,
    navigateToClient,
    selectDocument,
    toggleFolder,
    expandFolder,
    collapseAll,
  } as const;
}

