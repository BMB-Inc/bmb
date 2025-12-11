import { fetcher } from "@api/fetcher";
import { DocumentTypes, type ImagerightDocumentParams } from "@bmb-inc/types";

export const getDocuments = async (params?: ImagerightDocumentParams, documentTypes?: DocumentTypes[]) => {
  if (!params) {
    return [];
  }
  
  const searchParams = new URLSearchParams();
  if (params.clientId) {
    searchParams.append('clientId', params.clientId.toString());
  }
  if (params.folderId) {
    searchParams.append('folderId', params.folderId.toString());
  }
  if (documentTypes?.length) {
    for (const documentType of documentTypes) {
      searchParams.append('documentTypes', documentType);
      searchParams.append('documentTypes', documentType);
    }
  }
  if (params.description) {
    searchParams.append('description', params.description);
  }
  
  const queryString = searchParams.toString();
  const url = queryString ? `/documents?${queryString}` : '/documents';
  const response = await fetcher(url);
  return response;
}

export const getDocumentById = async (id: number) => {
  const response = await fetcher(`/documents/${id}`);
  return response;
}
