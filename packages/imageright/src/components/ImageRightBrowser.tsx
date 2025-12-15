import { useState } from 'react';
import { Group, SegmentedControl, Stack } from '@mantine/core';
import { FolderFileBrowser } from './file-browser/ImagerightFileBrowser'; 
import { FileTreeBrowser } from './file-tree';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';
import { ImageRightProvider, DEFAULT_BASE_URL } from '../context/ImageRightContext';

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
  allowedExtensions?: string[];
  /**
   * Base URL for the ImageRight API.
   * Defaults to 'https://staging.bmbinc.com/api/imageright'
   */
  baseUrl?: string;
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
  baseUrl = DEFAULT_BASE_URL,
}: ImageRightBrowserProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);

  return (
    <ImageRightProvider baseUrl={baseUrl}>
      <Stack gap="sm">
        {showViewToggle && (
          <Group justify="flex-end">
            <SegmentedControl
              size="xs"
              value={viewMode}
              onChange={(value) => setViewMode(value as ViewMode)}
              data={[
                { label: 'Tree View', value: 'tree' },
                { label: 'Table View', value: 'table' },
              ]}
            />
          </Group>
        )}

        {viewMode === 'table' ? (
          <FolderFileBrowser folderTypes={folderTypes} documentTypes={documentTypes} allowedExtensions={allowedExtensions} />
        ) : (
          <FileTreeBrowser folderTypes={folderTypes} documentTypes={documentTypes} allowedExtensions={allowedExtensions} />
        )}
      </Stack>
    </ImageRightProvider>
  );
}

export default ImageRightBrowser;
