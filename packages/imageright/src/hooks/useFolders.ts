import { getFolders } from "@api/index";
import { useQuery } from "@tanstack/react-query";
import { FolderTypes, type GetFoldersDto } from '@bmb-inc/types';

export const useFolders = (params?: GetFoldersDto) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["folders", params?.clientId, params?.folderId],
    queryFn: () => getFolders(params),
    enabled: !!(params?.clientId || params?.folderId),
  });
  return { data, isLoading, error };
}

export const usePolicyFolders = (params?: GetFoldersDto) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["policyFolders", params?.clientId, params?.folderId],
    queryFn: () => getFolders({ ...params, folderTypes: FolderTypes.policies } as GetFoldersDto),
    enabled: !!(params?.clientId || params?.folderId),
  });
  return { data, isLoading, error };
}