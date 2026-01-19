import { useState, useMemo, useEffect } from 'react';
import { Group, Text, Checkbox, Loader, Tooltip, ActionIcon } from '@mantine/core';
import { IconFileText, IconChevronRight, IconChevronDown, IconChecks, IconX } from '@tabler/icons-react';
import { usePages } from '@hooks/usePages';
import { useSelectedPages } from '@hooks/useSelectedPages';
import { useSelectedDocuments } from '@hooks/useSelectedDocuments';
import { useSelectAllPagesForDocument } from '@hooks/useSelectAllPagesForDocument';
import PageRow from '../file-browser/PageRow';
import classes from '../../modules/file-tree.module.css';
import dayjs from 'dayjs';

type DocumentNodeProps = {
  doc: any;
  clientId: number;
  folderId: number;
  selectedDocumentId: number | null;
  visibleDocumentIds: number[];
  onDocumentSelect?: (documentId: number, folderId: number) => void;
  onPageClick?: (page: { documentId: number; pageId: number; imageId: number | null; extension: string | null } | null) => void;
  activePage?: { documentId: number; pageId: number; imageId: number | null; extension: string | null } | null;
  importedDocumentIds?: string[];
  allowedExtensions?: string[];
};

/** Filter pages by allowed extensions */
const filterPagesByExtension = (pages: any[], allowedExtensions?: string[]): any[] => {
  if (!allowedExtensions || allowedExtensions.length === 0) {
    return pages;
  }
  const normalizedExtensions = allowedExtensions.map(ext => ext.toLowerCase());
  return pages.filter((p: any) => {
    const ext =
      p?.extension ??
      p?.fileType ??
      p?.latestImages?.imageMetadata?.[0]?.extension;
    if (!ext) return false;
    return normalizedExtensions.includes(ext.toLowerCase());
  });
};

const getPageId = (p: any): number | null =>
  typeof p?.id === 'number' ? p.id : typeof p?.pageId === 'number' ? p.pageId : null;

export function DocumentNode({
  doc,
  folderId,
  selectedDocumentId,
  visibleDocumentIds,
  onDocumentSelect,
  onPageClick,
  activePage,
  importedDocumentIds,
  allowedExtensions,
}: DocumentNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: rawPages = [], isLoading: pagesLoading } = usePages(
    isExpanded ? { documentId: doc.id } : undefined
  );

  // Filter pages by allowed extensions
  const pages = useMemo(
    () => {
      const filtered = filterPagesByExtension(rawPages, allowedExtensions);
      // Deterministic ordering
      return [...filtered].sort((a: any, b: any) => {
        const an = (typeof a?.pageNumber === 'number' && a.pageNumber) || (typeof a?.pagenumber === 'number' && a.pagenumber) || 0;
        const bn = (typeof b?.pageNumber === 'number' && b.pageNumber) || (typeof b?.pagenumber === 'number' && b.pagenumber) || 0;
        return an - bn;
      });
    },
    [rawPages, allowedExtensions]
  );

  const { 
    isSelected: isDocumentSelected, 
    toggleSelected: toggleDocumentSelected,
    handleSelectWithModifiers,
    setLastSelectedId,
  } = useSelectedDocuments();
  
  const { selectAllPagesForDocument } = useSelectAllPagesForDocument(allowedExtensions);
  const {
    isSelected: isPageSelected,
    toggleSelected: togglePageSelected,
    handleSelectWithModifiers: handlePageSelectWithModifiers,
    setLastSelectedId: setLastSelectedPageId,
    deselectPagesForDocument,
    selectedPages,
  } = useSelectedPages();

  const isImported = importedDocumentIds?.includes(String(doc.id)) ?? false;
  const isSelected = selectedDocumentId === doc.id;
  const hasAnySelectedForThisDocument = selectedPages.some(p => p.documentId === doc.id);

  // Auto-preview first page when a document is expanded and selected.
  // Deterministic (sorted pages) and no refs: if there is no activePage for this document, set it to the first page.
  useEffect(() => {
    if (!isExpanded) return;
    if (!isSelected) return;
    if (pagesLoading) return;
    if (!pages || pages.length === 0) return;
    if (activePage?.documentId === doc.id) return;

    const first = pages[0] as any;
    const firstPageId = getPageId(first);
    if (firstPageId == null) return;

    const firstExt = first?.extension ?? first?.fileType ?? first?.latestImages?.imageMetadata?.[0]?.extension ?? null;
    const firstImageId = first?.imageId ?? first?.latestImages?.imageMetadata?.[0]?.id ?? null;
    onPageClick?.({ documentId: doc.id, pageId: firstPageId, imageId: firstImageId, extension: firstExt });
  }, [isExpanded, isSelected, pagesLoading, pages, activePage, doc.id, onPageClick]);
  
  // NOTE: PreviewPane owns "auto-select first page" now (single source of truth).
  
  const docName = `${dayjs(doc.dateLastModified).format('MM/DD/YYYY')} ${doc.documentName} - ${doc.description} (${doc.pageCount} pages)`;
    const docDisplayName = doc.documentTypeDescription && doc.documentTypeDescription !== docName
    ? `${docName} (${doc.documentTypeDescription})`
    : docName;

  // Determine the appropriate style based on imported and selected state
  const getDocumentStyle = () => {
    const style: React.CSSProperties = { userSelect: 'none' };
    if (isImported) {
      style.opacity = 0.5;
      if (isSelected) {
        style.backgroundColor = 'var(--mantine-color-blue-light)';
      } else {
        style.backgroundColor = 'var(--mantine-color-gray-1)';
      }
    } else if (isSelected) {
      style.backgroundColor = 'var(--mantine-color-blue-light)';
    }
    return style;
  };

  // Visible pages (with metadata) for shift-select range
  const visiblePagesWithMetadata = useMemo(() => {
    return pages.map((p: any) => ({
      id: getPageId(p) ?? p.id,
      documentId: doc.id,
      folderId: folderId ?? null,
      imageId: p?.imageId ?? p?.latestImages?.imageMetadata?.[0]?.id ?? null,
      contentType: p?.contentType ?? p?.latestImages?.imageMetadata?.[0]?.contentType ?? null,
      extension: p?.extension ?? p?.fileType ?? p?.latestImages?.imageMetadata?.[0]?.extension ?? null,
    }));
  }, [pages, doc.id, folderId]);

  return (
    <div>
      {/* Document row */}
      <Group
        gap="xs"
        py={3}
        px={6}
        className={classes.documentItem}
        style={getDocumentStyle()}
        onClick={(e) => {
          // Handle shift/ctrl+click for multi-select checkboxes
          if (e.shiftKey || e.ctrlKey || e.metaKey) {
            handleSelectWithModifiers(doc.id, visibleDocumentIds, {
              shiftKey: e.shiftKey,
              ctrlKey: e.ctrlKey,
              metaKey: e.metaKey,
            });
            setLastSelectedId(doc.id);
          } else {
            // Single click - toggle expand/collapse and select document
            setIsExpanded(!isExpanded);
            onDocumentSelect?.(doc.id, folderId);
            setLastSelectedId(doc.id);
          }
        }}
        onDoubleClick={() => {
          // Double-click - toggle document selection and select/deselect all pages
          const willBeSelected = !isDocumentSelected(doc.id);
          toggleDocumentSelected(doc.id, willBeSelected);
          if (willBeSelected) {
            selectAllPagesForDocument(doc.id, folderId);
          } else {
            deselectPagesForDocument(doc.id);
          }
          // Also show the document's pages in preview
          onDocumentSelect?.(doc.id, folderId);
        }}
      >
        {/* Expand/collapse chevron */}
        {pages.length > 0 ? (
          isExpanded ? (
            <IconChevronDown size={16} style={{ flexShrink: 0 }} />
          ) : (
            <IconChevronRight size={16} style={{ flexShrink: 0 }} />
          )
        ) : (
          <span style={{ width: 16, flexShrink: 0 }} />
        )}

        <Checkbox
          size="xs"
          checked={isDocumentSelected(doc.id)}
          onChange={(e) => {
            e.stopPropagation();
            const isChecked = e.currentTarget.checked;
            toggleDocumentSelected(doc.id, isChecked);
            setLastSelectedId(doc.id);
            if (isChecked) {
              selectAllPagesForDocument(doc.id, folderId);
              // Also open the document to view its pages
              onDocumentSelect?.(doc.id, folderId);
            } else {
              deselectPagesForDocument(doc.id);
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <IconFileText
          size={16}
          color={
            selectedDocumentId === doc.id
              ? 'var(--mantine-color-blue-9)'
              : 'var(--mantine-color-blue-7)'
          }
          style={{ flexShrink: 0 }}
        />
        <Text truncate style={{ minWidth: 0, flex: 1 }}>
          {docDisplayName}
        </Text>
        {isSelected && (
          <Tooltip
            label={hasAnySelectedForThisDocument ? 'Deselect all pages' : 'Select all pages'}
            openDelay={300}
          >
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={(e) => {
                e.stopPropagation();
                if (hasAnySelectedForThisDocument) {
                  deselectPagesForDocument(doc.id);
                  toggleDocumentSelected(doc.id, false);
                } else {
                  void selectAllPagesForDocument(doc.id, folderId);
                  toggleDocumentSelected(doc.id, true);
                }
              }}
            >
              {hasAnySelectedForThisDocument ? (
                <IconX size={16} color="var(--mantine-color-red-6)" />
              ) : (
                <IconChecks size={16} />
              )}
            </ActionIcon>
          </Tooltip>
        )}
        {isImported && (
          <Text c="dimmed" size="xs" fs="italic" style={{ flexShrink: 0 }}>
            Imported Already
          </Text>
        )}
      </Group>

      {/* Pages (expanded) */}
      {isExpanded && (
        <div style={{ paddingLeft: 32 }}>
          {pagesLoading ? (
            <Group gap="xs" py={3} px={6}>
              <Loader size="xs" />
              <Text size="sm" c="dimmed">Loading pages...</Text>
            </Group>
          ) : pages.length > 0 ? (
            pages.map((page: any, index: number) => {
              const pageId = getPageId(page);
              if (pageId == null) return null;
              const pageNumber = index + 1;
              const baseLabel = page.description || `Page ${page.pagenumber ?? ''}`;
              const ext = page?.extension ?? page?.fileType ?? page?.latestImages?.imageMetadata?.[0]?.extension ?? null;
              const imageId = page?.imageId ?? page?.latestImages?.imageMetadata?.[0]?.id ?? null;
              const contentType = page?.contentType ?? page?.latestImages?.imageMetadata?.[0]?.contentType ?? null;
              const metadata = { documentId: doc.id, folderId: folderId ?? null, imageId, contentType, extension: ext };
              const label = `${pageNumber}. ${baseLabel}`;
              
              return (
                <PageRow
                  key={pageId}
                  label={label}
                  extension={ext}
                  active={activePage?.documentId === doc.id && activePage?.pageId === pageId}
                  selected={isPageSelected(pageId)}
                  checked={isPageSelected(pageId)}
                  onCheckedChange={(checked) => {
                    togglePageSelected(pageId, metadata, checked);
                  }}
                  onSelect={(event) => {
                    const { shiftKey, ctrlKey, metaKey } = event;
                    const hasModifier = shiftKey || ctrlKey || metaKey;
                    
                    if (hasModifier) {
                      handlePageSelectWithModifiers(
                        pageId,
                        metadata,
                        visiblePagesWithMetadata,
                        { shiftKey, ctrlKey, metaKey }
                      );
                      setLastSelectedPageId(pageId);
                    } else {
                      // Single click - ensure document is selected (don't toggle off) and trigger page preview
                      if (selectedDocumentId !== doc.id) {
                        onDocumentSelect?.(doc.id, folderId);
                      }
                      onPageClick?.({ documentId: doc.id, pageId, imageId, extension: ext });
                      setLastSelectedPageId(pageId);
                    }
                  }}
                  onDoubleClick={() => {
                    // Double click - toggle page selection (unselect if already selected)
                    const currentlySelected = isPageSelected(pageId);
                    togglePageSelected(pageId, metadata, !currentlySelected);
                    // Ensure document stays selected
                    if (selectedDocumentId !== doc.id) {
                      onDocumentSelect?.(doc.id, folderId);
                    }
                    onPageClick?.({ documentId: doc.id, pageId, imageId, extension: ext });
                    setLastSelectedPageId(pageId);
                  }}
                />
              );
            })
          ) : (
            <Text size="sm" c="dimmed" py={3} px={6}>
              No pages available
            </Text>
          )}
        </div>
      )}
    </div>
  );
}

export default DocumentNode;

