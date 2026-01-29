import { useEffect, useMemo, useState } from 'react';
import { getImages } from '@api/images/route';
import { getPreview } from '@api/preview/route';
import { useImageRightConfig } from '../context/ImageRightContext';
import type { ActivePage } from '../components/imageright-browser/types';

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
  if (
    b.length >= 12 &&
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50
  )
    return 'image';
  return 'other';
}

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

const isPdfExt = (ext: string | null) => String(ext ?? '').toLowerCase() === 'pdf';
const isEmailType = (ext: string | null): boolean => !!ext && ['msg', 'eml'].includes(ext.toLowerCase());
const isSpreadsheetType = (ext: string | null): boolean => !!ext && ['xls', 'xlsx', 'xlsm', 'xlsb', 'csv'].includes(ext.toLowerCase());
const isWordDocType = (ext: string | null): boolean => !!ext && ext.toLowerCase() === 'docx';

export type PreviewResult = {
  loading: boolean;
  unavailable: boolean;
  extension: string | null;
  kind: 'pdf' | 'tiff' | 'image' | 'email' | 'spreadsheet' | 'word' | 'other';
  data: ArrayBuffer | null;
  url: string | null;
};

export function usePreview(documentId: number | null, activePage: ActivePage | null): PreviewResult {
  const { baseUrl } = useImageRightConfig();
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [data, setData] = useState<ArrayBuffer | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [extension, setExtension] = useState<string | null>(null);
  const activePageKey = useMemo(() => {
    if (!activePage) return null;
    return [
      activePage.documentId ?? '',
      activePage.pageId ?? '',
      activePage.imageId ?? '',
      activePage.extension ?? '',
    ].join(':');
  }, [activePage?.documentId, activePage?.pageId, activePage?.imageId, activePage?.extension]);

  // revoke URLs on change/unmount
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  // reset when doc changes
  useEffect(() => {
    setLoading(false);
    setUnavailable(false);
    setData(null);
    setUrl(null);
    setExtension(null);
  }, [documentId]);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      if (!documentId) return;
      if (!activePage) return;
      if (activePage.documentId !== documentId) return;

      setLoading(true);
      setUnavailable(false);
      setExtension(activePage.extension ?? null);

      try {
        let response: Response;
        let mimeType: string;

        if (activePage.imageId != null) {
          response = await getImages(activePage.pageId, activePage.imageId, undefined, baseUrl, controller.signal);
          mimeType = getMimeType(activePage.extension);
        } else if (isPdfExt(activePage.extension)) {
          response = await getPreview({ documentId, pageIds: activePage.pageId }, baseUrl, controller.signal);
          mimeType = 'application/pdf';
        } else {
          throw new Error(`Missing imageId for pageId=${activePage.pageId}`);
        }

        const buffer = await response.arrayBuffer();
        const responseContentType = response.headers.get('content-type');
        const kind = detectKindFromBytes(buffer);

        if (kind === 'pdf' || kind === 'tiff' || isEmailType(activePage.extension) || isSpreadsheetType(activePage.extension) || isWordDocType(activePage.extension)) {
          setData(buffer);
          setUrl(null);
        } else if (kind === 'image') {
          const blob = new Blob([buffer], { type: responseContentType || mimeType });
          setUrl(URL.createObjectURL(blob));
          setData(null);
        } else {
          const blob = new Blob([buffer], { type: responseContentType || mimeType });
          setUrl(URL.createObjectURL(blob));
          setData(null);
        }
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return;
        console.error('Preview load failed:', e);
        setUnavailable(true);
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [documentId, activePageKey, baseUrl]);

  const kind = useMemo(() => {
    if (data) {
      const k = detectKindFromBytes(data);
      if (k === 'pdf') return 'pdf';
      if (k === 'tiff') return 'tiff';
    }
    if (isEmailType(extension)) return 'email';
    if (isSpreadsheetType(extension)) return 'spreadsheet';
    if (isWordDocType(extension)) return 'word';
    if (url) return 'image';
    return 'other';
  }, [data, url, extension]);

  return { loading, unavailable, extension, kind, data, url };
}

export default usePreview;

