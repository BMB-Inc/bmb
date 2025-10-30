import { Table } from '@mantine/core';
import { IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-react';

type SortDirection = 'asc' | 'desc' | null;

type SortableHeaderProps = {
  title: string;
  active: boolean;
  direction: SortDirection;
  onToggle: () => void;
};

export function SortableHeader({ title, active, direction, onToggle }: SortableHeaderProps) {
  return (
    <Table.Th onClick={onToggle} style={{ cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{title}</span>
        {active
          ? (direction === 'asc'
              ? <IconSortAscending size={16} color={'var(--mantine-color-blue-7)'} />
              : <IconSortDescending size={16} color={'var(--mantine-color-blue-7)'} />)
          : <IconArrowsSort size={16} color={'var(--mantine-color-gray-6)'} />}
      </div>
    </Table.Th>
  );
}

export default SortableHeader;


