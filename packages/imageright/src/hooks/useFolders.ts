import { useEffect, useState } from "react";
import { getFolders } from "@api/index";
import { FolderTypes, type GetFoldersDto } from '@bmb-inc/types';

export const useFolders = (params?: GetFoldersDto) => {
  const [data, setData] = useState<Awaited<ReturnType<typeof getFolders>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  console.log('params', params);

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
  }, [params?.clientId, params?.folderId]);

  return { data, isLoading, error } as const;
}

export const usePolicyFolders = (params?: GetFoldersDto) => {
  const [data, setData] = useState<Awaited<ReturnType<typeof getFolders>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!(params?.clientId || params?.folderId);
  const effectiveParams = { ...params, folderTypes: FolderTypes.policies } as GetFoldersDto;

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
  }, [params?.clientId, params?.folderId]);

  return { data, isLoading, error } as const;
}