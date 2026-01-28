import { useMemo } from 'react';
import { useFolders, usePolicyFolders } from '@hooks/useFolders';
import { FolderTypes, type FolderTypes as FolderTypesType } from '@bmb-inc/types';
import { sortFolders } from '@components/file-browser/utils/folderSorting';

type UseRootFoldersParams = {
  clientId: number;
  folderTypes?: FolderTypesType[];
};

export function useRootFolders({ clientId, folderTypes }: UseRootFoldersParams) {
  const normalizedFolderTypes = Array.isArray(folderTypes) && folderTypes.length > 0 ? folderTypes : undefined;

  const wantsOnlyPoliciesAtRoot =
    Array.isArray(normalizedFolderTypes) &&
    normalizedFolderTypes.length === 1 &&
    normalizedFolderTypes[0] === FolderTypes.policies;

  const { data: policyFolders = [], isLoading: policyFoldersLoading } = usePolicyFolders(
    wantsOnlyPoliciesAtRoot ? { clientId } : undefined
  );

  const { data: genericFolders = [], isLoading: genericFoldersLoading } = useFolders(
    wantsOnlyPoliciesAtRoot ? undefined : { clientId, folderId: null, folderTypes: normalizedFolderTypes }
  );

  const rootFolders = useMemo(() => {
    const folders = wantsOnlyPoliciesAtRoot ? policyFolders : genericFolders;
    if (!folders || folders.length === 0) return [];
    return sortFolders(folders);
  }, [wantsOnlyPoliciesAtRoot, policyFolders, genericFolders]);

  return {
    rootFolders,
    isLoading: wantsOnlyPoliciesAtRoot ? policyFoldersLoading : genericFoldersLoading,
    normalizedFolderTypes,
  } as const;
}
