import { Stack, Divider, Title, Text, Loader, Center } from '@mantine/core';
import { useState } from 'react';
import DocumentPages from './DocumentPages';
import EmailPreview from './EmailPreview';
import SpreadsheetPreview from './SpreadsheetPreview';
import WordDocPreview from './WordDocPreview';
import PdfPreview from './PdfPreview';

type PreviewPaneProps = {
  expandedDocumentId: string | null | undefined;
  /** Parent folder ID for tracking which folder the pages belong to */
  folderId?: number | null;
  /** File extensions to filter pages by (e.g., ['pdf', 'jpg']) */
  allowedExtensions?: string[];
  /** Active page ID to preview (controlled externally) */
  activePageId?: number | null;
  /** Callback when active page changes (e.g., when first page is auto-selected) */
  onActivePageIdChange?: (pageId: number | null) => void;
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

export default function PreviewPane({ expandedDocumentId, folderId, allowedExtensions, activePageId, onActivePageIdChange }: PreviewPaneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<ArrayBuffer | null>(null);
  const [previewExtension, setPreviewExtension] = useState<string | null>(null);
  const [previewUnavailable, setPreviewUnavailable] = useState<boolean>(false);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  const previewType = getPreviewType(previewExtension);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        minWidth: 0,
      }}
    >
      {/* Hidden DocumentPages - handles preview loading only */}
      <div style={{ display: 'none' }}>
        {expandedDocumentId && (
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
            allowedExtensions={allowedExtensions}
            activePageId={activePageId}
            onActivePageIdChange={onActivePageIdChange}
          />
        )}
      </div>
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
            ) : previewType === 'pdf' && previewData ? (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <PdfPreview data={previewData} />
              </div>
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
            ) : previewUrl ? (
              previewType === 'image' ? (
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
  );
}
