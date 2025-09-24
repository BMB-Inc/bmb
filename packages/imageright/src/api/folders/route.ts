import { fetcher } from "@api/fetcher";

export const getFolders = async (clientId?: number, parentFolderId?: number, folderTypes?: any, drawerType?: any) => {
  const response = fetcher(`/folders${clientId ? `?clientId=${clientId}` : ''}${parentFolderId ? `&parentFolderId=${parentFolderId}` : ''}${folderTypes ? `&folderTypes=${folderTypes}` : ''}${drawerType ? `&drawerType=${drawerType}` : ''}`);
  return response;
}