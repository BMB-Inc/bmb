import type { ImagerightDocument, ImagerightDocumentParams, ImagerightFolder, GetFoldersDto } from "@bmb-inc/types";
import type { TreeNodeData } from "@mantine/core";
import { useMemo } from "react";
import { useFolders, usePolicyFolders } from "./useFolders";
import { FolderTypes } from "@bmb-inc/types";
import { useDocuments } from "./useDocuments";

export const useGetChildren = (params?: GetFoldersDto & ImagerightDocumentParams) => {
  // Use the existing hooks to fetch data
  const { data: foldersData, isLoading: foldersLoading, error: foldersError } = usePolicyFolders(
    params?.clientId ? { clientId: params.clientId } : undefined
  );
  // Only fetch regular folders when a specific folder is selected (i.e., when browsing inside a policy folder)
  const {
    data: submissionFoldersData,
    isLoading: submissionFoldersLoading,
    error: submissionFoldersError
  } = useFolders(
    params?.folderId
      ? { clientId: params.clientId, folderId: params.folderId, folderTypes: [FolderTypes.submissions, FolderTypes.applications] }
      : undefined
  );
  const { data: documentsData, isLoading: documentsLoading, error: documentsError } = useDocuments(params);

  console.log(documentsData);

  // Combine loading states and errors
  const isLoading = foldersLoading || documentsLoading || submissionFoldersLoading;
  const error = foldersError || documentsError || submissionFoldersError;

  // Transform the data into TreeNodeData format
  const children = useMemo((): TreeNodeData[] => {
    if (!foldersData && !documentsData && !submissionFoldersData) {
      return [];
    }

    const policyFolders: TreeNodeData[] = (foldersData || []).map((folder: ImagerightFolder) => ({
      value: `folder-${folder.id}`,
      label: `${folder.attributes?.[0]?.displayName ?? 'Unknown Folder'} - ${folder.attributes?.[0]?.value ?? 'Unknown Value'}`,
      children: [] // Folders can have children
    }));

    const folders: TreeNodeData[] = (submissionFoldersData || []).map((folder: ImagerightFolder) => ({
      value: `folder-${folder.id}`,
      label: `${folder.attributes?.[0]?.displayName ?? 'Unknown Folder'} - ${folder.attributes?.[0]?.value ?? 'Unknown Value'}`,
      children: [] // Folders can have children
    }));

    const documents: TreeNodeData[] = (documentsData || []).map((document: ImagerightDocument) => ({
      value: `document-${document.id}`,
      label: document.description || 'Unknown Document'
      // Documents are leaf nodes, no children property needed
    }));

    return [...policyFolders, ...folders, ...documents];
  }, [foldersData, submissionFoldersData, documentsData]);

  return { children, isLoading, error };
}