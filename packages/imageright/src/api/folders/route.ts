import { fetcher } from "@api/fetcher";

type FoldersQueryParams = {
  clientId?: number;
  folderId?: number | null;
  folderTypes?: string | string[] | null;
};

export const getFolders = async (params?: FoldersQueryParams) => {
  const searchParams = new URLSearchParams();
  if (params?.clientId) {
    searchParams.append('clientId', params.clientId.toString());
  }
  if (params?.folderId) {
    searchParams.append('folderId', params.folderId.toString());
  }
  if (params?.folderTypes) {
    const value = Array.isArray(params.folderTypes)
      ? params.folderTypes.join(',')
      : params.folderTypes;
    searchParams.append('folderTypes', value);
  }
  
  const queryString = searchParams.toString();
  const url = queryString ? `/folders?${queryString}` : '/folders';
  const response = await fetcher(url);
  return response;
}