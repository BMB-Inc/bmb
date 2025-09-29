import { Table } from '@mantine/core';
import { IconFolder, IconFileText, IconBuilding } from '@tabler/icons-react';
import type { BrowserItem } from './types';

type DetailsTableProps = {
  items: BrowserItem[];
  onFolderOpen: (id: number) => void;
  onClientOpen?: (id: number) => void;
};

export function DetailsTable({ items, onFolderOpen, onClientOpen }: DetailsTableProps) {
  return (
    <Table withRowBorders={false} verticalSpacing="xs" highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Modified</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map(item => (
          <Table.Tr
            key={`${item.kind}-${item.id}`}
            onClick={() => {
              if (item.kind === 'folder') onFolderOpen(item.id);
              if (item.kind === 'client') onClientOpen?.(item.id);
            }}
            style={{ cursor: item.kind === 'folder' || item.kind === 'client' ? 'pointer' : 'default' }}
          >
            <Table.Td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.kind === 'folder' && <IconFolder size={16} color="var(--mantine-color-yellow-7)" />}
                {item.kind === 'client' && <IconBuilding size={16} color="var(--mantine-color-blue-5)" />}
                {item.kind === 'document' && <IconFileText size={16} color="var(--mantine-color-blue-7)" />}
                {item.name}
              </div>
            </Table.Td>
            <Table.Td>{item.type}</Table.Td>
            <Table.Td>{item.modified}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export default DetailsTable;


