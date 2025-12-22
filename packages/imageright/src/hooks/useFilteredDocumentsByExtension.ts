import { useEffect, useState, useMemo } from 'react';
import { getPages } from '@api/index';
import { useImageRightConfig } from '../context/ImageRightContext';

type Document = {
  id: number;
  [key: string]: any;
};

/**
 * Hook that filters documents based on whether they contain pages with allowed extensions.
 * If no allowedExtensions are provided, returns all documents unfiltered.
 * 
 * @param documents - Array of documents to filter
 * @param allowedExtensions - Array of file extensions to filter by (e.g., ['pdf', 'jpg'])
 * @returns Filtered documents and loading state
 */
export function useFilteredDocumentsByExtension(
  documents: Document[],
  allowedExtensions?: string[]
) {
  const { baseUrl } = useImageRightConfig();
  const [filteredDocIds, setFilteredDocIds] = useState<Set<number>>(new Set());
  const [isFiltering, setIsFiltering] = useState(false);
  const [checkedDocIds, setCheckedDocIds] = useState<Set<number>>(new Set());

  // Normalize extensions for comparison
  const normalizedExtensions = useMemo(() => 
    allowedExtensions?.map(ext => ext.toLowerCase()) ?? [],
    [allowedExtensions]
  );

  const hasExtensionFilter = normalizedExtensions.length > 0;

  useEffect(() => {
    if (!hasExtensionFilter || documents.length === 0) {
      // No filtering needed - all documents pass
      setFilteredDocIds(new Set(documents.map(d => d.id)));
      setIsFiltering(false);
      return;
    }

    // Find documents we haven't checked yet
    const uncheckedDocs = documents.filter(d => !checkedDocIds.has(d.id));
    
    if (uncheckedDocs.length === 0) {
      setIsFiltering(false);
      return;
    }

    setIsFiltering(true);

    // Check each unchecked document for pages with allowed extensions
    const checkDocuments = async () => {
      const newFilteredIds = new Set(filteredDocIds);
      const newCheckedIds = new Set(checkedDocIds);

      await Promise.all(
        uncheckedDocs.map(async (doc) => {
          try {
            const pages = await getPages({ documentId: doc.id }, baseUrl);
            newCheckedIds.add(doc.id);

            if (!pages || !Array.isArray(pages) || pages.length === 0) {
              return;
            }

            // Check if any page has an allowed extension
            const hasAllowedPage = pages.some((p: any) => {
              const ext = p?.latestImages?.imageMetadata?.[0]?.extension;
              if (!ext) return false;
              return normalizedExtensions.includes(ext.toLowerCase());
            });

            if (hasAllowedPage) {
              newFilteredIds.add(doc.id);
            }
          } catch (error) {
            console.error(`Failed to fetch pages for document ${doc.id}:`, error);
            // On error, include the document (fail open)
            newCheckedIds.add(doc.id);
            newFilteredIds.add(doc.id);
          }
        })
      );

      setCheckedDocIds(newCheckedIds);
      setFilteredDocIds(newFilteredIds);
      setIsFiltering(false);
    };

    checkDocuments();
  }, [documents, normalizedExtensions, hasExtensionFilter, baseUrl, checkedDocIds, filteredDocIds]);

  // Filter documents based on checked results
  const filteredDocuments = useMemo(() => {
    if (!hasExtensionFilter) {
      return documents;
    }
    return documents.filter(d => filteredDocIds.has(d.id));
  }, [documents, filteredDocIds, hasExtensionFilter]);

  return {
    filteredDocuments,
    isFiltering,
    /** Total count of documents that pass the extension filter */
    filteredCount: filteredDocuments.length,
  };
}

