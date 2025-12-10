import { Checkbox, Table } from '@mantine/core';
import { IconFolder, IconFileText, IconBuilding } from '@tabler/icons-react';
import { useSelectedDocuments } from '@hooks/useSelectedDocuments';
import type { BrowserItem } from './types';
import classes from '../../modules/file-tree.module.css';

type DetailsRowProps = {
  item: BrowserItem;
  selectedDocumentId?: number | null;
  onFolderOpen: (id: number, name: string) => void;
  onClientOpen?: (id: number) => void;
  onDocumentOpen?: (id: number) => void;
  onDocumentClear?: () => void;
  visibleDocumentIds?: number[];
};

export function DetailsRow({ item, selectedDocumentId, onFolderOpen, onClientOpen, onDocumentOpen, onDocumentClear, visibleDocumentIds = [] }: DetailsRowProps) {
  const { 
    isSelected: isDocumentSelected, 
    toggleSelected: toggleDocumentSelected,
    handleSelectWithModifiers,
    setLastSelectedId,
  } = useSelectedDocuments();

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
          } else {
            // Regular click - toggle checkbox and set as anchor
            toggleDocumentSelected(item.id, !isDocumentSelected(item.id));
            setLastSelectedId(item.id);
          }
          onDocumentOpen?.(item.id);
          return;
        }
        if (item.kind === 'folder') onFolderOpen(item.id, item.name);
        if (item.kind === 'client') onClientOpen?.(item.id);
      }}
      style={{
        cursor: item.kind === 'folder' || item.kind === 'client' || item.kind === 'document' ? 'pointer' : 'default',
        backgroundColor: item.kind === 'document' && selectedDocumentId === item.id ? 'var(--mantine-color-blue-0)' : undefined,
        userSelect: item.kind === 'document' ? 'none' : undefined,
      }}
      className={item.kind === 'document' ? (selectedDocumentId === item.id ? classes.documentItemExpanded : classes.documentItem) : undefined}
    >
      <Table.Td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {item.kind === 'document' && (
            <Checkbox
              size="xs"
              checked={isDocumentSelected(item.id)}
              onChange={(e) => {
                e.stopPropagation();
                toggleDocumentSelected(item.id, e.currentTarget.checked);
                setLastSelectedId(item.id);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {item.kind === 'folder' && <IconFolder size={16} color="var(--mantine-color-yellow-7)" />}
          {item.kind === 'client' && <IconBuilding size={16} color="var(--mantine-color-blue-5)" />}
          {item.kind === 'document' && <IconFileText size={16} color={selectedDocumentId === item.id ? 'var(--mantine-color-blue-9)' : 'var(--mantine-color-blue-7)'} />}
          {item.name}
        </div>
      </Table.Td>
      <Table.Td>{item.type}</Table.Td>
      <Table.Td>{item.modified}</Table.Td>
    </Table.Tr>
  );
}

export default DetailsRow;


