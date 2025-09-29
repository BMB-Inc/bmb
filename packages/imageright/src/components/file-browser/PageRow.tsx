import { Group, Text } from "@mantine/core";
import { IconFile } from '@tabler/icons-react';
import classes from '@modules/file-tree.module.css'

type PageRowProps = {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  onDoubleClick?: () => void;
}

export function PageRow({ label, selected, onSelect, onDoubleClick }: PageRowProps) {
  return (
    <Group
      gap='xs'
      className={selected ? classes.documentItemExpanded : classes.pageItem}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
    >
      <IconFile size={14} color="var(--mantine-color-gray-7)" />
      <Text>{label}</Text>
    </Group>
  );
}

export default PageRow;

