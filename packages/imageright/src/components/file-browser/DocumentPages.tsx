import { Stack, Divider, Title, Skeleton } from '@mantine/core';
import { usePages } from '@hooks/usePages';
import PageRow from './PageRow';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelectedPages } from '@hooks/index';
import { getPreview } from '@api/preview/route';

type DocumentPagesProps = {
  documentId: number;
  onPreviewUrlChange?: (url: string | null) => void;
  onPreviewUnavailableChange?: (unavailable: boolean) => void;
  onPreviewLoadingChange?: (loading: boolean) => void;
  hideHeader?: boolean;
  onPageCountChange?: (count: number) => void;
};

export function DocumentPages({ documentId, onPreviewUrlChange, onPreviewUnavailableChange, onPreviewLoadingChange, hideHeader, onPageCountChange }: DocumentPagesProps) {
  const { data: pages = [], isLoading } = usePages({ documentId });
  const { isSelected, toggleSelected, clearSelected } = useSelectedPages();
  const previousUrlRef = useRef<string | null>(null);
  const [activePageId, setActivePageId] = useState<number | null>(null);

  const isChecked = useCallback((id: number) => isSelected(id), [isSelected]);
  const toggleChecked = useCallback((id: number, value?: boolean) => {
    toggleSelected(id, value);
  }, [toggleSelected]);
  useEffect(() => {
    // Clear selected pages when the document changes
    clearSelected();
    // Revoke any existing preview URL on document change
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
    }
    onPreviewUrlChange?.(null);
    onPreviewUnavailableChange?.(false);
    setActivePageId(null);
  }, [documentId, clearSelected]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
        previousUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (onPageCountChange) {
      onPageCountChange(Array.isArray(pages) ? pages.length : 0);
    }
  }, [pages, onPageCountChange]);

  // Auto-select the first page when pages load
  useEffect(() => {
    if (!isLoading && Array.isArray(pages) && pages.length > 0 && activePageId === null) {
      const firstPage = pages[0] as any;
      if (firstPage?.id) {
        // Trigger the same logic as clicking on the first page
        setActivePageId(firstPage.id);
        const ext = firstPage?.latestImages?.imageMetadata?.[0]?.extension;
        const isPdf = String(ext ?? '').toLowerCase() === 'pdf';
        
        if (!isPdf) {
          onPreviewUrlChange?.(null);
          onPreviewUnavailableChange?.(true);
          onPreviewLoadingChange?.(false);
        } else {
          // Load the preview for the first page
          (async () => {
            try {
              onPreviewLoadingChange?.(true);
              const response = await getPreview({ documentId, pageIds: firstPage.id });
              const buffer = await response.arrayBuffer();
              const blob = new Blob([buffer], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              if (previousUrlRef.current) {
                URL.revokeObjectURL(previousUrlRef.current);
              }
              previousUrlRef.current = url;
              onPreviewUrlChange?.(url);
              onPreviewUnavailableChange?.(false);
            } catch (err) {
              console.error('Failed to fetch preview:', err);
            } finally {
              onPreviewLoadingChange?.(false);
            }
          })();
        }
      }
    }
  }, [isLoading, pages, activePageId, documentId]);

  if (isLoading) {
    return (
      <Stack gap={6} mt="sm">
        {!hideHeader && <Divider labelPosition="left" label={<Title order={6}>Pages</Title>} />}
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={`page-skel-${i}`} height={12} width={i % 2 === 0 ? '50%' : '35%'} radius="sm" />
        ))}
      </Stack>
    );
  }

  if (!Array.isArray(pages) || pages.length === 0) {
    return (
      <Stack gap={6} mt="sm">
        {!hideHeader && <Divider labelPosition="left" label={<Title order={6}>Pages</Title>} />}
      </Stack>
    );
  }

  return (
    <Stack gap={6} mt="sm">
      {!hideHeader && <Divider labelPosition="left" label={<Title order={6}>Pages ({pages.length})</Title>} />}
      {pages.map((p: any) => {
        const baseLabel = p.description || `Page ${p.pagenumber ?? ''}`;
        const ext = p?.latestImages?.imageMetadata?.[0]?.extension;
        const label = ext ? `${baseLabel} (${String(ext).toUpperCase()})` : baseLabel;
        return (
          <PageRow
            key={p.id}
            label={label}
            selected={activePageId === p.id || isChecked(p.id)}
            checked={isChecked(p.id)}
            onCheckedChange={(v) => toggleChecked(p.id, v)}
            onSelect={async () => {
              setActivePageId(p.id);
              const isPdf = String(ext ?? '').toLowerCase() === 'pdf';
              if (!isPdf) {
                if (previousUrlRef.current) {
                  URL.revokeObjectURL(previousUrlRef.current);
                  previousUrlRef.current = null;
                }
                onPreviewUrlChange?.(null);
                onPreviewUnavailableChange?.(true);
                onPreviewLoadingChange?.(false);
                return;
              }
              try {
                onPreviewLoadingChange?.(true);
                const response = await getPreview({ documentId, pageIds: p.id });
                const buffer = await response.arrayBuffer();
                const blob = new Blob([buffer], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                // Revoke previous URL to avoid memory leaks
                if (previousUrlRef.current) {
                  URL.revokeObjectURL(previousUrlRef.current);
                }
                previousUrlRef.current = url;
                onPreviewUrlChange?.(url);
                onPreviewUnavailableChange?.(false);
              } catch (err) {
                console.error('Failed to fetch preview:', err);
              } finally {
                onPreviewLoadingChange?.(false);
              }
            }}
            onDoubleClick={async () => {
              const currentlySelected = isChecked(p.id);
              toggleChecked(p.id, !currentlySelected);
            }}
          />
        );
      })}
    </Stack>
  );
}

export default DocumentPages;


