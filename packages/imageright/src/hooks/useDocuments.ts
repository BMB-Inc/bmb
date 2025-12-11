import { useEffect, useState } from "react";
import { getDocumentById, getDocuments } from "@api/index";
import { type GetDocumentsDto, DocumentTypes } from "@bmb-inc/types";

export const useDocuments = (params?: GetDocumentsDto, documentTypes?: DocumentTypes[]) => {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDocuments>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!params?.folderId;

  useEffect(() => {
    let cancelled = false;
    if (!enabled) {
      setData(undefined);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getDocuments(params, documentTypes)
      .then((res) => {
        if (!cancelled) {
          setData(res);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params?.clientId, params?.folderId, params?.description, JSON.stringify(documentTypes ?? null)]);

  return { data, isLoading, error } as const;
}

/** Debug hook: Fetch all documents for a client and log unique document types */
export const useAllDocumentTypes = (clientId?: number) => {
  useEffect(() => {
    if (!clientId) return;
    
    getDocuments({ clientId })
      .then((res) => {
        // Extract unique document types
        const typeMap = new Map<number, string>();
        for (const doc of res || []) {
          const id = (doc as any).documentTypeId;
          const desc = (doc as any).documentTypeDescription;
          if (id != null && !typeMap.has(id)) {
            typeMap.set(id, desc);
          }
        }
      })
      .catch((err) => {
        console.error('[useAllDocumentTypes] Error fetching documents:', err);
      });
  }, [clientId]);
}

export const useDocumentById = (id: number) => {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDocumentById>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setData(undefined);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getDocumentById(id)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, isLoading, error } as const;
}