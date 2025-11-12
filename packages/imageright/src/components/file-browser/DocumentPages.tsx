import { Stack, Divider, Title, Skeleton, Text } from '@mantine/core';
import { usePages } from '@hooks/usePages';
import PageRow from './PageRow';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelectedPages } from '@hooks/index';
import { getPreview } from '@api/preview/route';

type DocumentPagesProps = {
  documentId: number;
};

export function DocumentPages({ documentId }: DocumentPagesProps) {
  const { data: pages = [], isLoading } = usePages({ documentId });
  const { isSelected, toggleSelected, clearSelected } = useSelectedPages();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previousUrlRef = useRef<string | null>(null);
  const [previewUnavailable, setPreviewUnavailable] = useState<boolean>(false);

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
      setPreviewUrl(null);
    }
    setPreviewUnavailable(false);
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

  console.log(pages);

  return (
    <Stack gap={6} mt="sm">
      <Divider labelPosition="left" label={<Title order={6}>Pages ({pages.length})</Title>} />
      {pages.map((p: any) => {
        const baseLabel = p.description || `Page ${p.pagenumber ?? ''}`;
        const ext = p?.latestImages?.imageMetadata?.[0]?.extension;
        const label = ext ? `${baseLabel} (${String(ext).toUpperCase()})` : baseLabel;
        return (
          <PageRow
            key={p.id}
            label={label}
            checked={isChecked(p.id)}
            onCheckedChange={(v) => toggleChecked(p.id, v)}
            onSelect={async () => {
              const isPdf = String(ext ?? '').toLowerCase() === 'pdf';
              if (!isPdf) {
                if (previousUrlRef.current) {
                  URL.revokeObjectURL(previousUrlRef.current);
                  previousUrlRef.current = null;
                }
                setPreviewUrl(null);
                setPreviewUnavailable(true);
                return;
              }
              try {
                setPreviewUnavailable(false);
                const response = await getPreview({ documentId, pageIds: p.id });
                const buffer = await response.arrayBuffer();
                console.log('Preview bytes length:', buffer.byteLength);
                console.log('First 32 bytes:', new Uint8Array(buffer.slice(0, 32)));
                const blob = new Blob([buffer], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                // Revoke previous URL to avoid memory leaks
                if (previousUrlRef.current) {
                  URL.revokeObjectURL(previousUrlRef.current);
                }
                previousUrlRef.current = url;
                setPreviewUrl(url);
              } catch (err) {
                console.error('Failed to fetch preview:', err);
              }
            }}
            onDoubleClick={async () => {
              const currentlySelected = isChecked(p.id);
              toggleChecked(p.id, !currentlySelected);
            }}
          />
        );
      })}
      {previewUrl || previewUnavailable ? (
        <>
          <Divider labelPosition="left" label={<Title order={6}>Preview</Title>} />
          {previewUrl ? (
            <object
              data={previewUrl}
              type="application/pdf"
              width="100%"
              height="480"
            />
          ) : (
            <Text c="dimmed">Preview not available for this file type.</Text>
          )}
        </>
      ) : null}
    </Stack>
  );
}

export default DocumentPages;


