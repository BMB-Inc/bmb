import { FileTreeBrowser } from './file-tree';
import { FolderTypes, DocumentTypes, FileTypes } from '@bmb-inc/types';
import { ImageRightProvider } from '../context/ImageRightContext';

export type ViewMode = 'table' | 'tree';

export type ImageRightBrowserV1Props = {
  /** Folder types to filter by */
  folderTypes?: FolderTypes[];
  /** Document types to filter by */
  documentTypes?: DocumentTypes[];
  /** Default view mode (defaults to 'tree') */
  defaultViewMode?: ViewMode;
  /** Whether to show the view mode toggle (defaults to true) */
  showViewToggle?: boolean;
  /**
   * File extensions to display (e.g., ['pdf', 'jpg', 'png']).
   * When provided, only pages with these extensions will be shown.
   * If not provided or empty, all extensions are shown.
   */
  allowedExtensions?: FileTypes[];
  /**
   * Base URL for the ImageRight API.
   * Defaults to 'https://staging.bmbinc.com/api/Imageright'
   */
  baseUrl?: string;
  /**
   * Array of document IDs that have already been imported.
   * Documents with matching IDs will be displayed with greyed-out styling.
   */
  importedDocumentIds?: string[];
  /** Default zoom level for PDF previews (clamped inside PdfPreview) */
  pdfDefaultZoom?: number;
};

/**
 * Legacy ImageRight browser (v1).
 *
 * @deprecated Prefer `ImageRightBrowser` (now backed by `ImageRightBrowser2`).
 */
export function ImageRightBrowserV1({
  folderTypes,
  documentTypes,
  defaultViewMode: _defaultViewMode = 'tree',
  showViewToggle: _showViewToggle = true,
  allowedExtensions,
  baseUrl, // Don't default here - let ImageRightProvider handle it with getBaseUrl()
  importedDocumentIds,
  pdfDefaultZoom,
}: ImageRightBrowserV1Props) {
  return (
    <ImageRightProvider baseUrl={baseUrl}>
      <FileTreeBrowser
        folderTypes={folderTypes}
        documentTypes={documentTypes}
        allowedExtensions={allowedExtensions}
        importedDocumentIds={importedDocumentIds}
        pdfDefaultZoom={pdfDefaultZoom}
      />
    </ImageRightProvider>
  );
}

export default ImageRightBrowserV1;



