import { Checkbox, Group, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { IconFile, IconFileTypePdf, IconFileSpreadsheet, IconMail, IconFileTypeDoc, IconPhoto, IconFileTypeTxt } from '@tabler/icons-react';
import { useState } from "react";

type PageRowProps = {
  label: string;
  extension?: string | null;
  /** True when this row corresponds to the currently previewed page */
  active?: boolean;
  /** True when this page is selected for import (checkbox/double-click) */
  selected?: boolean;
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
  onSelect?: (event: React.MouseEvent) => void;
  onDoubleClick?: () => void;
}

function getFileIcon(extension: string | null | undefined) {
  const ext = String(extension ?? '').toLowerCase();
  
  // PDF files - red
  if (ext === 'pdf') {
    return <IconFileTypePdf size={14} color="#e03131" />;
  }
  
  // Spreadsheet files - green
  if (['xlsx', 'xls', 'csv'].includes(ext)) {
    return <IconFileSpreadsheet size={14} color="#2f9e44" />;
  }
  
  // Email files - blue
  if (['eml', 'msg'].includes(ext)) {
    return <IconMail size={14} color="#1971c2" />;
  }
  
  // Word documents - blue
  if (['doc', 'docx', 'rtf'].includes(ext)) {
    return <IconFileTypeDoc size={14} color="#1971c2" />;
  }
  
  // Image files - purple
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp'].includes(ext)) {
    return <IconPhoto size={14} color="#7950f2" />;
  }
  
  // Text files - gray
  if (['txt', 'text'].includes(ext)) {
    return <IconFileTypeTxt size={14} color="#868e96" />;
  }
  
  // Default - gray file icon
  return <IconFile size={14} color="var(--mantine-color-gray-6)" />;
}

export function PageRow({ label, extension, active, selected, checked, onCheckedChange, onSelect, onDoubleClick }: PageRowProps) {
  const [hovered, setHovered] = useState(false);
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';

  // Default background should be transparent; gray only on hover; subtle when active; stronger when selected
  const baseBg = 'transparent';
  const hoverBg = isDark ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-gray-1)';
  // Active is "previewed" (not necessarily selected); make it clearly visible but not as strong as selected
  const activeBg = isDark ? 'rgba(34, 139, 230, 0.22)' : 'rgba(34, 139, 230, 0.10)'; // blue tint
  const selectedBg = isDark ? 'var(--mantine-color-blue-8)' : 'var(--mantine-color-blue-1)';
  const backgroundColor = selected ? selectedBg : active ? activeBg : hovered ? hoverBg : baseBg;
  const leftBorderColor = selected || active ? 'var(--mantine-color-blue-6)' : 'transparent';

  return (
    <Group
      gap='xs'
      style={{
        padding: '2px 6px',
        borderRadius: 'var(--mantine-radius-xs)',
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor,
        borderLeft: `3px solid ${leftBorderColor}`,
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
      {getFileIcon(extension)}
      <Tooltip label={label} openDelay={400} position="top-start" multiline maw={400}>
        <Text style={{ flex: 1, minWidth: 0 }} truncate>
          {label}
        </Text>
      </Tooltip>
    </Group>
  );
}

export default PageRow;

