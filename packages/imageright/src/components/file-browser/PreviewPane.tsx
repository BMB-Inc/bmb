import { Stack, Divider, Title, Text } from '@mantine/core';
import { useState } from 'react';
import DocumentPages from './DocumentPages';

type PreviewPaneProps = {
  expandedDocumentId: string | null | undefined;
};

export default function PreviewPane({ expandedDocumentId }: PreviewPaneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewUnavailable, setPreviewUnavailable] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr 2fr',
        gap: 'var(--mantine-spacing-md)',
        height: '100%',
        minHeight: 0
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
        <Divider labelPosition="left" label={<Title order={6}>Pages{pageCount ? ` (${pageCount})` : ''}</Title>} />
        <div style={{ overflow: 'auto', minHeight: 0, flex: 1 }}>
          {expandedDocumentId ? (
            <DocumentPages
              documentId={Number(expandedDocumentId)}
              onPreviewUrlChange={(url) => setPreviewUrl(url)}
              onPreviewUnavailableChange={(u) => setPreviewUnavailable(u)}
              hideHeader
              onPageCountChange={(n) => setPageCount(n)}
            />
          ) : (
            <Text c="dimmed" size="sm">Select a document to view pages</Text>
          )}
        </div>
      </div>
      <div style={{ minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack gap={6} style={{ flex: 1, minHeight: 0 }}>
          <Divider labelPosition="left" label={<Title order={6}>Preview</Title>} />
          <div style={{ flex: 1, minHeight: 0 }}>
            {previewUrl ? (
              <object
                data={previewUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ height: '100%' }}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <Text c="dimmed" size="sm" ta="left">
                  {previewUnavailable
                    ? 'Preview not available for this file type.'
                    : 'Select a page to preview'}
                </Text>
              </div>
            )}
          </div>
        </Stack>
      </div>
    </div>
  );
}


