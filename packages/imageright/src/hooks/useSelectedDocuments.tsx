import { createContext, useCallback, useContext, useMemo, useState, useRef } from 'react';

type SelectedDocumentsContextValue = {
  selectedDocumentIds: number[];
  isSelected: (id: number) => boolean;
  toggleSelected: (id: number, value?: boolean) => void;
  clearSelected: () => void;
  selectMany: (ids: number[]) => void;
  /** Handle click with modifier keys (shift/ctrl) for multi-select */
  handleSelectWithModifiers: (
    id: number,
    visibleIds: number[],
    event: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }
  ) => void;
  /** Set the anchor point for shift-select (called on regular click) */
  setLastSelectedId: (id: number) => void;
};

const SelectedDocumentsContext = createContext<SelectedDocumentsContextValue | undefined>(undefined);

export function SelectedDocumentsProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const lastSelectedIdRef = useRef<number | null>(null);

  const isSelected = useCallback((id: number) => selected.has(id), [selected]);

  const toggleSelected = useCallback((id: number, value?: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      const shouldSelect = value ?? !next.has(id);
      if (shouldSelect) next.add(id); else next.delete(id);
      return next;
    });
  }, []);

  const clearSelected = useCallback(() => {
    setSelected(new Set());
  }, []);

  const selectMany = useCallback((ids: number[]) => {
    setSelected(prev => {
      const next = new Set(prev);
      for (const id of ids) next.add(id);
      return next;
    });
  }, []);

  const setLastSelectedId = useCallback((id: number) => {
    lastSelectedIdRef.current = id;
  }, []);

  const handleSelectWithModifiers = useCallback((
    id: number,
    visibleIds: number[],
    event: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }
  ) => {
    const { shiftKey, ctrlKey, metaKey } = event;
    const isCtrlOrCmd = ctrlKey || metaKey;

    if (shiftKey && lastSelectedIdRef.current !== null) {
      // Shift+click: select range from last selected to current
      const lastIdx = visibleIds.indexOf(lastSelectedIdRef.current);
      const currentIdx = visibleIds.indexOf(id);
      
      if (lastIdx !== -1 && currentIdx !== -1) {
        const startIdx = Math.min(lastIdx, currentIdx);
        const endIdx = Math.max(lastIdx, currentIdx);
        const rangeIds = visibleIds.slice(startIdx, endIdx + 1);
        
        setSelected(prev => {
          const next = new Set(prev);
          for (const rangeId of rangeIds) {
            next.add(rangeId);
          }
          return next;
        });
      }
    } else if (isCtrlOrCmd) {
      // Ctrl/Cmd+click: toggle individual selection
      setSelected(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
      lastSelectedIdRef.current = id;
    } else {
      // Regular click: clear selection and select only this one
      setSelected(new Set([id]));
      lastSelectedIdRef.current = id;
    }
  }, []);

  const value = useMemo<SelectedDocumentsContextValue>(() => ({
    selectedDocumentIds: Array.from(selected),
    isSelected,
    toggleSelected,
    clearSelected,
    selectMany,
    handleSelectWithModifiers,
    setLastSelectedId,
  }), [selected, isSelected, toggleSelected, clearSelected, selectMany, handleSelectWithModifiers, setLastSelectedId]);

  return (
    <SelectedDocumentsContext.Provider value={value}>{children}</SelectedDocumentsContext.Provider>
  );
}

export function useSelectedDocuments() {
  const ctx = useContext(SelectedDocumentsContext);
  if (!ctx) throw new Error('useSelectedDocuments must be used within a SelectedDocumentsProvider');
  return ctx;
}


