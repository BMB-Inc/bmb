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

  const navigateToClients = useCallback(() => {
    setQs({ clientId: null, documentId: null, expanded: null }, { history: 'push' });
  }, [setQs]);

  const navigateToClient = useCallback((id: number) => {
    setQs({ clientId: id, documentId: null, expanded: null }, { history: 'push' });
  }, [setQs]);

  const selectDocument = useCallback((id: number | null, parentFolderId?: number | null) => {
    setQs({ documentId: id, folderId: parentFolderId ?? null }, { history: 'replace' });
  }, [setQs]);

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
    setQs({ expanded: expandedStr }, { history: 'replace' });
  }, [expandedFolders, setQs]);

  const expandFolder = useCallback((folderId: number) => {
    if (expandedFolders.has(folderId)) return;
    const newExpanded = new Set(expandedFolders);
    newExpanded.add(folderId);
    const expandedStr = Array.from(newExpanded).join(',');
    setQs({ expanded: expandedStr }, { history: 'replace' });
  }, [expandedFolders, setQs]);

  const collapseAll = useCallback(() => {
    setQs({ expanded: null }, { history: 'replace' });
  }, [setQs]);

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

