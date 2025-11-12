import { Group, Text } from "@mantine/core";
import { IconChevronDown, IconChevronRight, IconFileText } from '@tabler/icons-react';
import classes from '../../modules/file-tree.module.css'
import type { ReactNode } from 'react';

type DocumentRowProps = {
  label: ReactNode;
  expanded: boolean;
  hasChildren: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
}

export function DocumentRow({ label, expanded, hasChildren, onToggle, onSelect }: DocumentRowProps) {
  return (
    <Group
      gap='xs'
      miw={0}
      className={expanded ? classes.documentItemExpanded : classes.documentItem}
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
      <IconFileText size={16} color="var(--mantine-color-blue-7)" />
      <Text>{label}</Text>
    </Group>
  );
}

export default DocumentRow;

