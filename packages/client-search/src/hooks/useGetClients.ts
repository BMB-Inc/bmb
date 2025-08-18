import { useQuery } from "@tanstack/react-query";
import { getClients } from "../api/clients";

export const useGetClients = (clientName: string) => {
  return useQuery({
    queryKey: ["clients", clientName],
    queryFn: () => getClients(clientName),
  });
};