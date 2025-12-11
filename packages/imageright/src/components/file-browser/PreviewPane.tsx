import { Stack, Divider, Title, Text, Loader, Center, Group, Tooltip, Button } from '@mantine/core';
import { IconChecks, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import DocumentPages from './DocumentPages';
import { useSelectedPages } from '@hooks/useSelectedPages';
import { usePages } from '@hooks/usePages';

type PreviewPaneProps = {
  expandedDocumentId: string | null | undefined;
};

// Helper to determine preview type from extension
const getPreviewType = (ext: string | null): 'pdf' | 'image' | 'other' => {
  if (!ext) return 'other';
  const extension = ext.toLowerCase();
  if (extension === 'pdf') return 'pdf';
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tif', 'tiff'].includes(extension))
    return 'image';
  return 'other';
};

export default function PreviewPane({ expandedDocumentId }: PreviewPaneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewExtension, setPreviewExtension] = useState<string | null>(null);
  const [previewUnavailable, setPreviewUnavailable] = useState<boolean>(false);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const { selectMany, selectedPageIds, clearSelected } = useSelectedPages();
  const { data: pages = [] } = usePages({
    documentId: expandedDocumentId ? Number(expandedDocumentId) : 0,
  });

  const previewType = getPreviewType(previewExtension);

  // Check if all pages are selected
  const allPageIds = Array.isArray(pages) ? pages.map((p: any) => p.id) : [];
  const allSelected =
    allPageIds.length > 0 && allPageIds.every((id) => selectedPageIds.includes(id));

  const handleToggleSelectAll = () => {
    if (!Array.isArray(pages) || pages.length === 0) return;

    if (allSelected) {
      // Deselect all
      clearSelected();
    } else {
      // Select all
      const allPagesWithMetadata = pages.map((p: any) => ({
        id: p.id,
        contentType: p?.latestImages?.imageMetadata?.[0]?.contentType ?? null,
        extension: p?.latestImages?.imageMetadata?.[0]?.extension ?? null,
      }));
      selectMany(allPagesWithMetadata);
    }
  };
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr 2fr',
        gap: 'var(--mantine-spacing-md)',
        height: '100%',
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          height: '100%',
          minWidth: 0,
        }}
      >
        <Divider
          labelPosition="left"
          label={
            <Group gap="xs">
              <Title order={6}>Pages{pageCount ? ` (${pageCount})` : ''}</Title>
              {expandedDocumentId && pageCount > 0 && (
                <Tooltip
                  label={allSelected ? 'Deselect all pages' : 'Select all pages'}
                  openDelay={300}
                >
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={handleToggleSelectAll}
                    color={allSelected ? 'red' : undefined}
                    leftSection={allSelected ? <IconX size={14} /> : <IconChecks size={14} />}
                  >
                    {allSelected ? 'Deselect all pages' : 'Select all pages'}
                  </Button>
                </Tooltip>
              )}
            </Group>
          }
        />
        <div style={{ overflowX: 'auto', overflowY: 'auto', minHeight: 0, minWidth: 0, flex: 1 }}>
          {expandedDocumentId ? (
            <DocumentPages
              documentId={Number(expandedDocumentId)}
              onPreviewUrlChange={(url, ext) => {
                setPreviewUrl(url);
                setPreviewExtension(ext ?? null);
              }}
              onPreviewUnavailableChange={(u) => setPreviewUnavailable(u)}
              onPreviewLoadingChange={(loading) => setPreviewLoading(loading)}
              hideHeader
              onPageCountChange={(n) => setPageCount(n)}
            />
          ) : (
            <Text c="dimmed" size="sm">
              Select a document to view pages
            </Text>
          )}
        </div>
      </div>
      <div
        style={{
          minHeight: 0,
          minWidth: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack gap={6} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
          <Divider labelPosition="left" label={<Title order={6}>Preview</Title>} />
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, overflowX: 'auto', overflowY: 'auto' }}>
            {previewLoading ? (
              <Center style={{ height: '100%' }}>
                <Stack align="center" gap="sm">
                  <Loader size="md" />
                  <Text c="dimmed" size="sm">
                    Loading preview...
                  </Text>
                </Stack>
              </Center>
            ) : previewUrl ? (
              previewType === 'pdf' ? (
                <object
                  data={previewUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  style={{ height: '100%' }}
                />
              ) : previewType === 'image' ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <Center style={{ height: '100%' }}>
                  <Stack align="center" gap="sm">
                    <Text c="dimmed" size="sm">
                      Preview not available for {previewExtension?.toUpperCase() || 'this'} files.
                    </Text>
                    <Text c="dimmed" size="xs">
                      <a
                        href={previewUrl}
                        download
                        style={{ color: 'var(--mantine-color-blue-6)' }}
                      >
                        Download file
                      </a>
                    </Text>
                  </Stack>
                </Center>
              )
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}
              >
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
