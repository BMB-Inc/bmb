import { Stack, Divider, Title, Skeleton, Group, Button, Tooltip } from '@mantine/core';
import { IconChecks, IconX } from '@tabler/icons-react';
import { usePages } from '@hooks/usePages';
import PageRow from './PageRow';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useSelectedPages, useSelectedDocuments } from '@hooks/index';
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
  /** Parent folder ID for tracking which folder the pages belong to */
  folderId?: number | null;
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
  /** External control of active page for preview (when provided, overrides internal selection) */
  activePageId?: number | null;
  /** Callback when active page changes (e.g., when first page is auto-selected) */
  onActivePageIdChange?: (pageId: number | null) => void;
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

// Check if extension is a Word document type that needs client-side parsing
const isWordDocType = (ext: string | null): boolean => {
  if (!ext) return false;
  return ext.toLowerCase() === 'docx';
};

// TIFF generally can't be rendered by <img> in browsers; we decode client-side
const isTiffType = (ext: string | null): boolean => {
  if (!ext) return false;
  return ['tif', 'tiff'].includes(ext.toLowerCase());
};

export function DocumentPages({ documentId, folderId, onPreviewUrlChange, onPreviewDataChange, onPreviewUnavailableChange, onPreviewLoadingChange, hideHeader, onPageCountChange, allowedExtensions, activePageId: externalActivePageId }: DocumentPagesProps) {
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
    selectMany,
    handleSelectWithModifiers,
    setLastSelectedId,
    selectedPages,
  } = useSelectedPages();
  const { toggleSelected: toggleDocumentSelected } = useSelectedDocuments();
  const previousUrlRef = useRef<string | null>(null);
  const [internalActivePageId, setInternalActivePageId] = useState<number | null>(null);
  
  // Use external activePageId when the prop is provided (even if null), otherwise use internal state
  // This allows parent to control the active page when DocumentPages is hidden
  const activePageId = externalActivePageId !== undefined ? externalActivePageId : internalActivePageId;
  const setActivePageId = setInternalActivePageId;

  const isChecked = useCallback((id: number) => isSelected(id), [isSelected]);
  const toggleChecked = useCallback(
    (
      id: number,
      metadata: { documentId: number; folderId: number | null; imageId: number | null; contentType: number | null; extension: string | null },
      value?: boolean,
    ) => {
      const wasSelected = isSelected(id);
      toggleSelected(id, metadata, value);
      
      const isSelecting = value === true || (value === undefined && !wasSelected);
      
      if (isSelecting) {
        // Select the document when selecting a page
        toggleDocumentSelected(metadata.documentId, true);
      } else {
        // When deselecting, check if any other pages from this document remain selected
        // Note: selectedPages still has the old state, so we need to filter out the page being deselected
        const remainingPagesForDoc = selectedPages.filter(
          p => p.documentId === metadata.documentId && p.id !== id
        );
        if (remainingPagesForDoc.length === 0) {
          toggleDocumentSelected(metadata.documentId, false);
        }
      }
    },
    [toggleSelected, toggleDocumentSelected, isSelected, selectedPages],
  );
  useEffect(() => {
    // Reset preview state when the document changes (but preserve page selections in context)
    // Revoke any existing preview URL on document change
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
    }
    onPreviewUrlChange?.(null, null);
    onPreviewDataChange?.(null, null);
    onPreviewUnavailableChange?.(false);
    setInternalActivePageId(null);
  }, [documentId]);

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

  // Auto-select first page when document loads (only when DocumentPages is visible and not externally controlled)
  // When hidden (used by PreviewPane), we skip auto-select and let the parent control activePageId
  useEffect(() => {
    // Skip auto-select if this component is hidden (parent is controlling via activePageId prop)
    if (externalActivePageId !== undefined) return;
    
    if (!isLoading && Array.isArray(pages) && pages.length > 0 && internalActivePageId === null) {
      const firstPage = pages[0] as any;
      if (firstPage?.id) {
        setInternalActivePageId(firstPage.id);
        setLastSelectedId(firstPage.id);
      }
    }
  }, [isLoading, pages, internalActivePageId, externalActivePageId, setLastSelectedId]);

  // Load preview whenever activePageId changes
  useEffect(() => {
    if (!isLoading && Array.isArray(pages) && pages.length > 0 && activePageId !== null) {
      const activePage = pages.find((p: any) => p.id === activePageId);
      if (activePage) {
        const ext = activePage?.latestImages?.imageMetadata?.[0]?.extension;
        const imageId = activePage?.latestImages?.imageMetadata?.[0]?.id;
        const isPdf = String(ext ?? '').toLowerCase() === 'pdf';

        // Load the preview for the active page
        (async () => {
          try {
            onPreviewLoadingChange?.(true);
            let response: Response;
            let mimeType: string;

            if (isPdf) {
              // Use combined-pdf endpoint for PDFs
              response = await getPreview({ documentId, pageIds: activePage.id }, baseUrl);
              mimeType = 'application/pdf';
            } else {
              // Use images endpoint for all other files - pass pageId and imageId
              response = await getImages(activePage.id, imageId, undefined, baseUrl);
              mimeType = getMimeType(ext);
            }

            const buffer = await response.arrayBuffer();
            
            // For PDF, email, spreadsheet, Word, and TIFF files, pass raw data instead of blob URL
            if (isPdf || isEmailType(ext) || isSpreadsheetType(ext) || isWordDocType(ext) || isTiffType(ext)) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePageId, isLoading, pages, documentId, baseUrl]);

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
    documentId,
    folderId: folderId ?? null,
    imageId: p?.latestImages?.imageMetadata?.[0]?.id ?? null,
    contentType: p?.latestImages?.imageMetadata?.[0]?.contentType ?? null,
    extension: p?.latestImages?.imageMetadata?.[0]?.extension ?? null,
  }));

  const hasAnySelectedForThisDocument = selectedPages.some(p => p.documentId === documentId);

  return (
    <Stack gap={6} mt="sm">
      {!hideHeader && (
        <Divider
          labelPosition="left"
          label={
            <Group gap="xs">
              <Title order={6}>Pages ({pages.length})</Title>
              <Tooltip
                label={hasAnySelectedForThisDocument ? 'Deselect all pages' : 'Select all pages'}
                openDelay={300}
              >
                <Button
                  size="xs"
                  variant="subtle"
                  px={6}
                  leftSection={hasAnySelectedForThisDocument ? <IconX size={14} /> : <IconChecks size={14} />}
                  onClick={() => {
                    if (hasAnySelectedForThisDocument) {
                      // Deselect all pages for the current document
                      deselectPagesForDocument(documentId);
                      toggleDocumentSelected(documentId, false);
                    } else {
                      // Select all pages for the current document (respects allowedExtensions filtering)
                      selectMany(allPagesWithMetadata);
                      toggleDocumentSelected(documentId, true);
                    }
                  }}
                  disabled={pages.length === 0}
                >
                  {hasAnySelectedForThisDocument ? 'Deselect all' : 'Select all'}
                </Button>
              </Tooltip>
            </Group>
          }
        />
      )}
      {(() => {
        return pages.map((p: any, index: number) => {
          const pageNumber = index + 1;
          const baseLabel = p.description || `Page ${p.pagenumber ?? ''}`;
          const ext = p?.latestImages?.imageMetadata?.[0]?.extension ?? null;
          const imageId = p?.latestImages?.imageMetadata?.[0]?.id ?? null;
          const contentType = p?.latestImages?.imageMetadata?.[0]?.contentType ?? null;
          const metadata = { documentId, folderId: folderId ?? null, imageId, contentType, extension: ext };
          const label = `${pageNumber}. ${baseLabel}`;
          return (
            <PageRow
              key={p.id}
              label={label}
              extension={ext}
              active={activePageId === p.id}
              selected={isChecked(p.id)}
              checked={isChecked(p.id)}
              onCheckedChange={(v) => toggleChecked(p.id, metadata, v)}
              onSelect={async (event) => {
                const { shiftKey, ctrlKey, metaKey } = event;
                const hasModifier = shiftKey || ctrlKey || metaKey;

                if (hasModifier) {
                  const wasSelected = isSelected(p.id);
                  const isCtrlOrCmd = ctrlKey || metaKey;
                  
                  // Handle multi-selection with modifiers
                  handleSelectWithModifiers(p.id, metadata, allPagesWithMetadata, {
                    shiftKey,
                    ctrlKey,
                    metaKey,
                  });
                  
                  // Handle document selection based on modifier behavior
                  if (isCtrlOrCmd && wasSelected) {
                    // Ctrl/Cmd+click on selected page = deselect
                    // Check if any other pages from this document remain selected
                    const remainingPagesForDoc = selectedPages.filter(
                      pg => pg.documentId === documentId && pg.id !== p.id
                    );
                    if (remainingPagesForDoc.length === 0) {
                      toggleDocumentSelected(documentId, false);
                    }
                  } else {
                    // Shift+click or Ctrl/Cmd+click on unselected page = select
                    toggleDocumentSelected(documentId, true);
                  }
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
                    
                    // For PDF, email, spreadsheet, Word, and TIFF files, pass raw data instead of blob URL
                    if (isPdf || isEmailType(ext) || isSpreadsheetType(ext) || isWordDocType(ext) || isTiffType(ext)) {
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
