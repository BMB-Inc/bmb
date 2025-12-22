import { Stack, Divider, Title, Text, Loader, Center, Group, Tooltip, Button } from '@mantine/core';
import { IconChecks, IconX } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import DocumentPages from './DocumentPages';
import EmailPreview from './EmailPreview';
import SpreadsheetPreview from './SpreadsheetPreview';
import WordDocPreview from './WordDocPreview';
import { useSelectedPages } from '@hooks/useSelectedPages';
import { useSelectedDocuments } from '@hooks/useSelectedDocuments';
import { usePages } from '@hooks/usePages';

/** Filter pages by allowed extensions */
const filterPagesByExtension = (pages: any[], allowedExtensions?: string[]): any[] => {
  if (!allowedExtensions || allowedExtensions.length === 0) {
    return pages;
  }
  const normalizedExtensions = allowedExtensions.map(ext => ext.toLowerCase());
  return pages.filter((p: any) => {
    const ext = p?.latestImages?.imageMetadata?.[0]?.extension;
    if (!ext) return false;
    return normalizedExtensions.includes(ext.toLowerCase());
  });
};

type PreviewPaneProps = {
  expandedDocumentId: string | null | undefined;
  /** Parent folder ID for tracking which folder the pages belong to */
  folderId?: number | null;
  /** File extensions to filter pages by (e.g., ['pdf', 'jpg']) */
  allowedExtensions?: string[];
};

// Helper to determine preview type from extension
const getPreviewType = (ext: string | null): 'pdf' | 'image' | 'email' | 'spreadsheet' | 'word' | 'word-legacy' | 'other' => {
  if (!ext) return 'other';
  const extension = ext.toLowerCase();
  if (extension === 'pdf') return 'pdf';
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tif', 'tiff'].includes(extension)) return 'image';
  if (['msg', 'eml'].includes(extension)) return 'email';
  if (['xls', 'xlsx', 'xlsm', 'xlsb', 'csv'].includes(extension)) return 'spreadsheet';
  if (extension === 'docx') return 'word';
  if (extension === 'doc') return 'word-legacy';
  return 'other';
};

export default function PreviewPane({ expandedDocumentId, folderId, allowedExtensions }: PreviewPaneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<ArrayBuffer | null>(null);
  const [previewExtension, setPreviewExtension] = useState<string | null>(null);
  const [previewUnavailable, setPreviewUnavailable] = useState<boolean>(false);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const { selectMany, selectedPageIds, deselectPagesForDocument } = useSelectedPages();
  const { toggleSelected: toggleDocumentSelected } = useSelectedDocuments();
  const { data: rawPages = [] } = usePages({
    documentId: expandedDocumentId ? Number(expandedDocumentId) : 0,
  });

  // Filter pages by allowed extensions (client-side filtering after fetch)
  const pages = useMemo(
    () => filterPagesByExtension(rawPages, allowedExtensions),
    [rawPages, allowedExtensions]
  );

  const previewType = getPreviewType(previewExtension);

  // Check if all filtered pages are selected
  const allPageIds = Array.isArray(pages) ? pages.map((p: any) => p.id) : [];
  const allSelected =
    allPageIds.length > 0 && allPageIds.every((id) => selectedPageIds.includes(id));

  const handleToggleSelectAll = () => {
    if (!Array.isArray(pages) || pages.length === 0 || !expandedDocumentId) return;

    const docId = Number(expandedDocumentId);
    
    if (allSelected) {
      // Deselect all pages and document
      deselectPagesForDocument(docId);
      toggleDocumentSelected(docId, false);
    } else {
      // Select all filtered pages and document
      const allPagesWithMetadata = pages.map((p: any) => ({
        id: p.id,
        documentId: docId,
        folderId: folderId ?? null,
        imageId: p?.latestImages?.imageMetadata?.[0]?.id ?? null,
        contentType: p?.latestImages?.imageMetadata?.[0]?.contentType ?? null,
        extension: p?.latestImages?.imageMetadata?.[0]?.extension ?? null,
      }));
      selectMany(allPagesWithMetadata);
      toggleDocumentSelected(docId, true);
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
              folderId={folderId}
              onPreviewUrlChange={(url, ext) => {
                setPreviewUrl(url);
                setPreviewExtension(ext ?? null);
              }}
              onPreviewDataChange={(data, ext) => {
                setPreviewData(data);
                if (ext) setPreviewExtension(ext);
              }}
              onPreviewUnavailableChange={(u) => setPreviewUnavailable(u)}
              onPreviewLoadingChange={(loading) => setPreviewLoading(loading)}
              hideHeader
              onPageCountChange={(n) => setPageCount(n)}
              allowedExtensions={allowedExtensions}
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
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden', position: 'relative' }}>
            {previewLoading ? (
              <Center style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}>
                <Stack align="center" gap="sm">
                  <Loader size="md" />
                  <Text c="dimmed" size="sm">
                    Loading preview...
                  </Text>
                </Stack>
              </Center>
            ) : previewType === 'email' && previewData ? (
              <div style={{ position: 'absolute', inset: 0, overflow: 'auto' }}>
                <EmailPreview data={previewData} extension={previewExtension || 'eml'} />
              </div>
            ) : previewType === 'spreadsheet' && previewData ? (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <SpreadsheetPreview data={previewData} extension={previewExtension || 'xlsx'} />
              </div>
            ) : previewType === 'word' && previewData ? (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <WordDocPreview data={previewData} extension={previewExtension || 'docx'} />
              </div>
            ) : previewType === 'word-legacy' && previewUrl ? (
              <Center style={{ position: 'absolute', inset: 0 }}>
                <Stack align="center" gap="sm">
                  <Text c="dimmed" size="sm">
                    Preview not available for legacy .DOC files.
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
            ) : previewUrl ? (
              previewType === 'pdf' ? (
                <object
                  data={previewUrl}
                  type="application/pdf"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                />
              ) : previewType === 'image' ? (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <Center style={{ position: 'absolute', inset: 0 }}>
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
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 'var(--mantine-spacing-xs)' }}>
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
