import { useQuery } from "@tanstack/react-query";
import { getClients } from "../api/clients";

export const useGetClients = (clientName: string, baseUrl?: string) => {
  return useQuery({
    queryKey: ["clients", clientName, baseUrl],
    queryFn: () => getClients(clientName, baseUrl),
  });
};
