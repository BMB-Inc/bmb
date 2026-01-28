import { Group, ScrollArea, Stack, Text, useComputedColorScheme, Loader } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconFolder, IconFolderOpen, IconFileText } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useFolders, usePolicyFolders } from '@hooks/useFolders';
import { FolderItemCount } from '../file-tree/FolderItemCount';
import { TreeLoadingSkeleton } from '../file-tree/TreeLoadingSkeleton';
import { sortFolders } from '../file-browser/utils/folderSorting';
import { FolderTypes, type DocumentTypes, type FolderTypes as FolderTypesType } from '@bmb-inc/types';
import type { ActivePage } from './types';
import { RootFolderChildren } from './RootFolderChildren';
import { useDocumentSearchParam, useDocumentsByName } from '@hooks/index';
import { NameFilter } from '../file-browser/NameFilter';

export function RootFolderList({
  clientId,
  drawerId,
  selectedFolderId,
  expandedRootFolders,
  toggleRootFolder,
  expandFolder,
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
  drawerId?: number | null;
  selectedFolderId?: number | null;
  expandedRootFolders: Set<number>;
  toggleRootFolder: (folderId: number) => void;
  expandFolder: (folderId: number) => void;
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

  const { value: documentSearchInput, onChange: setDocumentSearchInput, searchParam: documentSearchParam } =
    useDocumentSearchParam(500);
  const searchActive = (documentSearchParam ?? '').trim().length > 0;
  const { data: searchedDocFolders = [], isLoading: searchLoading } = useDocumentsByName(
    searchActive
      ? {
          description: documentSearchParam ?? '',
          limit: 200,
          drawerId: drawerId ?? undefined,
          fileId: clientId,
          parentId: selectedFolderId ?? undefined,
        }
      : undefined
  );
  const searchResults = useMemo(() => {
    if (!searchActive) return [];
    const toDateStr = (iso?: string | null) => {
      if (!iso) return '';
      const dt = new Date(iso);
      return isNaN(dt.getTime()) ? '' : dt.toLocaleDateString();
    };
    return (searchedDocFolders || [])
      .filter((doc: any) => {
        const fileId = doc?.file?.id ?? doc?.fileId ?? doc?.fileid;
        return typeof fileId === 'number' ? fileId === clientId : true;
      })
      .map((doc: any) => {
        const folder = Array.isArray(doc?.folder) ? doc.folder[0] : undefined;
        const folderId = folder?.id ?? folder?.folderId ?? doc?.parentid ?? doc?.parentId ?? null;
        return {
          id: doc?.docfolderid ?? doc?.id,
          name: doc?.description ?? doc?.documentName ?? 'Document',
          modified: toDateStr(doc?.lastmodified || doc?.dateLastModified || doc?.created || doc?.dateCreated),
          folderId: folderId != null ? Number(folderId) : null,
          folderName: folder?.description ?? folder?.folderTypeDescription ?? folder?.folderTypeName ?? null,
        };
      })
      .filter((item: any) => typeof item.id === 'number');
  }, [searchActive, searchedDocFolders, clientId]);

  return (
    <Stack gap="xs" style={{ height: '100%', minHeight: 0 }}>
      <NameFilter
        value={documentSearchInput}
        onChange={setDocumentSearchInput}
        delay={0}
        width={360}
        placeholder="Search documents by name"
      />
      <ScrollArea
        style={{ height: '100%', minHeight: 0 }}
        styles={{ viewport: { paddingBottom: 'var(--mantine-spacing-xs)' } }}
      >
        {searchActive && (
          <Stack gap={2} px="xs" py="xs">
            {searchLoading && (
              <Group gap="xs" py={4} px={6}>
                <Loader size="xs" />
                <Text size="sm" c="dimmed">
                  Searching...
                </Text>
              </Group>
            )}
            {!searchLoading && searchResults.length === 0 && (
              <Text size="sm" c="dimmed" py={4} px={6}>
                No documents found
              </Text>
            )}
            {!searchLoading && searchResults.map((doc: any) => (
              <Group
                key={`search-doc-${doc.id}`}
                gap="xs"
                py={4}
                px={6}
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
                onClick={() => {
                  if (doc.folderId != null) {
                    expandFolder(doc.folderId);
                  }
                  onDocumentSelect(doc.id, doc.folderId ?? 0);
                }}
              >
                <IconFileText size={14} color="var(--mantine-color-blue-7)" />
                <Text truncate style={{ minWidth: 0, flex: 1 }}>
                  {doc.name}
                </Text>
                {doc.folderName && (
                  <Text size="xs" c="dimmed" truncate style={{ maxWidth: 140 }}>
                    {doc.folderName}
                  </Text>
                )}
                {doc.modified && (
                  <Text size="xs" c="dimmed">
                    {doc.modified}
                  </Text>
                )}
              </Group>
            ))}
          </Stack>
        )}

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


