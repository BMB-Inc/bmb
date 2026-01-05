import { getBaseUrl } from '../constants';

// NOTE: This endpoint must return the raw Response now (for bytes). We intentionally do not use the JSON fetcher here.
export const getImages = async (pageId?: number, imageId?: number, version?: number, baseUrl?: string) => {
  const apiUrl = getBaseUrl(baseUrl);
  const url = `${apiUrl}/images${pageId ? `?pageId=${pageId}` : ''}${imageId ? `${pageId ? '&' : '?'}imageId=${imageId}` : ''}${version ? `&version=${version}` : ''}`;
  
  const devToken = import.meta.env.VITE_DEV_AUTH_TOKEN;
  const response = await fetch(url, {
    credentials: 'include', // Include cookies for authentication
    headers: devToken ? { 'Authorization': `Bearer ${devToken}` } : {},
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}
