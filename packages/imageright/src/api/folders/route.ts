import { fetcher } from "@api/fetcher";

export const getFolders = async (clientId?: number, folderId?: number) => {
  const response = await fetcher(`/folders${clientId ? `?clientId=${clientId}` : ''}${folderId ? `&folderId=${folderId}` : ''}`);
  return response;
}