import { Group, ScrollArea, Stack, Text, useComputedColorScheme } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconFolder, IconFolderOpen } from '@tabler/icons-react';
import { useRootFolders } from '@hooks/useRootFolders';
import { TreeLoadingSkeleton } from '../file-tree/TreeLoadingSkeleton';
import { RootFolderChildren } from './RootFolderChildren';
import { useTreeContext } from './TreeContext';

export function RootFolderList({
  clientId,
}: {
  clientId: number;
}) {
  const {
    folderTypes,
    documentTypes,
    expandedFolders,
    toggleFolder,
  } = useTreeContext();
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';
  const rowBg = 'transparent';
  const rowHover = isDark ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-gray-1)';
  const normalizedDocumentTypes = Array.isArray(documentTypes) && documentTypes.length > 0 ? documentTypes : undefined;
  const { rootFolders, isLoading: rootFoldersLoading, normalizedFolderTypes } = useRootFolders({
    clientId,
    folderTypes,
  });

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
              const isExpanded = expandedFolders.has(folder.id);
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
                    onClick={() => toggleFolder(folder.id)}
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
                  </Group>

                  {isExpanded && (
                    <RootFolderChildren
                      clientId={clientId}
                      folderId={folder.id}
                      folderTypes={normalizedFolderTypes}
                      documentTypes={normalizedDocumentTypes}
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



