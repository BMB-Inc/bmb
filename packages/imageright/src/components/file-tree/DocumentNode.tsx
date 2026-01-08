import { useState, useMemo, useCallback } from 'react';
import { Group, Text, Checkbox, Loader } from '@mantine/core';
import { IconFileText, IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { usePages } from '@hooks/usePages';
import { useSelectedPages } from '@hooks/useSelectedPages';
import { useSelectedDocuments } from '@hooks/useSelectedDocuments';
import { useSelectAllPagesForDocument } from '@hooks/useSelectAllPagesForDocument';
import PageRow from '../file-browser/PageRow';
import classes from '../../modules/file-tree.module.css';

type DocumentNodeProps = {
  doc: any;
  clientId: number;
  folderId: number;
  selectedDocumentId: number | null;
  visibleDocumentIds: number[];
  onDocumentSelect?: (documentId: number, folderId: number) => void;
  onPageClick?: (pageId: number) => void;
  activePageId?: number | null;
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
    const ext = p?.latestImages?.imageMetadata?.[0]?.extension;
    if (!ext) return false;
    return normalizedExtensions.includes(ext.toLowerCase());
  });
};

export function DocumentNode({
  doc,
  clientId,
  folderId,
  selectedDocumentId,
  visibleDocumentIds,
  onDocumentSelect,
  onPageClick,
  activePageId,
  importedDocumentIds,
  allowedExtensions,
}: DocumentNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: rawPages = [], isLoading: pagesLoading } = usePages(
    isExpanded ? { documentId: doc.id } : undefined
  );

  // Filter pages by allowed extensions
  const pages = useMemo(
    () => filterPagesByExtension(rawPages, allowedExtensions),
    [rawPages, allowedExtensions]
  );

  const { 
    isSelected: isDocumentSelected, 
    toggleSelected: toggleDocumentSelected,
    handleSelectWithModifiers,
    setLastSelectedId,
  } = useSelectedDocuments();
  
  const { selectAllPagesForDocument, deselectPagesForDocument } = useSelectAllPagesForDocument(allowedExtensions);
  const { isSelected: isPageSelected, toggleSelected: togglePageSelected, handleSelectWithModifiers: handlePageSelectWithModifiers, setLastSelectedId: setLastSelectedPageId } = useSelectedPages();

  const isImported = importedDocumentIds?.includes(String(doc.id)) ?? false;
  const isSelected = selectedDocumentId === doc.id;
  
  const docName = doc.description || doc.documentTypeDescription;
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

  // Get list of visible page IDs for shift-select range
  const visiblePageIds = useMemo(() => pages.map((p: any) => p.id), [pages]);

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
              const pageNumber = index + 1;
              const baseLabel = page.description || `Page ${page.pagenumber ?? ''}`;
              const ext = page?.latestImages?.imageMetadata?.[0]?.extension ?? null;
              const imageId = page?.latestImages?.imageMetadata?.[0]?.id ?? null;
              const contentType = page?.latestImages?.imageMetadata?.[0]?.contentType ?? null;
              const metadata = { documentId: doc.id, folderId: folderId ?? null, imageId, contentType, extension: ext };
              const label = ext ? `${pageNumber}. ${baseLabel} (${String(ext).toUpperCase()})` : `${pageNumber}. ${baseLabel}`;
              
              return (
                <PageRow
                  key={page.id}
                  label={label}
                  selected={isPageSelected(page.id) || activePageId === page.id}
                  checked={isPageSelected(page.id)}
                  onCheckedChange={(checked) => {
                    togglePageSelected(page.id, metadata, checked);
                  }}
                  onSelect={(event) => {
                    const { shiftKey, ctrlKey, metaKey } = event;
                    const hasModifier = shiftKey || ctrlKey || metaKey;
                    
                    if (hasModifier) {
                      handlePageSelectWithModifiers(page.id, visiblePageIds, {
                        shiftKey,
                        ctrlKey,
                        metaKey,
                      }, metadata);
                      setLastSelectedPageId(page.id);
                    } else {
                      // Single click - ensure document is selected (don't toggle off) and trigger page preview
                      if (selectedDocumentId !== doc.id) {
                        onDocumentSelect?.(doc.id, folderId);
                      }
                      onPageClick?.(page.id);
                      setLastSelectedPageId(page.id);
                    }
                  }}
                  onDoubleClick={() => {
                    // Double click - toggle page selection (unselect if already selected)
                    const currentlySelected = isPageSelected(page.id);
                    togglePageSelected(page.id, metadata, !currentlySelected);
                    // Ensure document stays selected
                    if (selectedDocumentId !== doc.id) {
                      onDocumentSelect?.(doc.id, folderId);
                    }
                    onPageClick?.(page.id);
                    setLastSelectedPageId(page.id);
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

