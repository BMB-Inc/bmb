import { getClients } from "@api/index";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export const useClients = () => {
  const [searchParams] = useSearchParams();
  const clientCode = searchParams.get('clientCode') || '';
  const clientName = searchParams.get('clientName') || '';
  
  // Create search params object from URL params
  const params = (clientCode || clientName) ? {
    clientCode,
    clientName
  } : undefined;
  
  const hasSearchQuery = clientCode.trim() || clientName.trim();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["clients", clientCode, clientName],
    queryFn: () => getClients(params!),
    enabled: !!hasSearchQuery, // Only run query if we have a search term
  });

  if (!hasSearchQuery) {
    return { data: [], isLoading: false, error: null };
  }

  return { data: data || [], isLoading, error };
}