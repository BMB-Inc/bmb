import { fetcher } from "@api/fetcher";
import { type GetClientsDto } from "@bmb-inc/types";

export const getClients = async (params?: GetClientsDto, baseUrl?: string) => {
  if (!params) {
    return [];
  }
  
  const searchParams = new URLSearchParams();
  if (params.clientId) {
    searchParams.append('clientId', params.clientId.toString());
  }
  if (params.clientCode) {
    searchParams.append('clientCode', params.clientCode);
  }
  if (params.clientName) {
    searchParams.append('clientName', params.clientName);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/clients?${queryString}` : '/clients';
  
  const response = await fetcher(url, baseUrl);
  return response;
}
