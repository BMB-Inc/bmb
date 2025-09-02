import { useQuery } from "@tanstack/react-query";
import { getClientById } from "../api/clients";

export const useGetClientById = (clientId: string | null, baseUrl?: string) => {
  return useQuery({
    queryKey: ["client", clientId, baseUrl],
    queryFn: () => getClientById(clientId as string, baseUrl),
    enabled: !!clientId,
  });
};
