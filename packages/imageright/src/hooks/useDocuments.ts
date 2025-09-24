import { getDocumentById, getDocuments } from "@api/index";
import { useQuery } from "@tanstack/react-query";
import { type ImagerightDocumentParams } from "@bmb-inc/types";

export const useDocuments = (params?: ImagerightDocumentParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["documents", params?.clientId, params?.folderId],
    queryFn: () => getDocuments(params),
    enabled: !!(params?.clientId || params?.folderId),
  });
  return { data, isLoading, error };
}

export const useDocumentById = (id: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocumentById(id),
  });
  return { data, isLoading, error };
}