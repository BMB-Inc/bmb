import { fetcher } from "@api/fetcher"

export const getDrawers = async () => {
  const response = fetcher(`/drawers`);
  return response;
}