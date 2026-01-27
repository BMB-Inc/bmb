import { ActionIcon, Badge, Checkbox, Table, Text, Tooltip } from '@mantine/core';
import { IconFolder, IconFileText, IconBuilding, IconExternalLink } from '@tabler/icons-react';
import { useSelectedDocuments } from '@hooks/useSelectedDocuments';
import { useSelectAllPagesForDocument } from '@hooks/useSelectAllPagesForDocument';
import type { BrowserItem } from './types';
import { getImagerightOpenUrl } from '../../utils/imagerightLink';

type DetailsRowProps = {
  item: BrowserItem;
  selectedDocumentId?: number | null;
  onFolderOpen: (id: number, name: string) => void;
  onClientOpen?: (id: number) => void;
  onDocumentOpen?: (id: number) => void;
  visibleDocumentIds?: number[];
  /** Parent folder ID for tracking which folder the pages belong to */
  folderId?: number | null;
  /** Document IDs that have already been imported (will be displayed greyed out) */
  importedDocumentIds?: string[];
};

export function DetailsRow({ item, selectedDocumentId, onFolderOpen, onClientOpen, onDocumentOpen, visibleDocumentIds = [], folderId, importedDocumentIds }: DetailsRowProps) {
  const { 
    isSelected: isDocumentSelected, 
    toggleSelected: toggleDocumentSelected,
    handleSelectWithModifiers,
    setLastSelectedId,
  } = useSelectedDocuments();
  const { selectAllPagesForDocument } = useSelectAllPagesForDocument();

  // Check if this document has been imported
  const isImported = item.kind === 'document' && (importedDocumentIds?.includes(String(item.id)) ?? false);
  const isSelected = item.kind === 'document' && selectedDocumentId === item.id;
  const imagerightOpenUrl = item.kind === 'document' ? getImagerightOpenUrl(item.imagerightUrl ?? null) : null;

  // Determine row background color based on state
  const getRowBackgroundColor = () => {
    if (item.kind !== 'document') return undefined;
    
    if (isImported) {
      return isSelected ? 'var(--mantine-color-blue-light)' : 'var(--mantine-color-gray-1)';
    }
    return isSelected ? 'var(--mantine-color-blue-light)' : undefined;
  };

  const typeColor = item.kind === 'folder' ? 'yellow' : item.kind === 'client' ? 'indigo' : 'blue';

  return (
    <Table.Tr
      key={`${item.kind}-${item.id}`}
      onClick={(e) => {
        if (item.kind === 'document') {
          // Handle shift/ctrl+click for multi-select
          if (e.shiftKey || e.ctrlKey || e.metaKey) {
            handleSelectWithModifiers(item.id, visibleDocumentIds, {
              shiftKey: e.shiftKey,
              ctrlKey: e.ctrlKey,
              metaKey: e.metaKey,
            });
          }
          // Always set anchor for shift+click range selection
          setLastSelectedId(item.id);
          // Single click - just preview the document (no selection)
          onDocumentOpen?.(item.id);
          return;
        }
        if (item.kind === 'folder') onFolderOpen(item.id, item.name);
        if (item.kind === 'client') onClientOpen?.(item.id);
      }}
      onDoubleClick={() => {
        if (item.kind === 'document') {
          // Double-click - toggle document selection, open document, and select all pages when selecting
          const willBeSelected = !isDocumentSelected(item.id);
          toggleDocumentSelected(item.id, willBeSelected);
          setLastSelectedId(item.id);
          // Open document to show pages
          onDocumentOpen?.(item.id);
          if (willBeSelected) {
            selectAllPagesForDocument(item.id, folderId);
          }
        }
      }}
      style={{
        cursor: item.kind === 'folder' || item.kind === 'client' || item.kind === 'document' ? 'pointer' : 'default',
        backgroundColor: getRowBackgroundColor(),
        userSelect: item.kind === 'document' ? 'none' : undefined,
        opacity: isImported ? 0.5 : undefined,
      }}
    >
      <Table.Td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {item.kind === 'document' && (
            <Checkbox
              size="xs"
              checked={isDocumentSelected(item.id)}
              onChange={(e) => {
                e.stopPropagation();
                const isChecked = e.currentTarget.checked;
                toggleDocumentSelected(item.id, isChecked);
                setLastSelectedId(item.id);
                // Open document to show pages
                onDocumentOpen?.(item.id);
                if (isChecked) {
                  selectAllPagesForDocument(item.id, folderId);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {item.kind === 'folder' && <IconFolder size={16} color="var(--mantine-color-yellow-7)" />}
          {item.kind === 'client' && <IconBuilding size={16} color="var(--mantine-color-blue-5)" />}
          {item.kind === 'document' && <IconFileText size={16} color={selectedDocumentId === item.id ? 'var(--mantine-color-blue-9)' : 'var(--mantine-color-blue-7)'} />}
          <Text fw={isSelected ? 600 : 500}>{item.name}</Text>
          {imagerightOpenUrl ? (
            <Tooltip label="Open in ImageRight" openDelay={300}>
              <ActionIcon
                size="sm"
                variant="subtle"
                component="a"
                href={imagerightOpenUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                <IconExternalLink size={16} />
              </ActionIcon>
            </Tooltip>
          ) : null}
          {isImported && (
            <Text c="dimmed" size="xs" fs="italic" style={{ flexShrink: 0, marginLeft: 'auto' }}>
              Imported Already
            </Text>
          )}
        </div>
      </Table.Td>
      <Table.Td>
        <Badge size="xs" variant="light" color={typeColor}>
          {item.type}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {item.modified}
        </Text>
      </Table.Td>
    </Table.Tr>
  );
}

export default DetailsRow;


