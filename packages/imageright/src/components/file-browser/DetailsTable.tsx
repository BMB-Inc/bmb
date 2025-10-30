import { Table } from '@mantine/core';
import { useMemo, useState } from 'react';
import type { BrowserItem } from './types';
import { SortableHeader } from './SortableHeader';
import { NameFilter } from './NameFilter';
import { DetailsRow } from './DetailsRow';

type DetailsTableProps = {
  items: BrowserItem[];
  onFolderOpen: (id: number) => void;
  onClientOpen?: (id: number) => void;
  onDocumentOpen?: (id: number) => void;
  selectedDocumentId?: number | null;
  onDocumentClear?: () => void;
};

export function DetailsTable({ items, onFolderOpen, onClientOpen, onDocumentOpen, selectedDocumentId, onDocumentClear }: DetailsTableProps) {
  type SortKey = 'name' | 'modified';
  type SortDirection = 'asc' | 'desc';
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [folderNameQuery, setFolderNameQuery] = useState('');

  const filteredItems = useMemo(() => {
    const query = folderNameQuery.trim().toLocaleLowerCase();
    if (!query) return items;
    return items.filter(item => {
      if (item.kind === 'folder' || item.kind === 'document') {
        return item.name.toLocaleLowerCase().includes(query);
      }
      return true; // leave clients unaffected
    });
  }, [items, folderNameQuery]);

  const sortedItems = useMemo(() => {
    const base = filteredItems;
    if (!sort) return base;
    const itemsCopy = [...base];
    const compare = (a: BrowserItem, b: BrowserItem) => {
      if (sort.key === 'name') {
        const an = a.name.toLocaleLowerCase();
        const bn = b.name.toLocaleLowerCase();
        const cmp = an.localeCompare(bn, undefined, { numeric: true, sensitivity: 'base' });
        return sort.direction === 'asc' ? cmp : -cmp;
      }
      const ad = Date.parse(a.modified);
      const bd = Date.parse(b.modified);
      const aTime = Number.isNaN(ad) ? 0 : ad;
      const bTime = Number.isNaN(bd) ? 0 : bd;
      const cmp = aTime - bTime;
      return sort.direction === 'asc' ? cmp : -cmp;
    };
    itemsCopy.sort(compare);
    return itemsCopy;
  }, [filteredItems, sort]);

  const toggleSort = (key: SortKey) => {
    setSort(prev => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  };
  return (
    <Table withRowBorders={false} verticalSpacing="xs" highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <SortableHeader
            title="Name"
            active={sort?.key === 'name'}
            direction={sort?.key === 'name' ? sort.direction : null}
            onToggle={() => toggleSort('name')}
          />
          <Table.Th>Type</Table.Th>
          <SortableHeader
            title="Modified"
            active={sort?.key === 'modified'}
            direction={sort?.key === 'modified' ? sort.direction : null}
            onToggle={() => toggleSort('modified')}
          />
        </Table.Tr>
        <Table.Tr>
          <Table.Th>
            <NameFilter value={folderNameQuery} onChange={setFolderNameQuery} delay={500} width={300} />
          </Table.Th>
          <Table.Th />
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {sortedItems.map(item => (
          <DetailsRow
            key={`${item.kind}-${item.id}`}
            item={item}
            selectedDocumentId={selectedDocumentId}
            onFolderOpen={onFolderOpen}
            onClientOpen={onClientOpen}
            onDocumentOpen={onDocumentOpen}
            onDocumentClear={onDocumentClear}
          />
        ))}
      </Table.Tbody>
    </Table>
  );
}

export default DetailsTable;


