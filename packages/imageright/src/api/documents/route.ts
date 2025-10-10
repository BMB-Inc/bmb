import { fetcher } from "@api/fetcher";
import { type ImagerightDocumentParams } from "@bmb-inc/types";
import { DocumentTypes } from "../../../../types/src/imageright/documents/get-documents.dto";

export const getDocuments = async (params?: ImagerightDocumentParams, documentType?: DocumentTypes) => {
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
  if (documentType) {
    searchParams.append('documentType', documentType);
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