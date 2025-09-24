import { getFolders } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export const useFolders = (clientId?: number, parentFolderId?: number, folderTypes?: any, drawerType?: any) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["folders", clientId, parentFolderId, folderTypes, drawerType],
    queryFn: () => getFolders(clientId, parentFolderId, folderTypes, drawerType),
  });
  return { data, isLoading, error };
}