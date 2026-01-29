import { Stack, Divider, Title, Text, Loader, Center } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import EmailPreview from './EmailPreview';
import SpreadsheetPreview from './SpreadsheetPreview';
import WordDocPreview from './WordDocPreview';
import PdfPreview from './PdfPreview';
import TiffPreview from './TiffPreview';
import { getPreview } from '@api/preview/route';
import { getImages } from '@api/images/route';
import { useImageRightConfig } from '../../context/ImageRightContext';

type PreviewPaneProps = {
  expandedDocumentId: string | null | undefined;
  /** Default zoom level for PDF previews (clamped inside PdfPreview) */
  pdfDefaultZoom?: number;
  /** Active page to preview (set by tree click/auto-select) */
  activePage?: { documentId: number; pageId: number; imageId: number | null; extension: string | null } | null;
};

// Helper to determine preview type from extension
const getPreviewType = (ext: string | null): 'pdf' | 'tiff' | 'image' | 'email' | 'spreadsheet' | 'word' | 'word-legacy' | 'other' => {
  if (!ext) return 'other';
  const extension = ext.toLowerCase();
  if (extension === 'pdf') return 'pdf';
  if (['tif', 'tiff'].includes(extension)) return 'tiff';
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension)) return 'image';
  if (['msg', 'eml'].includes(extension)) return 'email';
  if (['xls', 'xlsx', 'xlsm', 'xlsb', 'csv'].includes(extension)) return 'spreadsheet';
  if (extension === 'docx') return 'word';
  if (extension === 'doc') return 'word-legacy';
  return 'other';
};

const getMimeType = (ext: string | null): string => {
  if (!ext) return 'application/octet-stream';
  const extension = ext.toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    bmp: 'image/bmp',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    webp: 'image/webp',
    msg: 'application/vnd.ms-outlook',
    eml: 'message/rfc822',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    csv: 'text/csv',
    txt: 'text/plain',
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

const isEmailType = (ext: string | null): boolean => !!ext && ['msg', 'eml'].includes(ext.toLowerCase());
const isSpreadsheetType = (ext: string | null): boolean => !!ext && ['xls', 'xlsx', 'xlsm', 'xlsb', 'csv'].includes(ext.toLowerCase());
const isWordDocType = (ext: string | null): boolean => !!ext && ext.toLowerCase() === 'docx';

type DetectedKind = 'pdf' | 'tiff' | 'image' | 'other';

function detectKindFromBytes(buffer: ArrayBuffer): DetectedKind {
  const b = new Uint8Array(buffer);
  // PDF: %PDF
  if (b.length >= 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return 'pdf';
  // TIFF: "II*\0" or "MM\0*"
  if (b.length >= 4) {
    const isII = b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2a && b[3] === 0x00;
    const isMM = b[0] === 0x4d && b[1] === 0x4d && b[2] === 0x00 && b[3] === 0x2a;
    if (isII || isMM) return 'tiff';
  }
  // PNG
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image';
  // JPEG
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image';
  // GIF
  if (b.length >= 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return 'image';
  // BMP
  if (b.length >= 2 && b[0] === 0x42 && b[1] === 0x4d) return 'image';
  // WEBP: RIFF....WEBP
  if (b.length >= 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image';
  return 'other';
}

export default function PreviewPane({ expandedDocumentId, pdfDefaultZoom, activePage }: PreviewPaneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<ArrayBuffer | null>(null);
  const [previewExtension, setPreviewExtension] = useState<string | null>(null);
  const [previewContentType, setPreviewContentType] = useState<string | null>(null);
  void previewContentType; // kept for debugging/inspection if needed
  const [previewUnavailable, setPreviewUnavailable] = useState<boolean>(false);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const { baseUrl } = useImageRightConfig();
  const lastLoadedKeyRef = useRef<string | null>(null);

  const documentId = expandedDocumentId ? Number(expandedDocumentId) : null;
  const disablePreview =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('disablePreview');
  const activePageKey = useMemo(() => {
    if (!activePage) return null;
    return [
      activePage.documentId ?? '',
      activePage.pageId ?? '',
      activePage.imageId ?? '',
      activePage.extension ?? '',
    ].join(':');
  }, [activePage?.documentId, activePage?.pageId, activePage?.imageId, activePage?.extension]);

  // Revoke object URLs automatically when they change/unmount (no refs).
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Reset preview state when the document changes.
  useEffect(() => {
    setPreviewUrl(null);
    setPreviewData(null);
    setPreviewExtension(null);
    setPreviewContentType(null);
    setPreviewUnavailable(false);
    setPreviewLoading(false);
    lastLoadedKeyRef.current = null;
  }, [documentId]);

  // Load preview bytes/url when active page changes.
  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      if (!documentId) return;
      if (!activePage) return;
      if (activePage.documentId !== documentId) return;
      if (
        activePageKey
        && activePageKey === lastLoadedKeyRef.current
        && (previewData || previewUrl)
        && !previewLoading
      ) {
        return;
      }

      const ext = activePage.extension ?? null;
      const imageId = activePage.imageId ?? null;
      const isPdf = String(ext ?? '').toLowerCase() === 'pdf';
      const pageId = activePage.pageId;

      setPreviewLoading(true);
      try {
        let response: Response;
        let mimeType: string;

        // Per API docs, /images is the endpoint intended for displaying an individual page in the UI
        // and requires BOTH pageId and imageId. Use it for *all* single-page previews (including PDFs).
        if (imageId != null) {
          response = await getImages(pageId, imageId, undefined, baseUrl, controller.signal);
          mimeType = getMimeType(ext);
        } else if (isPdf) {
          // Fallback: some PDF page records may not expose imageId; try combined-pdf for that single page.
          response = await getPreview({ documentId, pageIds: pageId }, baseUrl, controller.signal);
          mimeType = 'application/pdf';
        } else {
          throw new Error(`Missing imageId for pageId=${pageId} ext=${String(ext ?? '')}`);
        }

        const buffer = await response.arrayBuffer();
        const responseContentType = response.headers.get('content-type');

        // Determine kind from bytes first (backend may return incorrect content-type).
        const kind = detectKindFromBytes(buffer);
        const ct = (responseContentType || mimeType || '').toLowerCase();
        const isResponseImage = ct.startsWith('image/');

        setPreviewExtension(ext);
        setPreviewContentType(responseContentType || mimeType || null);

        if (kind === 'pdf' || isEmailType(ext) || isSpreadsheetType(ext) || isWordDocType(ext) || kind === 'tiff') {
          setPreviewData(buffer);
          setPreviewUrl(null);
        } else if (kind === 'image' || isResponseImage) {
          const blob = new Blob([buffer], { type: responseContentType || mimeType });
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          setPreviewData(null);
        } else {
          // Unknown/binary - offer download
          const blob = new Blob([buffer], { type: responseContentType || mimeType });
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          setPreviewData(null);
        }

        setPreviewUnavailable(false);
        if (activePageKey) {
          lastLoadedKeyRef.current = activePageKey;
        }
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return;
        console.error('Failed to fetch preview:', e);
        setPreviewUnavailable(true);
      } finally {
        setPreviewLoading(false);
      }
    };

    run();
    return () => {
      controller.abort();
    };
  }, [documentId, activePageKey, baseUrl]);

  const previewType = (() => {
    // If bytes are present, prefer signature-based detection over headers/extension.
    if (previewData) {
      const kind = detectKindFromBytes(previewData);
      if (kind === 'pdf') return 'pdf';
      if (kind === 'tiff') return 'tiff';
    }
    if (previewUrl) return 'image';
    return getPreviewType(previewExtension);
  })();

  if (disablePreview) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          height: '100%',
          minHeight: 0,
          minWidth: 0,
          padding: 'var(--mantine-spacing-xs)',
        }}
      >
        <Text c="dimmed" size="sm" ta="left">
          Preview disabled. Remove `disablePreview=1` from the URL to enable.
        </Text>
      </div>
    );
  }
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
                <PdfPreview data={previewData} defaultZoom={pdfDefaultZoom} />
              </div>
            ) : previewType === 'tiff' && previewData ? (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <TiffPreview data={previewData} />
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
                <WordDocPreview data={previewData} />
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
