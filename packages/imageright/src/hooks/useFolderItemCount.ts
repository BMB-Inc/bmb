import { useEffect, useState } from "react";
import { getFolders, getDocuments, getPages } from "@api/index";
import { FolderTypes, DocumentTypes } from "@bmb-inc/types";
import { useImageRightConfig } from "../context/ImageRightContext";
import { checkedDocsCache } from "./useFilteredDocumentsByExtension";

type FolderItemCountParams = {
  clientId: number;
  folderId: number;
  folderTypes?: FolderTypes[] | null;
  documentTypes?: DocumentTypes[];
  /** File extensions to filter documents by (only count docs with pages matching these extensions) */
  allowedExtensions?: string[];
};

type FolderItemCount = {
  folderCount: number;
  documentCount: number;
  totalCount: number;
};

/**
 * Check if a document has any pages with allowed extensions
 * Uses shared cache from useFilteredDocumentsByExtension to avoid duplicate requests
 */
const documentHasAllowedPages = async (
  documentId: number,
  normalizedExtensions: string[],
  baseUrl?: string
): Promise<boolean> => {
  // Check shared cache first
  if (checkedDocsCache.has(documentId)) {
    return checkedDocsCache.get(documentId)!;
  }

  try {
    const pages = await getPages({ documentId }, baseUrl);
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      checkedDocsCache.set(documentId, false);
      return false;
    }
    const hasAllowed = pages.some((p: any) => {
      const ext = p?.latestImages?.imageMetadata?.[0]?.extension;
      if (!ext) return false;
      return normalizedExtensions.includes(ext.toLowerCase());
    });
    checkedDocsCache.set(documentId, hasAllowed);
    return hasAllowed;
  } catch {
    // On error, include the document (fail open)
    checkedDocsCache.set(documentId, true);
    return true;
  }
};

/**
 * Hook to fetch the count of folders and documents within a given folder.
 * When allowedExtensions is provided, only counts documents that have pages with matching extensions.
 */
export const useFolderItemCount = (params?: FolderItemCountParams) => {
  const { baseUrl } = useImageRightConfig();
  const [data, setData] = useState<FolderItemCount | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!(params?.clientId && params?.folderId);
  const normalizedExtensions = params?.allowedExtensions?.map(ext => ext.toLowerCase()) ?? [];
  const hasExtensionFilter = normalizedExtensions.length > 0;

  useEffect(() => {
    let cancelled = false;
    if (!enabled || !params) {
      setData(undefined);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchCounts = async () => {
      try {
        // Fetch both folders and documents in parallel
        const [folders, documents] = await Promise.all([
          getFolders({
            clientId: params.clientId,
            folderId: params.folderId,
            folderTypes: params.folderTypes ?? undefined,
          }, baseUrl),
          getDocuments(
            { clientId: params.clientId, folderId: params.folderId },
            params.documentTypes,
            baseUrl
          ),
        ]);

        if (cancelled) return;

        const folderCount = folders?.length ?? 0;
        let documentCount = documents?.length ?? 0;

        // If extension filter is provided, filter documents by their pages
        if (hasExtensionFilter && documents && documents.length > 0) {
          // Check shared cache first for documents we've already checked
          const uncachedDocs = documents.filter((doc: any) => !checkedDocsCache.has(doc.id));
          
          // Only fetch pages for documents not in cache
          if (uncachedDocs.length > 0) {
            await Promise.all(
              uncachedDocs.map((doc: any) => 
                documentHasAllowedPages(doc.id, normalizedExtensions, baseUrl)
              )
            );
          }
          
          // Count documents using shared cache
          documentCount = documents.filter((doc: any) => 
            checkedDocsCache.get(doc.id) === true
          ).length;
        }

        if (!cancelled) {
          setData({
            folderCount,
            documentCount,
            totalCount: folderCount + documentCount,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCounts();

    return () => {
      cancelled = true;
    };
  }, [
    params?.clientId,
    params?.folderId,
    JSON.stringify(params?.folderTypes ?? null),
    JSON.stringify(params?.documentTypes ?? null),
    JSON.stringify(normalizedExtensions),
    hasExtensionFilter,
    baseUrl,
  ]);

  return { data, isLoading, error } as const;
};
