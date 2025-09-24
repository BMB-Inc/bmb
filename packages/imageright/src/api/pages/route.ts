import { fetcher } from "@api/fetcher";

export const getPages = async (documentId?: number) => {
  const response = fetcher(`/pages${documentId ? `?documentId=${documentId}` : ''}`);
  return response;
}