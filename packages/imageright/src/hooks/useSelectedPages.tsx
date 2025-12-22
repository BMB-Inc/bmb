import { createContext, useCallback, useContext, useMemo, useState, useRef } from 'react';

export type SelectedPage = {
  id: number;
  documentId: number;
  folderId: number | null;
  imageId: number | null;
  contentType: number | null;
  extension: string | null;
};

type PageMetadata = {
  documentId: number;
  folderId: number | null;
  imageId: number | null;
  contentType: number | null;
  extension: string | null;
};

/** Pages grouped by document - allows importing pages from different document types together */
export type SelectedPagesByDocument = {
  documentId: number;
  folderId: number | null;
  pages: SelectedPage[];
};

type SelectedPagesContextValue = {
  /** Array of selected page IDs (for backwards compatibility) */
  selectedPageIds: number[];
  /** Array of selected pages with their content types and extensions */
  selectedPages: SelectedPage[];
  /** Pages grouped by document - allows importing pages from different document types together */
  selectedPagesByDocument: SelectedPagesByDocument[];
  isSelected: (id: number) => boolean;
  toggleSelected: (id: number, metadata?: PageMetadata, value?: boolean) => void;
  clearSelected: () => void;
  /** Deselect all pages belonging to a specific document */
  deselectPagesForDocument: (documentId: number) => void;
  selectMany: (pages: { id: number; documentId: number; folderId?: number | null; imageId?: number | null; contentType?: number | null; extension?: string | null }[]) => void;
  /** Handle click with modifier keys (shift/ctrl) for multi-select */
  handleSelectWithModifiers: (
    id: number,
    metadata: PageMetadata,
    visiblePages: { id: number; documentId: number; folderId: number | null; imageId: number | null; contentType: number | null; extension: string | null }[],
    event: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }
  ) => void;
  /** Set the anchor point for shift-select (called on regular click) */
  setLastSelectedId: (id: number) => void;
};

const SelectedPagesContext = createContext<SelectedPagesContextValue | undefined>(undefined);

export function SelectedPagesProvider({ children }: { children: React.ReactNode }) {
  // Map<pageId, { contentType, extension }>
  const [selected, setSelected] = useState<Map<number, PageMetadata>>(new Map());
  const lastSelectedIdRef = useRef<number | null>(null);

  const isSelected = useCallback((id: number) => selected.has(id), [selected]);

  const toggleSelected = useCallback((id: number, metadata?: PageMetadata, value?: boolean) => {
    setSelected(prev => {
      const next = new Map(prev);
      const shouldSelect = value ?? !next.has(id);
      if (shouldSelect) {
        // Only require documentId when selecting
        if (!metadata?.documentId) {
          console.warn('toggleSelected called without documentId - page selection requires documentId');
          return prev;
        }
        next.set(id, metadata);
      } else {
        // When deselecting, just remove the page
        next.delete(id);
      }
      return next;
    });
  }, []);

  const clearSelected = useCallback(() => {
    setSelected(new Map());
  }, []);

  const deselectPagesForDocument = useCallback((documentId: number) => {
    setSelected(prev => {
      const next = new Map(prev);
      // Remove all pages that belong to this document
      for (const [pageId, meta] of prev.entries()) {
        if (meta.documentId === documentId) {
          next.delete(pageId);
        }
      }
      return next;
    });
  }, []);

  const selectMany = useCallback((pages: { id: number; documentId: number; folderId?: number | null; imageId?: number | null; contentType?: number | null; extension?: string | null }[]) => {
    setSelected(prev => {
      const next = new Map(prev);
      for (const page of pages) {
        next.set(page.id, { documentId: page.documentId, folderId: page.folderId ?? null, imageId: page.imageId ?? null, contentType: page.contentType ?? null, extension: page.extension ?? null });
      }
      return next;
    });
  }, []);

  const setLastSelectedId = useCallback((id: number) => {
    lastSelectedIdRef.current = id;
  }, []);

  const handleSelectWithModifiers = useCallback((
    id: number,
    metadata: PageMetadata,
    visiblePages: { id: number; documentId: number; folderId: number | null; imageId: number | null; contentType: number | null; extension: string | null }[],
    event: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }
  ) => {
    const { shiftKey, ctrlKey, metaKey } = event;
    const isCtrlOrCmd = ctrlKey || metaKey;
    const visibleIds = visiblePages.map(p => p.id);

    if (shiftKey && lastSelectedIdRef.current !== null) {
      // Shift+click: select range from last selected to current
      const lastIdx = visibleIds.indexOf(lastSelectedIdRef.current);
      const currentIdx = visibleIds.indexOf(id);
      
      if (lastIdx !== -1 && currentIdx !== -1) {
        const startIdx = Math.min(lastIdx, currentIdx);
        const endIdx = Math.max(lastIdx, currentIdx);
        const rangePages = visiblePages.slice(startIdx, endIdx + 1);
        
        setSelected(prev => {
          const next = new Map(prev);
          for (const page of rangePages) {
            next.set(page.id, { documentId: page.documentId, folderId: page.folderId, imageId: page.imageId, contentType: page.contentType, extension: page.extension });
          }
          return next;
        });
      }
    } else if (isCtrlOrCmd) {
      // Ctrl/Cmd+click: toggle individual selection
      setSelected(prev => {
        const next = new Map(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.set(id, metadata);
        }
        return next;
      });
      lastSelectedIdRef.current = id;
    } else {
      // Regular click: clear selection and select only this one
      setSelected(new Map([[id, metadata]]));
      lastSelectedIdRef.current = id;
    }
  }, []);

  const value = useMemo<SelectedPagesContextValue>(() => {
    const allSelectedPages = Array.from(selected.entries()).map(([id, meta]) => ({ 
      id, 
      documentId: meta.documentId,
      folderId: meta.folderId,
      imageId: meta.imageId, 
      contentType: meta.contentType, 
      extension: meta.extension 
    }));
    
    // Group pages by document for easier import handling
    // Use a composite key of documentId + folderId to handle same document in different folders
    const pagesByDocMap = new Map<string, { documentId: number; folderId: number | null; pages: SelectedPage[] }>();
    for (const page of allSelectedPages) {
      const key = `${page.documentId}-${page.folderId ?? 'null'}`;
      const existing = pagesByDocMap.get(key);
      if (existing) {
        existing.pages.push(page);
      } else {
        pagesByDocMap.set(key, { documentId: page.documentId, folderId: page.folderId, pages: [page] });
      }
    }
    
    const selectedPagesByDocument: SelectedPagesByDocument[] = Array.from(pagesByDocMap.values())
      .map(({ documentId, folderId, pages }) => ({ documentId, folderId, pages }));

    return {
      selectedPageIds: Array.from(selected.keys()),
      selectedPages: allSelectedPages,
      selectedPagesByDocument,
      isSelected,
      toggleSelected,
      clearSelected,
      deselectPagesForDocument,
      selectMany,
      handleSelectWithModifiers,
      setLastSelectedId,
    };
  }, [selected, isSelected, toggleSelected, clearSelected, deselectPagesForDocument, selectMany, handleSelectWithModifiers, setLastSelectedId]);

  return (
    <SelectedPagesContext.Provider value={value}>{children}</SelectedPagesContext.Provider>
  );
}

export function useSelectedPages() {
  const ctx = useContext(SelectedPagesContext);
  if (!ctx) throw new Error('useSelectedPages must be used within a SelectedPagesProvider');
  return ctx;
}


