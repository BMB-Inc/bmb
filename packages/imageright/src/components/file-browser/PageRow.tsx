import { Group, Text } from "@mantine/core";
import { IconFile } from '@tabler/icons-react';
import classes from '@modules/file-tree.module.css'

type PageRowProps = {
  label: string;
  onSelect?: () => void;
}

export function PageRow({ label, onSelect }: PageRowProps) {
  return (
    <Group gap='xs' className={classes.pageItem} onClick={onSelect}>
      <IconFile size={14} color="var(--mantine-color-gray-7)" />
      <Text>{label}</Text>
    </Group>
  );
}

export default PageRow;

