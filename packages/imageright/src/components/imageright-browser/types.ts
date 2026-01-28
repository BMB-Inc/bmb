import { DocumentTypes, FileTypes, FolderTypes } from '@bmb-inc/types';

export type ActivePage = {
  documentId: number;
  pageId: number;
  imageId: number | null;
  extension: string | null;
};

export type ImageRightBrowserProps = {
  /** Folder types to filter by */
  folderTypes?: FolderTypes[];
  /** Document types to filter by */
  documentTypes?: DocumentTypes[];
  /** File extensions to filter pages by */
  allowedExtensions?: FileTypes[];
  /** Base URL for the ImageRight API */
  baseUrl?: string;
  /** Default zoom level for PDF previews (clamped inside PdfPreview) */
  pdfDefaultZoom?: number;
  /** Document IDs already imported */
  importedDocumentIds?: string[];
};



