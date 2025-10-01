import { Stack, Divider, Title, Skeleton } from '@mantine/core';
import { useBrowserNavigation } from '../../hooks/useBrowserNavigation';
import { usePages } from '@hooks/usePages';
import PageRow from './PageRow';
import { useCallback, useEffect } from 'react';
import { useSelectedPages } from '@hooks/index';

type DocumentPagesProps = {
  documentId: number;
};

export function DocumentPages({ documentId }: DocumentPagesProps) {
  const { data: pages = [], isLoading } = usePages({ documentId });
  const { navigateToPage } = useBrowserNavigation();
  const { isSelected, toggleSelected, clearSelected } = useSelectedPages();

  const isChecked = useCallback((id: number) => isSelected(id), [isSelected]);
  const toggleChecked = useCallback((id: number, value?: boolean) => {
    toggleSelected(id, value);
  }, [toggleSelected]);
  useEffect(() => {
    // Clear selected pages when the document changes
    clearSelected();
  }, [documentId, clearSelected]);


  

  if (isLoading) {
    return (
      <Stack gap={6} mt="sm">
        <Divider labelPosition="left" label={<Title order={6}>Pages</Title>} />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={`page-skel-${i}`} height={12} width={i % 2 === 0 ? '50%' : '35%'} radius="sm" />
        ))}
      </Stack>
    );
  }

  if (!Array.isArray(pages) || pages.length === 0) {
    return null;
  }

  return (
    <Stack gap={6} mt="sm">
      <Divider labelPosition="left" label={<Title order={6}>Pages ({pages.length})</Title>} />
      {pages.map((p: any) => (
        <PageRow
          key={p.id}
          label={p.description || `Page ${p.pagenumber ?? ''}`}
          checked={isChecked(p.id)}
          onCheckedChange={(v) => toggleChecked(p.id, v)}
          onSelect={() => navigateToPage(String(p.id))}
          onDoubleClick={async () => {
            const currentlySelected = isChecked(p.id);
            toggleChecked(p.id, !currentlySelected);
          }}
        />
      ))}
    </Stack>
  );
}

export default DocumentPages;


