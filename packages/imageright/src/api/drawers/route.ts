import { fetcher } from "@api/fetcher"

export const getDrawers = async () => {
  const response = await fetcher(`/drawers`);
  return response;
}