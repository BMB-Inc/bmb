import { useEffect, useState, useMemo } from 'react';
import { getPages } from '@api/index';
import { useImageRightConfig } from '../context/ImageRightContext';

type Document = {
  id: number;
  [key: string]: any;
};

// Module-level cache to track which documents have been checked across all hook instances
export const checkedDocsCache = new Map<number, boolean>();

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
  const [filterResults, setFilterResults] = useState<Map<number, boolean>>(new Map());
  const [isFiltering, setIsFiltering] = useState(false);

  // Normalize extensions for comparison - create stable string key
  const extensionsKey = useMemo(() => 
    (allowedExtensions ?? []).map(ext => ext.toLowerCase()).sort().join(','),
    [allowedExtensions]
  );
  
  const normalizedExtensions = useMemo(() => 
    extensionsKey ? extensionsKey.split(',') : [],
    [extensionsKey]
  );

  const hasExtensionFilter = normalizedExtensions.length > 0;

  // Stable document IDs string for dependency comparison
  const documentIdsKey = useMemo(() => 
    documents.map(d => d.id).sort((a, b) => a - b).join(','),
    [documents]
  );

  useEffect(() => {
    // No filtering needed - skip entirely
    if (!hasExtensionFilter || documents.length === 0) {
      setIsFiltering(false);
      return;
    }

    let cancelled = false;

    // Find documents we haven't checked yet (using module-level cache)
    const uncheckedDocs = documents.filter(d => !checkedDocsCache.has(d.id));
    
    if (uncheckedDocs.length === 0) {
      // All documents already checked - just update results from cache
      const results = new Map<number, boolean>();
      documents.forEach(d => {
        results.set(d.id, checkedDocsCache.get(d.id) ?? false);
      });
      setFilterResults(results);
      setIsFiltering(false);
      return;
    }

    setIsFiltering(true);

    // Check each unchecked document for pages with allowed extensions
    const checkDocuments = async () => {
      const newResults: { docId: number; hasAllowed: boolean }[] = [];

      await Promise.all(
        uncheckedDocs.map(async (doc) => {
          try {
            const pages = await getPages({ documentId: doc.id }, baseUrl);

            if (!pages || !Array.isArray(pages) || pages.length === 0) {
              newResults.push({ docId: doc.id, hasAllowed: false });
              return;
            }

            // Check if any page has an allowed extension
            const hasAllowedPage = pages.some((p: any) => {
              const ext = p?.latestImages?.imageMetadata?.[0]?.extension;
              if (!ext) return false;
              return normalizedExtensions.includes(ext.toLowerCase());
            });

            newResults.push({ docId: doc.id, hasAllowed: hasAllowedPage });
          } catch (error) {
            console.error(`Failed to fetch pages for document ${doc.id}:`, error);
            // On error, include the document (fail open)
            newResults.push({ docId: doc.id, hasAllowed: true });
          }
        })
      );

      if (cancelled) return;

      // Update module-level cache
      newResults.forEach(r => {
        checkedDocsCache.set(r.docId, r.hasAllowed);
      });

      // Build final results map for this component's documents
      const finalResults = new Map<number, boolean>();
      documents.forEach(d => {
        finalResults.set(d.id, checkedDocsCache.get(d.id) ?? false);
      });

      setFilterResults(finalResults);
      setIsFiltering(false);
    };

    checkDocuments();

    return () => {
      cancelled = true;
    };
  }, [documentIdsKey, extensionsKey, hasExtensionFilter, baseUrl, documents, normalizedExtensions]);

  // Filter documents based on checked results
  const filteredDocuments = useMemo(() => {
    if (!hasExtensionFilter) {
      return documents;
    }
    return documents.filter(d => filterResults.get(d.id) === true);
  }, [documents, filterResults, hasExtensionFilter]);

  return {
    filteredDocuments,
    isFiltering,
    /** Total count of documents that pass the extension filter */
    filteredCount: filteredDocuments.length,
  };
}


