import { useEffect, useState } from "react";
import { getFolders } from "@api/index";
import { FolderTypes } from "../../../types/src/imageright/folders/get-folders.dto";
type FoldersQueryParams = {
  clientId?: number;
  folderId?: number | null;
  folderTypes?: FolderTypes[] | null;
};

export const useFolders = (params?: FoldersQueryParams) => {
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
    getFolders(params)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err: unknown) => { if (!cancelled) setError(err as Error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [params?.clientId, params?.folderId, JSON.stringify(params?.folderTypes ?? null)]);

  return { data, isLoading, error } as const;
}

export const usePolicyFolders = (params?: FoldersQueryParams) => {
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
    getFolders(effectiveParams)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err: unknown) => { if (!cancelled) setError(err as Error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [params?.clientId, params?.folderId, JSON.stringify(params?.folderTypes ?? null)]);

  return { data, isLoading, error } as const;
}