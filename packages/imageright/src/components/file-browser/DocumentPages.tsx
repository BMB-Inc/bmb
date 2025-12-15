import { Stack, Divider, Title, Skeleton, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconChecks } from '@tabler/icons-react';
import { usePages } from '@hooks/usePages';
import PageRow from './PageRow';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useSelectedPages } from '@hooks/index';
import { getPreview } from '@api/preview/route';
import { getImages } from '@api/images/route';
import { useImageRightConfig } from '../../context/ImageRightContext';

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

// Helper to get MIME type from extension
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
    txt: 'text/plain',
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

type DocumentPagesProps = {
  documentId: number;
  onPreviewUrlChange?: (url: string | null, extension?: string | null) => void;
  /** Called with raw data for email files (MSG, EML) that need client-side parsing */
  onPreviewDataChange?: (data: ArrayBuffer | null, extension?: string | null) => void;
  onPreviewUnavailableChange?: (unavailable: boolean) => void;
  onPreviewLoadingChange?: (loading: boolean) => void;
  hideHeader?: boolean;
  onPageCountChange?: (count: number) => void;
  /** 
   * File extensions to display (e.g., ['pdf', 'jpg', 'png']).
   * When provided, only pages with these extensions will be shown.
   * If not provided or empty, all extensions are shown.
   */
  allowedExtensions?: string[];
};

// Check if extension is an email type that needs client-side parsing
const isEmailType = (ext: string | null): boolean => {
  if (!ext) return false;
  return ['msg', 'eml'].includes(ext.toLowerCase());
};

// Check if extension is a spreadsheet type that needs client-side parsing
const isSpreadsheetType = (ext: string | null): boolean => {
  if (!ext) return false;
  return ['xls', 'xlsx', 'xlsm', 'xlsb', 'csv'].includes(ext.toLowerCase());
};

export function DocumentPages({ documentId, onPreviewUrlChange, onPreviewDataChange, onPreviewUnavailableChange, onPreviewLoadingChange, hideHeader, onPageCountChange, allowedExtensions }: DocumentPagesProps) {
  const { baseUrl } = useImageRightConfig();
  const { data: rawPages = [], isLoading } = usePages({ documentId });

  // Filter pages by allowed extensions (client-side filtering after fetch)
  const pages = useMemo(
    () => filterPagesByExtension(rawPages, allowedExtensions),
    [rawPages, allowedExtensions]
  );
  const {
    isSelected,
    toggleSelected,
    clearSelected,
    selectMany,
    handleSelectWithModifiers,
    setLastSelectedId,
  } = useSelectedPages();
  const previousUrlRef = useRef<string | null>(null);
  const [activePageId, setActivePageId] = useState<number | null>(null);

  const isChecked = useCallback((id: number) => isSelected(id), [isSelected]);
  const toggleChecked = useCallback(
    (
      id: number,
      metadata: { imageId: number | null; contentType: number | null; extension: string | null },
      value?: boolean,
    ) => {
      toggleSelected(id, metadata, value);
    },
    [toggleSelected],
  );
  useEffect(() => {
    // Clear selected pages when the document changes
    clearSelected();
    // Revoke any existing preview URL on document change
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
    }
    onPreviewUrlChange?.(null, null);
    onPreviewDataChange?.(null, null);
    onPreviewUnavailableChange?.(false);
    setActivePageId(null);
  }, [documentId, clearSelected]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
        previousUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (onPageCountChange) {
      onPageCountChange(Array.isArray(pages) ? pages.length : 0);
    }
  }, [pages, onPageCountChange]);

  // Auto-select the first page when pages load
  useEffect(() => {
    if (!isLoading && Array.isArray(pages) && pages.length > 0 && activePageId === null) {
      const firstPage = pages[0] as any;
      if (firstPage?.id) {
        // Trigger the same logic as clicking on the first page
        setActivePageId(firstPage.id);
        setLastSelectedId(firstPage.id); // Set anchor for shift+click
        const ext = firstPage?.latestImages?.imageMetadata?.[0]?.extension;
        const imageId = firstPage?.latestImages?.imageMetadata?.[0]?.id;
        const isPdf = String(ext ?? '').toLowerCase() === 'pdf';

        // Load the preview for the first page
        (async () => {
          try {
            onPreviewLoadingChange?.(true);
            let response: Response;
            let mimeType: string;

            if (isPdf) {
              // Use combined-pdf endpoint for PDFs
              response = await getPreview({ documentId, pageIds: firstPage.id }, baseUrl);
              mimeType = 'application/pdf';
            } else {
              // Use images endpoint for all other files - pass pageId and imageId
              response = await getImages(firstPage.id, imageId, undefined, baseUrl);
              mimeType = getMimeType(ext);
            }

            const buffer = await response.arrayBuffer();
            
            // For email and spreadsheet files, pass raw data instead of blob URL
            if (isEmailType(ext) || isSpreadsheetType(ext)) {
              onPreviewDataChange?.(buffer, ext);
              onPreviewUrlChange?.(null, ext);
            } else {
              const blob = new Blob([buffer], { type: mimeType });
              const url = URL.createObjectURL(blob);
              if (previousUrlRef.current) {
                URL.revokeObjectURL(previousUrlRef.current);
              }
              previousUrlRef.current = url;
              onPreviewUrlChange?.(url, ext);
              onPreviewDataChange?.(null, null);
            }
            onPreviewUnavailableChange?.(false);
          } catch (err) {
            console.error('Failed to fetch preview:', err);
            onPreviewUnavailableChange?.(true);
          } finally {
            onPreviewLoadingChange?.(false);
          }
        })();
      }
    }
  }, [isLoading, pages, activePageId, documentId, setLastSelectedId, baseUrl]);

  if (isLoading) {
    return (
      <Stack gap={6} mt="sm">
        {!hideHeader && <Divider labelPosition="left" label={<Title order={6}>Pages</Title>} />}
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={`page-skel-${i}`}
            height={12}
            width={i % 2 === 0 ? '50%' : '35%'}
            radius="sm"
          />
        ))}
      </Stack>
    );
  }

  if (!Array.isArray(pages) || pages.length === 0) {
    return (
      <Stack gap={6} mt="sm">
        {!hideHeader && <Divider labelPosition="left" label={<Title order={6}>Pages</Title>} />}
      </Stack>
    );
  }

  // Build array of pages with their metadata for selection tracking
  const allPagesWithMetadata = pages.map((p: any) => ({
    id: p.id,
    imageId: p?.latestImages?.imageMetadata?.[0]?.id ?? null,
    contentType: p?.latestImages?.imageMetadata?.[0]?.contentType ?? null,
    extension: p?.latestImages?.imageMetadata?.[0]?.extension ?? null,
  }));

  return (
    <Stack gap={6} mt="sm">
      {!hideHeader && (
        <Divider
          labelPosition="left"
          label={
            <Group gap="xs">
              <Title order={6}>Pages ({pages.length})</Title>
              <Tooltip label="Select all pages" openDelay={300}>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => selectMany(allPagesWithMetadata)}
                  disabled={pages.length === 0}
                >
                  <IconChecks size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
          }
        />
      )}
      {(() => {
        return pages.map((p: any) => {
          const baseLabel = p.description || `Page ${p.pagenumber ?? ''}`;
          const ext = p?.latestImages?.imageMetadata?.[0]?.extension ?? null;
          const imageId = p?.latestImages?.imageMetadata?.[0]?.id ?? null;
          const contentType = p?.latestImages?.imageMetadata?.[0]?.contentType ?? null;
          const metadata = { imageId, contentType, extension: ext };
          const label = ext ? `${baseLabel} (${String(ext).toUpperCase()})` : baseLabel;
          return (
            <PageRow
              key={p.id}
              label={label}
              selected={activePageId === p.id || isChecked(p.id)}
              checked={isChecked(p.id)}
              onCheckedChange={(v) => toggleChecked(p.id, metadata, v)}
              onSelect={async (event) => {
                const { shiftKey, ctrlKey, metaKey } = event;
                const hasModifier = shiftKey || ctrlKey || metaKey;

                if (hasModifier) {
                  // Handle multi-selection with modifiers
                  handleSelectWithModifiers(p.id, metadata, allPagesWithMetadata, {
                    shiftKey,
                    ctrlKey,
                    metaKey,
                  });
                } else {
                  // Regular click: set active page and load preview
                  setLastSelectedId(p.id);
                  setActivePageId(p.id);
                  const isPdf = String(ext ?? '').toLowerCase() === 'pdf';

                  try {
                    onPreviewLoadingChange?.(true);
                    let response: Response;
                    let mimeType: string;

                    if (isPdf) {
                      // Use combined-pdf endpoint for PDFs
                      response = await getPreview({ documentId, pageIds: p.id }, baseUrl);
                      mimeType = 'application/pdf';
                    } else {
                      // Use images endpoint for all other files - pass pageId and imageId
                      response = await getImages(p.id, imageId, undefined, baseUrl);
                      mimeType = getMimeType(ext);
                    }

                    const buffer = await response.arrayBuffer();
                    
                    // For email and spreadsheet files, pass raw data instead of blob URL
                    if (isEmailType(ext) || isSpreadsheetType(ext)) {
                      onPreviewDataChange?.(buffer, ext);
                      onPreviewUrlChange?.(null, ext);
                    } else {
                      const blob = new Blob([buffer], { type: mimeType });
                      const url = URL.createObjectURL(blob);
                      // Revoke previous URL to avoid memory leaks
                      if (previousUrlRef.current) {
                        URL.revokeObjectURL(previousUrlRef.current);
                      }
                      previousUrlRef.current = url;
                      onPreviewUrlChange?.(url, ext);
                      onPreviewDataChange?.(null, null);
                    }
                    onPreviewUnavailableChange?.(false);
                  } catch (err) {
                    console.error('Failed to fetch preview:', err);
                    onPreviewUnavailableChange?.(true);
                  } finally {
                    onPreviewLoadingChange?.(false);
                  }
                }
              }}
              onDoubleClick={async () => {
                const currentlySelected = isChecked(p.id);
                toggleChecked(p.id, metadata, !currentlySelected);
              }}
            />
          );
        });
      })()}
    </Stack>
  );
}

export default DocumentPages;
