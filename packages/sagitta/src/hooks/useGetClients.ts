import { useQuery } from "@tanstack/react-query";
import { getClients } from "@api/clients/route";
import type { ClientField } from "@schemas/client-fields.schema";

export const useGetClients = (searchValue: string, searchField: ClientField = 'clientName', baseUrl?: string) => {
  return useQuery({
    queryKey: ["clients", searchValue, searchField, baseUrl],
    queryFn: () => getClients(searchValue, searchField, baseUrl),
  });
};
