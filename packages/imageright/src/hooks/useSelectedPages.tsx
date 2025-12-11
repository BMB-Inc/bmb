import { createContext, useCallback, useContext, useMemo, useState, useRef } from 'react';

export type SelectedPage = {
  id: number;
  contentType: number | null;
  extension: string | null;
};

type PageMetadata = {
  contentType: number | null;
  extension: string | null;
};

type SelectedPagesContextValue = {
  /** Array of selected page IDs (for backwards compatibility) */
  selectedPageIds: number[];
  /** Array of selected pages with their content types and extensions */
  selectedPages: SelectedPage[];
  isSelected: (id: number) => boolean;
  toggleSelected: (id: number, metadata?: PageMetadata, value?: boolean) => void;
  clearSelected: () => void;
  selectMany: (pages: { id: number; contentType?: number | null; extension?: string | null }[]) => void;
  /** Handle click with modifier keys (shift/ctrl) for multi-select */
  handleSelectWithModifiers: (
    id: number,
    metadata: PageMetadata,
    visiblePages: { id: number; contentType: number | null; extension: string | null }[],
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
        next.set(id, metadata ?? { contentType: null, extension: null });
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const clearSelected = useCallback(() => {
    setSelected(new Map());
  }, []);

  const selectMany = useCallback((pages: { id: number; contentType?: number | null; extension?: string | null }[]) => {
    setSelected(prev => {
      const next = new Map(prev);
      for (const page of pages) {
        next.set(page.id, { contentType: page.contentType ?? null, extension: page.extension ?? null });
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
    visiblePages: { id: number; contentType: number | null; extension: string | null }[],
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
            next.set(page.id, { contentType: page.contentType, extension: page.extension });
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

  const value = useMemo<SelectedPagesContextValue>(() => ({
    selectedPageIds: Array.from(selected.keys()),
    selectedPages: Array.from(selected.entries()).map(([id, meta]) => ({ id, contentType: meta.contentType, extension: meta.extension })),
    isSelected,
    toggleSelected,
    clearSelected,
    selectMany,
    handleSelectWithModifiers,
    setLastSelectedId,
  }), [selected, isSelected, toggleSelected, clearSelected, selectMany, handleSelectWithModifiers, setLastSelectedId]);

  return (
    <SelectedPagesContext.Provider value={value}>{children}</SelectedPagesContext.Provider>
  );
}

export function useSelectedPages() {
  const ctx = useContext(SelectedPagesContext);
  if (!ctx) throw new Error('useSelectedPages must be used within a SelectedPagesProvider');
  return ctx;
}


