import { useEffect, useState } from "react";
import { getDocumentById, getDocuments, searchDocumentsByName } from "@api/index";
import { type GetDocumentsDto, DocumentTypes, type FindDocFoldersDto } from "@bmb-inc/types";
import { useImageRightConfig } from "../context/ImageRightContext";

export const useDocuments = (params?: GetDocumentsDto, documentTypes?: DocumentTypes[]) => {
  const { baseUrl } = useImageRightConfig();
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
    getDocuments(params, documentTypes, baseUrl)
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
  }, [params?.clientId, params?.folderId, params?.description, JSON.stringify(documentTypes ?? null), baseUrl]);

  return { data, isLoading, error } as const;
}


export const useDocumentsByName = (params?: FindDocFoldersDto) => {
  const { baseUrl } = useImageRightConfig();
  const [data, setData] = useState<Awaited<ReturnType<typeof searchDocumentsByName>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const description = params?.description?.trim();
  const enabled = !!description;

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
    searchDocumentsByName({ ...params, description }, baseUrl)
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
  }, [description, params?.limit, params?.drawerId, params?.fileId, params?.parentId, params?.offset, baseUrl]);

  return { data, isLoading, error } as const;
}

/** Debug hook: Fetch all documents for a client and log unique document types */
export const useAllDocumentTypes = (clientId?: number) => {
  const { baseUrl } = useImageRightConfig();
  
  useEffect(() => {
    if (!clientId) return;
    
    getDocuments({ clientId }, undefined, baseUrl)
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
  }, [clientId, baseUrl]);
}

export const useDocumentById = (id: number) => {
  const { baseUrl } = useImageRightConfig();
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
    getDocumentById(id, baseUrl)
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
  }, [id, baseUrl]);

  return { data, isLoading, error } as const;
}
