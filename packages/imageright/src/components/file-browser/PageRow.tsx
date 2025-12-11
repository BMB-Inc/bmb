import { Checkbox, Group, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { IconFile } from '@tabler/icons-react';
import { useState } from "react";

type PageRowProps = {
  label: string;
  selected?: boolean;
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
  onSelect?: (event: React.MouseEvent) => void;
  onDoubleClick?: () => void;
}

export function PageRow({ label, selected, checked, onCheckedChange, onSelect, onDoubleClick }: PageRowProps) {
  const [hovered, setHovered] = useState(false);
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';

  // Default background should be transparent; gray only on hover; blue when selected
  const baseBg = 'transparent';
  const hoverBg = isDark ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-gray-1)';
  const selectedBg = isDark ? 'var(--mantine-color-blue-8)' : 'var(--mantine-color-blue-0)';
  const backgroundColor = selected ? selectedBg : hovered ? hoverBg : baseBg;

  return (
    <Group
      gap='xs'
      style={{
        padding: '2px 6px',
        borderRadius: 'var(--mantine-radius-xs)',
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor,
        transition: 'background-color 120ms ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        flexWrap: 'nowrap'
      }}
      wrap="nowrap"
      onClick={(e) => onSelect?.(e)}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Checkbox size="xs" checked={!!checked} onChange={(e) => onCheckedChange?.(e.currentTarget.checked)} />
      <IconFile size={14} color="var(--mantine-color-gray-7)" />
      <Tooltip label={label} openDelay={400} position="top-start" multiline maw={400}>
        <Text style={{ flex: 1, minWidth: 0 }} truncate>
          {label}
        </Text>
      </Tooltip>
    </Group>
  );
}

export default PageRow;

