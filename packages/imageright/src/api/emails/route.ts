import { getBaseUrl } from '../constants';

export const getEmailDocument = async (params: { documentId: number; pageId?: number }, baseUrl?: string) => {
  const apiUrl = getBaseUrl(baseUrl);
  const searchParams = new URLSearchParams();
  searchParams.set('documentId', params.documentId.toString());
  if (typeof params.pageId === 'number') {
    searchParams.set('pageId', params.pageId.toString());
  }

  const response = await fetch(`${apiUrl}/emails?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};
