import { fetcher } from "@api/fetcher";

export const getImages = async (pageId?: number, imageId?: number, version?: number) => {
  const response = await fetcher(`/images${pageId ? `?pageId=${pageId}` : ''}${imageId ? `&imageId=${imageId}` : ''}${version ? `&version=${version}` : ''}`);
  return response;
}