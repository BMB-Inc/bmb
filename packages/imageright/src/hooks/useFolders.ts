import { useEffect, useState } from "react";
import { getFolders } from "@api/index";
import { FolderTypes } from "@bmb-inc/types";
import { useImageRightConfig } from "../context/ImageRightContext";

type FoldersQueryParams = {
  clientId?: number;
  folderId?: number | null;
  folderTypes?: FolderTypes[] | null;
};

export const useFolders = (params?: FoldersQueryParams) => {
  const { baseUrl } = useImageRightConfig();
  const [data, setData] = useState<Awaited<ReturnType<typeof getFolders>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!(params?.clientId || params?.folderId);

  useEffect(() => {
    let cancelled = false;
    if (!enabled) {
      setData(undefined);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getFolders(params, baseUrl)
      .then((res) => {
        if (!cancelled) {
          // At root level (no folderId), only show root folders (parentFolderId is null)
          // Inside a folder, show all folders (they're already scoped to that folder)
          const filtered = params?.folderId
            ? res
            : res?.filter((folder: any) => folder.parentFolderId == null);
          setData(filtered);
        }
      })
      .catch((err: unknown) => { if (!cancelled) setError(err as Error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [params?.clientId, params?.folderId, JSON.stringify(params?.folderTypes ?? null), baseUrl]);

  return { data, isLoading, error } as const;
}

export const usePolicyFolders = (params?: FoldersQueryParams) => {
  const { baseUrl } = useImageRightConfig();
  const [data, setData] = useState<Awaited<ReturnType<typeof getFolders>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!(params?.clientId || params?.folderId);
  const effectiveParams: FoldersQueryParams = { ...params, folderTypes: [FolderTypes.policies] };

  useEffect(() => {
    let cancelled = false;
    if (!enabled) {
      setData(undefined);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getFolders(effectiveParams, baseUrl)
      .then((res) => {
        if (!cancelled) {
          // At root level (no folderId), only show root folders (parentFolderId is null)
          // Inside a folder, show all folders (they're already scoped to that folder)
          const filtered = params?.folderId
            ? res
            : res?.filter((folder: any) => folder.parentFolderId == null);
          setData(filtered);
        }
      })
      .catch((err: unknown) => { if (!cancelled) setError(err as Error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [params?.clientId, params?.folderId, JSON.stringify(params?.folderTypes ?? null), baseUrl]);

  return { data, isLoading, error } as const;
}
