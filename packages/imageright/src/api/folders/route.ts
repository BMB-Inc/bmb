import { fetcher } from "@api/fetcher";
import { type GetFoldersDto } from "@bmb-inc/types";

export const getFolders = async (params?: GetFoldersDto) => {
  const searchParams = new URLSearchParams();
  if (params?.clientId) {
    searchParams.append('clientId', params.clientId.toString());
  }
  if (params?.folderId) {
    searchParams.append('folderId', params.folderId.toString());
  }
  if (params?.folderTypes) {
    searchParams.append('folderTypes', params.folderTypes.toString());
  }
  
  const queryString = searchParams.toString();
  const url = queryString ? `/folders?${queryString}` : '/folders';
  const response = await fetcher(url);
  return response;
}