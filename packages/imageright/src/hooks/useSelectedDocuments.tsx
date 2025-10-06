import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type SelectedDocumentsContextValue = {
  selectedDocumentIds: number[];
  isSelected: (id: number) => boolean;
  toggleSelected: (id: number, value?: boolean) => void;
  clearSelected: () => void;
  selectMany: (ids: number[]) => void;
};

const SelectedDocumentsContext = createContext<SelectedDocumentsContextValue | undefined>(undefined);

export function SelectedDocumentsProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

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

  const value = useMemo<SelectedDocumentsContextValue>(() => ({
    selectedDocumentIds: Array.from(selected),
    isSelected,
    toggleSelected,
    clearSelected,
    selectMany,
  }), [selected, isSelected, toggleSelected, clearSelected, selectMany]);

  return (
    <SelectedDocumentsContext.Provider value={value}>{children}</SelectedDocumentsContext.Provider>
  );
}

export function useSelectedDocuments() {
  const ctx = useContext(SelectedDocumentsContext);
  if (!ctx) throw new Error('useSelectedDocuments must be used within a SelectedDocumentsProvider');
  return ctx;
}


