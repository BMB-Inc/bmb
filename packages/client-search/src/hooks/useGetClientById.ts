import { useQuery } from "@tanstack/react-query";
import { getClientById } from "../api/clients";

export const useGetClientById = (clientId: string | null) => {
  return useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientById(clientId as string),
    enabled: !!clientId,
  });
};
