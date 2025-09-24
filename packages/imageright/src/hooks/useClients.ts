import { getClients } from "@api/index";
import type { ImagerightClientSearchParams } from "@bmb-inc/types";
import { useQuery } from "@tanstack/react-query";

export const useClients = (params?: ImagerightClientSearchParams) => {
  // Return empty array if no params or if both search fields are empty
  const hasSearchQuery = params && (params.clientCode.trim() || params.clientName.trim());
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["clients", params?.clientCode, params?.clientName],
    queryFn: () => getClients(params!),
    enabled: !!hasSearchQuery, // Only run query if we have a search term
  });

  if (!hasSearchQuery) {
    return { data: [], isLoading: false, error: null };
  }

  return { data: data || [], isLoading, error };
}