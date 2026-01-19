import { ImageRightBrowser2 } from './imageright-browser2/ImageRightBrowser2';
import type { ImageRightBrowser2Props } from './imageright-browser2/types';

export type ViewMode = 'table' | 'tree';

export type ImageRightBrowserProps = ImageRightBrowser2Props & {
  /**
   * Legacy prop (v1). Ignored in v2.
   * @deprecated `ImageRightBrowser` is now backed by `ImageRightBrowser2`.
   */
  defaultViewMode?: ViewMode;
  /**
   * Legacy prop (v1). Ignored in v2.
   * @deprecated `ImageRightBrowser` is now backed by `ImageRightBrowser2`.
   */
  showViewToggle?: boolean;
};

/**
 * Unified ImageRight file browser with toggle between Tree and Table views.
 * Defaults to Tree view.
 *
 * **Now backed by `ImageRightBrowser2`**. (Legacy v1 is available as `ImageRightBrowserV1`.)
 */
export function ImageRightBrowser({
  defaultViewMode: _defaultViewMode,
  showViewToggle: _showViewToggle,
  ...props
}: ImageRightBrowserProps) {
  return <ImageRightBrowser2 {...props} />;
}

export default ImageRightBrowser;
