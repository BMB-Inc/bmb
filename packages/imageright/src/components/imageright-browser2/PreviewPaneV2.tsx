import { Center, Divider, Loader, Stack, Text, Title } from '@mantine/core';
import EmailPreview from '../file-browser/EmailPreview';
import PdfPreview from '../file-browser/PdfPreview';
import SpreadsheetPreview from '../file-browser/SpreadsheetPreview';
import TiffPreview from '../file-browser/TiffPreview';
import WordDocPreview from '../file-browser/WordDocPreview';
import type { ActivePage } from './types';
import { usePreview } from './usePreview';

export function PreviewPaneV2({
  expandedDocumentId,
  activePage,
  pdfDefaultZoom,
}: {
  expandedDocumentId: string | null | undefined;
  activePage: ActivePage | null;
  /** Default zoom level for PDF previews (clamped inside PdfPreview) */
  pdfDefaultZoom?: number;
}) {
  const documentId = expandedDocumentId ? Number(expandedDocumentId) : null;
  const { loading, unavailable, extension, kind, data, url } = usePreview(documentId, activePage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, minWidth: 0 }}>
      <Stack gap={6} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <Divider labelPosition="left" label={<Title order={6}>Preview</Title>} />

        <div style={{ flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden', position: 'relative' }}>
          {loading ? (
            <Center style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}>
              <Stack align="center" gap="sm">
                <Loader size="md" />
                <Text c="dimmed" size="sm">
                  Loading preview...
                </Text>
              </Stack>
            </Center>
          ) : kind === 'pdf' && data ? (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <PdfPreview data={data} defaultZoom={pdfDefaultZoom} />
            </div>
          ) : kind === 'tiff' && data ? (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <TiffPreview data={data} />
            </div>
          ) : kind === 'email' && data ? (
            <div style={{ position: 'absolute', inset: 0, overflow: 'auto' }}>
              <EmailPreview data={data} extension={extension || 'eml'} />
            </div>
          ) : kind === 'spreadsheet' && data ? (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <SpreadsheetPreview data={data} extension={extension || 'xlsx'} />
            </div>
          ) : kind === 'word' && data ? (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <WordDocPreview data={data} extension={extension || 'docx'} />
            </div>
          ) : url ? (
            kind === 'image' ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'auto',
                }}
              >
                <img src={url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            ) : (
              <Center style={{ position: 'absolute', inset: 0 }}>
                <Stack align="center" gap="sm">
                  <Text c="dimmed" size="sm">
                    Preview not available for {extension?.toUpperCase() || 'this'} files.
                  </Text>
                  <Text c="dimmed" size="xs">
                    <a href={url} download style={{ color: 'var(--mantine-color-blue-6)' }}>
                      Download file
                    </a>
                  </Text>
                </Stack>
              </Center>
            )
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: 'var(--mantine-spacing-xs)',
              }}
            >
              <Text c="dimmed" size="sm" ta="left">
                {unavailable ? 'Preview not available for this file type.' : 'Select a page to preview'}
              </Text>
            </div>
          )}
        </div>
      </Stack>
    </div>
  );
}

export default PreviewPaneV2;



