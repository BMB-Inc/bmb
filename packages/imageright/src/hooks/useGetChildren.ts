import { getDocuments } from "@api/documents/route";
import { getFolders } from "@api/folders/route";
import type { ImagerightDocument, ImagerightDocumentParams, ImagerightFolder, ImagerightFoldersParams } from "@bmb-inc/types";
import type { TreeNodeData } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export const useGetChildren = (params?: ImagerightFoldersParams & ImagerightDocumentParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["children", params?.clientId, params?.folderId, params?.parentFolderId],
    queryFn: async () => {
      const [foldersData, documentsData] = await Promise.all([
        getFolders(params),
        getDocuments(params),
      ]);
      const folders: TreeNodeData[] = foldersData.map((folder: ImagerightFolder) => ({  }));
      const documents: TreeNodeData[] = documentsData.map((document: ImagerightDocument) => ({ id: document.id, label: document.documentName, type: "document" }));
      return [...folders, ...documents];
    } ,
    enabled: !!(params?.clientId || params?.folderId || params?.parentFolderId),
  });
  return { children: data, isLoading, error };
}