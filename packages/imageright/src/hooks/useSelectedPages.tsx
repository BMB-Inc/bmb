import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type SelectedPagesContextValue = {
  selectedPageIds: number[];
  isSelected: (id: number) => boolean;
  toggleSelected: (id: number, value?: boolean) => void;
  clearSelected: () => void;
  selectMany: (ids: number[]) => void;
};

const SelectedPagesContext = createContext<SelectedPagesContextValue | undefined>(undefined);

export function SelectedPagesProvider({ children }: { children: React.ReactNode }) {
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

  const value = useMemo<SelectedPagesContextValue>(() => ({
    selectedPageIds: Array.from(selected),
    isSelected,
    toggleSelected,
    clearSelected,
    selectMany,
  }), [selected, isSelected, toggleSelected, clearSelected, selectMany]);

  return (
    <SelectedPagesContext.Provider value={value}>{children}</SelectedPagesContext.Provider>
  );
}

export function useSelectedPages() {
  const ctx = useContext(SelectedPagesContext);
  if (!ctx) throw new Error('useSelectedPages must be used within a SelectedPagesProvider');
  return ctx;
}


