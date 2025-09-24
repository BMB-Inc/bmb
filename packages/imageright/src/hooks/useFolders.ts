import { getFolders } from "@api/index";
import { useQuery } from "@tanstack/react-query";
import { type ImagerightFoldersParams } from "@bmb-inc/types";

export const useFolders = (params?: ImagerightFoldersParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["folders", params?.clientId, params?.parentFolderId],
    queryFn: () => getFolders(params),
    enabled: !!(params?.clientId || params?.parentFolderId),
  });
  return { data, isLoading, error };
}

export const usePolicyFolders = (params?: ImagerightFoldersParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["policyFolders", params?.clientId, params?.parentFolderId],
    queryFn: () => getFolders(params),
    enabled: !!(params?.clientId || params?.parentFolderId),
  });
  return { data, isLoading, error };
}