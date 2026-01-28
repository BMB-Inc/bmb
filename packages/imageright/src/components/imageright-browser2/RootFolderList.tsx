import { Group, ScrollArea, Stack, Text, useComputedColorScheme } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconFolder, IconFolderOpen } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useFolders, usePolicyFolders } from '@hooks/useFolders';
import { FolderItemCount } from '../file-tree/FolderItemCount';
import { TreeLoadingSkeleton } from '../file-tree/TreeLoadingSkeleton';
import { sortFolders } from '../file-browser/utils/folderSorting';
import { FolderTypes, type DocumentTypes, type FolderTypes as FolderTypesType } from '@bmb-inc/types';
import type { ActivePage } from './types';
import { RootFolderChildren } from './RootFolderChildren';

export function RootFolderList({
  clientId,
  expandedRootFolders,
  toggleRootFolder,
  folderTypes,
  documentTypes,
  selectedDocumentId,
  onDocumentSelect,
  onPageClick,
  activePage,
  importedDocumentIds,
  allowedExtensions,
}: {
  clientId: number;
  expandedRootFolders: Set<number>;
  toggleRootFolder: (folderId: number) => void;
  folderTypes?: FolderTypesType[];
  documentTypes?: DocumentTypes[];
  selectedDocumentId: number | null;
  onDocumentSelect: (documentId: number, folderId: number) => void;
  onPageClick: (page: ActivePage | null) => void;
  activePage: ActivePage | null;
  importedDocumentIds?: string[];
  allowedExtensions?: string[];
}) {
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';
  const rowBg = 'transparent';
  const rowHover = isDark ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-gray-1)';
  const normalizedFolderTypes = Array.isArray(folderTypes) && folderTypes.length > 0 ? folderTypes : undefined;
  const normalizedDocumentTypes = Array.isArray(documentTypes) && documentTypes.length > 0 ? documentTypes : undefined;

  // Prefer server policy-root endpoint when only policies are requested at root
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

  const rootFoldersLoading = wantsOnlyPoliciesAtRoot ? policyFoldersLoading : genericFoldersLoading;

  const rootFolders = useMemo(() => {
    const folders = wantsOnlyPoliciesAtRoot ? policyFolders : genericFolders;
    if (!folders || folders.length === 0) return [];
    return sortFolders(folders);
  }, [wantsOnlyPoliciesAtRoot, policyFolders, genericFolders]);

  return (
    <Stack gap="xs" style={{ height: '100%', minHeight: 0 }}>
      <ScrollArea
        style={{ height: '100%', minHeight: 0 }}
        styles={{ viewport: { paddingBottom: 'var(--mantine-spacing-xs)' } }}
      >
        {rootFoldersLoading && <TreeLoadingSkeleton />}
        {!rootFoldersLoading && (
          <Stack gap={2}>
            {rootFolders.map((folder: any) => {
              const isExpanded = expandedRootFolders.has(folder.id);
              const folderName = folder.description ?? folder.folderTypeName ?? 'Folder';
              const folderDisplayName =
                folder.folderTypeDescription && folder.folderTypeDescription !== folderName
                  ? `${folderName} (${folder.folderTypeDescription})`
                  : folderName;

              return (
                <div key={folder.id}>
                  <Group
                    gap="xs"
                    py={6}
                    px={8}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 'var(--mantine-radius-sm)',
                      backgroundColor: rowBg,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = rowHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = rowBg;
                    }}
                    onClick={() => toggleRootFolder(folder.id)}
                  >
                    {isExpanded ? (
                      <IconChevronDown size={16} style={{ flexShrink: 0 }} />
                    ) : (
                      <IconChevronRight size={16} style={{ flexShrink: 0 }} />
                    )}
                    {isExpanded ? (
                      <IconFolderOpen size={16} color="var(--mantine-color-yellow-6)" style={{ flexShrink: 0 }} />
                    ) : (
                      <IconFolder size={16} color="var(--mantine-color-yellow-7)" style={{ flexShrink: 0 }} />
                    )}
                    <Text truncate style={{ minWidth: 0, flex: 1 }}>
                      {folderDisplayName}
                    </Text>
                    <FolderItemCount
                      clientId={clientId}
                      folderId={folder.id}
                      folderTypes={normalizedFolderTypes}
                      documentTypes={normalizedDocumentTypes}
                      allowedExtensions={allowedExtensions}
                    />
                  </Group>

                  {isExpanded && (
                    <RootFolderChildren
                      clientId={clientId}
                      folderId={folder.id}
                      folderTypes={normalizedFolderTypes}
                      documentTypes={normalizedDocumentTypes}
                      selectedDocumentId={selectedDocumentId}
                      onDocumentSelect={onDocumentSelect}
                      onPageClick={onPageClick}
                      activePage={activePage}
                      importedDocumentIds={importedDocumentIds}
                      allowedExtensions={allowedExtensions}
                    />
                  )}
                </div>
              );
            })}
          </Stack>
        )}
      </ScrollArea>
    </Stack>
  );
}

export default RootFolderList;


