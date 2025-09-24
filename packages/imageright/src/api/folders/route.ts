import { fetcher } from "@api/fetcher";
import { imagerightFoldersSchema, type ImagerightFoldersParams } from "@bmb-inc/types";

export const getFolders = async (params?: ImagerightFoldersParams) => {
  const searchParams = new URLSearchParams();
  if (params?.clientId) {
    searchParams.append('clientId', params.clientId.toString());
  }
  if (params?.parentFolderId) {
    searchParams.append('parentFolderId', params.parentFolderId.toString());
  }
  
  const queryString = searchParams.toString();
  const url = queryString ? `/folders?${queryString}` : '/folders';
  const response = await fetcher(url);
  return imagerightFoldersSchema.parse(response);
}