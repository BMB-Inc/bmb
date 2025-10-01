import { getClients } from "@api/index";
import { useQuery } from "@tanstack/react-query";
import { useQueryStates, parseAsString } from "nuqs";

export const useClients = () => {
  const [{ clientCode, clientName }] = useQueryStates({
    clientCode: parseAsString,
    clientName: parseAsString,
  });

  const code = (clientCode ?? '').trim();
  const name = (clientName ?? '').trim();

  const hasSearchQuery = !!code || !!name;

  const { data, isLoading, error } = useQuery({
    queryKey: ["clients", code, name],
    queryFn: () => getClients({ ...(code && { clientCode: code }), ...(name && { clientName: name }) }),
    enabled: hasSearchQuery,
  });

  if (!hasSearchQuery) {
    return { data: [], isLoading: false, error: null };
  }

  return { data: data || [], isLoading, error };
}