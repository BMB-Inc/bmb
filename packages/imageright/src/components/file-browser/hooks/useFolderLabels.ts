import { useEffect, useMemo, useState } from 'react';

export function useFolderLabelFromDocs(documents: any[] | undefined) {
  return useMemo(() => {
    if (Array.isArray(documents) && documents.length > 0) {
      const firstDoc: any = documents[0];
      const firstFolder = firstDoc?.folder;
      if (firstFolder?.description) return String(firstFolder.description);
    }
    return undefined;
  }, [documents]);
}

export function useFolderLabelMap(folders: any[] | undefined) {
  const [folderLabelMap, setFolderLabelMap] = useState<Record<string, string>>({});
  useEffect(() => {
    if (folders && folders.length) {
      setFolderLabelMap(prev => {
        const next = { ...prev };
        for (const f of folders as any[]) {
          const label = f.description || `Folder ${f.id}`;
          next[String(f.id)] = label;
        }
        return next;
      });
    }
  }, [folders]);
  return folderLabelMap;
}
