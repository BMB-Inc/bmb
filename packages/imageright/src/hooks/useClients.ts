import { getClients } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export const useClients = (clientCode?: string, clientName?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(clientCode, clientName),
  });
  return { data, isLoading, error };
}