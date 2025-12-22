import { useEffect, useState } from "react";
import { getFolders, getDocuments, getPages } from "@api/index";
import { FolderTypes, DocumentTypes } from "@bmb-inc/types";
import { useImageRightConfig } from "../context/ImageRightContext";

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
 */
const documentHasAllowedPages = async (
  documentId: number,
  normalizedExtensions: string[],
  baseUrl?: string
): Promise<boolean> => {
  try {
    const pages = await getPages({ documentId }, baseUrl);
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return false;
    }
    return pages.some((p: any) => {
      const ext = p?.latestImages?.imageMetadata?.[0]?.extension;
      if (!ext) return false;
      return normalizedExtensions.includes(ext.toLowerCase());
    });
  } catch {
    // On error, include the document (fail open)
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
          const filterResults = await Promise.all(
            documents.map((doc: any) => 
              documentHasAllowedPages(doc.id, normalizedExtensions, baseUrl)
            )
          );
          documentCount = filterResults.filter(Boolean).length;
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
