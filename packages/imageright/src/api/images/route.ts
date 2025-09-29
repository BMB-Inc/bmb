// NOTE: This endpoint must return the raw Response now (for bytes). We intentionally do not use the JSON fetcher here.
const IMAGERIGHT_API_URL = (import.meta as any).env.VITE_IMAGERIGHT_API_URL;

export const getImages = async (pageId?: number, imageId?: number, version?: number) => {
  const url = `${IMAGERIGHT_API_URL}/images${pageId ? `?pageId=${pageId}` : ''}${imageId ? `${pageId ? '&' : '?'}imageId=${imageId}` : ''}${version ? `&version=${version}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}
