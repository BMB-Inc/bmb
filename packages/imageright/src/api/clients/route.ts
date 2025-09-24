import { fetcher } from "@api/fetcher";
import { imagerightClientsSchema, type ImagerightClientSearchParams } from "@bmb-inc/types";

export const getClients = async (params?: ImagerightClientSearchParams) => {
  if (!params) {
    return [];
  }
  const response = await fetcher(`/clients?clientCode=${params.clientCode}&clientName=${params.clientName}`);
  return imagerightClientsSchema.parse(response);
}
