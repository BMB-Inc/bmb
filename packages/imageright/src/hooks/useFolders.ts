import { getFolders } from "@api/index";
import { useQuery } from "@tanstack/react-query";

interface UseFoldersParams {
  clientId?: number;
  parentFolderId?: number;
  folderTypes?: any;
  drawerType?: any;
}

export const useFolders = (params?: UseFoldersParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["folders", params?.clientId, params?.parentFolderId, params?.folderTypes, params?.drawerType],
    queryFn: () => getFolders(params?.clientId, params?.parentFolderId, params?.folderTypes, params?.drawerType),
    enabled: !!(params?.clientId || params?.parentFolderId || params?.folderTypes || params?.drawerType),
  });
  return { data, isLoading, error };
}