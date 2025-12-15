import { fetcher } from "@api/fetcher"

export const getDrawers = async (baseUrl?: string) => {
  const response = await fetcher(`/drawers`, baseUrl);
  return response;
}
