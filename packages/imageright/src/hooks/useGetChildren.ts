import type { ImagerightDocument, ImagerightDocumentParams, ImagerightFolder, GetFoldersDto } from "@bmb-inc/types";
import type { TreeNodeData } from "@mantine/core";
import { useMemo } from "react";
import { usePolicyFolders } from "./useFolders";
import { useDocuments } from "./useDocuments";

export const useGetChildren = (params?: GetFoldersDto & ImagerightDocumentParams) => {
  // Use the existing hooks to fetch data
  const { data: foldersData, isLoading: foldersLoading, error: foldersError } = usePolicyFolders(params);
  const { data: documentsData, isLoading: documentsLoading, error: documentsError } = useDocuments(params);

  // Combine loading states and errors
  const isLoading = foldersLoading || documentsLoading;
  const error = foldersError || documentsError;

  // Transform the data into TreeNodeData format
  const children = useMemo((): TreeNodeData[] => {
    if (!foldersData && !documentsData) {
      return [];
    }

    const folders: TreeNodeData[] = (foldersData || []).map((folder: ImagerightFolder) => ({
      value: `folder-${folder.id}`,
      label: `${folder.attributes?.[0]?.displayName} - ${folder.attributes?.[0]?.value}` || 'Unknown Folder',
      children: [] // Folders can have children
    }));

    const documents: TreeNodeData[] = (documentsData || []).map((document: ImagerightDocument) => ({
      value: `document-${document.id}`,
      label: document.documentName || document.description || 'Unknown Document'
      // Documents are leaf nodes, no children property needed
    }));

    return [...folders, ...documents];
  }, [foldersData, documentsData]);

  return { children, isLoading, error };
}