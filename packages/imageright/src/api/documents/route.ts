import { fetcher } from "@api/fetcher";

export const getDocuments = async (clientId?: number, parentId?: number) => {
  const response = fetcher(`/documents${clientId ? `?clientId=${clientId}` : ''}${parentId ? `&parentId=${parentId}` : ''}`);
  return response;
}

export const getDocumentById = async (id: number) => {
  const response = fetcher(`/documents/${id}`);
  return response;
}