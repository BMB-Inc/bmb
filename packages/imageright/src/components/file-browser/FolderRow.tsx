import { Group, Text } from "@mantine/core";
import { IconChevronDown, IconChevronRight, IconFolder } from '@tabler/icons-react';
import classes from '../../modules/file-tree.module.css'
import type { ReactNode } from 'react';

type FolderRowProps = {
  label: ReactNode;
  expanded: boolean;
  hasChildren: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
}

export function FolderRow({ label, expanded, hasChildren, onToggle, onSelect }: FolderRowProps) {
  return (
    <Group
      gap='xs'
      className={expanded ? classes.childItemExpanded : classes.childItem}
      onClick={() => {
        onSelect?.();
        if (hasChildren) onToggle?.();
      }}
    >
      {hasChildren ? (
        expanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />
      ) : (
        <span style={{ width: 16 }} />
      )}
      <IconFolder size={16} color="var(--mantine-color-yellow-7)" />
      <Text>{label}</Text>
    </Group>
  );
}

export default FolderRow;

