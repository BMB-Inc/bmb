const IMAGERIGHT_API_URL = (import.meta as any).env.VITE_IMAGERIGHT_API_URL;

export const getEmailDocument = async (params: { documentId: number; pageId?: number }) => {
  const searchParams = new URLSearchParams();
  searchParams.set('documentId', params.documentId.toString());
  if (typeof params.pageId === 'number') {
    searchParams.set('pageId', params.pageId.toString());
  }

  const response = await fetch(`${IMAGERIGHT_API_URL}/emails?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};
