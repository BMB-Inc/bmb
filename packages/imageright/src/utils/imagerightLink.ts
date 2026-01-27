export const getImagerightOpenUrl = (imagerightUrl?: string | null): string | null => {
  if (!imagerightUrl) return null;

  try {
    const parsed = new URL(imagerightUrl);
    const encodedQuery = parsed.searchParams.get('q');
    if (!encodedQuery) {
      return imagerightUrl;
    }

    if (typeof atob !== 'function') {
      return imagerightUrl;
    }

    const decodedQuery = atob(encodedQuery);
    const directUrl = new URL(parsed.origin + parsed.pathname);
    directUrl.search = decodedQuery.startsWith('?') ? decodedQuery : `?${decodedQuery}`;
    return directUrl.toString();
  } catch {
    return imagerightUrl;
  }
};
