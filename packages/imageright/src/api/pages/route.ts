import { fetcher } from "@api/fetcher";

export const getPages = async (documentId?: number) => {
  const response = await fetcher(`/pages${documentId ? `?documentId=${documentId}` : ''}`);
  return response;
}