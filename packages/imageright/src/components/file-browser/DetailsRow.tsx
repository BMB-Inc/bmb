import { Checkbox, Table, Text } from '@mantine/core';
import { IconFolder, IconFileText, IconBuilding } from '@tabler/icons-react';
import { useSelectedDocuments } from '@hooks/useSelectedDocuments';
import { useSelectAllPagesForDocument } from '@hooks/useSelectAllPagesForDocument';
import type { BrowserItem } from './types';

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

  // Determine row background color based on state
  const getRowBackgroundColor = () => {
    if (item.kind !== 'document') return undefined;
    
    const isSelected = selectedDocumentId === item.id;
    if (isImported) {
      return isSelected ? 'var(--mantine-color-blue-light)' : 'var(--mantine-color-gray-1)';
    }
    return isSelected ? 'var(--mantine-color-blue-light)' : undefined;
  };

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
          {item.name}
          {isImported && (
            <Text c="dimmed" size="xs" fs="italic" style={{ flexShrink: 0, marginLeft: 'auto' }}>
              Imported Already
            </Text>
          )}
        </div>
      </Table.Td>
      <Table.Td>{item.type}</Table.Td>
      <Table.Td>{item.modified}</Table.Td>
    </Table.Tr>
  );
}

export default DetailsRow;


