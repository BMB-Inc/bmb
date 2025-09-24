import { getDocumentById, getDocuments } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export const useDocuments = (clientId?: number, parentId?: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["documents", clientId, parentId],
    queryFn: () => getDocuments(clientId, parentId),
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