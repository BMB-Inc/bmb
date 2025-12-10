import { ActionIcon, Button, Checkbox, Group, Menu, ScrollArea, Table, Text } from '@mantine/core';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type { BrowserItem } from './types';
import { SortableHeader } from './SortableHeader';
import { NameFilter } from './NameFilter';
import { DetailsRow } from './DetailsRow';
import { IconChecks, IconFilter } from '@tabler/icons-react';
import { useSelectedDocuments } from '@hooks/useSelectedDocuments';

type DetailsTableProps = {
  items: BrowserItem[];
  onFolderOpen: (id: number, name: string) => void;
  onClientOpen?: (id: number) => void;
  onDocumentOpen?: (id: number) => void;
  selectedDocumentId?: number | null;
  onDocumentClear?: () => void;
};

export function DetailsTable({ items, onFolderOpen, onClientOpen, onDocumentOpen, selectedDocumentId, onDocumentClear }: DetailsTableProps) {
  type SortKey = 'name' | 'type' | 'modified';
  type SortDirection = 'asc' | 'desc';
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [folderNameQuery, setFolderNameQuery] = useState('');
  const { selectMany } = useSelectedDocuments();
  const availableTypeEntries = useMemo(() => {
    // key: type name (used for filtering), label: displayed text (type only)
    const labelMap = new Map<string, string>();
    const idsMap = new Map<string, Set<number>>();
    for (const it of items) {
      if ((it.kind === 'folder' || it.kind === 'document') && it.type) {
        const key = it.type;
        if (!labelMap.has(key)) {
          labelMap.set(key, key);
        }
        const idCandidate = typeof (it as any).folderTypeId === 'number'
          ? (it as any).folderTypeId
          : typeof (it as any).documentTypeId === 'number'
            ? (it as any).documentTypeId
            : undefined;
        if (typeof idCandidate === 'number') {
          if (!idsMap.has(key)) idsMap.set(key, new Set<number>());
          idsMap.get(key)!.add(idCandidate);
        }
      }
    }
    const entries = Array.from(labelMap.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
    return entries;
  }, [items]);
  const [visibleTypes, setVisibleTypes] = useState<Set<string>>(new Set());
  // sync visible types with available; keep previous selections where possible; default to all visible
  useEffect(() => {
    const keys = availableTypeEntries.map(e => e.key);
    setVisibleTypes(prev => {
      // Build desired set
      const desired =
        prev.size === 0
          ? new Set(keys)
          : new Set<string>(keys.filter((k) => prev.has(k)));
      // If same contents, don't trigger a state change
      if (desired.size === prev.size) {
        let identical = true;
        for (const k of prev) {
          if (!desired.has(k)) {
            identical = false;
            break;
          }
        }
        if (identical) return prev;
      }
      // If after filtering nothing remains, default to all keys
      return desired.size === 0 ? new Set(keys) : desired;
    });
  }, [availableTypeEntries]);

  const filteredItems = useMemo(() => {
    const query = folderNameQuery.trim().toLocaleLowerCase();
    const typesSet = visibleTypes;
    return items.filter(item => {
      // filter by name
      const nameMatches = !query
        ? true
        : (item.kind === 'folder' || item.kind === 'document')
          ? item.name.toLocaleLowerCase().includes(query)
          : true;
      // filter by type (only for folders/documents)
      const typeMatches = (item.kind === 'folder' || item.kind === 'document')
        ? (typesSet.size === 0 || typesSet.has(item.type))
        : true;
      return nameMatches && typeMatches;
    });
  }, [items, folderNameQuery, visibleTypes]);

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
      if (sort.key === 'type') {
        const at = (a as any).type ? String((a as any).type).toLocaleLowerCase() : '';
        const bt = (b as any).type ? String((b as any).type).toLocaleLowerCase() : '';
        const cmp = at.localeCompare(bt, undefined, { numeric: true, sensitivity: 'base' });
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

  const visibleDocumentIds = useMemo(() => {
    return sortedItems
      .filter((item) => item.kind === 'document')
      .map((item) => item.id as number);
  }, [sortedItems]);

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
          <SortableHeader
            title="Type"
            active={sort?.key === 'type'}
            direction={sort?.key === 'type' ? sort.direction : null}
            onToggle={() => toggleSort('type')}
            rightSection={
              <Menu withinPortal position="bottom-start" shadow="md">
                <Menu.Target>
                  <ActionIcon
                    aria-label="Filter types"
                    variant="subtle"
                    size="sm"
                  >
                    <IconFilter size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Group justify="space-between" gap={6} px="xs" py={4}>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => setVisibleTypes(new Set(availableTypeEntries.map(e => e.key)))}
                      disabled={availableTypeEntries.length === 0}
                    >
                      Select all
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => setVisibleTypes(new Set())}
                      disabled={availableTypeEntries.length === 0}
                    >
                      Clear
                    </Button>
                  </Group>
                  <ScrollArea.Autosize mah={220}>
                    <div style={{ padding: '4px 8px' }}>
                      {availableTypeEntries.map(({ key, label }) => {
                        const checked = visibleTypes.has(key);
                        return (
                          <Checkbox
                            key={key}
                            label={label}
                            checked={checked}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              const isChecked = e?.target?.checked ?? false;
                              setVisibleTypes((prev) => {
                                const next = new Set(prev);
                                if (isChecked) {
                                  next.add(key);
                                } else {
                                  next.delete(key);
                                }
                                return next;
                              });
                            }}
                            styles={{ root: { padding: '2px 0' } }}
                          />
                        );
                      })}
                      {availableTypeEntries.length === 0 && (
                        <Text c="dimmed" size="sm">No types</Text>
                      )}
                    </div>
                  </ScrollArea.Autosize>
                </Menu.Dropdown>
              </Menu>
            }
          />
          <SortableHeader
            title="Modified"
            active={sort?.key === 'modified'}
            direction={sort?.key === 'modified' ? sort.direction : null}
            onToggle={() => toggleSort('modified')}
          />
        </Table.Tr>
        <Table.Tr>
          <Table.Th>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <NameFilter value={folderNameQuery} onChange={setFolderNameQuery} delay={500} width={300} />
              <Button
                size="xs"
                variant="light"
                leftSection={<IconChecks size={16} />}
                onClick={() => selectMany(visibleDocumentIds)}
                disabled={visibleDocumentIds.length === 0}
              >
                Select All
              </Button>
            </div>
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


