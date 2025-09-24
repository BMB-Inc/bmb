import { getPages } from "@api/index";
import { useQuery } from "@tanstack/react-query";
import { type ImagerightPageParams } from "@bmb-inc/types";

export const usePages = (params?: ImagerightPageParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pages", params?.documentId],
    queryFn: () => getPages(params),
    enabled: !!params?.documentId, // Only run query if documentId is provided
  });
  return { data, isLoading, error };
};