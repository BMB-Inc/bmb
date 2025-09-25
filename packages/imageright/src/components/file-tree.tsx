import { IconFolder, IconFolderOpen, IconJpg, IconPdf, IconPng, IconBuilding, IconFile } from '@tabler/icons-react';
import { Group, type RenderTreeNodePayload, Tree, type TreeNodeData, useTree } from '@mantine/core';
import classes from '../modules/file-tree.module.css';

interface FileIconProps {
  name: string;
  isFolder: boolean;
  expanded: boolean;
}

function FileIcon({ name, isFolder, expanded }: FileIconProps) {
  // Safety check for undefined name
  if (!name || typeof name !== 'string') {
    return <IconFile size={14} />;
  }

  // Handle ImageRight specific types
  if (name.startsWith('client-')) {
    return <IconBuilding color="var(--mantine-color-blue-6)" size={14} stroke={2.5} />;
  }

  if (name.startsWith('folder-')) {
    return expanded ? (
      <IconFolderOpen color="var(--mantine-color-yellow-9)" size={14} stroke={2.5} />
    ) : (
      <IconFolder color="var(--mantine-color-yellow-9)" size={14} stroke={2.5} />
    );
  }

  if (name.startsWith('document-')) {
    return <IconFile color="var(--mantine-color-gray-6)" size={14} stroke={2.5} />;
  }

  if (name.startsWith('page-')) {
    // Determine page type by extension if available
    if (name.includes('.pdf')) {
      return <IconPdf size={14} />;
    }
    if (name.includes('.png')) {
      return <IconPng size={14} />;
    }
    if (name.includes('.jpg') || name.includes('.jpeg')) {
      return <IconJpg size={14} />;
    }
    return <IconFile size={14} />;
  }

  // Fallback for generic files
  if (isFolder) {
    return expanded ? (
      <IconFolderOpen color="var(--mantine-color-yellow-9)" size={14} stroke={2.5} />
    ) : (
      <IconFolder color="var(--mantine-color-yellow-9)" size={14} stroke={2.5} />
    );
  }

  return <IconFile size={14} />;
}

function Leaf({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) {
  return (
    <Group gap={5} {...elementProps}>
      <FileIcon name={node.value} isFolder={hasChildren} expanded={expanded} />
      <span>{node.label}</span>
    </Group>
  );
}

interface FileTreeProps {
  data: TreeNodeData[];
  onNodeExpand?: (nodeValue: string) => void;
  isLoading?: boolean;
}

export function FileTree({ data, onNodeExpand, isLoading }: FileTreeProps) {
  const tree = useTree({
    onNodeExpand: onNodeExpand
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Tree
      classNames={classes}
      selectOnClick
      clearSelectionOnOutsideClick
      data={data}
      tree={tree}
      renderNode={(payload) => <Leaf {...payload} />}
    />
  );
}