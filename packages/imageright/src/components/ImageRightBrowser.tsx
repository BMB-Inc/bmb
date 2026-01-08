import { FileTreeBrowser } from './file-tree';
import { FolderTypes, DocumentTypes, FileTypes } from '@bmb-inc/types';
import { ImageRightProvider } from '../context/ImageRightContext';

export type ViewMode = 'table' | 'tree';

export type ImageRightBrowserProps = {
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
};

/**
 * Unified ImageRight file browser with toggle between Tree and Table views.
 * Defaults to Tree view.
 */
export function ImageRightBrowser({
  folderTypes,
  documentTypes,
  defaultViewMode = 'tree',
  showViewToggle = true,
  allowedExtensions,
  baseUrl, // Don't default here - let ImageRightProvider handle it with getBaseUrl()
  importedDocumentIds,
}: ImageRightBrowserProps) {
  return (
    <ImageRightProvider baseUrl={baseUrl}>
      <FileTreeBrowser folderTypes={folderTypes} documentTypes={documentTypes} allowedExtensions={allowedExtensions} importedDocumentIds={importedDocumentIds} />
    </ImageRightProvider>
  );
}

export default ImageRightBrowser;
