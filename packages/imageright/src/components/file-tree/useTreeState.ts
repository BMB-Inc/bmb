import { useState, useCallback } from 'react';

export type TreeNodeState = {
  id: number;
  kind: 'folder' | 'document';
  label: string;
  type: string;
  parentFolderId?: number | null;
  folderTypeId?: number;
  documentTypeId?: number;
};

type UseTreeStateReturn = {
  expandedFolders: Set<number>;
  toggleFolder: (folderId: number) => void;
  expandFolder: (folderId: number) => void;
  collapseFolder: (folderId: number) => void;
  isExpanded: (folderId: number) => boolean;
  collapseAll: () => void;
};

export function useTreeState(): UseTreeStateReturn {
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  const toggleFolder = useCallback((folderId: number) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const expandFolder = useCallback((folderId: number) => {
    setExpandedFolders((prev) => {
      if (prev.has(folderId)) return prev;
      const next = new Set(prev);
      next.add(folderId);
      return next;
    });
  }, []);

  const collapseFolder = useCallback((folderId: number) => {
    setExpandedFolders((prev) => {
      if (!prev.has(folderId)) return prev;
      const next = new Set(prev);
      next.delete(folderId);
      return next;
    });
  }, []);

  const isExpanded = useCallback(
    (folderId: number) => expandedFolders.has(folderId),
    [expandedFolders]
  );

  const collapseAll = useCallback(() => {
    setExpandedFolders(new Set());
  }, []);

  return {
    expandedFolders,
    toggleFolder,
    expandFolder,
    collapseFolder,
    isExpanded,
    collapseAll,
  };
}

