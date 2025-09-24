import { getFolders } from "@api/index";
import { useQuery } from "@tanstack/react-query";

interface UseFoldersParams {
  clientId?: number;
  parentFolderId?: number;
}

export const useFolders = (params?: UseFoldersParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["folders", params?.clientId, params?.parentFolderId],
    queryFn: () => getFolders(params?.clientId, params?.parentFolderId),
    enabled: !!(params?.clientId || params?.parentFolderId),
  });
  return { data, isLoading, error };
}