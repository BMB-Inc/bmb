import type { CSSProperties } from 'react';

/**
 * Inline styles for the file tree browser.
 * These bundle with the JS, so they work in any project without requiring CSS imports.
 */

const baseItem: CSSProperties = {
  cursor: 'pointer',
  borderRadius: 'var(--mantine-radius-sm)',
};

const baseDocumentItem: CSSProperties = {
  cursor: 'pointer',
  borderRadius: 'var(--mantine-radius-xs)',
  padding: '2px 6px',
};

export const treeStyles = {
  root: {
    cursor: 'pointer',
  } as CSSProperties,

  rootHover: {
    cursor: 'pointer',
    backgroundColor: 'var(--mantine-color-gray-1)',
  } as CSSProperties,

  rootExpanded: {
    cursor: 'pointer',
  } as CSSProperties,

  children: {
    paddingLeft: 16,
    borderLeft: '2px solid var(--mantine-color-gray-3)',
    marginLeft: 6,
    marginTop: 6,
  } as CSSProperties,

  childItem: {
    ...baseItem,
    padding: '4px 6px',
  } as CSSProperties,

  childItemExpanded: {
    ...baseItem,
    padding: '4px 6px',
  } as CSSProperties,

  documentItem: {
    ...baseDocumentItem,
  } as CSSProperties,

  documentItemSelected: {
    ...baseDocumentItem,
    backgroundColor: 'var(--mantine-color-blue-light)',
  } as CSSProperties,

  pageItem: {
    ...baseDocumentItem,
    userSelect: 'none' as const,
  } as CSSProperties,

  pages: {
    paddingLeft: 16,
    borderLeft: '2px solid var(--mantine-color-gray-3)',
    marginLeft: 6,
    marginTop: 6,
  } as CSSProperties,
};

/**
 * Get the appropriate style for a tree item based on its state
 */
export function getItemStyle(
  kind: 'root' | 'folder' | 'document' | 'page',
  isExpanded: boolean,
  isSelected: boolean
): CSSProperties {
  if (kind === 'root') {
    return isExpanded ? treeStyles.rootExpanded : treeStyles.root;
  }
  if (kind === 'folder') {
    return isExpanded ? treeStyles.childItemExpanded : treeStyles.childItem;
  }
  if (kind === 'document') {
    return isSelected ? treeStyles.documentItemSelected : treeStyles.documentItem;
  }
  return treeStyles.pageItem;
}

