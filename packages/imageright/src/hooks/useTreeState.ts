import { useCallback, useMemo, useState } from 'react';
import { useTreeNavigation } from '@hooks/useTreeNavigation';
import type { ActivePage } from '../components/imageright-browser/types';

/**
 * V2 state hook: minimal app state for the tree browser.
 * - navigation is URL-persisted via useTreeNavigation
 * - activePage is local state (single source of truth for preview/highlight)
 */
export function useTreeState() {
  const nav = useTreeNavigation();
  const [activePage, setActivePage] = useState<ActivePage | null>(null);

  const onBackToClients = useCallback(() => {
    setActivePage(null);
    nav.navigateToClients();
  }, [nav]);

  const onClientRoot = useCallback(() => {
    nav.collapseAll();
    nav.selectDocument(null);
    setActivePage(null);
  }, [nav]);

  const onDocumentSelect = useCallback(
    (docId: number, parentFolderId: number) => {
      // switching docs resets active page
      if (nav.documentId !== docId) setActivePage(null);
      // selecting a document for preview should not toggle off
      nav.selectDocument(docId, parentFolderId);
    },
    [nav],
  );

  const value = useMemo(
    () => ({
      nav,
      activePage,
      setActivePage,
      onBackToClients,
      onClientRoot,
      onDocumentSelect,
    }),
    [nav, activePage, onBackToClients, onClientRoot, onDocumentSelect],
  );

  return value;
}

