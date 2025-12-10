import { Table } from '@mantine/core';
import type { ReactNode } from 'react';
import { IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-react';

type SortDirection = 'asc' | 'desc' | null;

type SortableHeaderProps = {
  title: string;
  active: boolean;
  direction: SortDirection;
  onToggle: () => void;
	rightSection?: ReactNode;
};

export function SortableHeader({ title, active, direction, onToggle, rightSection }: SortableHeaderProps) {
  return (
		<Table.Th>
			<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
				<div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}>
					<span>{title}</span>
					{active
						? (direction === 'asc'
							? <IconSortAscending size={16} color={'var(--mantine-color-blue-7)'} />
							: <IconSortDescending size={16} color={'var(--mantine-color-blue-7)'} />)
						: <IconArrowsSort size={16} color={'var(--mantine-color-gray-6)'} />}
				</div>
				{rightSection}
      </div>
    </Table.Th>
  );
}

export default SortableHeader;


