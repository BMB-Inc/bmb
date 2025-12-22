import { Badge, Loader } from '@mantine/core';
import { useFolderItemCount } from '@hooks/useFolderItemCount';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';

type FolderItemCountProps = {
  clientId: number;
  folderId: number;
  folderTypes?: FolderTypes[];
  documentTypes?: DocumentTypes[];
  /** File extensions to filter documents by (only count docs with pages matching these extensions) */
  allowedExtensions?: string[];
};

/**
 * Displays a badge showing the count of items (folders + documents) in a folder.
 * Shows a small loader while fetching, then displays the count.
 * Empty folders show "0" in a dimmed style.
 * When allowedExtensions is provided, only counts documents with matching pages.
 */
export function FolderItemCount({
  clientId,
  folderId,
  folderTypes,
  documentTypes,
  allowedExtensions,
}: FolderItemCountProps) {
  const { data, isLoading } = useFolderItemCount({
    clientId,
    folderId,
    folderTypes: folderTypes ?? null,
    documentTypes,
    allowedExtensions,
  });

  if (isLoading) {
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

