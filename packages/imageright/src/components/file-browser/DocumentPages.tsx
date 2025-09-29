import { Stack, Divider, Title, Skeleton } from '@mantine/core';
import { useBrowserNavigation } from '../../hooks/useBrowserNavigation';
import { usePages } from '@hooks/usePages';
import PageRow from './PageRow';

type DocumentPagesProps = {
  documentId: number;
};

export function DocumentPages({ documentId }: DocumentPagesProps) {
  const { data: pages = [], isLoading } = usePages({ documentId });
  const { navigateToPage, pageId } = useBrowserNavigation();

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
          selected={String(p.id) === pageId}
          onSelect={() => navigateToPage(String(p.id))}
          onDoubleClick={async () => {
            try {
              const imageMeta = p.latestImages?.imageMetadata?.[0];
              if (!imageMeta?.id) return;
              const res = await (await import('@api/images/route')).getImages(
                Number(p.id),
                Number(imageMeta.id),
                imageMeta?.version ? Number(imageMeta.version) : undefined,
              );
              const contentType = res.headers.get('content-type') || 'application/octet-stream';
              const buf = await res.arrayBuffer();
              const bytes = new Uint8Array(buf);
              console.log('getImages bytes:', { contentType, length: bytes.length });
              const event = new CustomEvent('imageright:image-bytes', { detail: { pageId: p.id, bytes, contentType } });
              window.dispatchEvent(event);
            } catch (e) {
              console.error('Failed to fetch image bytes', e);
            }
          }}
        />
      ))}
    </Stack>
  );
}

export default DocumentPages;


