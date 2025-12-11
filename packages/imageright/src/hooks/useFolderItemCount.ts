import { useEffect, useState } from "react";
import { getFolders, getDocuments } from "@api/index";
import { FolderTypes, DocumentTypes } from "@bmb-inc/types";

type FolderItemCountParams = {
  clientId: number;
  folderId: number;
  folderTypes?: FolderTypes[] | null;
  documentTypes?: DocumentTypes[];
};

type FolderItemCount = {
  folderCount: number;
  documentCount: number;
  totalCount: number;
};

/**
 * Hook to fetch the count of folders and documents within a given folder
 */
export const useFolderItemCount = (params?: FolderItemCountParams) => {
  const [data, setData] = useState<FolderItemCount | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!(params?.clientId && params?.folderId);

  useEffect(() => {
    let cancelled = false;
    if (!enabled || !params) {
      setData(undefined);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Fetch both folders and documents in parallel
    Promise.all([
      getFolders({
        clientId: params.clientId,
        folderId: params.folderId,
        folderTypes: params.folderTypes ?? undefined,
      }),
      getDocuments(
        { clientId: params.clientId, folderId: params.folderId },
        params.documentTypes
      ),
    ])
      .then(([folders, documents]) => {
        if (!cancelled) {
          const folderCount = folders?.length ?? 0;
          const documentCount = documents?.length ?? 0;
          setData({
            folderCount,
            documentCount,
            totalCount: folderCount + documentCount,
          });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    params?.clientId,
    params?.folderId,
    JSON.stringify(params?.folderTypes ?? null),
    JSON.stringify(params?.documentTypes ?? null),
  ]);

  return { data, isLoading, error } as const;
};

