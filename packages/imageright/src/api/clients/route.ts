import { fetcher } from "@api/fetcher";

export const getClients = async (clientCode?: string, clientName?: string) => {
  const response = fetcher(`/clients?clientCode=${clientCode}&clientName=${clientName}`);
  return response;
}
