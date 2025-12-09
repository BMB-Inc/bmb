import { useMemo } from 'react';

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
  return useMemo(() => {
    const map: Record<string, string> = {};
    if (Array.isArray(folders)) {
      for (const f of folders as any[]) {
        const label = f?.description || (f?.id != null ? `Folder ${f.id}` : 'Folder');
        if (f?.id != null) {
          map[String(f.id)] = label;
        }
      }
    }
    return map;
  }, [folders]);
}
