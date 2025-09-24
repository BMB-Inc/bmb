import { getPages } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export const usePages = (documentId?: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pages", documentId],
    queryFn: () => getPages(documentId),
  });
  return { data, isLoading, error };
}