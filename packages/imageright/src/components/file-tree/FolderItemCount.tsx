import { Badge, Loader } from '@mantine/core';
import { useFolderItemCount } from '@hooks/useFolderItemCount';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';
import { useMemo } from 'react';

type FolderItemCountProps = {
  clientId: number;
  folderId: number;
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  /** File extensions to filter documents by (only count docs with pages matching these extensions) */
  allowedExtensions?: string[];
  /** Optional: Pre-fetched folders data to avoid duplicate requests */
  folders?: any[];
  /** Optional: Pre-fetched documents data to avoid duplicate requests */
  documents?: any[];
  /** Optional: Pre-computed filtered count from useFilteredDocumentsByExtension */
  filteredDocumentCount?: number;
};

/**
 * Displays a badge showing the count of items (folders + documents) in a folder.
 * Shows a small loader while fetching, then displays the count.
 * Empty folders show "0" in a dimmed style.
 * When allowedExtensions is provided, only counts documents with matching pages.
 * 
 * OPTIMIZATION: If folders/documents are provided, uses them instead of making new requests.
 */
export function FolderItemCount({
  clientId,
  folderId,
  folderTypes,
  documentTypes,
  allowedExtensions,
  folders: prefetchedFolders,
  documents: prefetchedDocuments,
  filteredDocumentCount,
}: FolderItemCountProps) {
  // If we have pre-fetched data, use it directly instead of making requests
  const hasPrefetchedData = prefetchedFolders !== undefined || prefetchedDocuments !== undefined;
  
  const { data: fetchedData, isLoading } = useFolderItemCount(
    hasPrefetchedData ? undefined : {
      clientId,
      folderId,
      folderTypes: folderTypes ?? null,
      documentTypes,
      allowedExtensions,
    }
  );

  // Compute count from pre-fetched data if available
  const computedData = useMemo(() => {
    if (!hasPrefetchedData) {
      return fetchedData;
    }

    const folderCount = prefetchedFolders?.length ?? 0;
    // Use filtered count if provided, otherwise use document count
    const documentCount = filteredDocumentCount ?? prefetchedDocuments?.length ?? 0;

    return {
      folderCount,
      documentCount,
      totalCount: folderCount + documentCount,
    };
  }, [hasPrefetchedData, prefetchedFolders, prefetchedDocuments, filteredDocumentCount, fetchedData]);

  const data = computedData;
  const isActuallyLoading = !hasPrefetchedData && isLoading;

  if (isActuallyLoading) {
    return <Loader size={10} />;
  }

  if (!data) {
    return null;
  }

  const isEmpty = data.totalCount === 0;

  return (
    <Badge
      size="xs"
      variant="light"
      color={isEmpty ? 'gray' : 'blue'}
      style={{
        fontWeight: 500,
        minWidth: 20,
        opacity: isEmpty ? 0.6 : 1,
      }}
    >
      {data.totalCount}
    </Badge>
  );
}

export default FolderItemCount;

