import { useCallback } from 'react';
import { getPages } from '@api/index';
import { useSelectedPages } from './useSelectedPages';
import { useImageRightConfig } from '../context/ImageRightContext';

/**
 * Hook that provides a function to fetch all pages for a document and select them.
 * Used when a document is selected (checkbox or double-click) to select all its pages.
 * Does NOT clear existing page selections - pages accumulate as documents are selected.
 */
export function useSelectAllPagesForDocument() {
  const { baseUrl } = useImageRightConfig();
  const { selectMany } = useSelectedPages();

  const selectAllPagesForDocument = useCallback(async (documentId: number) => {
    try {
      const pages = await getPages({ documentId }, baseUrl);
      
      if (!pages || !Array.isArray(pages) || pages.length === 0) {
        return;
      }

      // Add all pages from this document to the selection (accumulates with existing)
      const allPagesWithMetadata = pages.map((p: any) => ({
        id: p.id,
        documentId,
        imageId: p?.latestImages?.imageMetadata?.[0]?.id ?? null,
        contentType: p?.latestImages?.imageMetadata?.[0]?.contentType ?? null,
        extension: p?.latestImages?.imageMetadata?.[0]?.extension ?? null,
      }));
      
      selectMany(allPagesWithMetadata);
    } catch (error) {
      console.error('Failed to fetch pages for document:', error);
    }
  }, [baseUrl, selectMany]);

  return { selectAllPagesForDocument };
}

