import { fetcher } from "@api/fetcher";
import { type ImagerightClientSearch } from "@bmb-inc/types";

export const getClients = async (params?: ImagerightClientSearch) => {
  if (!params) {
    return [];
  }
  
  const searchParams = new URLSearchParams();
  if (params.clientCode) {
    searchParams.append('clientCode', params.clientCode);
  }
  if (params.clientName) {
    searchParams.append('clientName', params.clientName);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/clients?${queryString}` : '/clients';
  
  const response = await fetcher(url);
  return response;
}
