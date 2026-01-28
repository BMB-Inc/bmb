import { fetcher } from "@api/fetcher";
import { DocumentTypes, FindDocFoldersDto, GetDocumentsDto, ImagerightDocFolderWithRelations } from "@bmb-inc/types";

export const getDocuments = async (params?: GetDocumentsDto, documentTypes?: DocumentTypes[], baseUrl?: string) => {
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
    }
  }
  if (params.description) {
    searchParams.append('description', params.description);
  }
  
  const queryString = searchParams.toString();
  const url = queryString ? `/documents?${queryString}` : '/documents';
  const response = await fetcher(url, baseUrl);
  return response;
}

export const getDocumentById = async (id: number, baseUrl?: string) => {
  const response = await fetcher(`/documents/${id}`, baseUrl);
  return response;
}

export const searchDocumentsByName = async (params: FindDocFoldersDto, baseUrl?: string) => {
  const searchParams = new URLSearchParams();
  if (params.description) {
    searchParams.append('description', params.description);
  }
  if (params.limit) {
    searchParams.append('limit', params.limit.toString());
  }
  if (params.offset) {
    searchParams.append('offset', params.offset.toString());
  }
  if (params.drawerId) {
    searchParams.append('drawerId', params.drawerId.toString());
  }
  if (params.fileId) {
    searchParams.append('fileId', params.fileId.toString());
  }
  if (params.parentId) {
    searchParams.append('parentId', params.parentId.toString());
  }
  const queryString = searchParams.toString();
  const url = queryString ? `/docfolders/search?${queryString}` : '/docfolders/search';
  const response: ImagerightDocFolderWithRelations[] = await fetcher(url, baseUrl);
  return response;
}
