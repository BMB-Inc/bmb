import { useCallback } from 'react';
import { getPages } from '@api/index';
import { useSelectedPages } from './useSelectedPages';
import { useImageRightConfig } from '../context/ImageRightContext';

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

/**
 * Hook that provides a function to fetch all pages for a document and select them.
 * Used when a document is selected (checkbox or double-click) to select all its pages.
 * Does NOT clear existing page selections - pages accumulate as documents are selected.
 * 
 * @param allowedExtensions - Optional array of file extensions to filter by (e.g., ['pdf', 'jpg'])
 */
export function useSelectAllPagesForDocument(allowedExtensions?: string[]) {
  const { baseUrl } = useImageRightConfig();
  const { selectMany } = useSelectedPages();

  const selectAllPagesForDocument = useCallback(async (documentId: number) => {
    try {
      const rawPages = await getPages({ documentId }, baseUrl);
      
      if (!rawPages || !Array.isArray(rawPages) || rawPages.length === 0) {
        return;
      }

      // Filter pages by allowed extensions
      const pages = filterPagesByExtension(rawPages, allowedExtensions);
      
      if (pages.length === 0) {
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
  }, [baseUrl, selectMany, allowedExtensions]);

  return { selectAllPagesForDocument };
}

