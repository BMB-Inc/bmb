import { Card, Group, Text } from "@mantine/core";
import { IconBuilding, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import classes from '@modules/file-tree.module.css'

type ClientCardProps = {
  label: string;
  expanded: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
}

export function ClientCard({ label, expanded, onToggle, onSelect }: ClientCardProps) {
  return (
    <Card
      withBorder
      p="xs"
      className={expanded ? classes.rootExpanded : classes.root}
      onClick={() => {
        onSelect?.();
        onToggle?.();
      }}
    >
      <Group gap='xs'>
        <IconBuilding color="var(--mantine-color-blue-5)" />
        <Text className={classes.label}>
          {label}
        </Text>
        {expanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
      </Group>
    </Card>
  );
}

export default ClientCard;

